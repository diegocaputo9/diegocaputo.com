import { speaking } from "@/content/site";
import { FlowLab } from "./FlowLab";
import { InviteForm } from "./InviteForm";
import { Reveal } from "./Reveal";
import { SpeakingPhotos } from "./SpeakingPhotos";

// Two photos, wide + tall-cropped, so the band reads as one composition.
export function Speaking() {
  return (
    <section id="speaking" className="mx-auto max-w-6xl px-5 pt-14 md:px-8 md:pt-24">
      {/* drafting rule: draws across as the section scrolls in */}
      <div aria-hidden className="sheet-rule mb-8 md:mb-10" />
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <Reveal>
          <h2 className="text-4xl font-semibold tracking-[-0.03em] text-ink md:text-5xl">{speaking.title}</h2>
          <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-ink-2">{speaking.lede}</p>
        </Reveal>
        <Reveal delay={0.06}>
          <InviteForm label={speaking.cta.label} />
        </Reveal>
      </div>

      <SpeakingPhotos />

      {/* a lesson visitors can run themselves */}
      <div className="mt-14 grid items-center gap-10 md:mt-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <Reveal>
          <h3 className="text-2xl font-semibold tracking-tight text-ink">{speaking.lesson.title}</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{speaking.lesson.text}</p>
          <ul className="mt-6 flex flex-wrap gap-x-2 gap-y-2.5">
            {speaking.lesson.tags.map((t) => (
              <li key={t} className="bracket text-[13px] text-ink-2">
                {t}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[13px] text-ink-3">
            <span className="sm:hidden">Drag sideways to turn the model. Change the batch size to run it again.</span>
            <span className="hidden sm:inline">Drag to turn the model. Change the batch size to run it again.</span>
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <FlowLab />
        </Reveal>
      </div>
    </section>
  );
}
