"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { physicsIcons, playgroundIconSize, skillIconPng } from "@/lib/icons";
import { SkillsStaticGrid } from "@/components/sections/Skills";
import MoonPlaygroundBackground from "@/components/ui/MoonPlaygroundBackground";

interface Body {
  id: string;
  radius: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  icon: (typeof physicsIcons)[0];
}

const DEFAULT_GRAVITY = 0;
const GRAVITY_MIN = 0;
const GRAVITY_MAX = 0.25;
const DAMPING = 0.92;
const FRICTION = 0.9992;
const PLAYGROUND_HEIGHT_MOBILE = 360;
const PLAYGROUND_HEIGHT_DESKTOP = 520;

function playgroundHeightForViewport(isDesktop: boolean): number {
  return isDesktop ? PLAYGROUND_HEIGHT_DESKTOP : PLAYGROUND_HEIGHT_MOBILE;
}

function gravityLabel(value: number): string {
  if (value === 0) return "Zero G";
  if (value < 0.05) return "Moon";
  return "Earth";
}

function formatGravity(value: number): string {
  return `${value.toFixed(2)}G`;
}

interface GravityControlProps {
  variant: "mobile" | "desktop";
  gravity: number;
  label: string;
  onGravityChange: (value: number) => void;
  onPointerDown: (e: React.MouseEvent | React.TouchEvent) => void;
}

function GravityControl({
  variant,
  gravity,
  label,
  onGravityChange,
  onPointerDown,
}: GravityControlProps) {
  const sliderId = variant === "mobile" ? "gravity-slider-mobile" : "gravity-slider-desktop";
  const variantClasses =
    variant === "mobile"
      ? "md:hidden w-full bg-[var(--color-canvas)]"
      : "hidden md:block absolute top-4 left-4 z-20 w-64 bg-[color-mix(in_oklab,var(--color-canvas)_92%,transparent)] backdrop-blur-sm";

  return (
    <div
      className={`pointer-events-auto rounded-sm border border-[var(--color-grey-border)] px-3 py-2.5 cursor-default ${variantClasses}`}
      onMouseDown={onPointerDown}
      onTouchStart={onPointerDown}
    >
      <div className="flex items-baseline justify-between gap-2 mb-2">
        <label htmlFor={sliderId} className="text-xs font-medium text-[var(--color-ink)]">
          Gravity
        </label>
        <span className="text-xs text-[var(--color-grey)] tabular-nums">
          {label} · {formatGravity(gravity)}
        </span>
      </div>
      <input
        id={sliderId}
        type="range"
        min={GRAVITY_MIN}
        max={GRAVITY_MAX}
        step={0.005}
        value={gravity}
        onChange={(e) => onGravityChange(parseFloat(e.target.value))}
        aria-valuemin={GRAVITY_MIN}
        aria-valuemax={GRAVITY_MAX}
        aria-valuenow={gravity}
        aria-valuetext={`${label}, ${formatGravity(gravity)}`}
        className="gravity-slider w-full h-1.5 cursor-pointer"
      />
      <div className="flex justify-between mt-1.5 text-[10px] text-[var(--color-grey)]">
        <span>Zero G</span>
        <span>Moon</span>
        <span>Earth</span>
      </div>
    </div>
  );
}

