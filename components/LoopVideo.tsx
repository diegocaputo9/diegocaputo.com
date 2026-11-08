"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string; // muted mp4 that loops seamlessly (first frame === poster)
  srcSmall?: string; // lighter file for phone-width screens
  still: string;
  stillSet?: string;
  sizes?: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
};

// A still image that turns into a looping video once it scrolls into view.
// The video is only fetched when visible, pauses off-screen, and never loads
// for people who prefer reduced motion or have Data Saver on.
export function LoopVideo({ src, srcSmall, still, stillSet, sizes, alt, width, height, className = "" }: Props) {
  const wrap = useRef<HTMLSpanElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [armed, setArmed] = useState<string | null>(null); // chosen video src, once visible
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduce || saveData) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        const v = video.current;
        if (entry.isIntersecting) {
          setArmed((a) => a ?? (srcSmall && window.innerWidth < 768 ? srcSmall : src));
          v?.play().catch(() => {});
        } else {
          v?.pause();
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src, srcSmall]);

  // once the source is attached, start it (the observer above already fired)
  useEffect(() => {
    if (armed) video.current?.play().catch(() => {});
  }, [armed]);

  return (
    <span ref={wrap} className="relative block">
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized responsive webp */}
      <img
        src={still}
        srcSet={stillSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className={className}
      />
      {armed && (
        <video
          ref={video}
          src={armed}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          aria-hidden
          tabIndex={-1}
          onPlaying={() => setPlaying(true)}
          className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${playing ? "opacity-100" : "opacity-0"} ${className}`}
        />
      )}
    </span>
  );
}
