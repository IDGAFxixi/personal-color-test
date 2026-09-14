"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Camera, Check, ChevronRight, CircleAlert, Eye, Gem, ImagePlus, Lightbulb, LoaderCircle, LockKeyhole, RefreshCw, Shirt, Sparkles, SunMedium, Upload, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ColorProfile, inspectAndAnalyze, QualityIssue, rgbToHex, SEASONS } from "@/lib/color-analysis";

type Step = "home" | "guide" | "upload" | "checking" | "quality" | "analyzing" | "result";
type Analysis = { preview: string; issues: QualityIssue[]; profile: ColorProfile };
type WebModelContext = { registerTool: (tool: { name: string; title: string; description: string; inputSchema: object; annotations: { readOnlyHint: boolean; untrustedContentHint: boolean }; execute: (input: unknown) => unknown }, options?: { signal: AbortSignal }) => void | Promise<void> };

const guideItems = [
  { icon: SunMedium, title: "面向自然光", text: "白天面对窗户，避开阳光直射和顶灯" },
  { icon: Sparkles, title: "保持素颜", text: "不化妆、不戴美瞳，不使用滤镜或美颜" },
  { icon: Camera, title: "露出完整面部", text: "收起刘海，摘下眼镜，正对镜头" },
];

const qualityLabels: Record<QualityIssue["code"], string> = { dark: "亮度", bright: "曝光", blur: "清晰度", cast: "色偏", face: "人脸" };
const defaultChecks = ["亮度自然", "曝光正常", "画面清晰", "肤色可读取", "正脸已定位"];
const drapes = [
  { name: "推荐色", key: "best" },
  { name: "对比色", key: "avoid" },
] as const;

export function ColorTestApp() {
  const [step, setStep] = useState<Step>("home");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState("");
  const [drapeIndex, setDrapeIndex] = useState(0);
  const [drapeKind, setDrapeKind] = useState<"best" | "avoid">("best");
  const [abRound, setAbRound] = useState(0);
  const [abChoice, setAbChoice] = useState<"a" | "b" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => { if (analysis?.preview) URL.revokeObjectURL(analysis.preview); }, [analysis?.preview]);

  useEffect(() => {
    const context = (document as Document & { modelContext?: WebModelContext }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const register = (tool: Parameters<WebModelContext["registerTool"]>[0]) => {
      try { void Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => undefined); } catch { /* unsupported implementation */ }
    };
    register({
      name: "start_color_test", title: "开始个人色彩测试",
      description: "打开拍照指导，开始当前页面的个人色彩测试流程。",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: (input) => { if (!input || typeof input !== "object" || Array.isArray(input) || Object.keys(input).length) throw new Error("此工具不接受参数"); setStep("guide"); return { step: "guide", status: "ready" }; },
    });
    register({
      name: "read_color_test_state", title: "读取测试状态",
      description: "读取当前个人色彩测试所处的步骤，不读取或返回照片内容。",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute: (input) => { if (!input || typeof input !== "object" || Array.isArray(input) || Object.keys(input).length) throw new Error("此工具不接受参数"); return { step, hasAnalysis: Boolean(analysis), season: analysis?.profile.season ?? null }; },
    });
    return () => lifecycle.abort();
  }, [step, analysis]);

  const reset = () => { if (analysis?.preview) URL.revokeObjectURL(analysis.preview); setAnalysis(null); setError(""); setDrapeIndex(0); setAbRound(0); setAbChoice(null); setStep("upload"); };

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("请选择 JPG、PNG 或 WebP 照片"); return; }
    if (file.size > 18 * 1024 * 1024) { setError("照片请控制在 18MB 以内"); return; }
    setError(""); setStep("checking");
    try {
      const result = await inspectAndAnalyze(file);
      setAnalysis(result);
      setTimeout(() => setStep("quality"), 900);
    } catch (e) {
      setError(e instanceof Error ? e.message : "照片读取失败，请换一张再试");
      setStep("upload");
    }
    event.target.value = "";
  }

  function startAnalysis() {
    setStep("analyzing");
    setTimeout(() => setStep("result"), 1500);
  }

  if (step === "home") return <Home onStart={() => setStep("guide")} />;
  if (step === "guide") return <Guide onBack={() => setStep("home")} onNext={() => setStep("upload")} />;
  if (step === "upload") return <UploadStep inputRef={inputRef} onFile={handleFile} onBack={() => setStep("guide")} error={error} />;
  if (step === "checking" || step === "analyzing") return <LoadingStep analysis={analysis} analyzing={step === "analyzing"} />;
  if (step === "quality" && analysis) return <QualityStep analysis={analysis} onRetry={reset} onContinue={startAnalysis} />;
  if (step === "result" && analysis) {
    const season = SEASONS[analysis.profile.season];
    const colors = drapeKind === "best" ? season.palette : season.avoid;
    const drapeColor = colors[drapeIndex % colors.length];
    const abPairs = [[season.palette[0], season.avoid[0]], [season.palette[3], season.avoid[1]], [season.palette[5], season.avoid[2]]];
    return <ResultStep analysis={analysis} onReset={reset} drapeColor={drapeColor} drapeKind={drapeKind} setDrapeKind={(kind) => { setDrapeKind(kind); setDrapeIndex(0); }} setDrapeIndex={setDrapeIndex} drapes={drapes} abPair={abPairs[abRound % abPairs.length]} abRound={abRound} abChoice={abChoice} chooseAb={(choice) => { setAbChoice(choice); setTimeout(() => { setAbRound(v => v + 1); setAbChoice(null); }, 450); }} />;
  }
  return null;
}

