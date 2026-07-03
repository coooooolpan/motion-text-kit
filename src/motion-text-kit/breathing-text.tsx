import type * as React from "react";
import type { BaseMotionProps, MotionElement, MotionStyle } from "./types";

type NativeProps<TElement extends MotionElement> = Omit<
  React.ComponentPropsWithoutRef<TElement>,
  keyof BreathingTextOwnProps<TElement>
>;

type BreathingTextOwnProps<TElement extends MotionElement = "span"> =
  BaseMotionProps<TElement> & {
    text: string;
    duration?: number;
    delay?: number;
    blur?: number;
    scale?: number;
    minOpacity?: number;
    repeat?: boolean;
    iterationCount?: number | "infinite";
    easing?: string;
  };

export type BreathingTextProps<TElement extends MotionElement = "span"> =
  BreathingTextOwnProps<TElement> & NativeProps<TElement>;

export function BreathingText<TElement extends MotionElement = "span">({
  as,
  text,
  duration = 3200,
  delay = 0,
  blur = 1.8,
  scale = 1.022,
  minOpacity = 0.68,
  repeat = true,
  iterationCount,
  easing = "cubic-bezier(.45, 0, .15, 1)",
  className,
  style,
  ...props
}: BreathingTextProps<TElement>): React.ReactElement {
  const Component = as ?? "span";
  const motionStyle: MotionStyle = {
    "--mtk-breathing-delay": `${delay}ms`,
    "--mtk-breathing-duration": `${duration}ms`,
    "--mtk-breathing-blur": `${blur}px`,
    "--mtk-breathing-scale": scale,
    "--mtk-breathing-opacity": minOpacity,
    "--mtk-breathing-ease": easing,
    "--mtk-breathing-iteration-count": repeat
      ? "infinite"
      : (iterationCount ?? 1),
    ...style,
  };

  return (
    <Component
      aria-label={text}
      className={["mtk-breathing-text", className].filter(Boolean).join(" ")}
      style={motionStyle}
      {...props}
    >
      {text}
    </Component>
  );
}
