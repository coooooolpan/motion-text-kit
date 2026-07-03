"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { BorderBeam } from "border-beam";
import {
  ArrowUpRightIcon,
  CheckIcon,
  CopyIcon,
  GlobeIcon,
  RotateCcwIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Menu,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from "@/components/ui/menu";
import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs";
import {
  BreathingText,
  DecryptText,
  ElasticLettersText,
  FocusBlurText,
  GradientSweepText,
  NumberDeltaText,
  RollingNumber,
  SpoilerText,
  TextReveal,
  TickerText,
  TypewriterText,
  WeightSweepText,
} from "@/motion-text-kit";

type Locale = "zh" | "en";
type ActivePage = "motion" | "npm";

type MotionCard = {
  id: string;
  title: string;
  description: string;
  scenario: string;
  preview: ReactNode;
  code: string;
};

type ExpandedMotionCard = {
  item: MotionCard;
  origin: DOMRect;
  state: "opening" | "open" | "closing";
};

const githubRepositoryUrl = "https://github.com/coooooolpan/motion-text-kit";

function getInitialLocale(): Locale {
  const browserLanguages =
    typeof navigator === "undefined"
      ? []
      : [navigator.language, ...navigator.languages].filter(Boolean);
  const normalizedLanguages = browserLanguages.map((language) =>
    language.toLowerCase(),
  );

  return normalizedLanguages.some((language) => language.startsWith("zh"))
    ? "zh"
    : "en";
}

const pageCopy = {
  zh: {
    languageToggleLabel: "切换到英文",
    languageToggleText: "中",
    languageMenuLabel: "语言",
    languageOptions: {
      zh: "中文",
      en: "English",
    },
    githubLabel: "打开 GitHub 仓库",
    startLabel: "开始",
    themeLabel: "切换深色模式",
    logoLabel: "Motion Text Kit 标志",
    heroSlogan: "让文字自然流动",
    heroDescription:
      "Motion Text Kit 是一组轻量、开箱即用的 React 文本动效组件，为界面注入恰到好处的动态表达。",
    copyLabel: "复制",
    currentTimeLabel: "当前时间",
    footerPrefix: "Crafted by",
    resetInvisibleLabel: "复原隐形",
    scenarioLabel: "适用场景",
    cards: {
      gradient: {
        title: "文本高光",
        description: "一道柔和高光从文字表面滑过",
        scenario: "适合强调关键词、品牌标语、AI 思考状态或需要柔和吸引注意力的短文本。",
        previewText: "Stay hungry, stay foolish.",
      },
      reveal: {
        title: "逐字显隐",
        description: "字符依次出现、停留，然后淡出",
        scenario: "适合首屏标题、引导文案、空状态提示和需要节奏感出现的短句。",
        previewText: "Letters enter and leave.",
      },
      rolling: {
        title: "数字计时",
        description: "按 HH:mm:ss 滚动展示当前时间",
        scenario: "适合时间、倒计时、统计面板和需要数字更新反馈的实时信息。",
      },
      spoiler: {
        title: "隐形墨水",
        description: "像隐形墨水一样按下后显露文字",
        scenario: "适合敏感信息、谜底揭示、互动提示和需要用户主动查看的内容。",
        previewText: "Tap to reveal this.",
      },
      decrypt: {
        title: "文本解码",
        description: "随机字符逐步解析为最终文本",
        scenario: "适合权限状态、终端反馈、加载完成提示和带技术感的结果揭示。",
        previewText: "ACCESS GRANTED",
      },
      weight: {
        title: "字重扫光",
        description: "字重从细到粗平滑扫过文字",
        scenario: "适合导航激活态、强调词、品牌标题和需要低调动态质感的文本。",
        previewText: "Weight wave passes.",
      },
      focus: {
        title: "模糊聚焦",
        description: "文字从失焦模糊聚拢到清晰",
        scenario: "适合加载态、内容进入视野、AI 生成完成和从不确定到确定的状态表达。",
        previewText: "Focus sharpens softly.",
      },
      ticker: {
        title: "流动字幕",
        description: "文本在两端带光感模糊并持续循环",
        scenario: "适合公告栏、新闻摘要、状态播报和空间有限但需要展示长文本的区域。",
        previewText:
          "Stay hungry, stay foolish. Steve Jobs believed that design is not just what it looks like and feels like, design is how it works. The people who are crazy enough to think they can change the world are the ones who do.",
      },
      typewriter: {
        title: "打字光标",
        description: "逐字输入并带闪烁光标",
        scenario: "适合搜索建议、命令输入、AI 回复预览和需要模拟输入过程的短文本。",
        previewText: "Typing with a cursor",
      },
      breathing: {
        title: "呼吸文本",
        description: "整体文本以轻微透明度、模糊和缩放呼吸",
        scenario: "适合等待态、AI thinking、空状态和需要安静持续反馈的提示文案。",
        previewText: "Almost there...",
      },
      delta: {
        title: "数字涨跌",
        description: "数字变化时带正负方向和弹性入场",
        scenario: "适合价格涨跌、指标变化、交易数据和需要表达正负方向的统计数字。",
      },
      elastic: {
        title: "弹性字母",
        description: "字符水平轻微拉伸后回弹出现",
        scenario: "适合按钮反馈、短标题出现、品牌字动效和需要 SwiftUI 弹性感的轻量文本。",
        previewText: "Swift-like motion",
      },
    },
  },
  en: {
    languageToggleLabel: "Switch to Chinese",
    languageToggleText: "EN",
    languageMenuLabel: "Language",
    languageOptions: {
      zh: "中文",
      en: "English",
    },
    githubLabel: "Open GitHub repository",
    startLabel: "Start",
    themeLabel: "Toggle dark mode",
    logoLabel: "Motion Text Kit logo",
    heroSlogan: "Text, in motion.",
    heroDescription:
      "Motion Text Kit is a lightweight, ready-to-use set of React text motion components that brings just-right dynamic expression to interfaces.",
    copyLabel: "Copy",
    currentTimeLabel: "Current time",
    footerPrefix: "Crafted by",
    resetInvisibleLabel: "Hide again",
    scenarioLabel: "Use cases",
    cards: {
      gradient: {
        title: "Gradient Text Sweep",
        description: "A soft highlight glides across the text",
        scenario: "Best for keywords, brand lines, AI thinking states, or short text that needs soft attention.",
        previewText: "Stay hungry, stay foolish.",
      },
      reveal: {
        title: "Character Reveal",
        description: "Characters enter, hold, then leave",
        scenario: "Best for hero headlines, onboarding copy, empty states, and rhythmic short-form text.",
        previewText: "Letters enter and leave.",
      },
      rolling: {
        title: "Rolling Time Digits",
        description: "Current HH:mm:ss time with rolling digits",
        scenario: "Best for time, countdowns, dashboards, and live numeric feedback.",
      },
      spoiler: {
        title: "Invisible Ink Text",
        description: "Press to reveal text through particles",
        scenario: "Best for sensitive values, hidden answers, interactive hints, and user-triggered reveals.",
        previewText: "Tap to reveal this.",
      },
      decrypt: {
        title: "Decrypt Text",
        description: "Random glyphs resolve into final text",
        scenario: "Best for permission states, terminal feedback, completion messages, and technical reveals.",
        previewText: "ACCESS GRANTED",
      },
      weight: {
        title: "Weight Sweep",
        description: "Text weight sweeps from thin to bold",
        scenario: "Best for active navigation, emphasized words, brand headings, and subtle typographic motion.",
        previewText: "Weight wave passes.",
      },
      focus: {
        title: "Blur Focus",
        description: "Text resolves from soft blur into focus",
        scenario: "Best for loading states, content entrances, AI completion, and uncertainty resolving into clarity.",
        previewText: "Focus sharpens softly.",
      },
      ticker: {
        title: "Flowing Ticker",
        description: "Horizontal notice text loops through soft glowing edges",
        scenario: "Best for announcements, news snippets, status broadcasts, and long text in compact spaces.",
        previewText:
          "Stay hungry, stay foolish. Steve Jobs believed that design is not just what it looks like and feels like, design is how it works. The people who are crazy enough to think they can change the world are the ones who do.",
      },
      typewriter: {
        title: "Typewriter Cursor",
        description: "Characters type in with a blinking caret",
        scenario: "Best for search suggestions, command input, AI response previews, and simulated typing.",
        previewText: "Typing with a cursor",
      },
      breathing: {
        title: "Breathing Text",
        description: "Whole text breathes with subtle opacity, blur, and scale",
        scenario: "Best for waiting states, AI thinking, empty states, and quiet continuous feedback.",
        previewText: "Almost there...",
      },
      delta: {
        title: "Number Delta",
        description: "Signed number changes with directional spring motion",
        scenario: "Best for price moves, metric changes, trading data, and signed numeric feedback.",
      },
      elastic: {
        title: "Elastic Letters",
        description: "Letters stretch horizontally then settle softly",
        scenario: "Best for button feedback, short title entrances, brand text, and SwiftUI-like elastic motion.",
        previewText: "Swift-like motion",
      },
    },
  },
} as const;
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.86 8.37 6.84 9.73.5.09.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.32 9.32 0 0 1 12 7c.85 0 1.71.12 2.51.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.95.68 1.92 0 1.38-.01 2.49-.01 2.83 0 .27.18.59.69.49A10.18 10.18 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

function FilledMoonIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
    </svg>
  );
}

function FilledSunIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10ZM12 1.75a.9.9 0 0 1 .9.9v1.4a.9.9 0 1 1-1.8 0v-1.4a.9.9 0 0 1 .9-.9ZM12 19.05a.9.9 0 0 1 .9.9v1.4a.9.9 0 1 1-1.8 0v-1.4a.9.9 0 0 1 .9-.9ZM22.25 12a.9.9 0 0 1-.9.9h-1.4a.9.9 0 1 1 0-1.8h1.4a.9.9 0 0 1 .9.9ZM4.95 12a.9.9 0 0 1-.9.9h-1.4a.9.9 0 1 1 0-1.8h1.4a.9.9 0 0 1 .9.9ZM19.25 4.75a.9.9 0 0 1 0 1.27l-.99.99a.9.9 0 1 1-1.27-1.27l.99-.99a.9.9 0 0 1 1.27 0ZM7.01 16.99a.9.9 0 0 1 0 1.27l-.99.99a.9.9 0 1 1-1.27-1.27l.99-.99a.9.9 0 0 1 1.27 0ZM19.25 19.25a.9.9 0 0 1-1.27 0l-.99-.99a.9.9 0 1 1 1.27-1.27l.99.99a.9.9 0 0 1 0 1.27ZM7.01 7.01a.9.9 0 0 1-1.27 0l-.99-.99a.9.9 0 1 1 1.27-1.27l.99.99a.9.9 0 0 1 0 1.27Z" />
    </svg>
  );
}

function FooterSignatureMark() {
  return <span aria-hidden="true" className="footer-signature" />;
}

function FooterCredit({ prefix }: { prefix: string }) {
  return (
    <p className="mt-14 inline-flex w-full items-center justify-center gap-3.5 text-center text-[14px] leading-7 text-neutral-400 dark:text-neutral-500">
      <span className="translate-y-[3px]">{prefix}</span>
      <a
        aria-label="coooooolpan"
        className="group inline-flex items-center gap-2 font-semibold text-neutral-600 transition-colors duration-300 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-100"
        href="https://coooooolpan.vercel.app/"
        rel="noreferrer"
        target="_blank"
      >
        <FooterSignatureMark />
        <span className="inline-grid size-[18px] translate-y-[3px] place-items-center">
          <ArrowUpRightIcon
            aria-hidden="true"
            className="size-[15px] translate-x-[-0.45rem] translate-y-[0.45rem] scale-75 opacity-0 [filter:blur(2px)] transition-[opacity,translate,scale,filter] duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-0 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-hover:[filter:blur(0px)]"
            strokeWidth={2.2}
          />
        </span>
      </a>
    </p>
  );
}

