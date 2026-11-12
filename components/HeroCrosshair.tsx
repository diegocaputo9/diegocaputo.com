"use client";

import { useEffect, useRef } from "react";

// CAD-style crosshair behind the hero: two hairlines follow the pointer across
// the drawing grid and the X / Y position reads out on the edges, like the
// rulers of a drafting program. Mouse and trackpad only; it sits behind the
// content and never takes pointer events.
export function HeroCrosshair() {
  const root = useRef<HTMLDivElement>(null);
  const xr = useRef<HTMLSpanElement>(null);
  const yr = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    const host = el?.parentElement;
    if (!el || !host || !window.matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    let x = 0;
    let y = 0;
    const pad = (n: number) => String(Math.max(0, Math.round(n))).padStart(4, "0");
    const paint = () => {
      raf = 0;
      el.style.setProperty("--cx", `${x}px`);
      el.style.setProperty("--cy", `${y}px`);
      if (xr.current) xr.current.textContent = `X ${pad(x)}`;
      if (yr.current) yr.current.textContent = `Y ${pad(y)}`;
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = host.getBoundingClientRect();
      x = e.clientX - r.left;
      y = e.clientY - r.top;
      el.dataset.on = "";
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const leave = () => delete el.dataset.on;
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    return () => {
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={root} aria-hidden data-glass-src="crosshair" className="crosshair pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <span className="crosshair-v" />
      <span className="crosshair-h" />
      <span ref={xr} className="crosshair-x" />
      <span ref={yr} className="crosshair-y" />
    </div>
  );
}
