// Blueprint-style line drawings of industrial engineering subjects.
// Drawn on purpose for this site (the brief asked for sketch artwork), in the
// page's grey palette. Every stroked element carries pathLength={1} so CSS can
// "draw" it as it scrolls into view (see .sketch in globals.css). Dashed
// construction lines (.dash) are excluded from the draw so their dashes survive.

import type { CSSProperties, ReactNode, SVGProps } from "react";

const P = 1; // pathLength

// `label` is the label font size in viewBox units, chosen per drawing from its
// smallest on-screen width so every label renders at 12px or larger.
function Sketch({
  viewBox,
  label,
  className = "",
  children,
}: {
  viewBox: string;
  label: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <svg
      aria-hidden
      viewBox={viewBox}
      style={{ "--label": `${label}px` } as CSSProperties}
      className={`sketch pointer-events-none select-none ${className}`}
    >
      {children}
    </svg>
  );
}

function Label(props: SVGProps<SVGTextElement> & { children: ReactNode }) {
  return <text {...props} />;
}

/** Horizontal dimension line with end ticks and a centered label. */
function Dim({ x1, x2, y, label }: { x1: number; x2: number; y: number; label: string }) {
  const mid = (x1 + x2) / 2;
  return (
    <g className="dim">
      <line pathLength={P} x1={x1} y1={y} x2={x2} y2={y} />
      <line pathLength={P} x1={x1} y1={y - 5} x2={x1} y2={y + 5} />
      <line pathLength={P} x1={x2} y1={y - 5} x2={x2} y2={y + 5} />
      <Label x={mid} y={y - 6} textAnchor="middle">
        {label}
      </Label>
    </g>
  );
}

/** Side profile of a car body sitting on a skid, occupying x..x+132.
 *  Mirrored so the car faces the other way along the conveyor. */
