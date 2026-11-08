import { speaking } from "@/content/site";
import { InviteForm } from "./InviteForm";
import { Reveal } from "./Reveal";

const spans = ["md:col-span-7", "md:col-span-5"];

// Two photos, wide + tall-cropped, so the band reads as one composition.
export function Speaking() {
  return (
    <section id="speaking" className="mx-auto max-w-6xl px-5 pt-14 md:px-8 md:pt-32">
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <Reveal>
          <h2 className="text-4xl font-semibold tracking-[-0.03em] text-ink md:text-5xl">{speaking.title}</h2>
          <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-ink-2">{speaking.lede}</p>
        </Reveal>
        <Reveal delay={0.06}>
          <InviteForm label={speaking.cta.label} fallbackHref={speaking.cta.href} />
        </Reveal>
      </div>

      <ul className="mt-10 grid gap-5 md:grid-cols-12">
        {speaking.photos.map((p, i) => (
          <Reveal as="li" key={p.name} delay={i * 0.08} className={spans[i]}>
            <figure className="group relative h-full overflow-hidden rounded-[28px] border border-line bg-bg-2">
              {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized responsive webp */}
              <img
                src={`/speaking/${p.name}-800.webp`}
                srcSet={`/speaking/${p.name}-800.webp 800w, /speaking/${p.name}-1400.webp 1400w`}
                sizes={i === 0 ? "(min-width: 1152px) 640px, (min-width: 768px) 58vw, 92vw" : "(min-width: 1152px) 460px, (min-width: 768px) 42vw, 92vw"}
                alt={p.alt}
                width={p.width}
                height={p.height}
                loading="lazy"
                decoding="async"
                style={{ objectPosition: p.position }}
                className="aspect-[4/3] w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] md:aspect-auto md:h-[380px] lg:h-[420px]"
              />
              <figcaption className="absolute inset-x-3 bottom-3 rounded-[18px] bg-black/45 px-4 py-3 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.18)] backdrop-blur-md md:inset-x-4 md:bottom-4">
                <p className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-white/70">{p.kicker}</p>
                <p className="mt-0.5 text-[15px] font-medium leading-snug">{p.title}</p>
                <p className="text-[13px] text-white/75">{p.meta}</p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
