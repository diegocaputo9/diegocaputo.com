// Liquid glass for the site (see the liquid-glass-web skill).
//
// Not a blur: the glass holds a live copy of what is behind it (the page
// backdrop, the hero drawings, the crosshair), and an SVG filter bends that
// copy through a curved bevel. The middle stays sharp, the rim bends and
// splits colors a little, a light frost softens it, and a specular rim lit
// from the pointer's side sits on top. "Filtered copy" method: it does not
// rely on backdrop-filter: url(), which only Chromium draws.
//
// attachLiquidGlass(el, opts) turns an element into liquid glass and returns
// a cleanup function. The element keeps its children; the glass layers go
// underneath them (z-index -1 inside the element's own stacking context).
// Where an engine is not verified, nothing happens and the element keeps its
// CSS .glass look.

import { getGlass, onGlass } from "./settings";

export type LiquidOpts = {
  /** CSS selectors of the things behind the glass to copy, bottom to top */
  sources: string[];
  /**
   * Size of this piece relative to the site settings (settings.ts): scales the
   * bevel width and the bend. 1 for cards, smaller for buttons and slim bars.
   */
  size?: number;
};

const SS = 2; // bake the map at 2x: the rim lives in a few pixels
const N_GLASS = 1.5;
let uid = 0;
let defs: SVGSVGElement | null = null;
const SVG = "http://www.w3.org/2000/svg";

/** Engines where the filtered copy has been checked to render. */
export function liquidSupported() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-transparency: reduce)").matches) return false;
  // ?lg=1 / ?lg=0 in the address forces it on or off (for testing on a device)
  const force = new URLSearchParams(location.search).get("lg");
  if (force === "1") return true;
  if (force === "0") return false;
  const ua = navigator.userAgent;
  const brands = (navigator as Navigator & { userAgentData?: { brands: { brand: string }[] } }).userAgentData?.brands;
  if (brands?.some((b) => /Chrom|Edge/.test(b.brand))) return true;
  return /Chrome\//.test(ua) && !/CriOS|EdgiOS/.test(ua); // desktop / Android Chromium
}

/** Bevel map: refraction offset per pixel, encoded around neutral in R (x) and G (y). */
const baked = new Map<string, string>();
function bakeCached(w: number, h: number, r: number, bevel: number) {
  const key = `${w}x${h}r${r}b${bevel.toFixed(1)}`;
  let url = baked.get(key);
  if (!url) {
    url = bake(w, h, r, bevel);
    if (baked.size > 60) baked.clear();
    baked.set(key, url);
  }
  return url;
}
function bake(w: number, h: number, r: number, bevel: number) {
  const W = Math.max(1, Math.round(w * SS));
  const H = Math.max(1, Math.round(h * SS));
  const B = bevel * SS;
  // The bevel is shaped with a corner radius of at least its own width, so the
  // bend turns smoothly round each corner. With the real (small) radius the
  // bend would switch from "up" to "sideways" along the corner diagonal, a
  // mitered seam that reads as a glitch. The visible outline still uses the
  // element's own radius (CSS clip).
  const R = Math.min(Math.max(r * SS, B), W / 2, H / 2);
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  const img = ctx.createImageData(W, H);
  const d8 = img.data;
  // decode is scale * (byte/255 - 0.5): 128 is not exactly zero, so the
  // neutral middle uses 127.5 rounded per pixel through the dither below
  let i = 0;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++, i += 4) {
      const px = x + 0.5 - W / 2;
      const py = y + 0.5 - H / 2;
      const qx = Math.abs(px) - (W / 2 - R);
      const qy = Math.abs(py) - (H / 2 - R);
      const ox = Math.max(qx, 0);
      const oy = Math.max(qy, 0);
      // inside distance; pixels in the corner beyond the rounded bevel get the full rim bend
      const d = Math.max(0.5, -(Math.hypot(ox, oy) + Math.min(Math.max(qx, qy), 0) - R));
      let dx = 0;
      let dy = 0;
      if (d < B) {
        let nx: number;
        let ny: number;
        if (ox > 0 || oy > 0) {
          const l = Math.hypot(ox, oy) || 1;
          nx = ox / l;
          ny = oy / l;
        } else if (qx > qy) {
          nx = 1;
          ny = 0;
        } else {
          nx = 0;
          ny = 1;
        }
        nx *= Math.sign(px) || 1;
        ny *= Math.sign(py) || 1;
        // convex quarter-circle bevel: steep at the edge, flat inside
        const s = 1 - d / B;
        const theta = Math.atan(s / Math.sqrt(Math.max(1e-4, 1 - s * s)));
        const bend = theta - Math.asin(Math.sin(theta) / N_GLASS);
        const m = Math.min(1, bend / 0.9);
        dx = -nx * m; // sample toward the centre: a magnifying, curved rim
        dy = -ny * m;
      }
      d8[i] = Math.round(127.5 + dx * 127);
      d8[i + 1] = Math.round(127.5 + dy * 127);
      d8[i + 2] = 128;
      d8[i + 3] = 255;
    }
  ctx.putImageData(img, 0, 0);
  return c.toDataURL();
}

