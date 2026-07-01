import type * as React from "react";
import type { BaseMotionProps, MotionElement, MotionStyle } from "./types";

type NativeProps<TElement extends MotionElement> = Omit<
  React.ComponentPropsWithoutRef<TElement>,
  keyof PixelResolveTextOwnProps<TElement>
>;

type PixelResolveTextOwnProps<TElement extends MotionElement = "span"> =
  BaseMotionProps<TElement> & {
    text: string;
    duration?: number;
    delay?: number;
    stagger?: number;
    pixelSize?: number;
    repeat?: boolean;
    iterationCount?: number | "infinite";
    itemClassName?: string;
  };

export type PixelResolveTextProps<TElement extends MotionElement = "span"> =
  PixelResolveTextOwnProps<TElement> & NativeProps<TElement>;

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

export function PixelResolveText<TElement extends MotionElement = "span">({
  as,
  text,
  duration = 1100,
  delay = 0,
  stagger = 32,
  pixelSize = 4,
  repeat = true,
  iterationCount,
  className,
  itemClassName,
  style,
  ...props
}: PixelResolveTextProps<TElement>): React.ReactElement {
  const Component = as ?? "span";
  const parts = splitGraphemes(text);
  const motionStyle: MotionStyle = {
    "--mtk-pixel-delay": `${delay}ms`,
    "--mtk-pixel-duration": `${duration}ms`,
    "--mtk-pixel-cycle": `${duration + parts.length * stagger + 1200}ms`,
    "--mtk-pixel-stagger": `${stagger}ms`,
    "--mtk-pixel-size": `${pixelSize}px`,
    "--mtk-pixel-iteration-count": repeat ? "infinite" : (iterationCount ?? 1),
    ...style,
  };

  return (
    <Component
      aria-label={text}
      className={["mtk-pixel-resolve-text", className].filter(Boolean).join(" ")}
      style={motionStyle}
      {...props}
    >
      {parts.map((part, index) => (
        <span
          aria-hidden="true"
          className={["mtk-pixel-resolve-text__item", itemClassName]
            .filter(Boolean)
            .join(" ")}
          data-char={part}
          key={`${part}-${index}`}
          style={{ "--mtk-index": index } as MotionStyle}
        >
          {part}
        </span>
      ))}
    </Component>
  );
}
