"use client";

import { ArrowsOut } from "@phosphor-icons/react";
import { speaking, type GalleryItem } from "@/content/site";
import { Gallery } from "./Gallery";
import { Reveal } from "./Reveal";

const spans = ["md:col-span-7", "md:col-span-5"];

// The two Teaching & speaking photos keep their captioned layout; each opens
// the shared full-screen viewer (2000px file), and the viewer steps between them.
const items: GalleryItem[] = speaking.photos.map((p) => ({
  thumb: `/speaking/${p.name}-800.webp`,
  src: `/speaking/${p.name}-full.webp`,
  alt: p.alt,
  caption: p.title,
  width: p.width,
  height: p.height,
}));

export function SpeakingPhotos() {
  return (
    <Gallery items={items} label={speaking.title}>
      {/* full bleed: the two photos sit flush, edge to edge across the screen,
          with their captions in a strip underneath instead of over the image */}
      <ul className="mt-7 ml-[calc(50%-50vw)] grid w-screen border-y border-line md:grid-cols-12">
        {speaking.photos.map((p, i) => (
          <Reveal as="li" key={p.name} delay={i * 0.08} className={`${spans[i]} ${i ? "border-t border-line md:border-l md:border-t-0" : ""}`}>
            <button
              type="button"
              data-open={i}
              aria-haspopup="dialog"
              aria-label={`Open photo: ${p.title}`}
              className="group relative flex h-full w-full cursor-zoom-in flex-col justify-start text-left"
            >
              <span className="relative block overflow-hidden bg-bg-2">
                {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized responsive webp */}
                <img
                  src={`/speaking/${p.name}-800.webp`}
                  srcSet={`/speaking/${p.name}-800.webp 800w, /speaking/${p.name}-1400.webp 1400w, /speaking/${p.name}-full.webp 2000w`}
                  sizes={i === 0 ? "(min-width: 768px) 58vw, 100vw" : "(min-width: 768px) 42vw, 100vw"}
                  alt={p.alt}
                  width={p.width}
                  height={p.height}
                  loading="lazy"
                  decoding="async"
                  style={{ objectPosition: p.position }}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-[900ms] ease-glide group-hover:scale-[1.02] md:aspect-auto md:h-[clamp(260px,calc(100dvh-510px),520px)]"
                />
                <span className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-ctl bg-black/45 text-white opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <ArrowsOut size={14} weight="bold" />
                </span>
              </span>
              {/* caption strip */}
              <span className={`flex flex-1 flex-col gap-1 border-t sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 border-line px-5 py-3 md:py-3 ${i === 0 ? "md:pl-[max(2rem,calc(50vw-605px))] md:pr-8" : "md:pl-8 md:pr-[max(2rem,calc(50vw-605px))]"}`}>
                <span className="min-w-0">
                  <span className="block text-[12px] font-medium uppercase tracking-[0.08em] text-ink-3">{p.kicker}</span>
                  <span className="mt-1 block text-[16px] font-medium leading-snug tracking-tight text-ink transition-colors group-hover:text-accent">{p.title}</span>
                </span>
                <span className="shrink-0 font-mono text-[12px] text-ink-3">{p.meta}</span>
              </span>
            </button>
          </Reveal>
        ))}
      </ul>
    </Gallery>
  );
}
