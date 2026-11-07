import DE from "country-flag-icons/react/3x2/DE";
import ES from "country-flag-icons/react/3x2/ES";
import US from "country-flag-icons/react/3x2/US";
import { experience } from "@/content/site";
import { Gears } from "./Blueprint";
import { CertLink } from "./CertLink";
import { Reveal } from "./Reveal";

const flags = { DE, ES, US };

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
            {r.certificate && <CertLink {...r.certificate} className="mt-3" />}
            {r.countries && (
              <ul aria-label="Program countries" className="mt-4 flex flex-wrap gap-2">
                {r.countries.map((c) => {
                  const Flag = flags[c.code];
                  return (
                    <li
                      key={c.code}
                      className="glass flex h-9 items-center gap-2 rounded-full pl-2.5 pr-3.5 text-[13px] text-ink-2"
                    >
                      <Flag
                        aria-hidden
                        className="h-[14px] w-[21px] shrink-0 rounded-[3px] shadow-[0_0_0_1px_rgb(0_0_0/0.12)]"
                      />
                      {c.name}
                    </li>
                  );
                })}
              </ul>
            )}
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
