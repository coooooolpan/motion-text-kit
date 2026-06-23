import type * as React from "react";
import type {
  BaseMotionProps,
  MotionElement,
  MotionStyle,
  TextRevealSplit,
} from "./types";

type NativeProps<TElement extends MotionElement> = Omit<
  React.ComponentPropsWithoutRef<TElement>,
  keyof TextRevealOwnProps<TElement>
>;

type TextRevealOwnProps<TElement extends MotionElement = "span"> =
  BaseMotionProps<TElement> & {
    text: string;
    splitBy?: TextRevealSplit;
    mode?: "in" | "out" | "in-out";
    delay?: number;
    duration?: number;
    hold?: number;
    stagger?: number;
    distance?: number;
    blur?: number;
    easing?: string;
    repeat?: boolean;
    iterationCount?: number | "infinite";
    itemClassName?: string;
  };

export type TextRevealProps<TElement extends MotionElement = "span"> =
  TextRevealOwnProps<TElement> & NativeProps<TElement>;

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

function splitWords(text: string): string[] {
  return text.match(/\S+\s*|\s+/g) ?? [];
}

export function TextReveal<TElement extends MotionElement = "span">({
  as,
  text,
  splitBy = "character",
  mode = "in",
  delay = 0,
  duration = 620,
  hold = 900,
  stagger = splitBy === "word" ? 70 : 26,
  distance = 16,
  blur = 8,
  easing = "cubic-bezier(.16, 1, .3, 1)",
  repeat = false,
  iterationCount,
  className,
  itemClassName,
  style,
  ...props
}: TextRevealProps<TElement>): React.ReactElement {
  const Component = as ?? "span";
  const parts = splitBy === "word" ? splitWords(text) : splitGraphemes(text);
  const motionStyle: MotionStyle = {
    "--mtk-reveal-delay": `${delay}ms`,
    "--mtk-reveal-duration": `${duration}ms`,
    "--mtk-reveal-cycle-duration": `${duration * 2 + hold}ms`,
    "--mtk-reveal-stagger": `${stagger}ms`,
    "--mtk-reveal-distance": `${distance}px`,
    "--mtk-reveal-blur": `${blur}px`,
    "--mtk-reveal-ease": easing,
    "--mtk-reveal-iteration-count": repeat
      ? "infinite"
      : (iterationCount ?? 1),
    ...style,
  };

  return (
    <Component
      aria-label={text}
      className={["mtk-text-reveal", className].filter(Boolean).join(" ")}
      data-mode={mode}
      style={motionStyle}
      {...props}
    >
      {parts.map((part, index) => (
        <span
          aria-hidden="true"
          className={["mtk-text-reveal__item", itemClassName]
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
