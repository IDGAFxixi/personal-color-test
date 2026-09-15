export type RGB = { r: number; g: number; b: number };
export type Lab = { l: number; a: number; b: number };

export type QualityIssue = {
  code: "dark" | "bright" | "blur" | "cast" | "face";
  message: string;
  level: "error" | "warning";
};

export type ColorProfile = {
  season: SeasonKey;
  confidence: number;
  undertone: "偏暖" | "偏冷" | "中性";
  value: "明亮" | "中等" | "深邃";
  chroma: "清透" | "柔和" | "适中";
  contrast: "低" | "中" | "高";
  skin: RGB;
  hair: RGB;
  eyes: RGB;
  brows: RGB;
  metrics: {
    warmth: number;
    lightness: number;
    chroma: number;
    contrast: number;
    pupilContrast: number;
    browContrast: number;
    featureDefinition: number;
  };
  features: {
    eyeSpacing: number;
    faceRatio: number;
    browEyeDistance: number;
    symmetry: number;
  };
  faceMode: "detected" | "estimated";
  landmarkMode: "detected" | "estimated";
};

export type SeasonKey =
  | "light-spring" | "true-spring" | "bright-spring"
  | "light-summer" | "true-summer" | "soft-summer"
  | "soft-autumn" | "true-autumn" | "deep-autumn"
  | "bright-winter" | "true-winter" | "deep-winter";

export type SeasonInfo = {
  cn: string;
  en: string;
  note: string;
  palette: string[];
  avoid: string[];
  makeup: { lip: string; blush: string; eye: string; brow: string };
  metals: string;
};

