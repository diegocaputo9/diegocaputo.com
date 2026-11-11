"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowCounterClockwise } from "@phosphor-icons/react";
import type { FlowHandle, FlowState } from "./flow/scene";

const sizes = [2, 5, 10];
const PARTS = 10;
const spring = { type: "spring", stiffness: 420, damping: 34 } as const;

// Same schedule as flow/scene (kept here so the table renders before three.js
// loads): three stations, one minute per part, no transport time.
function milestones(b: number) {
  const fin: number[][] = [];
  for (let k = 0; k < 3; k++) {
    fin.push([]);
    for (let i = 0; i < PARTS; i++) {
      const last = Math.min((Math.floor(i / b) + 1) * b, PARTS) - 1;
      const arrives = k === 0 ? 0 : fin[k - 1][last];
      fin[k].push(Math.max(arrives, i === 0 ? 0 : fin[k][i - 1]) + 1);
    }
  }
  return { first: fin[2][0], all: fin[2][PARTS - 1] };
}

// A lean lesson you can run: two identical lines make ten parts. One moves a
// part at a time, the other in batches; the table fills in as each line
// reaches its first part and its last. Drag to turn the model.
export function FlowLab() {
  const wrap = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const handle = useRef<FlowHandle | null>(null);
  const [status, setStatus] = useState<"idle" | "ready" | "error">("idle");
  const [batch, setBatch] = useState(10);
  const [state, setState] = useState<FlowState>({ minute: 0, done: false, flowOut: 0, batchOut: 0 });
  const reduce = useReducedMotion();
  const flow = milestones(1);
  const lot = milestones(batch);

  // three.js loads when the viewer comes near the viewport; the run starts once it is mostly on screen.
  useEffect(() => {
    let disposed = false;
    const el = wrap.current;
    if (!el) return;
    const near = new IntersectionObserver(
      async ([e]) => {
        if (!e.isIntersecting) return;
        near.disconnect();
        try {
          const { createFlow } = await import("./flow/scene");
          if (disposed || !canvas.current) return;
          handle.current = createFlow(canvas.current, {
            reduceMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
            batch: 10,
            onState: setState,
          });
          setStatus("ready");
        } catch {
          setStatus("error");
        }
      },
      { rootMargin: "400px 0px" },
    );
    near.observe(el);
    return () => {
      disposed = true;
      near.disconnect();
      handle.current?.dispose();
      handle.current = null;
    };
  }, []);

  useEffect(() => {
    const el = stage.current;
    if (status !== "ready" || !el) return;
    const seen = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        seen.disconnect();
        handle.current?.play();
      },
      { threshold: 0.55 },
    );
    seen.observe(el);
    return () => seen.disconnect();
  }, [status]);

  const pick = (b: number) => {
    setBatch(b);
    handle.current?.setBatch(b);
  };

  const cell = (reached: boolean, v: number) => (
    <td className="py-2.5 text-right font-mono text-[14px] tabular-nums">
      <span className={`transition-colors duration-300 ${reached ? "text-ink" : "text-ink-3/50"}`}>
        {reached ? `${v} min` : "–"}
      </span>
    </td>
  );
  const row = (name: string, m: { first: number; all: number }, out: number, accent: boolean) => (
    <tr className="border-t border-line">
      <th scope="row" className="py-2.5 pr-3 text-left text-[14px] font-medium text-ink">
        <span className="flex items-center gap-2">
          <span aria-hidden className={`h-2 w-2 shrink-0 rounded-[1px] ${accent ? "bg-accent" : "bg-ink-3"}`} />
          {name}
        </span>
      </th>
      {cell(out >= 1, m.first)}
      {cell(out >= PARTS, m.all)}
    </tr>
  );

  return (
    <div ref={wrap} className="glass overflow-hidden rounded-card">
      <div ref={stage} className="relative aspect-[5/4] overflow-hidden sm:aspect-[16/10]">
        <canvas
          ref={canvas}
          role="img"
          aria-label={`3D model of two production lines making ten parts through three stations. One-piece flow finishes its first part at minute ${flow.first} and all ten at minute ${flow.all}; batches of ${batch} finish the first part at minute ${lot.first} and all ten at minute ${lot.all}. Drag to rotate.`}
          className="absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing"
        />
        {status !== "ready" && (
          <div className="absolute inset-0 grid place-items-center px-6 text-center text-[13px] text-ink-3">
            {status === "error" ? "The 3D view needs WebGL, which is turned off in this browser." : "Loading 3D model…"}
          </div>
        )}
        {/* which line is which (turning the model never swaps them) */}
        <ul className="pointer-events-none absolute left-3 top-3 space-y-1 rounded-ctl bg-bg/70 px-3 py-2 text-[12px] text-ink-2 backdrop-blur-md">
          <li>
            <span className="text-ink-3">Back line</span> · One-piece flow
          </li>
          <li>
            <span className="text-ink-3">Front line</span> · Batches of {batch}
          </li>
        </ul>
        <div className="pointer-events-none absolute right-3 top-3 rounded-ctl bg-bg/70 px-3 py-2 text-right backdrop-blur-md">
          <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-ink-3">Minute</p>
          <p className="font-mono text-[14px] tabular-nums text-ink">{String(state.minute).padStart(2, "0")}</p>
        </div>
      </div>

      <div className="border-t border-line px-4 pb-1 pt-1 sm:px-5">
        <table className="w-full">
          <thead>
            <tr>
              <td />
              <th scope="col" className="py-2.5 text-right text-[12px] font-medium uppercase tracking-[0.08em] text-ink-3">
                First part out
              </th>
              <th scope="col" className="py-2.5 pl-4 text-right text-[12px] font-medium uppercase tracking-[0.08em] text-ink-3">
                All {PARTS} out
              </th>
            </tr>
          </thead>
          <tbody>
            {row("One-piece flow", flow, state.flowOut, true)}
            {row(`Batches of ${batch}`, lot, state.batchOut, false)}
          </tbody>
        </table>
      </div>

      {/* toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-3 py-2.5">
        <div className="flex items-center gap-2.5">
          <span id="flow-batch" className="pl-1 text-[13px] text-ink-3">
            Batch size
          </span>
          <div role="radiogroup" aria-labelledby="flow-batch" className="flex rounded-ctl bg-ink/[0.04] p-1 dark:bg-white/[0.05]">
            {sizes.map((b) => (
              <button
                key={b}
                type="button"
                role="radio"
                aria-checked={batch === b}
                onClick={() => pick(b)}
                className={`relative min-w-10 rounded-sm px-3 py-1.5 font-mono text-[13px] transition-colors ${
                  batch === b ? "text-ink" : "text-ink-3 hover:text-ink"
                }`}
              >
                {batch === b && (
                  <motion.span
                    layoutId="flow-batch-lens"
                    transition={reduce ? { duration: 0 } : spring}
                    className="absolute inset-0 rounded-sm bg-bg shadow-[0_1px_2px_rgb(0_0_0/0.08),inset_0_1px_0_var(--glass-edge)]"
                  />
                )}
                <span className="relative">{b}</span>
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => handle.current?.restart()}
          className="flex h-9 items-center gap-1.5 rounded-ctl px-3 text-[13px] text-ink-2 transition-[color,background-color,scale] hover:bg-ink/[0.06] hover:text-ink active:scale-[0.97] dark:hover:bg-white/[0.08]"
        >
          <ArrowCounterClockwise size={16} />
          Run again
        </button>
      </div>
    </div>
  );
}
