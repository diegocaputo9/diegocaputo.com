import { ArrowRight, GithubLogo, LinkedinLogo, MapPin } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/content/site";
import { GlassCard } from "./GlassCard";
import type { CSSProperties } from "react";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function Hero() {
  return (
    <section
      id="top"
      className="mx-auto grid min-h-[100dvh] max-w-6xl items-center gap-14 px-5 pb-16 pt-28 md:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20 lg:pt-24"
    >
      <div>
        <div className="rise" style={d(0)}>
          <p className="text-sm font-medium tracking-tight text-ink-3">
            {site.name}, {site.role}
          </p>
        </div>
        <div className="rise" style={d(80)}>
          <h1 className="mt-5 max-w-[16ch] text-5xl font-semibold leading-[1.02] tracking-[-0.035em] text-ink md:text-6xl lg:text-7xl">
            {site.headline}
          </h1>
        </div>
        <div className="rise" style={d(160)}>
          <p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-ink-2">{site.intro}</p>
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
          </div>
        </div>
      </div>

      <div className="rise mx-auto w-full max-w-sm lg:max-w-none" style={d(320)}>
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
            <MapPin size={16} weight="regular" />
            {site.location}
          </p>

          <div className="mt-6 border-t border-line pt-6">
            <ul className="flex flex-wrap gap-2">
              {site.focus.map((f) => (
                <li
                  key={f}
                  className="rounded-full bg-ink/[0.05] px-3 py-1.5 text-[13px] text-ink-2 dark:bg-white/[0.06]"
                >
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex gap-2">
            <a
              href={site.links.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="grid h-10 w-10 place-items-center rounded-full text-ink-2 transition-colors hover:bg-ink/[0.06] hover:text-ink"
            >
              <GithubLogo size={20} />
            </a>
            {site.links.linkedin && (
              <a
                href={site.links.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="grid h-10 w-10 place-items-center rounded-full text-ink-2 transition-colors hover:bg-ink/[0.06] hover:text-ink"
              >
                <LinkedinLogo size={20} />
              </a>
            )}
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
