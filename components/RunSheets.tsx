"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// A small deck of lab run sheets. Every few seconds the sheet at the back is
// lifted up out of the stack and set down in front, like flipping through a
// clipboard. Click to flip by hand.

const sheets = [
  { lab: "Lab 1", title: "5S workstation", rev: "Rev. C", time: "45 min", steps: ["Sort: red-tag what the cell does not need", "Set in order: shadow board for every tool", "Shine: clean and inspect fixtures", "Standardize: post the cell layout", "Sustain: score the 5S audit"] },
  { lab: "Lab 2", title: "Takt and line balancing", rev: "Rev. B", time: "60 min", steps: ["Time each element, 10 cycles", "Compute takt from demand", "Build yamazumi chart", "Rebalance and re-run"] },
  { lab: "Lab 3", title: "Kanban pull system", rev: "Rev. D", time: "50 min", steps: ["Run push round, log WIP", "Size kanban loops", "Run pull round", "Compare lead time"] },
  { lab: "Lab 4", title: "SMED changeover", rev: "Rev. A", time: "40 min", steps: ["Film baseline changeover", "Split internal / external", "Convert to external", "Time the new changeover"] },
];

const N = sheets.length;
const STEP_Y = -11; // each sheet further back sits a bit higher
const LIFT_MS = 1700;

function Sheet({ s, checked }: { s: (typeof sheets)[number]; checked: number }) {
  return (
    <div className="flex h-full flex-col rounded-[10px] border border-line bg-[var(--bg)] p-4 shadow-[0_1px_2px_rgb(0_0_0/0.06),0_10px_30px_rgb(24_24_27/0.12)]">
      <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3">
        <span>Run sheet · {s.lab}</span>
        <span className="rounded-[4px] border border-line px-1.5 py-0.5">{s.rev}</span>
      </div>
      <p className="mt-2 text-[15px] font-semibold leading-tight tracking-tight text-ink">{s.title}</p>
      <ol className="mt-3 space-y-2">
        {s.steps.map((t, i) => (
          <li key={t} className="flex items-center gap-2 text-[12px] leading-tight text-ink-2">
            <span
              className={`grid h-3.5 w-3.5 shrink-0 place-items-center rounded-[3px] border text-[9px] transition-colors duration-300 ${
                i < checked ? "border-ink-2 bg-ink-2 text-[var(--bg)]" : "border-[var(--sketch)]"
              }`}
            >
              {i < checked ? "✓" : ""}
            </span>
            <span className="font-mono text-[10px] text-ink-3">{i + 1}</span>
            {t}
          </li>
        ))}
      </ol>
      <div className="mt-auto flex items-center justify-between border-t border-line pt-2 font-mono text-[10px] text-ink-3">
        <span>Std. time {s.time}</span>
        <span>TA sign-off ____</span>
      </div>
    </div>
  );
}

export function RunSheets({ year }: { year: string }) {
  const reduce = useReducedMotion();
  // order[0] is the front sheet
  const [order, setOrder] = useState(() => sheets.map((_, i) => i));
  const [lifting, setLifting] = useState<number | null>(null);
  const [checked, setChecked] = useState(0);
  const [over, setOver] = useState(false); // lifted sheet has cleared the deck
  const busy = useRef(false);
  const box = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);

  const flip = () => {
    if (busy.current) return;
    busy.current = true;
    const back = order[N - 1];
    setLifting(back);
    setOrder([back, ...order.slice(0, N - 1)]);
    setChecked(0);
    setTimeout(() => setOver(true), LIFT_MS * 0.42);
    setTimeout(() => {
      setOver(false);
      setLifting(null);
      busy.current = false;
    }, LIFT_MS);
  };

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Tick the front sheet's boxes, then flip to the next one.
  useEffect(() => {
    if (reduce || !visible || lifting !== null) return;
    const n = sheets[order[0]].steps.length;
    const id = setTimeout(() => (checked < n ? setChecked((c) => c + 1) : flip()), checked === 0 ? 1800 : checked < n ? 1300 : 1800);
    return () => clearTimeout(id);
  }, [checked, visible, lifting, reduce, order]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <button
      ref={box}
      type="button"
      onClick={flip}
      aria-label="Lab run sheets: flip to the next sheet"
      className="relative block min-h-[300px] w-full flex-1 cursor-pointer rounded-2xl bg-gradient-to-br from-zinc-100/80 to-zinc-200/40 bg-[repeating-linear-gradient(0deg,var(--grid)_0_1px,transparent_1px_14px)] dark:from-zinc-800/50 dark:to-zinc-900/30"
    >
      <span className="absolute right-4 top-3 font-mono text-[12px] text-ink-3">{year}</span>
      <div className="absolute left-1/2 top-1/2 h-[262px] w-[min(310px,78%)] -translate-x-1/2 -translate-y-[38%] text-left">
        {order.map((idx, depth) => {
          const isLift = lifting === idx && !reduce;
          const rest = { y: depth * STEP_Y, scale: 1 - depth * 0.045, rotate: depth % 2 ? 1.2 : -0.8 * depth, opacity: 1 };
          return (
            <motion.div
              key={idx}
              className="absolute inset-0"
              initial={false}
              style={{ zIndex: isLift ? (over ? N + 1 : 0) : N - depth, transformOrigin: "50% 0%" }}
              animate={
                isLift
                  ? {
                      // rise out of the back of the stack, swing over, settle in front
                      y: [(N - 1) * STEP_Y, -150, -40, 0],
                      x: [0, 26, 10, 0],
                      rotate: [0, 7, -2, rest.rotate],
                      scale: [1 - (N - 1) * 0.045, 0.98, 1.02, 1],
                      opacity: 1,
                    }
                  : rest
              }
              transition={
                isLift
                  ? { duration: LIFT_MS / 1000, times: [0, 0.45, 0.78, 1], ease: [0.45, 0, 0.2, 1] }
                  : { type: "spring", stiffness: 260, damping: 28 }
              }
            >
              <Sheet s={sheets[idx]} checked={depth === 0 && !isLift ? checked : 0} />
            </motion.div>
          );
        })}
      </div>
    </button>
  );
}
