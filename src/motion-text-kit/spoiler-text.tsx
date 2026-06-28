"use client";

import type * as React from "react";
import { useState } from "react";
import type { BaseMotionProps, MotionStyle } from "./types";

type SpoilerTextOwnProps = BaseMotionProps<"span"> & {
  text: string;
  defaultRevealed?: boolean;
  particleColor?: string;
  duration?: number;
};

export type SpoilerTextProps = SpoilerTextOwnProps &
  Omit<
    React.ComponentPropsWithoutRef<"span">,
    keyof SpoilerTextOwnProps | "children" | "onClick" | "onKeyDown"
  >;

export function SpoilerText({
  text,
  defaultRevealed = false,
  particleColor = "currentColor",
  duration = 360,
  className,
  style,
  ...props
}: SpoilerTextProps): React.ReactElement {
  const [isRevealed, setIsRevealed] = useState(defaultRevealed);
  const motionStyle: MotionStyle = {
    "--mtk-spoiler-particle": particleColor,
    "--mtk-spoiler-duration": `${duration}ms`,
    ...style,
  };

  function reveal() {
    setIsRevealed(true);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLSpanElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      reveal();
    }
  }

  return (
    <span
      aria-label={text}
      aria-pressed={isRevealed}
      className={["mtk-spoiler-text", className].filter(Boolean).join(" ")}
      data-revealed={isRevealed ? "" : undefined}
      onClick={reveal}
      onKeyDown={handleKeyDown}
      role="button"
      style={motionStyle}
      tabIndex={0}
      {...props}
    >
      <span aria-hidden="true" className="mtk-spoiler-text__content">
        {text}
      </span>
      <span aria-hidden="true" className="mtk-spoiler-text__particles" />
    </span>
  );
}
