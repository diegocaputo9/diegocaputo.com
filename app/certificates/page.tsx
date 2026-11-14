import { ArrowLeft, ArrowUpRight, Certificate, Seal } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { Backdrop } from "@/components/Backdrop";
import { BackHome } from "@/components/BackHome";
import { CertLink } from "@/components/CertLink";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { allCredentials, certificates, manufacturingAcademy, site } from "@/content/site";

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
    images: [{ url: "/og-card.png", width: 1200, height: 630 }],
  },
};

const groups = ["Leadership, data and research", "Other training"] as const;

export default function CertificatesPage() {
  return (
    <>
      <Backdrop />
      <Nav />
      <main id="main" tabIndex={-1} className="relative isolate outline-none">
        <header className="mx-auto max-w-[1274px] px-5 pb-6 pt-32 md:px-8 md:pt-40">
          <div className="rise">
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-ink-3 transition-colors hover:text-ink">
              <ArrowLeft size={14} />
              {site.name}
            </Link>
            <h1 className="mt-6 text-5xl font-semibold tracking-[-0.035em] text-ink md:text-6xl">Certificates</h1>
            <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-ink-2">
              Credentials, courses and training, with certificates and course badges.
            </p>
          </div>
        </header>

        <section className="mx-auto max-w-[1274px] px-5 pt-10 md:px-8">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-ink">Credentials</h2>
            <ul className="mt-8">
              {allCredentials.map((c) => (
                <li key={c.title} className="flex min-h-[88px] items-center gap-4 border-t border-line py-4 last:border-b">
                  <span className="grid h-12 w-12 shrink-0 place-items-center">
                    {c.mark && (c.kind === "badge" || c.kind === "msu") ? (
                      // eslint-disable-next-line @next/next/no-img-element -- original static credential badge
                      <img src={c.mark} alt="" width={192} height={192} className="h-12 w-12 object-contain" />
                    ) : <Seal size={24} className="text-ink-3" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[16px] font-medium text-ink">{c.title}</p>
                    <p className="mt-1 text-[14px] text-ink-2">
                      {c.issuer}
                      {c.status && <span className="text-ink-3"> · {c.status}</span>}
                    </p>
                  </div>
                  {c.href && (c.linkLabel ? (
                    <a href={c.href} className="ml-auto shrink-0 text-[13px] text-ink-3 underline decoration-line underline-offset-4 hover:text-accent">{c.linkLabel}</a>
                  ) : <CertLink label="Certificate" href={c.href} title={c.title} className="ml-auto shrink-0" />)}
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        <section id="manufacturing-academy" className="mx-auto max-w-[1274px] scroll-mt-24 px-5 pt-20 md:px-8">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-ink">Apple Manufacturing Academy</h2>
            <p className="mt-3 max-w-[65ch] text-ink-2">Michigan State University & Apple · Online course completion</p>
            <ul className="mt-8">
              {manufacturingAcademy.map((course) => (
                <li key={course.title} className="border-t border-line last:border-b">
                  <div className="flex items-start gap-4 py-5">
                    <a href={course.image} target="_blank" rel="noreferrer" className="shrink-0 rounded-full" aria-label={`View ${course.title} badge`}>
                      {/* eslint-disable-next-line @next/next/no-img-element -- original supplied course badge */}
                      <img src={course.image} alt="" width={600} height={600} loading="lazy" className="h-12 w-12 object-contain" />
                    </a>
                    <div className="min-w-0">
                      <h3 className="text-[16px] font-medium text-ink">{course.title}</h3>
                      <p className="mt-1 text-[14px] leading-relaxed text-ink-2">{course.description}</p>
                    </div>
                    <a href={course.image} target="_blank" rel="noreferrer" className="ml-auto inline-flex shrink-0 items-center gap-1 self-center text-[13px] text-ink-3 underline decoration-line underline-offset-4 hover:text-accent" aria-label={`View ${course.title} badge`}>
                      <span className="hidden sm:inline">Badge</span><ArrowUpRight size={14} aria-hidden />
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        {groups.map((g) => (
          <section key={g} className="mx-auto max-w-[1274px] px-5 pt-20 last-of-type:pb-24 md:px-8">
            <Reveal>
              <h2 className="text-3xl font-semibold tracking-[-0.03em] text-ink">{g}</h2>
              <ul className={g === "Other training" ? "mt-6 grid gap-x-10 sm:grid-cols-2" : "mt-8"}>
                {certificates
                  .filter((c) => c.group === g)
                  .map((c) => (
                    <li key={c.href} className="border-t border-line last:border-b">
                      {g === "Other training" ? (
                        <a href={c.href} target="_blank" rel="noreferrer" aria-label={c.title} className="group flex min-h-11 items-center justify-between gap-3 py-3 text-[13px] text-ink-3 transition-colors hover:text-accent">
                          <span lang={c.lang} className="min-w-0 truncate">{c.shortTitle ?? c.title}</span>
                          <ArrowUpRight size={13} className="shrink-0" aria-hidden />
                        </a>
                      ) : <a
                        href={c.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group grid grid-cols-[48px_1fr_auto] items-center gap-x-4 py-5 md:grid-cols-[48px_110px_1fr_auto] md:gap-x-6"
                      >
                        <span className="row-span-2 grid h-12 w-12 place-items-center md:row-span-1">
                          {c.logo ? (
                            // eslint-disable-next-line @next/next/no-img-element -- supplied issuer logo
                            <img src={c.logo} alt="" width={192} height={192} loading="lazy" className="h-12 w-12 object-contain" />
                          ) : <Certificate size={22} className="text-ink-3" />}
                        </span>
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
                      </a>}
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
