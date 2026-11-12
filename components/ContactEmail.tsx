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
    <span className="relative inline-flex items-stretch gap-1.5">
      <InviteForm
        kind="contact"
        label="Send me a message"
        trigger={(open) => (
          <button
            type="button"
            onClick={open}
            aria-haspopup="dialog"
            style={{ "--nudge": "2px -2px" } as React.CSSProperties}
            className="btn btn-line font-normal"
          >
            <EnvelopeSimple size={18} />
            {email}
            <ArrowUpRight size={14} className="text-ink-3" />
          </button>
        )}
      />
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Email address copied" : "Copy email address"}
        title="Copy email address"
        className="btn btn-line w-12 justify-center px-0"
      >
        {copied ? <Check size={17} weight="bold" className="text-accent" /> : <Copy size={17} />}
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
