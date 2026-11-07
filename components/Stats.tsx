import { stats } from "@/content/site";
import { Reveal } from "./Reveal";

export function Stats() {
  return (
    <section aria-label="At a glance" className="mx-auto max-w-6xl px-5 md:px-8">
      <dl className="grid grid-cols-2 gap-x-6 gap-y-10 border-y border-line py-10 md:grid-cols-4 md:gap-0 md:divide-x md:divide-line">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.05} className="md:px-8 md:first:pl-0">
            <dt className="sr-only">{s.label}</dt>
            <dd>
              <p className="flex flex-wrap items-baseline gap-x-1.5 font-mono text-[28px] font-medium leading-tight tracking-tight text-ink md:text-4xl">
                {s.value}
                <span className="font-sans text-sm font-normal tracking-normal text-ink-3">
                  {s.unit}
                </span>
              </p>
              <p className="mt-2 text-[14px] leading-snug text-ink-2">{s.label}</p>
            </dd>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}
