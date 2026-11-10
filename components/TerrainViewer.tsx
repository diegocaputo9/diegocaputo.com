"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowCounterClockwise, Drone, MagnifyingGlassMinus, MagnifyingGlassPlus } from "@phosphor-icons/react";
import type { Mode, TerrainHandle } from "./terrain/scene";

const modes: { id: Mode; label: string }[] = [
  { id: "relief", label: "Relief" },
  { id: "elevation", label: "Elevation" },
  { id: "points", label: "Points" },
];

// Same numbers as ELEV_MIN / ELEV_MAX in terrain/scene (kept here so the
// legend renders before three.js loads).
const E0 = 740;
const E1 = 1480;

const spring = { type: "spring", stiffness: 420, damping: 34 } as const;

export function TerrainViewer() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const handle = useRef<TerrainHandle | null>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const [status, setStatus] = useState<"idle" | "ready" | "error">("idle");
  const [mode, setMode] = useState<Mode>("relief");
  const [flight, setFlight] = useState(true);
  const reduce = useReducedMotion();

  // three.js is loaded only when the viewer comes near the viewport.
  useEffect(() => {
    let disposed = false;
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(
      async ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        try {
          const { createTerrain } = await import("./terrain/scene");
          if (disposed || !canvas.current) return;
          handle.current = createTerrain(canvas.current, {
            reduceMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
            onHover: (m) => {
              if (readout.current) readout.current.textContent = m == null ? "Hover or tap" : `${m.toLocaleString("en-US")} m`;
            },
          });
          setStatus("ready");
        } catch {
          setStatus("error");
        }
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    return () => {
      disposed = true;
      io.disconnect();
      handle.current?.dispose();
      handle.current = null;
    };
  }, []);

  useEffect(() => handle.current?.setMode(mode), [mode, status]);
  useEffect(() => handle.current?.setFlight(flight), [flight, status]);

  const iconBtn =
    "grid h-9 w-9 place-items-center rounded-full text-ink-2 transition-colors hover:bg-ink/[0.06] hover:text-ink active:scale-95 dark:hover:bg-white/[0.08]";

  return (
    <div ref={wrap} className="glass overflow-hidden rounded-[28px]">
      <div className="relative aspect-[4/3]">
        <canvas
          ref={canvas}
          role="img"
          aria-label="Interactive 3D model of a sample mountain terrain with a drone survey flight plan. Drag to rotate."
          className="absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing"
        />
        {status !== "ready" && (
          <div className="absolute inset-0 grid place-items-center px-6 text-center text-[13px] text-ink-3">
            {status === "error" ? "The 3D view needs WebGL, which is turned off in this browser." : "Loading 3D model…"}
          </div>
        )}
        <span className="pointer-events-none absolute left-3 top-3 hidden rounded-full bg-bg/70 px-3 py-1.5 text-[12px] text-ink-2 backdrop-blur-md sm:block">
          Sample terrain · placeholder
        </span>
        <div className="pointer-events-none absolute right-3 top-3 rounded-2xl bg-bg/70 px-3 py-2 text-right backdrop-blur-md">
          <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-ink-3">Elevation</p>
          <p className="font-mono text-[14px] text-ink">
            <span ref={readout}>Hover or tap</span>
          </p>
        </div>
        {mode !== "relief" && (
          <div className="pointer-events-none absolute bottom-3 left-3 rounded-2xl bg-bg/70 px-3 py-2 backdrop-blur-md">
            <div className="h-1.5 w-32 rounded-full bg-[linear-gradient(90deg,#dfe6ff,#2f45a8)] dark:bg-[linear-gradient(90deg,#1b2550,#c9d3ff)]" />
            <p className="mt-1.5 flex justify-between gap-6 font-mono text-[12px] text-ink-3">
              <span>{E0} m</span>
              <span>{E1.toLocaleString("en-US")} m</span>
            </p>
          </div>
        )}
      </div>

      {/* toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-3 py-2.5">
        <div role="radiogroup" aria-label="View" className="flex rounded-full bg-ink/[0.04] p-1 dark:bg-white/[0.05]">
          {modes.map((m) => (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={mode === m.id}
              onClick={() => setMode(m.id)}
              className={`relative rounded-full px-3.5 py-1.5 text-[13px] transition-colors ${
                mode === m.id ? "text-ink" : "text-ink-3 hover:text-ink"
              }`}
            >
              {mode === m.id && (
                <motion.span
                  layoutId="terrain-mode"
                  transition={reduce ? { duration: 0 } : spring}
                  className="absolute inset-0 rounded-full bg-bg shadow-[0_1px_2px_rgb(0_0_0/0.08),inset_0_1px_0_var(--glass-edge)]"
                />
              )}
              <span className="relative">{m.label}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            aria-pressed={flight}
            onClick={() => setFlight((f) => !f)}
            className={`flex h-9 items-center gap-1.5 rounded-full px-3 text-[13px] transition-colors ${
              flight ? "bg-accent/10 text-accent" : "text-ink-3 hover:text-ink"
            }`}
          >
            <Drone size={17} />
            Flight plan
          </button>
          <button type="button" aria-label="Zoom out" onClick={() => handle.current?.zoom(1.25)} className={iconBtn}>
            <MagnifyingGlassMinus size={17} />
          </button>
          <button type="button" aria-label="Zoom in" onClick={() => handle.current?.zoom(0.8)} className={iconBtn}>
            <MagnifyingGlassPlus size={17} />
          </button>
          <button type="button" aria-label="Reset view" onClick={() => handle.current?.reset()} className={iconBtn}>
            <ArrowCounterClockwise size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
