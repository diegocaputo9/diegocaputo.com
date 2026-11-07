import { Certificate } from "@phosphor-icons/react/dist/ssr";
import { credentials } from "@/content/site";

// Belt colors follow the Lean Six Sigma convention; the certificate uses the site accent.
const mark = {
  green: "bg-[#2b8a3e] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.25)]",
  black:
    "bg-zinc-900 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.18)] dark:bg-black dark:ring-1 dark:ring-white/15",
  cert: "bg-accent/12 text-accent shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--accent)_22%,transparent)]",
} as const;

export function Credentials() {
  return (
    <div>
      <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink-3">Credentials</p>
      <ul className="mt-3 grid gap-2.5 sm:grid-cols-3">
        {credentials.map((c) => (
          <li
            key={c.title}
            className="glass flex items-center gap-3.5 rounded-[20px] p-3.5 sm:flex-col sm:items-start sm:gap-3 sm:p-4"
          >
            <div className="flex w-full items-center justify-between gap-2 max-sm:w-auto">
              <span
                aria-hidden
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-[11px] font-mono text-[12px] font-semibold tracking-wide ${mark[c.kind]}`}
              >
                {c.kind === "cert" ? <Certificate size={19} weight="duotone" /> : c.mark}
              </span>
              {c.status && (
                <span className="hidden rounded-full bg-accent/10 px-2.5 py-1 font-mono text-[12px] leading-none text-accent sm:inline">
                  {c.status}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[14px] font-medium leading-snug tracking-tight text-ink">{c.title}</p>
              <p className="mt-0.5 text-[12.5px] leading-snug text-ink-3">
                {c.issuer}
                {c.status && <span className="sm:hidden"> · {c.status}</span>}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
