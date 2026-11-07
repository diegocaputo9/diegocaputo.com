import { Sparkle } from "@phosphor-icons/react/dist/ssr";
import { about } from "@/content/site";
import { Gears } from "./Blueprint";
import { GlassCard } from "./GlassCard";
import { Reveal } from "./Reveal";

export function About() {
  return (
    <section id="about" className="relative isolate mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
      <Gears className="absolute right-[3%] top-4 -z-10 hidden w-[190px] lg:block" />
      <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <Reveal>
          <h2 className="text-4xl font-semibold tracking-[-0.03em] text-ink md:text-5xl">About</h2>
          <p className="mt-6 max-w-[40ch] text-2xl leading-snug tracking-tight text-ink-2 md:text-[26px]">
            {about.body}
          </p>
        </Reveal>

        <div className="flex flex-col gap-8 self-end">
          <Reveal delay={0.06}>
            <GlassCard tilt={0} className="rounded-[24px] p-6">
              <p className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-ink">
                <Sparkle size={18} weight="fill" className="text-accent" />
                AI in industrial engineering
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{about.ai}</p>
            </GlassCard>
          </Reveal>
          <Reveal delay={0.12}>
            <h3 className="text-base font-semibold tracking-tight text-ink">Research interests</h3>
            <ul className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {about.research.map((r) => (
                <li key={r} className="border-t border-line pt-3 text-[15px] leading-snug text-ink-2">
                  {r}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[14px] text-ink-3">Languages: {about.languages}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
