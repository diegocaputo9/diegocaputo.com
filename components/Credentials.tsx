import { ArrowUpRight, Certificate } from "@phosphor-icons/react/dist/ssr";
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
      <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
        {credentials.map((c) => {
          const body = (
            <>
              {c.kind === "badge" ? (
                // eslint-disable-next-line @next/next/no-img-element -- small static badge
                <img
                  src={c.mark}
                  alt=""
                  width={192}
                  height={192}
                  className="h-11 w-11 shrink-0 drop-shadow-[0_2px_6px_rgb(0_0_0/0.18)]"
                />
              ) : (
                <span
                  aria-hidden
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-[12px] font-mono text-[12px] font-semibold tracking-wide ${mark[c.kind]}`}
                >
                  {c.kind === "cert" ? <Certificate size={20} weight="duotone" /> : c.mark}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-medium leading-snug tracking-tight text-ink">{c.title}</p>
                <p className="mt-0.5 text-[12.5px] leading-snug text-ink-3">
                  {c.issuer}
                  {c.status && <span className="text-accent"> · {c.status}</span>}
                </p>
              </div>
            </>
          );
          return (
            <li key={c.title} className="glass rounded-[20px]">
              {c.href ? (
                // quiet link: opens the certificate in the site's PDF viewer
                <a
                  href={c.href}
                  data-pdf-title={`${c.title}, certificate`}
                  className="group flex items-center gap-3.5 p-3.5"
                >
                  {body}
                  <ArrowUpRight
                    size={13}
                    aria-hidden
                    className="shrink-0 self-start text-ink-3/60 transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                  />
                </a>
              ) : (
                <div className="flex items-center gap-3.5 p-3.5">{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
