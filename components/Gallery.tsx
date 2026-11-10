"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowsOut, CaretLeft, CaretRight, X } from "@phosphor-icons/react";
import type { GalleryItem } from "@/content/site";

// Keep the page from scrolling behind the open viewer.
function lockScroll(on: boolean) {
  document.documentElement.style.overflow = on ? "hidden" : "";
}

// Photos and figures on a work card. "hero" is one large image that fills the
// card's visual slot; "strip" is a row of small thumbnails; "mosaic" is one
// tall photo beside two stacked ones, with a "+N" tile for the rest; "wide" is
// one figure at its own (wide) aspect ratio under a label, for charts and process
// maps that a square thumbnail would crop. Each opens a
// full-screen viewer; full-size files load only once the viewer opens.
export function Gallery({
  items,
  label,
  variant,
}: {
  items: GalleryItem[];
  label: string;
  variant: "hero" | "strip" | "mosaic" | "wide";
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState<number | null>(null); // zoomed width in px, null = fit
  const stage = useRef<HTMLDivElement>(null);
  const many = items.length > 1;

  const open = (i: number) => {
    setIndex(i);
    setZoom(null);
    dialog.current?.showModal();
    lockScroll(true);
  };
  const close = () => dialog.current?.close();
  const step = useCallback(
    (d: number) => {
      setZoom(null);
      setIndex((i) => (i === null ? i : (i + d + items.length) % items.length));
    },
    [items.length],
  );

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const onClose = () => lockScroll(false);
    const onKey = (e: KeyboardEvent) => {
      if (!many) return;
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    d.addEventListener("close", onClose);
    d.addEventListener("keydown", onKey);
    return () => {
      d.removeEventListener("close", onClose);
      d.removeEventListener("keydown", onKey);
    };
  }, [many, step]);

  const current = index === null ? null : items[index];

  // Click to zoom in around the clicked point (full file resolution, at least 1.8x); click again to fit.
  const toggleZoom = (e: React.MouseEvent<HTMLImageElement>) => {
    if (zoom) return setZoom(null);
    const img = e.currentTarget;
    const r = img.getBoundingClientRect();
    const fx = (e.clientX - r.left) / r.width;
    const fy = (e.clientY - r.top) / r.height;
    setZoom(Math.round(Math.max(img.naturalWidth, r.width * 1.8)));
    requestAnimationFrame(() => {
      const el = stage.current;
      if (!el) return;
      el.scrollLeft = fx * el.scrollWidth - el.clientWidth / 2;
      el.scrollTop = fy * el.scrollHeight - el.clientHeight / 2;
    });
  };
  const btn =
    "grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 active:scale-95";

  return (
    <>
      {variant === "mosaic" ? (
        <div className="grid h-[380px] grid-cols-[0.85fr_1fr] grid-rows-2 gap-2.5 sm:h-[520px] sm:gap-3">
          {items.slice(0, 3).map((it, i) => {
            const rest = items.length - 3;
            return (
              <button
                key={it.src}
                type="button"
                onClick={() => open(i)}
                aria-haspopup="dialog"
                aria-label={`Open photo: ${it.caption}`}
                className={`group/m relative block cursor-zoom-in overflow-hidden rounded-[20px] border border-line bg-bg-2 ${
                  i === 0 ? "row-span-2" : ""
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized webp */}
                <img
                  src={it.thumb}
                  alt={it.alt}
                  width={it.width}
                  height={it.height}
                  loading="lazy"
                  decoding="async"
                  style={it.position ? { objectPosition: it.position } : undefined}
                  className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/m:scale-[1.04]"
                />
                {i === 2 && rest > 0 && (
                  <span className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-[12px] font-medium text-white backdrop-blur-md">
                    <ArrowsOut size={13} weight="bold" />+{rest} photos
                  </span>
                )}
              </button>
            );
          })}
        </div>
      ) : variant === "wide" ? (
        <div className="mt-5">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-ink-3">{label}</p>
          <button
            type="button"
            onClick={() => open(0)}
            aria-haspopup="dialog"
            aria-label={`Open: ${items[0].caption}`}
            className="group/wide relative mt-2.5 block w-full cursor-zoom-in overflow-hidden rounded-xl border border-line"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- static export, small pre-sized webp */}
            <img
              src={items[0].thumb}
              alt={items[0].alt}
              width={items[0].width}
              height={items[0].height}
              loading="lazy"
              decoding="async"
              className="block h-auto w-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/wide:scale-[1.02]"
            />
            <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white/10 text-white opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover/wide:opacity-100 group-focus-visible/wide:opacity-100">
              <ArrowsOut size={13} weight="bold" />
            </span>
          </button>
          {items[0].short && <p className="mt-1.5 text-[12.5px] leading-snug text-ink-3">{items[0].short}</p>}
        </div>
      ) : variant === "hero" ? (
        <button
          type="button"
          onClick={() => open(0)}
          aria-haspopup="dialog"
          aria-label={`Open photo: ${items[0].caption}`}
          className="group/photo relative block w-full cursor-zoom-in overflow-hidden rounded-2xl border border-line bg-bg-2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized responsive webp */}
          <img
            src={items[0].thumb}
            srcSet={items[0].thumbSet}
            sizes="(min-width: 1152px) 540px, (min-width: 768px) 48vw, 92vw"
            alt={items[0].alt}
            width={items[0].width}
            height={items[0].height}
            loading="lazy"
            decoding="async"
            className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
          />
          <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-[12px] font-medium text-white opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover/photo:opacity-100 group-focus-visible/photo:opacity-100 max-md:opacity-100">
            <ArrowsOut size={14} weight="bold" />
            Full photo
          </span>
        </button>
      ) : (
        <div className="mt-5">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-ink-3">{label}</p>
          <ul className="mt-2.5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {items.map((it, i) => (
              <li key={it.src}>
                <button
                  type="button"
                  onClick={() => open(i)}
                  aria-haspopup="dialog"
                  aria-label={`Open: ${it.caption}`}
                  className="group/thumb block w-full cursor-zoom-in text-left"
                >
                  <span className="block overflow-hidden rounded-xl border border-line bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element -- small static thumbnail */}
                    <img
                      src={it.thumb}
                      alt=""
                      width={360}
                      height={240}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[3/2] w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/thumb:scale-[1.05]"
                    />
                  </span>
                  <span className="mt-1.5 block text-[12.5px] leading-snug text-ink-3 transition-colors group-hover/thumb:text-ink">
                    {it.short}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <dialog
        ref={dialog}
        aria-label={label}
        onClick={(e) => e.target === e.currentTarget && close()}
        className="press-dialog m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 text-white backdrop:bg-black/85 backdrop:backdrop-blur-sm"
      >
        <div className="flex h-full flex-col" onClick={(e) => e.target === e.currentTarget && close()}>
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <p className="min-w-0 truncate font-mono text-[12px] text-white/70">
              {many && index !== null && `${index + 1} / ${items.length} · `}
              {current?.caption}
            </p>
            <button type="button" onClick={close} aria-label="Close" autoFocus className={btn}>
              <X size={18} weight="bold" />
            </button>
          </div>
          <div
            ref={stage}
            className={`relative min-h-0 flex-1 ${zoom ? "overflow-auto" : "flex items-center justify-center px-4 pb-4 sm:px-16"}`}
            onClick={(e) => e.target === e.currentTarget && close()}
          >
            {current && (
              // eslint-disable-next-line @next/next/no-img-element -- full-size file, fetched only when the viewer opens
              <img
                key={current.src}
                src={current.src}
                alt={current.alt}
                width={current.width}
                height={current.height}
                decoding="async"
                onClick={toggleZoom}
                style={zoom ? { width: zoom, maxWidth: "none", height: "auto" } : undefined}
                className={
                  zoom
                    ? "mx-auto block cursor-zoom-out rounded-lg"
                    : "max-h-full max-w-full cursor-zoom-in rounded-lg object-contain"
                }
              />
            )}
            {many && !zoom && (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous"
                  className={`${btn} absolute left-3 top-1/2 -translate-y-1/2 max-sm:top-auto max-sm:bottom-6`}
                >
                  <CaretLeft size={18} weight="bold" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next"
                  className={`${btn} absolute right-3 top-1/2 -translate-y-1/2 max-sm:top-auto max-sm:bottom-6`}
                >
                  <CaretRight size={18} weight="bold" />
                </button>
              </>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
