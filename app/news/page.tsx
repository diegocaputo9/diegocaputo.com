import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { Backdrop } from "@/components/Backdrop";
import { BackHome } from "@/components/BackHome";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { NewsList } from "@/components/NewsList";
import { Reveal } from "@/components/Reveal";
import { site } from "@/content/site";

const description =
  "Press coverage: the INCOSE Systems Showdown win, the Germany 2026 Lean Six Sigma cohort, the Tiger Motors Lab, the continuous improvement roundtable and the JT Black Lean Engineering award.";

export const metadata: Metadata = {
  title: `In the news, ${site.name}`,
  description,
  alternates: { canonical: "/news/" },
  openGraph: {
    title: `In the news, ${site.name}`,
    description,
    url: `${site.url}/news/`,
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
};

// Every article. The home page shows four on phones and links here.
export default function NewsPage() {
  return (
    <>
      <Backdrop />
      <Nav />
      <main id="main" tabIndex={-1} className="relative isolate pt-12 outline-none md:pt-16">
        <div className="mx-auto max-w-6xl px-5 pt-16 md:px-8">
          <Link href="/#leadership" className="inline-flex items-center gap-1.5 text-sm text-ink-3 transition-colors hover:text-ink">
            <ArrowLeft size={14} />
            Home
          </Link>
        </div>
        <section className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
          <Reveal>
            <h1 className="text-4xl font-semibold tracking-[-0.03em] text-ink md:text-5xl">In the news</h1>
            <div className="mt-6">
              <NewsList />
            </div>
          </Reveal>
        </section>
        <BackHome fallback="/#leadership" />
      </main>
      <Footer />
    </>
  );
}