function CarBody({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x + 132} ${y}) scale(-1 1)`}>
      <path
        pathLength={P}
        d="M0 0 L0 -18 Q2 -26 14 -28 L34 -30 L54 -48 Q58 -52 66 -52 L92 -52 Q98 -52 102 -46 L114 -30 L124 -28 Q132 -26 132 -18 L132 0 L118 0 A13 13 0 0 0 92 0 L42 0 A13 13 0 0 0 16 0 Z"
      />
      <path pathLength={P} d="M60 -46 L58 -32 M88 -48 L90 -32 M36 -30 L112 -30" />
      <line pathLength={P} x1={8} y1={8} x2={124} y2={8} />
      <line pathLength={P} x1={22} y1={0} x2={22} y2={8} />
      <line pathLength={P} x1={110} y1={0} x2={110} y2={8} />
    </g>
  );
}

export function AssemblyLine({ className }: { className?: string }) {
  const rollers = Array.from({ length: 16 }, (_, i) => 24 + i * 40);
  return (
    <Sketch viewBox="0 0 660 220" label={12} className={className}>
      {/* conveyor */}
      <line pathLength={P} x1={8} y1={176} x2={652} y2={176} />
      <line pathLength={P} x1={8} y1={190} x2={652} y2={190} />
      {rollers.map((x) => (
        <circle key={x} pathLength={P} cx={x} cy={183} r={5} />
      ))}
      {/* stations */}
      {[200, 420].map((x, i) => (
        <g key={x}>
          <path pathLength={P} d={`M${x} 176 L${x} 44 L${x + 90} 44 L${x + 90} 176`} />
          <path pathLength={P} d={`M${x + 45} 44 L${x + 45} 70 M${x + 35} 70 L${x + 55} 70 M${x + 38} 70 L${x + 34} 84 M${x + 52} 70 L${x + 56} 84`} />
          <Label x={x + 4} y={38}>{i === 0 ? "ST-02  WELD" : "ST-03  TRIM"}</Label>
        </g>
      ))}
      {/* cars drift one pitch per cycle (seamless: 4 identical cars, 215 apart),
          fading in at the left edge and out at the right (bp-cars in globals.css) */}
      <defs>
        <linearGradient id="al-fade-grad" x1="0" y1="0" x2="660" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.14" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.82" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.98" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="al-fade" maskUnits="userSpaceOnUse" x="0" y="0" width="660" height="220">
          <rect x="0" y="0" width="660" height="220" fill="url(#al-fade-grad)" />
        </mask>
      </defs>
      <g mask="url(#al-fade)">
        <g className="bp-cars">
          <CarBody x={-175} y={168} />
          <CarBody x={40} y={168} />
          <CarBody x={255} y={168} />
          <CarBody x={470} y={168} />
        </g>
      </g>
      <Dim x1={40} x2={255} y={18} label="PITCH" />
      <line className="dash" x1={40} y1={22} x2={40} y2={168} />
      <line className="dash" x1={255} y1={22} x2={255} y2={168} />
      <Label x={8} y={212}>BODY IN WHITE / FLOW →</Label>
    </Sketch>
  );
}

export function RobotArm({ className }: { className?: string }) {
  return (
    <Sketch viewBox="0 0 320 340" label={16} className={className}>
      {/* base + turntable */}
      <rect pathLength={P} x={90} y={300} width={140} height={22} rx={3} />
      <rect pathLength={P} x={128} y={270} width={64} height={30} rx={4} />
      <circle pathLength={P} cx={160} cy={258} r={16} />
      <circle pathLength={P} cx={160} cy={258} r={5} />
      {/* lower arm pivots at the shoulder, upper arm at the elbow (bp-arm-* in globals.css) */}
      <g className="bp-arm-lower" style={{ transformOrigin: "160px 258px" }}>
        <path pathLength={P} d="M146 250 L104 152 M174 252 L128 146" />
        <circle pathLength={P} cx={114} cy={146} r={14} />
        <circle pathLength={P} cx={114} cy={146} r={4} />
        <g className="bp-arm-upper" style={{ transformOrigin: "114px 146px" }}>
          <path pathLength={P} d="M120 133 L222 84 M126 158 L232 108" />
          <circle pathLength={P} cx={228} cy={96} r={10} />
          {/* wrist + gripper */}
          <g className="bp-arm-wrist" style={{ transformOrigin: "228px 96px" }}>
            <path pathLength={P} d="M236 102 L262 134 M262 134 L252 156 M262 134 L276 152 M248 152 L256 160 M272 148 L282 154" />
          </g>
        </g>
      </g>
      {/* construction */}
      <path className="dash" d="M118 258 A42 42 0 0 1 160 216" />
      <line className="dash" x1={160} y1={258} x2={266} y2={146} />
      <line className="dash" x1={60} y1={258} x2={300} y2={258} />
      <g className="dim">
        <Label x={96} y={214}>AXIS 1</Label>
        <Label x={222} y={196}>REACH</Label>
      </g>
      <Label x={90} y={336}>6-AXIS ROBOT / CELL 04</Label>
    </Sketch>
  );
}

// Current-state figures the map "fills in" (illustrative): cycle time,
// changeover, and days of inventory after each step. VA = 45+62+90+58 s,
// lead time = 1.8 + 1.2 + 2.6 d.
const VSM = [
  { ct: "45 s", co: "30 m", inv: "1.8 d" },
  { ct: "62 s", co: "15 m", inv: "1.2 d" },
  { ct: "90 s", co: "40 m", inv: "2.6 d" },
  { ct: "58 s", co: "5 m", inv: "" },
];

export function ValueStream({ className }: { className?: string }) {
  const steps = ["STAMP", "WELD", "PAINT", "ASSY"];
  return (
    <Sketch viewBox="0 0 600 190" label={14} className={className}>
      {steps.map((s, i) => {
        const x = 10 + i * 150;
        return (
          <g key={s}>
            <rect pathLength={P} x={x} y={40} width={96} height={56} rx={2} />
            <line pathLength={P} x1={x} y1={58} x2={x + 96} y2={58} />
            <Label x={x + 48} y={53} textAnchor="middle">
              {s}
            </Label>
            <Label x={x + 8} y={76}>C/T</Label>
            <Label x={x + 8} y={89}>C/O</Label>
            <Label x={x + 88} y={76} textAnchor="end" className={`vsm-val vsm-${i * 3}`}>
              {VSM[i].ct}
            </Label>
            <Label x={x + 88} y={89} textAnchor="end" className={`vsm-val vsm-${i * 3 + 1}`}>
              {VSM[i].co}
            </Label>
            {i < steps.length - 1 && (
              <g>
                {/* inventory triangle */}
                <path pathLength={P} d={`M${x + 123} 58 L${x + 133} 76 L${x + 113} 76 Z`} />
                <Label x={x + 123} y={73} textAnchor="middle" className="tiny">
                  I
                </Label>
                <Label x={x + 123} y={50} textAnchor="middle" className={`vsm-val vsm-${i * 3 + 2}`}>
                  {VSM[i].inv}
                </Label>
                {/* push arrow */}
                <path pathLength={P} d={`M${x + 100} 90 L${x + 144} 90 M${x + 138} 86 L${x + 144} 90 L${x + 138} 94`} />
              </g>
            )}
          </g>
        );
      })}
      {/* lead-time ladder */}
      <path
        pathLength={P}
        d="M10 150 L106 150 L106 130 L160 130 L160 150 L256 150 L256 130 L310 130 L310 150 L406 150 L406 130 L460 130 L460 150 L556 150"
      />
      <Label x={10} y={176}>VALUE STREAM MAP / CURRENT STATE</Label>
      <Dim x1={10} x2={556} y={18} label="LEAD TIME" />
      <Label x={556} y={176} textAnchor="end" className="vsm-val vsm-11">
        VA 255 s
      </Label>
      <g className="dim">
        <Label x={336} y={12} className="vsm-val vsm-12">
          = 5.6 d
        </Label>
      </g>
    </Sketch>
  );
}

export function KanbanCard({ className }: { className?: string }) {
  return (
    <Sketch viewBox="0 0 240 160" label={15} className={className}>
      <rect pathLength={P} x={10} y={10} width={220} height={140} rx={6} />
      <circle pathLength={P} cx={120} cy={24} r={5} />
      <line pathLength={P} x1={10} y1={40} x2={230} y2={40} />
      <line pathLength={P} x1={10} y1={76} x2={230} y2={76} />
      <line pathLength={P} x1={10} y1={112} x2={230} y2={112} />
      <line pathLength={P} x1={120} y1={76} x2={120} y2={150} />
      <Label x={20} y={58}>KANBAN / WITHDRAWAL</Label>
      <Label x={20} y={94}>PART NO.</Label>
      <Label x={130} y={94}>QTY</Label>
      <Label x={20} y={130}>FROM</Label>
      <Label x={130} y={130}>TO</Label>
    </Sketch>
  );
}

function gearPath(cx: number, cy: number, teeth: number, rOut: number, rIn: number) {
  const pts: string[] = [];
  const step = (Math.PI * 2) / teeth;
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const corners = [
      [rIn, a],
      [rOut, a + step * 0.15],
      [rOut, a + step * 0.45],
      [rIn, a + step * 0.6],
    ];
    for (const [r, t] of corners) {
      pts.push(`${(cx + r * Math.cos(t)).toFixed(1)} ${(cy + r * Math.sin(t)).toFixed(1)}`);
    }
  }
  return `M${pts.join(" L")} Z`;
}

export function Gears({ className }: { className?: string }) {
  return (
    <Sketch viewBox="0 0 300 220" label={19} className={className}>
      {/* meshing gears: opposite directions, speeds in the 16:10 ratio */}
      <g className="bp-gear-big" style={{ transformOrigin: "100px 110px" }}>
        <path pathLength={P} d={gearPath(100, 110, 16, 74, 62)} />
        <circle pathLength={P} cx={100} cy={110} r={18} />
      </g>
      <g className="bp-gear-small" style={{ transformOrigin: "211px 86px" }}>
        <path pathLength={P} d={gearPath(211, 86, 10, 46, 36)} />
        <circle pathLength={P} cx={211} cy={86} r={11} />
      </g>
      <line className="dash" x1={10} y1={110} x2={190} y2={110} />
      <line className="dash" x1={100} y1={20} x2={100} y2={200} />
      <line className="dash" x1={150} y1={86} x2={272} y2={86} />
      <line className="dash" x1={211} y1={26} x2={211} y2={146} />
      <Label x={130} y={214}>RATIO 16:10</Label>
    </Sketch>
  );
}

export function Andon({ className }: { className?: string }) {
  return (
    <Sketch viewBox="0 0 120 260" label={15} className={className}>
      <rect pathLength={P} x={40} y={14} width={40} height={10} rx={3} />
      {[24, 62, 100].map((y) => (
        <rect key={y} pathLength={P} x={36} y={y} width={48} height={38} rx={4} />
      ))}
      {/* lamps: RUN most of the time, CALL now and then, a short STOP */}
      <rect className="bp-lamp bp-lamp-stop" x={40} y={28} width={40} height={30} rx={3} />
      <rect className="bp-lamp bp-lamp-call" x={40} y={66} width={40} height={30} rx={3} />
      <rect className="bp-lamp bp-lamp-run" x={40} y={104} width={40} height={30} rx={3} />
      <line pathLength={P} x1={60} y1={138} x2={60} y2={228} />
      <rect pathLength={P} x={30} y={228} width={60} height={14} rx={2} />
      <g className="dim">
        <Label x={90} y={47}>STOP</Label>
        <Label x={90} y={85}>CALL</Label>
        <Label x={90} y={123}>RUN</Label>
      </g>
      <Label x={14} y={256}>ANDON</Label>
    </Sketch>
  );
}
