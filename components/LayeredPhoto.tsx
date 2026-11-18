"use client";

import { cubicBezier, motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

// A photo split into depth layers (public/speaking/layers, cut with Apple Vision
// person masks plus hand-drawn seating outlines). While the photo scrolls up into
// view the seating groups come in from closer to the camera and from the sides,
// the speaker drifts a little, and the room settles; once the photo's top edge is
// a quarter of the way down the screen every layer lines up into the real photo.

type Move = { x: number; y: number; scale: number; origin: string };
const settle = cubicBezier(0.4, 0, 0.3, 1);

// Starting offsets (percent of the photo) for each layer; all end at 0.
const moves: Record<string, Record<"bg" | "me" | "left" | "right", Move>> = {
  "lean-lecture": {
    bg: { x: 0, y: -5, scale: 1.12, origin: "50% 40%" },
    me: { x: -7, y: 3, scale: 1, origin: "50% 50%" },
    left: { x: -16, y: 22, scale: 1.22, origin: "0% 100%" },
    right: { x: 14, y: 20, scale: 1.18, origin: "100% 100%" },
  },
  "systems-showdown": {
    bg: { x: 0, y: -5, scale: 1.12, origin: "50% 40%" },
    me: { x: 7, y: 3, scale: 1, origin: "50% 50%" },
    left: { x: -16, y: 20, scale: 1.22, origin: "0% 100%" },
    right: { x: 14, y: 22, scale: 1.2, origin: "100% 100%" },
  },
};

function Layer({ src, move, p, position, className }: { src: string; move: Move; p: MotionValue<number>; position?: string; className?: string }) {
  const x = useTransform(p, [0, 1], [`${move.x}%`, "0%"], { ease: settle });
  const y = useTransform(p, [0, 1], [`${move.y}%`, "0%"], { ease: settle });
  const scale = useTransform(p, [0, 1], [move.scale, 1], { ease: settle });
  return (
     
    <motion.img
      src={src}
      alt=""
      aria-hidden
      width={1600}
      loading="lazy"
      decoding="async"
      style={{ x, y, scale, transformOrigin: move.origin, objectPosition: position }}
      className={`pointer-events-none absolute inset-0 h-full w-full object-cover will-change-transform ${className ?? ""}`}
    />
  );
}

export function LayeredPhoto({
  name,
  alt,
  width,
  height,
  position,
  className,
}: {
  name: string;
  alt: string;
  width: number;
  height: number;
  position?: string;
  className: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.25"] });
  const m = moves[name];
  const base = `/speaking/layers/${name}`;
  const bgX = useTransform(scrollYProgress, [0, 1], [`${m.bg.x}%`, "0%"], { ease: settle });
  const bgY = useTransform(scrollYProgress, [0, 1], [`${m.bg.y}%`, "0%"], { ease: settle });
  const bgScale = useTransform(scrollYProgress, [0, 1], [m.bg.scale, 1], { ease: settle });

  if (reduce || !m) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized responsive webp
      <img
        src={`/speaking/${name}-800.webp`}
        srcSet={`/speaking/${name}-800.webp 800w, /speaking/${name}-1400.webp 1400w, /speaking/${name}-full.webp 2000w`}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        style={{ objectPosition: position }}
        className={className}
      />
    );
  }

  return (
    <span ref={ref} className="relative block">
      {/* the room, with the seated groups and the speaker filled out of it; it sets the box size */}
      { }
      <motion.img
        src={`${base}-bg.webp`}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        style={{ x: bgX, y: bgY, scale: bgScale, transformOrigin: m.bg.origin, objectPosition: position }}
        className={`${className} will-change-transform`}
      />
      <Layer src={`${base}-me.webp`} move={m.me} p={scrollYProgress} position={position} />
      <Layer src={`${base}-left.webp`} move={m.left} p={scrollYProgress} position={position} />
      <Layer src={`${base}-right.webp`} move={m.right} p={scrollYProgress} position={position} />
    </span>
  );
}
