"use client";

import Link from "next/link";
import { CheckIcon, CopyIcon, GlobeIcon, MoonIcon, RotateCcwIcon, SunIcon } from "lucide-react";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { FooterCredit } from "@/components/footer-credit";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  Menu,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from "@/components/ui/menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider, SliderValue } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  getLocale,
  setLocale,
  subscribeToLocale,
  type Locale,
} from "@/lib/locale";
import {
  AiStreamText,
  BreathingWordsText,
  BreathingText,
  DecryptText,
  ElasticLettersText,
  FocusBlurText,
  GradientSweepText,
  HeartbeatText,
  IridescentText,
  MorphWordsText,
  NumberDeltaText,
  RollingNumber,
  SoftScrambleText,
  SpoilerText,
  TextReveal,
  TickerText,
  TypewriterText,
  WeightSweepText,
} from "@/motion-text-kit";

type EffectId =
  | "ai-stream"
  | "breathing-words"
  | "reveal"
  | "decrypt"
  | "sweep"
  | "focus"
  | "breathing"
  | "elastic"
  | "morph"
  | "number-delta"
  | "rolling"
  | "soft-scramble"
  | "spoiler"
  | "ticker"
  | "typewriter"
  | "weight"
  | "iridescent"
  | "heartbeat";

const effects: { id: EffectId; label: string; description: string; zhLabel: string; zhDescription: string }[] = [
  { id: "reveal", label: "Character reveal", description: "Letters enter, hold, then leave.", zhLabel: "字符显现", zhDescription: "字符依次进入、停留，然后离开。" },
  { id: "ai-stream", label: "AI stream text", description: "Characters rise in, flash color, then settle.", zhLabel: "AI 流式文本", zhDescription: "字符上浮、闪过颜色，然后稳定呈现。" },
  { id: "breathing-words", label: "Breathing words", description: "Words breathe with staggered quiet rhythm.", zhLabel: "词语呼吸", zhDescription: "词语以错落而轻柔的节奏呼吸。" },
  { id: "decrypt", label: "Decrypt text", description: "Random glyphs resolve into final copy.", zhLabel: "解密文本", zhDescription: "随机字符逐渐解析为最终文案。" },
  { id: "sweep", label: "Gradient sweep", description: "A quiet highlight moves across the text.", zhLabel: "渐变扫光", zhDescription: "柔和高光从文字表面掠过。" },
  { id: "focus", label: "Blur focus", description: "The whole line resolves softly into focus.", zhLabel: "模糊聚焦", zhDescription: "整行文字由模糊柔和地聚焦清晰。" },
  { id: "breathing", label: "Breathing text", description: "Opacity, blur, and scale move as one breath.", zhLabel: "呼吸文本", zhDescription: "透明度、模糊和缩放同步呼吸。" },
  { id: "elastic", label: "Elastic letters", description: "Characters stretch and settle with restraint.", zhLabel: "弹性字符", zhDescription: "字符拉伸后克制地回弹稳定。" },
  { id: "morph", label: "Morph words", description: "One word switches softly inside a phrase.", zhLabel: "词语变形", zhDescription: "短语中的词语平滑切换。" },
  { id: "number-delta", label: "Number delta", description: "Signed numbers roll by direction.", zhLabel: "数值变化", zhDescription: "带正负号的数字按方向滚动。" },
  { id: "rolling", label: "Rolling number", description: "Digits pop in with tabular rhythm.", zhLabel: "滚动数字", zhDescription: "数字以等宽节奏依次弹入。" },
  { id: "soft-scramble", label: "Soft scramble", description: "A few characters softly swap, then return.", zhLabel: "柔和扰动", zhDescription: "少量字符轻柔替换后恢复。" },
  { id: "spoiler", label: "Invisible ink", description: "Hidden text reveals through a particle mask.", zhLabel: "隐形墨水", zhDescription: "隐藏文字通过粒子遮罩显现。" },
  { id: "ticker", label: "Flowing ticker", description: "Long text loops through softened edges.", zhLabel: "流动字幕", zhDescription: "长文本穿过柔化边缘循环滚动。" },
  { id: "typewriter", label: "Typewriter cursor", description: "Characters type and delete with a caret.", zhLabel: "打字机光标", zhDescription: "字符随光标逐字输入和删除。" },
  { id: "weight", label: "Weight sweep", description: "Font weight passes across each character.", zhLabel: "字重扫动", zhDescription: "字重变化依次扫过每个字符。" },
  { id: "iridescent", label: "Iridescent text", description: "Color flows from left to right, then clears.", zhLabel: "虹彩文本", zhDescription: "色彩从左向右流动后消退。" },
  { id: "heartbeat", label: "Heartbeat text", description: "A restrained double-beat rhythm.", zhLabel: "心跳文本", zhDescription: "文字以克制的双峰心跳节奏起伏。" },
];

