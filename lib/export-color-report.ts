import type { ExtendedAdvice } from "@/lib/color-advice";
import { rgbToHex, SEASONS, type ColorProfile } from "@/lib/color-analysis";

type ReportAnalysis = { preview: string; profile: ColorProfile };
type Ctx = CanvasRenderingContext2D;

const W = 1240, H = 1754, PAD = 96;
const FONT = '"PingFang SC", "Noto Sans SC", "Microsoft YaHei", sans-serif';

function page() {
  const canvas = document.createElement("canvas"); canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d"); if (!ctx) throw new Error("无法创建 PDF 画布");
  ctx.fillStyle = "#F5F1EA"; ctx.fillRect(0, 0, W, H);
  return { canvas, ctx };
}

function text(ctx: Ctx, value: string, x: number, y: number, size: number, color = "#2D2825", weight = 400, align: CanvasTextAlign = "left") {
  ctx.font = `${weight} ${size}px ${FONT}`; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = "alphabetic"; ctx.fillText(value, x, y);
}

function wrapped(ctx: Ctx, value: string, x: number, y: number, maxWidth: number, size = 28, lineHeight = 44, color = "#5F5752", weight = 400) {
  ctx.font = `${weight} ${size}px ${FONT}`; ctx.fillStyle = color; ctx.textAlign = "left";
  let line = "", cursor = y;
  for (const char of value) {
    const test = line + char;
    if (ctx.measureText(test).width > maxWidth && line) { ctx.fillText(line, x, cursor); line = char; cursor += lineHeight; } else line = test;
  }
  if (line) ctx.fillText(line, x, cursor);
  return cursor;
}

function roundRect(ctx: Ctx, x: number, y: number, w: number, h: number, r: number, fill: string, stroke?: string) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fillStyle = fill; ctx.fill();
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); }
}

function sectionTitle(ctx: Ctx, kicker: string, title: string, y: number) {
  text(ctx, kicker, PAD, y, 18, "#916A77", 600); text(ctx, title, PAD, y + 54, 40, "#2D2825", 600);
}

function footer(ctx: Ctx, index: number) {
  ctx.strokeStyle = "#D8D0C7"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(PAD, H - 74); ctx.lineTo(W - PAD, H - 74); ctx.stroke();
  text(ctx, "MUTE COLOR LAB · PERSONAL COLOR REPORT", PAD, H - 40, 14, "#8B817A", 500);
  text(ctx, String(index).padStart(2, "0"), W - PAD, H - 40, 14, "#8B817A", 500, "right");
}

async function loadImage(src: string) {
  return await new Promise<HTMLImageElement>((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = src; });
}

function cropImage(ctx: Ctx, image: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const srcRatio = image.naturalWidth / image.naturalHeight, dstRatio = w / h;
  let sx = 0, sy = 0, sw = image.naturalWidth, sh = image.naturalHeight;
  if (srcRatio > dstRatio) { sw = image.naturalHeight * dstRatio; sx = (image.naturalWidth - sw) / 2; }
  else { sh = image.naturalWidth / dstRatio; sy = (image.naturalHeight - sh) / 2; }
  ctx.save(); ctx.beginPath(); ctx.roundRect(x, y, w, h, 38); ctx.clip(); ctx.drawImage(image, sx, sy, sw, sh, x, y, w, h); ctx.restore();
}

function metricBar(ctx: Ctx, label: string, value: string, score: number, y: number, color: string) {
  text(ctx, label, PAD, y, 22, "#746B65", 500); text(ctx, value, W - PAD, y, 24, "#2D2825", 600, "right");
  roundRect(ctx, PAD, y + 24, W - PAD * 2, 18, 9, "#DED7D0");
  roundRect(ctx, PAD, y + 24, Math.max(30, (W - PAD * 2) * Math.min(1, Math.max(0, score))), 18, 9, color);
}

