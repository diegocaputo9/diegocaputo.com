"use client";

import { useEffect, useRef } from "react";

// Live process flow for the sawmill value stream: one piece of material moves
// box to box, disappears into each step and comes out transformed (log →
// debarked stem → cut lengths → cant + chips → boards → sticker stack → dried
// stack → planed bundle). The dry kilns hold it longest: they set the pace.

const W = 520;
const BW = 100;
const BH = 54;
const GAP = (W - 4 * BW) / 3;
const Y1 = 6;
const Y2 = 104;

type Step = { label: string[]; note?: string; dwell: number; pace?: boolean };
const steps: Step[] = [
  { label: ["Log arrival"], dwell: 1.2 },
  { label: ["Stem deck", "and debarker"], dwell: 1 },
  { label: ["Merchandizer"], note: "C/T 23.4 s/stem", dwell: 1.2 },
  { label: ["Chip and", "saw line"], note: "C/T 2.6 s/log", dwell: 1 },
  { label: ["Vertical saw", "and edging"], dwell: 1 },
  { label: ["Sorter and", "stacker"], dwell: 1 },
  { label: ["Dry kilns"], note: "sets the pace", dwell: 3.6, pace: true },
  { label: ["Planer mill"], dwell: 1 },
];

// Snake layout: 1-4 left to right, 5-8 right to left underneath.
const box = (i: number) => {
  const row = i < 4 ? 0 : 1;
  const col = row === 0 ? i : 7 - i;
  return { x: col * (BW + GAP), y: row === 0 ? Y1 : Y2 };
};
const center = (i: number) => {
  const b = box(i);
  return { x: b.x + BW / 2, y: b.y + BH / 2 };
};

// Each box has an entry and an exit edge; the piece rides the arrows between
// them and is "inside" the box (hidden, box lit, progress bar) while processed.
const entry = (i: number) => {
  const b = box(i);
  if (i === 4) return { x: b.x + BW / 2, y: b.y };
  return i < 4 ? { x: b.x, y: b.y + BH / 2 } : { x: b.x + BW, y: b.y + BH / 2 };
};
const exit = (i: number) => {
  const b = box(i);
  if (i === 3) return { x: b.x + BW / 2, y: b.y + BH };
  return i < 3 ? { x: b.x + BW, y: b.y + BH / 2 } : { x: b.x, y: b.y + BH / 2 };
};
const MOVE = 2.1; // seconds on each arrow
type Seg = { t0: number; t1: number; kind: "move" | "dwell"; i: number; a?: { x: number; y: number }; b?: { x: number; y: number } };
const timeline: Seg[] = [];
{
  let t = 0;
  for (let i = 0; i < steps.length; i++) {
    timeline.push({ t0: t, t1: t + steps[i].dwell, kind: "dwell", i });
    t += steps[i].dwell;
    const a = exit(i);
    const b = i < 7 ? entry(i + 1) : { x: -40, y: a.y };
    timeline.push({ t0: t, t1: t + MOVE, kind: "move", i, a, b });
    t += MOVE;
  }
}
const CYCLE = timeline[timeline.length - 1].t1;
const SPAWN = 5.2; // takt between pieces, longer than the kiln dwell so nothing queues


