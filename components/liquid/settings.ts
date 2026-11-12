// The site's liquid glass settings, in one place.
//
// These are the defaults everyone sees. The tuner (open the site with ?tune
// in the address) changes them live in your browser only; its "Copy settings"
// button gives back an object in this same shape to paste here.

export type GlassSettings = {
  /** how far the rim bends what is behind it, px */
  refraction: number;
  /** width of the curved edge band that bends light, px */
  bevel: number;
  /** rainbow split at the rim, 0 = none */
  dispersion: number;
  /** frost (blur) under the glass, px */
  frost: number;
  /** extra bend while the pointer is over the glass, 0.25 = +25% */
  hover: number;
  /** milky wash over the glass in light mode, % */
  tintLight: number;
  /** milky wash in dark mode, % */
  tintDark: number;
  /** brightness of the lit rim in light mode, 0..1 */
  rimLight: number;
  /** brightness of the lit rim in dark mode, 0..1 */
  rimDark: number;
};

export const glassDefaults: GlassSettings = {
  refraction: 26,
  bevel: 18,
  dispersion: 0.14,
  frost: 1.1,
  hover: 0.25,
  tintLight: 34,
  tintDark: 30,
  rimLight: 0.95,
  rimDark: 0.7,
};

let current: GlassSettings = { ...glassDefaults };
const listeners = new Set<(s: GlassSettings) => void>();

export const getGlass = () => current;

export function setGlass(next: Partial<GlassSettings>) {
  current = { ...current, ...next };
  applyCss(current);
  listeners.forEach((f) => f(current));
}

export function onGlass(f: (s: GlassSettings) => void) {
  listeners.add(f);
  return () => void listeners.delete(f);
}

/** tint and rim live in CSS (globals.css .lg reads these variables) */
function applyCss(s: GlassSettings) {
  const r = document.documentElement.style;
  r.setProperty("--lg-tint-light", `${s.tintLight}%`);
  r.setProperty("--lg-tint-dark", `${s.tintDark}%`);
  r.setProperty("--lg-spec-light", String(s.rimLight));
  r.setProperty("--lg-spec-dark", String(s.rimDark));
}
