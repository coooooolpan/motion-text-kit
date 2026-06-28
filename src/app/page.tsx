"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  ArrowUpRightIcon,
  CopyIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DecryptText,
  GradientSweepText,
  RollingNumber,
  SpoilerText,
  TextReveal,
  WeightSweepText,
} from "@/motion-text-kit";

type MotionCard = {
  title: string;
  description: string;
  preview: ReactNode;
  code: string;
};

type MotionLogoStyle = CSSProperties & Record<`--${string}`, string | number>;

const githubRepositoryUrl = "https://github.com/coooooolpan/motion-text-kit";
const motionLogoBitmap = [
  "1111111",
  "1111111",
  "0011100",
  "0011100",
  "0011100",
  "0011100",
  "0011100",
] as const;
const motionLogoNoiseGlyphs = Array.from("1+0-*:1+0-*:1+0-*:1+0-*:1+0-*:1+0-*:1+");
const motionLogoCellShapes = ["square", "circle", "triangle", "dash"] as const;
const motionLogoCells = motionLogoBitmap.flatMap((row, y) =>
  Array.from(row).flatMap((value, x) => (value === "1" ? [{ x, y }] : [])),
);

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

function MotionLogo() {
  return (
    <span aria-label="Motion Text Kit logo" className="motion-logo" role="img">
      <span aria-hidden="true" className="motion-logo__noise">
        {motionLogoNoiseGlyphs.map((glyph, index) => (
          <span
            className="motion-logo__noise-glyph"
            key={`${glyph}-${index}`}
            style={{ "--logo-noise-index": index } as MotionLogoStyle}
          >
            {glyph}
          </span>
        ))}
      </span>
      <span aria-hidden="true" className="motion-logo__pixel-t">
        {motionLogoCells.map(({ x, y }, index) => {
          const shape = motionLogoCellShapes[index % motionLogoCellShapes.length];
          const scatterX = ((index % 7) - 3) * 3.8;
          const scatterY = (Math.floor(index / 7) - 2) * 3.8;

          return (
            <span
              className="motion-logo__pixel"
              data-shape={shape}
              key={`${x}-${y}`}
              style={
                {
                  "--logo-cell-index": index,
                  "--logo-cell-x": x,
                  "--logo-cell-y": y,
                  "--logo-cell-scatter-x": `${scatterX}px`,
                  "--logo-cell-scatter-y": `${scatterY}px`,
                } as MotionLogoStyle
              }
            />
          );
        })}
      </span>
      <span aria-hidden="true" className="motion-logo__line-t">
        {motionLogoCells.map(({ x, y }, index) => (
          <span
            className="motion-logo__line-cell"
            key={`line-${x}-${y}`}
            style={
              {
                "--logo-cell-index": index,
                "--logo-cell-x": x,
                "--logo-cell-y": y,
              } as MotionLogoStyle
            }
          />
        ))}
      </span>
    </span>
  );
}

function CurrentTimePreview() {
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
      aria-label={`Current time ${hours}:${minutes}:${seconds}`}
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

const motionCards: MotionCard[] = [
  {
    title: "文本高光滑动",
    description: "Masked gradient sweep across text",
    preview: (
      <div className="grid place-items-center text-center">
        <GradientSweepText
          accentColor="rgba(255,255,255,.72)"
          className="font-heading text-[14px] font-semibold leading-[22px] tracking-normal text-neutral-800 dark:text-neutral-100"
          duration={2200}
          highlightColor="#ffffff"
        >
          Stay hungry, stay foolish.
        </GradientSweepText>
      </div>
    ),
    code: `<GradientSweepText>Highlight sweep</GradientSweepText>`,
  },
  {
    title: "逐字出现消失",
    description: "Characters reveal, hold, then disappear",
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
          text="Letters enter and leave."
        />
      </div>
    ),
    code: `<TextReveal text="Letters enter and leave." mode="in-out" repeat />`,
  },
  {
    title: "倒计时数字滚动",
    description: "Rolling current HH:mm:ss time",
    preview: <CurrentTimePreview />,
    code: `<RollingNumber value={new Date().getSeconds()} />`,
  },
  {
    title: "隐藏文本粒子",
    description: "Tap-to-reveal spoiler particles",
    preview: (
      <div className="grid place-items-center text-center">
        <SpoilerText
          className="font-heading text-[14px] font-semibold leading-[22px] tracking-normal text-neutral-800 dark:text-neutral-100"
          particleColor="color-mix(in srgb, currentColor 72%, transparent)"
          text="Tap to reveal this."
        />
      </div>
    ),
    code: `<SpoilerText text="Tap to reveal this." />`,
  },
  {
    title: "解码文本出现",
    description: "Random glyphs resolve into text",
    preview: (
      <div className="grid place-items-center text-center">
        <DecryptText
          className="font-mono text-[14px] font-semibold leading-[22px] tracking-normal"
          text="ACCESS GRANTED"
        />
      </div>
    ),
    code: `<DecryptText text="ACCESS GRANTED" />`,
  },
  {
    title: "字重扫光变化",
    description: "Weight shifts from thin to bold",
    preview: (
      <div className="grid place-items-center text-center">
        <WeightSweepText
          className="font-heading text-[14px] leading-[22px] tracking-normal"
          maxWeight={820}
          minWeight={280}
          text="Weight wave passes."
        />
      </div>
    ),
    code: `<WeightSweepText text="Weight wave passes." />`,
  },
];

