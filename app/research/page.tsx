import { ArrowLeft, ArrowUpRight, Presentation } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { Backdrop } from "@/components/Backdrop";
import { Gears } from "@/components/Blueprint";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/GlassCard";
import { Nav } from "@/components/Nav";
import { academicProfiles } from "@/components/profiles";
import { Reveal } from "@/components/Reveal";
import { papers, presentations, researchIntro } from "@/content/research";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `Research, ${site.name}`,
  description: researchIntro.dissertation,
  alternates: { canonical: "/research/" },
  openGraph: {
    title: `Research, ${site.name}`,
    description: researchIntro.dissertation,
    url: `${site.url}/research/`,
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
};

// schema.org: each work-in-progress paper as a ScholarlyArticle by Diego.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": papers.map((p) => ({
    "@type": "ScholarlyArticle",
    headline: p.title,
    author: p.authors.replace(/ et al\.$/, "").split(", ").map((name) => ({ "@type": "Person", name })),
    about: p.keywords,
    description: p.summary,
    url: `${site.url}/research/#${p.slug}`,
    creativeWorkStatus: p.status,
  })),
};

export default function ResearchPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Backdrop />
      <Nav />
      <main className="relative isolate">
        <Gears className="absolute right-[4%] top-28 -z-10 hidden w-[210px] lg:block" />

        <header className="mx-auto max-w-6xl px-5 pb-10 pt-32 md:px-8 md:pt-40">
          <div className="rise">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-ink-3 transition-colors hover:text-ink"
            >
              <ArrowLeft size={14} />
              {site.name}
            </Link>
            <h1 className="mt-6 text-5xl font-semibold tracking-[-0.035em] text-ink md:text-6xl">Research</h1>
            <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-ink-2">{researchIntro.dissertation}</p>
            <p className="mt-4 max-w-[60ch] text-[15px] leading-relaxed text-ink-3">{researchIntro.thread}</p>
            <ul className="mt-8 flex flex-wrap gap-2">
              {academicProfiles.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="glass inline-flex h-10 items-center gap-2 rounded-full px-4 text-[14px] text-ink transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    <Icon size={16} />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </header>

        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 md:px-8">
          {papers.map((p, i) => (
            <Reveal key={p.slug} delay={i === 0 ? 0.1 : 0}>
              <article id={p.slug} className="scroll-mt-28">
                <GlassCard tilt={0} className="rounded-[28px] p-6 md:p-10">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-ink px-3 py-1 text-[12px] font-medium text-bg">{p.venue}</span>
                    <span className="rounded-full bg-ink/[0.05] px-3 py-1 text-[12px] text-ink-2 dark:bg-white/[0.06]">
                      {p.status}
                    </span>
                    <span className="rounded-full border border-line px-3 py-1 text-[12px] text-ink-2">{p.type}</span>
                    <span className="font-mono text-[12px] text-ink-3">{p.year}</span>
                  </div>
                  <h2 className="mt-5 max-w-[40ch] text-2xl font-semibold leading-snug tracking-tight text-ink md:text-[28px]">
                    {p.title}
                  </h2>
                  <p className="mt-3 text-[14px] text-ink-3">{p.authors}</p>

                  <div className="mt-8 grid gap-10 border-t border-line pt-8 lg:grid-cols-[1fr_220px]">
                    {/* Structured description: Purpose / Design / Findings / Implications */}
                    <dl className="grid gap-x-10 gap-y-7 md:grid-cols-2">
                      {p.sections.map((sec) => (
                        <div key={sec.label}>
                          <dt className="text-[14px] font-semibold tracking-tight text-ink">{sec.label}</dt>
                          <dd className="mt-2 text-[15px] leading-relaxed text-ink-2">{sec.text}</dd>
                        </div>
                      ))}
                    </dl>
                    <aside>
                      <h3 className="text-[13px] font-medium text-ink">Keywords</h3>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {p.keywords.map((k) => (
                          <li key={k} className="rounded-full border border-line px-2.5 py-1 text-[12px] text-ink-2">
                            {k}
                          </li>
                        ))}
                      </ul>
                      {p.link && (
                        <a
                          href={p.link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="group mt-6 inline-flex items-center gap-1.5 text-[14px] font-medium text-ink hover:text-accent"
                        >
                          {p.link.label}
                          <ArrowUpRight
                            size={14}
                            className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          />
                        </a>
                      )}
                    </aside>
                  </div>
                </GlassCard>
              </article>
            </Reveal>
          ))}
        </div>

        <section className="mx-auto max-w-6xl px-5 py-24 md:px-8">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-ink">Presentations</h2>
            <ul className="mt-8">
              {presentations.map((pr) => (
                <li key={pr.title} className="flex gap-4 border-t border-line py-6 last:border-b">
                  <Presentation size={22} className="mt-0.5 shrink-0 text-ink-3" />
                  <div>
                    <p className="font-mono text-[12px] text-ink-3">{pr.year}</p>
                    <p className="mt-1 text-[16px] font-medium text-ink">{pr.title}</p>
                    <p className="mt-1 text-[14px] text-ink-2">
                      {pr.venue}. {pr.note}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
