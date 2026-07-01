import type * as React from "react";
import type { BaseMotionProps, MotionElement, MotionStyle } from "./types";

type NativeProps<TElement extends MotionElement> = Omit<
  React.ComponentPropsWithoutRef<TElement>,
  keyof FocusBlurTextOwnProps<TElement>
>;

type FocusBlurTextOwnProps<TElement extends MotionElement = "span"> =
  BaseMotionProps<TElement> & {
    text: string;
    duration?: number;
    delay?: number;
    stagger?: number;
    blur?: number;
    scale?: number;
    repeat?: boolean;
    iterationCount?: number | "infinite";
    itemClassName?: string;
  };

export type FocusBlurTextProps<TElement extends MotionElement = "span"> =
  FocusBlurTextOwnProps<TElement> & NativeProps<TElement>;

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

export function FocusBlurText<TElement extends MotionElement = "span">({
  as,
  text,
  duration = 900,
  delay = 0,
  stagger = 28,
  blur = 10,
  scale = 1.08,
  repeat = true,
  iterationCount,
  className,
  itemClassName,
  style,
  ...props
}: FocusBlurTextProps<TElement>): React.ReactElement {
  const Component = as ?? "span";
  const parts = splitGraphemes(text);
  const motionStyle: MotionStyle = {
    "--mtk-focus-delay": `${delay}ms`,
    "--mtk-focus-duration": `${duration}ms`,
    "--mtk-focus-cycle": `${duration + parts.length * stagger + 1100}ms`,
    "--mtk-focus-stagger": `${stagger}ms`,
    "--mtk-focus-blur": `${blur}px`,
    "--mtk-focus-scale": scale,
    "--mtk-focus-iteration-count": repeat ? "infinite" : (iterationCount ?? 1),
    ...style,
  };

  return (
    <Component
      aria-label={text}
      className={["mtk-focus-blur-text", className].filter(Boolean).join(" ")}
      style={motionStyle}
      {...props}
    >
      {parts.map((part, index) => (
        <span
          aria-hidden="true"
          className={["mtk-focus-blur-text__item", itemClassName]
            .filter(Boolean)
            .join(" ")}
          key={`${part}-${index}`}
          style={{ "--mtk-index": index } as MotionStyle}
        >
          {part}
        </span>
      ))}
    </Component>
  );
}
