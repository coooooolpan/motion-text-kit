import type * as React from "react";
import type { BaseMotionProps, MotionElement, MotionStyle } from "./types";

type NativeProps<TElement extends MotionElement> = Omit<
  React.ComponentPropsWithoutRef<TElement>,
  keyof IridescentTextOwnProps<TElement>
>;

type IridescentTextOwnProps<TElement extends MotionElement = "span"> =
  BaseMotionProps<TElement> & {
    text: string;
    duration?: number;
    delay?: number;
    colorA?: string;
    colorB?: string;
    colorC?: string;
    glowColor?: string;
    intensity?: number;
    easing?: string;
    repeat?: boolean;
    iterationCount?: number | "infinite";
  };

export type IridescentTextProps<TElement extends MotionElement = "span"> =
  IridescentTextOwnProps<TElement> & NativeProps<TElement>;

export function IridescentText<TElement extends MotionElement = "span">({
  as,
  text,
  duration = 3200,
  delay = 0,
  colorA = "#38bdf8",
  colorB = "#22c55e",
  colorC = "#d946ef",
  glowColor = "transparent",
  intensity = 1.42,
  easing = "linear",
  repeat = true,
  iterationCount,
  className,
  style,
  ...props
}: IridescentTextProps<TElement>): React.ReactElement {
  const Component = as ?? "span";
  const motionStyle: MotionStyle = {
    "--mtk-iridescent-delay": `${delay}ms`,
    "--mtk-iridescent-duration": `${duration}ms`,
    "--mtk-iridescent-color-a": colorA,
    "--mtk-iridescent-color-b": colorB,
    "--mtk-iridescent-color-c": colorC,
    "--mtk-iridescent-glow": glowColor,
    "--mtk-iridescent-intensity": intensity,
    "--mtk-iridescent-ease": easing,
    "--mtk-iridescent-iteration-count": repeat
      ? "infinite"
      : (iterationCount ?? 1),
    ...style,
  };

  return (
    <Component
      aria-label={text}
      className={["mtk-iridescent-text", className].filter(Boolean).join(" ")}
      data-text={text}
      style={motionStyle}
      {...props}
    >
      {text}
    </Component>
  );
}
