// The thermal inspection pair: one drone photo of an industrial site and the
// same view in thermal (both 1200 x 820). Two hot spots on the thermal frame
// were painted in to illustrate typical findings (the bare stretch of steam
// line and the leaking dock door); the rooftop unit and the roof patch are in
// the original thermal image.

export const W = 1200;
export const H = 820;
export const T_MIN = 6;
export const T_MAX = 60;

export const visibleSrc = "/outside/thermal-visible.webp";
export const thermalSrc = "/outside/thermal-ir.webp";

export type Finding = { n: number; x: number; y: number; title: string; detail: string; temp: string };

export const findings: Finding[] = [
  { n: 1, x: 421, y: 262, title: "Steam line", detail: "Missing insulation, about 60 °C at the gap", temp: "≈ 60 °C" },
  { n: 2, x: 1040, y: 492, title: "Rooftop unit", detail: "Exhaust running much hotter than its neighbors", temp: "≈ 48 °C" },
  { n: 3, x: 620, y: 437, title: "Roof membrane", detail: "Wet insulation holding heat under the surface", temp: "≈ 38 °C" },
  { n: 4, x: 884, y: 604, title: "Dock door 2", detail: "Failed seal, warm air escaping", temp: "≈ 41 °C" },
];

// the camera's palette, cold to hot (for the legend)
export const ironGradient =
  "linear-gradient(90deg, #2a2fb8 0%, #6b2fc4 25%, #c43fa8 48%, #f07a3a 72%, #ffd25a 88%, #fff6dc 100%)";

/** Rough reading from a thermal pixel: brighter and warmer colors read hotter. */
export function tempFromPixel(r: number, g: number, b: number) {
  const s = Math.min(1, Math.max(0, (r * 0.55 + g * 0.45 - b * 0.12) / 255));
  return T_MIN + Math.pow(s, 1.6) * (T_MAX - T_MIN);
}
