import type { EnglishAdvice } from "@/lib/color-en";
import { ENGLISH_SEASONS } from "@/lib/color-en";
import { SEASONS, type ColorProfile } from "@/lib/color-analysis";

type Analysis = { preview: string; profile: ColorProfile };
type Ctx = CanvasRenderingContext2D;
const W = 1240, H = 1754, P = 96;
const FONT = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif';

function createPage() {
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Unable to create the report canvas");
  ctx.fillStyle = "#F5F1EA"; ctx.fillRect(0, 0, W, H);
  return { canvas, ctx };
}

function text(ctx: Ctx, value: string, x: number, y: number, size: number, color = "#2D2825", weight = 400, align: CanvasTextAlign = "left") {
  ctx.font = `${weight} ${size}px ${FONT}`; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = "alphabetic"; ctx.fillText(value, x, y);
}

function wrap(ctx: Ctx, value: string, x: number, y: number, width: number, size = 25, lineHeight = 38, color = "#5F5752", weight = 400) {
  ctx.font = `${weight} ${size}px ${FONT}`; ctx.fillStyle = color; ctx.textAlign = "left";
  const words = value.split(" "); let line = "", cursor = y;
  words.forEach(word => { const next = line ? `${line} ${word}` : word; if (ctx.measureText(next).width > width && line) { ctx.fillText(line, x, cursor); line = word; cursor += lineHeight; } else line = next; });
  if (line) ctx.fillText(line, x, cursor);
  return cursor;
}

function box(ctx: Ctx, x: number, y: number, w: number, h: number, r: number, fill: string) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fillStyle = fill; ctx.fill();
}

function crop(ctx: Ctx, image: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const source = image.naturalWidth / image.naturalHeight, target = w / h;
  let sx = 0, sy = 0, sw = image.naturalWidth, sh = image.naturalHeight;
  if (source > target) { sw = image.naturalHeight * target; sx = (image.naturalWidth - sw) / 2; }
  else { sh = image.naturalWidth / target; sy = (image.naturalHeight - sh) / 2; }
  ctx.save(); ctx.beginPath(); ctx.roundRect(x, y, w, h, 36); ctx.clip(); ctx.drawImage(image, sx, sy, sw, sh, x, y, w, h); ctx.restore();
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = src; });
}

function footer(ctx: Ctx, page: number) {
  ctx.strokeStyle = "#D8D0C7"; ctx.beginPath(); ctx.moveTo(P, H - 72); ctx.lineTo(W - P, H - 72); ctx.stroke();
  text(ctx, "MUTE COLOR LAB · PERSONAL COLOR REPORT", P, H - 36, 14, "#8B817A", 600);
  text(ctx, String(page).padStart(2, "0"), W - P, H - 36, 14, "#8B817A", 600, "right");
}

function row(ctx: Ctx, label: string, value: string, y: number) {
  text(ctx, label.toUpperCase(), P, y, 17, "#8B6572", 650);
  wrap(ctx, value, P + 260, y, W - P * 2 - 260, 25, 36, "#2D2825", 500);
}

export async function exportEnglishColorReport(analysis: Analysis, advice: EnglishAdvice) {
  await document.fonts.ready;
  const palette = SEASONS[analysis.profile.season];
  const season = ENGLISH_SEASONS[analysis.profile.season];
  const photo = await loadImage(analysis.preview);
  const pages: HTMLCanvasElement[] = [];

  {
    const { canvas, ctx } = createPage();
    text(ctx, "MUTE", P, 112, 27, "#2D2825", 750); text(ctx, "PERSONAL COLOR REPORT", W - P, 112, 18, "#7D736D", 600, "right");
    crop(ctx, photo, 680, 190, 464, 690);
    text(ctx, "YOUR COLOR", P, 274, 18, "#916A77", 700); text(ctx, "PROFILE", P, 340, 74, "#2D2825", 700);
    text(ctx, season.name, P, 500, 67, "#2D2825", 700); wrap(ctx, season.note, P, 565, 500, 30, 46, "#675D58", 500);
    box(ctx, P, 700, 485, 145, 28, "#E8DFD7"); text(ctx, "PRIMARY", P + 30, 752, 16, "#8E6974", 700); text(ctx, season.name, P + 150, 752, 25, "#2D2825", 650); text(ctx, "SECONDARY", P + 30, 808, 16, "#8E6974", 700); text(ctx, advice.secondary, P + 170, 808, 24, "#544C48", 600);
    text(ctx, "SIGNATURE PALETTE", P, 1010, 18, "#916A77", 700); text(ctx, "Your most harmonious colors", P, 1062, 40, "#2D2825", 700);
    palette.palette.forEach((color, index) => { const x = P + (index % 4) * 264, y = 1132 + Math.floor(index / 4) * 155; box(ctx, x, y, 232, 104, 20, color); text(ctx, color, x, y + 134, 16, "#7C716B", 550); });
    footer(ctx, 1); pages.push(canvas);
  }

  {
    const { canvas, ctx } = createPage();
    text(ctx, "PERSONAL STYLE GUIDE", P, 116, 18, "#916A77", 700); text(ctx, "Makeup · Hair · Wardrobe", P, 176, 48, "#2D2825", 700);
    box(ctx, P, 242, W - P * 2, 390, 30, "#E9E1DA"); text(ctx, "MAKEUP PALETTE", P + 34, 300, 19, "#8A6672", 700);
    row(ctx, "Foundation", advice.foundation, 360); row(ctx, "Lips", season.makeup.lip, 432); row(ctx, "Blush", season.makeup.blush, 504); row(ctx, "Eyes / brows", `${season.makeup.eye}; ${season.makeup.brow}`, 576);
    text(ctx, "HAIR & ACCESSORIES", P, 730, 19, "#916A77", 700); row(ctx, "Best hair colors", advice.hair, 796); row(ctx, "Avoid", advice.hairAvoid, 872); row(ctx, "Glasses / lenses", `${advice.glasses}; ${advice.lens}`, 948); row(ctx, "Jewelry / nails", `${advice.jewelry}; ${advice.manicure}`, 1024);
    box(ctx, P, 1110, W - P * 2, 420, 30, "#2E2926"); text(ctx, "WARDROBE FORMULA", P + 34, 1170, 18, "#C9ADB5", 700); text(ctx, advice.outfitSame, P + 34, 1230, 31, "#FFFFFF", 650); wrap(ctx, advice.outfitNeighbor, P + 34, 1282, 960, 24, 36, "#D8D0CA", 500); wrap(ctx, advice.ratio, P + 34, 1355, 960, 23, 35, "#BFB5AF", 450); wrap(ctx, advice.stylingRule, P + 34, 1435, 960, 22, 34, "#FFFFFF", 500);
    text(ctx, "This report is a photo-based estimate for personal color exploration, not a professional diagnosis.", P, 1635, 16, "#8A817B", 450);
    footer(ctx, 2); pages.push(canvas);
  }

  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [W, H], compress: true, hotfixes: ["px_scaling"] });
  pages.forEach((canvas, index) => { if (index) pdf.addPage([W, H], "portrait"); pdf.addImage(canvas.toDataURL("image/jpeg", .92), "JPEG", 0, 0, W, H, undefined, "FAST"); });
  pdf.save(`MUTE-${season.name.replaceAll(" ", "-")}-Color-Report.pdf`);
}