export const SEASONS: Record<SeasonKey, SeasonInfo> = {
  "light-spring": { cn: "浅春型", en: "LIGHT SPRING", note: "轻盈、温暖、清透", palette: ["#F5C7A9", "#F1A18B", "#F3D47B", "#A9D7C2", "#85BED0", "#E69A87", "#FFF0D6", "#B9C98A"], avoid: ["#252334", "#6B1644", "#858585"], makeup: { lip: "蜜桃珊瑚", blush: "杏桃粉", eye: "浅焦糖", brow: "暖棕" }, metals: "香槟金、浅金" },
  "true-spring": { cn: "暖春型", en: "TRUE SPRING", note: "鲜活、明亮、温暖", palette: ["#F08D64", "#F2B84B", "#9BC55B", "#42B9A7", "#ED6A76", "#6EB3D0", "#F9D7A1", "#C98F51"], avoid: ["#7B8196", "#40283B", "#C4C5CA"], makeup: { lip: "番茄红", blush: "暖珊瑚", eye: "金棕", brow: "自然棕" }, metals: "黄金、玫瑰金" },
  "bright-spring": { cn: "亮春型", en: "BRIGHT SPRING", note: "高亮、清晰、有活力", palette: ["#FF5E5B", "#FFB938", "#53C77B", "#18B7B4", "#F24F91", "#5278D8", "#FFF2C4", "#8ECC55"], avoid: ["#8A7777", "#796E61", "#AAA7A5"], makeup: { lip: "亮珊瑚红", blush: "鲜桃粉", eye: "亮金棕", brow: "深暖棕" }, metals: "亮金、亮银" },
  "light-summer": { cn: "浅夏型", en: "LIGHT SUMMER", note: "轻柔、凉爽、通透", palette: ["#E8B8C5", "#C9BADA", "#A9CDE4", "#9FCFC8", "#D5D9A5", "#F3D2D9", "#B9B9D2", "#D8E7EC"], avoid: ["#1F2739", "#9C4E22", "#6E563C"], makeup: { lip: "浅玫瑰粉", blush: "冷粉", eye: "灰粉棕", brow: "浅灰棕" }, metals: "银、白金" },
  "true-summer": { cn: "冷夏型", en: "TRUE SUMMER", note: "冷静、柔润、雅致", palette: ["#C67E9A", "#9688B5", "#6EA5C5", "#6FAEAA", "#B6BC7C", "#D9A3AF", "#737FA3", "#CBD7DC"], avoid: ["#E99039", "#6F3B20", "#D5AC54"], makeup: { lip: "豆沙玫瑰", blush: "烟粉", eye: "灰紫棕", brow: "冷灰棕" }, metals: "哑光银、白金" },
  "soft-summer": { cn: "柔夏型", en: "SOFT SUMMER", note: "雾感、低饱和、冷柔", palette: ["#B77C8F", "#95869E", "#7897A7", "#789C98", "#A4A47C", "#C4A1A7", "#74788B", "#B7C0BD"], avoid: ["#FF5A44", "#F4C535", "#111828"], makeup: { lip: "灰调玫瑰", blush: "藕粉", eye: "灰褐", brow: "柔灰棕" }, metals: "古银、白金" },
  "soft-autumn": { cn: "柔秋型", en: "SOFT AUTUMN", note: "温柔、雾感、低对比", palette: ["#B36F68", "#C49470", "#B8A66D", "#81937A", "#6E8F8C", "#A18485", "#D3BBA4", "#806B5D"], avoid: ["#FF4D72", "#304FDB", "#F4F5FB"], makeup: { lip: "肉桂豆沙", blush: "裸杏", eye: "橄榄棕", brow: "柔暖棕" }, metals: "古金、玫瑰金" },
  "true-autumn": { cn: "暖秋型", en: "TRUE AUTUMN", note: "醇厚、温暖、自然", palette: ["#A84E32", "#C27A33", "#B18B35", "#687844", "#39756C", "#8D5652", "#D2A25E", "#58463C"], avoid: ["#D9CFF2", "#5F8DDF", "#F2CAD8"], makeup: { lip: "砖红", blush: "陶土橘", eye: "铜棕", brow: "深暖棕" }, metals: "黄金、古铜" },
  "deep-autumn": { cn: "深秋型", en: "DEEP AUTUMN", note: "深沉、浓郁、温暖", palette: ["#71362C", "#9B542F", "#8B6A26", "#3D5838", "#225D57", "#6D3C4C", "#B98545", "#302F29"], avoid: ["#E9BFD1", "#B8D5F3", "#FAE6A6"], makeup: { lip: "深枫叶红", blush: "暖棕红", eye: "深橄榄", brow: "深咖" }, metals: "古铜、深金" },
  "bright-winter": { cn: "亮冬型", en: "BRIGHT WINTER", note: "锐利、明艳、高对比", palette: ["#E82E67", "#D92739", "#604BC6", "#187ABB", "#008B80", "#11182A", "#F4F6F8", "#CBE631"], avoid: ["#B88C69", "#A68D63", "#A49A8E"], makeup: { lip: "正红或莓红", blush: "亮冷粉", eye: "冷灰黑", brow: "深灰棕" }, metals: "亮银、白金" },
  "true-winter": { cn: "冷冬型", en: "TRUE WINTER", note: "冷冽、纯净、鲜明", palette: ["#BA174A", "#A6172C", "#403A9A", "#1766A0", "#00736F", "#12131C", "#F7F7F4", "#6D1F72"], avoid: ["#C68A4A", "#A89768", "#D6B68B"], makeup: { lip: "蓝调正红", blush: "冷玫瑰", eye: "炭灰", brow: "冷深棕" }, metals: "银、铂金" },
  "deep-winter": { cn: "深冬型", en: "DEEP WINTER", note: "深邃、冷感、戏剧性", palette: ["#721B3B", "#7D1729", "#302962", "#17476D", "#075852", "#101017", "#DADCE3", "#512055"], avoid: ["#E5B484", "#D8C17A", "#BEA38D"], makeup: { lip: "深莓果", blush: "酒红玫瑰", eye: "黑咖或墨蓝", brow: "冷黑棕" }, metals: "深银、白金" },
};

export const rgbToHex = ({ r, g, b }: RGB) => `#${[r, g, b].map(v => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase()}`;

const rgbToLab = ({ r, g, b }: RGB): Lab => {
  const linear = (v: number) => { const x = v / 255; return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; };
  const rl = linear(r), gl = linear(g), bl = linear(b);
  let x = (rl * .4124 + gl * .3576 + bl * .1805) / .95047;
  let y = rl * .2126 + gl * .7152 + bl * .0722;
  let z = (rl * .0193 + gl * .1192 + bl * .9505) / 1.08883;
  const f = (v: number) => v > .008856 ? Math.cbrt(v) : 7.787 * v + 16 / 116;
  x = f(x); y = f(y); z = f(z);
  return { l: 116 * y - 16, a: 500 * (x - y), b: 200 * (y - z) };
};

