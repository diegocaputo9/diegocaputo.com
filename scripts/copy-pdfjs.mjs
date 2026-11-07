// Copies the pdf.js worker and its font/wasm assets into public/pdfjs so the
// in-page PDF viewer can load them from our own origin (CSP: 'self').
// Runs before dev and build; public/pdfjs is gitignored.
import { cpSync, mkdirSync } from "node:fs";

const src = "node_modules/pdfjs-dist";
const out = "public/pdfjs";
mkdirSync(out, { recursive: true });
cpSync(`${src}/build/pdf.worker.min.mjs`, `${out}/pdf.worker.min.mjs`);
cpSync(`${src}/standard_fonts`, `${out}/standard_fonts`, { recursive: true });
cpSync(`${src}/wasm`, `${out}/wasm`, { recursive: true });
console.log("pdf.js assets copied to public/pdfjs");
