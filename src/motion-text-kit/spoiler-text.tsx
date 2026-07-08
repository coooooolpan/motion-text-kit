"use client";

import type * as React from "react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { BaseMotionProps, MotionStyle } from "./types";

type SpoilerTextOwnProps = BaseMotionProps<"span"> & {
  text: string;
  defaultRevealed?: boolean;
  revealed?: boolean;
  onRevealedChange?: (revealed: boolean) => void;
  particleColor?: string;
  duration?: number;
  revealDuration?: number;
};

export type SpoilerTextProps = SpoilerTextOwnProps &
  Omit<
    React.ComponentPropsWithoutRef<"span">,
    | keyof SpoilerTextOwnProps
    | "children"
    | "onClick"
    | "onKeyDown"
    | "onPointerCancel"
    | "onPointerDown"
    | "onPointerEnter"
    | "onPointerLeave"
    | "onPointerMove"
    | "onPointerUp"
  >;

let hasRequestedSpoilerWorklet = false;

function supportsSpoilerPaint(): boolean {
  if (typeof window === "undefined" || typeof CSS === "undefined") {
    return false;
  }

  const userAgent = window.navigator.userAgent;
  const isWebKit =
    /AppleWebKit/i.test(userAgent) && !/Chrome|Chromium|Edg|OPR|Firefox/i.test(userAgent);

  if (isWebKit) {
    return false;
  }

  const cssWithPaint = CSS as typeof CSS & {
    paintWorklet?: { addModule: (url: string) => Promise<void> };
  };

  return Boolean(cssWithPaint.paintWorklet);
}

function loadSpoilerPaintWorklet(): boolean {
  if (!supportsSpoilerPaint()) {
    return false;
  }

  const cssWithPaint = CSS as typeof CSS & {
    paintWorklet: { addModule: (url: string) => Promise<void> };
  };

  if (!hasRequestedSpoilerWorklet) {
    hasRequestedSpoilerWorklet = true;
    cssWithPaint.paintWorklet.addModule("/spoiler-worklet.js").catch(() => {
      hasRequestedSpoilerWorklet = false;
    });
  }

  return true;
}

