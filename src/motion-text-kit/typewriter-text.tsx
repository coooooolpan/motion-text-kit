"use client";

import type * as React from "react";
import { useEffect, useState } from "react";
import type { BaseMotionProps, MotionStyle } from "./types";

type TypewriterTextOwnProps = BaseMotionProps<"span"> & {
  text: string;
  speed?: number;
  startDelay?: number;
  loop?: boolean;
  loopDelay?: number;
  deleteSpeed?: number;
  cursor?: string;
};

export type TypewriterTextProps = TypewriterTextOwnProps &
  Omit<React.ComponentPropsWithoutRef<"span">, keyof TypewriterTextOwnProps>;

export function TypewriterText({
  text,
  speed = 62,
  startDelay = 250,
  loop = true,
  loopDelay = 1200,
  deleteSpeed = 34,
  cursor = "|",
  className,
  style,
  ...props
}: TypewriterTextProps): React.ReactElement {
  const [visibleCount, setVisibleCount] = useState(0);
  const motionStyle: MotionStyle = {
    "--mtk-typewriter-speed": `${speed}ms`,
    ...style,
  };

  useEffect(() => {
    let timeout: number | undefined;
    let cancelled = false;

    function writeNext(index: number) {
      if (cancelled) {
        return;
      }

      setVisibleCount(index);

      if (index < text.length) {
        timeout = window.setTimeout(() => writeNext(index + 1), speed);
        return;
      }

      if (!loop) {
        return;
      }

      timeout = window.setTimeout(() => eraseNext(text.length - 1), loopDelay);
    }

    function eraseNext(index: number) {
      if (cancelled) {
        return;
      }

      setVisibleCount(index);

      if (index > 0) {
        timeout = window.setTimeout(() => eraseNext(index - 1), deleteSpeed);
        return;
      }

      timeout = window.setTimeout(() => writeNext(1), startDelay);
    }

    timeout = window.setTimeout(() => {
      setVisibleCount(0);
      timeout = window.setTimeout(() => writeNext(1), startDelay);
    }, 0);

    return () => {
      cancelled = true;

      if (timeout) {
        window.clearTimeout(timeout);
      }
    };
  }, [deleteSpeed, loop, loopDelay, speed, startDelay, text]);

  return (
    <span
      aria-label={text}
      className={["mtk-typewriter-text", className].filter(Boolean).join(" ")}
      style={motionStyle}
      {...props}
    >
      <span aria-hidden="true">{text.slice(0, visibleCount)}</span>
      <span aria-hidden="true" className="mtk-typewriter-text__cursor">
        {cursor}
      </span>
    </span>
  );
}
