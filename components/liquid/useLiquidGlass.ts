"use client";

import { useEffect, type RefObject } from "react";
import { attachLiquidGlass, type LiquidOpts } from "./glass";

/** Turns the element into liquid glass after hydration (keeps its .glass look where unsupported). */
export function useLiquidGlass(ref: RefObject<HTMLElement | null>, opts: LiquidOpts) {
  const key = JSON.stringify(opts);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return attachLiquidGlass(el, JSON.parse(key) as LiquidOpts);
  }, [ref, key]);
}
