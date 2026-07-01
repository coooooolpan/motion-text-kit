import type * as React from "react";
import type { BaseMotionProps, MotionStyle } from "./types";

type WeightSweepTextOwnProps = BaseMotionProps<"span"> & {
  text: string;
  minWeight?: number;
  maxWeight?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  easing?: string;
};

export type WeightSweepTextProps = WeightSweepTextOwnProps &
  Omit<React.ComponentPropsWithoutRef<"span">, keyof WeightSweepTextOwnProps>;

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

export function WeightSweepText({
  text,
  minWeight = 300,
  maxWeight = 800,
  duration = 2600,
  delay = 0,
  stagger = 56,
  easing = "cubic-bezier(.45, 0, .15, 1)",
  className,
  style,
  ...props
}: WeightSweepTextProps): React.ReactElement {
  const characters = splitGraphemes(text);
  const middleWeight = Math.round((minWeight + maxWeight) / 2);
  const motionStyle: MotionStyle = {
    "--mtk-weight-duration": `${duration}ms`,
    "--mtk-weight-delay": `${delay}ms`,
    "--mtk-weight-stagger": `${stagger}ms`,
    "--mtk-weight-min": minWeight,
    "--mtk-weight-mid": middleWeight,
    "--mtk-weight-max": maxWeight,
    "--mtk-weight-ease": easing,
    ...style,
  };

  return (
    <span
      aria-label={text}
      className={["mtk-weight-sweep", className].filter(Boolean).join(" ")}
      style={motionStyle}
      {...props}
    >
      {characters.map((char, index) => (
        <span
          aria-hidden="true"
          className="mtk-weight-sweep__cell"
          data-char={char}
          key={`${char}-${index}`}
          style={{ "--mtk-index": index } as MotionStyle}
        >
          <span className="mtk-weight-sweep__item">{char}</span>
        </span>
      ))}
    </span>
  );
}