function MotionLogo({ label }: { label: string }) {
  return (
    <svg
      aria-label={label}
      className="motion-logo"
      role="img"
      viewBox="0 0 100 100"
    >
      <defs>
        <filter
          height="150%"
          id="motion-logo-roughen"
          width="150%"
          x="-25%"
          y="-25%"
        >
          <feTurbulence
            baseFrequency="0.075"
            numOctaves="2"
            result="noise"
            seed="12"
            type="fractalNoise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="1.65"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
      <g aria-hidden="true" filter="url(#motion-logo-roughen)">
        <text
          className="motion-logo__word motion-logo__word--motion"
          x="16"
          y="31"
        >
          motion
        </text>
        <text
          className="motion-logo__word motion-logo__word--text"
          x="24"
          y="56"
        >
          text
        </text>
        <text
          className="motion-logo__word motion-logo__word--kit"
          x="34"
          y="80"
        >
          kit
        </text>
      </g>
    </svg>
  );
}

function MotionLogoCard({
  isDark,
  label,
}: {
  isDark: boolean;
  label: string;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const tiltFrameRef = useRef<number | null>(null);
  const tiltPointRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    return () => {
      if (tiltFrameRef.current !== null) {
        window.cancelAnimationFrame(tiltFrameRef.current);
      }
    };
  }, []);

  function resetTilt() {
    const wrap = wrapRef.current;
    const card = cardRef.current;

    if (tiltFrameRef.current !== null) {
      window.cancelAnimationFrame(tiltFrameRef.current);
      tiltFrameRef.current = null;
    }

    wrap?.classList.remove("is-hover");

    if (!card) {
      return;
    }

    card.classList.remove("is-tilting");
    card.style.setProperty("--tilt-rx", "0deg");
    card.style.setProperty("--tilt-ry", "0deg");
    card.style.setProperty("--tilt-gx", "50%");
    card.style.setProperty("--tilt-gy", "50%");
  }

  function applyTilt() {
    tiltFrameRef.current = null;

    const wrap = wrapRef.current;
    const card = cardRef.current;

    if (!wrap || !card) {
      return;
    }

    const rect = wrap.getBoundingClientRect();
    const px = Math.max(0, Math.min(1, (tiltPointRef.current.x - rect.left) / rect.width));
    const py = Math.max(0, Math.min(1, (tiltPointRef.current.y - rect.top) / rect.height));
    const tiltX = (0.5 - py) * 44;
    const tiltY = (px - 0.5) * 44;

    wrap.classList.add("is-hover");
    card.classList.add("is-tilting");
    card.style.setProperty("--tilt-rx", `${tiltX.toFixed(2)}deg`);
    card.style.setProperty("--tilt-ry", `${tiltY.toFixed(2)}deg`);
    card.style.setProperty("--tilt-gx", `${(px * 100).toFixed(1)}%`);
    card.style.setProperty("--tilt-gy", `${(py * 100).toFixed(1)}%`);
  }

  function scheduleTilt(clientX: number, clientY: number) {
    tiltPointRef.current = { x: clientX, y: clientY };

    if (tiltFrameRef.current === null) {
      tiltFrameRef.current = window.requestAnimationFrame(applyTilt);
    }
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    scheduleTilt(event.clientX, event.clientY);
  }

  function handlePointerLeave() {
    resetTilt();
  }

  return (
    <div
      className="logo-tilt t-tilt"
      onPointerCancel={handlePointerLeave}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      onPointerUp={() => cardRef.current?.classList.remove("is-tilting")}
      ref={wrapRef}
    >
      <div className="t-tilt-card" ref={cardRef}>
        <BorderBeam
          size="pulse-outside"
          colorVariant="mono"
          strength={0.8}
          theme={isDark ? "dark" : "light"}
        >
          <Card className="logo-card grid size-[3.625rem] place-items-center overflow-visible rounded-[1.05rem] border-black/[0.045] bg-white p-0 shadow-[0_14px_36px_rgba(59,130,246,.13)] dark:border-white/8 dark:bg-neutral-900 dark:shadow-[0_14px_36px_rgba(59,130,246,.08)]">
            <MotionLogo label={label} />
          </Card>
        </BorderBeam>
      </div>
    </div>
  );
}

function BrandMark({ label }: { label: string }) {
  return (
    <a
      aria-label={label}
      className="inline-flex items-center rounded-full text-neutral-900 transition-colors duration-200 hover:text-neutral-700 dark:text-neutral-100 dark:hover:text-neutral-300"
      href="#"
    >
      <span className="text-[15px] font-semibold leading-none tracking-normal [font-family:var(--font-saans)]">
        Motion Text Kit
      </span>
    </a>
  );
}

function CurrentTimePreview({ label }: { label: string }) {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  const hours = currentTime?.getHours() ?? 0;
  const minutes = currentTime?.getMinutes() ?? 0;
  const seconds = currentTime?.getSeconds() ?? 0;

  useEffect(() => {
    const updateTime = () => setCurrentTime(new Date());

    const initialTimer = window.setTimeout(updateTime, 0);
    const timer = window.setInterval(updateTime, 1000);

    return () => {
      window.clearInterval(timer);
      window.clearTimeout(initialTimer);
    };
  }, []);

  return (
    <div
      aria-label={`${label} ${hours}:${minutes}:${seconds}`}
      className="inline-flex items-center justify-center font-mono text-[14px] font-semibold leading-[22px] tracking-normal"
    >
      <RollingNumber
        directionY={-1}
        duration={500}
        formatOptions={{ minimumIntegerDigits: 2, useGrouping: false }}
        key={`h-${hours}`}
        stagger={58}
        value={hours}
      />
      <span aria-hidden="true" className="px-1">
        :
      </span>
      <RollingNumber
        directionY={-1}
        duration={500}
        formatOptions={{ minimumIntegerDigits: 2, useGrouping: false }}
        key={`m-${minutes}`}
        stagger={58}
        value={minutes}
      />
      <span aria-hidden="true" className="px-1">
        :
      </span>
      <RollingNumber
        directionY={-1}
        duration={500}
        formatOptions={{ minimumIntegerDigits: 2, useGrouping: false }}
        key={`s-${seconds}`}
        stagger={58}
        value={seconds}
      />
    </div>
  );
}

