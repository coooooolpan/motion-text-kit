"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  ArrowUpRightIcon,
  CopyIcon,
  MoonIcon,
  SparklesIcon,
  SunIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  GradientSweepText,
  RollingNumber,
  TextReveal,
} from "@/motion-text-kit";

type MotionCard = {
  title: string;
  description: string;
  preview: ReactNode;
  code: string;
};

const githubRepositoryUrl = "https://github.com/coooooolpan/motion-text-kit";

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
      className="inline-flex items-center justify-center font-mono text-[15px] font-semibold leading-[22px] tracking-normal"
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
          className="font-heading text-[15px] font-semibold leading-[22px] tracking-normal text-neutral-800 dark:text-neutral-100"
          duration={2800}
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
          className="max-w-56 justify-center text-balance font-heading text-[15px] font-semibold leading-[22px]"
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
];

function MotionCatalogCard({ item }: { item: MotionCard }) {
  return (
    <Card className="group overflow-hidden rounded-[1.5rem] border-neutral-200/80 bg-white shadow-[0_1px_1px_rgba(15,23,42,.02)] before:hidden dark:border-neutral-800/80 dark:bg-neutral-900">
      <div className="m-3 flex h-[218px] items-center justify-center rounded-[0.75rem] border border-neutral-200/70 bg-neutral-50/80 p-5 dark:border-neutral-800 dark:bg-neutral-950/50">
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
      <div className="mx-auto flex w-full max-w-[884px] flex-col px-4 pb-16 pt-5">
        <header className="flex justify-end">
          <div className="flex items-center gap-2">
            <Button
              className="!h-8 rounded-full px-3.5 !text-[13px] leading-none [&_svg]:size-3.5"
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
              className="!size-8 rounded-full [&_svg]:size-3.5"
              onClick={() => setIsDark((current) => !current)}
              variant="secondary"
            >
              {isDark ? (
                <SunIcon className="size-3.5" />
              ) : (
                <MoonIcon className="size-3.5" />
              )}
            </Button>
          </div>
        </header>

        <section className="mx-auto mt-4 flex max-w-[460px] flex-col items-center text-center">
          <div className="mb-7 grid size-10 place-items-center rounded-xl bg-white shadow-[0_16px_42px_rgba(59,130,246,.16)] dark:bg-neutral-900 dark:shadow-[0_16px_42px_rgba(59,130,246,.08)]">
            <SparklesIcon className="size-4 text-neutral-700 dark:text-neutral-200" />
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
            <span className="ml-1 inline-grid size-3.5 place-items-center">
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
