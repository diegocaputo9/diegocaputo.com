import { speaking } from "@/content/site";
import { InviteForm } from "./InviteForm";
import { LessonBanner } from "./LessonBanner";
import { Reveal } from "./Reveal";
import { SpeakingPhotos } from "./SpeakingPhotos";

// Two photos, wide + tall-cropped, so the band reads as one composition.
export function Speaking() {
  return (
    <section id="speaking" className="mx-auto max-w-[1360px] px-5 pt-14 md:px-8 md:pt-24">
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

      {/* a lesson visitors can run themselves, folded into a banner */}
      <Reveal delay={0.1}>
        <LessonBanner />
      </Reveal>
    </section>
  );
}