function el<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number>) {
  const n = document.createElementNS(SVG, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, String(v));
  return n;
}

/** Filter: frost -> three displacement passes (R, G, B at slightly different strength) -> recombined. */
function makeFilter(id: string) {
  if (!defs || !defs.isConnected) {
    defs = el("svg", { width: 0, height: 0, "aria-hidden": "true" });
    defs.style.position = "absolute";
    defs.style.pointerEvents = "none";
    document.body.appendChild(defs);
  }
  const f = el("filter", {
    id,
    "color-interpolation-filters": "sRGB",
    filterUnits: "userSpaceOnUse",
    primitiveUnits: "userSpaceOnUse",
  });
  const blur = el("feGaussianBlur", { in: "SourceGraphic", stdDeviation: 0, result: "frost" });
  const map = el("feImage", { x: 0, y: 0, width: 1, height: 1, preserveAspectRatio: "none", result: "map" });
  const pass = (ch: number) => {
    const dm = el("feDisplacementMap", { in: "frost", in2: "map", scale: 0, xChannelSelector: "R", yChannelSelector: "G", result: `d${ch}` });
    const rows = ["0 0 0 0 0", "0 0 0 0 0", "0 0 0 0 0"];
    rows[ch] = ["1 0 0 0 0", "0 1 0 0 0", "0 0 1 0 0"][ch];
    const cm = el("feColorMatrix", { in: `d${ch}`, type: "matrix", values: `${rows.join("  ")}  0 0 0 1 0`, result: `c${ch}` });
    f.append(dm, cm);
    return dm;
  };
  f.append(blur, map);
  const passes = [pass(0), pass(1), pass(2)];
  f.append(
    el("feComposite", { in: "c0", in2: "c1", operator: "arithmetic", k2: 1, k3: 1, result: "rg" }),
    el("feComposite", { in: "rg", in2: "c2", operator: "arithmetic", k2: 1, k3: 1 }),
  );
  defs.appendChild(f);
  return { node: f, blur, map, passes };
}

/** Path of child indices from root to node, to find the same node in a copy. */
function pathTo(root: Node, node: Node) {
  const p: number[] = [];
  for (let n: Node | null = node; n && n !== root; n = n.parentNode) {
    const parent: Node | null = n.parentNode;
    if (!parent) return null;
    p.unshift(Array.prototype.indexOf.call(parent.childNodes, n));
  }
  return p;
}
function follow(root: Node, p: number[]) {
  let n: Node | undefined = root;
  for (const i of p) n = n?.childNodes[i];
  return n;
}
function copyVars(from: HTMLElement | SVGElement, to: HTMLElement | SVGElement) {
  for (let i = 0; i < from.style.length; i++) {
    const k = from.style[i];
    if (k.startsWith("--")) to.style.setProperty(k, from.style.getPropertyValue(k));
  }
}

