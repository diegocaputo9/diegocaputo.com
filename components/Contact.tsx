import { ArrowUpRight, EnvelopeSimple, FileText, GithubLogo, LinkedinLogo } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/content/site";
import { Andon } from "./Blueprint";
import { GlassCard } from "./GlassCard";
import { academicProfiles } from "./profiles";
import { Reveal } from "./Reveal";

type Item = {
  label: string;
  value: string;
  href: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  primary?: boolean;
};

export function Contact() {
  const items = [
    { label: "LinkedIn", value: "LinkedIn", href: site.links.linkedin, Icon: LinkedinLogo, primary: true },
    site.links.email && {
      label: "Email",
      value: site.links.email,
      href: `mailto:${site.links.email}`,
      Icon: EnvelopeSimple,
    },
    site.links.resume && { label: "Résumé", value: "Résumé (PDF)", href: site.links.resume, Icon: FileText },
    { label: "GitHub", value: "GitHub", href: site.links.github, Icon: GithubLogo },
    ...academicProfiles.map((p) => ({ ...p, value: p.label })),
  ].filter(Boolean) as Item[];

  return (
    <section id="contact" className="relative isolate mx-auto max-w-[1360px] px-5 py-12 md:flex md:min-h-[calc(100dvh-124px)] md:flex-col md:justify-center md:px-8 md:pb-10 md:pt-24">
      <Andon className="absolute right-10 top-0 -z-10 hidden w-[96px] lg:block" />
      <Reveal>
        <GlassCard tilt={0} className="rounded-4xl px-6 py-14 text-center md:px-16 md:py-20">
          <h2 className="mx-auto max-w-[18ch] text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-ink md:text-6xl">
            Get in touch
          </h2>
          <p className="mx-auto mt-5 max-w-[46ch] text-lg leading-relaxed text-ink-2">
            Open to industry roles, research collaborations, speaking invitations and lean or AI improvement projects.
          </p>
          <ul className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-3">
            {items.map(({ label, value, href, Icon, primary }) => (
              <li key={label}>
                <a
                  href={href}
                  data-pdf-title={href.endsWith(".pdf") ? `${site.name}, résumé` : undefined}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  style={{ "--nudge": "2px -2px" } as React.CSSProperties}
                  className={primary ? "btn btn-primary" : "btn btn-line font-normal"}
                >
                  {primary ? (
                    <>
                      <span className="btn-label">
                        <Icon size={18} />
                        {value}
                      </span>
                      <span className="btn-cell">
                        <ArrowUpRight size={15} weight="bold" />
                      </span>
                    </>
                  ) : (
                    <>
                      <Icon size={18} />
                      {value}
                      <ArrowUpRight size={14} className="text-ink-3" />
                    </>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </GlassCard>
      </Reveal>
    </section>
  );
}