function NumberDeltaPreview() {
  const gains = [24, 38, 16, 42] as const;
  const losses = [-18, -31, -12, -27] as const;
  const [index, setIndex] = useState(0);
  const gain = gains[index % gains.length];
  const loss = losses[index % losses.length];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => current + 1);
    }, 2600);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="inline-flex items-center justify-center gap-4 text-center">
      <NumberDeltaText
        className="font-mono text-[15px] font-semibold leading-[24px] tracking-normal text-neutral-800 dark:text-neutral-100"
        duration={1080}
        stagger={64}
        value={gain}
      />
      <span
        aria-hidden="true"
        className="h-5 w-px bg-neutral-200 dark:bg-neutral-700/60"
      />
      <NumberDeltaText
        className="font-mono text-[15px] font-semibold leading-[24px] tracking-normal text-neutral-500 dark:text-neutral-400"
        duration={1080}
        stagger={64}
        value={loss}
      />
    </div>
  );
}

function SpoilerPreview({
  resetLabel,
  text,
}: {
  resetLabel: string;
  text: string;
}) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="relative grid h-full w-full place-items-center text-center">
      <SpoilerText
        className="font-heading text-[14px] font-semibold leading-[22px] tracking-normal text-neutral-800 dark:text-neutral-100"
        onRevealedChange={setRevealed}
        particleColor="color-mix(in srgb, currentColor 82%, transparent)"
        revealed={revealed}
        text={text}
      />
      {revealed ? (
        <Button
          aria-label={resetLabel}
          className="absolute bottom-0 right-0 size-8 rounded-full bg-white text-neutral-500 shadow-sm hover:bg-neutral-100 hover:text-neutral-900 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-neutral-50 [&_svg]:size-3.5"
          onClick={() => setRevealed(false)}
          size="icon"
          type="button"
          variant="secondary"
        >
          <RotateCcwIcon strokeWidth={2.1} />
        </Button>
      ) : null}
    </div>
  );
}

function createMotionCards(copy: (typeof pageCopy)[Locale]): MotionCard[] {
  return [
    {
      id: "reveal",
      title: copy.cards.reveal.title,
      description: copy.cards.reveal.description,
      scenario: copy.cards.reveal.scenario,
      preview: (
        <div className="grid place-items-center text-center">
          <TextReveal
            className="max-w-56 justify-center text-balance font-heading text-[14px] font-semibold leading-[22px]"
            distance={14}
            duration={560}
            hold={880}
            mode="in-out"
            repeat
            stagger={34}
            text={copy.cards.reveal.previewText}
          />
        </div>
      ),
      code: `<TextReveal text="Letters enter and leave." mode="in-out" repeat />`,
    },
    {
      id: "rolling",
      title: copy.cards.rolling.title,
      description: copy.cards.rolling.description,
      scenario: copy.cards.rolling.scenario,
      preview: <CurrentTimePreview label={copy.currentTimeLabel} />,
      code: `<RollingNumber value={new Date().getSeconds()} />`,
    },
    {
      id: "spoiler",
      title: copy.cards.spoiler.title,
      description: copy.cards.spoiler.description,
      scenario: copy.cards.spoiler.scenario,
      preview: (
        <SpoilerPreview
          resetLabel={copy.resetInvisibleLabel}
          text={copy.cards.spoiler.previewText}
        />
      ),
      code: `<SpoilerText text="Tap to reveal this." />`,
    },
    {
      id: "weight",
      title: copy.cards.weight.title,
      description: copy.cards.weight.description,
      scenario: copy.cards.weight.scenario,
      preview: (
        <div className="grid place-items-center text-center">
          <WeightSweepText
            className="font-heading text-[14px] leading-[22px] tracking-normal"
            maxWeight={820}
            minWeight={280}
            text={copy.cards.weight.previewText}
          />
        </div>
      ),
      code: `<WeightSweepText text="Weight wave passes." />`,
    },
    {
      id: "decrypt",
      title: copy.cards.decrypt.title,
      description: copy.cards.decrypt.description,
      scenario: copy.cards.decrypt.scenario,
      preview: (
        <div className="grid place-items-center text-center">
          <DecryptText
            className="font-mono text-[14px] font-semibold leading-[22px] tracking-normal"
            text={copy.cards.decrypt.previewText}
          />
        </div>
      ),
      code: `<DecryptText text="ACCESS GRANTED" />`,
    },
    {
      id: "gradient",
      title: copy.cards.gradient.title,
      description: copy.cards.gradient.description,
      scenario: copy.cards.gradient.scenario,
      preview: (
        <div className="grid place-items-center text-center">
          <GradientSweepText
            accentColor="rgba(255,255,255,.72)"
            className="font-heading text-[14px] font-semibold leading-[22px] tracking-normal text-neutral-800 dark:text-neutral-100"
            duration={2200}
            highlightColor="#ffffff"
          >
            {copy.cards.gradient.previewText}
          </GradientSweepText>
        </div>
      ),
      code: `<GradientSweepText>Highlight sweep</GradientSweepText>`,
    },
    {
      id: "focus",
      title: copy.cards.focus.title,
      description: copy.cards.focus.description,
      scenario: copy.cards.focus.scenario,
      preview: (
        <div className="grid place-items-center text-center">
          <FocusBlurText
            blur={9}
            className="max-w-56 justify-center text-balance font-heading text-[14px] font-semibold leading-[22px]"
            duration={960}
            text={copy.cards.focus.previewText}
          />
        </div>
      ),
      code: `<FocusBlurText text="Focus sharpens softly." />`,
    },
    {
      id: "ticker",
      title: copy.cards.ticker.title,
      description: copy.cards.ticker.description,
      scenario: copy.cards.ticker.scenario,
      preview: (
        <div className="grid place-items-center text-center">
          <TickerText
            blur={6}
            className="w-56 font-heading text-[14px] font-semibold leading-[22px] tracking-normal"
            duration={18000}
            stagger={34}
            text={copy.cards.ticker.previewText}
          />
        </div>
      ),
      code: `<TickerText text="Stay hungry, stay foolish. Steve Jobs believed..." />`,
    },
    {
      id: "typewriter",
      title: copy.cards.typewriter.title,
      description: copy.cards.typewriter.description,
      scenario: copy.cards.typewriter.scenario,
      preview: (
        <div className="grid place-items-center text-center">
          <TypewriterText
            className="font-mono text-[14px] font-semibold leading-[22px] tracking-normal"
            deleteSpeed={30}
            loopDelay={980}
            speed={56}
            text={copy.cards.typewriter.previewText}
          />
        </div>
      ),
      code: `<TypewriterText text="Typing with a cursor" />`,
    },
    {
      id: "breathing",
      title: copy.cards.breathing.title,
      description: copy.cards.breathing.description,
      scenario: copy.cards.breathing.scenario,
      preview: (
        <div className="grid place-items-center text-center">
          <BreathingText
            blur={1.8}
            className="font-heading text-[14px] font-semibold leading-[22px] tracking-normal"
            duration={3200}
            text={copy.cards.breathing.previewText}
          />
        </div>
      ),
      code: `<BreathingText text="Almost there..." />`,
    },
    {
      id: "delta",
      title: copy.cards.delta.title,
      description: copy.cards.delta.description,
      scenario: copy.cards.delta.scenario,
      preview: <NumberDeltaPreview />,
      code: `<NumberDeltaText value={24} /> <NumberDeltaText value={-18} />`,
    },
    {
      id: "elastic",
      title: copy.cards.elastic.title,
      description: copy.cards.elastic.description,
      scenario: copy.cards.elastic.scenario,
      preview: (
        <div className="grid place-items-center text-center">
          <ElasticLettersText
            className="max-w-56 justify-center text-balance font-heading text-[14px] font-semibold leading-[22px] tracking-normal"
            duration={700}
            stagger={30}
            text={copy.cards.elastic.previewText}
          />
        </div>
      ),
      code: `<ElasticLettersText text="Swift-like motion" />`,
    },
  ];
}

