import { ArrowUpRight, Medal, Newspaper } from "@phosphor-icons/react/dist/ssr";
import { education, honors, leadership, news } from "@/content/site";
import { KanbanCard } from "./Blueprint";
import { GlassCard } from "./GlassCard";
import { Reveal } from "./Reveal";

export function Leadership() {
  const [lead, ...rest] = leadership;
  return (
    <section id="leadership" className="relative isolate mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
      <KanbanCard className="absolute right-[2%] top-16 -z-10 hidden w-[200px] rotate-[4deg] xl:block" />
      <Reveal>
        <h2 className="text-4xl font-semibold tracking-[-0.03em] text-ink md:text-5xl">Leadership & recognition</h2>
      </Reveal>

      {/* Leadership: one feature card + two quieter rows */}
      <div className="mt-14 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal>
          <GlassCard tilt={2} className="rounded-[28px] p-7 md:p-9">
            <p className="font-mono text-[12px] text-ink-3">{lead.period}</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink">{lead.title}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{lead.text}</p>
            <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-line pt-6">
              {[
                ["230", "members"],
                ["10", "officers"],
                ["$8k+", "raised"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="sr-only">{l}</dt>
                  <dd>
                    <p className="font-mono text-2xl text-ink">{v}</p>
                    <p className="text-[13px] text-ink-3">{l}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </GlassCard>
        </Reveal>
        <div className="flex flex-col">
          {rest.map((l, i) => (
            <Reveal key={l.title} delay={0.06 * (i + 1)} className="border-t border-line py-6 first:border-t-0 first:pt-2 lg:first:pt-6">
              <p className="font-mono text-[12px] text-ink-3">{l.period}</p>
              <h3 className="mt-1 text-lg font-semibold tracking-tight text-ink">{l.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{l.text}</p>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Education + honors side by side */}
      <div className="mt-20 grid gap-14 md:grid-cols-2">
        <Reveal>
          <h3 className="text-xl font-semibold tracking-tight text-ink">Education</h3>
          <ul className="mt-5">
            {education.map((e) => (
              <li key={e.degree} className="flex items-baseline justify-between gap-6 border-t border-line py-4">
                <div>
                  <p className="text-[15px] font-medium text-ink">{e.degree}</p>
                  <p className="text-[14px] text-ink-3">{e.school}</p>
                </div>
                <p className="shrink-0 font-mono text-[12px] text-ink-3">{e.year}</p>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.06}>
          <h3 className="text-xl font-semibold tracking-tight text-ink">Honors</h3>
          <ul className="mt-5">
            {honors.map((h) => (
              <li key={h.title} className="flex items-start gap-3 border-t border-line py-4">
                <Medal size={18} className="mt-0.5 shrink-0 text-ink-3" />
                <div>
                  {h.href ? (
                    <a
                      href={h.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-center gap-1 text-[15px] font-medium text-ink hover:text-accent"
                    >
                      {h.title}
                      <ArrowUpRight size={13} className="text-ink-3 group-hover:text-accent" />
                    </a>
                  ) : (
                    <p className="text-[15px] font-medium text-ink">{h.title}</p>
                  )}
                  <p className="font-mono text-[12px] text-ink-3">{h.year}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      {/* In the news: press rows linking out to the articles */}
      <Reveal className="mt-20">
        <h3 className="text-xl font-semibold tracking-tight text-ink">In the news</h3>
        <ul className="mt-5">
          {news.map((n) => (
            <li key={n.href} className="border-t border-line last:border-b">
              <a
                href={n.href}
                target="_blank"
                rel="noreferrer"
                hrefLang={n.lang}
                className="group grid grid-cols-[112px_1fr] gap-x-4 gap-y-1.5 py-5 sm:grid-cols-[176px_1fr] sm:gap-x-6 md:grid-cols-[110px_208px_1fr_auto] md:items-center md:gap-x-8"
              >
                <p className="col-start-2 row-start-1 font-mono text-[12px] text-ink-3 md:col-start-1">{n.date}</p>
                <div className="col-start-1 row-span-2 row-start-1 self-start overflow-hidden rounded-[14px] border border-line bg-bg-2 md:col-start-2 md:row-span-1 md:self-center">
                  {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized responsive webp */}
                  <img
                    src={`/news/${n.image}-320.webp`}
                    srcSet={`/news/${n.image}-320.webp 320w, /news/${n.image}-640.webp 640w`}
                    sizes="(min-width: 768px) 208px, (min-width: 640px) 176px, 112px"
                    alt={n.imageAlt}
                    width={320}
                    height={180}
                    loading="lazy"
                    decoding="async"
                    className="aspect-video w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                  />
                </div>
                <div className="col-start-2 md:col-start-3 md:row-start-1">
                  <p lang={n.lang} className="text-[16px] font-medium leading-snug text-ink transition-colors group-hover:text-accent">
                    {n.title}
                  </p>
                  <p className="mt-1 text-[14px] leading-relaxed text-ink-2">
                    <span className="inline-flex items-center gap-1 text-ink-3">
                      <Newspaper size={13} />
                      {n.source}
                    </span>
                    <span className="text-ink-3"> / </span>
                    {n.note}
                  </p>
                </div>
                <ArrowUpRight
                  size={18}
                  className="hidden text-ink-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink md:col-start-4 md:row-start-1 md:block"
                />
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
