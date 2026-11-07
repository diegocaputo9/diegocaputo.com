"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { site } from "@/content/site";

// "research" is both a home-page section (snippet) and its own page.
const links = [
  { id: "work", label: "Work" },
  { id: "research", label: "Research", page: "/research/" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

const spring = { type: "spring", stiffness: 380, damping: 32, mass: 0.8 } as const;

export function Nav() {
  const pathname = usePathname();
  const onResearchPage = pathname.startsWith("/research");
  const onHome = pathname === "/";
  const [scrollActive, setActive] = useState<string | null>(null);
  const active = onResearchPage ? "research" : scrollActive;
  const [hovered, setHovered] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  // Pill tightens slightly once the page scrolls (state change: "you left the hero").
  const scale = useTransform(scrollY, [0, 160], [1, reduce ? 1 : 0.96]);

  useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5] },
    );
    sections.forEach((s) => io.observe(s));
    const onTop = new IntersectionObserver(([e]) => e.isIntersecting && setActive(null));
    const top = document.getElementById("top");
    if (top) onTop.observe(top);
    return () => {
      io.disconnect();
      onTop.disconnect();
    };
  }, []);

  // The highlight follows the hovered link, otherwise the active section.
  const lit = hovered ?? active;

  return (
    <header className="fixed inset-x-0 top-4 z-40 flex justify-center px-4">
      <motion.nav
        style={{ scale }}
        aria-label="Primary"
        className="glass glass-strong flex h-14 items-center gap-1 rounded-full pl-2 pr-2"
        onMouseLeave={() => setHovered(null)}
      >
        <a
          href={onHome ? "#top" : "/"}
          className="flex h-10 items-center gap-2 rounded-full px-1.5 text-[15px] sm:px-3 font-semibold tracking-tight text-ink"
        >
          <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-[11px] font-semibold text-bg">
            DC
          </span>
          <span className="hidden sm:inline">{site.name}</span>
        </a>
        <span aria-hidden className="mx-1 hidden h-5 w-px bg-line sm:block" />
        <ul className="flex items-center">
          {links.map((l) => (
            <li key={l.id} className="relative">
              {lit === l.id && (
                <motion.span
                  layoutId="nav-lens"
                  transition={reduce ? { duration: 0 } : spring}
                  className="absolute inset-0 rounded-full bg-ink/[0.06] shadow-[inset_0_1px_0_var(--glass-edge)] dark:bg-white/[0.08]"
                />
              )}
              <a
                href={l.page ?? (onHome ? `#${l.id}` : `/#${l.id}`)}
                onMouseEnter={() => setHovered(l.id)}
                aria-current={active === l.id ? "true" : undefined}
                className={`relative block rounded-full px-2.5 py-2 text-[13px] transition-colors duration-300 sm:px-4 sm:text-sm ${
                  lit === l.id ? "text-ink" : "text-ink-2 hover:text-ink"
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </motion.nav>
    </header>
  );
}