const averageRegion = (data: ImageData, cx: number, cy: number, radius: number, darkBias = false): RGB => {
  const x0 = Math.max(0, Math.floor(cx - radius)), x1 = Math.min(data.width - 1, Math.ceil(cx + radius));
  const y0 = Math.max(0, Math.floor(cy - radius)), y1 = Math.min(data.height - 1, Math.ceil(cy + radius));
  const pixels: RGB[] = [];
  for (let y = y0; y <= y1; y += 2) for (let x = x0; x <= x1; x += 2) {
    const dx = x - cx, dy = y - cy;
    if (dx * dx + dy * dy > radius * radius) continue;
    const i = (y * data.width + x) * 4;
    pixels.push({ r: data.data[i], g: data.data[i + 1], b: data.data[i + 2] });
  }
  const chosen = darkBias ? pixels.sort((p, q) => (p.r + p.g + p.b) - (q.r + q.g + q.b)).slice(0, Math.max(8, pixels.length * .45)) : pixels;
  const total = chosen.reduce((s, p) => ({ r: s.r + p.r, g: s.g + p.g, b: s.b + p.b }), { r: 0, g: 0, b: 0 });
  const n = Math.max(1, chosen.length);
  return { r: total.r / n, g: total.g / n, b: total.b / n };
};

const mix = (values: RGB[]): RGB => ({ r: values.reduce((s, v) => s + v.r, 0) / values.length, g: values.reduce((s, v) => s + v.g, 0) / values.length, b: values.reduce((s, v) => s + v.b, 0) / values.length });
const luminance = (c: RGB) => .2126 * c.r + .7152 * c.g + .0722 * c.b;
const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value));
const colorDistance = (a: RGB, b: RGB) => Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);
const darkestCenter = (data: ImageData, cx: number, cy: number, rx: number, ry: number) => {
  const candidates: { x: number; y: number; light: number }[] = [];
  const x0 = Math.max(0, Math.floor(cx - rx)), x1 = Math.min(data.width - 1, Math.ceil(cx + rx));
  const y0 = Math.max(0, Math.floor(cy - ry)), y1 = Math.min(data.height - 1, Math.ceil(cy + ry));
  for (let y = y0; y <= y1; y += 2) for (let x = x0; x <= x1; x += 2) {
    if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 > 1) continue;
    const i = (y * data.width + x) * 4;
    candidates.push({ x, y, light: .2126 * data.data[i] + .7152 * data.data[i + 1] + .0722 * data.data[i + 2] });
  }
  const selected = candidates.sort((a, b) => a.light - b.light).slice(0, Math.max(6, Math.round(candidates.length * .16)));
  if (!selected.length) return { x: cx, y: cy };
  return { x: selected.reduce((sum, point) => sum + point.x, 0) / selected.length, y: selected.reduce((sum, point) => sum + point.y, 0) / selected.length };
};
const colorWarmth = (color: RGB) => {
  const lab = rgbToLab(color);
  return (lab.b - lab.a * .42 - 7) * 5;
};

