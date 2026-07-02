import type * as React from "react";
import { useId } from "react";
import type { BaseMotionProps, MotionElement, MotionStyle } from "./types";

type NativeProps<TElement extends MotionElement> = Omit<
  React.ComponentPropsWithoutRef<TElement>,
  keyof LiquidTextOwnProps<TElement>
>;

type LiquidTextOwnProps<TElement extends MotionElement = "span"> =
  BaseMotionProps<TElement> & {
    text: string;
    duration?: number;
    delay?: number;
    stagger?: number;
    distance?: number;
    blur?: number;
    repeat?: boolean;
    iterationCount?: number | "infinite";
    itemClassName?: string;
  };

export type LiquidTextProps<TElement extends MotionElement = "span"> =
  LiquidTextOwnProps<TElement> & NativeProps<TElement>;

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

export function LiquidText<TElement extends MotionElement = "span">({
  as,
  text,
  duration = 1800,
  delay = 0,
  stagger = 34,
  distance = 18,
  blur = 7,
  repeat = true,
  iterationCount,
  className,
  itemClassName,
  style,
  ...props
}: LiquidTextProps<TElement>): React.ReactElement {
  const Component = as ?? "span";
  const filterId = `mtk-liquid-${useId().replaceAll(":", "")}`;
  const characters = splitGraphemes(text);
  const center = (characters.length - 1) / 2;
  const motionStyle: MotionStyle = {
    "--mtk-liquid-delay": `${delay}ms`,
    "--mtk-liquid-duration": `${duration}ms`,
    "--mtk-liquid-cycle": `${duration + characters.length * stagger + 900}ms`,
    "--mtk-liquid-stagger": `${stagger}ms`,
    "--mtk-liquid-distance": `${distance}px`,
    "--mtk-liquid-blur": `${blur}px`,
    "--mtk-liquid-filter": `url(#${filterId})`,
    "--mtk-liquid-iteration-count": repeat ? "infinite" : (iterationCount ?? 1),
    ...style,
  };

  return (
    <Component
      aria-label={text}
      className={["mtk-liquid-text", className].filter(Boolean).join(" ")}
      style={motionStyle}
      {...props}
    >
      <svg aria-hidden="true" className="mtk-liquid-text__filter">
        <filter id={filterId}>
          <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="2.8" />
          <feColorMatrix
            in="blur"
            result="goo"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </svg>
      {characters.map((char, index) => {
        const shift = (index - center) * distance * 0.42;
        const yShift = (index % 2 === 0 ? -1 : 1) * distance * 0.38;

        return (
          <span
            aria-hidden="true"
            className={["mtk-liquid-text__item", itemClassName]
              .filter(Boolean)
              .join(" ")}
            key={`${char}-${index}`}
            style={
              {
                "--mtk-index": index,
                "--mtk-liquid-x": `${shift.toFixed(2)}px`,
                "--mtk-liquid-y": `${yShift.toFixed(2)}px`,
              } as MotionStyle
            }
          >
            {char}
          </span>
        );
      })}
    </Component>
  );
}
