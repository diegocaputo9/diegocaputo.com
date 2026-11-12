import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { Backdrop } from "@/components/Backdrop";
import { Featured } from "@/components/Featured";
import { BackHome } from "@/components/BackHome";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { Work } from "@/components/Work";
import { site } from "@/content/site";

const description =
  "Every project: the Tiger Motors Lean Education Center, the International Lean Six Sigma Green Belt programs, sawmill diagnostics, AI tools, capstone advising, lab standard work and ChapterCore.";

export const metadata: Metadata = {
  title: `Projects, ${site.name}`,
  description,
  alternates: { canonical: "/work/" },
  openGraph: {
    title: `Projects, ${site.name}`,
    description,
    url: `${site.url}/work/`,
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
};

// All projects. The home page shows only the first two on phones and links here.
export default function WorkPage() {
  return (
    <>
      <Backdrop />
      <Nav />
      <main id="main" tabIndex={-1} className="relative isolate pt-12 outline-none md:pt-16">
        <div className="mx-auto max-w-[1300px] px-5 pt-16 md:px-8">
          <Link href="/#work" className="inline-flex items-center gap-1.5 text-sm text-ink-3 transition-colors hover:text-ink">
            <ArrowLeft size={14} />
            Home
          </Link>
        </div>
        <Featured title="All projects" />
        <Work />
        <BackHome fallback="/#work" />
      </main>
      <Footer />
    </>
  );
}
