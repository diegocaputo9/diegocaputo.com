"use client";

import { useRef, useState } from "react";
import { CheckCircle, Microphone, PaperPlaneTilt, X } from "@phosphor-icons/react";
import { site } from "@/content/site";

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "h-11 w-full rounded-[14px] border border-line bg-bg/70 px-3.5 text-[15px] text-ink placeholder:text-ink-3/70 outline-none transition-[border-color,box-shadow] focus:border-[#3b5bdb] focus:shadow-[0_0_0_3px_rgb(59_91_219/0.18)]";
const label = "mb-1.5 block text-[13px] font-medium text-ink-2";

// "Invite me to speak": a form in a dialog that sends through the site's
// contact endpoint, so nobody needs a mail app. Without an endpoint
// configured it falls back to a plain mailto link.
export function InviteForm({ label: cta, fallbackHref }: { label: string; fallbackHref: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const openedAt = useRef(0);
  const [status, setStatus] = useState<Status>("idle");
  const [sentTo, setSentTo] = useState("");

  const btn =
    "glass inline-flex h-12 items-center gap-2 rounded-full px-6 text-[15px] font-medium text-ink transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 active:scale-[0.98]";

  if (!site.contactEndpoint) {
    return (
      <a href={fallbackHref} className={btn}>
        <Microphone size={18} />
        {cta}
      </a>
    );
  }

  const open = () => {
    if (status !== "sending") setStatus("idle");
    openedAt.current = Date.now();
    dialog.current?.showModal();
  };
  const close = () => dialog.current?.close();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    setStatus("sending");
    try {
      const res = await fetch(site.contactEndpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, kind: "Speaking invitation", elapsed: Date.now() - openedAt.current }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setSentTo(data.email);
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <button type="button" onClick={open} aria-haspopup="dialog" className={btn}>
        <Microphone size={18} />
        {cta}
      </button>

      <dialog
        ref={dialog}
        aria-labelledby="invite-title"
        onClick={(e) => e.target === e.currentTarget && close()}
        className="press-dialog m-auto w-[min(560px,calc(100vw-24px))] max-w-none overflow-visible bg-transparent p-0 backdrop:bg-black/50 backdrop:backdrop-blur-sm"
      >
        <div className="glass glass-strong max-h-[calc(100dvh-24px)] overflow-y-auto rounded-[28px] p-5 text-ink sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="invite-title" className="text-2xl font-semibold tracking-tight">
                Invite me to speak
              </h2>
              <p className="mt-1 text-[14px] leading-relaxed text-ink-2">
                Tell me about your event and I&apos;ll reply by email.
              </p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink-2 transition-colors hover:bg-ink/5 hover:text-ink"
            >
              <X size={18} />
            </button>
          </div>

          {status === "sent" ? (
            <div className="py-10 text-center" role="status">
              <CheckCircle size={44} weight="light" className="mx-auto text-[#3b5bdb] dark:text-accent" />
              <p className="mt-3 text-lg font-semibold">Thanks, your message is on its way.</p>
              <p className="mt-1 text-[14px] text-ink-2">I&apos;ll reply to {sentTo}.</p>
              <button
                type="button"
                onClick={close}
                className="mt-6 inline-flex h-11 items-center rounded-full border border-line px-5 text-[14px] font-medium hover:bg-ink/5"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="iv-name" className={label}>
                  Name
                </label>
                <input id="iv-name" name="name" required maxLength={120} autoComplete="name" className={field} />
              </div>
              <div>
                <label htmlFor="iv-email" className={label}>
                  Email
                </label>
                <input
                  id="iv-email"
                  name="email"
                  type="email"
                  required
                  maxLength={200}
                  autoComplete="email"
                  inputMode="email"
                  className={field}
                />
              </div>
              <div>
                <label htmlFor="iv-org" className={label}>
                  Organization <span className="font-normal text-ink-3">(optional)</span>
                </label>
                <input id="iv-org" name="organization" maxLength={160} autoComplete="organization" className={field} />
              </div>
              <div>
                <label htmlFor="iv-date" className={label}>
                  Date <span className="font-normal text-ink-3">(optional)</span>
                </label>
                <input id="iv-date" name="date" maxLength={80} placeholder="e.g. March 2027" className={field} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="iv-event" className={label}>
                  Event or topic
                </label>
                <input
                  id="iv-event"
                  name="event"
                  required
                  maxLength={200}
                  placeholder="e.g. Lean leadership workshop for plant managers"
                  className={field}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="iv-message" className={label}>
                  Message
                </label>
                <textarea
                  id="iv-message"
                  name="message"
                  required
                  rows={5}
                  maxLength={4000}
                  placeholder="Audience, format, length, location…"
                  className={`${field} h-auto resize-y py-3 leading-relaxed`}
                />
              </div>
              {/* honeypot: hidden from people, filled by bots */}
              <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label htmlFor="iv-website">Website</label>
                <input id="iv-website" name="website" tabIndex={-1} autoComplete="off" />
              </div>

              {status === "error" && (
                <p role="alert" className="text-[13.5px] text-red-600 sm:col-span-2 dark:text-red-400">
                  That didn&apos;t send. Please try again, or email{" "}
                  <a href={`mailto:${site.links.email}`} className="underline">
                    {site.links.email}
                  </a>
                  .
                </p>
              )}

              <div className="flex items-center justify-end gap-2 sm:col-span-2">
                <button
                  type="button"
                  onClick={close}
                  className="h-11 rounded-full px-4 text-[14px] font-medium text-ink-2 hover:bg-ink/5 hover:text-ink"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-[#3b5bdb] px-6 text-[15px] font-medium text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_6px_20px_rgb(59_91_219/0.35)] transition-[transform,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:bg-[#3451c7] active:scale-[0.98] disabled:translate-y-0 disabled:opacity-70"
                >
                  <PaperPlaneTilt size={18} weight="light" />
                  {status === "sending" ? "Sending…" : "Send"}
                </button>
              </div>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}
