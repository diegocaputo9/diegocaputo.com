import { ArrowRight, ArrowUpRight, Check } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { featured } from "@/content/site";
import { GlassCard } from "./GlassCard";
import { LoopVideo } from "./LoopVideo";
import { Reveal } from "./Reveal";

export function Featured({ title = "Selected work" }: { title?: string }) {
  return (
    <section id="work" className="mx-auto max-w-[1300px] px-5 pt-14 md:px-8 md:pt-24">
      {/* drafting rule: draws across as the section scrolls in */}
      <div aria-hidden className="sheet-rule mb-8 md:mb-10" />
      <Reveal>
        <h2 className="text-4xl font-semibold tracking-[-0.03em] text-ink md:text-5xl">{title}</h2>
      </Reveal>

      <Reveal delay={0.08} className="mt-12">
        <GlassCard tilt={1.5} className="group rounded-4xl p-3 md:p-4">
          <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr] lg:gap-10">
            <a
              href={featured.href}
              target="_blank"
              rel="noreferrer"
              className="relative block self-center overflow-hidden rounded-panel border md:rounded-2xl border-line bg-[#0b1120]"
            >
              {/* the site's hero, recorded as one exact 28 s cycle so it loops without a seam */}
              <LoopVideo
                src={featured.video}
                still={featured.image}
                stillSet={featured.imageSet}
                sizes="(min-width: 1152px) 600px, (min-width: 1024px) 52vw, 92vw"
                alt="Tiger Motors Lean Education Center homepage with an isometric drawing of the assembly lab, cars moving down the line"
                width={1456}
                height={680}
                className="aspect-[1456/680] w-full object-cover transition-transform duration-700 ease-glide group-hover:scale-[1.02]"
              />
            </a>
            <div className="flex flex-col justify-center px-3 pb-4 lg:px-0 lg:pb-0 lg:pr-6">
              <p className="flex flex-wrap items-center gap-x-2.5 gap-y-2 text-[14px] font-medium text-ink-2">
                <span>
                  {featured.kind}
                  <span aria-hidden className="mx-1.5 text-ink-3">·</span>
                  <span className="font-semibold text-ink">{featured.role}</span>
                </span>
                <span className="rounded-ctl bg-accent/10 px-2.5 py-1 font-mono text-[12px] leading-none text-accent">
                  {featured.grant}
                </span>
              </p>
              <h3 className="mt-1 text-2xl font-semibold tracking-tight text-ink md:text-3xl">{featured.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{featured.summary}</p>
              <ul className="mt-5 space-y-2.5">
                {featured.points.map((p) => (
                  <li key={p} className="flex gap-2.5 text-[14px] leading-snug text-ink-2">
                    <Check size={16} weight="bold" className="mt-0.5 shrink-0 text-accent" />
                    {p}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/work/tiger-motors/"
                  className="btn btn-sm btn-primary w-fit"
                >
                  <span className="btn-label">Read the case study</span>
                  <span className="btn-cell">
                    <ArrowRight size={15} weight="bold" />
                  </span>
                </Link>
                <a
                  href={featured.href}
                  target="_blank"
                  rel="noreferrer"
                  style={{ "--nudge": "2px -2px" } as React.CSSProperties}
                  className="btn btn-sm btn-frame w-fit"
                >
                  Visit the site
                  <ArrowUpRight size={15} weight="bold" />
                </a>
              </div>
            </div>
          </div>
        </GlassCard>
      </Reveal>
    </section>
  );
}
