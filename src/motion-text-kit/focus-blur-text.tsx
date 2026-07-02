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

export function FocusBlurText<TElement extends MotionElement = "span">({
  as,
  text,
  duration = 900,
  delay = 0,
  stagger: _stagger = 28,
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
  void _stagger;
  const motionStyle: MotionStyle = {
    "--mtk-focus-delay": `${delay}ms`,
    "--mtk-focus-duration": `${duration}ms`,
    "--mtk-focus-cycle": `${duration + 1300}ms`,
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
      <span
        aria-hidden="true"
        className={["mtk-focus-blur-text__item", itemClassName]
          .filter(Boolean)
          .join(" ")}
      >
        {text}
      </span>
    </Component>
  );
}
