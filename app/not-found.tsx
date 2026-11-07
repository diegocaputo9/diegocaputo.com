import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { Backdrop } from "@/components/Backdrop";
import { Andon } from "@/components/Blueprint";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

// Exported as out/404.html, which GitHub Pages serves for any unknown path.
export default function NotFound() {
  return (
    <>
      <Backdrop />
      <Nav />
      <main id="main" tabIndex={-1} className="relative isolate mx-auto grid outline-none min-h-[100dvh] max-w-6xl content-center px-5 py-32 md:px-8">
        <Andon className="sketch-fade-left absolute right-[4%] top-1/2 -z-10 hidden w-[260px] -translate-y-1/2 md:block" />
        <div className="rise max-w-[52ch]">
          <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-ink-3">Error 404 · Line stop</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-[-0.035em] text-ink md:text-6xl">This station is empty.</h1>
          <p className="mt-6 text-lg leading-relaxed text-ink-2">
            The page you were looking for isn&apos;t here. It may have moved, or the link has a typo.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[14px] font-medium text-bg transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <ArrowLeft size={15} weight="bold" />
              Back to the home page
            </Link>
            <Link
              href="/research/"
              className="glass inline-flex h-11 items-center rounded-full px-5 text-[14px] font-medium text-ink transition-transform duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              See the research
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
