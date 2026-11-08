"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkle } from "@phosphor-icons/react";

// AI sparkle: still until it scrolls into view, then every 4.8 s it does one
// full springy turn (ending exactly where it started, so the loop is seamless)
// while two tiny stars pop out and fade. See .ai-spark-* in globals.css.
export function AiSparkle() {
  const ref = useRef<HTMLSpanElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      aria-hidden
      className={`ai-spark relative inline-grid h-[18px] w-[18px] place-items-center text-accent ${on ? "ai-spark-on" : ""}`}
    >
      <Sparkle size={18} weight="fill" className="ai-spark-main" />
      <Sparkle size={7} weight="fill" className="ai-spark-pop ai-spark-pop-1 absolute" />
      <Sparkle size={6} weight="fill" className="ai-spark-pop ai-spark-pop-2 absolute" />
    </span>
  );
}
