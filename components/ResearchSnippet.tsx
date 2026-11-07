import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { papers, researchIntro } from "@/content/research";
import { Reveal } from "./Reveal";

export function ResearchSnippet() {
  return (
    <section id="research" className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
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

      <Reveal delay={0.1}>
        <Link
          href="/research/"
          className="group mt-10 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[15px] font-medium text-bg transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 active:scale-[0.98]"
        >
          Read the abstracts
          <ArrowRight size={16} weight="bold" className="transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </Reveal>
    </section>
  );
}