const pageCopy = {
  en: {
    blur: "Blur",
    copyCode: "Copy React code",
    duration: "Duration",
    effect: "Effect",
    github: "Open GitHub repository",
    intensity: "Intensity",
    languageMenuLabel: "Language",
    languageOptions: { zh: "中文", en: "English" },
    navigation: "Primary navigation",
    replay: "Replay animation",
    reset: "Reset parameters",
    size: "Text size",
    stagger: "Stagger",
    text: "Text",
    theme: "Toggle color theme",
  },
  zh: {
    blur: "模糊",
    copyCode: "复制 React 代码",
    duration: "时长",
    effect: "动效",
    github: "打开 GitHub 仓库",
    intensity: "强度",
    languageMenuLabel: "语言",
    languageOptions: { zh: "中文", en: "English" },
    navigation: "主导航",
    replay: "重新播放动效",
    reset: "重置参数",
    size: "文字大小",
    stagger: "错开延迟",
    text: "文本",
    theme: "切换颜色主题",
  },
} as const;

const defaults = { blur: 6, duration: 1800, fontSize: 48, intensity: 18, stagger: 32 };

function numberValue(value: number | readonly number[]): number {
  return typeof value === "number" ? value : (value[0] ?? 0);
}

function componentNameFromCode(code: string): string {
  return code.match(/<([A-Z][A-Za-z0-9]*)/)?.[1] ?? "TextReveal";
}

