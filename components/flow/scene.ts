// Interactive 3D lean lesson for the Teaching & speaking section: two identical
// lines (three stations, one minute per part) make the same ten parts. The back
// line moves one part at a time; the front line moves them in batches. Loaded
// on demand, like the terrain viewer.
//
// The model is the classic classroom exercise, with no transport time:
//   one-piece flow: first part out at minute 3, all ten at minute 12
//   batches of ten: first part out at minute 21, all ten at minute 30
import {
  BoxGeometry,
  BufferGeometry,
  Clock,
  Color,
  DirectionalLight,
  EdgesGeometry,
  Float32BufferAttribute,
  Group,
  HemisphereLight,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshLambertMaterial,
  OrthographicCamera,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export const PARTS = 10;
export const STATIONS = ["Cut", "Weld", "Paint"] as const;
const N = STATIONS.length;
const MIN = 0.55; // seconds of animation per simulated minute
const MOVE = 0.45; // minutes a part takes to hop to its next place (visual only)

export type Milestones = { first: number; all: number };
export type FlowState = {
  minute: number; // whole simulated minutes elapsed
  done: boolean;
  flowOut: number; // finished parts on the one-piece line
  batchOut: number; // finished parts on the batch line
};
export type FlowHandle = {
  setBatch: (b: number) => void;
  restart: () => void;
  play: () => void;
  dispose: () => void;
};
type Label = { el: HTMLElement; at: Vector3 };
type Opts = {
  reduceMotion: boolean;
  batch: number;
  onState: (s: FlowState) => void;
};

/** When each part starts at each station, for a transfer batch of size b. */
function schedule(b: number) {
  const start: number[][] = []; // start[k][i]
  const finish: number[][] = [];
  for (let k = 0; k < N; k++) {
    start.push([]);
    finish.push([]);
    for (let i = 0; i < PARTS; i++) {
      // a part reaches station k once the last part of its batch leaves station k-1
      const lastOfBatch = Math.min((Math.floor(i / b) + 1) * b, PARTS) - 1;
      const arrives = k === 0 ? 0 : finish[k - 1][lastOfBatch];
      const s = Math.max(arrives, i === 0 ? 0 : finish[k][i - 1]);
      start[k].push(s);
      finish[k].push(s + 1);
    }
  }
  return { start, finish };
}

/** First finished part and whole order, in minutes, for a transfer batch of size b. */
export function milestones(b: number): Milestones {
  const { finish } = schedule(b);
  return { first: finish[N - 1][0], all: finish[N - 1][PARTS - 1] };
}

// ---------------------------------------------------------------- layout
const PITCH = 2.7; // station spacing along the line
const X0 = -PITCH; // first station
const LANE = 1.8; // each line sits this far from the middle
const TOP = 0.52; // top of a machine bed
const PART = 0.34;
const stationX = (k: number) => X0 + k * PITCH;
// pads: 0 = raw stock, 1..N-1 = between stations, N = finished goods
const padX = (p: number) => (p === 0 ? X0 - 1.75 : p === N ? stationX(N - 1) + 1.75 : stationX(p - 1) + PITCH / 2);
// ten places on a pad, two across and five deep
const slot = (j: number, out: Vector3, p: number, z: number) =>
  out.set(padX(p) + (j % 2 ? 0.21 : -0.21), PART / 2 + 0.03, z + (Math.floor(j / 2) - 2) * 0.42);

type Key = { t: number; pos: Vector3; machine: boolean };

/** The places one part visits, with the minute it leaves for each. */
function path(i: number, b: number, z: number) {
  const { start, finish } = schedule(b);
  const keys: Key[] = [{ t: -1, pos: slot(i, new Vector3(), 0, z), machine: false }];
  for (let k = 0; k < N; k++) {
    keys.push({ t: start[k][i], pos: new Vector3(stationX(k), TOP + PART / 2, z), machine: true });
    const next = k === N - 1 ? Infinity : start[k + 1][i];
    // with no wait ahead, the part goes straight to the next station
    if (next > finish[k][i]) {
      const j = k === N - 1 ? i : i % b;
      keys.push({ t: finish[k][i], pos: slot(j, new Vector3(), k + 1, z), machine: false });
    }
  }
  return { keys, start: start.map((s) => s[i]) };
}

const LIGHT = {
  ink: "#3f3f46",
  edge: "#8b8b94",
  body: "#f4f4f5",
  floor: "#e9e9ec",
  raw: "#c9c9d1",
  accent: "#3b5bdb",
  sky: "#ffffff",
  ground: "#d4d4d8",
};
const DARK = {
  ink: "#d4d4d8",
  edge: "#6f6f79",
  body: "#1c1c20",
  floor: "#17171a",
  raw: "#4a4a54",
  accent: "#8ea2f0",
  sky: "#9a9aa6",
  ground: "#101012",
};

export function createFlow(canvas: HTMLCanvasElement, opts: Opts): FlowHandle {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 200);
  const target = new Vector3(0, 0.35, 0);

  const controls = new OrbitControls(camera, canvas);
  controls.target.copy(target);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.rotateSpeed = 0.6;
  controls.minPolarAngle = 0.7;
  controls.maxPolarAngle = 1.25;
  // Let one-finger vertical swipes scroll the page; horizontal drags rotate.
  canvas.style.touchAction = "pan-y";

  const hemi = new HemisphereLight(0xffffff, 0x888888, 1.9);
  const sun = new DirectionalLight(0xffffff, 1.5);
  sun.position.set(4, 9, 6);
  scene.add(hemi, sun);

  // --- materials (colors are set by applyTheme)
  const bodyMat = new MeshLambertMaterial();
  const floorMat = new MeshLambertMaterial({ transparent: true, opacity: 0.55 });
  const headMat = new MeshLambertMaterial();
  const edgeMat = new LineBasicMaterial();
  const railMat = new LineBasicMaterial({ transparent: true, opacity: 0.7 });
  const partEdgeMat = new LineBasicMaterial({ transparent: true, opacity: 0.55 });

  const box = (w: number, h: number, d: number, mat: MeshLambertMaterial, edges = true) => {
    const g = new BoxGeometry(w, h, d);
    const m = new Mesh(g, mat);
    if (edges) m.add(new LineSegments(new EdgesGeometry(g), edgeMat));
    return m;
  };

  // --- the two lines: floor plate, pad outlines, rails, three stations each
  const heads: Mesh[][] = [[], []];
  const lanes = [-LANE, LANE]; // back = one-piece flow, front = batches
  const world = new Group();
  scene.add(world);
  const lines: number[] = [];
  const rect = (cx: number, cz: number, w: number, d: number) => {
    const x0 = cx - w / 2;
    const x1 = cx + w / 2;
    const z0 = cz - d / 2;
    const z1 = cz + d / 2;
    lines.push(x0, 0.012, z0, x1, 0.012, z0, x1, 0.012, z0, x1, 0.012, z1, x1, 0.012, z1, x0, 0.012, z1, x0, 0.012, z1, x0, 0.012, z0);
  };
  lanes.forEach((z, li) => {
    const plate = box(padX(N) - padX(0) + 1.5, 0.04, 2.8, floorMat, false);
    plate.position.set(0, -0.02, z);
    world.add(plate);
    rect(0, z, padX(N) - padX(0) + 1.5, 2.8);
    for (let p = 0; p <= N; p++) rect(padX(p), z, 0.96, 2.3);
    // conveyor rails between the pads
    lines.push(padX(0) + 0.48, 0.012, z - 0.14, padX(N) - 0.48, 0.012, z - 0.14);
    lines.push(padX(0) + 0.48, 0.012, z + 0.14, padX(N) - 0.48, 0.012, z + 0.14);
    for (let k = 0; k < N; k++) {
      const x = stationX(k);
      const bed = box(1.05, TOP, 1.15, bodyMat);
      bed.position.set(x, TOP / 2, z);
      const postA = box(0.09, 1.05, 0.09, bodyMat);
      postA.position.set(x, TOP + 0.525, z - 0.5);
      const postB = postA.clone();
      postB.position.z = z + 0.5;
      const beam = box(0.13, 0.11, 1.09, bodyMat);
      beam.position.set(x, TOP + 1.1, z);
      const head = box(0.42, 0.16, 0.42, headMat);
      head.position.set(x, TOP + 0.95, z);
      heads[li].push(head);
      world.add(bed, postA, postB, beam, head);
    }
  });
  const railGeo = new BufferGeometry();
  railGeo.setAttribute("position", new Float32BufferAttribute(lines, 3));
  world.add(new LineSegments(railGeo, railMat));

  // --- parts
  const partGeo = new BoxGeometry(PART, PART, PART);
  const partEdges = new EdgesGeometry(partGeo);
  type Part = { mesh: Mesh; mat: MeshLambertMaterial; keys: Key[]; start: number[] };
  const parts: Part[][] = [[], []];
  for (let li = 0; li < 2; li++)
    for (let i = 0; i < PARTS; i++) {
      const mat = new MeshLambertMaterial();
      const mesh = new Mesh(partGeo, mat);
      mesh.add(new LineSegments(partEdges, partEdgeMat));
      world.add(mesh);
      parts[li].push({ mesh, mat, keys: [], start: [] });
    }

  let batch = opts.batch;
  let end = 0;
  function plan() {
    [1, batch].forEach((b, li) =>
      parts[li].forEach((p, i) => {
        const r = path(i, b, lanes[li]);
        p.keys = r.keys;
        p.start = r.start;
      }),
    );
    end = milestones(batch).all;
  }
  plan();

  // --- labels: HTML elements pinned to points in the scene
  const labels: Label[] = [];
  const counters: HTMLElement[] = [];
  const pin = (text: string, x: number, y: number, z: number, cls = "") => {
    const el = document.createElement("span");
    el.className = `flow-label ${cls}`;
    el.textContent = text;
    canvas.parentElement?.appendChild(el);
    labels.push({ el, at: new Vector3(x, y, z) });
    return el;
  };
  // station names along the front edge; finished-part counters past the end of each line
  // (the two lines are named in the legend that FlowLab draws over the canvas)
  STATIONS.forEach((s, k) => pin(s, stationX(k), 0, LANE + 1.8));
  lanes.forEach((z) => counters.push(pin("", padX(N) + 1.2, 0, z, "flow-label-count")));

  // --- theme
  const cRaw = new Color();
  const cAccent = new Color();
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  function applyTheme() {
    const t = media.matches ? DARK : LIGHT;
    bodyMat.color.set(t.body);
    floorMat.color.set(t.floor);
    headMat.color.set(t.ink);
    edgeMat.color.set(t.edge);
    railMat.color.set(t.edge);
    partEdgeMat.color.set(t.ink);
    hemi.color.set(t.sky);
    hemi.groundColor.set(t.ground);
    hemi.intensity = media.matches ? 2.4 : 1.9;
    cRaw.set(t.raw);
    cAccent.set(t.accent);
  }
  applyTheme();
  media.addEventListener("change", applyTheme);

  // --- size: frame the whole floor from the resting camera angle
  const corners: Vector3[] = [];
  const hx = (padX(N) - padX(0)) / 2 + 1.5;
  const hz = LANE + 1.9;
  for (const x of [-hx, hx]) for (const z of [-hz, hz]) corners.push(new Vector3(x, 0, z));
  // tops of the gantries
  for (const x of [stationX(0), stationX(N - 1)]) for (const z of [-LANE, LANE]) corners.push(new Vector3(x, 1.75, z));
  const tmp = new Vector3();
  let w = 0;
  let h = 0;
  function frame(resetView: boolean) {
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    const aspect = w / h;
    if (resetView) {
      // long, low view on wide screens; turned further along the line on narrow ones
      const az = aspect < 1.4 ? 0.95 : 0.6;
      const el = 0.56;
      camera.position.set(target.x + Math.sin(az) * Math.cos(el) * 40, target.y + Math.sin(el) * 40, target.z + Math.cos(az) * Math.cos(el) * 40);
      controls.minAzimuthAngle = az - 0.6;
      controls.maxAzimuthAngle = az + 0.6;
      camera.lookAt(target);
    }
    fit();
  }
  // Keep the whole floor centred and as large as the canvas allows, at any angle.
  function fit() {
    if (!w || !h) return;
    const aspect = w / h;
    camera.updateMatrixWorld();
    let x0 = Infinity;
    let x1 = -Infinity;
    let y0 = Infinity;
    let y1 = -Infinity;
    for (const c of corners) {
      tmp.copy(c).applyMatrix4(camera.matrixWorldInverse);
      x0 = Math.min(x0, tmp.x);
      x1 = Math.max(x1, tmp.x);
      y0 = Math.min(y0, tmp.y);
      y1 = Math.max(y1, tmp.y);
    }
    const half = (Math.max(y1 - y0, (x1 - x0) / aspect) / 2) * 1.03;
    const cx = (x0 + x1) / 2;
    const cy = (y0 + y1) / 2;
    camera.left = cx - half * aspect;
    camera.right = cx + half * aspect;
    camera.top = cy + half;
    camera.bottom = cy - half;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(() => frame(true));
  ro.observe(canvas);
  frame(true);

  // --- simulation
  let t = opts.reduceMotion ? 1e6 : -0.6; // minutes; a short pause before the first part moves
  let playing = false;
  let lastMinute = -99;
  let lastOut = "";
  const ease = (u: number) => u * u * (3 - 2 * u);
  const col = new Color();
  function place(now: number) {
    const outs = [0, 0];
    for (let li = 0; li < 2; li++) {
      const press = [0, 0, 0];
      for (const p of parts[li]) {
        let k = 0;
        while (k + 1 < p.keys.length && p.keys[k + 1].t <= now) k++;
        const a = p.keys[Math.max(0, k - 1)];
        const b = p.keys[k];
        const u = k === 0 ? 1 : ease(Math.min(1, (now - b.t) / MOVE));
        p.mesh.position.lerpVectors(a.pos, b.pos, u);
        p.mesh.position.y += Math.sin(Math.PI * u) * 0.42; // small hop between places
        // value added so far: one third per finished station, plus the one in progress
        let stage = 0;
        for (let s = 0; s < N; s++) stage += Math.min(1, Math.max(0, now - p.start[s]));
        p.mat.color.copy(col.copy(cRaw).lerp(cAccent, stage / N));
        for (let s = 0; s < N; s++) {
          const q = now - p.start[s];
          if (q > MOVE && q < 1) press[s] = Math.sin((Math.PI * (q - MOVE)) / (1 - MOVE));
        }
        if (now >= p.start[N - 1] + 1) outs[li]++;
      }
      heads[li].forEach((hd, s) => (hd.position.y = TOP + 0.95 - press[s] * 0.38));
    }
    return outs;
  }
  function report(outs: number[]) {
    const minute = Math.min(end, Math.max(0, Math.floor(t)));
    const key = `${outs[0]}/${outs[1]}`;
    if (minute === lastMinute && key === lastOut) return;
    lastMinute = minute;
    lastOut = key;
    counters[0].textContent = `${outs[0]}/${PARTS}`;
    counters[1].textContent = `${outs[1]}/${PARTS}`;
    opts.onState({ minute, done: t >= end, flowOut: outs[0], batchOut: outs[1] });
  }

  const clock = new Clock();
  const proj = new Vector3();
  const loop = () => {
    const dt = Math.min(clock.getDelta(), 0.05);
    if (playing && t < end + 0.5) t += dt / MIN;
    report(place(t));
    controls.update(dt);
    fit();
    renderer.render(scene, camera);
    for (const l of labels) {
      proj.copy(l.at).project(camera);
      l.el.style.transform = `translate3d(${((proj.x + 1) / 2) * w}px, ${((1 - proj.y) / 2) * h}px, 0) translate(-50%, -50%)`;
    }
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

  const restart = () => {
    t = opts.reduceMotion ? 1e6 : -0.6;
    lastMinute = -99;
    playing = true;
  };

  return {
    setBatch(b) {
      if (b === batch) return;
      batch = b;
      plan();
      restart();
    },
    restart,
    play() {
      playing = true;
    },
    dispose() {
      setRunning(false);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      media.removeEventListener("change", applyTheme);
      controls.dispose();
      labels.forEach((l) => l.el.remove());
      scene.traverse((o) => {
        const m = o as Mesh;
        m.geometry?.dispose();
        const mat = m.material as { dispose?: () => void } | undefined;
        mat?.dispose?.();
      });
      renderer.dispose();
    },
  };
}
