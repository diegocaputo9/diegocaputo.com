import { ArrowUpRight, Certificate } from "@phosphor-icons/react/dist/ssr";
import { credentials } from "@/content/site";

// Every mark sits in the same 44px rounded square, centred. Belt colors follow
// the Lean Six Sigma convention; the certificate uses the site accent; badges
// sit on a neutral tile.
const mark = {
  badge: "bg-ink/[0.04] shadow-[inset_0_0_0_1px_var(--line)] dark:bg-white/[0.06]",
  green: "bg-[#2b8a3e] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.25)]",
  black:
    "bg-zinc-900 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.18)] dark:bg-black dark:ring-1 dark:ring-white/15",
  cert: "bg-accent/12 text-accent shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--accent)_22%,transparent)]",
} as const;

// Layout: each card spans two rows of the list's grid and passes them down
// (grid-rows-subgrid), so cards side by side share a title row and a subtitle
// row: titles start on one line, subtitles on the next, even when one title
// wraps. Card radius 20 - padding 12 = mark radius 8 (rounded-lg).
const row = "row-span-2 grid grid-rows-subgrid gap-y-0.5";
const inner = `${row} gap-x-3 p-3`;

export function Credentials() {
  return (
    <div>
      <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-ink-3">Credentials</p>
      {/* phones: one glass panel, rows grouped by spacing (see .cred-list); larger: one glass card each */}
      <ul className="cred-list mt-3 grid gap-x-2.5 gap-y-2.5 max-sm:gap-y-0 max-sm:rounded-panel max-sm:py-1 sm:grid-cols-2">
        {credentials.map((c) => {
          const body = (
            <>
              <span
                aria-hidden
                className={`row-span-2 grid h-11 w-11 place-items-center self-start rounded-lg font-mono text-[12px] font-semibold tracking-wide ${mark[c.kind]}`}
              >
                {c.kind === "badge" ? (
                  // eslint-disable-next-line @next/next/no-img-element -- small static badge
                  <img
                    src={c.mark}
                    alt=""
                    width={192}
                    height={192}
                    className="h-9 w-9 drop-shadow-[0_1px_3px_rgb(0_0_0/0.18)]"
                  />
                ) : c.kind === "cert" ? (
                  <Certificate size={22} weight="duotone" />
                ) : (
                  c.mark
                )}
              </span>
              <p className="col-start-2 row-start-1 text-[14px] font-medium leading-snug tracking-tight text-ink">
                {c.title}
              </p>
              <p className="col-start-2 row-start-2 text-[13px] leading-snug text-ink-3">
                {c.issuer}
                {c.status && <span className="text-accent"> · {c.status}</span>}
              </p>
            </>
          );
          return (
            <li key={c.title} className={`glass rounded-panel ${row}`}>
              {c.href ? (
                // quiet link: opens the certificate in the site's PDF viewer
                <a
                  href={c.href}
                  data-pdf-title={`${c.title}, certificate`}
                  className={`group ${inner} grid-cols-[2.75rem_minmax(0,1fr)_auto] rounded-panel transition-[scale] duration-200 ease-glide active:scale-[0.97]`}
                >
                  {body}
                  <ArrowUpRight
                    size={13}
                    aria-hidden
                    className="col-start-3 row-start-1 mt-0.5 self-start text-ink-3/60 transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                  />
                </a>
              ) : (
                <div className={`${inner} grid-cols-[2.75rem_minmax(0,1fr)]`}>{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
