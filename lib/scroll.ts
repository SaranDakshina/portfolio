import type Lenis from "lenis";

let lenisInstance: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenisInstance = instance;
}

export function getLenis() {
  return lenisInstance;
}

function getScrollPaddingTop() {
  const value = getComputedStyle(document.documentElement).scrollPaddingTop;
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function scrollElementToTop(element: Element) {
  const top = element.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top, behavior: "instant" });
}

export function scrollToHash(hash: string) {
  if (hash) {
    const target = document.querySelector(hash);
    if (!target) return;

    if (lenisInstance) {
      lenisInstance.resize();
      // Lenis subtracts html scroll-padding-top automatically; add it back so
      // the section lands flush with the viewport top on all screen sizes.
      lenisInstance.scrollTo(target as HTMLElement, {
        offset: getScrollPaddingTop(),
        lock: true,
        force: true,
      });
      return;
    }

    scrollElementToTop(target);
    return;
  }

  if (lenisInstance) {
    lenisInstance.scrollTo(0, { immediate: true });
    return;
  }

  window.scrollTo(0, 0);
}
