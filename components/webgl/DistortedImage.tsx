"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { assetPath } from "@/lib/asset-path";

interface DistortedImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  aspectClass?: string;
  objectFit?: "cover" | "contain" | "height";
  imageWidth?: number;
  imageHeight?: number;
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  #include <common>

  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uTime;
  uniform float uFitMode;
  uniform float uPlaneAspect;
  uniform float uTextureAspect;
  varying vec2 vUv;

  vec2 fitUv(vec2 uv) {
    float ratio = uPlaneAspect / uTextureAspect;
    vec2 scale = vec2(1.0);

    if (uFitMode < 0.5) {
      return uv;
    }

    if (uFitMode > 1.5) {
      if (ratio > 1.0) scale.x = 1.0 / ratio;
      else scale.y = ratio;
    } else {
      if (ratio > 1.0) scale.y = 1.0 / ratio;
      else scale.x = ratio;
    }

    return (uv - 0.5) / scale + 0.5;
  }

  void main() {
    vec2 uv = fitUv(vUv);
    vec2 m = fitUv(uMouse);
    float dist = distance(uv, m);
    float wave = sin(dist * 18.0 - uTime * 2.0) * 0.025 * uHover;
    uv += normalize(uv - m + 0.001) * wave;
    gl_FragColor = texture2D(uTexture, uv);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const FIT_MODE = { height: 0, cover: 1, contain: 2 } as const;

export default function DistortedImage({
  src,
  alt,
  className = "",
  sizes = "100vw",
  priority = false,
  aspectClass = "aspect-[4/3]",
  objectFit = "cover",
  imageWidth,
  imageHeight,
}: DistortedImageProps) {
  const resolvedSrc = assetPath(src);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [useFallback, setUseFallback] = useState(true);
  const [visible, setVisible] = useState(false);
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(
    imageWidth && imageHeight ? { w: imageWidth, h: imageHeight } : null
  );

  const isHeightFit = objectFit === "height";

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let disposed = false;
    let rafId = 0;
    let renderer: import("three").WebGLRenderer | null = null;
    let cleanup: (() => void) | undefined;

    async function init() {
      const THREE = await import("three");
      if (disposed) return;

      const rect = container!.getBoundingClientRect();
      const width = Math.max(rect.width, 1);
      const height = Math.max(rect.height, 1);

      renderer = new THREE.WebGLRenderer({
        canvas: canvas!,
        antialias: true,
        alpha: true,
      });
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.NoToneMapping;

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
      camera.position.z = 1;

      function startWithImage(imgEl: HTMLImageElement) {
        if (disposed) return;

        const texture = new THREE.Texture(imgEl);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.needsUpdate = true;

        const texW = imgEl.naturalWidth || imageWidth || 1;
        const texH = imgEl.naturalHeight || imageHeight || 1;
        setNaturalSize({ w: texW, h: texH });

        const uniforms = {
          uTexture: { value: texture },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
          uHover: { value: 0 },
          uTime: { value: 0 },
          uFitMode: { value: FIT_MODE[objectFit] },
          uPlaneAspect: { value: width / height },
          uTextureAspect: { value: texW / texH },
        };

        const material = new THREE.ShaderMaterial({
          uniforms,
          vertexShader,
          fragmentShader,
          toneMapped: false,
        });

        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        setUseFallback(false);

        let hover = 0;
        let time = 0;

        function onMove(e: MouseEvent) {
          const r = container!.getBoundingClientRect();
          uniforms.uMouse.value.set(
            (e.clientX - r.left) / r.width,
            1 - (e.clientY - r.top) / r.height
          );
          hover = 1;
        }

        function onLeave() {
          hover = 0;
        }

        container!.addEventListener("mousemove", onMove);
        container!.addEventListener("mouseleave", onLeave);

        function render() {
          if (disposed) return;
          time += 0.016;
          uniforms.uTime.value = time;
          uniforms.uHover.value += (hover - uniforms.uHover.value) * 0.08;
          renderer!.render(scene, camera);
          rafId = requestAnimationFrame(render);
        }
        render();

        const onResize = () => {
          const r = container!.getBoundingClientRect();
          const w = Math.max(r.width, 1);
          const h = Math.max(r.height, 1);
          renderer!.setSize(w, h, false);
          uniforms.uPlaneAspect.value = w / h;
        };
        window.addEventListener("resize", onResize);

        cleanup = () => {
          container!.removeEventListener("mousemove", onMove);
          container!.removeEventListener("mouseleave", onLeave);
          window.removeEventListener("resize", onResize);
          geometry.dispose();
          material.dispose();
          texture.dispose();
        };
      }

      const imgEl = container!.querySelector("img");
      if (!imgEl) return;

      if (imgEl.complete && imgEl.naturalWidth > 0) {
        startWithImage(imgEl);
        return;
      }

      function onImgLoad() {
        if (!imgEl) return;
        imgEl.removeEventListener("load", onImgLoad);
        startWithImage(imgEl);
      }

      imgEl.addEventListener("load", onImgLoad);
      cleanup = () => imgEl?.removeEventListener("load", onImgLoad);
    }

    init();

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      cleanup?.();
      renderer?.dispose();
    };
  }, [visible, src, objectFit, imageWidth, imageHeight]);

  const containerBg = isHeightFit ? "bg-transparent" : "bg-[var(--color-void-surface)]";
  const containerOverflow = isHeightFit ? "overflow-visible" : "overflow-hidden";
  const containerSize = isHeightFit ? "h-full w-auto max-w-none" : aspectClass;
  const containerStyle =
    isHeightFit && naturalSize
      ? { aspectRatio: `${naturalSize.w} / ${naturalSize.h}` }
      : undefined;

  const heightFitImageClass = "block h-full w-auto max-w-none";

  function handleNaturalSize(img: HTMLImageElement) {
    if (img.naturalWidth > 0 && img.naturalHeight > 0) {
      setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
    }
  }

  return (
    <div
      ref={containerRef}
      className={`relative ${containerOverflow} ${containerBg} ${containerSize} ${className}`}
      style={containerStyle}
      data-cursor
    >
      {useFallback &&
        (isHeightFit ? (
          imageWidth && imageHeight ? (
            <Image
              src={resolvedSrc}
              alt={alt}
              width={imageWidth}
              height={imageHeight}
              priority={priority}
              unoptimized
              className={heightFitImageClass}
              sizes={sizes}
              onLoad={(e) => handleNaturalSize(e.currentTarget)}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={resolvedSrc}
              alt={alt}
              className={heightFitImageClass}
              onLoad={(e) => handleNaturalSize(e.currentTarget)}
            />
          )
        ) : (
          <Image
            src={resolvedSrc}
            alt={alt}
            fill
            priority={priority}
            unoptimized
            className={objectFit === "contain" ? "object-contain" : "object-cover"}
            sizes={sizes}
          />
        ))}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full ${useFallback ? "opacity-0" : "opacity-100"}`}
        aria-hidden={useFallback}
      />
      {useFallback && <span className="sr-only">{alt}</span>}
    </div>
  );
}
