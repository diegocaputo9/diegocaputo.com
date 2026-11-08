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
      initial={reduce ? false : { opacity: 0, y: 18, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      // start as soon as the element's top edge peeks in (was: 25% visible,
      // which on phones meant tall blocks appeared only halfway up the screen)
      viewport={{ once: true, amount: 0, margin: "0px 0px -6% 0px" }}
      transition={{ type: "spring", stiffness: 120, damping: 22, mass: 0.8, delay }}
    >
      {children}
    </Comp>
  );
}
