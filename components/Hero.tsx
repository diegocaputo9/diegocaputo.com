import { ArrowRight, FileText, GithubLogo, LinkedinLogo, MapPin } from "@phosphor-icons/react/dist/ssr";
import type { CSSProperties } from "react";
import { site } from "@/content/site";
import { AssemblyLine, RobotArm } from "./Blueprint";
import { Credentials } from "./Credentials";
import { GlassCard } from "./GlassCard";
import { academicProfiles } from "./profiles";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden">
      {/* blueprint layer: the arm peeks out above the glass card, which refracts its base */}
      <RobotArm className="absolute -z-10 hidden w-[250px] lg:block lg:right-[1%] lg:top-[4%] xl:right-[4%]" />
      {/* assembly line as a faded background along the bottom of the hero */}
      <AssemblyLine className="sketch-fade-top absolute bottom-0 left-1/2 -z-10 hidden w-[min(900px,88vw)] -translate-x-1/2 md:block" />

      <div className="mx-auto grid min-h-[86dvh] max-w-6xl items-center gap-14 px-5 pb-24 pt-28 md:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20 lg:pt-24">
        <div>
          <div className="rise" style={d(0)}>
            <p className="text-sm font-medium tracking-tight text-ink-3">
              {site.title}, {site.org}
            </p>
          </div>
          <div className="rise" style={d(80)}>
            <h1 className="mt-5 max-w-[17ch] text-5xl font-semibold leading-[1.04] tracking-[-0.035em] text-ink md:text-6xl lg:text-[64px]">
              {site.headline}
            </h1>
          </div>
          <div className="rise" style={d(160)}>
            <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-ink-2">{site.intro}</p>
          </div>
          <div className="rise" style={d(240)}>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href="#work"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[15px] font-medium text-bg transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 active:scale-[0.98]"
              >
                View work
                <ArrowRight
                  size={16}
                  weight="bold"
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </a>
              <a
                href="#contact"
                className="glass inline-flex h-12 items-center rounded-full px-6 text-[15px] font-medium text-ink transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Get in touch
              </a>
              {/* quiet text link: opens in the in-page PDF viewer, so visitors stay on the site */}
              {site.links.resume && (
                <a
                  href={site.links.resume}
                  data-pdf-title="Diego Caputo, Résumé"
                  className="group inline-flex h-12 items-center gap-1.5 px-2 text-[15px] font-medium text-ink-2 transition-colors hover:text-ink"
                >
                  <FileText size={17} className="text-ink-3 transition-colors group-hover:text-accent" />
                  <span className="underline decoration-ink-3/40 decoration-1 underline-offset-[5px] transition-colors group-hover:decoration-accent">
                    Résumé
                  </span>
                </a>
              )}
            </div>
          </div>
          <div className="rise mt-10" style={d(320)}>
            <Credentials />
          </div>
        </div>

        <div className="rise mx-auto w-full max-w-sm lg:max-w-none" style={d(400)}>
          <GlassCard className="rounded-[28px] p-7">
            <div className="flex items-center gap-4">
              {/* TODO: replace monogram with a portrait (public/portrait.jpg) */}
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gradient-to-br from-zinc-200 to-zinc-400 text-xl font-semibold tracking-tight text-zinc-800 shadow-[inset_0_1px_0_rgb(255_255_255/0.7)] dark:from-zinc-600 dark:to-zinc-800 dark:text-zinc-100">
                DC
              </div>
              <div>
                <p className="text-lg font-semibold tracking-tight text-ink">{site.name}</p>
                <p className="text-sm text-ink-2">{site.role}</p>
              </div>
            </div>

            <p className="mt-6 flex items-center gap-1.5 text-sm text-ink-2">
              <MapPin size={16} />
              {site.location}
            </p>

            <div className="mt-6 border-t border-line pt-6">
              <ul className="flex flex-wrap gap-x-2 gap-y-2.5">
                {site.focus.map((f) => (
                  <li key={f} className="bracket text-[13px] text-ink-2">
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex gap-2">
              <a
                href={site.links.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="grid h-10 w-10 place-items-center rounded-full text-ink-2 transition-colors hover:bg-ink/[0.06] hover:text-ink"
              >
                <LinkedinLogo size={20} />
              </a>
              <a
                href={site.links.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="grid h-10 w-10 place-items-center rounded-full text-ink-2 transition-colors hover:bg-ink/[0.06] hover:text-ink"
              >
                <GithubLogo size={20} />
              </a>
              {academicProfiles.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full text-ink-2 transition-colors hover:bg-ink/[0.06] hover:text-ink"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

    </section>
  );
}
