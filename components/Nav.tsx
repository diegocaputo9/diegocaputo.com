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
// place is framed by four corner brackets: around the name while you are at
// the top of the home page (above Work), then around each tab as its section
// comes up. The frame glides between them and "locks on" when it changes. A
// hairline along the bottom edge fills with the accent color as the page
// scrolls (a gauge for how far down you are).
export function Nav() {
  const pathname = usePathname();
  const onResearchPage = pathname.startsWith("/research");
  const onHome = pathname === "/";
  const [scrollActive, setActive] = useState<string | null>(null);
  // "home" = the name in the top bar
  const active = onResearchPage ? "research" : pathname.startsWith("/work") ? "work" : onHome ? (scrollActive ?? "home") : null;
  const [hovered, setHovered] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 40, mass: 0.4 });

  // After a tab click the page scrolls past other sections; ignore the
  // scroll-spy until it settles so the frame goes straight to the clicked tab.
  const lockUntil = useRef(0);

  // Scroll-spy: the current section is the last one whose top has passed 45%
  // of the screen; above Work it is the name ("home"). At the very bottom of
  // the page Contact wins, since it can be too short to reach the 45% line.
  useEffect(() => {
    if (!onHome) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      if (Date.now() < lockUntil.current) return;
      const line = window.innerHeight * 0.45;
      let id = "home";
      for (const l of links) {
        const el = document.getElementById(l.id);
        if (el && el.getBoundingClientRect().top <= line) id = l.id;
      }
      const doc = document.documentElement;
      if (window.scrollY + window.innerHeight >= doc.scrollHeight - 4) id = "contact";
      setActive(id);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [onHome]);

  // The frame previews the hovered tab, otherwise it sits on the current one.
  const lit = hovered ?? active;
  const bar = useRef<HTMLDivElement>(null);
  // when nothing is lit the frame keeps its last position and fades out in place
  const [box, setBox] = useState({ x: 0, w: 0, h: 30, show: false });
  useLayoutEffect(() => {
    const measure = () => {
      const host = bar.current;
      const el = lit ? host?.querySelector<HTMLElement>(`[data-tab="${lit}"]`) : null;
      if (!host || !el) return setBox((b) => ({ ...b, show: false }));
      const r = el.getBoundingClientRect();
      const x = r.left - host.getBoundingClientRect().left;
      // the name gets a little air around it; tabs are framed as laid out
      setBox(lit === "home" ? { x: x - 7, w: r.width + 14, h: 40, show: true } : { x, w: r.width, h: 30, show: true });
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
      <div ref={bar} className="relative mx-auto flex h-[60px] max-w-[1300px] items-center justify-between gap-3 px-5 md:px-8">
        {/* selection frame: one element that slides and resizes, so the corners never stretch */}
        <motion.span
          aria-hidden
          initial={false}
          animate={{ x: box.x, width: box.w, height: box.h, y: -box.h / 2, opacity: box.show ? 1 : 0 }}
          transition={reduce ? { duration: 0 } : { ...glide, opacity: { duration: 0.2 } }}
          className={`pointer-events-none absolute left-0 top-1/2 transition-colors duration-300 ${
            lit === active ? "text-accent" : "text-ink-3"
          }`}
        >
          {/* remounts when the current place changes: corners start wide and snap in */}
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
        </motion.span>

        <a
          data-tab="home"
          href={onHome ? "#top" : "/"}
          onMouseEnter={() => setHovered("home")}
          onMouseLeave={() => setHovered(null)}
          onFocus={() => setHovered("home")}
          onBlur={() => setHovered(null)}
          onClick={() => {
            lockUntil.current = Date.now() + 900;
            setActive("home");
          }}
          aria-current={active === "home" ? "true" : undefined}
          className="group relative flex h-10 items-center gap-2.5 text-[15px] font-semibold tracking-tight text-ink"
        >
          <span className="grid h-7 w-7 place-items-center rounded-ctl bg-ink text-[12px] font-semibold text-bg transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
            DC
          </span>
          <span className="hidden sm:inline">{site.name}</span>
        </a>

        <nav aria-label="Primary" onMouseLeave={() => setHovered(null)}>
          <ul className="flex items-center">
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
