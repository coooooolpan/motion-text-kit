import type * as React from "react";

export type MotionElement = React.ElementType;

export type MotionStyle = React.CSSProperties & Record<`--${string}`, string | number>;

export type BaseMotionProps<TElement extends MotionElement = "span"> = {
  as?: TElement;
  className?: string;
  style?: React.CSSProperties;
};

export type TextRevealSplit = "character" | "word";
