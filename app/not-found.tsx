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
      <main id="main" tabIndex={-1} className="relative isolate mx-auto grid outline-none min-h-[100dvh] max-w-[1300px] content-center px-5 py-32 md:px-8">
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
              style={{ "--nudge": "-2px 0" } as React.CSSProperties}
              className="btn btn-sm btn-primary"
            >
              <span className="btn-label">Back to the home page</span>
              <span className="btn-cell">
                <ArrowLeft size={15} weight="bold" />
              </span>
            </Link>
            <Link
              href="/research/"
              className="btn btn-sm btn-frame"
            >
              See the research
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
