import { experience } from "@/content/site";
import { Gears } from "./Blueprint";
import { Reveal } from "./Reveal";

export function Experience() {
  return (
    <section id="experience" className="relative isolate mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
      <Gears className="absolute right-[3%] top-16 -z-10 hidden w-[200px] xl:block" />
      <Reveal>
        <h2 className="text-4xl font-semibold tracking-[-0.03em] text-ink md:text-5xl">Experience</h2>
      </Reveal>

      {/* Timeline: a drafting line with "+" nodes, period on the left */}
      <ol className="relative mt-14 md:ml-[150px]">
        <span aria-hidden className="absolute bottom-2 left-[5px] top-2 w-px bg-line md:left-[5px]" />
        {experience.map((r, i) => (
          <Reveal as="li" key={r.role + r.org} delay={Math.min(i, 4) * 0.04} className="relative pb-10 pl-9 last:pb-0">
            <span aria-hidden className="absolute left-0 top-[7px] grid h-[11px] w-[11px] place-items-center bg-bg">
              <span className="absolute h-px w-[11px] bg-ink-3" />
              <span className="absolute h-[11px] w-px bg-ink-3" />
            </span>
            <p className="font-mono text-[12px] text-ink-3 md:absolute md:-left-[150px] md:top-[3px] md:w-[130px] md:text-right">
              {r.period}
            </p>
            <h3 className="mt-1 text-lg font-semibold tracking-tight text-ink md:mt-0">{r.role}</h3>
            <p className="text-[15px] text-ink-2">
              {r.org}
              <span className="text-ink-3"> / {r.place}</span>
            </p>
            <ul className="mt-3 max-w-[70ch] space-y-1.5">
              {r.points.map((p) => (
                <li key={p} className="relative pl-4 text-[15px] leading-relaxed text-ink-2">
                  <span aria-hidden className="absolute left-0 top-[11px] h-px w-2 bg-ink-3" />
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