function MotionCatalogCard({
  item,
  onOpen,
}: {
  item: MotionCard;
  onOpen: (item: MotionCard, origin: DOMRect) => void;
}) {
  function openCard(event: React.MouseEvent<HTMLDivElement>) {
    onOpen(item, event.currentTarget.getBoundingClientRect());
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    onOpen(item, event.currentTarget.getBoundingClientRect());
  }

  return (
    <Card
      className="group cursor-pointer overflow-hidden rounded-[1.5rem] border-neutral-200/45 bg-white shadow-[0_1px_1px_rgba(15,23,42,.02)] outline-none transition-[border-color,box-shadow] duration-300 hover:border-neutral-300/70 hover:shadow-[0_14px_36px_rgba(15,23,42,.06)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 before:hidden dark:border-neutral-800/55 dark:bg-neutral-900 dark:hover:border-neutral-700/45"
      onClick={openCard}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="m-3 flex h-[218px] items-center justify-center rounded-[0.75rem] border border-neutral-200/45 bg-neutral-50 p-5 dark:border-neutral-700/28 dark:bg-neutral-950/28">
        {item.preview}
      </div>
      <div className="px-5 pb-5 pt-1">
        <div className="min-w-0">
          <h2 className="font-semibold text-[13px] leading-5 text-neutral-900 dark:text-neutral-100">
            {item.title}
          </h2>
          <p className="mt-0.5 text-[12px] leading-5 text-neutral-500 dark:text-neutral-400">
            {item.description}
          </p>
        </div>
      </div>
    </Card>
  );
}

function CopyCodeButton({
  className,
  code,
  iconClassName,
  label,
  size = "icon",
}: {
  className?: string;
  code: string;
  iconClassName: string;
  label: string;
  size?: "icon" | "icon-xs";
}) {
  const [copied, setCopied] = useState(false);
  const resetTimerRef = useRef<number | null>(null);
  const Icon = copied ? CheckIcon : CopyIcon;

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  function handleCopy(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    void navigator.clipboard?.writeText(code);
    setCopied(true);

    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
    }

    resetTimerRef.current = window.setTimeout(() => {
      setCopied(false);
      resetTimerRef.current = null;
    }, 1400);
  }

  return (
    <Button
      aria-label={label}
      className={className}
      onClick={handleCopy}
      size={size}
      variant="ghost"
    >
      <Icon className={iconClassName} />
    </Button>
  );
}

function ExpandedMotionCardOverlay({
  copyLabel,
  expanded,
  onClose,
  scenarioLabel,
}: {
  copyLabel: string;
  expanded: ExpandedMotionCard;
  onClose: () => void;
  scenarioLabel: string;
}) {
  const overlayStyle = {
    "--motion-card-origin-x": `${expanded.origin.left}px`,
    "--motion-card-origin-y": `${expanded.origin.top}px`,
    "--motion-card-origin-w": `${expanded.origin.width}px`,
    "--motion-card-origin-h": `${expanded.origin.height}px`,
    "--motion-card-target-w": `${Math.min(window.innerWidth * 0.92, 760)}px`,
    "--motion-card-target-h": `${Math.min(window.innerHeight * 0.72, 620)}px`,
    "--motion-card-start-x": `${
      expanded.origin.left + expanded.origin.width / 2 - window.innerWidth / 2
    }px`,
    "--motion-card-start-y": `${
      expanded.origin.top + expanded.origin.height / 2 - window.innerHeight / 2
    }px`,
    "--motion-card-start-scale-x": `${(
      expanded.origin.width / Math.min(window.innerWidth * 0.92, 760)
    ).toFixed(4)}`,
    "--motion-card-start-scale-y": `${(
      expanded.origin.height / Math.min(window.innerHeight * 0.72, 620)
    ).toFixed(4)}`,
  } as React.CSSProperties & Record<`--${string}`, string>;
  const glassFilter =
    expanded.state === "open"
      ? "blur(34px) saturate(1.22)"
      : "blur(0px) saturate(1)";
  const glassStyle = {
    backdropFilter: glassFilter,
    WebkitBackdropFilter: glassFilter,
  } as React.CSSProperties;

  return (
    <div
      className="motion-card-overlay"
      data-state={expanded.state}
      role="presentation"
      style={overlayStyle}
    >
      <span
        aria-hidden="true"
        className="motion-card-glass"
        style={glassStyle}
      />
      <button
        aria-label="Close expanded card"
        className="motion-card-backdrop"
        onClick={onClose}
        type="button"
      />
      <div
        aria-label={expanded.item.title}
        aria-modal="true"
        className="motion-card-expanded"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="motion-card-expanded__preview">
          {expanded.item.preview}
        </div>
        <div className="motion-card-expanded__body">
          <div className="min-w-0">
            <h2 className="font-semibold text-[16px] leading-6 text-neutral-900 dark:text-neutral-100">
              {expanded.item.title}
            </h2>
            <p className="mt-1 text-[13px] leading-6 text-neutral-500 dark:text-neutral-400">
              {expanded.item.description}
            </p>
            <div className="mt-4 border-t border-neutral-200/60 pt-3 dark:border-neutral-800">
              <p className="text-[11px] font-semibold leading-4 text-neutral-400 dark:text-neutral-500">
                {scenarioLabel}
              </p>
              <p className="mt-1 text-[13px] leading-6 text-neutral-500 dark:text-neutral-400">
                {expanded.item.scenario}
              </p>
            </div>
            <code className="mt-4 block overflow-x-auto whitespace-nowrap font-mono text-[12px] text-neutral-400 dark:text-neutral-500">
              {expanded.item.code}
            </code>
          </div>
          <CopyCodeButton
            className="self-end rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
            code={expanded.item.code}
            iconClassName="size-3.5"
            label={`${copyLabel} ${expanded.item.title}`}
            size="icon-xs"
          />
        </div>
      </div>
    </div>
  );
}

