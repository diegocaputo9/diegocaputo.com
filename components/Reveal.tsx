"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

// Fades content up as it enters the viewport, once. Used to pace the read
// section by section; collapses to static under reduced motion.
//
// Rows wrapped in <RevealItem> inside a Reveal arrive one after another,
// ~30 ms apart, after the block itself starts.
const STAGGER = 0.03;

const block: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const row: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 170, damping: 26 } },
};

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
      variants={block}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      // start as soon as the element's top edge peeks in (was: 25% visible,
      // which on phones meant tall blocks appeared only halfway up the screen)
      viewport={{ once: true, amount: 0, margin: "0px 0px -6% 0px" }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 22,
        mass: 0.8,
        delay,
        delayChildren: delay + 0.06,
        staggerChildren: STAGGER,
      }}
    >
      {children}
    </Comp>
  );
}

// One row of a list inside a Reveal (see above).
export function RevealItem({
  children,
  className,
  as = "li",
}: {
  children: ReactNode;
  className?: string;
  as?: "li" | "div";
}) {
  const Comp = motion[as];
  return (
    <Comp className={className} variants={row}>
      {children}
    </Comp>
  );
}
