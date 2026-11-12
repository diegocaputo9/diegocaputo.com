"use client";

import { useRef, type ReactNode } from "react";
import { useLiquidGlass, type LiquidHookOpts } from "./useLiquidGlass";

// An element (div by default, or li) that becomes liquid glass once the page
// loads. Give it the "glass" class too: that is the frosted look it keeps
// where liquid glass is off.
export function LiquidPanel({
  as = "div",
  className = "",
  children,
  ...opts
}: LiquidHookOpts & { as?: "div" | "li"; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement & HTMLLIElement>(null);
  useLiquidGlass(ref, opts);
  const Tag = as;
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
