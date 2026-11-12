import { Translate } from "@phosphor-icons/react/dist/ssr";
import { about } from "@/content/site";
import { AiSparkle } from "./AiSparkle";
import { FitCheck } from "./Blueprint";
import { GlassCard } from "./GlassCard";
import { Reveal } from "./Reveal";

// Sits right after the hero: who Diego is, then the numbers row (Stats) as evidence.
export function About() {
  return (
    <section id="about" className="relative isolate mx-auto max-w-[1274px] px-5 pb-16 pt-4 md:px-8 md:pb-16 md:pt-6">
      <div className="grid items-end gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
        <Reveal>
          <h2 className="text-4xl font-semibold tracking-[-0.03em] text-ink md:text-5xl">About</h2>
          <p className="mt-6 max-w-[44ch] text-2xl leading-snug tracking-tight text-ink-2 md:text-[26px]">
            {about.body}
          </p>
          <p className="mt-6 flex items-center gap-2 text-[15px] text-ink-3">
            <Translate size={18} />
            {about.languages}
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          {/* drawing above the AI card: a part that only fits one way */}
          <FitCheck className="mx-auto mb-6 hidden w-[280px] lg:block" />
          <GlassCard tilt={2} className="rounded-3xl p-6 md:p-7">
            <p className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-ink">
              <AiSparkle />
              AI in industrial engineering
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{about.ai}</p>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}
