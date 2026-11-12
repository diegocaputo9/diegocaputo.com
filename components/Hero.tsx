import {
  ArrowDown,
  FileText,
  GithubLogo,
  LinkedinLogo,
  MapPin,
} from "@phosphor-icons/react/dist/ssr";
import type { CSSProperties } from "react";
import { site } from "@/content/site";
import { AssemblyLine, RobotArm } from "./Blueprint";
import { Credentials } from "./Credentials";
import { LiquidPanel } from "./liquid/LiquidPanel";
import { HeroCrosshair } from "./HeroCrosshair";
import { Portrait } from "./Portrait";
import { academicProfiles } from "./profiles";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

const social =
  "grid h-10 w-10 place-items-center rounded-ctl text-ink-2 transition-[color,background-color,scale] hover:bg-ink/[0.06] hover:text-ink active:scale-[0.97]";

// First screen: one statement, two actions, and the portrait standing on the
// shop-floor line. Everything else (credentials, focus areas) sits below it.
export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-clip">
      <HeroCrosshair />

      <div className="relative mx-auto grid max-w-6xl items-end gap-x-12 gap-y-10 px-5 pt-[104px] md:px-8 lg:min-h-[min(760px,calc(100dvh-150px))] lg:grid-cols-[1.25fr_0.75fr] lg:pt-[92px]">
        {/* the statement */}
        <div className="pb-4 lg:self-center lg:pb-24">
          <div className="rise" style={d(60)}>
            <h1 className="hero-quote max-w-[17ch] text-[44px] font-semibold leading-[1.03] tracking-[-0.04em] text-ink sm:text-6xl lg:text-[68px]">
              <span aria-hidden className="text-ink-3/60">
                “
              </span>
              {site.headline}
              <span aria-hidden className="text-ink-3/60">
                ”
              </span>
            </h1>
          </div>
          <div className="rise" style={d(160)}>
            <p className="mt-7 flex items-start gap-3.5 text-[15px] leading-snug text-ink-3">
              <span
                aria-hidden
                className="mt-[10px] h-px w-9 shrink-0 bg-ink-3/70"
              />
              <span>
                <span className="font-semibold text-ink">{site.name}</span>
                <span className="block sm:inline">
                  <span className="hidden sm:inline">, </span>
                  {site.title}, {site.org}
                </span>
              </span>
            </p>
          </div>
          <div className="rise" style={d(260)}>
            <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-3">
              <a
                href="#work"
                className="btn btn-primary"
                style={{ "--nudge": "0 2px" } as CSSProperties}
              >
                <span className="btn-label">View work</span>
                <span className="btn-cell">
                  <ArrowDown size={16} weight="bold" />
                </span>
              </a>
              <a href="#contact" className="btn btn-frame">
                Get in touch
              </a>
              {/* quiet text link: opens in the in-page PDF viewer, so visitors stay on the site */}
              {site.links.resume && (
                <a
                  href={site.links.resume}
                  data-pdf-title="Diego Caputo, Résumé"
                  className="group inline-flex h-12 items-center gap-1.5 px-2 text-[15px] font-medium text-ink-2 transition-colors hover:text-ink"
                >
                  <FileText
                    size={17}
                    className="text-ink-3 transition-colors group-hover:text-accent"
                  />
                  <span className="underline decoration-ink-3/40 decoration-1 underline-offset-[5px] transition-colors group-hover:decoration-accent">
                    Résumé
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* profile card with the robot cell drawn behind it; a cut-out portrait takes
            this place once site.portrait is set */}
        {site.portrait ? (
          <div className="rise relative mx-auto w-full max-w-[340px] lg:mr-0 lg:max-w-[420px]" style={d(360)}>
            <RobotArm caption={false} className="absolute -right-[20%] top-[5%] -z-10 w-[74%]" />
            <Portrait />
          </div>
        ) : (
          <div className="rise relative mx-auto w-full max-w-sm pb-10 lg:mr-0 lg:max-w-[400px] lg:self-center lg:pb-24" style={d(360)}>
            <RobotArm caption={false} className="glass-src-arm absolute -top-[200px] right-[-5%] -z-10 hidden w-[230px] lg:block" />
            {/* liquid glass: bends the grid, the robot arm and the crosshair behind it */}
            <LiquidPanel
              className="glass rounded-card p-6 sm:p-7"
              sources={['[data-glass-src="backdrop"]', ".glass-src-arm", '[data-glass-src="crosshair"]']}
              bevel={20}
              refraction={28}
            >
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-panel bg-ink text-lg font-semibold tracking-tight text-bg shadow-[inset_0_1px_0_rgb(255_255_255/0.16)]">
                  DC
                </div>
                <div>
                  <p className="text-lg font-semibold tracking-tight text-ink">{site.name}</p>
                  <p className="text-sm text-ink-2">{site.role}</p>
                </div>
              </div>

              <p className="mt-5 flex items-center gap-1.5 text-sm text-ink-2">
                <MapPin size={16} className="text-ink-3" />
                {site.location}
              </p>

              <ul className="mt-5 flex flex-wrap gap-x-2 gap-y-2.5 border-t border-line pt-5">
                {site.focus.map((f) => (
                  <li key={f} className="bracket text-[13px] text-ink-2">
                    {f}
                  </li>
                ))}
              </ul>

              <div className="-mx-1.5 mt-5 flex gap-1">
                <a href={site.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className={social}>
                  <LinkedinLogo size={20} />
                </a>
                <a href={site.links.github} target="_blank" rel="noreferrer" aria-label="GitHub" className={social}>
                  <GithubLogo size={20} />
                </a>
                {academicProfiles.map(({ label, href, Icon }) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className={social}>
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </LiquidPanel>
          </div>
        )}

        {/* shop floor: the assembly line runs along the hero's base line, behind everything */}
        <AssemblyLine className="sketch-fade-top absolute bottom-0 left-[22%] -z-20 hidden w-[min(760px,66vw)] lg:block" />
      </div>

      {/* base line of the first screen, then the credentials as a title-block strip */}
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div aria-hidden className="sheet-rule" />
        <div className="rise pb-14 pt-7 md:pb-20" style={d(460)}>
          <Credentials wide />
        </div>
      </div>
    </section>
  );
}