function infoRow(ctx: Ctx, label: string, value: string, y: number) {
  text(ctx, label, PAD, y, 20, "#817770", 400); wrapped(ctx, value, PAD + 250, y, W - PAD * 2 - 250, 25, 38, "#2D2825", 500);
}

export async function exportColorReport(analysis: ReportAnalysis, advice: ExtendedAdvice) {
  await document.fonts.ready;
  const season = SEASONS[analysis.profile.season], profile = analysis.profile;
  const portrait = await loadImage(analysis.preview);
  const pages: HTMLCanvasElement[] = [];

  {
    const { canvas, ctx } = page();
    text(ctx, "MUTE", PAD, 108, 26, "#2D2825", 700); text(ctx, "PERSONAL COLOR REPORT", W - PAD, 108, 18, "#7D736D", 500, "right");
    cropImage(ctx, portrait, 680, 190, 464, 690);
    text(ctx, "YOUR COLOR", PAD, 270, 18, "#916A77", 600); text(ctx, "PROFILE", PAD, 330, 72, "#2D2825", 600);
    text(ctx, season.cn, PAD, 495, 82, "#2D2825", 650); text(ctx, season.en, PAD, 548, 22, "#8D817A", 500);
    wrapped(ctx, season.note.replaceAll("、", " · "), PAD, 630, 480, 34, 50, "#5F5651", 500);
    roundRect(ctx, PAD, 745, 480, 134, 28, "#EAE2DB");
    text(ctx, `主季  ${season.cn}`, PAD + 30, 796, 24, "#2D2825", 600); text(ctx, `次季  ${advice.secondary}`, PAD + 30, 842, 22, "#6F645E", 500);
    sectionTitle(ctx, "SIGNATURE PALETTE", "你的核心色盘", 1025);
    season.palette.forEach((color, i) => { const x = PAD + (i % 4) * 264, y = 1135 + Math.floor(i / 4) * 154; roundRect(ctx, x, y, 232, 105, 22, color); text(ctx, color, x, y + 135, 16, "#7C716B", 500); });
    footer(ctx, 1); pages.push(canvas);
  }

  {
    const { canvas, ctx } = page();
    sectionTitle(ctx, "COLOR DIAGNOSIS", "色彩诊断卡", 108);
    text(ctx, "综合肤色、发色、瞳孔、眉毛与五官结构理解你的色彩位置。", PAD, 206, 24, "#716862", 400);
    metricBar(ctx, "冷暖倾向", profile.undertone, (profile.metrics.warmth + 100) / 200, 278, "#A97869");
    metricBar(ctx, "明度", profile.value, profile.metrics.lightness / 100, 382, "#B4A6A1");
    metricBar(ctx, "彩度", profile.chroma, Math.min(1, profile.metrics.chroma / 45), 486, "#8A6578");
    metricBar(ctx, "综合对比", profile.contrast, profile.metrics.contrast / 100, 590, "#46413E");
    metricBar(ctx, "瞳孔对比", "眼神清晰度", profile.metrics.pupilContrast / 100, 694, "#66525A");
    metricBar(ctx, "眉眼定义", "五官轮廓", profile.metrics.featureDefinition / 100, 798, "#7C6B64");
    roundRect(ctx, PAD, 914, W - PAD * 2, 220, 30, "#2E2926");
    text(ctx, "BEST / SECOND / AVOID", PAD + 36, 966, 17, "#C9ADB5", 600);
    text(ctx, season.cn, PAD + 36, 1032, 42, "#FFFFFF", 650); text(ctx, advice.secondary, PAD + 390, 1032, 32, "#D9D0CA", 500);
    season.avoid.forEach((color, i) => { roundRect(ctx, PAD + 36 + i * 125, 1060, 98, 42, 12, color); });
    text(ctx, "谨慎色", PAD + 430, 1090, 18, "#AFA5A0", 400);
    sectionTitle(ctx, "COLOR READINGS", "局部色值与五官结构", 1210);
    const samples = [["面部肤色", profile.skin], ["头发", profile.hair], ["瞳孔", profile.eyes], ["眉毛", profile.brows]] as const;
    samples.forEach(([label, color], i) => { const y = 1305 + i * 66; ctx.beginPath(); ctx.arc(PAD + 22, y - 8, 21, 0, Math.PI * 2); ctx.fillStyle = rgbToHex(color); ctx.fill(); text(ctx, label, PAD + 60, y, 19, "#746B65", 500); text(ctx, rgbToHex(color), PAD + 215, y, 19, "#2D2825", 600); });
    roundRect(ctx, 620, 1280, 524, 250, 24, "#E8E0D8"); text(ctx, "五官分布", 654, 1334, 18, "#866B70", 600);
    wrapped(ctx, `眼距 ${Math.round(profile.features.eyeSpacing)}% · 面部纵横 ${Math.round(profile.features.faceRatio)} · 眉眼距 ${Math.round(profile.features.browEyeDistance)}% · 左右平衡 ${Math.round(profile.features.symmetry)}`, 654, 1390, 450, 24, 38, "#2D2825", 500);
    text(ctx, "建议粉底", 654, 1470, 18, "#866B70", 600); wrapped(ctx, advice.foundation, 654, 1512, 450, 23, 35, "#2D2825", 500);
    footer(ctx, 2); pages.push(canvas);
  }

  {
    const { canvas, ctx } = page();
    sectionTitle(ctx, "STYLE GUIDE", "妆容 · 发色 · 穿搭", 108);
    roundRect(ctx, PAD, 226, W - PAD * 2, 330, 30, "#E9E1DA");
    text(ctx, "妆容配方", PAD + 34, 282, 20, "#8A6672", 600);
    infoRow(ctx, "粉底", advice.foundation, 340); infoRow(ctx, "唇色", season.makeup.lip, 402); infoRow(ctx, "腮红 / 眼影", `${season.makeup.blush} / ${season.makeup.eye}`, 464); infoRow(ctx, "眉色", season.makeup.brow, 526);
    text(ctx, "发色与配饰", PAD, 654, 34, "#2D2825", 600);
    infoRow(ctx, "建议发色", advice.hair, 722); infoRow(ctx, "尽量避开", advice.hairAvoid, 790); infoRow(ctx, "美瞳 / 眼镜", `${advice.lens}；${advice.glasses}`, 858); infoRow(ctx, "金属 / 美甲", `${season.metals}；${advice.manicure}`, 926);
    roundRect(ctx, PAD, 1020, W - PAD * 2, 390, 30, "#2E2926");
    text(ctx, "穿搭公式", PAD + 34, 1082, 20, "#C9ADB5", 600);
    text(ctx, advice.outfitSame, PAD + 34, 1140, 30, "#FFFFFF", 600); text(ctx, advice.outfitNeighbor, PAD + 34, 1194, 25, "#DED5CF", 500);
    wrapped(ctx, advice.ratio, PAD + 34, 1264, 930, 24, 38, "#BFB5AF", 400);
    wrapped(ctx, `面料：${advice.fabrics}。图案：${advice.pattern}。`, PAD + 34, 1340, 970, 22, 34, "#BFB5AF", 400);
    roundRect(ctx, PAD, 1450, W - PAD * 2, 132, 24, "#DDD3CA"); wrapped(ctx, advice.stylingRule, PAD + 30, 1504, W - PAD * 2 - 60, 23, 36, "#514944", 500);
    text(ctx, "本报告基于单张照片的程序化估计，仅供个人色彩参考。", PAD, 1640, 17, "#8A817B", 400);
    footer(ctx, 3); pages.push(canvas);
  }

  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [W, H], compress: true, hotfixes: ["px_scaling"] });
  pages.forEach((canvas, index) => { if (index) pdf.addPage([W, H], "portrait"); pdf.addImage(canvas.toDataURL("image/jpeg", .92), "JPEG", 0, 0, W, H, undefined, "FAST"); });
  pdf.save(`MUTE-${season.cn}-个人色彩报告.pdf`);
}
