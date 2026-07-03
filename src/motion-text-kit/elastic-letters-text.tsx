import type * as React from "react";
import type { BaseMotionProps, MotionElement, MotionStyle } from "./types";

type NativeProps<TElement extends MotionElement> = Omit<
  React.ComponentPropsWithoutRef<TElement>,
  keyof ElasticLettersTextOwnProps<TElement>
>;

type ElasticLettersTextOwnProps<TElement extends MotionElement = "span"> =
  BaseMotionProps<TElement> & {
    text: string;
    duration?: number;
    delay?: number;
    stagger?: number;
    stretch?: number;
    blur?: number;
    repeat?: boolean;
    iterationCount?: number | "infinite";
    itemClassName?: string;
  };

export type ElasticLettersTextProps<TElement extends MotionElement = "span"> =
  ElasticLettersTextOwnProps<TElement> & NativeProps<TElement>;

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

export function ElasticLettersText<TElement extends MotionElement = "span">({
  as,
  text,
  duration = 760,
  delay = 0,
  stagger = 32,
  stretch = 1.22,
  blur = 2.4,
  repeat = true,
  iterationCount,
  className,
  itemClassName,
  style,
  ...props
}: ElasticLettersTextProps<TElement>): React.ReactElement {
  const Component = as ?? "span";
  const characters = splitGraphemes(text);
  const cycle = duration + stagger * Math.max(characters.length - 1, 0) + 1450;
  const motionStyle: MotionStyle = {
    "--mtk-elastic-delay": `${delay}ms`,
    "--mtk-elastic-duration": `${duration}ms`,
    "--mtk-elastic-cycle": `${cycle}ms`,
    "--mtk-elastic-stagger": `${stagger}ms`,
    "--mtk-elastic-stretch": stretch,
    "--mtk-elastic-blur": `${blur}px`,
    "--mtk-elastic-iteration-count": repeat ? "infinite" : (iterationCount ?? 1),
    ...style,
  };

  return (
    <Component
      aria-label={text}
      className={["mtk-elastic-letters", className].filter(Boolean).join(" ")}
      style={motionStyle}
      {...props}
    >
      {characters.map((character, index) => (
        <span
          aria-hidden="true"
          className={["mtk-elastic-letters__item", itemClassName]
            .filter(Boolean)
            .join(" ")}
          key={`${character}-${index}`}
          style={{ "--mtk-index": index } as MotionStyle}
        >
          {character}
        </span>
      ))}
    </Component>
  );
}
