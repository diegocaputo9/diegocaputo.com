"use client";

import { useEffect, useRef } from "react";

// Fixed page backdrop: faded engineering grid + slow-drifting grey blobs.
// The blobs give the glass surfaces something to refract.
//
// The grid and its "+" marks drift up at 6% of the scroll speed, a subtle
// parallax that makes them read as a sheet far behind the page. Only the
// pattern moves (a GPU transform, wrapped every 224px = one "+" tile, which
// is four grid squares, so the wrap is invisible); the edge fade stays put.
const RATE = 0.06;
const TILE = 224;

export function Backdrop() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      el.style.setProperty("--grid-shift", `${-((window.scrollY * RATE) % TILE)}px`);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="blob blob-drift-1 left-[-10vw] top-[-12vh] h-[55vh] w-[55vh] bg-[var(--blob-a)]" />
      <div className="blob blob-drift-2 right-[-8vw] top-[18vh] h-[48vh] w-[48vh] bg-[var(--blob-c)]" />
      <div className="blob blob-drift-3 bottom-[-20vh] left-[30vw] h-[60vh] w-[60vh] bg-[var(--blob-b)]" />
      <div className="backdrop-fade absolute inset-0">
        <div className="grid-backdrop backdrop-scroll" />
        <div className="plus-backdrop backdrop-scroll" />
      </div>
    </div>
  );
}
