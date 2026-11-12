"use client";

import { useRef, type ReactNode } from "react";
import type { LiquidOpts } from "./glass";
import { useLiquidGlass } from "./useLiquidGlass";

// A div that becomes liquid glass once the page loads. Give it the "glass"
// class too: that is the frosted look it keeps where liquid glass is off.
export function LiquidPanel({ className = "", children, ...opts }: LiquidOpts & { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useLiquidGlass(ref, opts);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