export default function PlaygroundPage() {
  const [effect, setEffect] = useState<EffectId>("reveal");
  const [text, setText] = useState("Text, in motion.");
  const [duration, setDuration] = useState(defaults.duration);
  const [blur, setBlur] = useState(defaults.blur);
  const [fontSize, setFontSize] = useState(defaults.fontSize);
  const [intensity, setIntensity] = useState(defaults.intensity);
  const [stagger, setStagger] = useState(defaults.stagger);
  const [replay, setReplay] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const locale = useSyncExternalStore(
    subscribeToLocale,
    getLocale,
    (): Locale => "zh",
  );
  const isChinese = locale === "zh";
  const copy = pageCopy[locale];
  const selectedEffect = effects.find((item) => item.id === effect) ?? effects[0];

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const syncTheme = (event: MediaQueryList | MediaQueryListEvent) => {
      setIsDark(event.matches);
    };

    syncTheme(mediaQuery);
    mediaQuery.addEventListener("change", syncTheme);

    return () => mediaQuery.removeEventListener("change", syncTheme);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);

    return () => document.documentElement.classList.remove("dark");
  }, [isDark]);

  useEffect(() => {
    document.documentElement.lang = isChinese ? "zh-CN" : "en";
  }, [isChinese]);

  const code = useMemo(() => {
    const textLiteral = JSON.stringify(text);
    const shared = `text=${textLiteral} duration={${duration}} blur={${blur}}`;

    const snippet = (() => {
      switch (effect) {
      case "ai-stream":
        return `<AiStreamText ${shared} stagger={${stagger}} distance={${intensity}} />`;
      case "breathing-words":
        return `<BreathingWordsText ${shared} stagger={${stagger}} minOpacity={${Math.max(0.3, 1 - intensity / 100).toFixed(2)}} />`;
      case "decrypt":
        return `<DecryptText text=${textLiteral} duration={${duration}} />`;
      case "sweep":
        return `<GradientSweepText duration={${duration}} angle={${90 + intensity}}>{${textLiteral}}</GradientSweepText>`;
      case "focus":
        return `<FocusBlurText ${shared} scale={${(1 + intensity / 250).toFixed(3)}} repeat />`;
      case "breathing":
        return `<BreathingText ${shared} scale={${(1 + intensity / 500).toFixed(3)}} minOpacity={${Math.max(0.3, 1 - intensity / 100).toFixed(2)}} />`;
      case "elastic":
        return `<ElasticLettersText ${shared} stagger={${stagger}} stretch={${(1 + intensity / 100).toFixed(2)}} />`;
      case "morph":
        return `<MorphWordsText words={["better", "faster", "softer"]} duration={${duration}} blur={${blur}} />`;
      case "number-delta":
        return `<NumberDeltaText value={${intensity - 20}} duration={${duration}} blur={${blur}} />`;
      case "rolling":
        return `<RollingNumber value={${duration}} duration={${Math.min(duration, 1200)}} blur={${blur}} />`;
      case "soft-scramble":
        return `<SoftScrambleText text=${textLiteral} duration={${duration}} intensity={${(intensity / 100).toFixed(2)}} />`;
      case "spoiler":
        return `<SpoilerText text=${textLiteral} duration={${Math.min(duration, 900)}} />`;
      case "ticker":
        return `<TickerText text=${textLiteral} duration={${Math.max(duration * 4, 8000)}} blur={${blur}} />`;
      case "typewriter":
        return `<TypewriterText text=${textLiteral} speed={${Math.max(16, Math.round(duration / 32))}} />`;
      case "weight":
        return `<WeightSweepText text=${textLiteral} duration={${duration}} stagger={${stagger}} />`;
      case "iridescent":
        return `<IridescentText text=${textLiteral} duration={${duration}} intensity={${(1 + intensity / 100).toFixed(2)}} />`;
      case "heartbeat":
        return `<HeartbeatText ${shared} scale={${(1 + intensity / 300).toFixed(3)}} />`;
      default:
        return `<TextReveal ${shared} stagger={${stagger}} distance={${intensity}} mode="in-out" repeat />`;
      }
    })();

    return snippet.replace(
      /^<([A-Z][A-Za-z0-9]*)/,
      `<$1 style={{ fontSize: "${fontSize}px" }}`,
    );
  }, [blur, duration, effect, fontSize, intensity, stagger, text]);

  function renderPreview() {
    const key = `${effect}-${text}-${duration}-${blur}-${fontSize}-${intensity}-${stagger}-${replay}`;
    const className = "font-semibold tracking-normal";

    switch (effect) {
      case "ai-stream":
        return <AiStreamText blur={blur} className={className} distance={intensity} duration={duration} key={key} stagger={stagger} text={text} />;
      case "breathing-words":
        return <BreathingWordsText blur={blur} className={className} duration={duration} key={key} minOpacity={Math.max(0.3, 1 - intensity / 100)} stagger={stagger} text={text} />;
      case "decrypt":
        return <DecryptText className={className} duration={duration} key={key} text={text} />;
      case "sweep":
        return <GradientSweepText angle={90 + intensity} className={className} duration={duration} key={key}>{text}</GradientSweepText>;
      case "focus":
        return <FocusBlurText blur={blur} className={className} duration={duration} key={key} repeat scale={1 + intensity / 250} text={text} />;
      case "breathing":
        return <BreathingText blur={blur} className={className} duration={duration} key={key} minOpacity={Math.max(0.3, 1 - intensity / 100)} scale={1 + intensity / 500} text={text} />;
      case "elastic":
        return <ElasticLettersText blur={blur} className={className} duration={duration} key={key} stagger={stagger} stretch={1 + intensity / 100} text={text} />;
      case "morph":
        return <span className={className}>Build <MorphWordsText blur={blur} duration={duration} key={key} words={["better", "faster", "softer"]} /></span>;
      case "number-delta":
        return <NumberDeltaText blur={blur} className={className} duration={duration} key={key} value={intensity - 20} />;
      case "rolling":
        return <RollingNumber blur={blur} className={className} duration={Math.min(duration, 1200)} key={key} value={duration} />;
      case "soft-scramble":
        return <SoftScrambleText className={className} duration={duration} intensity={intensity / 100} key={key} text={text} />;
      case "spoiler":
        return <SpoilerText className={className} duration={Math.min(duration, 900)} key={key} text={text} />;
      case "ticker":
        return <TickerText blur={blur} className="font-semibold tracking-normal" duration={Math.max(duration * 4, 8000)} key={key} style={{ inlineSize: "min(80vw, 24rem)" }} text={text} />;
      case "typewriter":
        return <TypewriterText className={className} key={key} speed={Math.max(16, Math.round(duration / 32))} text={text} />;
      case "weight":
        return <WeightSweepText className={className} duration={duration} key={key} stagger={stagger} text={text} />;
      case "iridescent":
        return <IridescentText className={className} duration={duration} intensity={1 + intensity / 100} key={key} text={text} />;
      case "heartbeat":
        return <HeartbeatText blur={blur} className={className} duration={duration} key={key} scale={1 + intensity / 300} text={text} />;
      default:
        return <TextReveal blur={blur} className={className} distance={intensity} duration={duration} key={key} mode="in-out" repeat stagger={stagger} text={text} />;
    }
  }

  async function copyCode() {
    await navigator.clipboard.writeText(`import { ${componentNameFromCode(code)} } from "motion-text-kit";\nimport "motion-text-kit/styles.css";\n\n${code}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  function reset() {
    setDuration(defaults.duration);
    setBlur(defaults.blur);
    setFontSize(defaults.fontSize);
    setIntensity(defaults.intensity);
    setStagger(defaults.stagger);
    setReplay((value) => value + 1);
  }

  return (
    <main>
      <div className="min-h-svh bg-background text-foreground transition-colors duration-300">
        <div className="mx-auto w-full max-w-[1040px] px-3 pb-10 pt-4 sm:px-4 sm:pb-16 sm:pt-5">
          <header className="flex flex-wrap items-center justify-between gap-2 gap-y-3 sm:gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-7">
              <Link className="text-[15px] font-semibold leading-none text-neutral-900 transition-colors hover:text-neutral-600 dark:text-neutral-100 dark:hover:text-neutral-300" href="/">
                Motion Text Kit
              </Link>
              <nav aria-label={copy.navigation} className="flex items-center gap-3 text-[14px] font-medium sm:gap-5">
                <Link className="page-switcher-button inline-flex h-5 items-center text-neutral-400 transition-colors hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300" href="/">Motion</Link>
                <span className="page-switcher-button relative inline-flex h-5 items-center text-neutral-950 dark:text-neutral-50">
                  Playground
                  <PlaygroundUnderline />
                </span>
                <Link className="page-switcher-button inline-flex h-5 items-center text-neutral-400 transition-colors hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300" href="/package">Package</Link>
                <Link className="page-switcher-button inline-flex h-5 items-center text-neutral-400 transition-colors hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300" href="/notes">Notes</Link>
              </nav>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <Menu>
                <MenuTrigger
                  render={
                    <Button
                      aria-label={copy.languageMenuLabel}
                      className="!size-8 rounded-full shadow-none transition-[background-color,color] duration-200 hover:bg-neutral-200 hover:text-neutral-950 active:shadow-none data-popup-open:bg-neutral-200 dark:bg-white/[0.08] dark:hover:bg-white/[0.13] dark:hover:text-neutral-50 dark:data-popup-open:bg-white/[0.13] [&_svg]:size-3.5"
                      size="icon"
                      variant="secondary"
                    />
                  }
                >
                  <GlobeIcon className="size-3.5" strokeWidth={2.1} />
                </MenuTrigger>
                <MenuPopup
                  align="start"
                  alignOffset={-11}
                  className="min-w-[9rem] rounded-2xl border-black/[0.08] bg-white/95 shadow-[0_18px_44px_rgba(15,23,42,.14)] backdrop-blur-xl before:rounded-[calc(var(--radius-2xl)-1px)] dark:border-white/[0.08] dark:bg-neutral-900/95 dark:shadow-[0_18px_44px_rgba(0,0,0,.38)] [&>div]:p-1.5"
                  sideOffset={10}
                >
                  <MenuRadioGroup
                    className="grid gap-1"
                    onValueChange={(value) => setLocale(value as Locale)}
                    value={locale}
                  >
                    <MenuRadioItem
                      className="min-h-9 grid-cols-[1.1rem_1fr] gap-1.5 rounded-xl ps-2.5 pe-4 text-[14px] font-medium text-neutral-700 transition-colors duration-150 data-checked:bg-neutral-100 data-highlighted:bg-neutral-100 data-highlighted:text-neutral-950 dark:text-neutral-200 dark:data-checked:bg-white/[0.08] dark:data-highlighted:bg-white/[0.08] dark:data-highlighted:text-neutral-50 [&_svg]:size-4 [&_svg]:text-neutral-950 dark:[&_svg]:text-neutral-50"
                      closeOnClick
                      label="中文"
                      value="zh"
                    >
                      {copy.languageOptions.zh}
                    </MenuRadioItem>
                    <MenuRadioItem
                      className="min-h-9 grid-cols-[1.1rem_1fr] gap-1.5 rounded-xl ps-2.5 pe-4 text-[14px] font-medium text-neutral-700 transition-colors duration-150 data-checked:bg-neutral-100 data-highlighted:bg-neutral-100 data-highlighted:text-neutral-950 dark:text-neutral-200 dark:data-checked:bg-white/[0.08] dark:data-highlighted:bg-white/[0.08] dark:data-highlighted:text-neutral-50 [&_svg]:size-4 [&_svg]:text-neutral-950 dark:[&_svg]:text-neutral-50"
                      closeOnClick
                      label="English"
                      value="en"
                    >
                      {copy.languageOptions.en}
                    </MenuRadioItem>
                  </MenuRadioGroup>
                </MenuPopup>
              </Menu>
              <Button aria-label={copy.github} className="!size-8 rounded-full shadow-none" render={<a href="https://github.com/coooooolpan/motion-text-kit" rel="noreferrer" target="_blank" />} size="icon" variant="secondary"><GithubMark /></Button>
              <Button aria-label={copy.theme} className="!size-8 rounded-full shadow-none" onClick={() => setIsDark((value) => !value)} size="icon" variant="secondary">
              {isDark ? <SunIcon /> : <MoonIcon />}
              </Button>
            </div>
          </header>

          <div className="mt-12 grid overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-[0_24px_70px_rgba(0,0,0,.06)] sm:mt-16 lg:grid-cols-[19rem_1fr] dark:border-white/[0.08] dark:bg-neutral-950 dark:shadow-[0_24px_70px_rgba(0,0,0,.3)]">
            <aside className="border-b border-black/[0.07] p-5 lg:border-b-0 lg:border-r dark:border-white/[0.08] sm:p-6">
              <Field>
                <FieldLabel htmlFor="effect">{copy.effect}</FieldLabel>
                <Select onValueChange={(value) => setEffect(value as EffectId)} value={effect}>
                  <SelectTrigger id="effect"><SelectValue>{isChinese ? selectedEffect.zhLabel : selectedEffect.label}</SelectValue></SelectTrigger>
                  <SelectContent>
                    {effects.map((item) => <SelectItem key={item.id} value={item.id}>{isChinese ? item.zhLabel : item.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FieldDescription>{isChinese ? selectedEffect.zhDescription : selectedEffect.description}</FieldDescription>
              </Field>

              <Field className="mt-6">
                <FieldLabel htmlFor="playground-text">{copy.text}</FieldLabel>
                <Textarea className="playground-textarea !shadow-none !ring-0" id="playground-text" maxLength={72} onChange={(event) => setText(event.target.value)} value={text} />
              </Field>

              <div className="mt-8 space-y-3">
                <Control label={copy.duration} max={4200} min={400} onChange={setDuration} step={50} suffix="ms" value={duration} />
                <Control label={copy.size} max={96} min={16} onChange={setFontSize} step={1} suffix="px" value={fontSize} />
                <Control label={copy.blur} max={16} min={0} onChange={setBlur} step={0.5} suffix="px" value={blur} />
                <Control label={copy.intensity} max={40} min={4} onChange={setIntensity} step={1} value={intensity} />
                {["ai-stream", "breathing-words", "elastic", "reveal", "weight"].includes(effect) ? <Control label={copy.stagger} max={120} min={0} onChange={setStagger} step={2} suffix="ms" value={stagger} /> : null}
              </div>

              <Button className="mt-8 w-full" onClick={reset} variant="outline"><RotateCcwIcon /> {copy.reset}</Button>
            </aside>

            <section className="min-w-0 p-3 sm:p-5">
              <div className="playground-stage relative grid min-h-[23rem] place-items-center overflow-hidden rounded-xl border border-black/[0.06] px-6 text-center dark:border-white/[0.07] sm:min-h-[31rem]">
                <div className="relative z-10 max-w-full" style={{ fontSize: `${fontSize}px` }}>{renderPreview()}</div>
                <Button aria-label={copy.replay} className="absolute bottom-4 right-4 rounded-full" onClick={() => setReplay((value) => value + 1)} size="icon" variant="secondary"><RotateCcwIcon /></Button>
              </div>

              <div className="mt-4 overflow-hidden rounded-xl border border-black/[0.07] bg-neutral-950 text-neutral-100 dark:border-white/[0.08]">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
                  <span className="font-mono text-[11px] text-neutral-500">React</span>
                  <Button aria-label={copy.copyCode} className="!size-7 rounded-md text-neutral-400 hover:bg-white/10 hover:text-white" onClick={copyCode} size="icon" variant="ghost">{copied ? <CheckIcon /> : <CopyIcon />}</Button>
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-[12px] leading-6 text-neutral-300"><code>{`import { ${componentNameFromCode(code)} } from "motion-text-kit";\nimport "motion-text-kit/styles.css";\n\n${code}`}</code></pre>
              </div>
            </section>
          </div>
          <FooterCredit prefix="Crafted by" />
        </div>
      </div>
    </main>
  );
}

function PlaygroundUnderline() {
  return (
    <svg aria-hidden="true" className="page-switcher-underline" viewBox="0 0 428 74">
      <path className="page-switcher-underline__stroke" d="M28.4 44.8C16.6 43.4 8.6 55.2 20.8 57.1C45.7 61 77.4 49.8 101.5 44.7C119.4 40.9 137.1 36.3 154.8 31.8C161.2 30.2 174.6 23.2 173.1 29.6C171.4 36.7 150.9 42.1 154.6 48.4C160.7 58.7 188.7 45.6 200.1 42.2C218.9 36.7 237.3 29.4 256.5 25.5C262.3 24.3 273.2 19.7 272.9 25.6C272.5 33.9 249.8 43.3 256.6 48.1C270.5 58 313.5 36.5 329.8 32.4C341.7 29.4 357.3 20.9 366.5 29.1C372.2 34.2 350.4 47.6 357.7 50.2C376.4 56.8 396.5 39.7 414.3 31.2" pathLength={1} />
    </svg>
  );
}

function GithubMark() {
  return (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.88c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.55 9.55 0 0 1 12 6.82a9.55 9.55 0 0 1 2.5.34c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

function Control({ label, max, min, onChange, step, suffix = "", value }: { label: string; max: number; min: number; onChange: (value: number) => void; step: number; suffix?: string; value: number }) {
  return (
    <Field>
      <Slider aria-label={label} className="playground-parameter-slider" max={max} min={min} onValueChange={(nextValue) => onChange(numberValue(nextValue))} step={step} value={value}>
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-between gap-3 px-3">
          <FieldLabel className="font-normal text-muted-foreground">{label}</FieldLabel>
          <SliderValue className="font-mono text-[12px] tabular-nums text-muted-foreground">
            {(_formattedValues, values) => `${values[0] ?? value}${suffix}`}
          </SliderValue>
        </div>
      </Slider>
      {suffix ? <FieldDescription className="sr-only">Value in {suffix}</FieldDescription> : null}
    </Field>
  );
}
