import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { Backdrop } from "@/components/Backdrop";
import { Experience } from "@/components/Experience";
import { BackHome } from "@/components/BackHome";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { site } from "@/content/site";

const description =
  "Full work history: Auburn University research, teaching and the International Lean Six Sigma Green Belt program, plus earlier roles in data, systems engineering and production.";

export const metadata: Metadata = {
  title: `Work history, ${site.name}`,
  description,
  alternates: { canonical: "/experience/" },
  openGraph: {
    title: `Work history, ${site.name}`,
    description,
    url: `${site.url}/experience/`,
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
};

// Full history. The home page shows the first three roles on phones and links here.
export default function ExperiencePage() {
  return (
    <>
      <Backdrop />
      <Nav />
      <main id="main" tabIndex={-1} className="relative isolate pt-12 outline-none md:pt-16">
        <div className="mx-auto max-w-6xl px-5 pt-16 md:px-8">
          <Link href="/#experience" className="inline-flex items-center gap-1.5 text-sm text-ink-3 transition-colors hover:text-ink">
            <ArrowLeft size={14} />
            Home
          </Link>
        </div>
        <Experience title="Work history" />
        <BackHome fallback="/#experience" />
      </main>
      <Footer />
    </>
  );
}
