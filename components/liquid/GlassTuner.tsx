"use client";

import { useEffect, useState } from "react";
import { liquidSupported } from "./glass";
import { getGlass, glassDefaults, setGlass, type GlassSettings } from "./settings";

// Glass tuner: sliders for the site's liquid glass, live on the real page.
// Hidden from visitors. Open the site with ?tune in the address (it stays on
// for that tab while you browse; ?tune=0 or the close button turns it off).
// Your slider values are kept in this browser only. "Copy settings" puts
// them on the clipboard in the shape of glassDefaults (settings.ts), ready to
// become the site's defaults.

const SAVED = "lg-tune-settings";
const ON = "lg-tune";

type Row = { k: keyof GlassSettings; label: string; hint: string; min: number; max: number; step: number; unit?: string };
const rows: Row[] = [
  { k: "refraction", label: "Bend", hint: "how far the edge bends what's behind", min: 0, max: 60, step: 1, unit: "px" },
  { k: "bevel", label: "Edge width", hint: "how wide the curved edge is", min: 4, max: 40, step: 1, unit: "px" },
  { k: "dispersion", label: "Rainbow", hint: "color split at the edge", min: 0, max: 0.5, step: 0.01 },
  { k: "frost", label: "Frost", hint: "blur under the glass", min: 0, max: 6, step: 0.1, unit: "px" },
  { k: "hover", label: "Hover boost", hint: "extra bend under the pointer", min: 0, max: 1, step: 0.05 },
  { k: "tintLight", label: "Tint, light mode", hint: "milky wash over the glass", min: 0, max: 80, step: 1, unit: "%" },
  { k: "tintDark", label: "Tint, dark mode", hint: "milky wash over the glass", min: 0, max: 80, step: 1, unit: "%" },
  { k: "rimLight", label: "Rim, light mode", hint: "brightness of the lit edge", min: 0, max: 1, step: 0.05 },
  { k: "rimDark", label: "Rim, dark mode", hint: "brightness of the lit edge", min: 0, max: 1, step: 0.05 },
];

function load(): Partial<GlassSettings> {
  try {
    return JSON.parse(localStorage.getItem(SAVED) || "{}");
  } catch {
    return {};
  }
}
function save(s: GlassSettings) {
  try {
    localStorage.setItem(SAVED, JSON.stringify(s));
  } catch {}
}

