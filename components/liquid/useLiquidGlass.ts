"use client";

import { useEffect, type RefObject } from "react";
import { attachLiquidGlass, type LiquidOpts } from "./glass";

export type LiquidHookOpts = LiquidOpts & {
  /** only be liquid glass while this media query matches (e.g. "(min-width: 640px)") */
  media?: string;
};

/** Turns the element into liquid glass after hydration (keeps its .glass look where unsupported). */
export function useLiquidGlass(ref: RefObject<HTMLElement | null>, opts: LiquidHookOpts | null) {
  const key = opts ? JSON.stringify(opts) : "";
  useEffect(() => {
    const el = ref.current;
    if (!el || !key) return;
    const { media, ...o } = JSON.parse(key) as LiquidHookOpts;
    if (!media) return attachLiquidGlass(el, o);
    const mq = window.matchMedia(media);
    let detach: (() => void) | null = null;
    const sync = () => {
      if (mq.matches && !detach) detach = attachLiquidGlass(el, o);
      else if (!mq.matches && detach) {
        detach();
        detach = null;
      }
    };
    sync();
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      detach?.();
    };
  }, [ref, key]);
}
