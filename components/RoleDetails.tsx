"use client";

import { useId, useState } from "react";
import { CaretDown, Plus } from "@phosphor-icons/react";

// One timeline entry: the "+" node on the drafting line opens a longer account
// of the role. The summary (children) is rendered on the server and always shown.
export function RoleDetails({
  title,
  details,
  children,
}: {
  title: string;
  details?: string[];
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();

  if (!details?.length) {
    return (
      <>
        <span aria-hidden className="absolute left-0 top-[7px] grid h-[11px] w-[11px] place-items-center bg-bg">
          <span className="absolute h-px w-[11px] bg-ink-3" />
          <span className="absolute h-[11px] w-px bg-ink-3" />
        </span>
        {children}
      </>
    );
  }

  const toggle = () => setOpen((o) => !o);
  const ease = "ease-glide";
  // closing runs ~20% shorter than opening
  const dur = open ? "duration-500" : "duration-400";

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={id}
        aria-label={`${open ? "Hide" : "Show"} details: ${title}`}
        title={open ? "Hide details" : "Show details"}
        className={`glass group/plus absolute -left-[10.5px] top-[-4px] grid h-8 w-8 place-items-center rounded-ctl text-ink transition-[scale,color,box-shadow] duration-300 ${ease} hover:scale-110 hover:text-accent active:scale-[0.97] ${
          open ? "text-accent shadow-[0_0_0_1px_color-mix(in_oklab,var(--accent)_35%,transparent)]" : ""
        }`}
      >
        <Plus size={16} weight="bold" className={`transition-transform ${dur} ${ease} ${open ? "rotate-45" : ""}`} />
      </button>

      {children}

      <div
        id={id}
        role="region"
        aria-label={`${title}: details`}
        inert={!open}
        className={`grid transition-[grid-template-rows,opacity] ${dur} ${ease} ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="glass mt-4 max-w-[70ch] space-y-2.5 rounded-panel p-4 md:p-5">
            {details.map((d) => (
              <p key={d} className="text-[15px] leading-relaxed text-ink-2">
                {d}
              </p>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={id}
        className="mt-3 inline-flex items-center gap-1.5 rounded-ctl text-[13px] font-medium text-accent transition-opacity hover:opacity-80"
      >
        {/* both labels share one grid cell and crossfade with a slight blur */}
        <span className="grid">
          <span
            aria-hidden={open}
            className={`[grid-area:1/1] transition-[opacity,filter] ${ease} ${
              open ? "opacity-0 blur-[2px] duration-150" : "opacity-100 blur-0 duration-200"
            }`}
          >
            What I did here
          </span>
          <span
            aria-hidden={!open}
            className={`[grid-area:1/1] transition-[opacity,filter] ${ease} ${
              open ? "opacity-100 blur-0 duration-200" : "opacity-0 blur-[2px] duration-150"
            }`}
          >
            Show less
          </span>
        </span>
        <CaretDown size={13} weight="bold" className={`transition-transform ${dur} ${ease} ${open ? "rotate-180" : ""}`} />
      </button>
    </>
  );
}
