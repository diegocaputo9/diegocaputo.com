"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowsInLineHorizontal,
  ArrowSquareOut,
  DownloadSimple,
  MagnifyingGlassMinus,
  MagnifyingGlassPlus,
  Printer,
  X,
} from "@phosphor-icons/react";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";

// One viewer for every PDF link on the site. A click on any same-origin link to
// a .pdf opens it here instead of downloading; cmd/ctrl/middle-click still opens
// a new tab. pdf.js (~400 KB + worker) is only loaded on the first PDF click.

type Doc = { url: string; title: string; file: string };

const MAX_CANVAS_PX = 16_000_000; // stay under Safari's canvas size limit
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 4;

async function openPdf(url: string): Promise<PDFDocumentProxy> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";
  return pdfjs.getDocument({
    url,
    isEvalSupported: false,
    standardFontDataUrl: "/pdfjs/standard_fonts/",
    wasmUrl: "/pdfjs/wasm/",
  } as Parameters<typeof pdfjs.getDocument>[0]).promise;
}

export function PdfViewer() {
  const dialog = useRef<HTMLDialogElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const pagesHost = useRef<HTMLDivElement>(null);
  const pdf = useRef<PDFDocumentProxy | null>(null);
  const tasks = useRef<RenderTask[]>([]);
  const gen = useRef(0);
  const [doc, setDoc] = useState<Doc | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [zoom, setZoom] = useState(1); // relative to fit-width
  const [percent, setPercent] = useState<number | null>(null);
  const [pages, setPages] = useState(0);
  const [printing, setPrinting] = useState(false);

  // Intercept PDF link clicks anywhere on the page.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || a.hasAttribute("download") || a.hasAttribute("data-pdf-native")) return;
      let u: URL;
      try {
        u = new URL(a.href, location.href);
      } catch {
        return;
      }
      if (u.origin !== location.origin || !u.pathname.toLowerCase().endsWith(".pdf")) return;
      e.preventDefault();
      const file = decodeURIComponent(u.pathname.split("/").pop() || "document.pdf");
      // Cards put date, title and issuer on separate lines: use the longest line as the title.
      const lines = (a.getAttribute("data-pdf-title") || a.getAttribute("aria-label") || a.innerText || "")
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l && !/^pdf$/i.test(l));
      const title = lines.sort((x, y) => y.length - x.length)[0] || file;
      setDoc({ url: u.pathname, title, file });
      setStatus("loading");
      setZoom(1);
      setPercent(null);
      setPages(0);
      dialog.current?.showModal();
      document.documentElement.style.overflow = "hidden";
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Load the document when one is opened.
  useEffect(() => {
    if (!doc) return;
    let cancelled = false;
    openPdf(doc.url)
      .then((p) => {
        if (cancelled) return void p.destroy();
        pdf.current = p;
        setPages(p.numPages);
        setStatus("ready");
      })
      .catch(() => !cancelled && setStatus("error"));
    return () => {
      cancelled = true;
    };
  }, [doc]);

  const render = useCallback(async () => {
    const p = pdf.current;
    const host = pagesHost.current;
    const box = stage.current;
    if (!p || !host || !box) return;
    const g = ++gen.current;
    tasks.current.forEach((t) => t.cancel());
    tasks.current = [];

    const first = await p.getPage(1);
    const avail = Math.min(box.clientWidth - (box.clientWidth < 640 ? 24 : 64), 1100);
    const scale = (avail / first.getViewport({ scale: 1 }).width) * zoom;
    if (g !== gen.current) return;
    setPercent(Math.round(scale * 100));

    const dpr = window.devicePixelRatio || 1;
    const frag = document.createDocumentFragment();
    const jobs: { canvas: HTMLCanvasElement; n: number }[] = [];
    for (let n = 1; n <= p.numPages; n++) {
      const canvas = document.createElement("canvas");
      canvas.className = "mx-auto block rounded-[6px] bg-white shadow-[0_8px_40px_rgb(0_0_0/0.35)]";
      canvas.setAttribute("aria-label", `Page ${n} of ${p.numPages}`);
      canvas.setAttribute("role", "img");
      frag.appendChild(canvas);
      jobs.push({ canvas, n });
    }
    host.replaceChildren(frag);

    for (const { canvas, n } of jobs) {
      if (g !== gen.current) return;
      const page = await p.getPage(n);
      const css = page.getViewport({ scale });
      let ratio = dpr;
      if (css.width * css.height * ratio * ratio > MAX_CANVAS_PX) {
        ratio = Math.sqrt(MAX_CANVAS_PX / (css.width * css.height));
      }
      const vp = page.getViewport({ scale: scale * ratio });
      canvas.width = Math.floor(vp.width);
      canvas.height = Math.floor(vp.height);
      canvas.style.width = `${Math.floor(css.width)}px`;
      canvas.style.height = `${Math.floor(css.height)}px`;
      const ctx = canvas.getContext("2d");
      if (!ctx) continue;
      const task = page.render({ canvas, canvasContext: ctx, viewport: vp } as Parameters<typeof page.render>[0]);
      tasks.current.push(task);
      try {
        await task.promise;
      } catch {
        /* cancelled by a newer render */
      }
    }
  }, [zoom]);

  useEffect(() => {
    if (status === "ready") render();
  }, [status, render]);

  // Re-fit when the window is resized.
  useEffect(() => {
    if (status !== "ready") return;
    let t: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(render, 200);
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, [status, render]);

  // Cleanup when the dialog closes (Esc, close button, backdrop).
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const onClose = () => {
      document.documentElement.style.overflow = "";
      gen.current++;
      tasks.current.forEach((t) => t.cancel());
      tasks.current = [];
      pdf.current?.destroy();
      pdf.current = null;
      pagesHost.current?.replaceChildren();
      setDoc(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(ZOOM_MAX, z * 1.25));
      if (e.key === "-") setZoom((z) => Math.max(ZOOM_MIN, z / 1.25));
      if (e.key === "0") setZoom(1);
    };
    d.addEventListener("close", onClose);
    d.addEventListener("keydown", onKey);
    return () => {
      d.removeEventListener("close", onClose);
      d.removeEventListener("keydown", onKey);
    };
  }, []);

  // Print: render pages as images into a hidden frame and print that frame.
  // Works the same in every browser, unlike printing a PDF inside an iframe.
  const print = async () => {
    const p = pdf.current;
    if (!p || printing) return;
    setPrinting(true);
    try {
      const imgs: string[] = [];
      for (let n = 1; n <= p.numPages; n++) {
        const page = await p.getPage(n);
        const base = page.getViewport({ scale: 1 });
        const s = Math.min(2.5, Math.sqrt(MAX_CANVAS_PX / (base.width * base.height)));
        const vp = page.getViewport({ scale: s });
        const c = document.createElement("canvas");
        c.width = Math.floor(vp.width);
        c.height = Math.floor(vp.height);
        await page.render({ canvas: c, canvasContext: c.getContext("2d")!, viewport: vp } as Parameters<typeof page.render>[0])
          .promise;
        imgs.push(c.toDataURL("image/png"));
      }
      const frame = document.createElement("iframe");
      frame.setAttribute("aria-hidden", "true");
      frame.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden";
      frame.srcdoc = `<!doctype html><html><head><title>${doc?.title ?? "PDF"}</title><style>@page{margin:0}html,body{margin:0}img{display:block;width:100%;break-after:page}img:last-child{break-after:auto}</style></head><body>${imgs
        .map((src) => `<img src="${src}">`)
        .join("")}</body></html>`;
      document.body.appendChild(frame);
      await new Promise<void>((resolve) => (frame.onload = () => resolve()));
      const w = frame.contentWindow!;
      await Promise.all(
        Array.from(w.document.images).map((im) => (im.complete ? null : new Promise((r) => (im.onload = r)))),
      );
      w.focus();
      w.print();
      setTimeout(() => frame.remove(), 60_000);
    } finally {
      setPrinting(false);
    }
  };

  const btn =
    "grid h-10 w-10 shrink-0 place-items-center rounded-full text-white/85 transition-colors hover:bg-white/15 hover:text-white active:scale-95 disabled:opacity-40";
  const ready = status === "ready";

  return (
    <dialog
      ref={dialog}
      aria-label={doc ? `PDF: ${doc.title}` : "PDF viewer"}
      className="press-dialog m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 text-white backdrop:bg-black/85 backdrop:backdrop-blur-sm"
    >
      <div className="flex h-full flex-col">
        {/* toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-white/10 bg-black/40 px-3 py-2 backdrop-blur-xl sm:px-4">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-medium">{doc?.title}</p>
            <p className="truncate font-mono text-[11.5px] text-white/55">
              {doc?.file}
              {pages > 0 && ` · ${pages} page${pages > 1 ? "s" : ""}`}
            </p>
          </div>
          <div className="order-last flex w-full items-center justify-between gap-1 sm:order-none sm:w-auto sm:justify-end">
            <div className="flex items-center rounded-full bg-white/[0.07] p-0.5">
              <button
                type="button"
                className={btn}
                aria-label="Zoom out"
                disabled={!ready || zoom <= ZOOM_MIN}
                onClick={() => setZoom((z) => Math.max(ZOOM_MIN, z / 1.25))}
              >
                <MagnifyingGlassMinus size={18} />
              </button>
              <span className="w-12 text-center font-mono text-[12px] tabular-nums text-white/75" aria-live="polite">
                {percent ? `${percent}%` : "–"}
              </span>
              <button
                type="button"
                className={btn}
                aria-label="Zoom in"
                disabled={!ready || zoom >= ZOOM_MAX}
                onClick={() => setZoom((z) => Math.min(ZOOM_MAX, z * 1.25))}
              >
                <MagnifyingGlassPlus size={18} />
              </button>
              <button type="button" className={btn} aria-label="Fit to width" disabled={!ready} onClick={() => setZoom(1)}>
                <ArrowsInLineHorizontal size={18} />
              </button>
            </div>
            <div className="flex items-center gap-0.5">
              <button type="button" className={btn} aria-label="Print" disabled={!ready || printing} onClick={print}>
                <Printer size={18} />
              </button>
              <a
                href={doc?.url}
                download={doc?.file}
                data-pdf-native
                aria-label="Download"
                className={btn}
              >
                <DownloadSimple size={18} />
              </a>
              <a
                href={doc?.url}
                target="_blank"
                rel="noreferrer"
                data-pdf-native
                aria-label="Open in a new tab"
                className={btn}
              >
                <ArrowSquareOut size={18} />
              </a>
            </div>
          </div>
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            aria-label="Close"
            autoFocus
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 active:scale-95"
          >
            <X size={18} weight="bold" />
          </button>
        </div>

        {/* pages */}
        <div
          ref={stage}
          className="min-h-0 flex-1 overflow-auto overscroll-contain"
          onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
        >
          {status === "loading" && (
            <div className="mx-auto mt-6 aspect-[8.5/11] w-[min(720px,calc(100%-24px))] animate-pulse rounded-[6px] bg-white/10" />
          )}
          {status === "error" && (
            <div className="mx-auto mt-16 max-w-sm px-6 text-center text-[14px] text-white/80">
              This PDF couldn&apos;t be shown here.{" "}
              <a href={doc?.url} target="_blank" rel="noreferrer" data-pdf-native className="underline underline-offset-4">
                Open it in a new tab
              </a>
              .
            </div>
          )}
          <div
            ref={pagesHost}
            className="flex w-max min-w-full flex-col items-center gap-4 px-3 py-4 sm:gap-6 sm:px-8 sm:py-6"
            onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
          />
        </div>
      </div>
    </dialog>
  );
}
