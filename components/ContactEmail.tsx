"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Check, Copy, EnvelopeSimple } from "@phosphor-icons/react";
import { InviteForm } from "./InviteForm";

// The email on the contact card: the address opens the "Send me a message"
// form; the square button next to it copies the address and shows a small
// "Copied" note with an accent check.
export function ContactEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);
  const reduce = useReducedMotion();
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // older browsers: select from a hidden field
      const t = document.createElement("textarea");
      t.value = email;
      t.style.position = "fixed";
      t.style.opacity = "0";
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    // one outlined box: the address (opens the form) | a thin divider | copy
    <span className="relative inline-flex h-12 items-stretch rounded-ctl shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--ink)_16%,transparent)] transition-shadow duration-300 hover:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--ink)_45%,transparent)]">
      <InviteForm
        kind="contact"
        label="Send me a message"
        trigger={(open) => (
          <button
            type="button"
            onClick={open}
            aria-haspopup="dialog"
            className="group/em inline-flex items-center gap-2 rounded-l-ctl pl-[18px] pr-4 text-[15px] text-ink transition-[background-color,scale] duration-200 hover:bg-ink/[0.04] active:scale-[0.98]"
          >
            <EnvelopeSimple size={18} />
            {email}
            <ArrowUpRight size={14} className="text-ink-3 transition-[translate,color] duration-300 group-hover/em:translate-x-0.5 group-hover/em:-translate-y-0.5 group-hover/em:text-accent" />
          </button>
        )}
      />
      <span aria-hidden className="my-2.5 w-px bg-line" />
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Email address copied" : "Copy email address"}
        title="Copy email address"
        className="grid w-12 place-items-center rounded-r-ctl text-ink-2 transition-[background-color,color,scale] duration-200 hover:bg-ink/[0.04] hover:text-ink active:scale-[0.94]"
      >
        {copied ? <Check size={20} weight="bold" className="text-accent" /> : <Copy size={20} />}
      </button>

      {/* toast, just above the buttons */}
      <AnimatePresence>
        {copied && (
          <motion.span
            role="status"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.96, filter: "blur(2px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4, filter: "blur(2px)" }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute -top-12 right-0 flex items-center gap-2 whitespace-nowrap rounded-ctl border border-line bg-bg/90 px-3 py-2 text-[13px] text-ink shadow-[0_8px_24px_-10px_rgb(0_0_0/0.3)] backdrop-blur-md"
          >
            <span className="grid h-4 w-4 place-items-center rounded-full bg-accent text-white">
              <Check size={10} weight="bold" />
            </span>
            Copied to clipboard
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