export function GlassTuner() {
  const [on, setOn] = useState(false);
  const [s, setS] = useState<GlassSettings>(glassDefaults);
  const [open, setOpen] = useState(true);
  const [off, setOff] = useState(false);
  const [copied, setCopied] = useState<"" | "ok" | "manual">("");
  const [dark, setDark] = useState(false);
  const [supported, setSupported] = useState(true);

  // decide on mount (client only): ?tune turns it on for this tab
  useEffect(() => {
    const q = new URLSearchParams(location.search).get("tune");
    let active = false;
    try {
      if (q === "0") sessionStorage.removeItem(ON);
      else if (q !== null) sessionStorage.setItem(ON, "1");
      active = sessionStorage.getItem(ON) === "1";
    } catch {
      active = q !== null && q !== "0";
    }
    if (!active) return;
    const next = { ...glassDefaults, ...load() };
    setGlass(next);
    /* eslint-disable react-hooks/set-state-in-effect -- one-time client setup */
    setS(next);
    setOn(true);
    setSupported(liquidSupported());
    /* eslint-enable react-hooks/set-state-in-effect */
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => setDark(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("lg-off", off);
  }, [off]);

  if (!on) return null;

  const change = (k: keyof GlassSettings, v: number) => {
    const next = { ...getGlass(), [k]: v };
    setGlass(next);
    setS(next);
    save(next);
    setCopied("");
  };
  const reset = () => {
    setGlass(glassDefaults);
    setS(glassDefaults);
    try {
      localStorage.removeItem(SAVED);
    } catch {}
    setCopied("");
  };
  const text =
    "Glass settings from the tuner:\n" +
    JSON.stringify(s, null, 2).replace(/"(\w+)":/g, "$1:");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied("ok");
    } catch {
      setCopied("manual");
    }
  };
  const close = () => {
    try {
      sessionStorage.removeItem(ON);
    } catch {}
    setOff(false);
    setGlass(glassDefaults);
    setOn(false);
  };
  const changed = (Object.keys(glassDefaults) as (keyof GlassSettings)[]).filter((k) => s[k] !== glassDefaults[k]).length;

  if (!open)
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-[60] rounded-panel border border-line bg-bg/90 px-3 py-2 font-mono text-[12px] text-ink shadow-[0_8px_24px_-10px_rgb(0_0_0/0.35)] backdrop-blur-md"
      >
        Glass tuner{changed ? ` · ${changed} changed` : ""}
      </button>
    );

  return (
    <aside
      aria-label="Glass tuner"
      className="fixed bottom-4 left-4 z-[60] flex max-h-[min(640px,calc(100dvh-6rem))] w-[min(320px,calc(100vw-2rem))] flex-col rounded-panel border border-line bg-bg/92 text-ink shadow-[0_18px_48px_-16px_rgb(0_0_0/0.45)] backdrop-blur-xl"
    >
      <header className="flex items-center justify-between border-b border-line px-4 py-3">
        <div>
          <p className="text-[14px] font-semibold tracking-tight">Glass tuner</p>
          <p className="font-mono text-[11px] text-ink-3">only you see this · {dark ? "dark" : "light"} mode</p>
        </div>
        <div className="flex gap-1">
          <button type="button" onClick={() => setOpen(false)} className="rounded-ctl px-2 py-1 text-[12px] text-ink-2 hover:bg-ink/[0.06]">
            Hide
          </button>
          <button type="button" onClick={close} className="rounded-ctl px-2 py-1 text-[12px] text-ink-2 hover:bg-ink/[0.06]">
            Close
          </button>
        </div>
      </header>

      <div className="overflow-y-auto px-4 py-3">
        {!supported && (
          <p className="mb-3 rounded-ctl bg-accent/10 p-2.5 text-[12px] leading-snug text-ink-2">
            This browser shows the frosted version. Open the site in Chrome or Edge to see the liquid glass while you tune.
          </p>
        )}
        <label className="mb-3 flex items-center justify-between gap-3 text-[13px]">
          <span>
            Liquid glass
            <span className="block text-[11px] text-ink-3">turn off to compare with the frosted look</span>
          </span>
          <input type="checkbox" checked={!off} onChange={(e) => setOff(!e.target.checked)} className="h-4 w-4 accent-[var(--accent)]" />
        </label>
        {rows.map((r) => {
          const v = s[r.k];
          const dim = (r.k.endsWith("Light") && dark) || (r.k.endsWith("Dark") && !dark);
          return (
            <label key={r.k} className={`block border-t border-line py-2.5 ${dim ? "opacity-55" : ""}`}>
              <span className="flex items-baseline justify-between text-[13px]">
                <span>{r.label}</span>
                <span className="font-mono text-[12px] text-ink-2">
                  {v}
                  {r.unit ?? ""}
                  {v !== glassDefaults[r.k] && <span className="text-accent"> •</span>}
                </span>
              </span>
              <input
                type="range"
                min={r.min}
                max={r.max}
                step={r.step}
                value={v}
                onChange={(e) => change(r.k, Number(e.target.value))}
                className="mt-1.5 w-full accent-[var(--accent)]"
              />
              <span className="block text-[11px] text-ink-3">{r.hint}</span>
            </label>
          );
        })}
      </div>

      <footer className="border-t border-line px-4 py-3">
        <div className="flex gap-2">
          <button type="button" onClick={copy} className="btn btn-line flex-1 justify-center text-[13px]">
            {copied === "ok" ? "Copied" : "Copy settings"}
          </button>
          <button type="button" onClick={reset} className="btn btn-line text-[13px]">
            Reset
          </button>
        </div>
        {copied === "manual" && (
          <textarea readOnly value={text} rows={6} className="mt-2 w-full rounded-ctl border border-line bg-bg-2 p-2 font-mono text-[11px]" onFocus={(e) => e.target.select()} />
        )}
        <p className="mt-2 text-[11px] leading-snug text-ink-3">
          Saved in this browser. Paste the copied settings to Claude to make them the site&apos;s defaults.
        </p>
      </footer>
    </aside>
  );
}