function DocsCodeBlock({
  code,
  label,
}: {
  code: string;
  label: string;
}) {
  return (
    <div className="relative rounded-2xl border border-neutral-200/70 bg-neutral-100 p-4 text-neutral-800 shadow-[0_1px_1px_rgba(15,23,42,.04)] dark:border-white/8 dark:bg-neutral-950 dark:text-neutral-100">
      <pre className="overflow-x-auto pr-10 font-mono text-[12px] leading-6 tracking-normal">
        <code>{code}</code>
      </pre>
      <CopyCodeButton
        className="absolute right-3 top-3 !size-7 rounded-full bg-transparent text-neutral-500 shadow-none hover:bg-neutral-200 hover:text-neutral-900 active:shadow-none dark:text-neutral-400 dark:hover:bg-white/8 dark:hover:text-neutral-50 [&_svg]:size-3.5"
        code={code}
        iconClassName="size-3.5"
        label={label}
        size="icon"
      />
    </div>
  );
}

type DocsApiItem = {
  name: string;
  description: string;
  usage: string;
  props: string[];
};

const docsApiItems: DocsApiItem[] = [
  {
    name: "TextReveal",
    description: "逐字或逐词进入、消失，也可以循环播放。",
    usage: '<TextReveal text="Letters enter and leave." mode="in-out" repeat />',
    props: [
      "text",
      "splitBy",
      "mode",
      "duration",
      "hold",
      "stagger",
      "distance",
      "blur",
      "repeat",
    ],
  },
  {
    name: "GradientSweepText",
    description: "柔和高光从文字表面滑过，适合强调短句。",
    usage: "<GradientSweepText>Stay hungry, stay foolish.</GradientSweepText>",
    props: [
      "children",
      "duration",
      "delay",
      "angle",
      "baseColor",
      "highlightColor",
      "accentColor",
      "pauseOnHover",
    ],
  },
  {
    name: "RollingNumber",
    description: "数字字符弹入，适合时间、倒计时和统计数字。",
    usage: '<RollingNumber value={128000} prefix="$" locale="en-US" />',
    props: [
      "value",
      "locale",
      "formatOptions",
      "prefix",
      "suffix",
      "duration",
      "stagger",
      "distance",
      "blur",
    ],
  },
  {
    name: "NumberDeltaText",
    description: "数字涨跌按轮盘路径滚动，支持正负方向感。",
    usage: "<NumberDeltaText value={24} />",
    props: [
      "value",
      "locale",
      "formatOptions",
      "prefix",
      "suffix",
      "showSign",
      "duration",
      "blur",
      "stagger",
    ],
  },
  {
    name: "SpoilerText",
    description: "隐形墨水式文本揭示，用于敏感内容或谜底。",
    usage: '<SpoilerText text="Tap to reveal this." />',
    props: [
      "text",
      "revealed",
      "defaultRevealed",
      "onRevealedChange",
      "particleColor",
    ],
  },
  {
    name: "DecryptText",
    description: "随机字符逐步解析为最终文本。",
    usage: '<DecryptText text="ACCESS GRANTED" />',
    props: ["text", "alphabet", "duration", "tick", "loop", "loopDelay"],
  },
  {
    name: "WeightSweepText",
    description: "字重从细到粗扫过文字，形成轻量强调。",
    usage: '<WeightSweepText text="Weight wave passes." />',
    props: ["text", "minWeight", "maxWeight", "duration", "stagger"],
  },
  {
    name: "FocusBlurText",
    description: "整体文字从模糊聚焦到清晰，再柔和消失。",
    usage: '<FocusBlurText text="Focus sharpens softly." />',
    props: [
      "text",
      "duration",
      "delay",
      "blur",
      "scale",
      "repeat",
      "iterationCount",
    ],
  },
  {
    name: "TickerText",
    description: "横向滚动公告，两端字符渐隐、缩小并模糊。",
    usage: '<TickerText text="Motion text kit is now available." />',
    props: [
      "text",
      "duration",
      "delay",
      "blur",
      "stagger",
      "repeat",
      "itemClassName",
    ],
  },
  {
    name: "TypewriterText",
    description: "逐字输入和删除，带跟随文本的光标。",
    usage: '<TypewriterText text="Typing with a cursor" />',
    props: [
      "text",
      "speed",
      "startDelay",
      "loop",
      "loopDelay",
      "deleteSpeed",
      "cursor",
    ],
  },
  {
    name: "BreathingText",
    description: "整体文字做轻微 opacity、blur、scale 呼吸。",
    usage: '<BreathingText text="Almost there..." />',
    props: [
      "text",
      "duration",
      "delay",
      "blur",
      "scale",
      "minOpacity",
      "repeat",
    ],
  },
  {
    name: "ElasticLettersText",
    description: "字符水平轻微拉伸后回弹，形成 SwiftUI 式弹性。",
    usage: '<ElasticLettersText text="Swift-like motion" />',
    props: [
      "text",
      "duration",
      "delay",
      "stagger",
      "stretch",
      "blur",
      "repeat",
    ],
  },
  {
    name: "LiquidText",
    description: "实验性的液体融合/分离文字动效。",
    usage: '<LiquidText text="Liquid motion" />',
    props: [
      "text",
      "duration",
      "delay",
      "stagger",
      "distance",
      "blur",
      "repeat",
    ],
  },
  {
    name: "PixelResolveText",
    description: "实验性的像素块还原文字动效。",
    usage: '<PixelResolveText text="Pixels resolve." />',
    props: ["text", "duration", "delay", "stagger", "pixelSize", "repeat"],
  },
];

