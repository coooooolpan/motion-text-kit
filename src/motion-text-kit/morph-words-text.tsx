"use client";

import type * as React from "react";
import { useEffect, useState } from "react";
import type { BaseMotionProps, MotionElement, MotionStyle } from "./types";

type NativeProps<TElement extends MotionElement> = Omit<
  React.ComponentPropsWithoutRef<TElement>,
  keyof MorphWordsTextOwnProps<TElement>
>;

type MorphWordsTextOwnProps<TElement extends MotionElement = "span"> =
  BaseMotionProps<TElement> & {
    words: string[];
    duration?: number;
    delay?: number;
    blur?: number;
    scale?: number;
    easing?: string;
    repeat?: boolean;
    iterationCount?: number | "infinite";
    itemClassName?: string;
  };

export type MorphWordsTextProps<TElement extends MotionElement = "span"> =
  MorphWordsTextOwnProps<TElement> & NativeProps<TElement>;

export function MorphWordsText<TElement extends MotionElement = "span">({
  as,
  words,
  duration = 1800,
  delay = 0,
  blur = 5,
  scale = 0.985,
  easing = "cubic-bezier(.22, 1, .36, 1)",
  repeat = true,
  iterationCount,
  className,
  itemClassName,
  style,
  ...props
}: MorphWordsTextProps<TElement>): React.ReactElement {
  const Component = as ?? "span";
  const normalizedWords = words.length > 0 ? words : [""];
  const label = normalizedWords.join(", ");
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [cycles, setCycles] = useState(0);
  const longestWord = normalizedWords.reduce(
    (longest, word) => (word.length > longest.length ? word : longest),
    "",
  );
  const shouldAnimate =
    normalizedWords.length > 1 &&
    (repeat ||
      iterationCount === "infinite" ||
      cycles < Number(iterationCount ?? 1));
  const visibleActiveIndex = activeIndex % normalizedWords.length;
  const visiblePreviousIndex =
    previousIndex === null ? null : previousIndex % normalizedWords.length;

  useEffect(() => {
    if (!shouldAnimate) {
      return;
    }

    const timer = window.setTimeout(() => {
      setActiveIndex((current) => {
        const next = (current + 1) % normalizedWords.length;

        setPreviousIndex(current);

        if (next === 0) {
          setCycles((currentCycles) => currentCycles + 1);
        }

        return next;
      });
    }, duration + delay);

    return () => window.clearTimeout(timer);
  }, [activeIndex, delay, duration, normalizedWords.length, shouldAnimate]);

  const motionStyle: MotionStyle = {
    "--mtk-morph-delay": `${delay}ms`,
    "--mtk-morph-duration": `${duration}ms`,
    "--mtk-morph-blur": `${blur}px`,
    "--mtk-morph-scale": scale,
    "--mtk-morph-ease": easing,
    ...style,
  };

  return (
    <Component
      aria-label={label}
      className={["mtk-morph-words-text", className]
        .filter(Boolean)
        .join(" ")}
      style={motionStyle}
      {...props}
    >
      <span aria-hidden="true" className="mtk-morph-words-text__sizer">
        {longestWord}
      </span>
      {normalizedWords.map((word, index) => (
        <span
          aria-hidden="true"
          className={["mtk-morph-words-text__item", itemClassName]
            .filter(Boolean)
            .join(" ")}
          data-state={
            index === visibleActiveIndex
              ? "active"
              : index === visiblePreviousIndex
                ? "previous"
                : "idle"
          }
          key={`${word}-${index}`}
          style={{ "--mtk-index": index } as MotionStyle}
        >
          {word}
        </span>
      ))}
    </Component>
  );
}
