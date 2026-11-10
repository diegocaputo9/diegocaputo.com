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
      <ul className="mt-10 grid gap-5 md:grid-cols-12">
        {speaking.photos.map((p, i) => (
          <Reveal as="li" key={p.name} delay={i * 0.08} className={spans[i]}>
            <button
              type="button"
              data-open={i}
              aria-haspopup="dialog"
              aria-label={`Open photo: ${p.title}`}
              className="group relative block h-full w-full cursor-zoom-in overflow-hidden rounded-card border border-line bg-bg-2 text-left transition-[scale] duration-200 ease-glide active:scale-[0.97]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized responsive webp */}
              <img
                src={`/speaking/${p.name}-800.webp`}
                srcSet={`/speaking/${p.name}-800.webp 800w, /speaking/${p.name}-1400.webp 1400w`}
                sizes={
                  i === 0
                    ? "(min-width: 1152px) 640px, (min-width: 768px) 58vw, 92vw"
                    : "(min-width: 1152px) 460px, (min-width: 768px) 42vw, 92vw"
                }
                alt={p.alt}
                width={p.width}
                height={p.height}
                loading="lazy"
                decoding="async"
                style={{ objectPosition: p.position }}
                className="aspect-[4/3] w-full object-cover transition-transform duration-[900ms] ease-glide group-hover:scale-[1.03] md:aspect-auto md:h-[380px] lg:h-[420px]"
              />
              <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 md:right-4 md:top-4">
                <ArrowsOut size={14} weight="bold" />
              </span>
              <span className="absolute inset-x-3 bottom-3 block rounded-2xl bg-black/45 px-4 py-3 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.18)] backdrop-blur-md md:inset-x-4 md:bottom-4 md:rounded-xl">
                <span className="block text-[12px] font-medium uppercase tracking-[0.08em] text-white/70">
                  {p.kicker}
                </span>
                <span className="mt-0.5 block text-[15px] font-medium leading-snug">
                  {p.title}
                </span>
                <span className="block text-[13px] text-white/75">
                  {p.meta}
                </span>
              </span>
            </button>
          </Reveal>
        ))}
      </ul>
    </Gallery>
  );
}