export function SpoilerText({
  text,
  defaultRevealed = false,
  revealed,
  onRevealedChange,
  particleColor = "currentColor",
  duration = 320,
  revealDuration = 1100,
  className,
  style,
  ...props
}: SpoilerTextProps): React.ReactElement {
  const rootRef = useRef<HTMLSpanElement | null>(null);
  const contentRef = useRef<HTMLSpanElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const tRef = useRef(2);
  const [canUsePaint, setCanUsePaint] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isWebKitFallback, setIsWebKitFallback] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [internalSpoiled, setInternalSpoiled] = useState(!defaultRevealed);
  const [isRevealing, setIsRevealing] = useState(false);
  const isSpoiled = revealed === undefined ? internalSpoiled : !revealed;

  const motionStyle: MotionStyle = {
    "--mtk-spoiler-particle": particleColor,
    "--mtk-spoiler-duration": `${duration}ms`,
    "--mtk-spoiler-reveal-duration": `${revealDuration}ms`,
    ...style,
  };

  function updateTextMetrics() {
    const root = rootRef.current;
    const content = contentRef.current;

    if (!root || !content) {
      return;
    }

    const computed = getComputedStyle(root);
    const fontSize = parseFloat(computed.fontSize) || 16;
    const lineHeight = parseFloat(computed.lineHeight) || fontSize * 1.5;
    let rows = 1;
    let rowWidths = "1";

    try {
      const range = document.createRange();
      range.selectNodeContents(content);
      const rootRect = root.getBoundingClientRect();
      const rects = Array.from(range.getClientRects());
      const rowMap = new Map<number, number>();

      for (const rect of rects) {
        if (rect.height <= 0 || rect.width <= 0) {
          continue;
        }

        const row = Math.floor((rect.top + rect.height / 2 - rootRect.top) / lineHeight);
        const right = rect.right - rootRect.left;
        rowMap.set(row, Math.max(rowMap.get(row) ?? 0, right));
      }

      const rowIndexes = Array.from(rowMap.keys()).sort((a, b) => a - b);
      rows = Math.max(1, rowIndexes.length);

      const rootWidth = rootRect.width || 1;
      rowWidths = rowIndexes
        .map((row) => Math.min(1, (rowMap.get(row) ?? rootWidth) / rootWidth).toFixed(3))
        .join(" ");
    } catch {
      rows = Math.max(1, Math.round(content.getBoundingClientRect().height / lineHeight));
    }

    root.style.setProperty("--lh", lineHeight.toFixed(2));
    root.style.setProperty("--rows", String(rows));
    root.style.setProperty("--row-widths", rowWidths || "1");
  }

  function stopAnimationLoop() {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }

  const setSpoiled = useCallback((nextSpoiled: boolean) => {
    if (revealed === undefined) {
      setInternalSpoiled(nextSpoiled);
    }

    onRevealedChange?.(!nextSpoiled);
  }, [onRevealedChange, revealed]);

  useLayoutEffect(() => {
    let cancelled = false;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const userAgent = window.navigator.userAgent;
    const isWebKit =
      /AppleWebKit/i.test(userAgent) && !/Chrome|Chromium|Edg|OPR|Firefox/i.test(userAgent);
    const enabled = !reduceMotion && loadSpoilerPaintWorklet();

    queueMicrotask(() => {
      if (cancelled) {
        return;
      }

      setCanUsePaint(enabled);
      setIsWebKitFallback(isWebKit && !reduceMotion);
      setUseFallback(!enabled && !reduceMotion);

      if (reduceMotion) {
        setInternalSpoiled(false);
      }
    });

    updateTextMetrics();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;

    if (!root || !canUsePaint) {
      return;
    }

    updateTextMetrics();
    const observer = new ResizeObserver(updateTextMetrics);
    observer.observe(root);

    return () => observer.disconnect();
  }, [canUsePaint]);

  useEffect(() => {
    const root = rootRef.current;

    if (!root || !canUsePaint) {
      return;
    }

    stopAnimationLoop();

    let lastTime = performance.now();

    if (isSpoiled) {
      tRef.current = Math.max(2, tRef.current);
      root.style.removeProperty("--t-stop");
      root.style.setProperty("--t", tRef.current.toFixed(3));

      const tick = (time: number) => {
        const delta = time - lastTime;

        if (delta >= 1000 / 30) {
          tRef.current += delta / 1000;
          lastTime = time;
          root.style.setProperty("--t", tRef.current.toFixed(3));
        }

        frameRef.current = window.requestAnimationFrame(tick);
      };

      frameRef.current = window.requestAnimationFrame(tick);
      return stopAnimationLoop;
    }

    root.style.setProperty("--t-stop", tRef.current.toFixed(3));
    const stopAt = tRef.current + revealDuration / 1000;

    const tick = (time: number) => {
      const delta = time - lastTime;

      if (delta >= 1000 / 30) {
        tRef.current += delta / 1000;
        lastTime = time;
        root.style.setProperty("--t", tRef.current.toFixed(3));
      }

      if (tRef.current < stopAt) {
        frameRef.current = window.requestAnimationFrame(tick);
      }
    };

    frameRef.current = window.requestAnimationFrame(tick);
    return stopAnimationLoop;
  }, [canUsePaint, isSpoiled, revealDuration]);

  useEffect(() => stopAnimationLoop, []);

  function setPointerPosition(event: React.PointerEvent<HTMLSpanElement>) {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    const rect = root.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    root.style.setProperty("--mx", x.toFixed(3));
    root.style.setProperty("--my", y.toFixed(3));
    root.style.setProperty("--mtk-spoiler-x", `${(x * 100).toFixed(2)}%`);
    root.style.setProperty("--mtk-spoiler-y", `${(y * 100).toFixed(2)}%`);
  }

  function reveal(event?: React.PointerEvent<HTMLSpanElement> | React.KeyboardEvent<HTMLSpanElement>) {
    if (!isSpoiled) {
      return;
    }

    const root = rootRef.current;

    if (root && event && "clientX" in event) {
      const rect = root.getBoundingClientRect();
      root.style.setProperty("--ox", ((event.clientX - rect.left) / rect.width).toFixed(3));
      root.style.setProperty("--oy", ((event.clientY - rect.top) / rect.height).toFixed(3));
    }

    setIsRevealing(true);
    setSpoiled(false);
    window.setTimeout(() => setIsRevealing(false), revealDuration);
  }

  function handlePointerDown(event: React.PointerEvent<HTMLSpanElement>) {
    if (!isSpoiled) {
      return;
    }

    setIsActive(true);
    setPointerPosition(event);
    reveal(event);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLSpanElement>) {
    if (!isSpoiled) {
      return;
    }

    setIsActive(true);
    setPointerPosition(event);
  }

  function handlePointerLeave() {
    const root = rootRef.current;
    root?.style.setProperty("--mx", "-1");
    root?.style.setProperty("--my", "-1");
    setIsActive(false);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLSpanElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      reveal(event);
    }
  }

  return (
    <span
      aria-label={text}
      aria-pressed={!isSpoiled}
      className={["mtk-spoiler-text", className].filter(Boolean).join(" ")}
      data-active={isActive ? "" : undefined}
      data-fallback={useFallback ? "" : undefined}
      data-houdini={canUsePaint ? "" : undefined}
      data-revealed={!isSpoiled ? "" : undefined}
      data-revealing={!isSpoiled && isRevealing ? "" : undefined}
      data-webkit-fallback={isWebKitFallback ? "" : undefined}
      onClick={() => {
        if (!canUsePaint) {
          reveal();
        }
      }}
      onKeyDown={handleKeyDown}
      onPointerCancel={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerLeave}
      ref={rootRef}
      role="button"
      style={motionStyle}
      tabIndex={0}
      {...props}
    >
      <span aria-hidden="true" className="mtk-spoiler-text__content" ref={contentRef}>
        {text}
      </span>
      <span aria-hidden="true" className="mtk-spoiler-text__particles">
        {text}
      </span>
    </span>
  );
}
