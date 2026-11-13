"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";

type Props = {
  children: ReactNode;
  className?: string;
  /** max tilt in degrees; 0 disables tilt but keeps the moving highlight */
  tilt?: number;
  /** element to render (li inside lists) */
  as?: "div" | "li";
  /** no wrapper div: perspective goes on the card itself (keeps grid/subgrid layouts intact) */
  bare?: boolean;
};

// Glass surface whose specular highlight follows the pointer and that tilts
// a few degrees toward it, like a pane catching light. Motion values only,
// no React state, so pointer moves never re-render.
export function GlassCard({ children, className = "", tilt = 6, as = "div", bare = false }: Props) {
  const ref = useRef<HTMLDivElement & HTMLLIElement>(null);
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 160, damping: 20 });
  const sy = useSpring(py, { stiffness: 160, damping: 20 });
  const rotateY = useTransform(sx, [0, 1], [-tilt, tilt]);
  const rotateX = useTransform(sy, [0, 1], [tilt, -tilt]);

  function onMove(e: React.PointerEvent<HTMLElement>) {
    const el = ref.current;
    if (!el || e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
    el.dataset.lit = ""; // fades the pointer light in (see .glass::after)
    if (!reduce) {
      px.set(x);
      py.set(y);
    }
  }

  // Keep the last position so the light fades out where the pointer left.
  function onLeave() {
    px.set(0.5);
    py.set(0.5);
    if (ref.current) delete ref.current.dataset.lit;
  }

  const tiltStyle = reduce || tilt === 0 ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" as const };
  if (bare) {
    const M = as === "li" ? motion.li : motion.div;
    return (
      <M
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={tiltStyle ? { ...tiltStyle, transformPerspective: 1200 } : undefined}
        className={`glass ${className}`}
      >
        {children}
      </M>
    );
  }

  return (
    <div style={{ perspective: 1200 }} className="h-full">
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={tiltStyle}
        className={`glass h-full ${className}`}
      >
        {children}
      </motion.div>
    </div>
  );
}
