"use client";

import { useRef, useState } from "react";
import { CheckCircle, Microphone, PaperPlaneTilt, X } from "@phosphor-icons/react";
import { site } from "@/content/site";
import { setDialogOrigin } from "./dialogOrigin";

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "h-11 w-full rounded-xl border border-line bg-bg/70 px-3.5 text-[15px] text-ink placeholder:text-ink-3/70 outline-none transition-[border-color,box-shadow] focus:border-accent focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--accent)_14%,transparent)]";
const label = "mb-1.5 block text-[13px] font-medium text-ink-2";

// local calendar date as YYYY-MM-DD (what <input type="date"> uses)
const ymd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
// "2027-03-09" -> "Tuesday, March 9, 2027" for the email
const longDate = (v: string) =>
  new Date(`${v}T12:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

// "Invite me to speak": a form in a dialog. The site is static (GitHub Pages),
// so it posts to FormSubmit (site.inviteEndpoint), which emails the entries to
// hello@diegocaputo.com (forwarded to Gmail). Reply-to is the sender's email.
// kind "contact" is the same dialog for people who just want to reach out
// (opened from the email button on the contact card): no date or event fields.
export function InviteForm({
  label: cta,
  kind = "invite",
  trigger,
}: {
  label: string;
  kind?: "invite" | "contact";
  /** custom opener; gets the open handler (default: the "Invite me to speak" button) */
  trigger?: (open: (e: React.MouseEvent<HTMLElement>) => void) => React.ReactNode;
}) {
  const invite = kind === "invite";
  const id = (f: string) => `${invite ? "iv" : "ct"}-${f}`;
  const dialog = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [sentTo, setSentTo] = useState("");
  const [minDate, setMinDate] = useState(""); // tomorrow, set when the form opens
  const [hasDate, setHasDate] = useState(false); // empty date shows muted like a placeholder

  const open = (e: React.MouseEvent<HTMLElement>) => {
    if (status !== "sending") setStatus("idle");
    const t = new Date();
    t.setDate(t.getDate() + 1);
    setMinDate(ymd(t));
    setDialogOrigin(dialog.current, e.currentTarget);
    dialog.current?.showModal();
    // eslint-disable-next-line react-hooks/immutability -- lock page scroll while the dialog is open
    document.documentElement.style.overflow = "hidden";
    // with a mouse, start in Name; on touch screens don't pop the keyboard over the form
    if (window.matchMedia("(pointer: fine)").matches) dialog.current?.querySelector<HTMLInputElement>(`#${id("name")}`)?.focus();
  };
  const close = () => dialog.current?.close();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    setStatus("sending");
    try {
      const res = await fetch(site.inviteEndpoint, {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({
          Name: data.name,
          Email: data.email,
          Organization: data.organization || "-",
          ...(invite ? { Date: data.date ? longDate(data.date) : "-", "Event or topic": data.event } : { Subject: data.event || "-" }),
          Message: data.message,
          _replyto: data.email,
          _subject: (invite ? `Speaking invitation: ${data.event}` : `Website message from ${data.name}${data.event ? `: ${data.event}` : ""}`).slice(0, 140),
          _template: "table",
          _honey: data.website, // bots fill the hidden field; FormSubmit drops those
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { success?: string | boolean };
      if (!res.ok || String(json.success) !== "true") throw new Error(String(res.status));
      setSentTo(data.email);
      setStatus("sent");
      form.reset();
      setHasDate(false);
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      {trigger ? (
        // the handler only touches the dialog ref when clicked, not during render
        // eslint-disable-next-line react-hooks/refs
        trigger(open)
      ) : (
        <button
          type="button"
          onClick={open}
          aria-haspopup="dialog"
          style={{ "--nudge": "0 -2px" } as React.CSSProperties}
          className="btn btn-frame"
        >
          <Microphone size={18} />
          {cta}
        </button>
      )}

      <dialog
        ref={dialog}
        aria-labelledby={id("title")}
        onClose={() => (document.documentElement.style.overflow = "")}
        onClick={(e) => e.target === e.currentTarget && close()}
        className="press-dialog m-auto w-[min(560px,calc(100vw-24px))] max-w-none overflow-visible bg-transparent p-0 backdrop:bg-black/50 backdrop:backdrop-blur-sm"
      >
        <div className="glass glass-strong max-h-[calc(100dvh-24px)] overflow-y-auto overscroll-contain rounded-card p-5 text-left text-ink sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id={id("title")} className="text-2xl font-semibold tracking-tight">
                {invite ? "Invite me to speak" : "Send me a message"}
              </h2>
              <p className="mt-1 text-[14px] leading-relaxed text-ink-2">
                {invite
                  ? "Tell me about your event and I'll reply by email."
                  : "A question, a role, a collaboration or just hello. I'll reply by email."}
              </p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-ctl text-ink-2 transition-[color,background-color,scale] hover:bg-ink/5 hover:text-ink active:scale-[0.97]"
            >
              <X size={18} />
            </button>
          </div>

          {status === "sent" ? (
            <div className="py-10 text-center" role="status">
              <CheckCircle size={44} weight="light" className="mx-auto text-accent" />
              <p className="mt-3 text-lg font-semibold">Thanks, your message is on its way.</p>
              <p className="mt-1 text-[14px] text-ink-2">I&apos;ll reply to {sentTo}.</p>
              <button
                type="button"
                onClick={close}
                className="mt-6 inline-flex h-11 items-center rounded-ctl border border-line px-5 text-[14px] font-medium transition-[background-color,scale] hover:bg-ink/5 active:scale-[0.97]"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="relative mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor={id("name")} className={label}>
                  Name
                </label>
                <input id={id("name")} name="name" required maxLength={120} autoComplete="name" className={field} />
              </div>
              <div>
                <label htmlFor={id("email")} className={label}>
                  Email
                </label>
                <input
                  id={id("email")}
                  name="email"
                  type="email"
                  required
                  maxLength={200}
                  autoComplete="email"
                  inputMode="email"
                  className={field}
                />
              </div>
              <div className={invite ? "" : "sm:col-span-2"}>
                <label htmlFor={id("org")} className={label}>
                  Organization <span className="font-normal text-ink-3">(optional)</span>
                </label>
                <input id={id("org")} name="organization" maxLength={160} autoComplete="organization" className={field} />
              </div>
              {invite && (
              <div>
                <label htmlFor={id("date")} className={label}>
                  Date <span className="font-normal text-ink-3">(optional)</span>
                </label>
                {/* native calendar (system picker on phones); only future dates */}
                <input
                  id={id("date")}
                  name="date"
                  type="date"
                  min={minDate || undefined}
                  onChange={(e) => setHasDate(!!e.currentTarget.value)}
                  className={`${field} ${hasDate ? "" : "text-ink-3/70"} [color-scheme:light] dark:[color-scheme:dark] [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 [&::-webkit-calendar-picker-indicator]:hover:opacity-100 [&::-webkit-date-and-time-value]:text-left`}
                />
              </div>
              )}
              <div className="sm:col-span-2">
                <label htmlFor={id("event")} className={label}>
                  {invite ? "Event or topic" : "Subject"}
                  {!invite && <span className="font-normal text-ink-3"> (optional)</span>}
                </label>
                <input
                  id={id("event")}
                  name="event"
                  required={invite}
                  maxLength={200}
                  placeholder={invite ? "e.g. Lean leadership workshop for plant managers" : "e.g. Research collaboration"}
                  className={field}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor={id("message")} className={label}>
                  Message
                </label>
                <textarea
                  id={id("message")}
                  name="message"
                  required
                  rows={5}
                  maxLength={4000}
                  placeholder={invite ? "Audience, format, length, location…" : "What would you like to talk about?"}
                  className={`${field} h-auto resize-y py-3 leading-relaxed`}
                />
              </div>
              {/* honeypot: hidden from people, filled by bots */}
              <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label htmlFor={id("website")}>Website</label>
                <input id={id("website")} name="website" tabIndex={-1} autoComplete="off" />
              </div>

              {status === "error" && (
                <p role="alert" className="text-[14px] text-red-600 sm:col-span-2 dark:text-red-400">
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
                  className="h-11 rounded-ctl px-4 text-[14px] font-medium text-ink-2 transition-[color,background-color,scale] hover:bg-ink/5 hover:text-ink active:scale-[0.97]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  style={{ "--nudge": "2px -2px" } as React.CSSProperties}
                  className="btn btn-sm btn-primary"
                >
                  <span className="btn-label">{status === "sending" ? "Sending…" : "Send"}</span>
                  <span className="btn-cell">
                    <PaperPlaneTilt size={17} />
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}
