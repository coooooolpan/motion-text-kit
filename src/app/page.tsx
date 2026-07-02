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
  DecryptText,
  FocusBlurText,
  GradientSweepText,
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
  preview: ReactNode;
  code: string;
};

type ExpandedMotionCard = {
  item: MotionCard;
  origin: DOMRect;
  state: "opening" | "open" | "closing";
};

const githubRepositoryUrl = "https://github.com/coooooolpan/motion-text-kit";
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
    themeLabel: "切换深色模式",
    logoLabel: "Motion Text Kit 标志",
    heroDescription:
      "Motion Text Kit 是一组轻量的 React 文本动效组件，用 CSS 动画实现高光滑动、逐字出现和数字滚动等常用效果。",
    copyLabel: "复制",
    currentTimeLabel: "当前时间",
    footerPrefix: "Crafted by",
    resetInvisibleLabel: "复原隐形",
    cards: {
      gradient: {
        title: "文本高光滑动",
        description: "一道柔和高光从文字表面滑过",
        previewText: "Stay hungry, stay foolish.",
      },
      reveal: {
        title: "逐字出现消失",
        description: "字符依次出现、停留，然后淡出",
        previewText: "Letters enter and leave.",
      },
      rolling: {
        title: "倒计时数字滚动",
        description: "按 HH:mm:ss 滚动展示当前时间",
      },
      spoiler: {
        title: "隐形墨水",
        description: "像隐形墨水一样按下后显露文字",
        previewText: "Tap to reveal this.",
      },
      decrypt: {
        title: "解码文本出现",
        description: "随机字符逐步解析为最终文本",
        previewText: "ACCESS GRANTED",
      },
      weight: {
        title: "字重扫光变化",
        description: "字重从细到粗平滑扫过文字",
        previewText: "Weight wave passes.",
      },
      focus: {
        title: "模糊聚焦",
        description: "文字从失焦模糊聚拢到清晰",
        previewText: "Focus sharpens softly.",
      },
      ticker: {
        title: "横向滚动公告",
        description: "文本在两端带光感模糊后滚入滚出",
        previewText: "Motion text kit is now available.",
      },
      typewriter: {
        title: "打字机光标输入",
        description: "逐字输入并带闪烁光标",
        previewText: "Typing with a cursor",
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
    themeLabel: "Toggle dark mode",
    logoLabel: "Motion Text Kit logo",
    heroDescription:
      "Motion Text Kit is a lightweight set of React text-motion primitives for highlight sweeps, character reveals, rolling numbers, and playful text effects powered by CSS animation.",
    copyLabel: "Copy",
    currentTimeLabel: "Current time",
    footerPrefix: "Crafted by",
    resetInvisibleLabel: "Hide again",
    cards: {
      gradient: {
        title: "Gradient Text Sweep",
        description: "A soft highlight glides across the text",
        previewText: "Stay hungry, stay foolish.",
      },
      reveal: {
        title: "Character Reveal",
        description: "Characters enter, hold, then leave",
        previewText: "Letters enter and leave.",
      },
      rolling: {
        title: "Rolling Time Digits",
        description: "Current HH:mm:ss time with rolling digits",
      },
      spoiler: {
        title: "Invisible Ink Text",
        description: "Press to reveal text through particles",
        previewText: "Tap to reveal this.",
      },
      decrypt: {
        title: "Decrypt Text",
        description: "Random glyphs resolve into final text",
        previewText: "ACCESS GRANTED",
      },
      weight: {
        title: "Weight Sweep",
        description: "Text weight sweeps from thin to bold",
        previewText: "Weight wave passes.",
      },
      focus: {
        title: "Blur Focus",
        description: "Text resolves from soft blur into focus",
        previewText: "Focus sharpens softly.",
      },
      ticker: {
        title: "Ticker Text",
        description: "Horizontal notice text fades through soft glowing edges",
        previewText: "Motion text kit is now available.",
      },
      typewriter: {
        title: "Typewriter Cursor",
        description: "Characters type in with a blinking caret",
        previewText: "Typing with a cursor",
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
        <filter id="motion-logo-roughen">
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
          <Card className="logo-card grid size-[3.875rem] place-items-center overflow-hidden rounded-[1.1rem] border-black/[0.045] bg-white p-0 shadow-[0_14px_36px_rgba(59,130,246,.13)] dark:border-white/8 dark:bg-neutral-900 dark:shadow-[0_14px_36px_rgba(59,130,246,.08)]">
            <MotionLogo label={label} />
          </Card>
        </BorderBeam>
      </div>
    </div>
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
      preview: <CurrentTimePreview label={copy.currentTimeLabel} />,
      code: `<RollingNumber value={new Date().getSeconds()} />`,
    },
    {
      id: "spoiler",
      title: copy.cards.spoiler.title,
      description: copy.cards.spoiler.description,
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
      preview: (
        <div className="grid place-items-center text-center">
          <TickerText
            blur={6}
            className="w-56 font-heading text-[14px] font-semibold leading-[22px] tracking-normal"
            duration={3900}
            stagger={34}
            text={copy.cards.ticker.previewText}
          />
        </div>
      ),
      code: `<TickerText text="Motion text kit is now available." />`,
    },
    {
      id: "typewriter",
      title: copy.cards.typewriter.title,
      description: copy.cards.typewriter.description,
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
  ];
}

function MotionCatalogCard({
  copyLabel,
  item,
  onOpen,
}: {
  copyLabel: string;
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
      <div className="grid grid-cols-[1fr_auto] gap-3 px-5 pb-5 pt-1">
        <div className="min-w-0">
          <h2 className="font-semibold text-[13px] leading-5 text-neutral-900 dark:text-neutral-100">
            {item.title}
          </h2>
          <p className="mt-0.5 text-[12px] leading-5 text-neutral-500 dark:text-neutral-400">
            {item.description}
          </p>
          <code className="mt-3 block truncate font-mono text-[11px] text-neutral-400 dark:text-neutral-500">
            {item.code}
          </code>
        </div>
        <CopyCodeButton
          className="self-end rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
          code={item.code}
          iconClassName="size-3.5"
          label={`${copyLabel} ${item.title}`}
          size="icon-xs"
        />
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
}: {
  copyLabel: string;
  expanded: ExpandedMotionCard;
  onClose: () => void;
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

function NpmPage({
  copyLabel,
  footerPrefix,
}: {
  copyLabel: string;
  footerPrefix: string;
}) {
  return (
    <>
      <section className="mx-auto mt-14 w-full max-w-[760px]">
        <div className="space-y-12">
          <div>
            <h1 className="text-[18px] font-medium leading-7 tracking-normal text-neutral-900 dark:text-neutral-100">
              Installation
            </h1>
            <div className="mt-4">
              <DocsCodeBlock
                code="npm install motion-text-kit"
                label={`${copyLabel} npm install`}
              />
            </div>
          </div>

          <div>
            <h2 className="text-[18px] font-medium leading-7 tracking-normal text-neutral-900 dark:text-neutral-100">
              Usage
            </h2>
            <div className="mt-4">
              <DocsCodeBlock
                code={`import { GradientSweepText } from "motion-text-kit";
import "motion-text-kit/styles.css";

export function Example() {
  return (
    <GradientSweepText>
      Stay hungry, stay foolish.
    </GradientSweepText>
  );
}`}
                label={`${copyLabel} usage`}
              />
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
  const [locale, setLocale] = useState<Locale>("zh");
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

  return (
    <main className="min-h-svh bg-background text-neutral-900 transition-colors dark:text-neutral-100">
      <div
        className="app-shell mx-auto flex w-full max-w-[1040px] flex-col px-4 pb-16 pt-5"
        data-overlay-state={expandedCard?.state ?? "closed"}
      >
        <header className="flex items-center justify-between gap-3">
          <Tabs
            className="gap-0"
            onValueChange={(value) => setActivePage(value as ActivePage)}
            value={activePage}
          >
            <TabsList className="h-8 rounded-full bg-secondary p-0.5 dark:bg-white/[0.08] [&_[data-slot=tab-indicator]]:rounded-full [&_[data-slot=tab-indicator]]:shadow-sm/5 dark:[&_[data-slot=tab-indicator]]:bg-white/[0.13]">
              <TabsTab
                className="!h-7 rounded-full px-3 text-[11px] leading-none data-active:bg-transparent data-active:shadow-none"
                value="motion"
              >
                Motion
              </TabsTab>
              <TabsTab
                className="!h-7 rounded-full px-3 text-[11px] leading-none data-active:bg-transparent data-active:shadow-none"
                value="npm"
              >
                npm
              </TabsTab>
            </TabsList>
          </Tabs>
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
                className="min-w-32"
                sideOffset={8}
              >
                <MenuRadioGroup
                  onValueChange={(value) => setLocale(value as Locale)}
                  value={locale}
                >
                  <MenuRadioItem
                    className="grid-cols-[1.75rem_1fr] ps-4"
                    closeOnClick
                    label="中文"
                    value="zh"
                  >
                    {copy.languageOptions.zh}
                  </MenuRadioItem>
                  <MenuRadioItem
                    className="grid-cols-[1.75rem_1fr] ps-4"
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
              className="!h-8 rounded-full px-3.5 !text-[13px] leading-none shadow-none transition-[background-color,color] duration-200 hover:bg-neutral-200 hover:text-neutral-950 active:shadow-none dark:bg-white/[0.08] dark:hover:bg-white/[0.13] dark:hover:text-neutral-50 [&_svg]:size-3.5"
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
              GitHub
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
            <section className="mx-auto mt-4 flex max-w-[460px] flex-col items-center text-center">
              <div className="mb-7">
                <MotionLogoCard isDark={isDark} label={copy.logoLabel} />
              </div>
              <h1 className="font-heading text-2xl font-semibold tracking-normal">
                Motion Text Kit
              </h1>
              <p className="mt-3 text-balance text-[14px] leading-6 text-neutral-500 dark:text-neutral-400">
                {copy.heroDescription}
              </p>
            </section>

            <section className="mt-11 grid gap-5 lg:grid-cols-3">
              {motionCards.map((item) => (
                <MotionCatalogCard
                  copyLabel={copy.copyLabel}
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
          />
        )}
      </div>
      {expandedCard ? (
        <ExpandedMotionCardOverlay
          copyLabel={copy.copyLabel}
          expanded={expandedCard}
          onClose={closeExpandedCard}
        />
      ) : null}
    </main>
  );
}
