import { ArrowUpRight, EnvelopeSimple, GithubLogo, LinkedinLogo } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/content/site";
import { GlassCard } from "./GlassCard";
import { Reveal } from "./Reveal";

export function Contact() {
  const items = [
    site.links.email && {
      label: "Email",
      value: site.links.email,
      href: `mailto:${site.links.email}`,
      Icon: EnvelopeSimple,
    },
    site.links.linkedin && {
      label: "LinkedIn",
      value: "Connect",
      href: site.links.linkedin,
      Icon: LinkedinLogo,
    },
    {
      label: "GitHub",
      value: site.links.github.replace("https://", ""),
      href: site.links.github,
      Icon: GithubLogo,
    },
  ].filter(Boolean) as { label: string; value: string; href: string; Icon: typeof GithubLogo }[];

  return (
    <section id="contact" className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
      <Reveal>
        <GlassCard tilt={0} className="rounded-[36px] px-6 py-14 text-center md:px-16 md:py-20">
          <h2 className="mx-auto max-w-[18ch] text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-ink md:text-6xl">
            Get in touch
          </h2>
          <p className="mx-auto mt-5 max-w-[42ch] text-lg leading-relaxed text-ink-2">
            Open to roles, research collaborations and improvement projects.
          </p>
          <ul className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-3">
            {items.map(({ label, value, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-ink/[0.05] px-5 text-[15px] text-ink transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:bg-ink/[0.08] active:scale-[0.98] dark:bg-white/[0.06] dark:hover:bg-white/[0.1]"
                >
                  <Icon size={18} />
                  <span className="sr-only">{label}: </span>
                  {value}
                  <ArrowUpRight size={14} className="text-ink-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </li>
            ))}
          </ul>
        </GlassCard>
      </Reveal>
    </section>
  );
}
