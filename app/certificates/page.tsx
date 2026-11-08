import { ArrowLeft, ArrowUpRight, Certificate, Seal } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { Backdrop } from "@/components/Backdrop";
import { BackHome } from "@/components/BackHome";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { certificates, credentials, site } from "@/content/site";

const description = `Credentials, certificates and training completed by ${site.name}, with the original certificates.`;

export const metadata: Metadata = {
  title: `Certificates, ${site.name}`,
  description,
  alternates: { canonical: "/certificates/" },
  openGraph: {
    title: `Certificates, ${site.name}`,
    description,
    url: `${site.url}/certificates/`,
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
};

const groups = ["Leadership, data and research", "Other training"] as const;

export default function CertificatesPage() {
  return (
    <>
      <Backdrop />
      <Nav />
      <main id="main" tabIndex={-1} className="relative isolate outline-none">
        <header className="mx-auto max-w-6xl px-5 pb-6 pt-32 md:px-8 md:pt-40">
          <div className="rise">
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-ink-3 transition-colors hover:text-ink">
              <ArrowLeft size={14} />
              {site.name}
            </Link>
            <h1 className="mt-6 text-5xl font-semibold tracking-[-0.035em] text-ink md:text-6xl">Certificates</h1>
            <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-ink-2">
              Credentials, courses and training. Each certificate opens as the original PDF.
            </p>
          </div>
        </header>

        <section className="mx-auto max-w-6xl px-5 pt-10 md:px-8">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-ink">Credentials</h2>
            <ul className="mt-8">
              {credentials.map((c) => (
                <li key={c.title} className="flex gap-4 border-t border-line py-5 last:border-b">
                  <Seal size={22} className="mt-0.5 shrink-0 text-ink-3" />
                  <div>
                    <p className="text-[16px] font-medium text-ink">{c.title}</p>
                    <p className="mt-1 text-[14px] text-ink-2">
                      {c.issuer}
                      {c.status && <span className="text-ink-3"> · {c.status}</span>}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        {groups.map((g) => (
          <section key={g} className="mx-auto max-w-6xl px-5 pt-20 last-of-type:pb-24 md:px-8">
            <Reveal>
              <h2 className="text-3xl font-semibold tracking-[-0.03em] text-ink">{g}</h2>
              <ul className="mt-8">
                {certificates
                  .filter((c) => c.group === g)
                  .map((c) => (
                    <li key={c.href} className="border-t border-line last:border-b">
                      <a
                        href={c.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group grid grid-cols-[22px_1fr_auto] gap-x-4 py-5 md:grid-cols-[22px_110px_1fr_auto] md:gap-x-6"
                      >
                        <Certificate size={22} className="mt-0.5 text-ink-3 transition-colors group-hover:text-accent" />
                        <p className="col-start-2 font-mono text-[12px] text-ink-3 md:pt-1">{c.date}</p>
                        <div className="col-start-2 md:col-start-3 md:row-start-1">
                          <p lang={c.lang} className="text-[16px] font-medium text-ink transition-colors group-hover:text-accent">
                            {c.title}
                          </p>
                          <p className="mt-1 text-[14px] text-ink-2">
                            {c.issuer}
                            {c.note && <span className="text-ink-3"> · {c.note}</span>}
                          </p>
                        </div>
                        <span className="col-start-3 row-start-1 inline-flex items-center gap-1 self-start text-[13px] text-ink-3 transition-colors group-hover:text-ink md:col-start-4">
                          <span className="hidden sm:inline">PDF</span>
                          <ArrowUpRight
                            size={16}
                            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          />
                        </span>
                      </a>
                    </li>
                  ))}
              </ul>
            </Reveal>
          </section>
        ))}
        <BackHome fallback="/#leadership" />
      </main>
      <Footer />
    </>
  );
}
