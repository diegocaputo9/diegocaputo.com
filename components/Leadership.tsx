import { Medal } from "@phosphor-icons/react/dist/ssr";
import { education, honors, leadership } from "@/content/site";
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
                  <p className="text-[15px] font-medium text-ink">{h.title}</p>
                  <p className="font-mono text-[12px] text-ink-3">{h.year}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
