"use client";

import SmoothScroll from "./SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";
import PointerMotionInit from "@/components/ui/PointerMotionInit";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <PointerMotionInit />
      <CustomCursor />
      {children}
    </SmoothScroll>
  );
}
