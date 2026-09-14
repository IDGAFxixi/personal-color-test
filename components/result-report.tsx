"use client";

import { useState } from "react";
import { Camera, Check, ChevronRight, Download, FileText, Gem, Layers3, LoaderCircle, Palette, RefreshCw, Shirt, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getExtendedAdvice } from "@/lib/color-advice";
import { rgbToHex, SEASONS, type ColorProfile } from "@/lib/color-analysis";
import { exportColorReport } from "@/lib/export-color-report";

type Analysis = { preview: string; profile: ColorProfile };
type Drape = { name: string; key: "best" | "avoid" };

export type ResultReportProps = {
  analysis: Analysis;
  onReset: () => void;
  drapeColor: string;
  drapeKind: "best" | "avoid";
  setDrapeKind: (kind: "best" | "avoid") => void;
  setDrapeIndex: React.Dispatch<React.SetStateAction<number>>;
  drapes: readonly Drape[];
  abPair: string[];
  abRound: number;
  abChoice: "a" | "b" | null;
  chooseAb: (choice: "a" | "b") => void;
};

const CardTitle = ({ kicker, title, icon: Icon }: { kicker: string; title: string; icon?: React.ComponentType<{ className?: string }> }) => <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold tracking-[.15em] text-[#93616c]">{kicker}</p><h2 className="mt-1 text-2xl font-semibold tracking-[-.025em]">{title}</h2></div>{Icon ? <Icon className="mt-1 size-5 text-[#93616c]" /> : null}</div>;

const AdviceRow = ({ label, children }: { label: string; children: React.ReactNode }) => <div className="border-b border-[#e7dfd8] py-4 last:border-0"><p className="text-sm text-[#827871]">{label}</p><p className="mt-1.5 text-base leading-7 text-[#302a27]">{children}</p></div>;

function ToneMap({ profile }: { profile: ColorProfile }) {
  const valueRow = profile.value === "明亮" ? 0 : profile.value === "深邃" ? 2 : 1;
  const chromaCol = profile.chroma === "柔和" ? 0 : profile.chroma === "清透" ? 2 : 1;
  const labels = [["浅柔", "浅雅", "浅亮"], ["柔和", "经典", "鲜明"], ["深柔", "深稳", "深亮"]];
  return <div><div className="mb-2 flex justify-between text-[11px] tracking-[.12em] text-[#9a9089]"><span>SOFT</span><span>CHROMA</span><span>VIVID</span></div><div className="grid grid-cols-3 gap-2">{labels.flatMap((row, r) => row.map((label, c) => <div key={label} className={`grid aspect-square place-items-center rounded-xl text-xs transition ${r === valueRow && c === chromaCol ? "bg-[#322b28] font-semibold text-white shadow-lg" : "bg-[#ede7e1] text-[#81766f]"}`}>{label}</div>))}</div><div className="mt-2 flex justify-between text-[11px] tracking-[.12em] text-[#9a9089]"><span>LIGHT</span><span>VALUE</span><span>DEEP</span></div></div>;
}

export function ResultReport(props: ResultReportProps) {
  const { analysis, onReset, drapeColor, drapeKind, setDrapeKind, setDrapeIndex, drapes, abPair, abRound, abChoice, chooseAb } = props;
  const p = analysis.profile, season = SEASONS[p.season], advice = getExtendedAdvice(p.season, p);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");

  const exportPdf = async () => {
    setExporting(true); setExportError("");
    try { await exportColorReport(analysis, advice); }
    catch { setExportError("报告生成失败，请稍后再试或更换浏览器"); }
    finally { setExporting(false); }
  };

  return <main className="min-h-screen bg-[#f5f1ec] text-[#2d2825]"><section className="mx-auto max-w-5xl px-5 pb-20 pt-7 sm:pt-12">
    <div className="overflow-hidden rounded-[2rem] bg-[#2c2624] text-white"><div className="grid md:grid-cols-[.72fr_1.28fr]">
      <div className="min-h-[360px] bg-cover bg-center md:min-h-[520px]" style={{backgroundImage:`linear-gradient(to top, ${season.palette[0]}66, transparent 50%), url(${analysis.preview})`}} />
      <div className="flex flex-col justify-center px-6 py-9 sm:px-10 md:py-12"><p className="text-xs font-semibold tracking-[.22em] text-[#d7aaa8]">YOUR COLOR PROFILE</p><div className="mt-4 flex flex-wrap items-end gap-x-4 gap-y-2"><h1 className="text-4xl font-semibold tracking-[-.04em] sm:text-5xl">{season.cn}</h1><span className="pb-1 text-sm tracking-[.12em] text-white/55">{season.en}</span></div><p className="mt-3 text-lg text-white/70">{season.note.replaceAll("、", " · ")}</p>
        <div className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10"><div className="bg-white/5 p-4"><p className="text-[11px] text-white/45">PRIMARY</p><p className="mt-1 font-medium">{season.cn}</p></div><div className="bg-white/5 p-4"><p className="text-[11px] text-white/45">SECONDARY</p><p className="mt-1 font-medium">{advice.secondary}</p></div></div>
        <div className="mt-6 flex items-center gap-3"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-[#d58083]" style={{width:`${p.confidence}%`}} /></div><span className="text-sm">置信度 {p.confidence}%</span></div><p className="mt-3 text-xs leading-5 text-white/45">这是基于当前照片的程序化估计，可结合下方虚拟试色自行判断。</p>
      </div>
    </div></div>

    <section className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
      <div className="rounded-[1.7rem] border border-[#e2dad3] bg-white p-6 sm:p-8"><CardTitle kicker="COLOR DIAGNOSIS" title="你的色彩坐标" icon={Palette} /><div className="mt-7 grid gap-5 sm:grid-cols-2">{[["冷暖",p.undertone,`${Math.round(p.metrics.warmth)}`],["明度",p.value,`${Math.round(p.metrics.lightness)}`],["彩度",p.chroma,`${Math.round(p.metrics.chroma)}`],["对比",p.contrast,`${Math.round(p.metrics.contrast)}`]].map(([label,value,score],i) => <div key={label} className="rounded-2xl bg-[#f4f0ec] p-4"><div className="flex items-end justify-between"><div><p className="text-xs text-[#8c817a]">{label}</p><p className="mt-1 text-lg font-semibold">{value}</p></div><span className="font-mono text-xs text-[#9d928b]">{score}</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#ddd5ce]"><div className="h-full rounded-full bg-[#8b6673]" style={{width:`${[Math.abs(p.metrics.warmth),p.metrics.lightness,Math.min(100,p.metrics.chroma*2.2),p.metrics.contrast][i]}%`}} /></div></div>)}</div></div>
      <div className="rounded-[1.7rem] border border-[#e2dad3] bg-white p-6 sm:p-8"><CardTitle kicker="TONE MAP" title="明度 × 彩度" /><div className="mt-7"><ToneMap profile={p} /></div></div>
    </section>

    <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
      <div className="rounded-[1.7rem] border border-[#e2dad3] bg-white p-6 sm:p-8"><CardTitle kicker="BEST PALETTE" title="让你更透亮的颜色" icon={WandSparkles} /><div className="mt-6 grid grid-cols-4 gap-3">{season.palette.map((color,i) => <div key={color}><button onClick={() => {setDrapeKind("best");setDrapeIndex(i);}} className="aspect-square w-full rounded-2xl shadow-sm ring-offset-2 hover:ring-2 hover:ring-[#ac777a]" style={{background:color}} aria-label={`试穿推荐色 ${color}`} /><p className="mt-1.5 text-center font-mono text-[10px] text-[#8a817c]">{color}</p></div>)}</div></div>
      <div className="rounded-[1.7rem] bg-[#312b28] p-6 text-white sm:p-8"><CardTitle kicker="BEST / AVOID" title="主色与谨慎色" icon={Layers3} /><div className="mt-7"><p className="text-xs text-white/45">核心色</p><div className="mt-2 flex gap-2">{season.palette.slice(0,5).map(c => <span key={c} className="h-16 flex-1 rounded-xl" style={{background:c}} />)}</div><p className="mt-6 text-xs text-white/45">尽量避开大面积靠近脸部</p><div className="mt-2 flex gap-2">{season.avoid.map(c => <span key={c} className="h-12 flex-1 rounded-xl" style={{background:c}} />)}</div><p className="mt-5 text-sm leading-6 text-white/60">谨慎色并非不能穿，可将它放在下装、鞋包或小面积图案中。</p></div></div>
    </section>

    <section className="mt-6 rounded-[1.7rem] border border-[#e2dad3] bg-white p-5 sm:p-8"><CardTitle kicker="PERSONAL STYLE GUIDE" title="你的专属使用手册" icon={Shirt} />
      <Tabs defaultValue="makeup" className="mt-6"><TabsList variant="line" className="h-auto w-full justify-start gap-5 overflow-x-auto border-b border-[#e3dbd4] p-0 pb-2"><TabsTrigger value="makeup" className="px-1 pb-3 text-sm">妆容</TabsTrigger><TabsTrigger value="hair" className="px-1 pb-3 text-sm">发色与配饰</TabsTrigger><TabsTrigger value="outfit" className="px-1 pb-3 text-sm">穿搭公式</TabsTrigger><TabsTrigger value="tips" className="px-1 pb-3 text-sm">避雷技巧</TabsTrigger></TabsList>
        <TabsContent value="makeup" className="pt-3"><AdviceRow label="粉底">{advice.foundation}</AdviceRow><AdviceRow label="修容 / 腮红">自然中性色修容；{season.makeup.blush}</AdviceRow><AdviceRow label="眼影 / 眼线">{season.makeup.eye}；眼线顺着你的{p.contrast}对比度选择深浅</AdviceRow><AdviceRow label="口红">日常选{season.makeup.lip}，正式场合可提高一档饱和度</AdviceRow><AdviceRow label="美甲">{advice.manicure}</AdviceRow></TabsContent>
        <TabsContent value="hair" className="pt-3"><AdviceRow label="建议发色">{advice.hair}</AdviceRow><AdviceRow label="尽量避开">{advice.hairAvoid}</AdviceRow><AdviceRow label="眉色">{season.makeup.brow}，通常比发色浅半度更自然</AdviceRow><AdviceRow label="金属 / 首饰">{season.metals}；光泽感与整体对比度保持一致</AdviceRow><AdviceRow label="眼镜 / 美瞳">{advice.glasses}；美瞳选择{advice.lens}</AdviceRow></TabsContent>
        <TabsContent value="outfit" className="pt-3"><AdviceRow label="同色系搭配">{advice.outfitSame}</AdviceRow><AdviceRow label="邻近色搭配">{advice.outfitNeighbor}</AdviceRow><AdviceRow label="点缀色">{advice.accent}</AdviceRow><AdviceRow label="配色比例">{advice.ratio}</AdviceRow><AdviceRow label="面料质感">{advice.fabrics}</AdviceRow></TabsContent>
        <TabsContent value="tips" className="pt-3"><AdviceRow label="白色怎么选">{advice.white}</AdviceRow><AdviceRow label="黑色怎么穿">{advice.black}</AdviceRow><AdviceRow label="图案">{advice.pattern}</AdviceRow><AdviceRow label="最重要的一条">{advice.stylingRule}</AdviceRow><AdviceRow label="谨慎色处理">把不理想的颜色移到下装或配饰，并用你的核心色隔开脸部。</AdviceRow></TabsContent>
      </Tabs>
    </section>

    <section className="mt-6 rounded-[1.7rem] border border-[#e2dad3] bg-white p-6 sm:p-8"><div className="flex flex-wrap items-end justify-between gap-4"><CardTitle kicker="VIRTUAL DRAPING" title="虚拟色布对比" /><div className="flex rounded-full bg-[#f0ece8] p-1">{drapes.map(d => <button key={d.key} onClick={() => setDrapeKind(d.key)} className={`rounded-full px-4 py-2 text-sm ${drapeKind===d.key?"bg-white shadow-sm":"text-[#766d68]"}`}>{d.name}</button>)}</div></div><div className="mt-6 grid items-center gap-6 md:grid-cols-[1fr_.8fr]"><div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[1.8rem] bg-cover bg-center" style={{backgroundImage:`url(${analysis.preview})`}}><div className="absolute inset-x-0 bottom-0 h-[37%] transition-colors duration-300" style={{background:`linear-gradient(165deg, ${drapeColor}, color-mix(in srgb, ${drapeColor}, #000 15%))`,clipPath:"polygon(0 15%,100% 0,100% 100%,0 100%)"}} /><div className="absolute bottom-5 left-5 rounded-full bg-black/35 px-3 py-1.5 font-mono text-xs text-white backdrop-blur">{drapeColor}</div></div><div><p className="text-sm leading-6 text-[#736a65]">轮换色布，只观察黑眼圈、法令纹和肤色均匀度。合适的颜色会让五官清晰，而不是让色布本身抢眼。</p><Button onClick={() => setDrapeIndex(v=>v+1)} variant="outline" className="mt-5 h-12 rounded-full border-[#d8cfc9] bg-white px-6">换一个颜色 <RefreshCw /></Button></div></div></section>

    <section className="mt-6 rounded-[1.7rem] bg-[#e7dfd8] p-6 sm:p-8"><p className="text-xs font-semibold tracking-[.14em] text-[#865d68]">A/B COLOR CHECK · {Math.min(abRound+1,3)}/3</p><div className="mt-2 grid gap-6 md:grid-cols-[.65fr_1.35fr]"><div><h2 className="text-2xl font-semibold">哪边让你更有精神？</h2><p className="mt-3 text-sm leading-6 text-[#746a64]">不要看自己喜欢哪个颜色，只观察面部。选择会作为你的自我校准记录。</p>{abRound>=3?<p className="mt-5 rounded-xl bg-white/65 p-3 text-sm"><Check className="mr-2 inline size-4" />已完成 3 轮校准</p>:null}</div><div className="grid grid-cols-2 gap-3">{(["a","b"] as const).map((choice,i)=><button key={choice} onClick={()=>chooseAb(choice)} className={`overflow-hidden rounded-2xl border-2 bg-white transition ${abChoice===choice?"scale-[.98] border-[#9d555d]":"border-white"}`}><div className="aspect-[4/5] bg-cover bg-center" style={{backgroundImage:`linear-gradient(to top, ${abPair[i]} 0 34%, transparent 34%), url(${analysis.preview})`}} /><div className="flex items-center justify-between px-4 py-3"><span className="font-medium">选项 {choice.toUpperCase()}</span><ChevronRight className="size-4" /></div></button>)}</div></div></section>

    <section className="mt-6 overflow-hidden rounded-[1.7rem] bg-[#332c29] text-white"><div className="grid items-center gap-6 px-6 py-8 sm:px-10 md:grid-cols-[1fr_auto]"><div><div className="flex items-center gap-2 text-[#d1aeb6]"><FileText className="size-4" /><p className="text-xs font-semibold tracking-[.15em]">PDF COLOR REPORT</p></div><h2 className="mt-3 text-2xl font-semibold sm:text-3xl">把完整色彩档案带走</h2><p className="mt-3 max-w-xl text-sm leading-6 text-white/55">三页简约报告包含诊断坐标、照片色值、推荐色盘、妆容、发色、配饰与穿搭公式。</p>{exportError?<p className="mt-3 text-sm text-[#e8b8ba]">{exportError}</p>:null}</div><Button onClick={exportPdf} disabled={exporting} className="h-14 rounded-full bg-[#8c6674] px-7 text-base text-white hover:bg-[#a07484]">{exporting?<LoaderCircle className="animate-spin"/>:<Download/>}{exporting?"正在生成…":"下载 PDF 色彩报告"}</Button></div></section>

    <details className="mt-6 rounded-[1.7rem] border border-[#e2dad3] bg-white p-6"><summary className="cursor-pointer font-medium">算法是怎样判断的？</summary><div className="mt-4 grid gap-3 text-sm leading-6 text-[#746b66] sm:grid-cols-3"><p><strong className="block text-[#302925]">1. 取样</strong>读取额头与双颊像素，绕开五官高色彩区域。</p><p><strong className="block text-[#302925]">2. 转换</strong>把 RGB 转为 Lab，再计算冷暖、明度、彩度与对比。</p><p><strong className="block text-[#302925]">3. 分类</strong>使用透明、可调整的阈值映射到 12 季结果。</p></div></details>
    <div className="mt-8 flex flex-col items-center"><Button onClick={onReset} variant="outline" className="h-12 rounded-full border-[#d5ccc6] bg-white px-6"><Camera />换一张照片重新测试</Button><p className="mt-4 max-w-xl text-center text-xs leading-5 text-[#887f79]">个人色彩会受光源、相机白平衡、染发和肤况影响。本结果是程序化估计，不构成专业结论。</p></div>
  </section></main>;
}
