import {
  ArrowUpRight,
  Brain,
  ClipboardText,
  Factory,
  GlobeHemisphereEast,
  Package,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { projects, type Project } from "@/content/site";
import { Gallery } from "./Gallery";
import { GlassCard } from "./GlassCard";
import { PressLightbox } from "./PressLightbox";
import { Reveal } from "./Reveal";

// Bento rhythm: 7/5, 5/7, 6/6 on a 12-col grid.
const spans = ["md:col-span-7", "md:col-span-5", "md:col-span-5", "md:col-span-7", "md:col-span-6", "md:col-span-6"];

const icon = {
  germany: GlobeHemisphereEast,
  plant: Factory,
  ai: Brain,
  asrs: Package,
  standard: ClipboardText,
  app: UsersThree,
};

// Each tile gets its own drafting texture so the bento never reads as identical cards.
const texture: Record<Project["visual"], string> = {
  germany: "bg-[repeating-radial-gradient(circle_at_85%_120%,var(--grid)_0_1px,transparent_1px_22px)]",
  plant: "bg-[repeating-linear-gradient(90deg,var(--grid)_0_1px,transparent_1px_64px)]",
  ai: "tile-grid",
  asrs: "bg-[repeating-linear-gradient(0deg,var(--grid)_0_1px,transparent_1px_18px),repeating-linear-gradient(90deg,var(--grid)_0_1px,transparent_1px_54px)]",
  standard: "bg-[repeating-linear-gradient(0deg,var(--grid)_0_1px,transparent_1px_14px)]",
  app: "bg-[repeating-linear-gradient(135deg,var(--grid)_0_1px,transparent_1px_16px)]",
};

// phoneKeep: on phones show only these projects (by title) and link to /work/ for the rest.
export function Work({ phoneKeep }: { phoneKeep?: string[] }) {
  return (
    <section className="mx-auto max-w-[1360px] px-5 pb-4 pt-5 md:px-8 md:pb-6">
      <ul className="grid grid-cols-1 gap-5 md:grid-cols-12">
        {projects.map((p, i) => {
          const Icon = icon[p.visual];
          return (
            <Reveal
              as="li"
              key={p.title}
              delay={(i % 2) * 0.03}
              className={`${spans[i]} ${phoneKeep && !phoneKeep.includes(p.title) ? "max-md:hidden" : ""}`}
            >
              <GlassCard tilt={2.5} className="group flex h-full flex-col rounded-card p-3">
                {p.image ? (
                  <figure className="relative">
                    <PressLightbox image={p.image} articleHref={p.press?.href} />
                    {p.badge && (
                      // eslint-disable-next-line @next/next/no-img-element -- small static badge
                      <img
                        src={p.badge.src}
                        alt={p.badge.alt}
                        width={192}
                        height={192}
                        loading="lazy"
                        className="pointer-events-none absolute -bottom-6 right-4 h-[72px] w-[72px] drop-shadow-[0_6px_16px_rgb(0_0_0/0.22)] transition-transform duration-500 ease-glide group-hover:-translate-y-1 group-hover:rotate-[-4deg] md:h-[84px] md:w-[84px]"
                      />
                    )}
                    <figcaption className="mt-2 px-1 pr-24 text-[12px] leading-snug text-ink-3">
                      {p.image.credit}
                    </figcaption>
                  </figure>
                ) : p.photo ? (
                  <figure>
                    <Gallery variant="hero" label={p.photo.caption} items={[p.photo]} />
                    <figcaption className="mt-2 px-1 text-[12px] leading-snug text-ink-3">
                      {p.photo.credit}
                    </figcaption>
                  </figure>
                ) : (
                  <div
                    className={`relative min-h-28 flex-1 overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-100/80 to-zinc-200/40 dark:from-zinc-800/50 dark:to-zinc-900/30 ${texture[p.visual]}`}
                  >
                    <Icon
                      size={38}
                      weight="thin"
                      className="absolute bottom-4 left-4 text-ink-3 transition-transform duration-500 ease-glide group-hover:-translate-y-1"
                    />
                    <span className="absolute right-4 top-3 font-mono text-[12px] text-ink-3">{p.year}</span>
                  </div>
                )}
                <div className="px-3 pb-3 pt-5">
                  <p className="text-[14px] font-semibold tracking-tight text-ink-2">{p.kind}</p>
                  <h3 className="mt-1 text-xl font-semibold tracking-tight text-ink">{p.title}</h3>
                  <p className="mt-2 max-w-[52ch] text-[15px] leading-relaxed text-ink-2">{p.summary}</p>
                  {p.press && (
                    <a
                      href={p.press.href}
                      target="_blank"
                      rel="noreferrer"
                      hrefLang="de"
                      className="group/press mt-5 flex items-start gap-3 rounded-2xl transition-[color,background-color,border-color,scale] duration-200 ease-glide active:scale-[0.97] md:border md:border-line md:p-3.5 md:hover:border-accent/40 md:hover:bg-accent/[0.04]"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block text-[12px] font-medium uppercase tracking-[0.08em] text-ink-3">
                          In the press · {p.press.outlet} · {p.press.date}
                        </span>
                        <span lang="de" className="mt-1 block text-[14px] font-medium leading-snug text-ink">
                          {p.press.title}
                        </span>
                        <span className="mt-1 block text-[13px] text-ink-3">Article in German</span>
                      </span>
                      <ArrowUpRight
                        size={17}
                        weight="bold"
                        className="mt-0.5 shrink-0 text-ink-3 transition-[transform,color] duration-300 group-hover/press:-translate-y-0.5 group-hover/press:translate-x-0.5 group-hover/press:text-accent"
                      />
                    </a>
                  )}
                  {p.gallery && (
                    <Gallery variant={p.gallery.wide ? "wide" : "strip"} label={p.gallery.label} items={p.gallery.items} />
                  )}
                </div>
              </GlassCard>
            </Reveal>
          );
        })}
      </ul>
      {phoneKeep && (
        <Link
          href="/work/"
          className="group mt-6 inline-flex items-center gap-1.5 text-[14px] font-medium text-ink-2 transition-colors hover:text-accent md:hidden"
        >
          All projects ({projects.length + 1})
          <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      )}
    </section>
  );
}
