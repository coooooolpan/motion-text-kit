"use client";

import type * as React from "react";
import { useEffect, useMemo, useState } from "react";
import type { BaseMotionProps, MotionElement, MotionStyle } from "./types";

type NativeProps<TElement extends MotionElement> = Omit<
  React.ComponentPropsWithoutRef<TElement>,
  keyof SoftScrambleTextOwnProps<TElement>
>;

type SoftScrambleTextOwnProps<TElement extends MotionElement = "span"> =
  BaseMotionProps<TElement> & {
    text: string;
    alphabet?: string;
    duration?: number;
    delay?: number;
    tick?: number;
    intensity?: number;
    loop?: boolean;
    loopDelay?: number;
    itemClassName?: string;
  };

export type SoftScrambleTextProps<TElement extends MotionElement = "span"> =
  SoftScrambleTextOwnProps<TElement> & NativeProps<TElement>;

const defaultSoftAlphabet = "abcdefghijklmnopqrstuvwxyz0123456789";

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

function getMutableIndexes(parts: string[]): number[] {
  return parts
    .map((part, index) => ({ index, part }))
    .filter(({ part }) => /\S/.test(part))
    .map(({ index }) => index);
}

function pickScrambledIndexes(
  indexes: number[],
  progress: number,
  intensity: number,
): Set<number> {
  const wave = Math.sin(progress * Math.PI);
  const count = Math.max(1, Math.ceil(indexes.length * intensity * wave));
  const shuffled = indexes
    .map((index) => ({ index, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .slice(0, count)
    .map(({ index }) => index);

  return new Set(shuffled);
}

function randomChar(alphabet: string): string {
  return alphabet[Math.floor(Math.random() * alphabet.length)] ?? "";
}

export function SoftScrambleText<TElement extends MotionElement = "span">({
  as,
  text,
  alphabet = defaultSoftAlphabet,
  duration = 900,
  delay = 0,
  tick = 70,
  intensity = 0.18,
  loop = true,
  loopDelay = 1500,
  className,
  itemClassName,
  style,
  ...props
}: SoftScrambleTextProps<TElement>): React.ReactElement {
  const Component = as ?? "span";
  const baseParts = useMemo(() => splitGraphemes(text), [text]);
  const mutableIndexes = useMemo(() => getMutableIndexes(baseParts), [baseParts]);
  const [displayParts, setDisplayParts] = useState(baseParts);
  const [activeIndexes, setActiveIndexes] = useState<Set<number>>(() => new Set());
  const motionStyle: MotionStyle = {
    "--mtk-soft-scramble-duration": `${tick}ms`,
    ...style,
  };

  useEffect(() => {
    let timeout: number | undefined;
    let interval: number | undefined;

    function finishCycle() {
      setDisplayParts(baseParts);
      setActiveIndexes(new Set());

      if (loop) {
        timeout = window.setTimeout(runCycle, loopDelay);
      }
    }

    function runCycle() {
      const startedAt = Date.now();

      interval = window.setInterval(() => {
        const elapsed = Date.now() - startedAt;
        const progress = Math.min(elapsed / duration, 1);

        if (progress >= 1) {
          if (interval) {
            window.clearInterval(interval);
          }
          finishCycle();
          return;
        }

        const nextActiveIndexes = pickScrambledIndexes(
          mutableIndexes,
          progress,
          intensity,
        );

        setActiveIndexes(nextActiveIndexes);
        setDisplayParts(
          baseParts.map((part, index) =>
            nextActiveIndexes.has(index) ? randomChar(alphabet) : part,
          ),
        );
      }, tick);
    }

    timeout = window.setTimeout(runCycle, delay);

    return () => {
      if (interval) {
        window.clearInterval(interval);
      }
      if (timeout) {
        window.clearTimeout(timeout);
      }
    };
  }, [
    alphabet,
    baseParts,
    delay,
    duration,
    intensity,
    loop,
    loopDelay,
    mutableIndexes,
    tick,
  ]);

  return (
    <Component
      aria-label={text}
      className={["mtk-soft-scramble-text", className].filter(Boolean).join(" ")}
      style={motionStyle}
      {...props}
    >
      {displayParts.map((part, index) => (
        <span
          aria-hidden="true"
          className={["mtk-soft-scramble-text__char", itemClassName]
            .filter(Boolean)
            .join(" ")}
          data-active={activeIndexes.has(index) ? "" : undefined}
          key={index}
        >
          {part}
        </span>
      ))}
    </Component>
  );
}