// The material after step i (stage 0 = raw log before step 1).
function Material({ stage }: { stage: number }) {
  const bark = "#7a5536";
  const wood = "#c99a62";
  const fresh = "#e0b77f";
  const dry = "#ecd3a6";
  const planed = "#f3e4c4";
  const s = "rgb(0 0 0 / 0.35)";
  switch (stage) {
    case 0:
      return (
        <g>
          <rect x={-17} y={-5} width={34} height={10} rx={5} fill={bark} stroke={s} strokeWidth={0.6} />
          <ellipse cx={17} cy={0} rx={2.4} ry={5} fill={wood} stroke={s} strokeWidth={0.6} />
        </g>
      );
    case 1:
      return (
        <g>
          <rect x={-16} y={-4.5} width={32} height={9} rx={4.5} fill={fresh} stroke={s} strokeWidth={0.6} />
          <ellipse cx={16} cy={0} rx={2.2} ry={4.5} fill={wood} stroke={s} strokeWidth={0.6} />
        </g>
      );
    case 2:
      return (
        <g>
          {[-9, 7].map((x) => (
            <g key={x}>
              <rect x={x - 7} y={-4.5} width={14} height={9} rx={4} fill={fresh} stroke={s} strokeWidth={0.6} />
              <ellipse cx={x + 7} cy={0} rx={2} ry={4.5} fill={wood} stroke={s} strokeWidth={0.6} />
            </g>
          ))}
        </g>
      );
    case 3:
      return (
        <g>
          <rect x={-9} y={-6} width={18} height={12} rx={1} fill={fresh} stroke={s} strokeWidth={0.6} />
          {[[-14, -5], [-13, 4], [12, -6], [14, 2], [11, 6]].map(([x, y]) => (
            <rect key={`${x}${y}`} x={x} y={y} width={2.4} height={1.6} fill={wood} transform={`rotate(25 ${x} ${y})`} />
          ))}
        </g>
      );
    case 4:
      return (
        <g>
          {[-5, 0, 5].map((y) => (
            <rect key={y} x={-15} y={y - 1.8} width={30} height={3.6} rx={0.5} fill={fresh} stroke={s} strokeWidth={0.5} />
          ))}
        </g>
      );
    case 5:
    case 6:
      return (
        <g>
          {[-6, -1, 4].map((y) => (
            <g key={y}>
              <rect x={-14} y={y - 1.5} width={28} height={3} fill={stage === 5 ? fresh : dry} stroke={s} strokeWidth={0.5} />
              <rect x={-11} y={y + 1.5} width={2} height={2} fill="#555" />
              <rect x={9} y={y + 1.5} width={2} height={2} fill="#555" />
            </g>
          ))}
          {stage === 6 && (
            <path d="M-6 -12 q2 -2 0 -4 q-2 -2 0 -4 M0 -12 q2 -2 0 -4 q-2 -2 0 -4 M6 -12 q2 -2 0 -4 q-2 -2 0 -4" fill="none" stroke="#e8590c" strokeWidth={0.8} opacity={0.7} />
          )}
        </g>
      );
    default:
      return (
        <g>
          <rect x={-14} y={-7} width={28} height={14} rx={1} fill={planed} stroke={s} strokeWidth={0.6} />
          {[-2.3, 2.3].map((y) => (
            <line key={y} x1={-14} x2={14} y1={y} y2={y} stroke="rgb(0 0 0 / 0.18)" strokeWidth={0.5} />
          ))}
          <rect x={-6} y={-7} width={1.6} height={14} fill="var(--accent)" />
          <rect x={4.4} y={-7} width={1.6} height={14} fill="var(--accent)" />
        </g>
      );
  }
}

const SLOTS = Math.ceil(CYCLE / SPAWN) + 1;

