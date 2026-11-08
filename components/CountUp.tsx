"use client";

import { useEffect, useRef, useState } from "react";

// Counts every number inside `value` up from 0 when it scrolls into view
// ("60-80" counts both ends, "170→230" both sides). The server renders the
// final value, so search engines, no-JS and reduced-motion visitors see it as is.
export function CountUp({ value, duration = 1400 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const parts = value.split(/(\d+)/); // odd indexes are the numbers
    const render = (p: number) =>
      parts.map((s, i) => (i % 2 ? String(Math.round(Number(s) * p)) : s)).join("");

    // Only start from zero if it's still below the fold; otherwise leave it.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    setText(render(0));

    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - t0) / duration);
          setText(render(1 - Math.pow(1 - t, 3))); // ease-out
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {text}
    </span>
  );
}
