"use client";

import type * as React from "react";
import { useEffect, useMemo, useState } from "react";
import type { BaseMotionProps, MotionElement, MotionStyle } from "./types";

type NativeProps<TElement extends MotionElement> = Omit<
  React.ComponentPropsWithoutRef<TElement>,
  keyof AiStreamTextOwnProps<TElement>
>;

type AiStreamTextOwnProps<TElement extends MotionElement = "span"> =
  BaseMotionProps<TElement> & {
    text: string;
    duration?: number;
    delay?: number;
    hold?: number;
    stagger?: number;
    distance?: number;
    blur?: number;
    mutedColor?: string;
    colorA?: string;
    colorB?: string;
    colorC?: string;
    easing?: string;
    repeat?: boolean;
    iterationCount?: number | "infinite";
    itemClassName?: string;
  };

export type AiStreamTextProps<TElement extends MotionElement = "span"> =
  AiStreamTextOwnProps<TElement> & NativeProps<TElement>;

function splitGraphemes(text: string): string[] {
  const segmenter =
    typeof Intl !== "undefined" && "Segmenter" in Intl
      ? new (Intl as typeof Intl & {
          Segmenter: new (
            locale?: string,
            options?: { granularity: "grapheme" },
          ) => { segment: (input: string) => Iterable<{ segment: string }> };
        }).Segmenter(undefined, { granularity: "grapheme" })
      : null;

  if (!segmenter) {
    return Array.from(text);
  }

  return Array.from(segmenter.segment(text), ({ segment }) => segment);
}

export function AiStreamText<TElement extends MotionElement = "span">({
  as,
  text,
  duration = 880,
  delay = 0,
  hold = 1500,
  stagger = 36,
  distance = 13,
  blur = 6,
  mutedColor = "color-mix(in srgb, currentColor 42%, transparent)",
  colorA = "#38bdf8",
  colorB = "#a78bfa",
  colorC = "#22c55e",
  easing = "cubic-bezier(.16, 1, .3, 1)",
  repeat = true,
  iterationCount,
  className,
  itemClassName,
  style,
  ...props
}: AiStreamTextProps<TElement>): React.ReactElement {
  const Component = as ?? "span";
  const characters = useMemo(() => splitGraphemes(text), [text]);
  const [cycleState, setCycleState] = useState({ hidden: true, key: 0 });
  const cycle =
    duration + stagger * Math.max(characters.length - 1, 0) + hold;
  const resetGuard = Math.min(120, Math.max(72, stagger * 3));
  const fadeDuration = Math.min(360, Math.max(220, cycle * 0.1));
  const fadeStart = Math.max(cycle - fadeDuration, 0);
  const activeCycleState = repeat ? cycleState : { hidden: false, key: 0 };
  const motionStyle: MotionStyle = {
    "--mtk-ai-stream-delay": `${delay}ms`,
    "--mtk-ai-stream-duration": `${duration}ms`,
    "--mtk-ai-stream-cycle": `${cycle}ms`,
    "--mtk-ai-stream-stagger": `${stagger}ms`,
    "--mtk-ai-stream-distance": `${distance}px`,
    "--mtk-ai-stream-blur": `${blur}px`,
    "--mtk-ai-stream-muted": mutedColor,
    "--mtk-ai-stream-color-a": colorA,
    "--mtk-ai-stream-color-b": colorB,
    "--mtk-ai-stream-color-c": colorC,
    "--mtk-ai-stream-ease": easing,
    "--mtk-ai-stream-iteration-count": repeat
      ? "infinite"
      : (iterationCount ?? 1),
    ...style,
  };

  useEffect(() => {
    if (!repeat) {
      return;
    }

    const timers: number[] = [];
    let cancelled = false;

    function queue(timeout: number, callback: () => void) {
      timers.push(
        window.setTimeout(() => {
          if (!cancelled) {
            callback();
          }
        }, Math.max(timeout, 0)),
      );
    }

    function runCycle(key: number) {
      setCycleState({ hidden: true, key });

      queue(resetGuard, () => {
        setCycleState((current) =>
          current.key === key ? { ...current, hidden: false } : current,
        );
      });

      queue(fadeStart, () => {
        setCycleState((current) =>
          current.key === key ? { ...current, hidden: true } : current,
        );
      });

      queue(cycle, () => {
        runCycle(key + 1);
      });
    }

    queue(delay, () => {
      runCycle(0);
    });

    return () => {
      cancelled = true;
      timers.forEach((timer) => {
        window.clearTimeout(timer);
      });
    };
  }, [cycle, delay, fadeStart, repeat, resetGuard]);

  return (
    <Component
      aria-label={text}
      className={["mtk-ai-stream-text", className].filter(Boolean).join(" ")}
      data-cycle-hidden={activeCycleState.hidden ? "" : undefined}
      data-repeat={repeat ? "true" : undefined}
      style={motionStyle}
      {...props}
    >
      {characters.map((character, index) => {
        const charDelay = index * stagger;

        return (
          <span
            aria-hidden="true"
            className={["mtk-ai-stream-text__char", itemClassName]
              .filter(Boolean)
              .join(" ")}
            data-char={character}
            data-pending={activeCycleState.hidden ? "" : undefined}
            key={`${activeCycleState.key}-${index}`}
            style={
              {
                "--mtk-index": index,
                "--mtk-ai-stream-char-delay": `${charDelay}ms`,
              } as MotionStyle
            }
          >
            {character}
          </span>
        );
      })}
    </Component>
  );
}
