import { ArrowRight, ArrowUpRight, FilePdf } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { papers, researchIntro, researchMaterials } from "@/content/research";
import { ValueStream } from "./Blueprint";
import { Reveal } from "./Reveal";

export function ResearchSnippet() {
  return (
    <section id="research" className="relative isolate mx-auto max-w-6xl px-5 pb-24 pt-24 md:px-8 md:pb-32 md:pt-32">
      {/* value stream map as a faded background behind the heading, fading toward the text */}
      <ValueStream className="sketch-fade-left absolute right-0 top-2 -z-10 hidden w-[520px] lg:block" />
      <Reveal>
        <h2 className="text-4xl font-semibold tracking-[-0.03em] text-ink md:text-5xl">Research</h2>
        <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-ink-2">{researchIntro.dissertation}</p>
      </Reveal>

      {/* Papers as ledger rows: venue/status | title + summary | arrow */}
      <ol className="mt-12">
        {papers.map((p, i) => (
          <Reveal as="li" key={p.slug} delay={i * 0.06} className="border-t border-line last:border-b">
            <Link
              href={`/research/#${p.slug}`}
              className="group grid gap-3 py-7 transition-colors md:grid-cols-[220px_1fr_auto] md:gap-10"
            >
              <div>
                <p className="font-mono text-[12px] text-ink-3">{p.year}</p>
                <p className="mt-1 text-[14px] font-medium leading-snug text-ink">{p.venue}</p>
                <p className="mt-1 text-[13px] text-ink-3">{p.status}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold tracking-tight text-ink transition-colors group-hover:text-accent">
                  {p.short}
                </h3>
                <p className="mt-2 max-w-[62ch] text-[15px] leading-relaxed text-ink-2">{p.summary}</p>
              </div>
              <ArrowUpRight
                size={20}
                className="hidden self-center text-ink-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink md:block"
              />
            </Link>
          </Reveal>
        ))}
      </ol>

      {/* Posters and reports: smaller than the papers; each opens its PDF in the in-page viewer */}
      <Reveal delay={0.06} className="mt-12">
        <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink-3">Posters &amp; reports</p>
        <ul className="mt-4 grid gap-4 sm:grid-cols-3">
          {researchMaterials.map((m) => (
            <li key={m.href}>
              <a
                href={m.href}
                data-pdf-title={`${m.kind}: ${m.title}`}
                target="_blank"
                rel="noreferrer"
                className="group flex h-full gap-3.5 rounded-[20px] border border-line p-2.5 transition-colors hover:border-accent/40 hover:bg-accent/[0.03] sm:flex-col sm:gap-0"
              >
                <span className="block w-[112px] shrink-0 overflow-hidden rounded-xl border border-line bg-white sm:w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized responsive webp */}
                  <img
                    src={m.image}
                    srcSet={m.imageSet}
                    sizes="(min-width: 1152px) 340px, (min-width: 640px) 30vw, 112px"
                    alt={m.alt}
                    width={480}
                    height={360}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                  />
                </span>
                <span className="block min-w-0 sm:px-1.5 sm:pb-1.5 sm:pt-3.5">
                  <span className="block font-mono text-[11.5px] uppercase tracking-[0.12em] text-ink-3">{m.kind}</span>
                  <span className="mt-1 block text-[14px] font-medium leading-snug text-ink transition-colors group-hover:text-accent">
                    {m.title}
                  </span>
                  <span className="mt-1 block text-[12.5px] leading-snug text-ink-3">{m.meta}</span>
                  <span className="mt-2 inline-flex items-center gap-1 text-[12.5px] text-ink-3 transition-colors group-hover:text-accent">
                    <FilePdf size={14} />
                    Open PDF
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={0.1}>
        <Link
          href="/research/"
          className="group mt-10 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[15px] font-medium text-bg transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 active:scale-[0.98]"
        >
          Read about the research
          <ArrowRight size={16} weight="bold" className="transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </Reveal>
    </section>
  );
}
