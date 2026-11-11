import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { Backdrop } from "@/components/Backdrop";
import { AssemblyLine } from "@/components/Blueprint";
import { BackHome } from "@/components/BackHome";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/GlassCard";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { site } from "@/content/site";
import { tigerMotors as t } from "@/content/tiger-motors";

export const metadata: Metadata = {
  title: `${t.title}, ${site.name}`,
  description: t.lede,
  alternates: { canonical: "/work/tiger-motors/" },
  openGraph: {
    title: `${t.title}, ${site.name}`,
    description: t.lede,
    url: `${site.url}/work/tiger-motors/`,
    type: "article",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
};

export default function TigerMotorsPage() {
  return (
    <>
      <Backdrop />
      <Nav />
      <main id="main" tabIndex={-1} className="relative isolate outline-none">
        <header className="relative isolate mx-auto max-w-6xl px-5 pb-12 pt-32 md:px-8 md:pt-40">
          <AssemblyLine className="sketch-fade-top absolute bottom-0 right-0 -z-10 hidden w-[620px] lg:block" />
          <div className="rise">
            <Link href="/#work" className="inline-flex items-center gap-1.5 text-sm text-ink-3 transition-colors hover:text-ink">
              <ArrowLeft size={14} />
              Selected work
            </Link>
            <p className="mt-6 text-[13px] text-ink-3">{t.kind}</p>
            <h1 className="mt-2 max-w-[18ch] text-5xl font-semibold leading-[1.05] tracking-[-0.035em] text-ink md:text-6xl">
              {t.title}
            </h1>
            <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-ink-2">{t.lede}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={t.href}
                target="_blank"
                rel="noreferrer"
                style={{ "--nudge": "2px -2px" } as React.CSSProperties}
                className="btn btn-sm btn-primary"
              >
                <span className="btn-label">Visit tigermotorslean.com</span>
                <span className="btn-cell">
                  <ArrowUpRight size={15} weight="bold" />
                </span>
              </a>
              <Link
                href="/research/#tiger-motors-platform"
                className="btn btn-sm btn-frame"
              >
                Read the paper summary
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal>
            <GlassCard tilt={1} className="rounded-4xl p-3 md:p-4">
              {/* eslint-disable-next-line @next/next/no-img-element -- static export, image is pre-sized */}
              <img
                src={t.image}
                srcSet={t.imageSet}
                sizes="(min-width: 1152px) 1088px, 94vw"
                decoding="async"
                alt="Tiger Motors Lean Education Center homepage with an isometric drawing of the assembly lab"
                width={1456}
                height={680}
                className="aspect-[1456/680] w-full rounded-panel border border-line bg-[#0b1120] object-cover md:rounded-2xl"
              />
              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 px-3 pb-3 pt-5 md:grid-cols-4 md:px-4">
                {t.facts.map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-[12px] font-medium uppercase tracking-[0.08em] text-ink-3">{k}</dt>
                    <dd className="mt-1 text-[14px] text-ink-2">{v}</dd>
                  </div>
                ))}
              </dl>
            </GlassCard>
          </Reveal>

          <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 border-y border-line py-10 md:grid-cols-4 md:gap-0 md:divide-x md:divide-line">
            {t.numbers.map((n, i) => (
              <Reveal key={n.label} delay={i * 0.05} className="md:px-8 md:first:pl-0">
                <dt className="sr-only">{n.label}</dt>
                <dd>
                  <p className="flex flex-wrap items-baseline gap-x-1.5 font-mono text-[28px] font-medium leading-tight tracking-tight text-ink md:text-4xl">
                    {n.value}
                    <span className="font-sans text-sm font-normal tracking-normal text-ink-3">{n.unit}</span>
                  </p>
                  <p className="mt-2 text-[14px] leading-snug text-ink-2">{n.label}</p>
                </dd>
              </Reveal>
            ))}
          </dl>

          <div className="grid gap-x-16 gap-y-12 py-20 md:grid-cols-2">
            {t.sections.map((s, i) => (
              <Reveal key={s.label} delay={(i % 2) * 0.05}>
                <h2 className="text-2xl font-semibold tracking-tight text-ink">{s.label}</h2>
                <p className="mt-3 text-[16px] leading-relaxed text-ink-2">{s.text}</p>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <section aria-labelledby="role" className="grid gap-10 border-t border-line pb-24 pt-12 lg:grid-cols-[1fr_280px]">
              <div>
                <h2 id="role" className="text-2xl font-semibold tracking-tight text-ink">My role</h2>
                <ul className="mt-6 space-y-3">
                  {t.role.map((r) => (
                    <li key={r} className="flex gap-3 text-[16px] leading-snug text-ink-2">
                      <Check size={18} weight="bold" className="mt-0.5 shrink-0 text-accent" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
              <aside>
                <h3 className="text-[13px] font-medium text-ink">Keywords</h3>
                <ul className="mt-3 flex flex-wrap gap-x-2 gap-y-2.5">
                  {t.keywords.map((k) => (
                    <li key={k} className="bracket text-[13px] text-ink-2">
                      {k}
                    </li>
                  ))}
                </ul>
              </aside>
            </section>
          </Reveal>
        </div>
        <BackHome fallback="/#work" />
      </main>
      <Footer />
    </>
  );
}
