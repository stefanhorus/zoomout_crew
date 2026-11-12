// Logo alb curat, pentru cardurile din portofoliu (overlayLogo în lib/projects.ts), din părțile albe ale unui logo color.
// Față de scripts/make-white-logo.sh, care doar alege pixelii albi, acesta redesenează forma: masca e mărită de 4 ori,
// netezită și tăiată la jumătate (contururi netede, litere albe pline, fără punctele gri ale compresiei), bucățile mici
// (stele, pete, marginea subțire din jurul logo-ului) dispar, găurile mici se umplu, apoi totul se micșorează la
// lățimea finală, cu margini antialias. Făcut pentru Wild West (2026-11-12).
// Folosire (din folderul proiectului): node scripts/clean-white-logo.mjs <logo color> <ieșire.png> [lățime, implicit 1200]
// Afișează bucățile păstrate (aria și cutia, în pixelii logo-ului sursă), ca să vezi că n-a dispărut o literă.
import sharp from "sharp";

const [input, output, finalWidthArg] = process.argv.slice(2);
const UP = 4; // mărirea pentru netezire
const SIGMA = 2.2; // netezirea, în pixeli ai imaginii mărite
const MIN_PART = 3000; // bucăți albe mai mici de atât (în pixeli măriți) dispar: stelele, petele
const MAX_HOLE = 3000; // găuri mai mici de atât se umplu: punctele gri din litere și din contur
const LO = 170, HI = 235; // min(r,g,b) sub LO = nu e alb, peste HI = alb plin

const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: w, height: h } = info;
const white = Buffer.alloc(w * h);
for (let i = 0; i < w * h; i++) {
  const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2], a = data[i * 4 + 3];
  const t = Math.min(1, Math.max(0, (Math.min(r, g, b) - LO) / (HI - LO)));
  white[i] = Math.round(255 * t * (a / 255));
}

const W = w * UP, H = h * UP;
const smooth = await sharp(white, { raw: { width: w, height: h, channels: 1 } })
  .resize(W, H, { kernel: "cubic" })
  .blur(SIGMA)
  .extractChannel(0)
  .raw()
  .toBuffer();
if (smooth.length !== W * H) throw new Error(`masca mărită are ${smooth.length} octeți, nu ${W * H}`);
const mask = new Uint8Array(W * H);
for (let i = 0; i < W * H; i++) mask[i] = smooth[i] >= 128 ? 1 : 0;

// Componentele conexe ale pixelilor cu valoarea `value`; întoarce lista {area, touchesEdge, pixels}
function components(value, diagonal) {
  const seen = new Uint8Array(W * H);
  const parts = [];
  const stack = new Int32Array(W * H);
  const steps = diagonal ? [-1, 1, -W, W, -W - 1, -W + 1, W - 1, W + 1] : [-1, 1, -W, W];
  for (let start = 0; start < W * H; start++) {
    if (seen[start] || mask[start] !== value) continue;
    let top = 0, area = 0, touchesEdge = false;
    let x0 = W, y0 = H, x1 = 0, y1 = 0;
    const pixels = [];
    stack[top++] = start;
    seen[start] = 1;
    while (top) {
      const p = stack[--top];
      pixels.push(p);
      area++;
      const x = p % W, y = (p / W) | 0;
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
      if (x === 0 || y === 0 || x === W - 1 || y === H - 1) touchesEdge = true;
      for (const step of steps) {
        const q = p + step;
        if (q < 0 || q >= W * H) continue;
        const qx = q % W;
        if (Math.abs(qx - x) > 1) continue; // nu trece de pe o margine pe cealaltă
        if (!seen[q] && mask[q] === value) {
          seen[q] = 1;
          stack[top++] = q;
        }
      }
    }
    parts.push({ area, touchesEdge, pixels, box: [x0, y0, x1, y1] });
  }
  return parts;
}

const parts = components(1, true);
let removed = 0;
for (const part of parts) {
  if (part.area < MIN_PART) {
    for (const p of part.pixels) mask[p] = 0;
    removed++;
  }
}
const kept = parts.filter((part) => part.area >= MIN_PART).sort((a, b) => b.area - a.area);
console.log(`bucăți albe: ${parts.length}, scoase ${removed}, păstrate ${kept.length}:`);
for (const part of kept) console.log(`  aria ${part.area}, cutia ${part.box.map((v) => Math.round(v / UP)).join(",")}`);

const holes = components(0, false);
let filled = 0;
for (const hole of holes) {
  if (!hole.touchesEdge && hole.area < MAX_HOLE) {
    for (const p of hole.pixels) mask[p] = 1;
    filled++;
  }
}
console.log(`găuri umplute: ${filled}`);

// Cutia logo-ului + margine, apoi micșorarea la lățimea finală (antialias din micșorare)
let bx0 = W, by0 = H, bx1 = 0, by1 = 0;
for (let i = 0; i < W * H; i++) {
  if (!mask[i]) continue;
  const x = i % W, y = (i / W) | 0;
  if (x < bx0) bx0 = x; if (x > bx1) bx1 = x; if (y < by0) by0 = y; if (y > by1) by1 = y;
}
const finalWidth = Number(finalWidthArg ?? 1200);
const scale = finalWidth / (bx1 - bx0 + 1);
const pad = Math.ceil(8 / scale); // 8 px de aer în imaginea finală
bx0 = Math.max(0, bx0 - pad); by0 = Math.max(0, by0 - pad);
bx1 = Math.min(W - 1, bx1 + pad); by1 = Math.min(H - 1, by1 + pad);
const cw = bx1 - bx0 + 1, ch = by1 - by0 + 1;
const crop = Buffer.alloc(cw * ch);
for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) crop[y * cw + x] = mask[(y + by0) * W + (x + bx0)] ? 255 : 0;
const outW = Math.round(cw * scale), outH = Math.round(ch * scale);
const alpha = await sharp(crop, { raw: { width: cw, height: ch, channels: 1 } }).resize(outW, outH, { kernel: "lanczos3" }).extractChannel(0).raw().toBuffer();
if (alpha.length !== outW * outH) throw new Error(`alfa are ${alpha.length} octeți, nu ${outW * outH}`);
const rgba = Buffer.alloc(outW * outH * 4);
for (let i = 0; i < outW * outH; i++) {
  rgba[i * 4] = 255; rgba[i * 4 + 1] = 255; rgba[i * 4 + 2] = 255; rgba[i * 4 + 3] = alpha[i];
}
await sharp(rgba, { raw: { width: outW, height: outH, channels: 4 } }).png({ compressionLevel: 9 }).toFile(output);
console.log(`gata: ${output} ${outW}x${outH}`);
