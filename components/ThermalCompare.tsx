"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "motion/react";
import { ArrowsHorizontal } from "@phosphor-icons/react";
import { findings, H, ironGradient, T_MAX, T_MIN, tempFromPixel, thermalSrc, visibleSrc, W } from "./thermal/photo";

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((ok, fail) => {
    const i = new Image();
    i.onload = () => ok(i);
    i.onerror = fail;
    i.src = src;
  });

// Before/after viewer: the drone photo on the left, the same view in thermal on the right.
// The split and the temperature readout are written straight to the DOM
// (no React state per pointer move).
export function ThermalCompare() {
  const box = useRef<HTMLDivElement>(null);
  const aerial = useRef<HTMLCanvasElement>(null);
  const thermal = useRef<HTMLCanvasElement>(null);
  const handle = useRef<HTMLDivElement>(null);
  const tip = useRef<HTMLDivElement>(null);
  const tempAt = useRef<((x: number, y: number) => number) | null>(null);
  const split = useRef(50);
  const [ready, setReady] = useState(false);

  const setSplit = (v: number) => {
    split.current = Math.min(100, Math.max(0, v));
    box.current?.style.setProperty("--split", `${split.current}%`);
    handle.current?.setAttribute("aria-valuenow", String(Math.round(split.current)));
  };

  // Draw both images once the viewer is close to the viewport, then play one
  // gentle sweep (so people see it can be dragged) only when most of it is
  // actually on screen. On phones the drawing happens well below the fold, so
  // a sweep tied to the drawing would finish before anyone saw it.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let stop: (() => void) | undefined;
    let drawn = false;
    let touched = false;
    // grabbing the slider cancels the sweep (or stops one already running)
    const markTouched = () => {
      touched = true;
      stop?.();
    };
    el.addEventListener("pointerdown", markTouched);

    const draw = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        draw.disconnect();
        const a = aerial.current?.getContext("2d");
        const t = thermal.current?.getContext("2d", { willReadFrequently: true });
        if (!a || !t) return;
        Promise.all([loadImage(visibleSrc), loadImage(thermalSrc)])
          .then(([vis, ir]) => {
            a.drawImage(vis, 0, 0, W, H);
            t.drawImage(ir, 0, 0, W, H);
            const px = t.getImageData(0, 0, W, H).data;
            tempAt.current = (x, y) => {
              const i = (Math.min(H - 1, Math.max(0, Math.round(y))) * W + Math.min(W - 1, Math.max(0, Math.round(x)))) * 4;
              return tempFromPixel(px[i], px[i + 1], px[i + 2]);
            };
            drawn = true;
            setReady(true);
          })
          .catch(() => {});
      },
      { rootMargin: "300px 0px" },
    );
    draw.observe(el);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sweep = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || !drawn) return;
        sweep.disconnect();
        if (touched) return;
        el.dataset.moving = "";
        const ctl = animate(50, [50, 32, 66, 50], {
          duration: 2.6,
          delay: 0.4,
          ease: "easeInOut",
          onUpdate: setSplit,
        });
        ctl.then(() => delete el.dataset.moving);
        stop = () => {
          ctl.stop();
          delete el.dataset.moving;
        };
      },
      { threshold: 0.6 },
    );
    if (!reduced) sweep.observe(el);

    return () => {
      draw.disconnect();
      sweep.disconnect();
      el.removeEventListener("pointerdown", markTouched);
      stop?.();
    };
  }, []);

  function posFromEvent(e: React.PointerEvent) {
    const r = box.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height };
  }

  const dragging = useRef(false);
  // the knob stretches ~12% sideways while it moves (data-moving on the box)
  const moving = (on: boolean) => {
    if (!box.current) return;
    if (on) box.current.dataset.moving = "";
    else delete box.current.dataset.moving;
  };
  function onDown(e: React.PointerEvent<HTMLDivElement>) {
    dragging.current = true;
    moving(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = posFromEvent(e);
    setSplit((p.x / p.w) * 100);
  }
  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    const p = posFromEvent(e);
    if (dragging.current) setSplit((p.x / p.w) * 100);
    const t = tip.current;
    if (!t || e.pointerType === "touch" || !tempAt.current) return;
    const c = tempAt.current((p.x / p.w) * W, (p.y / p.h) * H);
    t.style.opacity = "1";
    t.style.transform = `translate(${p.x + 14}px, ${p.y + 14}px)`;
    t.textContent = `${c.toFixed(1)} °C`;
  }
  function onUp() {
    dragging.current = false;
    moving(false);
  }
  function onLeave() {
    if (tip.current) tip.current.style.opacity = "0";
  }
  function onKey(e: React.KeyboardEvent) {
    const step = e.shiftKey ? 10 : 4;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") setSplit(split.current - step);
    else if (e.key === "ArrowRight" || e.key === "ArrowUp") setSplit(split.current + step);
    else if (e.key === "Home") setSplit(0);
    else if (e.key === "End") setSplit(100);
    else return;
    e.preventDefault();
  }

  return (
    <div className="glass overflow-hidden rounded-card">
      <div
        ref={box}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onPointerLeave={onLeave}
        style={{ ["--split" as string]: "50%" }}
        className="group/tc relative aspect-[1200/820] cursor-ew-resize touch-pan-y select-none overflow-hidden bg-bg-2"
      >
        <canvas
          ref={aerial}
          width={W}
          height={H}
          role="img"
          aria-label="Drone photo of an industrial site: a flat-roof building with rooftop units, a tank, pipe runs, loading docks and a parking lot"
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-0 [clip-path:inset(0_0_0_var(--split))]">
          <canvas
            ref={thermal}
            width={W}
            height={H}
            role="img"
            aria-label="The same site in thermal imaging, with four numbered hot spots"
            className="absolute inset-0 h-full w-full"
          />
          {ready &&
            findings.map((f) => (
              <span
                key={f.n}
                data-marker={f.n}
                style={{ left: `${(f.x / W) * 100}%`, top: `${(f.y / H) * 100}%` }}
                className="thermal-marker absolute z-10 grid h-6 w-6 cursor-default transition-[background-color,border-color,scale] duration-200 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/80 bg-black/55 font-mono text-[12px] font-medium text-white backdrop-blur-sm"
              >
                {f.n}
                {/* note on hover: what the hot spot is and how warm */}
                <span
                  className={`pointer-events-none absolute top-1/2 z-20 w-max max-w-[220px] -translate-y-1/2 rounded-lg bg-black/75 px-2.5 py-1.5 text-left font-sans text-[12px] font-normal leading-snug text-white opacity-0 shadow-[0_6px_18px_rgb(0_0_0/0.3)] backdrop-blur-md transition-opacity duration-200 [.thermal-marker:hover>&]:opacity-100 ${
                    f.x > W * 0.6 ? "right-[calc(100%+8px)]" : "left-[calc(100%+8px)]"
                  }`}
                >
                  <span className="block font-medium">
                    {f.title} <span className="font-mono text-white/70">{f.temp}</span>
                  </span>
                  <span className="block text-white/75">{f.detail}</span>
                </span>
              </span>
            ))}
        </div>

        {!ready && (
          <div className="absolute inset-0 grid place-items-center text-[13px] text-ink-3">Loading images…</div>
        )}

        <span className="pointer-events-none absolute left-3 top-3 rounded-ctl bg-black/45 px-3 py-1.5 text-[12px] font-medium text-white backdrop-blur-md">
          Visible
        </span>
        <span className="pointer-events-none absolute right-3 top-3 rounded-ctl bg-black/45 px-3 py-1.5 text-[12px] font-medium text-white backdrop-blur-md">
          Thermal
        </span>

        {/* divider + knob */}
        <div className="pointer-events-none absolute inset-y-0 left-[var(--split)] w-px -translate-x-1/2 bg-white/90 shadow-[0_0_0_1px_rgb(0_0_0/0.15)]" />
        <div
          ref={handle}
          role="slider"
          tabIndex={0}
          aria-label="Reveal thermal image"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={50}
          aria-valuetext="Drag to compare visible and thermal"
          onKeyDown={onKey}
          className="absolute left-[var(--split)] top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-white/30 text-white shadow-[0_6px_24px_rgb(0_0_0/0.25)] backdrop-blur-md transition-[scale] duration-200 ease-glide group-data-[moving]/tc:scale-x-[1.12]"
        >
          <ArrowsHorizontal size={18} weight="bold" />
        </div>

        <div
          ref={tip}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 rounded-lg bg-black/70 px-2 py-1 font-mono text-[12px] text-white opacity-0 backdrop-blur-sm transition-opacity duration-200"
        />
      </div>

      {/* legend */}
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-line px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[12px] text-ink-3">{T_MIN} °C</span>
          <span className="h-1.5 w-32 rounded-full" style={{ background: ironGradient }} />
          <span className="font-mono text-[12px] text-ink-3">{T_MAX}+ °C</span>
        </div>
      </div>
    </div>
  );
}
