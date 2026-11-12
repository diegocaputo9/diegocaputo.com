"use client";

import { useRef, useState } from "react";
import { CubeFocus, Plus } from "@phosphor-icons/react";
import { speaking } from "@/content/site";
import { FlowLab } from "./FlowLab";
import { useLiquidGlass } from "./liquid/useLiquidGlass";

// The lean lesson, folded away: a slim banner under the photos. Clicking it
// opens the lesson (text + 3D model) below; clicking again folds it back.
// The 3D code is only loaded the first time the banner is opened.
export function LessonBanner() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // stays true after the first open
  const panel = useRef<HTMLDivElement>(null);
  const banner = useRef<HTMLButtonElement>(null);
  // liquid glass over the page grid (falls back to the frosted .glass look)
  useLiquidGlass(banner, { sources: ['[data-glass-src="backdrop"]'], bevel: 14, refraction: 22 });
  const l = speaking.lesson;

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) {
      setMounted(true);
      // bring the opened lesson into view once it has its height
      window.setTimeout(() => panel.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }), 420);
    }
  };

  return (
    <div className="mt-5">
      <button
        ref={banner}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls="lean-lesson"
        className="glass group flex w-full items-center gap-3.5 rounded-panel py-2.5 pl-2.5 pr-4 text-left transition-[scale] duration-200 ease-glide active:scale-[0.99] sm:pr-5"
      >
        <span
          aria-hidden
          className="grid h-10 w-10 shrink-0 place-items-center rounded-ctl bg-accent/12 text-accent shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--accent)_22%,transparent)]"
        >
          <CubeFocus size={21} weight="duotone" />
        </span>
        <span className="min-w-0 flex-1 sm:flex sm:items-baseline sm:gap-3">
          <span className="block text-[15px] font-medium tracking-tight text-ink">{l.title}</span>
          <span className="block truncate text-[13px] text-ink-3">{l.teaser}</span>
        </span>
        <span className="hidden text-[13px] font-medium text-ink-2 transition-colors group-hover:text-ink sm:block">
          {open ? "Close" : "Open the 3D lesson"}
        </span>
        <Plus
          size={16}
          weight="bold"
          aria-hidden
          className={`shrink-0 text-ink-2 transition-[rotate,color] duration-300 ease-glide group-hover:text-accent ${open ? "rotate-45" : ""}`}
        />
      </button>

      <div
        id="lean-lesson"
        ref={panel}
        className={`grid scroll-mb-6 transition-[grid-template-rows,opacity] ease-glide motion-reduce:transition-none ${
          open ? "grid-rows-[1fr] opacity-100 duration-500" : "grid-rows-[0fr] opacity-0 duration-400"
        }`}
      >
        <div className="overflow-hidden" inert={!open}>
          <div className="grid items-center gap-8 pb-2 pt-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
            <div>
              <p className="text-[15px] leading-relaxed text-ink-2">{l.text}</p>
              <ul className="mt-6 flex flex-wrap gap-x-2 gap-y-2.5">
                {l.tags.map((t) => (
                  <li key={t} className="bracket text-[13px] text-ink-2">
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[13px] text-ink-3">
                <span className="sm:hidden">Drag sideways to turn the model. Change the batch size to run it again.</span>
                <span className="hidden sm:inline">Drag to turn the model. Change the batch size to run it again.</span>
              </p>
            </div>
            {mounted && <FlowLab />}
          </div>
        </div>
      </div>
    </div>
  );
}