export function attachLiquidGlass(host: HTMLElement, opts: LiquidOpts) {
  if (!liquidSupported()) return () => {};
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const size = opts.size ?? 1;
  let g = getGlass();
  const id = `lg-${++uid}`;
  const filter = makeFilter(id);

  // layers
  const layers = document.createElement("span");
  layers.className = "lg-layers";
  layers.setAttribute("aria-hidden", "true");
  const clip = document.createElement("span");
  clip.className = "lg-clip";
  const lens = document.createElement("span");
  lens.className = "lg-lens";
  lens.style.filter = `url(#${id})`;
  const tint = document.createElement("span");
  tint.className = "lg-tint";
  const shine = document.createElement("span");
  shine.className = "lg-shine";
  clip.append(lens, tint);
  layers.append(clip, shine);
  host.prepend(layers);
  host.classList.add("lg");

  // copies of what is behind, each in a wrapper we move into place every frame
  type Mirror = { src: HTMLElement | SVGElement; wrap: HTMLSpanElement; copy: HTMLElement | SVGElement; mo: MutationObserver };
  const mirrors: Mirror[] = [];
  for (const sel of opts.sources) {
    const src = document.querySelector<HTMLElement | SVGElement>(sel);
    if (!src) continue;
    const wrap = document.createElement("span");
    wrap.className = "lg-src";
    const copy = src.cloneNode(true) as HTMLElement | SVGElement;
    copy.removeAttribute("id");
    copy.querySelectorAll("[id]").forEach((n) => n.removeAttribute("id"));
    // the copy fills its wrapper; its own placement and scroll animations are dropped
    // (the wrapper is placed where the original is drawn, transforms included)
    Object.assign(copy.style, {
      position: "absolute", inset: "0", left: "0", top: "0", right: "auto", bottom: "auto",
      width: "100%", height: "100%", margin: "0", transform: "none", translate: "none",
      rotate: "none", scale: "none", animation: "none", zIndex: "auto", opacity: "1",
    });
    copyVars(src, copy);
    wrap.appendChild(copy);
    lens.appendChild(wrap);
    // keep the copy in step: CSS variables, data attributes, readout text
    const mo = new MutationObserver((list) => {
      for (const m of list) {
        const p = pathTo(src, m.target);
        if (!p) continue;
        const twin = follow(copy, p);
        if (!twin) continue;
        if (m.type === "attributes") {
          if (m.target === src) {
            if (m.attributeName === "style") copyVars(src, copy);
            else if (m.attributeName) {
              const v = (src as Element).getAttribute(m.attributeName);
              if (v == null) (copy as Element).removeAttribute(m.attributeName);
              else (copy as Element).setAttribute(m.attributeName, v);
            }
          } else if (m.attributeName) {
            const v = (m.target as Element).getAttribute(m.attributeName);
            if (v == null) (twin as Element).removeAttribute(m.attributeName);
            else (twin as Element).setAttribute(m.attributeName, v);
          }
        } else {
          const t = m.type === "characterData" ? m.target.parentNode : m.target;
          const tp = t && pathTo(src, t);
          const tt = tp && follow(copy, tp);
          if (t && tt) tt.textContent = t.textContent;
        }
      }
    });
    mo.observe(src, { attributes: true, subtree: true, characterData: true, childList: true });
    mirrors.push({ src, wrap, copy, mo });
  }

  // map + filter sizing. The map is baked the first time the glass is on
  // screen (and again on resize or a bevel change), not at load.
  let lastKey = "";
  let strength = reduce ? 1 : 0; // lensing ramps in when the glass first shows ("materializes")
  let target = 1;
  let visible = false;
  let dirty = true;
  const setScale = () => {
    const s = g.refraction * size * 2 * strength;
    filter.passes[0].setAttribute("scale", (s * (1 + g.dispersion)).toFixed(2));
    filter.passes[1].setAttribute("scale", s.toFixed(2));
    filter.passes[2].setAttribute("scale", (s * (1 - g.dispersion)).toFixed(2));
  };
  const resize = () => {
    if (!visible) {
      dirty = true;
      return;
    }
    dirty = false;
    const w = host.offsetWidth;
    const h = host.offsetHeight;
    const r = parseFloat(getComputedStyle(host).borderTopLeftRadius) || 0;
    const bevel = Math.min(g.bevel * size, w / 2, h / 2);
    const key = `${w}x${h}r${r}b${bevel}`;
    if (!w || !h || key === lastKey) return;
    lastKey = key;
    filter.map.setAttribute("href", bakeCached(w, h, r, bevel));
    filter.map.setAttribute("width", String(w));
    filter.map.setAttribute("height", String(h));
    const m = g.refraction * size + 4 * g.frost + 4;
    // region: the box plus room for rim pixels to sample outside it
    filter.node.setAttribute("x", String(-m));
    filter.node.setAttribute("y", String(-m));
    filter.node.setAttribute("width", String(w + 2 * m));
    filter.node.setAttribute("height", String(h + 2 * m));
  };
  filter.blur.setAttribute("stdDeviation", String(g.frost));
  setScale();
  const ro = new ResizeObserver(resize);
  ro.observe(host);

  // live settings (the tuner): bend, split and frost apply at once; a new
  // bevel width rebakes the map shortly after the slider stops
  let rebake = 0;
  const offGlass = onGlass((next) => {
    const bevelChanged = next.bevel !== g.bevel || next.refraction !== g.refraction || next.frost !== g.frost;
    g = next;
    filter.blur.setAttribute("stdDeviation", String(g.frost));
    setScale();
    if (bevelChanged) {
      clearTimeout(rebake);
      rebake = window.setTimeout(() => {
        lastKey = "";
        resize();
      }, 120);
    }
  });

  // light: the rim is lit from the pointer's side (fixed top-left on touch)
  let la = 225;
  let laTarget = 225;
  const onPointer = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    const r = host.getBoundingClientRect();
    laTarget = (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI + 270;
  };
  if (!reduce) window.addEventListener("pointermove", onPointer, { passive: true });
  // hover: the glass "wakes" a little (more bend)
  const enter = () => (target = 1 + g.hover);
  const leave = () => (target = 1);
  host.addEventListener("pointerenter", enter);
  host.addEventListener("pointerleave", leave);

  // frame loop, only while on screen
  let raf = 0;
  const tick = () => {
    raf = 0;
    const hr = host.getBoundingClientRect();
    // scale of the host (entrance animations, press): undo it so the copy lines up
    const kx = host.offsetWidth ? hr.width / host.offsetWidth : 1;
    const ky = host.offsetHeight ? hr.height / host.offsetHeight : 1;
    for (const m of mirrors) {
      const sr = m.src.getBoundingClientRect();
      m.wrap.style.width = `${sr.width / kx}px`;
      m.wrap.style.height = `${sr.height / ky}px`;
      m.wrap.style.transform = `translate3d(${(sr.left - hr.left) / kx}px, ${(sr.top - hr.top) / ky}px, 0)`;
    }
    if (!reduce) {
      strength += (target - strength) * 0.08;
      la += ((((laTarget - la) % 360) + 540) % 360 - 180) * 0.12;
      host.style.setProperty("--lg-la", `${la.toFixed(1)}deg`);
    }
    setScale();
    if (visible) raf = requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && dirty) resize();
    if (visible && !raf) raf = requestAnimationFrame(tick);
  });
  io.observe(host);

  return () => {
    io.disconnect();
    ro.disconnect();
    offGlass();
    clearTimeout(rebake);
    cancelAnimationFrame(raf);
    window.removeEventListener("pointermove", onPointer);
    host.removeEventListener("pointerenter", enter);
    host.removeEventListener("pointerleave", leave);
    mirrors.forEach((m) => m.mo.disconnect());
    layers.remove();
    host.classList.remove("lg");
    filter.node.remove();
  };
}
