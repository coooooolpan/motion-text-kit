"use client";

import type * as React from "react";
import { useEffect, useState } from "react";
import type { BaseMotionProps, MotionStyle } from "./types";

type DecryptTextOwnProps = BaseMotionProps<"span"> & {
  text: string;
  alphabet?: string;
  duration?: number;
  tick?: number;
  loop?: boolean;
  loopDelay?: number;
};

export type DecryptTextProps = DecryptTextOwnProps &
  Omit<React.ComponentPropsWithoutRef<"span">, keyof DecryptTextOwnProps>;

const defaultAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function scramble(text: string, revealedCount: number, alphabet: string): string {
  return Array.from(text, (char, index) => {
    if (char === " " || index < revealedCount) {
      return char;
    }

    return alphabet[Math.floor(Math.random() * alphabet.length)] ?? char;
  }).join("");
}

export function DecryptText({
  text,
  alphabet = defaultAlphabet,
  duration = 1400,
  tick = 46,
  loop = true,
  loopDelay = 1100,
  className,
  style,
  ...props
}: DecryptTextProps): React.ReactElement {
  const [displayText, setDisplayText] = useState(text);
  const motionStyle: MotionStyle = {
    "--mtk-decrypt-duration": `${duration}ms`,
    ...style,
  };

  useEffect(() => {
    let timeout: number | undefined;
    let interval: number | undefined;

    function runCycle() {
      const startedAt = Date.now();

      interval = window.setInterval(() => {
        const elapsed = Date.now() - startedAt;
        const progress = Math.min(elapsed / duration, 1);
        const revealedCount = Math.floor(progress * text.length);

        setDisplayText(scramble(text, revealedCount, alphabet));

        if (progress >= 1) {
          window.clearInterval(interval);
          setDisplayText(text);

          if (loop) {
            timeout = window.setTimeout(runCycle, loopDelay);
          }
        }
      }, tick);
    }

    runCycle();

    return () => {
      if (interval) {
        window.clearInterval(interval);
      }
      if (timeout) {
        window.clearTimeout(timeout);
      }
    };
  }, [alphabet, duration, loop, loopDelay, text, tick]);

  return (
    <span
      aria-label={text}
      className={["mtk-decrypt-text", className].filter(Boolean).join(" ")}
      style={motionStyle}
      {...props}
    >
      <span aria-hidden="true">{displayText}</span>
    </span>
  );
}
