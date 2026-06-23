"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import {
  CopyIcon,
  GitForkIcon,
  MoonIcon,
  PackageIcon,
  SparklesIcon,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Kbd } from "@/components/ui/kbd";
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

type PreviewActionProps = {
  children?: ReactNode;
  onClick?: () => void;
};

function PreviewAction({
  children = "Animate",
  onClick,
}: PreviewActionProps) {
  if (onClick) {
    return (
      <button
        className="inline-flex h-7 items-center rounded-full bg-neutral-200/60 px-3.5 font-medium text-[12px] leading-none text-neutral-700 shadow-[inset_0_1px_0_rgba(255,255,255,.72)] transition-colors hover:bg-neutral-200 active:bg-neutral-300"
        onClick={onClick}
        type="button"
      >
        {children}
      </button>
    );
  }

  return (
    <span className="inline-flex h-7 items-center rounded-full bg-neutral-200/60 px-3.5 font-medium text-[12px] leading-none text-neutral-700 shadow-[inset_0_1px_0_rgba(255,255,255,.72)]">
      {children}
    </span>
  );
}

function SegmentPill() {
  return (
    <div className="mt-8 inline-flex h-9 items-center rounded-full bg-neutral-200/70 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,.85),0_1px_2px_rgba(0,0,0,.04)]">
      <span className="inline-flex h-7 min-w-32 items-center justify-center rounded-full bg-white px-5 text-[15px] font-medium leading-none text-neutral-900 shadow-[0_1px_3px_rgba(0,0,0,.14),inset_0_1px_0_rgba(255,255,255,.92)]">
        Core effects
      </span>
      <span className="inline-flex h-7 min-w-32 items-center justify-center rounded-full px-5 text-[15px] font-medium leading-none text-neutral-600">
        CSS + React
      </span>
    </div>
  );
}

const rollingTargets = [9864, 12480, 7352, 16024, 4208];

function RollingNumberPreview() {
  const [roll, setRoll] = useState({
    from: 1280,
    index: 0,
    value: rollingTargets[0],
  });

  function playNextRoll() {
    setRoll((current) => {
      const nextIndex = (current.index + 1) % rollingTargets.length;

      return {
        from: current.value,
        index: nextIndex,
        value: rollingTargets[nextIndex],
      };
    });
  }

  return (
    <div className="grid place-items-center gap-10 text-center">
      <RollingNumber
        className="font-mono text-[15px] font-semibold leading-[22px] tracking-normal"
        duration={500}
        from={roll.from}
        key={`${roll.from}-${roll.value}-${roll.index}`}
        prefix="$"
        stagger={70}
        value={roll.value}
      />
      <PreviewAction onClick={playNextRoll}>Animate</PreviewAction>
    </div>
  );
}

const motionCards: MotionCard[] = [
  {
    title: "文本高光滑动",
    description: "Masked gradient sweep across text",
    preview: (
      <div className="grid place-items-center gap-10 text-center">
        <GradientSweepText
          accentColor="rgba(255,255,255,.7)"
          baseColor="#8a8a8a"
          className="font-heading text-[15px] font-semibold leading-[22px] tracking-normal"
          duration={3600}
          easing="linear"
          highlightColor="#ffffff"
        >
          slide to unlock
        </GradientSweepText>
        <PreviewAction>Play</PreviewAction>
      </div>
    ),
    code: `<GradientSweepText>Highlight sweep</GradientSweepText>`,
  },
  {
    title: "逐字出现消失",
    description: "Characters reveal, hold, then disappear",
    preview: (
      <div className="grid place-items-center gap-10 text-center">
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
        <PreviewAction>Loop</PreviewAction>
      </div>
    ),
    code: `<TextReveal text="Letters enter and leave." mode="in-out" repeat />`,
  },
  {
    title: "数字文本滚动",
    description: "Digit pop-in with blur and stagger",
    preview: <RollingNumberPreview />,
    code: `<RollingNumber value={9864} prefix="$" />`,
  },
];

function MotionCatalogCard({ item }: { item: MotionCard }) {
  return (
    <Card className="group overflow-hidden rounded-[1.35rem] border-neutral-200/80 bg-white shadow-[0_1px_1px_rgba(15,23,42,.02)] before:hidden">
      <div className="m-3 flex h-[218px] items-center justify-center rounded-[1rem] border border-neutral-200/70 bg-neutral-50/80 p-5">
        {item.preview}
      </div>
      <div className="grid grid-cols-[1fr_auto] gap-3 px-5 pb-5 pt-1">
        <div className="min-w-0">
          <h2 className="font-semibold text-[13px] leading-5 text-neutral-900">
            {item.title}
          </h2>
          <p className="mt-0.5 text-[12px] leading-5 text-neutral-500">
            {item.description}
          </p>
          <code className="mt-3 block truncate font-mono text-[11px] text-neutral-400">
            {item.code}
          </code>
        </div>
        <Button
          aria-label={`Copy ${item.title}`}
          className="self-end rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
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
  return (
    <main className="min-h-svh bg-[#fafafa] text-neutral-900">
      <div className="mx-auto flex w-full max-w-[884px] flex-col px-4 pb-16 pt-5">
        <header className="flex justify-end">
          <div className="flex items-center gap-2">
            <Button
              className="!h-9 rounded-full px-4 !text-[15px] leading-none [&_svg]:size-4"
              variant="secondary"
            >
              <PackageIcon className="size-3.5" />
              Package
            </Button>
            <Button
              className="!h-9 rounded-full px-4 !text-[15px] leading-none [&_svg]:size-4"
              variant="secondary"
            >
              <GitForkIcon className="size-3.5" />
              npm
            </Button>
            <Button
              aria-label="Close"
              className="!size-9 rounded-full [&_svg]:size-4"
              variant="secondary"
            >
              <XIcon className="size-4" />
            </Button>
            <Button
              aria-label="Theme"
              className="!size-9 rounded-full [&_svg]:size-4"
              variant="secondary"
            >
              <MoonIcon className="size-4" />
            </Button>
          </div>
        </header>

        <section className="mx-auto mt-4 flex max-w-[460px] flex-col items-center text-center">
          <div className="mb-7 grid size-10 place-items-center rounded-xl bg-white shadow-[0_16px_42px_rgba(59,130,246,.16)]">
            <SparklesIcon className="size-4 text-neutral-700" />
          </div>
          <h1 className="font-heading text-2xl font-semibold tracking-normal">
            Motion Text Kit
          </h1>
          <p className="mt-3 text-balance text-[14px] leading-6 text-neutral-500">
            先沉淀三个核心文本动效：文本高光滑动、逐字出现消失、数字文本滚动。
          </p>
          <SegmentPill />
        </section>

        <section className="mt-11 grid gap-5 lg:grid-cols-3">
          {motionCards.map((item) => (
            <MotionCatalogCard item={item} key={item.title} />
          ))}
        </section>

        <section className="mx-auto mt-16 grid w-full max-w-[640px] gap-8 border-l border-neutral-200 pl-5 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <p className="text-[14px] font-medium leading-6 text-neutral-800">
              Package entry remains framework-neutral. Import the component and
              the CSS once in any React app.
            </p>
            <p className="mt-3 text-[12px] leading-5 text-neutral-500">
              motion-text-kit
              <br />
              CSS-first text motion primitives
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Kbd>TextReveal</Kbd>
            <Kbd>GradientSweepText</Kbd>
            <Kbd>RollingNumber</Kbd>
          </div>
        </section>

        <p className="mt-14 text-center text-[12px] leading-5 text-neutral-400">
          Made by coooooolpan
        </p>
      </div>
    </main>
  );
}