export async function inspectAndAnalyze(file: File): Promise<{ preview: string; issues: QualityIssue[]; profile: ColorProfile }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 900 / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale), height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas"); canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("当前浏览器无法读取照片");
  ctx.drawImage(bitmap, 0, 0, width, height);
  const data = ctx.getImageData(0, 0, width, height);
  const preview = URL.createObjectURL(file);
  const issues: QualityIssue[] = [];

  let light = 0, clippedBright = 0, clippedDark = 0, edge = 0, samples = 0;
  let neutralR = 0, neutralG = 0, neutralB = 0, neutralCount = 0;
  for (let y = 1; y < height - 1; y += 4) for (let x = 1; x < width - 1; x += 4) {
    const i = (y * width + x) * 4;
    const l = .2126 * data.data[i] + .7152 * data.data[i + 1] + .0722 * data.data[i + 2];
    light += l; samples++;
    const r = data.data[i], g = data.data[i + 1], b = data.data[i + 2];
    if (l > 105 && Math.max(r, g, b) - Math.min(r, g, b) < 42) { neutralR += r; neutralG += g; neutralB += b; neutralCount++; }
    if (l > 247) clippedBright++; if (l < 15) clippedDark++;
    const ir = (y * width + x + 1) * 4, ib = ((y + 1) * width + x) * 4;
    edge += Math.abs(l - (.2126 * data.data[ir] + .7152 * data.data[ir + 1] + .0722 * data.data[ir + 2])) + Math.abs(l - (.2126 * data.data[ib] + .7152 * data.data[ib + 1] + .0722 * data.data[ib + 2]));
  }
  const avgLight = light / samples;
  if (avgLight < 58 || clippedDark / samples > .34) issues.push({ code: "dark", level: "error", message: "画面偏暗，请更靠近窗户后重拍" });
  if (avgLight > 218 || clippedBright / samples > .2) issues.push({ code: "bright", level: "error", message: "高光过曝，请避开直射光后重拍" });
  if (edge / samples < 7.2) issues.push({ code: "blur", level: "error", message: "照片有些模糊，请稳住手机后重拍" });
  if (neutralCount > Math.max(18, samples * .025)) {
    const neutral = [neutralR / neutralCount, neutralG / neutralCount, neutralB / neutralCount];
    if (Math.max(...neutral) - Math.min(...neutral) > 19) issues.push({ code: "cast", level: "error", message: "环境光有明显色偏，请关闭彩色灯光后重拍" });
  }

  type Point = { x: number; y: number };
  type FaceBox = { x: number; y: number; width: number; height: number };
  type FaceLandmark = { type?: string; locations?: Point[] };
  type DetectedFace = { boundingBox: DOMRectReadOnly; landmarks?: FaceLandmark[] };
  let face: FaceBox = { x: width * .2, y: height * .12, width: width * .6, height: height * .68 };
  let faceMode: ColorProfile["faceMode"] = "estimated";
  let detectedLandmarks: FaceLandmark[] = [];
  const FaceDetectorCtor = (window as unknown as { FaceDetector?: new (o: { fastMode: boolean; maxDetectedFaces: number }) => { detect: (source: ImageBitmap) => Promise<DetectedFace[]> } }).FaceDetector;
  if (FaceDetectorCtor) {
    try {
      const found = await new FaceDetectorCtor({ fastMode: false, maxDetectedFaces: 2 }).detect(bitmap);
      if (found.length === 1) {
        const b = found[0].boundingBox;
        face = { x: b.x * scale, y: b.y * scale, width: b.width * scale, height: b.height * scale };
        detectedLandmarks = found[0].landmarks ?? [];
        faceMode = "detected";
      }
      else issues.push({ code: "face", level: "error", message: found.length ? "请只保留一张完整正脸" : "没有识别到完整正脸，请重新拍摄" });
    } catch { /* use geometry fallback */ }
  }
  if (faceMode === "estimated" && (width / height > 1.35 || width < 280)) issues.push({ code: "face", level: "warning", message: "未能精确定位正脸，结果置信度会降低" });

  const px = (nx: number) => face.x + face.width * nx, py = (ny: number) => face.y + face.height * ny;
  const scalePoint = (point: Point): Point => ({ x: point.x * scale, y: point.y * scale });
  const landmarkCenter = (landmark: FaceLandmark): Point | null => {
    if (!landmark.locations?.length) return null;
    const locations = landmark.locations.map(scalePoint);
    return {
      x: locations.reduce((sum, point) => sum + point.x, 0) / locations.length,
      y: locations.reduce((sum, point) => sum + point.y, 0) / locations.length,
    };
  };
  const detectedEyes = detectedLandmarks
    .filter(landmark => landmark.type?.toLowerCase().includes("eye"))
    .map(landmarkCenter)
    .filter((point): point is Point => Boolean(point))
    .sort((a, b) => a.x - b.x);
  const landmarkMode: ColorProfile["landmarkMode"] = detectedEyes.length >= 2 ? "detected" : "estimated";
  const leftEyeSeed = detectedEyes[0] ?? { x: px(.36), y: py(.43) };
  const rightEyeSeed = detectedEyes[detectedEyes.length - 1] ?? { x: px(.64), y: py(.43) };
  const eyeSearchX = face.width * (landmarkMode === "detected" ? .055 : .1);
  const eyeSearchY = face.height * (landmarkMode === "detected" ? .035 : .06);
  const leftEye = darkestCenter(data, leftEyeSeed.x, leftEyeSeed.y, eyeSearchX, eyeSearchY);
  const rightEye = darkestCenter(data, rightEyeSeed.x, rightEyeSeed.y, eyeSearchX, eyeSearchY);
  const eyeRadius = clamp(face.width * .026, 3, 18);
  const browOffset = face.height * .085;
  const leftBrow = darkestCenter(data, leftEye.x, leftEye.y - browOffset, face.width * .09, face.height * .035);
  const rightBrow = darkestCenter(data, rightEye.x, rightEye.y - browOffset, face.width * .09, face.height * .035);

  const skin = mix([
    averageRegion(data, px(.5), py(.24), face.width * .055),
    averageRegion(data, px(.29), py(.57), face.width * .06),
    averageRegion(data, px(.71), py(.57), face.width * .06),
    averageRegion(data, px(.5), py(.7), face.width * .045),
  ]);
  const hair = mix([
    averageRegion(data, px(.5), py(.055), face.width * .11, true),
    averageRegion(data, px(.3), py(.12), face.width * .065, true),
    averageRegion(data, px(.7), py(.12), face.width * .065, true),
  ]);
  const eyes = mix([
    averageRegion(data, leftEye.x, leftEye.y, eyeRadius, true),
    averageRegion(data, rightEye.x, rightEye.y, eyeRadius, true),
  ]);
  const brows = mix([
    averageRegion(data, leftBrow.x, leftBrow.y, face.width * .042, true),
    averageRegion(data, rightBrow.x, rightBrow.y, face.width * .042, true),
  ]);
  const lab = rgbToLab(skin);
  const eyeSpacing = clamp(Math.abs(rightEye.x - leftEye.x) / face.width * 100);
  const faceRatio = clamp(face.height / face.width * 50);
  const browEyeDistance = clamp(((leftEye.y - leftBrow.y + rightEye.y - rightBrow.y) / 2) / face.height * 100);
  const faceCenter = face.x + face.width / 2;
  const symmetry = clamp(100 - Math.abs(((leftEye.x + rightEye.x) / 2) - faceCenter) / (face.width / 2) * 100);
  const pupilContrast = clamp(Math.abs(luminance(skin) - luminance(eyes)) / 1.75);
  const browContrast = clamp(Math.abs(luminance(skin) - luminance(brows)) / 1.75);
  const hairContrast = clamp(Math.abs(luminance(skin) - luminance(hair)) / 1.75);
  const featureDefinition = clamp(pupilContrast * .42 + browContrast * .28 + hairContrast * .22 + symmetry * .08);
  const warmth = clamp(colorWarmth(skin) * .68 + colorWarmth(hair) * .12 + colorWarmth(eyes) * .12 + colorWarmth(brows) * .08, -100, 100);
  const skinChroma = Math.sqrt(lab.a ** 2 + lab.b ** 2);
  const eyesLab = rgbToLab(eyes), hairLab = rgbToLab(hair), browsLab = rgbToLab(brows);
  const chromaValue = skinChroma * .7 + Math.hypot(eyesLab.a, eyesLab.b) * .14 + Math.hypot(hairLab.a, hairLab.b) * .1 + Math.hypot(browsLab.a, browsLab.b) * .06;
  const contrastValue = clamp(hairContrast * .34 + pupilContrast * .3 + browContrast * .2 + featureDefinition * .16);
  const isWarm = warmth > 7, isCool = warmth < -7;
  const lightness = lab.l;
  let season: SeasonKey;
  if (isWarm) {
    if (lightness > 72 && contrastValue < 48) season = "light-spring";
    else if (contrastValue > 58 && chromaValue > 26) season = "bright-spring";
    else if (lightness < 58) season = "deep-autumn";
    else if (chromaValue < 25) season = "soft-autumn";
    else season = "true-autumn";
  } else if (isCool) {
    if (lightness > 72 && contrastValue < 48) season = "light-summer";
    else if (contrastValue > 62 && chromaValue > 24) season = "bright-winter";
    else if (lightness < 56) season = "deep-winter";
    else if (chromaValue < 23) season = "soft-summer";
    else season = contrastValue > 48 ? "true-winter" : "true-summer";
  } else {
    if (lightness > 72) season = chromaValue > 25 ? "light-spring" : "light-summer";
    else if (lightness < 56) season = warmth >= 0 ? "deep-autumn" : "deep-winter";
    else season = warmth >= 0 ? "soft-autumn" : "soft-summer";
  }
  const sampleSeparation = clamp((colorDistance(skin, hair) + colorDistance(skin, eyes) + colorDistance(skin, brows)) / 9);
  const confidence = Math.round(clamp(52 + Math.abs(warmth) * .12 + Math.abs(lightness - 64) * .12 + sampleSeparation * .08 + (faceMode === "detected" ? 9 : 0) + (landmarkMode === "detected" ? 7 : 0) - issues.length * 5, 42, 93));
  const profile: ColorProfile = {
    season, confidence,
    undertone: isWarm ? "偏暖" : isCool ? "偏冷" : "中性",
    value: lightness > 72 ? "明亮" : lightness < 57 ? "深邃" : "中等",
    chroma: chromaValue > 31 ? "清透" : chromaValue < 23 ? "柔和" : "适中",
    contrast: contrastValue > 61 ? "高" : contrastValue < 42 ? "低" : "中",
    skin, hair, eyes, brows,
    metrics: { warmth, lightness, chroma: chromaValue, contrast: contrastValue, pupilContrast, browContrast, featureDefinition },
    features: { eyeSpacing, faceRatio, browEyeDistance, symmetry },
    faceMode, landmarkMode,
  };
  return { preview, issues, profile };
}
