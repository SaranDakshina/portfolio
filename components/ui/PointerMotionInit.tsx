"use client";

import { useEffect } from "react";
import { initPointerMotion, destroyPointerMotion } from "@/lib/pointer-motion";

export default function PointerMotionInit() {
  useEffect(() => {
    initPointerMotion();
    return () => destroyPointerMotion();
  }, []);

  return null;
}