function DocsApiCard({ item }: { item: DocsApiItem }) {
  return (
    <article className="rounded-2xl border border-neutral-200/70 bg-white p-4 shadow-[0_1px_1px_rgba(15,23,42,.03)] dark:border-white/8 dark:bg-neutral-950/50">
      <h3 className="font-mono text-[13px] font-semibold leading-5 text-neutral-900 dark:text-neutral-100">
        {item.name}
      </h3>
      <p className="mt-1 text-[13px] leading-6 text-neutral-500 dark:text-neutral-400">
        {item.description}
      </p>
      <code className="mt-3 block overflow-x-auto whitespace-nowrap font-mono text-[11px] leading-5 text-neutral-400 dark:text-neutral-500">
        {item.usage}
      </code>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {item.props.map((prop) => (
          <span
            className="rounded-full bg-neutral-100 px-2 py-1 font-mono text-[11px] leading-4 text-neutral-500 dark:bg-white/8 dark:text-neutral-400"
            key={prop}
          >
            {prop}
          </span>
        ))}
      </div>
    </article>
  );
}

function LandingHero({
  description,
  isDark,
  logoLabel,
  onStart,
  startLabel,
  title,
}: {
  description: string;
  isDark: boolean;
  logoLabel: string;
  onStart: () => void;
  startLabel: string;
  title: string;
}) {
  return (
    <section className="mx-auto mt-4 flex max-w-[460px] flex-col items-center text-center">
      <div className="mb-7">
        <MotionLogoCard isDark={isDark} label={logoLabel} />
      </div>
      <h1 className="text-balance font-heading text-[28px] font-semibold leading-tight tracking-normal">
        {title}
      </h1>
      <p className="mt-3 text-balance text-[16px] leading-7 text-neutral-500 dark:text-neutral-400">
        {description}
      </p>
      <div className="mt-7 flex items-center justify-center gap-3">
        <Button
          className="!h-[40px] rounded-full border-transparent bg-neutral-950 px-5 text-[13px] font-semibold text-white shadow-none transition-[background-color,color] duration-200 hover:bg-neutral-800 active:shadow-none data-pressed:shadow-none dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
          onClick={onStart}
          variant="secondary"
        >
          {startLabel}
        </Button>
        <Button
          className="!h-[40px] rounded-full px-5 text-[13px] font-semibold shadow-none transition-[background-color,color] duration-200 hover:bg-neutral-200 hover:text-neutral-950 active:shadow-none data-pressed:shadow-none dark:bg-white/[0.08] dark:text-neutral-100 dark:hover:bg-white/[0.13] dark:hover:text-neutral-50 [&_svg]:size-5"
          render={
            <a href={githubRepositoryUrl} rel="noreferrer" target="_blank" />
          }
          variant="secondary"
        >
          <GithubIcon className="size-5" />
          GitHub
        </Button>
      </div>
    </section>
  );
}

