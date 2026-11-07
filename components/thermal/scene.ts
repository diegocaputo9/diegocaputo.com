// Placeholder thermal survey: a top-down aerial of a small industrial site drawn
// on canvas, plus a matching temperature field rendered in an "iron" palette.
// Illustrative only; it stands in for real drone imagery.

export const W = 1200;
export const H = 750;
export const T_MIN = 6;
export const T_MAX = 40;

type Shape =
  | { kind: "rect"; x: number; y: number; w: number; h: number; color: string; temp: number }
  | { kind: "circle"; x: number; y: number; r: number; color: string; temp: number };

type Blob = { x: number; y: number; sx: number; sy: number; dt: number; mask?: (x: number, y: number) => boolean };

export type Finding = { n: number; x: number; y: number; title: string; detail: string };

// --------------------------------------------------------------- layout
let seed = 11;
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

const roof = { x: 500, y: 120, w: 600, h: 420 };
const inRoof = (x: number, y: number) => x > roof.x + 6 && x < roof.x + roof.w - 6 && y > roof.y + 6 && y < roof.y + roof.h - 6;

const shapes: Shape[] = [];
const blobs: Blob[] = [];
const rect = (x: number, y: number, w: number, h: number, color: string, temp: number) =>
  shapes.push({ kind: "rect", x, y, w, h, color, temp });
const circle = (x: number, y: number, r: number, color: string, temp: number) =>
  shapes.push({ kind: "circle", x, y, r, color, temp });

// ground, paving, road
rect(0, 0, W, H, "#6d7b50", 9);
rect(440, 80, 720, 600, "#a8a79f", 12); // concrete yard
rect(40, 410, 410, 270, "#56575b", 13); // parking
rect(0, 680, W, 70, "#47484c", 14); // road
rect(300, 640, 70, 50, "#56575b", 13); // entrance
// tank pad
rect(150, 160, 170, 170, "#9d9c95", 12);

// building
rect(roof.x, roof.y, roof.w, roof.h, "#d5d5d1", 10.5);
rect(roof.x, 540, 200, 64, "#8e8d88", 12); // office annex (ballasted roof)

// skylights
for (let r = 0; r < 3; r++)
  for (let c = 0; c < 6; c++) rect(740 + c * 56, 160 + r * 120, 30, 16, "#7d91a4", 16.5);

// rooftop units
const rtus = [
  [560, 165],
  [560, 300],
  [975, 165],
  [1010, 440],
];
for (const [x, y] of rtus) rect(x, y, 56, 40, "#a9adb1", 18);

// dock doors and trailers along the south wall
const docks: number[] = [];
for (let i = 0; i < 6; i++) {
  const x = 760 + i * 54;
  docks.push(x);
  rect(x, 540, 36, 9, "#5d5f62", 15);
}
for (const i of [0, 1, 4]) {
  rect(docks[i] + 3, 556, 30, 112, "#e4e4e1", 11);
  rect(docks[i] + 6, 664, 24, 16, "#3a3b3e", 12);
}

// pipe rack to the tank
rect(300, 236, 200, 14, "#8b8d90", 22);
circle(235, 245, 64, "#c5c8cb", 24);

// parking stalls and cars
const cars: { x: number; y: number; warm: boolean }[] = [];
const carColors = ["#d9d9d6", "#2b2c30", "#7a7d82", "#8a1f1f", "#1f3b6b", "#b9bcc0", "#3d4a3a"];
for (let row = 0; row < 2; row++)
  for (let i = 0; i < 13; i++) {
    if (rand() < 0.3) continue;
    const x = 58 + i * 29;
    const y = row === 0 ? 432 : 588;
    const warm = rand() < 0.22;
    cars.push({ x, y, warm });
    rect(x, y, 20, 40, carColors[Math.floor(rand() * carColors.length)], warm ? 15 : 10);
  }

// trees
const trees: [number, number, number][] = [];
for (let i = 0; i < 26; i++) trees.push([30 + rand() * 380, 30 + rand() * 110, 16 + rand() * 16]);
for (let i = 0; i < 9; i++) trees.push([1150 + rand() * 40, 120 + rand() * 520, 14 + rand() * 12]);
for (let i = 0; i < 7; i++) trees.push([20 + rand() * 60, 180 + rand() * 200, 14 + rand() * 12]);
for (const [x, y, r] of trees) circle(x, y, r, "#3f5232", 10);