export default function SkillsPlayground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bodiesRef = useRef<Body[]>([]);
  const iconRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const gravityRef = useRef(DEFAULT_GRAVITY);
  const dragRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const lastPointer = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const rafRef = useRef(0);
  const playgroundHeightRef = useRef(PLAYGROUND_HEIGHT_MOBILE);
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [gravity, setGravity] = useState(DEFAULT_GRAVITY);
  const [isDesktop, setIsDesktop] = useState(false);
  const [playgroundHeight, setPlaygroundHeight] = useState(PLAYGROUND_HEIGHT_MOBILE);
  const isDesktopRef = useRef(false);
  const activeRef = useRef(false);

  const setIconRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) iconRefs.current.set(id, el);
    else iconRefs.current.delete(id);
  }, []);

  function onGravityChange(value: number) {
    gravityRef.current = value;
    setGravity(value);
  }

  function stopControlPropagation(e: React.MouseEvent | React.TouchEvent) {
    e.stopPropagation();
  }

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(prefersReduced);
    if (prefersReduced) return;

    setMounted(true);

    const container = containerRef.current;
    if (!container) return;

    const el = container;

    const mq = window.matchMedia("(min-width: 768px)");

    function updateDom() {
      for (const b of bodiesRef.current) {
        const node = iconRefs.current.get(b.id);
        if (!node) continue;
        const size = playgroundIconSize(b.icon.size, isDesktopRef.current);
        node.style.width = `${size}px`;
        node.style.height = `${size}px`;
        node.style.transform = `translate3d(${b.x - size / 2}px, ${b.y - size / 2}px, 0)`;
      }
    }

    function syncBodySizes() {
      const W = el.clientWidth;
      const H = playgroundHeightRef.current;
      for (const b of bodiesRef.current) {
        const diameter = playgroundIconSize(b.icon.size, isDesktopRef.current);
        b.radius = diameter / 2;
        b.x = Math.min(Math.max(b.x, b.radius), W - b.radius);
        b.y = Math.min(Math.max(b.y, b.radius), H - b.radius);
      }
      updateDom();
    }

    function syncViewport() {
      isDesktopRef.current = mq.matches;
      setIsDesktop(mq.matches);
      const H = playgroundHeightForViewport(mq.matches);
      playgroundHeightRef.current = H;
      setPlaygroundHeight(H);
    }

    function onViewportChange() {
      syncViewport();
      syncBodySizes();
    }

    syncViewport();

    const W = el.clientWidth;
    const H = playgroundHeightRef.current;

    bodiesRef.current = physicsIcons.map((icon) => {
      const diameter = playgroundIconSize(icon.size, isDesktopRef.current);
      const radius = diameter / 2;
      return {
        id: icon.id,
        radius,
        x: radius + Math.random() * (W - 2 * radius),
        y: radius + Math.random() * (H - 2 * radius),
        vx: (Math.random() - 0.5) * 1.0,
        vy: (Math.random() - 0.5) * 1.0,
        icon,
      };
    });

    mq.addEventListener("change", onViewportChange);

    updateDom();

    const observer = new IntersectionObserver(
      ([entry]) => {
        activeRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(el);

    function resolveCollisions() {
      const bodies = bodiesRef.current;
      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          const a = bodies[i];
          const b = bodies[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy);
          const minDist = a.radius + b.radius;
          if (dist < minDist && dist > 0) {
            const nx = dx / dist;
            const ny = dy / dist;
            const overlap = minDist - dist;
            a.x -= nx * overlap * 0.5;
            a.y -= ny * overlap * 0.5;
            b.x += nx * overlap * 0.5;
            b.y += ny * overlap * 0.5;
            const dvx = b.vx - a.vx;
            const dvy = b.vy - a.vy;
            const impulse = (dvx * nx + dvy * ny) * 0.5;
            a.vx += impulse * nx;
            a.vy += impulse * ny;
            b.vx -= impulse * nx;
            b.vy -= impulse * ny;
          }
        }
      }
    }

    function step() {
      if (!activeRef.current) {
        rafRef.current = requestAnimationFrame(step);
        return;
      }

      const bodies = bodiesRef.current;
      const g = gravityRef.current;
      const W = el.clientWidth;
      const H = playgroundHeightRef.current;

      for (const b of bodies) {
        if (dragRef.current?.id !== b.id) {
          b.vy += g;
          b.vx *= FRICTION;
          b.vy *= FRICTION;
          b.x += b.vx;
          b.y += b.vy;

          if (g < 0.02 && Math.hypot(b.vx, b.vy) < 0.15) {
            b.vx += (Math.random() - 0.5) * 0.025;
            b.vy += (Math.random() - 0.5) * 0.025;
          }
        }

        if (b.y + b.radius > H) {
          b.y = H - b.radius;
          b.vy *= -DAMPING;
          b.vx *= 0.96;
        }
        if (b.y - b.radius < 0) {
          b.y = b.radius;
          b.vy *= -DAMPING;
        }
        if (b.x - b.radius < 0) {
          b.x = b.radius;
          b.vx *= -DAMPING;
        }
        if (b.x + b.radius > W) {
          b.x = W - b.radius;
          b.vx *= -DAMPING;
        }
      }

      resolveCollisions();
      updateDom();
      rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);

    function getPos(e: MouseEvent | TouchEvent) {
      const r = el.getBoundingClientRect();
      if ("touches" in e) {
        return { x: e.touches[0].clientX - r.left, y: e.touches[0].clientY - r.top };
      }
      return { x: (e as MouseEvent).clientX - r.left, y: (e as MouseEvent).clientY - r.top };
    }

    function hitTest(x: number, y: number) {
      for (let i = bodiesRef.current.length - 1; i >= 0; i--) {
        const b = bodiesRef.current[i];
        if (Math.hypot(x - b.x, y - b.y) <= b.radius) return b;
      }
      return null;
    }

    function onDown(e: MouseEvent | TouchEvent) {
      const { x, y } = getPos(e);
      const hit = hitTest(x, y);
      if (hit) {
        dragRef.current = { id: hit.id, offsetX: x - hit.x, offsetY: y - hit.y };
        lastPointer.current = { x, y, vx: 0, vy: 0 };
      }
    }

    function onMove(e: MouseEvent | TouchEvent) {
      if (!dragRef.current) return;
      e.preventDefault();
      const { x, y } = getPos(e);
      const body = bodiesRef.current.find((b) => b.id === dragRef.current!.id);
      if (body) {
        lastPointer.current.vx = x - lastPointer.current.x;
        lastPointer.current.vy = y - lastPointer.current.y;
        lastPointer.current.x = x;
        lastPointer.current.y = y;
        body.x = x - dragRef.current.offsetX;
        body.y = y - dragRef.current.offsetY;
        const node = iconRefs.current.get(body.id);
        if (node) {
          const size = playgroundIconSize(body.icon.size, isDesktopRef.current);
          node.style.transform = `translate3d(${body.x - size / 2}px, ${body.y - size / 2}px, 0)`;
        }
      }
    }

    function onUp() {
      if (!dragRef.current) return;
      const body = bodiesRef.current.find((b) => b.id === dragRef.current!.id);
      if (body) {
        body.vx = lastPointer.current.vx * 1.4;
        body.vy = lastPointer.current.vy * 1.4;
      }
      dragRef.current = null;
    }

    el.addEventListener("mousedown", onDown);
    el.addEventListener("touchstart", onDown, { passive: false });
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);

    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
      mq.removeEventListener("change", onViewportChange);
      el.removeEventListener("mousedown", onDown);
      el.removeEventListener("touchstart", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  if (reducedMotion) {
    return <SkillsStaticGrid />;
  }

  const label = gravityLabel(gravity);

  return (
    <div className="flex flex-col gap-3">
      <GravityControl
        variant="mobile"
        gravity={gravity}
        label={label}
        onGravityChange={onGravityChange}
        onPointerDown={stopControlPropagation}
      />

      <div
        ref={containerRef}
        className="relative w-full rounded-sm bg-[var(--color-canvas)] overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ height: playgroundHeight }}
        aria-label="Interactive skills playground on the moon — drag the tech icons and adjust gravity"
      >
        <MoonPlaygroundBackground />
        {!mounted && (
          <div className="absolute inset-0 z-10 flex items-center justify-center p-8">
            <SkillsStaticGrid />
          </div>
        )}

        <GravityControl
          variant="desktop"
          gravity={gravity}
          label={label}
          onGravityChange={onGravityChange}
          onPointerDown={stopControlPropagation}
        />

        {physicsIcons.map((icon) => {
          const size = playgroundIconSize(icon.size, isDesktop);
          return (
            <div
              key={icon.id}
              ref={(el) => setIconRef(icon.id, el)}
              className="absolute top-0 left-0 will-change-transform pointer-events-none"
              style={{ width: size, height: size }}
            >
              <img
                src={skillIconPng(icon.id)}
                alt={icon.label}
                width={size}
                height={size}
                draggable={false}
                className="w-full h-full object-contain"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