function scrollToInstallation() {
  document
    .getElementById("installation")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function NpmPage({
  copyLabel,
  footerPrefix,
  heroDescription,
  heroSlogan,
  isDark,
  logoLabel,
  startLabel,
}: {
  copyLabel: string;
  footerPrefix: string;
  heroDescription: string;
  heroSlogan: string;
  isDark: boolean;
  logoLabel: string;
  startLabel: string;
}) {
  return (
    <>
      <LandingHero
        description={heroDescription}
        isDark={isDark}
        logoLabel={logoLabel}
        onStart={scrollToInstallation}
        startLabel={startLabel}
        title={heroSlogan}
      />
      <section className="mx-auto mt-14 w-full max-w-[760px]">
        <div className="space-y-12">
          <div className="scroll-mt-8" id="installation">
            <h1 className="text-[18px] font-medium leading-7 tracking-normal text-neutral-900 dark:text-neutral-100">
              Installation
            </h1>
            <div className="mt-4">
              <DocsCodeBlock
                code={`npm install motion-text-kit

# or
pnpm add motion-text-kit
yarn add motion-text-kit`}
                label={`${copyLabel} npm install`}
              />
            </div>
            <p className="mt-3 text-[13px] leading-6 text-neutral-500 dark:text-neutral-400">
              Import the stylesheet once near your app root. The components are
              React-only and do not depend on Next.js or a runtime animation
              library.
            </p>
            <div className="mt-4">
              <DocsCodeBlock
                code={`import "motion-text-kit/styles.css";`}
                label={`${copyLabel} import styles`}
              />
            </div>
          </div>

          <div>
            <h2 className="text-[18px] font-medium leading-7 tracking-normal text-neutral-900 dark:text-neutral-100">
              Usage
            </h2>
            <div className="mt-4">
              <DocsCodeBlock
                code={`import {
  BreathingText,
  GradientSweepText,
  NumberDeltaText,
  TextReveal,
} from "motion-text-kit";
import "motion-text-kit/styles.css";

export function Example() {
  return (
    <section>
      <TextReveal text="Letters enter and leave." mode="in-out" repeat />

      <GradientSweepText>Stay hungry, stay foolish.</GradientSweepText>

      <NumberDeltaText value={24} />
      <NumberDeltaText value={-18} />

      <BreathingText text="Almost there..." />
    </section>
  );
}`}
                label={`${copyLabel} usage`}
              />
            </div>
          </div>

          <div>
            <h2 className="text-[18px] font-medium leading-7 tracking-normal text-neutral-900 dark:text-neutral-100">
              Component API
            </h2>
            <p className="mt-2 text-[13px] leading-6 text-neutral-500 dark:text-neutral-400">
              All components accept `className`, `style`, and native span props.
              Most components also support `as` to render a different element.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {docsApiItems.map((item) => (
                <DocsApiCard item={item} key={item.name} />
              ))}
            </div>
          </div>
        </div>
      </section>
      <FooterCredit prefix={footerPrefix} />
    </>
  );
}

export default function Home() {
  const [isDark, setIsDark] = useState(false);
  const [locale, setLocale] = useState<Locale>(getInitialLocale);
  const [activePage, setActivePage] = useState<ActivePage>("motion");
  const [expandedCard, setExpandedCard] = useState<ExpandedMotionCard | null>(
    null,
  );
  const closeTimerRef = useRef<number | null>(null);
  const copy = pageCopy[locale];
  const motionCards = createMotionCards(copy);

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
  }, [isDark]);

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  }, [locale]);

  useEffect(() => {
    if (!expandedCard) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeExpandedCard();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [expandedCard]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  function openExpandedCard(item: MotionCard, origin: DOMRect) {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setExpandedCard({ item, origin, state: "opening" });
    window.requestAnimationFrame(() => {
      setExpandedCard((current) =>
        current?.item.id === item.id ? { ...current, state: "open" } : current,
      );
    });
  }

  function closeExpandedCard() {
    setExpandedCard((current) =>
      current ? { ...current, state: "closing" } : current,
    );

    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
    }

    closeTimerRef.current = window.setTimeout(() => {
      setExpandedCard(null);
      closeTimerRef.current = null;
    }, 500);
  }

  function openNpmAndScrollToInstallation() {
    setActivePage("npm");
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(scrollToInstallation);
    });
  }

  return (
    <main className="min-h-svh bg-background text-neutral-900 transition-colors dark:text-neutral-100">
      <div
        className="app-shell mx-auto flex w-full max-w-[1040px] flex-col px-4 pb-16 pt-5"
        data-overlay-state={expandedCard?.state ?? "closed"}
      >
        <header className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-4">
            <BrandMark label={copy.logoLabel} />
            <Tabs
              className="gap-0"
              onValueChange={(value) => setActivePage(value as ActivePage)}
              value={activePage}
            >
              <TabsList className="h-8 rounded-full bg-secondary p-0.5 dark:bg-white/[0.08] [&_[data-slot=tab-indicator]]:rounded-full [&_[data-slot=tab-indicator]]:shadow-sm/5 dark:[&_[data-slot=tab-indicator]]:bg-white/[0.13]">
                <TabsTab
                  className="!h-7 rounded-full px-3 !text-[11px] leading-none data-active:bg-transparent data-active:shadow-none"
                  value="motion"
                >
                  Motion
                </TabsTab>
                <TabsTab
                  className="!h-7 rounded-full px-3 !text-[11px] leading-none data-active:bg-transparent data-active:shadow-none"
                  value="npm"
                >
                  npm
                </TabsTab>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex items-center gap-2">
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
            <Button
              aria-label={copy.githubLabel}
              className="!size-8 rounded-full shadow-none transition-[background-color,color] duration-200 hover:bg-neutral-200 hover:text-neutral-950 active:shadow-none dark:bg-white/[0.08] dark:hover:bg-white/[0.13] dark:hover:text-neutral-50 [&_svg]:size-3.5"
              onClick={(event) => {
                event.preventDefault();
                window.open(githubRepositoryUrl, "_blank", "noopener,noreferrer");
              }}
              render={
                <a
                  href={githubRepositoryUrl}
                  rel="noreferrer"
                  target="_blank"
                />
              }
              variant="secondary"
            >
              <GithubIcon className="size-3.5" />
            </Button>
            <Button
              aria-label={copy.themeLabel}
              aria-pressed={isDark}
              className="!size-8 rounded-full shadow-none transition-[background-color,color] duration-200 hover:bg-neutral-200 hover:text-neutral-950 active:shadow-none dark:bg-white/[0.08] dark:hover:bg-white/[0.13] dark:hover:text-neutral-50 [&_svg]:size-3.5"
              onClick={() => setIsDark((current) => !current)}
              variant="secondary"
            >
              {isDark ? (
                <FilledSunIcon className="size-3.5" />
              ) : (
                <FilledMoonIcon className="size-3.5" />
              )}
            </Button>
          </div>
        </header>

        {activePage === "motion" ? (
          <>
            <LandingHero
              description={copy.heroDescription}
              isDark={isDark}
              logoLabel={copy.logoLabel}
              onStart={openNpmAndScrollToInstallation}
              startLabel={copy.startLabel}
              title={copy.heroSlogan}
            />

            <section className="mt-11 grid gap-5 lg:grid-cols-3" id="effects">
              {motionCards.map((item) => (
                <MotionCatalogCard
                  item={item}
                  key={item.id}
                  onOpen={openExpandedCard}
                />
              ))}
            </section>

            <FooterCredit prefix={copy.footerPrefix} />
          </>
        ) : (
          <NpmPage
            copyLabel={copy.copyLabel}
            footerPrefix={copy.footerPrefix}
            heroDescription={copy.heroDescription}
            heroSlogan={copy.heroSlogan}
            isDark={isDark}
            logoLabel={copy.logoLabel}
            startLabel={copy.startLabel}
          />
        )}
      </div>
      {expandedCard ? (
        <ExpandedMotionCardOverlay
          copyLabel={copy.copyLabel}
          expanded={expandedCard}
          onClose={closeExpandedCard}
          scenarioLabel={copy.scenarioLabel}
        />
      ) : null}
    </main>
  );
}
