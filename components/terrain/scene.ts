// Interactive 3D terrain tile for the "Outside the lab" section.
// Placeholder: a procedurally generated mountain that stands in for a real
// photogrammetry survey until Diego has one to publish. Loaded on demand.
import {
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  Clock,
  Color,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  Line,
  LineBasicMaterial,
  LineDashedMaterial,
  LineLoop,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  RingGeometry,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise.js";

export type Mode = "relief" | "elevation" | "points";

export const ELEV_MIN = 740; // meters, placeholder datum
export const ELEV_MAX = 1480;

export type TerrainHandle = {
  setMode: (m: Mode) => void;
  setFlight: (on: boolean) => void;
  zoom: (factor: number) => void;
  reset: () => void;
  dispose: () => void;
};

type Opts = {
  reduceMotion: boolean;
  onHover: (meters: number | null) => void;
};

const SIZE = 10; // world units across the tile
const SEG = 200; // grid resolution
const BASE = -0.55; // bottom of the cut block
const VSCALE = 2.5; // vertical exaggeration of the generated heights

// ---------------------------------------------------------------- heights
function buildHeights() {
  const noise = new ImprovedNoise();
  const fbm = (x: number, z: number, oct: number, seed: number) => {
    let a = 0;
    let amp = 0.5;
    let f = 1;
    for (let i = 0; i < oct; i++) {
      a += amp * noise.noise(x * f, seed, z * f);
      f *= 2.03;
      amp *= 0.5;
    }
    return a;
  };
  const ridged = (x: number, z: number) => {
    let a = 0;
    let amp = 0.55;
    let f = 1;
    let w = 1;
    for (let i = 0; i < 6; i++) {
      let n = 1 - Math.abs(noise.noise(x * f, 1.7, z * f));
      n *= n;
      n *= w;
      w = Math.min(1, Math.max(0, n * 1.7));
      a += n * amp;
      f *= 2.1;
      amp *= 0.5;
    }
    return a;
  };

  const n = SEG + 1;
  const h = new Float32Array(n * n);
  let min = Infinity;
  let max = -Infinity;
  for (let iz = 0; iz < n; iz++) {
    for (let ix = 0; ix < n; ix++) {
      const u = (ix / SEG) * 2 - 1;
      const v = (iz / SEG) * 2 - 1;
      const d1 = (u - 0.12) ** 2 + (v + 0.06) ** 2;
      const d2 = (u + 0.5) ** 2 + (v - 0.42) ** 2;
      const d3 = (u - 0.58) ** 2 + (v - 0.52) ** 2;
      const massif = Math.exp(-d1 / 0.3) + 0.55 * Math.exp(-d2 / 0.1) + 0.35 * Math.exp(-d3 / 0.07);
      const r = ridged(u * 1.55 + 3.1, v * 1.55 - 1.3);
      const y =
        massif * (0.4 + 0.8 * r) + 0.09 * fbm(u * 5.2, v * 5.2, 4, 4.2) + 0.08 * fbm(u * 1.3, v * 1.3, 2, 9.1);
      h[iz * n + ix] = y;
      if (y < min) min = y;
      if (y > max) max = y;
    }
  }
  // normalize to [0, VSCALE]
  for (let i = 0; i < h.length; i++) h[i] = ((h[i] - min) / (max - min)) * VSCALE;
  return h;
}

// ---------------------------------------------------------------- shader
const vert = /* glsl */ `
  varying vec3 vN;
  varying float vY;
  void main() {
    vN = normal;
    vY = position.y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const frag = /* glsl */ `
  uniform float uMode;      // 0 relief, 1 elevation
  uniform float uContours;
  uniform float uSkirt;
  uniform float uHoverOn;
  uniform float uHoverElev;
  uniform float uYMax;
  uniform float uE0;
  uniform float uE1;
  uniform vec3 uLight;
  uniform vec3 uLow;
  uniform vec3 uHigh;
  uniform vec3 uRampA;
  uniform vec3 uRampB;
  uniform vec3 uMinor;
  uniform vec3 uMajor;
  uniform vec3 uAccent;
  varying vec3 vN;
  varying float vY;

  float contour(float v, float w) {
    float d = abs(fract(v - 0.5) - 0.5) / max(fwidth(v), 1e-4);
    return 1.0 - clamp(d / w, 0.0, 1.0);
  }

  void main() {
    vec3 n = normalize(vN);
    float k = vY / uYMax;
    float t = clamp(k, 0.0, 1.0);
    float e = mix(uE0, uE1, k);

    vec3 base = uMode < 0.5 ? mix(uLow, uHigh, smoothstep(0.0, 1.0, t)) : mix(uRampA, uRampB, t);
    float diff = max(dot(n, normalize(uLight)), 0.0);
    float hemi = 0.5 + 0.5 * n.y;
    vec3 col = base * (0.38 + 0.72 * diff) * (0.8 + 0.2 * hemi);
    col *= mix(1.0, 0.86, uSkirt);

    col = mix(col, uMinor, contour(e / 20.0, 1.0) * 0.26 * uContours);
    col = mix(col, uMajor, contour(e / 100.0, 1.5) * 0.7 * uContours);

    float iso = 1.0 - clamp(abs(e - uHoverElev) / max(fwidth(e), 1e-4) / 1.8, 0.0, 1.0);
    col = mix(col, uAccent, iso * uHoverOn * (1.0 - uSkirt));

    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

type Theme = {
  low: string;
  high: string;
  rampA: string;
  rampB: string;
  cloudA: string;
  minor: string;
  major: string;
  accent: string;
  ink: string;
};

const LIGHT: Theme = {
  low: "#b9b9c0",
  high: "#fbfbfc",
  rampA: "#dfe6ff",
  rampB: "#2f45a8",
  cloudA: "#8d99cc",
  minor: "#18181b",
  major: "#3f3f46",
  accent: "#3b5bdb",
  ink: "#27272a",
};
const DARK: Theme = {
  low: "#4a4a52",
  high: "#dcdce1",
  rampA: "#1b2550",
  rampB: "#c9d3ff",
  cloudA: "#3c4785",
  minor: "#000000",
  major: "#18181b",
  accent: "#8ea2f0",
  ink: "#e4e4e7",
};

function dotTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  g.fillStyle = "#fff";
  g.beginPath();
  g.arc(32, 32, 28, 0, Math.PI * 2);
  g.fill();
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

// ---------------------------------------------------------------- scene
export function createTerrain(canvas: HTMLCanvasElement, opts: Opts): TerrainHandle {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(30, 1, 0.1, 200);
  // close and fairly low: the mountain fills the band (its base may run past the bottom edge)
  const home = new Vector3(9.2, 5.45, 9.9);
  const target = new Vector3(0, 1.05, 0);
  camera.position.copy(home);

  const controls = new OrbitControls(camera, canvas);
  controls.target.copy(target);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.enablePan = false;
  controls.minDistance = 8;
  controls.maxDistance = 30;
  controls.minPolarAngle = 0.2;
  controls.maxPolarAngle = 1.32;
  controls.rotateSpeed = 0.7;
  controls.autoRotate = !opts.reduceMotion;
  controls.autoRotateSpeed = 0.55; // about 110 s per turn: slow and smooth
  // Let one-finger vertical swipes scroll the page; horizontal drags rotate.
  canvas.style.touchAction = "pan-y";

  // Plain wheel scrolls the page; ctrl/⌘ + wheel (and trackpad pinch) zooms.
  const onWheel = (e: WheelEvent) => {
    if (!e.ctrlKey && !e.metaKey) e.stopImmediatePropagation();
  };
  canvas.addEventListener("wheel", onWheel, { capture: true });

  let resumeTimer = 0;
  controls.addEventListener("start", () => {
    controls.autoRotate = false;
    window.clearTimeout(resumeTimer);
  });
  controls.addEventListener("end", () => {
    window.clearTimeout(resumeTimer);
    if (!opts.reduceMotion) resumeTimer = window.setTimeout(() => (controls.autoRotate = true), 3500);
  });

  // --- geometry
  const H = buildHeights();
  const n = SEG + 1;
  const step = SIZE / SEG;
  const half = SIZE / 2;
  const pos = new Float32Array(n * n * 3);
  for (let iz = 0; iz < n; iz++)
    for (let ix = 0; ix < n; ix++) {
      const i = iz * n + ix;
      pos[i * 3] = -half + ix * step;
      pos[i * 3 + 1] = H[i];
      pos[i * 3 + 2] = -half + iz * step;
    }
  const idx: number[] = [];
  for (let iz = 0; iz < SEG; iz++)
    for (let ix = 0; ix < SEG; ix++) {
      const a = iz * n + ix;
      const b = a + 1;
      const c = a + n;
      const d = c + 1;
      idx.push(a, c, b, b, c, d);
    }
  const terrainGeo = new BufferGeometry();
  terrainGeo.setAttribute("position", new Float32BufferAttribute(pos, 3));
  terrainGeo.setIndex(idx);
  terrainGeo.computeVertexNormals();

  // Skirt: the four cut faces of the survey block, down to BASE.
  const sp: number[] = [];
  const sn: number[] = [];
  const side = (pts: [number, number, number][], nx: number, nz: number) => {
    for (let i = 0; i < pts.length - 1; i++) {
      const [x0, y0, z0] = pts[i];
      const [x1, y1, z1] = pts[i + 1];
      sp.push(x0, y0, z0, x0, BASE, z0, x1, y1, z1, x1, y1, z1, x0, BASE, z0, x1, BASE, z1);
      for (let k = 0; k < 6; k++) sn.push(nx, 0, nz);
    }
  };
  const P = (ix: number, iz: number): [number, number, number] => [-half + ix * step, H[iz * n + ix], -half + iz * step];
  side(Array.from({ length: n }, (_, i) => P(i, 0)), 0, -1);
  side(Array.from({ length: n }, (_, i) => P(i, SEG)), 0, 1);
  side(Array.from({ length: n }, (_, i) => P(0, i)), -1, 0);
  side(Array.from({ length: n }, (_, i) => P(SEG, i)), 1, 0);
  const skirtGeo = new BufferGeometry();
  skirtGeo.setAttribute("position", new Float32BufferAttribute(sp, 3));
  skirtGeo.setAttribute("normal", new Float32BufferAttribute(sn, 3));

  const uniforms = {
    uMode: { value: 0 },
    uContours: { value: 1 },
    uSkirt: { value: 0 },
    uHoverOn: { value: 0 },
    uHoverElev: { value: 0 },
    uYMax: { value: VSCALE },
    uE0: { value: ELEV_MIN },
    uE1: { value: ELEV_MAX },
    uLight: { value: new Vector3(-0.55, 0.75, 0.35) },
    uLow: { value: new Color() },
    uHigh: { value: new Color() },
    uRampA: { value: new Color() },
    uRampB: { value: new Color() },
    uMinor: { value: new Color() },
    uMajor: { value: new Color() },
    uAccent: { value: new Color() },
  };
  const terrainMat = new ShaderMaterial({ uniforms, vertexShader: vert, fragmentShader: frag });
  const skirtMat = new ShaderMaterial({
    uniforms: { ...uniforms, uSkirt: { value: 1 } },
    vertexShader: vert,
    fragmentShader: frag,
    side: DoubleSide,
  });
  const terrain = new Mesh(terrainGeo, terrainMat);
  const skirt = new Mesh(skirtGeo, skirtMat);
  scene.add(terrain, skirt);

  // Point cloud view: jittered samples coloured by elevation, like a dense photogrammetry cloud.
  const dot = dotTexture();
  const cp: number[] = [];
  const cc: number[] = [];
  const cA = new Color();
  const cB = new Color();
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let iz = 0; iz < n; iz++)
    for (let ix = 0; ix < n; ix++) {
      const i = iz * n + ix;
      cp.push(pos[i * 3] + (rand() - 0.5) * step * 0.8, H[i], pos[i * 3 + 2] + (rand() - 0.5) * step * 0.8);
      cc.push(H[i] / VSCALE, rand(), 0); // placeholder, recoloured per theme
    }
  const cloudGeo = new BufferGeometry();
  cloudGeo.setAttribute("position", new Float32BufferAttribute(cp, 3));
  const cloudT = cc.filter((_, k) => k % 3 === 0);
  const cloudJ = cc.filter((_, k) => k % 3 === 1);
  cloudGeo.setAttribute("color", new Float32BufferAttribute(new Float32Array(cloudT.length * 3), 3));
  const cloudMat = new PointsMaterial({
    size: 0.058,
    vertexColors: true,
    map: dot,
    alphaTest: 0.5,
    transparent: false,
  });
  const cloud = new Points(cloudGeo, cloudMat);
  cloud.visible = false;
  scene.add(cloud);

  // Flight plan: a lawnmower survey pattern with capture points and a drone flying it.
  const flight = new Group();
  const yMax = VSCALE;
  const fly = yMax + 0.55;
  const lanes = 9;
  const path: Vector3[] = [];
  for (let i = 0; i < lanes; i++) {
    const x = -4.4 + (i * 8.8) / (lanes - 1);
    const zs = i % 2 === 0 ? [-4.6, 4.6] : [4.6, -4.6];
    path.push(new Vector3(x, fly, zs[0]), new Vector3(x, fly, zs[1]));
  }
  const pathGeo = new BufferGeometry().setFromPoints(path);
  const pathMat = new LineBasicMaterial({ transparent: true, opacity: 0.55 });
  flight.add(new Line(pathGeo, pathMat));

  const seg: { a: Vector3; b: Vector3; len: number; start: number }[] = [];
  let total = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const len = path[i].distanceTo(path[i + 1]);
    seg.push({ a: path[i], b: path[i + 1], len, start: total });
    total += len;
  }
  const shots: number[] = [];
  for (let s = 0; s < total; s += 0.55) {
    const p = at(s);
    shots.push(p.x, p.y, p.z);
  }
  const shotGeo = new BufferGeometry();
  shotGeo.setAttribute("position", new Float32BufferAttribute(shots, 3));
  const shotMat = new PointsMaterial({ size: 0.075, map: dot, alphaTest: 0.5 });
  flight.add(new Points(shotGeo, shotMat));

  // tiny quadcopter
  const drone = new Group();
  const bodyMat = new MeshBasicMaterial();
  const rotorMat = new MeshBasicMaterial({ side: DoubleSide, transparent: true, opacity: 0.9 });
  drone.add(new Mesh(new BoxGeometry(0.16, 0.05, 0.16), bodyMat));
  const arm = new BoxGeometry(0.42, 0.02, 0.03);
  const a1 = new Mesh(arm, bodyMat);
  a1.rotation.y = Math.PI / 4;
  const a2 = new Mesh(arm, bodyMat);
  a2.rotation.y = -Math.PI / 4;
  drone.add(a1, a2);
  const rotorGeo = new RingGeometry(0.06, 0.085, 24).rotateX(-Math.PI / 2);
  for (const [x, z] of [
    [0.15, 0.15],
    [-0.15, 0.15],
    [0.15, -0.15],
    [-0.15, -0.15],
  ]) {
    const r = new Mesh(rotorGeo, rotorMat);
    r.position.set(x, 0.03, z);
    drone.add(r);
  }
  flight.add(drone);

  const tetherGeo = new BufferGeometry().setFromPoints([new Vector3(), new Vector3()]);
  const tetherMat = new LineDashedMaterial({ dashSize: 0.08, gapSize: 0.06, transparent: true, opacity: 0.6 });
  const tether = new Line(tetherGeo, tetherMat);
  flight.add(tether);
  const footGeo = new BufferGeometry().setFromPoints([
    new Vector3(-0.55, 0, -0.38),
    new Vector3(0.55, 0, -0.38),
    new Vector3(0.55, 0, 0.38),
    new Vector3(-0.55, 0, 0.38),
  ]);
  const footMat = new LineBasicMaterial({ transparent: true, opacity: 0.85, depthTest: false });
  const foot = new LineLoop(footGeo, footMat);
  foot.renderOrder = 2;
  flight.add(foot);
  scene.add(flight);

  // hover marker
  const markGeo = new BufferGeometry();
  markGeo.setAttribute("position", new Float32BufferAttribute([0, 0, 0], 3));
  const markMat = new PointsMaterial({ size: 0.16, map: dot, alphaTest: 0.5, depthTest: false });
  const mark = new Points(markGeo, markMat);
  mark.visible = false;
  mark.renderOrder = 3;
  scene.add(mark);

  function at(s: number) {
    s = ((s % total) + total) % total;
    for (const g of seg) {
      if (s <= g.start + g.len) return g.a.clone().lerp(g.b, (s - g.start) / g.len);
    }
    return path[0].clone();
  }

  function heightAt(x: number, z: number) {
    const fx = Math.min(SEG - 1e-4, Math.max(0, (x + half) / step));
    const fz = Math.min(SEG - 1e-4, Math.max(0, (z + half) / step));
    const ix = Math.floor(fx);
    const iz = Math.floor(fz);
    const tx = fx - ix;
    const tz = fz - iz;
    const h00 = H[iz * n + ix];
    const h10 = H[iz * n + ix + 1];
    const h01 = H[(iz + 1) * n + ix];
    const h11 = H[(iz + 1) * n + ix + 1];
    return (h00 * (1 - tx) + h10 * tx) * (1 - tz) + (h01 * (1 - tx) + h11 * tx) * tz;
  }

  // --- theme
  let theme: Theme = LIGHT;
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  function applyTheme() {
    theme = media.matches ? DARK : LIGHT;
    uniforms.uLow.value.set(theme.low);
    uniforms.uHigh.value.set(theme.high);
    uniforms.uRampA.value.set(theme.rampA);
    uniforms.uRampB.value.set(theme.rampB);
    uniforms.uMinor.value.set(theme.minor);
    uniforms.uMajor.value.set(theme.major);
    uniforms.uAccent.value.set(theme.accent);
    pathMat.color.set(theme.accent);
    shotMat.color.set(theme.accent);
    markMat.color.set(theme.accent);
    footMat.color.set(theme.accent);
    tetherMat.color.set(theme.ink);
    bodyMat.color.set(theme.ink);
    rotorMat.color.set(theme.accent);
    const col = cloudGeo.getAttribute("color") as Float32BufferAttribute;
    cA.set(theme.cloudA);
    cB.set(theme.rampB);
    const tmp = new Color();
    for (let i = 0; i < cloudT.length; i++) {
      tmp.copy(cA).lerp(cB, cloudT[i]).multiplyScalar(0.82 + cloudJ[i] * 0.3);
      col.setXYZ(i, tmp.r, tmp.g, tmp.b);
    }
    col.needsUpdate = true;
  }
  applyTheme();
  media.addEventListener("change", applyTheme);

  // --- hover: march the view ray across the height field
  const ndc = new Vector2();
  let pointer: { x: number; y: number } | null = null;
  const ray = new Vector3();
  const probe = new Vector3();
  const onMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    pointer = { x: ((e.clientX - r.left) / r.width) * 2 - 1, y: -((e.clientY - r.top) / r.height) * 2 + 1 };
  };
  const onLeave = (e: PointerEvent) => {
    if (e.pointerType === "touch") return; // keep a tapped reading on screen
    pointer = null;
    clearHover();
  };
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerdown", onMove); // tap to read elevation on touch screens
  canvas.addEventListener("pointerleave", onLeave);
  let lastReport: number | null = -1;
  function clearHover() {
    uniforms.uHoverOn.value = 0;
    mark.visible = false;
    if (lastReport !== null) opts.onHover((lastReport = null));
  }
  function updateHover() {
    if (!pointer || mode === "points") return clearHover();
    ndc.set(pointer.x, pointer.y);
    ray.set(ndc.x, ndc.y, 0.5).unproject(camera).sub(camera.position).normalize();
    let t = 0;
    let hit = false;
    const stepT = 0.06;
    for (let i = 0; i < 700; i++) {
      probe.copy(camera.position).addScaledVector(ray, t);
      if (Math.abs(probe.x) <= half && Math.abs(probe.z) <= half && probe.y <= heightAt(probe.x, probe.z)) {
        // refine
        let lo = t - stepT;
        let hi = t;
        for (let k = 0; k < 10; k++) {
          const mid = (lo + hi) / 2;
          probe.copy(camera.position).addScaledVector(ray, mid);
          if (probe.y <= heightAt(probe.x, probe.z)) hi = mid;
          else lo = mid;
        }
        probe.copy(camera.position).addScaledVector(ray, hi);
        hit = true;
        break;
      }
      if (probe.y < BASE) break;
      t += stepT;
    }
    if (!hit) return clearHover();
    const y = heightAt(probe.x, probe.z);
    const meters = Math.round(ELEV_MIN + (y / VSCALE) * (ELEV_MAX - ELEV_MIN));
    uniforms.uHoverOn.value = 1;
    uniforms.uHoverElev.value = meters;
    (markGeo.getAttribute("position") as Float32BufferAttribute).setXYZ(0, probe.x, y + 0.01, probe.z);
    markGeo.getAttribute("position").needsUpdate = true;
    mark.visible = true;
    if (meters !== lastReport) opts.onHover((lastReport = meters));
  }

  // --- modes
  let mode: Mode = "relief";
  function setMode(m: Mode) {
    mode = m;
    uniforms.uMode.value = m === "elevation" ? 1 : 0;
    terrain.visible = skirt.visible = m !== "points";
    cloud.visible = m === "points";
  }
  function setFlight(on: boolean) {
    flight.visible = on;
  }

  // --- camera tweens (zoom buttons, reset)
  let tween: { from: Vector3; to: Vector3; t: number } | null = null;
  function zoom(factor: number) {
    const dir = camera.position.clone().sub(controls.target);
    const d = Math.min(controls.maxDistance, Math.max(controls.minDistance, dir.length() * factor));
    tween = { from: camera.position.clone(), to: controls.target.clone().add(dir.setLength(d)), t: 0 };
  }
  function reset() {
    tween = { from: camera.position.clone(), to: home.clone(), t: 0 };
    if (!opts.reduceMotion) controls.autoRotate = true;
  }

  // --- size + loop
  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // keep the whole tile in frame on tall (phone) layouts
    camera.fov = w / h < 1.1 ? 38 : 30;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  const clock = new Clock();
  let s = 0;
  const loop = () => {
    const dt = Math.min(clock.getDelta(), 0.05);
    if (tween) {
      tween.t = Math.min(1, tween.t + dt / 0.6);
      const k = 1 - Math.pow(1 - tween.t, 3);
      camera.position.lerpVectors(tween.from, tween.to, k);
      if (tween.t >= 1) tween = null;
    }
    if (flight.visible) {
      if (!opts.reduceMotion) s += dt * 0.9;
      const p = at(s);
      const ahead = at(s + 0.05);
      drone.position.copy(p);
      drone.rotation.y = Math.atan2(ahead.x - p.x, ahead.z - p.z);
      const g = heightAt(p.x, p.z);
      (tetherGeo.getAttribute("position") as Float32BufferAttribute).setXYZ(0, p.x, p.y - 0.04, p.z);
      (tetherGeo.getAttribute("position") as Float32BufferAttribute).setXYZ(1, p.x, g, p.z);
      tetherGeo.getAttribute("position").needsUpdate = true;
      tether.computeLineDistances();
      foot.position.set(p.x, g + 0.02, p.z);
      foot.rotation.y = drone.rotation.y;
    }
    controls.update(dt);
    updateHover();
    renderer.render(scene, camera);
  };

  let running = false;
  const setRunning = (on: boolean) => {
    if (on === running) return;
    running = on;
    if (on) clock.getDelta();
    renderer.setAnimationLoop(on ? loop : null);
  };
  const io = new IntersectionObserver(([e]) => setRunning(e.isIntersecting && !document.hidden));
  io.observe(canvas);
  const onVis = () => setRunning(!document.hidden && canvas.getBoundingClientRect().bottom > 0);
  document.addEventListener("visibilitychange", onVis);
  setRunning(true);

  return {
    setMode,
    setFlight,
    zoom,
    reset,
    dispose() {
      setRunning(false);
      io.disconnect();
      ro.disconnect();
      window.clearTimeout(resumeTimer);
      document.removeEventListener("visibilitychange", onVis);
      media.removeEventListener("change", applyTheme);
      canvas.removeEventListener("wheel", onWheel, { capture: true });
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      controls.dispose();
      scene.traverse((o) => {
        const m = o as Mesh;
        m.geometry?.dispose();
        const mat = m.material as { dispose?: () => void } | undefined;
        mat?.dispose?.();
      });
      dot.dispose();
      renderer.dispose();
    },
  };
}
