import { ArrowUpRight, Check } from "@phosphor-icons/react/dist/ssr";
import { featured } from "@/content/site";
import { GlassCard } from "./GlassCard";
import { Reveal } from "./Reveal";

export function Featured() {
  return (
    <section id="work" className="mx-auto max-w-6xl px-5 pt-24 md:px-8 md:pt-32">
      <Reveal>
        <h2 className="text-4xl font-semibold tracking-[-0.03em] text-ink md:text-5xl">Selected work</h2>
      </Reveal>

      <Reveal delay={0.08} className="mt-12">
        <GlassCard tilt={1.5} className="group rounded-[32px] p-3 md:p-4">
          <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr] lg:gap-10">
            <a
              href={featured.href}
              target="_blank"
              rel="noreferrer"
              className="relative block self-center overflow-hidden rounded-[22px] border border-line bg-[#0b1120]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- static export, image is pre-sized */}
              <img
                src={featured.image}
                alt="Tiger Motors Lean Education Center homepage with an isometric drawing of the assembly lab"
                width={1456}
                height={680}
                loading="lazy"
                className="aspect-[1456/680] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
              />
            </a>
            <div className="flex flex-col justify-center px-3 pb-4 lg:px-0 lg:pb-0 lg:pr-6">
              <p className="text-[13px] text-ink-3">{featured.kind}</p>
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
              <a
                href={featured.href}
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-flex h-11 w-fit items-center gap-2 rounded-full bg-ink px-5 text-[14px] font-medium text-bg transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Visit tigermotorslean.com
                <ArrowUpRight size={15} weight="bold" />
              </a>
            </div>
          </div>
        </GlassCard>
      </Reveal>
    </section>
  );
}
