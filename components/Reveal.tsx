"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

// Fades content up as it enters the viewport, once. Used to pace the read
// section by section; collapses to static under reduced motion.
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ type: "spring", stiffness: 90, damping: 20, mass: 0.9, delay }}
    >
      {children}
    </Comp>
  );
}
