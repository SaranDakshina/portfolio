import { isCustomCursorEnabled } from "@/lib/custom-cursor";

type PointerSubscriber = (x: number, y: number, vx: number, vy: number) => void;

let x = 0;
let y = 0;
let vx = 0;
let vy = 0;
let prevX = 0;
let prevY = 0;
let initialized = false;
let listenerCount = 0;

const subscribers = new Set<PointerSubscriber>();

function isMotionEnabled(): boolean {
  return isCustomCursorEnabled();
}

function onMove(e: MouseEvent) {
  prevX = x;
  prevY = y;
  x = e.clientX;
  y = e.clientY;
  vx = x - prevX;
  vy = y - prevY;
  subscribers.forEach((fn) => fn(x, y, vx, vy));
}

export function initPointerMotion(): void {
  if (!isMotionEnabled() || initialized) return;
  window.addEventListener("mousemove", onMove, { passive: true });
  initialized = true;
}

export function destroyPointerMotion(): void {
  if (!initialized) return;
  window.removeEventListener("mousemove", onMove);
  initialized = false;
  x = 0;
  y = 0;
  vx = 0;
  vy = 0;
  prevX = 0;
  prevY = 0;
}

export function subscribePointer(fn: PointerSubscriber): () => void {
  listenerCount += 1;
  if (listenerCount === 1) initPointerMotion();
  subscribers.add(fn);
  fn(x, y, vx, vy);
  return () => {
    subscribers.delete(fn);
    listenerCount -= 1;
    if (listenerCount <= 0) {
      listenerCount = 0;
      destroyPointerMotion();
    }
  };
}

export function getPointer(): { x: number; y: number; vx: number; vy: number } {
  return { x, y, vx, vy };
}