function MotionCatalogCard({ item }: { item: MotionCard }) {
  return (
    <Card className="group overflow-hidden rounded-[1.5rem] border-neutral-200/45 bg-white shadow-[0_1px_1px_rgba(15,23,42,.02)] before:hidden dark:border-neutral-800/55 dark:bg-neutral-900">
      <div className="m-3 flex h-[218px] items-center justify-center rounded-[0.75rem] border border-neutral-200/45 bg-neutral-50 p-5 dark:border-neutral-700/35 dark:bg-neutral-800/35">
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
        <Button
          aria-label={`Copy ${item.title}`}
          className="self-end rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
          size="icon-xs"
          variant="ghost"
        >
          <CopyIcon className="size-3.5" />
        </Button>
      </div>
    </Card>
  );
}

export default function Home() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <main className="min-h-svh bg-[#fafafa] text-neutral-900 transition-colors dark:bg-neutral-950 dark:text-neutral-100">
      <div className="mx-auto flex w-full max-w-[1040px] flex-col px-4 pb-16 pt-5">
        <header className="flex justify-end">
          <div className="flex items-center gap-2">
            <Button
              className="!h-8 rounded-full px-3.5 !text-[13px] leading-none shadow-none transition-[background-color,color] duration-200 hover:bg-neutral-200 hover:text-neutral-950 active:shadow-none dark:hover:bg-neutral-800 dark:hover:text-neutral-50 [&_svg]:size-3.5"
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
              aria-label="Toggle dark mode"
              aria-pressed={isDark}
              className="!size-8 rounded-full shadow-none transition-[background-color,color] duration-200 hover:bg-neutral-200 hover:text-neutral-950 active:shadow-none dark:hover:bg-neutral-800 dark:hover:text-neutral-50 [&_svg]:size-3.5"
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

        <section className="mx-auto mt-4 flex max-w-[460px] flex-col items-center text-center">
          <div className="mb-7 grid size-10 place-items-center rounded-xl bg-white shadow-[0_16px_42px_rgba(59,130,246,.16)] dark:bg-neutral-900 dark:shadow-[0_16px_42px_rgba(59,130,246,.08)]">
            <MotionLogo />
          </div>
          <h1 className="font-heading text-2xl font-semibold tracking-normal">
            Motion Text Kit
          </h1>
          <p className="mt-3 text-balance text-[14px] leading-6 text-neutral-500 dark:text-neutral-400">
            Motion Text Kit 是一组轻量的 React 文本动效组件，用 CSS
            动画实现高光滑动、逐字出现和数字滚动等常用效果。
          </p>
        </section>

        <section className="mt-11 grid gap-5 lg:grid-cols-3">
          {motionCards.map((item) => (
            <MotionCatalogCard item={item} key={item.title} />
          ))}
        </section>

        <p className="mt-14 text-center text-[12px] leading-5 text-neutral-400 dark:text-neutral-500">
          Designed by{" "}
          <a
            className="group inline-flex items-center font-semibold text-neutral-600 transition-colors duration-300 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-100"
            href="https://coooooolpan.vercel.app/"
            rel="noreferrer"
            target="_blank"
          >
            coooooolpan
            <span className="ml-0.5 inline-grid size-3.5 place-items-center">
              <ArrowUpRightIcon
                aria-hidden="true"
                className="size-3 translate-x-[-0.4rem] translate-y-[0.4rem] scale-75 opacity-0 [filter:blur(2px)] transition-[opacity,translate,scale,filter] duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-0 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-hover:[filter:blur(0px)]"
                strokeWidth={2.2}
              />
            </span>
          </a>
        </p>
      </div>
    </main>
  );
}
