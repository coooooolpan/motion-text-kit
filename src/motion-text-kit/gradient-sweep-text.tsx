import type * as React from "react";
import type { BaseMotionProps, MotionElement, MotionStyle } from "./types";

type NativeProps<TElement extends MotionElement> = Omit<
  React.ComponentPropsWithoutRef<TElement>,
  keyof GradientSweepTextOwnProps<TElement>
>;

type GradientSweepTextOwnProps<TElement extends MotionElement = "span"> =
  BaseMotionProps<TElement> & {
    children: React.ReactNode;
    duration?: number;
    delay?: number;
    angle?: number;
    baseColor?: string;
    highlightColor?: string;
    accentColor?: string;
    easing?: string;
    pauseOnHover?: boolean;
  };

export type GradientSweepTextProps<TElement extends MotionElement = "span"> =
  GradientSweepTextOwnProps<TElement> & NativeProps<TElement>;

export function GradientSweepText<TElement extends MotionElement = "span">({
  as,
  children,
  duration = 3600,
  delay = 0,
  angle = 110,
  baseColor = "currentColor",
  highlightColor = "rgba(255,255,255,.98)",
  accentColor = "rgba(255,255,255,.72)",
  easing = "linear",
  pauseOnHover = false,
  className,
  style,
  ...props
}: GradientSweepTextProps<TElement>): React.ReactElement {
  const Component = as ?? "span";
  const motionStyle: MotionStyle = {
    "--mtk-sweep-duration": `${duration}ms`,
    "--mtk-sweep-delay": `${delay}ms`,
    "--mtk-sweep-angle": `${angle}deg`,
    "--mtk-sweep-base": baseColor,
    "--mtk-sweep-highlight": highlightColor,
    "--mtk-sweep-accent": accentColor,
    "--mtk-sweep-ease": easing,
    ...style,
  };

  return (
    <Component
      className={[
        "mtk-gradient-sweep",
        pauseOnHover && "mtk-gradient-sweep--pause-on-hover",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={motionStyle}
      {...props}
    >
      {children}
    </Component>
  );
}
