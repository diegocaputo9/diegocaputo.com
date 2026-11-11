"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowsOut, ArrowUpRight, MagnifyingGlassMinus, MagnifyingGlassPlus, X } from "@phosphor-icons/react";
import type { Project } from "@/content/site";
import { setDialogOrigin } from "./dialogOrigin";

type Img = NonNullable<Project["image"]>;

// Thumbnail of the clipping; click opens the whole newspaper page.
// The 3000px page (~1.6 MB) is only fetched on hover/focus/click, never with the page.
export function PressLightbox({ image, articleHref }: { image: Img; articleHref?: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false); // start fetching the full page
  const [loaded, setLoaded] = useState(false);
  const [zoom, setZoom] = useState(false);
  const full = image.full;

  const warm = () => setArmed(true);
  const open = (e: React.MouseEvent<HTMLElement>) => {
    setDialogOrigin(dialog.current, e.currentTarget);
    setArmed(true);
    setZoom(false);
    dialog.current?.showModal();
    document.documentElement.style.overflow = "hidden";
  };
  const close = () => dialog.current?.close();

  // Zoom in around the point that was clicked, so the text you aimed at stays in view.
  const toggleZoom = (e?: React.MouseEvent<HTMLDivElement>) => {
    if (zoom || !e) return setZoom((z) => !z);
    const r = e.currentTarget.getBoundingClientRect();
    const fx = (e.clientX - r.left) / r.width;
    const fy = (e.clientY - r.top) / r.height;
    setZoom(true);
    requestAnimationFrame(() => {
      const el = stage.current;
      if (!el) return;
      el.scrollLeft = fx * el.scrollWidth - el.clientWidth / 2;
      el.scrollTop = fy * el.scrollHeight - el.clientHeight / 2;
    });
  };

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const onClose = () => (document.documentElement.style.overflow = "");
    d.addEventListener("close", onClose);
    return () => d.removeEventListener("close", onClose);
  }, []);

  const btn =
    "grid h-10 w-10 place-items-center rounded-ctl bg-white/10 text-white transition-[color,background-color,scale] hover:bg-white/20 active:scale-[0.97]";

  return (
    <>
      <button
        type="button"
        onClick={open}
        onPointerEnter={warm}
        onFocus={warm}
        aria-haspopup="dialog"
        aria-label="Open the full newspaper page"
        className="group/clip relative block w-full cursor-zoom-in overflow-hidden transition-[scale] duration-200 ease-glide active:scale-[0.97] rounded-2xl border border-line bg-[#e9e6df]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized responsive webp */}
        <img
          src={image.src}
          srcSet={image.srcSet}
          sizes="(min-width: 1152px) 620px, (min-width: 768px) 56vw, 92vw"
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading="lazy"
          decoding="async"
          className="aspect-[1280/513] w-full object-cover transition-transform duration-700 ease-glide group-hover:scale-[1.02]"
        />
        <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-ctl bg-black/55 px-3 py-1.5 text-[12px] font-medium text-white opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover/clip:opacity-100 group-focus-visible/clip:opacity-100 max-md:opacity-100">
          <ArrowsOut size={14} weight="bold" />
          Full page
        </span>
      </button>

      <dialog
        ref={dialog}
        aria-label="Newspaper page: Rhön- und Saalepost, 11 June 2026"
        onClick={(e) => e.target === e.currentTarget && close()}
        className="press-dialog m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 text-white backdrop:bg-black/85 backdrop:backdrop-blur-sm"
      >
        <div className="flex h-full flex-col" onClick={(e) => e.target === e.currentTarget && close()}>
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <p className="min-w-0 truncate text-[13px] text-white/70">{image.credit}</p>
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={() => toggleZoom()}
                aria-label={zoom ? "Fit to screen" : "Zoom to full size"}
                className={btn}
              >
                {zoom ? <MagnifyingGlassMinus size={18} /> : <MagnifyingGlassPlus size={18} />}
              </button>
              {articleHref && (
                <a
                  href={articleHref}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden h-10 items-center gap-1.5 rounded-ctl bg-white/10 px-4 text-[13px] font-medium transition-colors hover:bg-white/20 sm:flex"
                >
                  Read online
                  <ArrowUpRight size={14} weight="bold" />
                </a>
              )}
              <button type="button" onClick={close} aria-label="Close" autoFocus className={btn}>
                <X size={18} weight="bold" />
              </button>
            </div>
          </div>

          <div
            ref={stage}
            className={`relative min-h-0 flex-1 ${zoom ? "overflow-auto" : "flex items-center justify-center overflow-hidden px-4 pb-4"}`}
            onClick={(e) => e.target === e.currentTarget && close()}
          >
            {/* low-res page shows instantly; the 3000px version fades in over it */}
            <div
              className={`relative ${zoom ? "mx-auto w-[min(3000px,220vw)] cursor-zoom-out md:w-[min(3000px,140vw)]" : "h-full max-w-full cursor-zoom-in"}`}
              style={zoom ? undefined : { aspectRatio: `${full.width} / ${full.height}` }}
              onClick={toggleZoom}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- preview */}
              <img
                src={armed ? full.preview : undefined}
                alt=""
                aria-hidden
                width={full.width}
                height={full.height}
                className="h-full w-full rounded-lg object-contain"
              />
              {armed && (
                // eslint-disable-next-line @next/next/no-img-element -- full-resolution page, fetched on demand
                <img
                  src={full.src}
                  alt={full.alt}
                  width={full.width}
                  height={full.height}
                  decoding="async"
                  onLoad={() => setLoaded(true)}
                  className={`absolute inset-0 h-full w-full rounded-lg object-contain transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
                />
              )}
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