// --------------------------------------------------------------- heat sources
// 1. steam line: insulation missing over a short run
blobs.push({ x: 372, y: 243, sx: 26, sy: 8, dt: 40 });
// 2. rooftop unit exhaust
blobs.push({ x: 975 + 28, y: 165 + 20, sx: 16, sy: 16, dt: 30 });
blobs.push({ x: 560 + 28, y: 300 + 20, sx: 11, sy: 11, dt: 14 });
// 3. wet insulation under the membrane (irregular patch, roof only)
for (const [x, y, s] of [
  [850, 290, 46],
  [905, 330, 38],
  [870, 360, 30],
  [820, 330, 26],
])
  blobs.push({ x, y, sx: s, sy: s * 0.8, dt: 6.5, mask: inRoof });
// 4. dock door with a failed seal: warm air spilling out
blobs.push({ x: docks[3] + 18, y: 560, sx: 22, sy: 30, dt: 15, mask: (x, y) => y > 540 });
// tank: liquid level reads warmer below the fill line
blobs.push({ x: 235, y: 285, sx: 52, sy: 26, dt: 7, mask: (x, y) => (x - 235) ** 2 + (y - 245) ** 2 < 64 * 64 && y > 252 });
// recently parked cars: warm engines
for (const c of cars) if (c.warm) blobs.push({ x: c.x + 10, y: c.y + 9, sx: 8, sy: 8, dt: 13 });

export const findings: Finding[] = [
  { n: 1, x: 372, y: 243, title: "Steam line", detail: "Missing insulation, about 60 °C at the gap" },
  { n: 2, x: 1003, y: 185, title: "Rooftop unit", detail: "Exhaust running much hotter than its neighbors" },
  { n: 3, x: 868, y: 322, title: "Roof membrane", detail: "Wet insulation holding heat under the surface" },
  { n: 4, x: docks[3] + 18, y: 566, title: "Dock door 4", detail: "Failed seal, warm air escaping" },
];

