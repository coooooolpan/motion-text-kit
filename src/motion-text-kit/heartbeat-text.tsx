import type * as React from "react";
import type { BaseMotionProps, MotionElement, MotionStyle } from "./types";

type NativeProps<TElement extends MotionElement> = Omit<
  React.ComponentPropsWithoutRef<TElement>,
  keyof HeartbeatTextOwnProps<TElement>
>;

type HeartbeatTextOwnProps<TElement extends MotionElement = "span"> =
  BaseMotionProps<TElement> & {
    text: string;
    duration?: number;
    delay?: number;
    scale?: number;
    settleScale?: number;
    blur?: number;
    glowColor?: string;
    easing?: string;
    repeat?: boolean;
    iterationCount?: number | "infinite";
  };

export type HeartbeatTextProps<TElement extends MotionElement = "span"> =
  HeartbeatTextOwnProps<TElement> & NativeProps<TElement>;

export function HeartbeatText<TElement extends MotionElement = "span">({
  as,
  text,
  duration = 1650,
  delay = 0,
  scale = 1.07,
  settleScale = 1.025,
  blur = 0.9,
  glowColor = "rgba(244, 63, 94, .28)",
  easing = "cubic-bezier(.2, 0, .12, 1)",
  repeat = true,
  iterationCount,
  className,
  style,
  ...props
}: HeartbeatTextProps<TElement>): React.ReactElement {
  const Component = as ?? "span";
  const motionStyle: MotionStyle = {
    "--mtk-heartbeat-delay": `${delay}ms`,
    "--mtk-heartbeat-duration": `${duration}ms`,
    "--mtk-heartbeat-scale": scale,
    "--mtk-heartbeat-settle-scale": settleScale,
    "--mtk-heartbeat-blur": `${blur}px`,
    "--mtk-heartbeat-glow": glowColor,
    "--mtk-heartbeat-ease": easing,
    "--mtk-heartbeat-iteration-count": repeat ? "infinite" : (iterationCount ?? 1),
    ...style,
  };

  return (
    <Component
      aria-label={text}
      className={["mtk-heartbeat-text", className].filter(Boolean).join(" ")}
      data-text={text}
      style={motionStyle}
      {...props}
    >
      {text}
    </Component>
  );
}