function Header({ back, progress }: { back?: () => void; progress?: number }) {
  return <header className="sticky top-0 z-30 border-b border-[#e9e3de]/80 bg-[#f8f6f3]/90 backdrop-blur-xl">
    <div className="mx-auto flex h-17 max-w-5xl items-center justify-between px-5">
      {back ? <button onClick={back} className="grid size-10 place-items-center rounded-full hover:bg-white" aria-label="返回"><ArrowLeft className="size-5" /></button> : <span className="w-10" />}
      <div className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-full bg-[#292321] text-xs font-semibold text-white">M</span><span className="text-sm font-semibold tracking-[.12em]">MUTE</span></div>
      <div className="w-10 text-right text-xs text-[#857b75]">{progress ? `${progress}%` : ""}</div>
    </div>
    {progress ? <Progress value={progress} className="h-0.5 rounded-none bg-[#e8e1dc] [&_[data-slot=progress-indicator]]:bg-[#b85f66]" /> : null}
  </header>;
}

function Home({ onStart }: { onStart: () => void }) {
  return <main className="min-h-screen overflow-hidden bg-[#f7f5f2] text-[#27221f]">
    <header className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 sm:px-8">
      <div className="flex items-center gap-2.5"><span className="grid size-9 place-items-center rounded-full bg-[#292321] text-sm font-semibold text-white">M</span><span className="text-sm font-semibold tracking-[0.18em]">MUTE 色研所</span></div>
      <div className="flex items-center gap-1.5 text-xs text-[#756d68]"><LockKeyhole className="size-3.5" /> 照片仅在本机分析</div>
    </header>
    <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-12 px-5 pb-14 pt-5 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:py-12">
      <div className="relative z-10 max-w-xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ded7d2] bg-white/70 px-3.5 py-2 text-xs font-medium text-[#716762] shadow-sm backdrop-blur"><span className="size-1.5 rounded-full bg-[#c8646b]" /> 12 季个人色彩 · 浏览器本地分析</div>
        <h1 className="text-[clamp(2.75rem,7vw,5.8rem)] font-medium leading-[.94] tracking-[-0.065em]">找到让你<br />更明亮的颜色</h1>
        <p className="mt-7 max-w-md text-base leading-7 text-[#6f6762] sm:text-lg">从一张自然光照片出发，分析冷暖、明度和彩度，并用色布对比帮你校准结果。</p>
        <Button onClick={onStart} className="mt-9 h-14 rounded-full bg-[#292321] px-7 text-base text-white shadow-[0_12px_30px_rgba(43,35,32,.18)] hover:bg-[#4a3e39]">开始色彩测试 <ArrowRight className="size-4" /></Button>
        <div className="mt-7 flex items-center gap-4 text-xs text-[#857c77]"><span>约 2 分钟</span><span className="h-3 w-px bg-[#d8d1cc]" /><span>无需注册</span><span className="h-3 w-px bg-[#d8d1cc]" /><span>结果可调整</span></div>
      </div>
      <div className="relative mx-auto w-full max-w-[470px]">
        <div className="absolute -left-12 top-6 size-40 rounded-full bg-[#efc4c2]/55 blur-3xl" /><div className="absolute -right-6 bottom-12 size-44 rounded-full bg-[#c7d7c5]/60 blur-3xl" />
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-white/80 bg-[#ddd4cf] p-5 shadow-[0_30px_80px_rgba(74,59,51,.18)]">
          <div className="h-full overflow-hidden rounded-[1.8rem] bg-[radial-gradient(circle_at_50%_34%,#f5d8c9_0_12%,#c79a87_13%_18%,transparent_19%),linear-gradient(145deg,#b58d84_0%,#ead2c6_45%,#9d726c_100%)]">
            <div className="flex h-full flex-col justify-end bg-gradient-to-t from-[#3b2d2b]/70 via-transparent to-white/10 p-6 text-white"><div className="mb-4 flex gap-2">{["#A96168", "#E3B7A6", "#71605B", "#D8C6A5"].map(color => <span key={color} className="size-8 rounded-full border-2 border-white/70 shadow" style={{background:color}} />)}</div><p className="text-xs uppercase tracking-[.2em] text-white/70">Your color mood</p><p className="mt-1 text-2xl font-medium">柔和 · 温暖 · 低对比</p></div>
          </div>
        </div>
      </div>
    </section>
  </main>;
}

function Guide({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  return <main className="min-h-screen bg-[#f8f6f3]"><Header back={onBack} progress={18} /><section className="mx-auto max-w-xl px-5 py-10 sm:py-14">
    <p className="text-xs font-semibold tracking-[.16em] text-[#b45e66]">拍照前 30 秒</p><h1 className="mt-2 text-3xl font-semibold tracking-[-.035em] sm:text-4xl">这样拍，结果更可靠</h1><p className="mt-3 leading-7 text-[#756d68]">环境光会直接影响肤色读数。请先确认下面三点。</p>
    <div className="mt-8 space-y-3">{guideItems.map(({ icon: Icon, title, text }) => <div key={title} className="flex gap-4 rounded-2xl border border-[#e6dfda] bg-white p-4 sm:p-5"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#f4e8e6] text-[#a9525d]"><Icon className="size-5" /></span><div><p className="font-medium">{title}</p><p className="mt-1 text-sm leading-5 text-[#7b726d]">{text}</p></div><Check className="ml-auto size-4 text-[#9a928c]" /></div>)}</div>
    <div className="mt-6 rounded-2xl bg-[#eee8e1] p-4 text-sm leading-6 text-[#665c56]"><Lightbulb className="mr-2 inline size-4 text-[#a65c52]" />白色或灰色上衣更合适，避免鲜艳衣服把颜色反射到脸上。</div>
    <Button onClick={onNext} className="mt-7 h-14 w-full rounded-full bg-[#292321] text-base hover:bg-[#4a3e39]">我准备好了 <ArrowRight /></Button>
    <p className="mt-4 text-center text-xs leading-5 text-[#8d847f]">分析结果是基于照片的估计，不代表专业线下诊断。</p>
  </section></main>;
}

function UploadStep({ inputRef, onFile, onBack, error }: { inputRef: React.RefObject<HTMLInputElement | null>; onFile: (e: ChangeEvent<HTMLInputElement>) => void; onBack: () => void; error: string }) {
  return <main className="min-h-screen bg-[#f8f6f3]"><Header back={onBack} progress={36} /><section className="mx-auto max-w-2xl px-5 py-10 text-center sm:py-14">
    <p className="text-xs font-semibold tracking-[.16em] text-[#b45e66]">添加照片</p><h1 className="mt-2 text-3xl font-semibold tracking-[-.035em] sm:text-4xl">拍一张自然光正脸照</h1><p className="mx-auto mt-3 max-w-md leading-7 text-[#756d68]">拍照或从相册选择。处理全程在浏览器中完成，照片不会上传。</p>
    <button onClick={() => inputRef.current?.click()} className="group mx-auto mt-8 grid aspect-[4/5] w-full max-w-sm place-items-center overflow-hidden rounded-[2rem] border border-dashed border-[#cfc5be] bg-white text-[#6f6660] shadow-sm transition hover:border-[#ad7777] hover:bg-[#fdfafa]">
      <div><span className="mx-auto grid size-16 place-items-center rounded-full bg-[#f2e9e6] text-[#a45660] transition group-hover:scale-105"><ImagePlus className="size-7" /></span><p className="mt-5 font-medium text-[#332c28]">轻触拍照或选择照片</p><p className="mt-2 text-sm">JPG、PNG、WebP · 最大 18MB</p></div>
    </button>
    <input ref={inputRef} className="sr-only" type="file" accept="image/*" capture="user" onChange={onFile} />
    {error && <p className="mx-auto mt-4 flex max-w-sm items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"><CircleAlert className="size-4" />{error}</p>}
    <Button variant="outline" onClick={() => inputRef.current?.click()} className="mt-6 h-12 rounded-full border-[#d7cec8] bg-white px-6"><Upload /> 选择照片</Button>
    <div className="mx-auto mt-8 flex max-w-sm items-start gap-3 text-left text-xs leading-5 text-[#857c77]"><LockKeyhole className="mt-0.5 size-4 shrink-0" /><p>我们会读取脸颊、额头、头发与眼部附近的色值。关闭页面后，照片与分析数据会自动消失。</p></div>
  </section></main>;
}

function LoadingStep({ analysis, analyzing }: { analysis: Analysis | null; analyzing: boolean }) {
  const messages = analyzing ? ["读取肤色 Lab 数值", "估计头发与瞳孔颜色", "计算 12 季倾向"] : ["检查亮度与曝光", "检查清晰度", "定位面部区域"];
  return <main className="grid min-h-screen place-items-center bg-[#f1eeea] px-5"><div className="w-full max-w-sm text-center">
    <div className="relative mx-auto aspect-[4/5] w-56 overflow-hidden rounded-[2rem] bg-[#d8cfca] shadow-xl" style={analysis ? { backgroundImage: `url(${analysis.preview})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}><div className="absolute inset-0 animate-[scan_1.8s_ease-in-out_infinite] bg-gradient-to-b from-transparent via-white/30 to-transparent" /><div className="absolute inset-5 rounded-[42%] border border-white/60" /></div>
    <LoaderCircle className="mx-auto mt-7 size-6 animate-spin text-[#a95760]" /><h1 className="mt-4 text-2xl font-semibold">{analyzing ? "正在生成你的色彩档案" : "正在检查照片质量"}</h1><div className="mt-5 space-y-2 text-sm text-[#766d68]">{messages.map((m, i) => <p key={m} className="flex items-center justify-center gap-2"><span className={`size-1.5 rounded-full ${i === 0 ? "bg-[#b85f66]" : "bg-[#cfc7c2]"}`} />{m}</p>)}</div>
  </div></main>;
}

function QualityStep({ analysis, onRetry, onContinue }: { analysis: Analysis; onRetry: () => void; onContinue: () => void }) {
  const blocking = analysis.issues.some(i => i.level === "error");
  const issueCodes = new Set(analysis.issues.map(i => i.code));
  return <main className="min-h-screen bg-[#f8f6f3]"><Header back={onRetry} progress={55} /><section className="mx-auto max-w-3xl px-5 py-9 sm:py-12">
    <div className="grid gap-7 md:grid-cols-[.85fr_1.15fr]">
      <div className="aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#ddd4cf] bg-cover bg-center shadow-lg" style={{backgroundImage:`url(${analysis.preview})`}} />
      <div><p className={`text-xs font-semibold tracking-[.15em] ${blocking ? "text-amber-700" : "text-[#66836b]"}`}>{blocking ? "需要重新拍摄" : "照片质量通过"}</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">{blocking ? "这张照片可能影响判断" : "光线很好，可以继续"}</h1>
        <div className="mt-6 space-y-2.5">{defaultChecks.map((label, i) => { const code = (["dark", "bright", "blur", "cast", "face"] as QualityIssue["code"][])[i]; const issue = analysis.issues.find(v => v.code === code); return <div key={label} className="flex items-center gap-3 rounded-xl border border-[#e6dfda] bg-white px-4 py-3"><span className={`grid size-7 place-items-center rounded-full ${issue ? "bg-amber-50 text-amber-700" : "bg-[#edf3ed] text-[#63806a]"}`}>{issue ? <CircleAlert className="size-4" /> : <Check className="size-4" />}</span><div><p className="text-sm font-medium">{qualityLabels[code] ?? label}</p><p className="text-xs text-[#817873]">{issue?.message ?? label}</p></div></div>; })}</div>
        <div className="mt-6 flex gap-3"><Button variant="outline" onClick={onRetry} className="h-12 flex-1 rounded-full border-[#d8cfc9] bg-white"><RefreshCw />重拍</Button><Button onClick={onContinue} disabled={blocking} className="h-12 flex-[1.35] rounded-full bg-[#292321] hover:bg-[#4a3e39]">开始分析<ArrowRight /></Button></div>
        {analysis.profile.faceMode === "estimated" && !blocking && <p className="mt-4 text-xs leading-5 text-[#857c77]">当前浏览器不支持原生人脸定位，已使用中央正脸几何区域估计，因此会降低置信度。</p>}
      </div>
    </div>
  </section></main>;
}

function ResultStep({ analysis, onReset, drapeColor, drapeKind, setDrapeKind, setDrapeIndex, drapes, abPair, abRound, abChoice, chooseAb }: { analysis: Analysis; onReset: () => void; drapeColor: string; drapeKind: "best" | "avoid"; setDrapeKind: (k: "best" | "avoid") => void; setDrapeIndex: React.Dispatch<React.SetStateAction<number>>; drapes: typeof drapes; abPair: string[]; abRound: number; abChoice: "a" | "b" | null; chooseAb: (c: "a" | "b") => void }) {
  const p = analysis.profile, season = SEASONS[p.season];
  return <main className="min-h-screen bg-[#f6f3ef]"><Header /><section className="mx-auto max-w-5xl px-5 pb-20 pt-8 sm:pt-12">
    <div className="rounded-[2rem] bg-[#2c2624] px-6 py-8 text-white sm:px-10 sm:py-10"><div className="grid items-center gap-8 md:grid-cols-[.72fr_1.28fr]">
      <div className="mx-auto aspect-[4/5] w-full max-w-[270px] rounded-[1.7rem] bg-cover bg-center shadow-2xl" style={{backgroundImage:`linear-gradient(to top, ${season.palette[0]}55, transparent 48%), url(${analysis.preview})`}} />
      <div><p className="text-xs font-semibold tracking-[.2em] text-[#d7aaa8]">YOUR COLOR PROFILE</p><div className="mt-3 flex flex-wrap items-end gap-x-4 gap-y-2"><h1 className="text-4xl font-semibold tracking-[-.04em] sm:text-5xl">{season.cn}</h1><span className="pb-1 text-sm tracking-[.12em] text-white/55">{season.en}</span></div><p className="mt-3 text-lg text-white/70">{season.note}</p><div className="mt-6 flex items-center gap-3"><div className="h-2 flex-1 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-[#d58083]" style={{width:`${p.confidence}%`}} /></div><span className="text-sm">置信度 {p.confidence}%</span></div><p className="mt-3 text-xs leading-5 text-white/45">基于当前照片的估计，可通过下方 A/B 试色进一步校准。</p>
        <div className="mt-7 grid grid-cols-4 gap-2">{[["冷暖",p.undertone],["明度",p.value],["彩度",p.chroma],["对比度",p.contrast]].map(([k,v]) => <div key={k} className="rounded-xl bg-white/7 p-3"><p className="text-[11px] text-white/45">{k}</p><p className="mt-1 text-sm font-medium">{v}</p></div>)}</div>
      </div>
    </div></div>

    <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_.9fr]"><div className="rounded-[1.7rem] border border-[#e3dcd6] bg-white p-6 sm:p-8"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold tracking-[.14em] text-[#a65960]">BEST PALETTE</p><h2 className="mt-1 text-2xl font-semibold">让肤色更透亮的颜色</h2></div><WandSparkles className="size-6 text-[#a65960]" /></div><div className="mt-6 grid grid-cols-4 gap-3">{season.palette.map((color, i) => <div key={color}><button onClick={() => { setDrapeKind("best"); setDrapeIndex(i); }} className="aspect-square w-full rounded-2xl shadow-sm ring-offset-2 hover:ring-2 hover:ring-[#ac777a]" style={{background:color}} aria-label={`试穿推荐色 ${color}`} /><p className="mt-1.5 text-center font-mono text-[10px] text-[#8a817c]">{color}</p></div>)}</div></div>
      <div className="rounded-[1.7rem] border border-[#e3dcd6] bg-white p-6 sm:p-8"><p className="text-xs font-semibold tracking-[.14em] text-[#7d746f]">YOUR COLOR DATA</p><h2 className="mt-1 text-2xl font-semibold">照片色彩读数</h2><div className="mt-6 space-y-4">{[["肤色",p.skin],["发色",p.hair],["眼睛",p.eyes]].map(([label, color]) => <div key={label as string} className="flex items-center"><span className="size-10 rounded-full border border-black/5 shadow-inner" style={{background:rgbToHex(color as ColorProfile["skin"])}} /><div className="ml-3"><p className="text-sm font-medium">{label as string}</p><p className="font-mono text-xs text-[#8a817c]">{rgbToHex(color as ColorProfile["skin"])}</p></div><span className="ml-auto text-xs text-[#8a817c]">估计值</span></div>)}</div><div className="mt-6 rounded-xl bg-[#f4f0ec] p-4 text-xs leading-5 text-[#756c66]">取样区域：额头与双颊，避开眼眉和唇部；发色与眼睛从偏暗像素估计。</div></div></section>

    <section className="mt-6 rounded-[1.7rem] border border-[#e3dcd6] bg-white p-6 sm:p-8"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold tracking-[.14em] text-[#a65960]">VIRTUAL DRAPING</p><h2 className="mt-1 text-2xl font-semibold">虚拟色布对比</h2></div><div className="flex rounded-full bg-[#f0ece8] p-1">{drapes.map(d => <button key={d.key} onClick={() => setDrapeKind(d.key)} className={`rounded-full px-4 py-2 text-sm ${drapeKind === d.key ? "bg-white shadow-sm" : "text-[#766d68]"}`}>{d.name}</button>)}</div></div>
      <div className="mt-6 grid items-center gap-6 md:grid-cols-[1fr_.8fr]"><div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[1.8rem] bg-cover bg-center" style={{backgroundImage:`url(${analysis.preview})`}}><div className="absolute inset-x-0 bottom-0 h-[37%] transition-colors duration-300" style={{background:`linear-gradient(165deg, ${drapeColor}, color-mix(in srgb, ${drapeColor}, #000 15%))`, clipPath:"polygon(0 15%,100% 0,100% 100%,0 100%)"}} /><div className="absolute bottom-5 left-5 rounded-full bg-black/35 px-3 py-1.5 font-mono text-xs text-white backdrop-blur">{drapeColor}</div></div><div><p className="text-sm leading-6 text-[#736a65]">轮换色布，观察法令纹、黑眼圈和肤色均匀度的变化。推荐色通常会让脸部边缘更清晰，而不是让色布本身最抢眼。</p><Button onClick={() => setDrapeIndex(v => v + 1)} variant="outline" className="mt-5 h-12 rounded-full border-[#d8cfc9] bg-white px-6">换一个颜色 <RefreshCw /></Button></div></div>
    </section>

    <section className="mt-6 grid gap-6 md:grid-cols-2"><div className="rounded-[1.7rem] border border-[#e3dcd6] bg-white p-6 sm:p-8"><p className="text-xs font-semibold tracking-[.14em] text-[#a65960]">MAKEUP & STYLE</p><h2 className="mt-1 text-2xl font-semibold">妆容与配饰建议</h2><div className="mt-6 grid grid-cols-2 gap-3">{[["口红",season.makeup.lip],["腮红",season.makeup.blush],["眼影",season.makeup.eye],["眉色",season.makeup.brow]].map(([k,v]) => <div key={k} className="rounded-xl bg-[#f5f1ed] p-4"><p className="text-xs text-[#8a817c]">{k}</p><p className="mt-1 text-sm font-medium">{v}</p></div>)}</div><div className="mt-4 flex items-center gap-3 rounded-xl border border-[#e5ddd7] p-4"><Gem className="size-5 text-[#a65960]" /><div><p className="text-xs text-[#8a817c]">首饰</p><p className="text-sm font-medium">{season.metals}</p></div></div><div className="mt-3 flex items-center gap-3 rounded-xl border border-[#e5ddd7] p-4"><Shirt className="size-5 text-[#a65960]" /><div><p className="text-xs text-[#8a817c]">谨慎选择</p><p className="text-sm font-medium">过强或相反底调的颜色</p></div><div className="ml-auto flex gap-1">{season.avoid.map(c => <span key={c} className="size-6 rounded-full" style={{background:c}} />)}</div></div></div>
      <div className="rounded-[1.7rem] bg-[#e9e1db] p-6 sm:p-8"><p className="text-xs font-semibold tracking-[.14em] text-[#8b5557]">A/B COLOR CHECK · {Math.min(abRound + 1, 3)}/3</p><h2 className="mt-1 text-2xl font-semibold">哪边让你看起来更精神？</h2><p className="mt-2 text-sm leading-6 text-[#746a64]">不要看你更喜欢哪个颜色，只观察面部。</p><div className="mt-6 grid grid-cols-2 gap-3">{(["a","b"] as const).map((choice, i) => <button key={choice} onClick={() => chooseAb(choice)} className={`overflow-hidden rounded-2xl border-2 bg-white transition ${abChoice === choice ? "scale-[.98] border-[#9d555d]" : "border-white"}`}><div className="aspect-[4/5] bg-cover bg-center" style={{backgroundImage:`linear-gradient(to top, ${abPair[i]} 0 34%, transparent 34%), url(${analysis.preview})`}} /><div className="flex items-center justify-between px-4 py-3"><span className="font-medium">选项 {choice.toUpperCase()}</span><ChevronRight className="size-4" /></div></button>)}</div>{abRound >= 3 ? <p className="mt-4 rounded-xl bg-white/65 p-3 text-sm text-[#655b56]"><Check className="mr-2 inline size-4" />已记录偏好，可作为下次算法调整的依据。</p> : null}</div>
    </section>

    <details className="mt-6 rounded-[1.7rem] border border-[#e3dcd6] bg-white p-6"><summary className="cursor-pointer font-medium">算法是怎样判断的？</summary><div className="mt-4 grid gap-3 text-sm leading-6 text-[#746b66] sm:grid-cols-3"><p><strong className="block text-[#302925]">1. 取样</strong>读取额头与双颊像素，绕开五官高色彩区域。</p><p><strong className="block text-[#302925]">2. 转换</strong>把 RGB 转为 Lab，再计算冷暖、明度、彩度与对比。</p><p><strong className="block text-[#302925]">3. 分类</strong>使用可调整阈值映射到 12 季，并因照片质量修正置信度。</p></div></details>
    <div className="mt-8 flex flex-col items-center"><Button onClick={onReset} variant="outline" className="h-12 rounded-full border-[#d5ccc6] bg-white px-6"><Camera />换一张照片重新测试</Button><p className="mt-4 max-w-xl text-center text-xs leading-5 text-[#887f79]">个人色彩会受光源、相机白平衡、染发和肤况影响。本结果是程序化估计，不构成专业结论。</p></div>
  </section></main>;
}
