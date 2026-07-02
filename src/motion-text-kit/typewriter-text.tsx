"use client";

import type * as React from "react";
import { useEffect, useRef, useState } from "react";
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

type TypewriterPhase = "typing" | "deleting" | "idle";

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
  const [exitCount, setExitCount] = useState(0);
  const [phase, setPhase] = useState<TypewriterPhase>("idle");
  const previousCountRef = useRef(0);
  const exitTimerRef = useRef<number | null>(null);
  const characters = Array.from(text);
  const characterCount = characters.length;
  const renderedCount = Math.max(visibleCount, exitCount);
  const renderedPhase = exitCount > visibleCount ? "deleting" : phase;
  const motionStyle: MotionStyle = {
    "--mtk-typewriter-speed": `${speed}ms`,
    ...style,
  };

  useEffect(() => {
    const previousCount = previousCountRef.current;

    if (visibleCount < previousCount) {
      setExitCount((current) => Math.max(current, previousCount));

      if (exitTimerRef.current !== null) {
        window.clearTimeout(exitTimerRef.current);
      }

      exitTimerRef.current = window.setTimeout(() => {
        setExitCount(visibleCount);
        exitTimerRef.current = null;
      }, 260);
    } else {
      if (exitTimerRef.current !== null) {
        window.clearTimeout(exitTimerRef.current);
        exitTimerRef.current = null;
      }

      setExitCount(visibleCount);
    }

    previousCountRef.current = visibleCount;
  }, [visibleCount]);

  useEffect(() => {
    let timeout: number | undefined;
    let cancelled = false;

    function writeNext(index: number) {
      if (cancelled) {
        return;
      }

      setPhase("typing");
      setVisibleCount(index);

      if (index < characterCount) {
        timeout = window.setTimeout(() => writeNext(index + 1), speed);
        return;
      }

      if (!loop) {
        setPhase("idle");
        return;
      }

      setPhase("idle");
      timeout = window.setTimeout(() => eraseNext(characterCount - 1), loopDelay);
    }

    function eraseNext(index: number) {
      if (cancelled) {
        return;
      }

      setPhase("deleting");
      setVisibleCount(index);

      if (index > 0) {
        timeout = window.setTimeout(() => eraseNext(index - 1), deleteSpeed);
        return;
      }

      setPhase("idle");
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
  }, [characterCount, deleteSpeed, loop, loopDelay, speed, startDelay]);

  useEffect(() => {
    return () => {
      if (exitTimerRef.current !== null) {
        window.clearTimeout(exitTimerRef.current);
      }
    };
  }, []);

  return (
    <span
      aria-label={text}
      className={["mtk-typewriter-text", className].filter(Boolean).join(" ")}
      data-phase={renderedPhase}
      style={motionStyle}
      {...props}
    >
      <span aria-hidden="true" className="mtk-typewriter-text__letters">
        {characters.slice(0, renderedCount).map((character, index) => {
          const isDeleting = exitCount > visibleCount;
          const state =
            index >= visibleCount
              ? "leaving"
              : !isDeleting && index === visibleCount - 1
                ? "entering"
                : "settled";
          const distanceFromCursor =
            index >= visibleCount
              ? index - visibleCount
              : Math.max(0, visibleCount - 1 - index);
          const nearCursor =
            distanceFromCursor < 3 ? String(distanceFromCursor) : undefined;

          return (
            <span
              className="mtk-typewriter-text__letter"
              data-near={nearCursor}
              data-state={state}
              key={`${character}-${index}`}
            >
              {character}
            </span>
          );
        })}
      </span>
      <span aria-hidden="true" className="mtk-typewriter-text__cursor">
        {cursor}
      </span>
    </span>
  );
}