// --------------------------------------------------------------- aerial image
export function drawAerial(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, W, H);
  for (const s of shapes) {
    ctx.fillStyle = s.color;
    if (s.kind === "rect") ctx.fillRect(s.x, s.y, s.w, s.h);
    else {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // shadows (sun from the north-west)
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = "rgba(40,40,45,0.45)";
  ctx.fillRect(roof.x + roof.w, roof.y + 14, 14, roof.h);
  ctx.fillRect(roof.x + 14, roof.y + roof.h, roof.w, 14);
  for (const [x, y] of rtus) ctx.fillRect(x + 56, y + 6, 7, 40);
  ctx.beginPath();
  ctx.arc(245, 257, 64, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  // redraw the tank on top of its shadow
  ctx.fillStyle = "#c5c8cb";
  ctx.beginPath();
  ctx.arc(235, 245, 64, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(60,60,65,0.35)";
  ctx.lineWidth = 1.5;
  for (const r of [18, 36, 52]) {
    ctx.beginPath();
    ctx.arc(235, 245, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // roof: membrane seams and parapet
  ctx.strokeStyle = "rgba(90,90,95,0.18)";
  ctx.lineWidth = 1;
  for (let x = roof.x + 24; x < roof.x + roof.w; x += 24) {
    ctx.beginPath();
    ctx.moveTo(x, roof.y);
    ctx.lineTo(x, roof.y + roof.h);
    ctx.stroke();
  }
  ctx.strokeStyle = "#b3b3ae";
  ctx.lineWidth = 6;
  ctx.strokeRect(roof.x + 3, roof.y + 3, roof.w - 6, roof.h - 6);

  // rooftop unit fans
  for (const [x, y] of rtus) {
    ctx.fillStyle = "#55595d";
    ctx.beginPath();
    ctx.arc(x + 28, y + 20, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, 55, 39);
  }

  // pipe rack detail
  ctx.strokeStyle = "#6f7174";
  ctx.lineWidth = 3;
  for (const dy of [240, 246]) {
    ctx.beginPath();
    ctx.moveTo(300, dy);
    ctx.lineTo(500, dy);
    ctx.stroke();
  }

  // paint: parking stalls, road dashes
  ctx.strokeStyle = "rgba(240,240,235,0.75)";
  ctx.lineWidth = 2;
  for (let i = 0; i <= 13; i++) {
    const x = 54 + i * 29;
    ctx.beginPath();
    ctx.moveTo(x, 426);
    ctx.lineTo(x, 482);
    ctx.moveTo(x, 582);
    ctx.lineTo(x, 638);
    ctx.stroke();
  }
  ctx.setLineDash([26, 22]);
  ctx.beginPath();
  ctx.moveTo(0, 715);
  ctx.lineTo(W, 715);
  ctx.stroke();
  ctx.setLineDash([]);

  // car windshields
  ctx.fillStyle = "rgba(20,25,35,0.55)";
  for (const c of cars) ctx.fillRect(c.x + 3, c.y + 10, 14, 8);

  // tree crowns: highlight on the sun side
  for (const [x, y, r] of trees) {
    const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r);
    g.addColorStop(0, "rgba(120,150,90,0.55)");
    g.addColorStop(1, "rgba(25,35,20,0.4)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // photographic grain + low-frequency variation
  const img = ctx.getImageData(0, 0, W, H);
  const d = img.data;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      const lf = Math.sin(x * 0.013 + Math.sin(y * 0.021) * 2) * Math.cos(y * 0.017 + x * 0.004) * 0.05;
      const k = 1 + lf + (rand() - 0.5) * 0.09;
      d[i] = Math.min(255, d[i] * k);
      d[i + 1] = Math.min(255, d[i + 1] * k);
      d[i + 2] = Math.min(255, d[i + 2] * k);
    }
  }
  ctx.putImageData(img, 0, 0);
}

// --------------------------------------------------------------- thermal field
const FW = 600;
const FH = 375;
const SX = W / FW;

const iron: [number, number, number, number][] = [
  [0, 8, 6, 22],
  [0.18, 42, 12, 96],
  [0.38, 128, 22, 120],
  [0.56, 205, 54, 60],
  [0.72, 242, 118, 22],
  [0.88, 252, 196, 52],
  [1, 255, 248, 214],
];
export function ironColor(t: number): [number, number, number] {
  t = Math.min(1, Math.max(0, t));
  for (let i = 1; i < iron.length; i++) {
    if (t <= iron[i][0]) {
      const [t0, r0, g0, b0] = iron[i - 1];
      const [t1, r1, g1, b1] = iron[i];
      const k = (t - t0) / (t1 - t0);
      return [r0 + (r1 - r0) * k, g0 + (g1 - g0) * k, b0 + (b1 - b0) * k];
    }
  }
  return [255, 248, 214];
}
export const ironGradient = `linear-gradient(90deg, ${iron
  .map(([t, r, g, b]) => `rgb(${r} ${g} ${b}) ${Math.round(t * 100)}%`)
  .join(", ")})`;

export function buildThermal() {
  const field = new Float32Array(FW * FH);
  for (let fy = 0; fy < FH; fy++) {
    for (let fx = 0; fx < FW; fx++) {
      const x = (fx + 0.5) * SX;
      const y = (fy + 0.5) * SX;
      let t = 9;
      for (let k = shapes.length - 1; k >= 0; k--) {
        const s = shapes[k];
        const hit =
          s.kind === "rect"
            ? x >= s.x && x < s.x + s.w && y >= s.y && y < s.y + s.h
            : (x - s.x) ** 2 + (y - s.y) ** 2 <= s.r * s.r;
        if (hit) {
          t = s.temp;
          break;
        }
      }
      for (const b of blobs) {
        if (b.mask && !b.mask(x, y)) continue;
        const g = Math.exp(-((x - b.x) ** 2) / (2 * b.sx * b.sx) - ((y - b.y) ** 2) / (2 * b.sy * b.sy));
        t += b.dt * g;
      }
      field[fy * FW + fx] = t + (rand() - 0.5) * 0.35;
    }
  }
  // soften: two box-blur passes (thermal cameras resolve less detail than RGB)
  const tmp = new Float32Array(field.length);
  for (let pass = 0; pass < 2; pass++) {
    for (let y = 0; y < FH; y++)
      for (let x = 0; x < FW; x++) {
        let s = 0;
        let c = 0;
        for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx;
          if (xx < 0 || xx >= FW) continue;
          s += field[y * FW + xx];
          c++;
        }
        tmp[y * FW + x] = s / c;
      }
    for (let y = 0; y < FH; y++)
      for (let x = 0; x < FW; x++) {
        let s = 0;
        let c = 0;
        for (let dy = -1; dy <= 1; dy++) {
          const yy = y + dy;
          if (yy < 0 || yy >= FH) continue;
          s += tmp[yy * FW + x];
          c++;
        }
        field[y * FW + x] = s / c;
      }
  }

  const small = document.createElement("canvas");
  small.width = FW;
  small.height = FH;
  const sctx = small.getContext("2d")!;
  const img = sctx.createImageData(FW, FH);
  for (let i = 0; i < field.length; i++) {
    const [r, g, b] = ironColor(Math.pow(Math.max(0, (field[i] - T_MIN) / (T_MAX - T_MIN)), 0.85));
    img.data[i * 4] = r;
    img.data[i * 4 + 1] = g;
    img.data[i * 4 + 2] = b;
    img.data[i * 4 + 3] = 255;
  }
  sctx.putImageData(img, 0, 0);

  const tempAt = (x: number, y: number) => {
    const fx = Math.min(FW - 1, Math.max(0, Math.floor(x / SX)));
    const fy = Math.min(FH - 1, Math.max(0, Math.floor(y / SX)));
    return field[fy * FW + fx];
  };
  return { image: small, tempAt };
}
