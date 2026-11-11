"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { site } from "@/content/site";

// All links scroll to home-page sections; from /research they jump back home.
const links = [
  { id: "work", label: "Work" },
  { id: "research", label: "Research" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

const glide = { type: "spring", stiffness: 420, damping: 34, mass: 0.7 } as const;
const lock = { type: "spring", stiffness: 520, damping: 22, mass: 0.6 } as const;

// One corner of the selection frame (a drafting bracket).
const corner = "absolute h-[7px] w-[7px] border-current";

// Top bar: the name on the left, plain text tabs on the right. The current
// tab is framed by four corner brackets that glide between tabs and "lock on"
// when the section changes. A hairline along the bottom edge fills with the
// accent color as the page scrolls (a gauge for how far down you are).
export function Nav() {
  const pathname = usePathname();
  const onResearchPage = pathname.startsWith("/research");
  const onHome = pathname === "/";
  const [scrollActive, setActive] = useState<string | null>(null);
  const active = onResearchPage ? "research" : pathname.startsWith("/work") ? "work" : scrollActive;
  const [hovered, setHovered] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 40, mass: 0.4 });

  // After a tab click the page scrolls past other sections; ignore the
  // scroll-spy until it settles so the frame goes straight to the clicked tab.
  const lockUntil = useRef(0);

  useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        if (Date.now() < lockUntil.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5] },
    );
    sections.forEach((s) => io.observe(s));
    const onTop = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && Date.now() >= lockUntil.current) setActive(null);
    });
    const top = document.getElementById("top");
    if (top) onTop.observe(top);
    return () => {
      io.disconnect();
      onTop.disconnect();
    };
  }, []);

  // The frame previews the hovered tab, otherwise it sits on the current one.
  const lit = hovered ?? active;
  const list = useRef<HTMLUListElement>(null);
  // when nothing is lit the frame keeps its last position and fades out in place
  const [box, setBox] = useState({ x: 0, w: 0, show: false });
  useLayoutEffect(() => {
    const measure = () => {
      const el = lit ? list.current?.querySelector<HTMLElement>(`[data-tab="${lit}"]`) : null;
      setBox((b) => (el ? { x: el.offsetLeft, w: el.offsetWidth, show: true } : { ...b, show: false }));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [lit]);

  return (
    <header className="nav-bar fixed inset-x-0 top-0 z-40">
      <a
        href="#main"
        className="fixed left-4 top-3 z-50 -translate-y-24 whitespace-nowrap rounded-ctl bg-ink px-5 py-3 text-[14px] font-medium text-bg focus-visible:translate-y-0"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-[60px] max-w-6xl items-center justify-between gap-3 px-5 md:px-8">
        <a
          href={onHome ? "#top" : "/"}
          onClick={() => {
            lockUntil.current = Date.now() + 900;
            setActive(null);
          }}
          className="group flex h-10 items-center gap-2.5 text-[15px] font-semibold tracking-tight text-ink"
        >
          <span className="grid h-7 w-7 place-items-center rounded-ctl bg-ink text-[12px] font-semibold text-bg transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
            DC
          </span>
          <span className="hidden sm:inline">{site.name}</span>
        </a>

        <nav aria-label="Primary" onMouseLeave={() => setHovered(null)}>
          <ul ref={list} className="relative flex items-center">
            {/* selection frame: one element that slides and resizes, so the corners never stretch */}
            <motion.li
              aria-hidden
              initial={false}
              animate={{ x: box.x, width: box.w, opacity: box.show ? 1 : 0 }}
              transition={reduce ? { duration: 0 } : { ...glide, opacity: { duration: 0.2 } }}
              className={`pointer-events-none absolute left-0 top-1/2 -mt-[15px] h-[30px] transition-colors duration-300 ${
                lit === active ? "text-accent" : "text-ink-3"
              }`}
            >
              {/* remounts when the current section changes: corners start wide and snap in */}
              <motion.span
                key={active ?? "none"}
                initial={reduce ? false : { scale: 1.22, opacity: 0.3 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={lock}
                className="absolute inset-0 block"
              >
                <span className={`${corner} left-0 top-0 border-l-[1.5px] border-t-[1.5px]`} />
                <span className={`${corner} right-0 top-0 border-r-[1.5px] border-t-[1.5px]`} />
                <span className={`${corner} bottom-0 left-0 border-b-[1.5px] border-l-[1.5px]`} />
                <span className={`${corner} bottom-0 right-0 border-b-[1.5px] border-r-[1.5px]`} />
              </motion.span>
            </motion.li>
            {links.map((l) => (
              <li key={l.id}>
                <a
                  data-tab={l.id}
                  href={onHome ? `#${l.id}` : `/#${l.id}`}
                  onMouseEnter={() => setHovered(l.id)}
                  onFocus={() => setHovered(l.id)}
                  onBlur={() => setHovered(null)}
                  onClick={() => {
                    lockUntil.current = Date.now() + 900;
                    setActive(l.id);
                  }}
                  aria-current={active === l.id ? "true" : undefined}
                  className={`relative block px-2.5 py-2.5 text-[13px] transition-colors duration-300 sm:px-4 sm:text-[14px] ${
                    active === l.id ? "text-ink" : lit === l.id ? "text-ink" : "text-ink-3 hover:text-ink"
                  }`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {/* scroll gauge */}
      <motion.span
        aria-hidden
        style={{ scaleX: reduce ? scrollYProgress : progress }}
        className="absolute inset-x-0 bottom-[-1px] block h-px origin-left bg-accent"
      />
    </header>
  );
}
