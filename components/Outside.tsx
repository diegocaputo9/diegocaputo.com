import { InstagramLogo, YoutubeLogo } from "@phosphor-icons/react/dist/ssr";
import { outside } from "@/content/site";
import { Gallery } from "./Gallery";
import { Reveal } from "./Reveal";
import { TerrainViewer } from "./TerrainViewer";
import { ThermalCompare } from "./ThermalCompare";
import { findings } from "./thermal/scene";

function Tags({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 flex flex-wrap gap-x-2 gap-y-2.5">
      {items.map((t) => (
        <li key={t} className="bracket text-[13px] text-ink-2">
          {t}
        </li>
      ))}
    </ul>
  );
}

// Personal section: drone photogrammetry, thermal inspection and Auburn Flyers cycling.
export function Outside() {
  const p = outside.photogrammetry;
  const t = outside.thermal;
  const b = outside.brand;
  const c = outside.cycling;
  return (
    <section id="outside" className="relative isolate mx-auto max-w-[1300px] px-5 py-12 md:px-8 md:py-24">
      {/* drafting rule: draws across as the section scrolls in */}
      <div aria-hidden className="sheet-rule mb-8 md:mb-10" />
      <Reveal className="grid items-end gap-8 lg:grid-cols-[1fr_auto] lg:gap-14">
        <div>
          <h2 className="text-4xl font-semibold tracking-[-0.03em] text-ink md:text-5xl">Outside the lab</h2>
          <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-ink-2">{outside.lede}</p>
        </div>
        <div className="glass flex w-fit items-center gap-4 rounded-3xl p-3 pr-4">
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, small pre-sized logo */}
          <img
            src={b.logo}
            alt={`${b.name} logo`}
            width={64}
            height={64}
            className="h-16 w-16 shrink-0 rounded-xl shadow-[0_4px_14px_rgb(0_0_0/0.18)]"
          />
          <div>
            <p className="text-[16px] font-semibold tracking-tight text-ink">{b.name}</p>
            <p className="text-[13px] font-medium text-ink-3">
              {outside.title}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[
                { href: b.instagram.href, label: b.instagram.handle, Icon: InstagramLogo, aria: `${b.name} on Instagram` },
                { href: b.youtube.href, label: b.youtube.label, Icon: YoutubeLogo, aria: `${b.name} on YouTube` },
              ].map(({ href, label, Icon, aria }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={aria}
                  className="inline-flex h-8 items-center gap-1.5 rounded-ctl bg-ink/[0.05] px-3 text-[13px] text-ink-2 transition-colors hover:bg-ink/[0.09] hover:text-ink dark:bg-white/[0.06] dark:hover:bg-white/[0.1]"
                >
                  <Icon size={15} />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      <div className="mt-14 grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <Reveal>
          <h3 className="text-2xl font-semibold tracking-tight text-ink">{p.title}</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{p.text}</p>
          <Tags items={p.tags} />
          <p className="mt-6 text-[13px] text-ink-3">
            <span className="sm:hidden">Drag sideways to rotate, pinch to zoom, tap to read the elevation.</span>
            <span className="hidden sm:inline">
              Drag to rotate. Pinch, or hold Ctrl and scroll, to zoom. Hover to read the elevation.
            </span>
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <TerrainViewer />
        </Reveal>
      </div>

      <div className="mt-14 grid items-center gap-10 md:mt-20 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
        <Reveal className="lg:order-2">
          <h3 className="text-2xl font-semibold tracking-tight text-ink">{t.title}</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{t.text}</p>
          <ol className="mt-6 space-y-3">
            {findings.map((f) => (
              <li key={f.n} className="flex gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink font-mono text-[12px] text-bg">
                  {f.n}
                </span>
                <p className="text-[14px] leading-snug text-ink-2">
                  <span className="font-medium text-ink">{f.title}.</span> {f.detail}
                </p>
              </li>
            ))}
          </ol>
          <Tags items={t.tags} />
        </Reveal>
        <Reveal delay={0.08} className="lg:order-1">
          <ThermalCompare />
        </Reveal>
      </div>

      <div className="mt-14 grid items-center gap-10 md:mt-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <Reveal>
          <h3 className="text-2xl font-semibold tracking-tight text-ink">{c.title}</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{c.text}</p>
          <ul className="mt-6 space-y-3">
            {c.roles.map((r) => (
              <li key={r.title} className="flex gap-3">
                <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <p className="text-[14px] leading-snug text-ink-2">
                  <span className="font-medium text-ink">{r.title}.</span> {r.detail}
                </p>
              </li>
            ))}
          </ul>
          <Tags items={c.tags} />
        </Reveal>
        <Reveal delay={0.08}>
          <Gallery items={c.photos} label="Auburn Flyers cycling" variant="mosaic" />
          <p className="mt-3 text-[13px] text-ink-3">Open any photo to see the full set.</p>
        </Reveal>
      </div>
    </section>
  );
}