export function SawmillFlow({ label, caption }: { label: string; caption: string }) {
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const pieces = [...el.querySelectorAll<SVGGElement>("[data-piece]")];
    const boxes = [...el.querySelectorAll<SVGRectElement>("[data-box]")];
    const bars = [...el.querySelectorAll<SVGRectElement>("[data-bar]")];
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const place = (now: number) => {
      const active = new Map<number, number>();
      pieces.forEach((g, k) => {
        // piece k starts at k*SPAWN and repeats every SLOTS*SPAWN
        const period = SLOTS * SPAWN;
        const t = (((now - k * SPAWN) % period) + period) % period;
        if (t > CYCLE) {
          g.style.opacity = "0";
          return;
        }
        const seg = timeline.find((x) => t >= x.t0 && t < x.t1) ?? timeline[timeline.length - 1];
        const u = (t - seg.t0) / (seg.t1 - seg.t0);
        if (seg.kind === "dwell") {
          active.set(seg.i, u);
          g.style.opacity = "0";
          return;
        }
        const p = { x: seg.a!.x + (seg.b!.x - seg.a!.x) * u, y: seg.a!.y + (seg.b!.y - seg.a!.y) * u };
        const stage = seg.i;
        g.style.opacity = "1";
        g.setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
        g.querySelectorAll<SVGGElement>("[data-stage]").forEach((m) => {
          m.style.display = Number(m.dataset.stage) === Math.min(stage, 7) ? "" : "none";
        });
      });
      boxes.forEach((b, i) => b.classList.toggle("vsm-on", active.has(i)));
      bars.forEach((b, i) => b.setAttribute("width", String(((active.get(i) ?? 0) * (BW - 12)).toFixed(1))));
    };

    if (reduce) {
      place(SPAWN * 0.2 + 3.4);
      return;
    }

    let raf = 0;
    let visible = false;
    let last = performance.now();
    let clock = 0;
    const tick = (ts: number) => {
      clock += Math.min(0.05, (ts - last) / 1000);
      last = ts;
      place(clock);
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !visible) {
        visible = true;
        last = performance.now();
        raf = requestAnimationFrame(tick);
      } else if (!e.isIntersecting && visible) {
        visible = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(el);
    place(0);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  // Arrows between boxes.
  const arrows: string[] = [];
  for (let i = 0; i < 7; i++) {
    const a = box(i);
    const b = box(i + 1);
    if (i === 3) arrows.push(`M${a.x + BW / 2} ${a.y + BH} V${b.y}`);
    else if (i < 3) arrows.push(`M${a.x + BW} ${a.y + BH / 2} H${b.x}`);
    else arrows.push(`M${a.x} ${a.y + BH / 2} H${b.x + BW}`);
  }

  return (
    <div className="mt-5">
      <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-ink-3">{label}</p>
      <div className="mt-2.5 overflow-hidden rounded-xl border border-line bg-bg-2/60 px-3 py-3">
        <svg ref={svg} viewBox={`-4 0 ${W + 8} ${Y2 + BH + 6}`} className="block h-auto w-full" role="img" aria-label={caption}>
          <defs>
            <marker id="vsm-head" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0 0 L8 4 L0 8 z" fill="var(--ink-3)" />
            </marker>
          </defs>
          {arrows.map((d) => (
            <path key={d} d={d} className="vsm-arrow" fill="none" stroke="var(--ink-3)" strokeWidth={1.1} markerEnd="url(#vsm-head)" />
          ))}
          {/* pieces travel under the boxes, so each step "swallows" and re-emits them */}
          {Array.from({ length: SLOTS }, (_, k) => (
            <g key={k} data-piece style={{ opacity: 0 }}>
              {Array.from({ length: 8 }, (_, s) => (
                <g key={s} data-stage={s} transform={`scale(${s === 3 || s === 4 ? 1.05 : 0.72})`} style={{ display: s ? "none" : undefined }}>
                  <Material stage={s} />
                </g>
              ))}
            </g>
          ))}
          {steps.map((s, i) => {
            const b = box(i);
            const lines = s.label.length;
            return (
              <g key={i}>
                <rect
                  data-box
                  x={b.x}
                  y={b.y}
                  width={BW}
                  height={BH}
                  rx={6}
                  className={`vsm-box ${s.pace ? "vsm-pace" : ""}`}
                />
                <rect data-bar x={b.x + 6} y={b.y + BH - 3.5} width={0} height={1.6} rx={0.8} fill="var(--ink-3)" opacity={0.55} />
                <text x={b.x + 6} y={b.y + 11} className="fill-[var(--ink-3)] font-mono text-[8px]">
                  {i + 1}
                </text>
                {s.label.map((l, j) => (
                  <text
                    key={l}
                    x={b.x + BW / 2}
                    y={b.y + BH / 2 + (j - (lines - 1) / 2) * 12 + (s.note ? -2 : 3)}
                    textAnchor="middle"
                    className="fill-[var(--ink)] text-[10.5px] font-semibold"
                  >
                    {l}
                  </text>
                ))}
                {s.note && (
                  <text
                    x={b.x + BW / 2}
                    y={b.y + BH - 6}
                    textAnchor="middle"
                    className={`font-mono text-[7.5px] ${s.pace ? "fill-[var(--accent)] uppercase" : "fill-[var(--ink-3)]"}`}
                  >
                    {s.note}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      <p className="mt-1.5 text-[13px] leading-snug text-ink-3">{caption}</p>
    </div>
  );
}
