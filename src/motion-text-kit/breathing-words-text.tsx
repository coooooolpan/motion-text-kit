import type * as React from "react";
import type { BaseMotionProps, MotionElement, MotionStyle } from "./types";

type NativeProps<TElement extends MotionElement> = Omit<
  React.ComponentPropsWithoutRef<TElement>,
  keyof BreathingWordsTextOwnProps<TElement>
>;

type BreathingWordsTextOwnProps<TElement extends MotionElement = "span"> =
  BaseMotionProps<TElement> & {
    text: string;
    duration?: number;
    delay?: number;
    stagger?: number;
    variance?: number;
    minOpacity?: number;
    maxOpacity?: number;
    blur?: number;
    repeat?: boolean;
    iterationCount?: number | "infinite";
    easing?: string;
    itemClassName?: string;
  };

export type BreathingWordsTextProps<TElement extends MotionElement = "span"> =
  BreathingWordsTextOwnProps<TElement> & NativeProps<TElement>;

function splitWords(text: string): string[] {
  return text.match(/\S+\s*|\s+/g) ?? [];
}

function wordVariance(index: number): number {
  return [0.18, -0.12, 0.08, -0.2, 0.14, -0.06][index % 6];
}

export function BreathingWordsText<TElement extends MotionElement = "span">({
  as,
  text,
  duration = 4200,
  delay = 0,
  stagger = 180,
  variance = 900,
  minOpacity = 0.42,
  maxOpacity = 1,
  blur = 0.9,
  repeat = true,
  iterationCount,
  easing = "cubic-bezier(.45, 0, .15, 1)",
  className,
  itemClassName,
  style,
  ...props
}: BreathingWordsTextProps<TElement>): React.ReactElement {
  const Component = as ?? "span";
  const words = splitWords(text);
  const motionStyle: MotionStyle = {
    "--mtk-breathing-words-delay": `${delay}ms`,
    "--mtk-breathing-words-duration": `${duration}ms`,
    "--mtk-breathing-words-stagger": `${stagger}ms`,
    "--mtk-breathing-words-min-opacity": minOpacity,
    "--mtk-breathing-words-max-opacity": maxOpacity,
    "--mtk-breathing-words-blur": `${blur}px`,
    "--mtk-breathing-words-ease": easing,
    "--mtk-breathing-words-iteration-count": repeat
      ? "infinite"
      : (iterationCount ?? 1),
    ...style,
  };

  return (
    <Component
      aria-label={text}
      className={["mtk-breathing-words", className].filter(Boolean).join(" ")}
      style={motionStyle}
      {...props}
    >
      {words.map((word, index) => {
        const variedDuration = Math.max(
          900,
          Math.round(duration + variance * wordVariance(index)),
        );

        return (
          <span
            aria-hidden="true"
            className={["mtk-breathing-words__item", itemClassName]
              .filter(Boolean)
              .join(" ")}
            key={`${word}-${index}`}
            style={
              {
                "--mtk-index": index,
                "--mtk-word-duration": `${variedDuration}ms`,
                "--mtk-word-opacity": Math.min(
                  maxOpacity,
                  minOpacity + 0.14 + Math.abs(wordVariance(index)) * 0.8,
                ),
              } as MotionStyle
            }
          >
            {word}
          </span>
        );
      })}
    </Component>
  );
}
