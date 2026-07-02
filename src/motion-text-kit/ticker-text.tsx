import { useEffect, useRef } from "react";
import type * as React from "react";
import type { BaseMotionProps, MotionStyle } from "./types";

type TickerTextOwnProps = BaseMotionProps<"span"> & {
  text: string;
  duration?: number;
  delay?: number;
  blur?: number;
  stagger?: number;
  repeat?: boolean;
  iterationCount?: number | "infinite";
  itemClassName?: string;
};

export type TickerTextProps = TickerTextOwnProps &
  Omit<React.ComponentPropsWithoutRef<"span">, keyof TickerTextOwnProps>;

function splitGraphemes(text: string): string[] {
  const segmenter =
    typeof Intl !== "undefined" && "Segmenter" in Intl
      ? new (Intl as typeof Intl & {
          Segmenter: new (
            locale?: string,
            options?: { granularity: "grapheme" },
          ) => { segment: (input: string) => Iterable<{ segment: string }> };
        }).Segmenter(undefined, { granularity: "grapheme" })
      : null;

  if (!segmenter) {
    return Array.from(text);
  }

  return Array.from(segmenter.segment(text), ({ segment }) => segment);
}

export function TickerText({
  text,
  duration = 3600,
  delay = 0,
  blur = 6,
  stagger = 42,
  repeat = true,
  iterationCount,
  className,
  itemClassName,
  style,
  ...props
}: TickerTextProps): React.ReactElement {
  const trackRef = useRef<HTMLSpanElement | null>(null);
  const characters = splitGraphemes(text);
  const copies = [0, 1, 2, 3];
  const motionStyle: MotionStyle = {
    "--mtk-ticker-delay": `${delay}ms`,
    "--mtk-ticker-duration": `${duration}ms`,
    "--mtk-ticker-blur": `${blur}px`,
    "--mtk-ticker-stagger": `${stagger}ms`,
    "--mtk-ticker-iteration-count": repeat ? "infinite" : (iterationCount ?? 1),
    ...style,
  };

  useEffect(() => {
    const track = trackRef.current;
    const root = track?.parentElement;

    if (!root || !track) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frameId = 0;

    function updateCharacterEdges() {
      if (!root || !track) {
        return;
      }

      const rootRect = root.getBoundingClientRect();
      const rootStyles = window.getComputedStyle(root);
      const configuredFadeWidth = Number.parseFloat(
        rootStyles.getPropertyValue("--mtk-ticker-edge-fade"),
      );
      const fadeWidth = Number.isFinite(configuredFadeWidth)
        ? configuredFadeWidth
        : Math.min(rootRect.width * 0.28, 72);
      const items = track.querySelectorAll<HTMLElement>(
        ".mtk-ticker-text__item",
      );

      items.forEach((item) => {
        if (reducedMotion.matches || fadeWidth <= 0) {
          item.style.setProperty("--mtk-ticker-edge-blur", "0px");
          item.style.setProperty("--mtk-ticker-edge-opacity", "1");
          item.style.setProperty("--mtk-ticker-edge-x", "0px");
          return;
        }

        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.left + itemRect.width / 2;
        const rootCenter = rootRect.left + rootRect.width / 2;
        const distanceToEdge = Math.min(
          itemCenter - rootRect.left,
          rootRect.right - itemCenter,
        );
        const progress = Math.max(0, Math.min(1, distanceToEdge / fadeWidth));
        const easedProgress = 1 - (1 - progress) ** 2;
        const edgeBlur = blur * (1 - easedProgress);
        const edgeOpacity = easedProgress;
        const edgeDirection = itemCenter < rootCenter ? 1 : -1;
        const edgeX = edgeDirection * 12 * (1 - easedProgress);

        item.style.setProperty(
          "--mtk-ticker-edge-blur",
          `${edgeBlur.toFixed(2)}px`,
        );
        item.style.setProperty(
          "--mtk-ticker-edge-opacity",
          edgeOpacity.toFixed(3),
        );
        item.style.setProperty(
          "--mtk-ticker-edge-x",
          `${edgeX.toFixed(2)}px`,
        );
      });

      frameId = window.requestAnimationFrame(updateCharacterEdges);
    }

    frameId = window.requestAnimationFrame(updateCharacterEdges);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [blur, text]);

  return (
    <span
      aria-label={text}
      className={["mtk-ticker-text", className].filter(Boolean).join(" ")}
      style={motionStyle}
      {...props}
    >
      <span
        aria-hidden="true"
        className="mtk-ticker-text__track"
        ref={trackRef}
      >
        {copies.map((copyIndex) => (
          <span className="mtk-ticker-text__segment" key={copyIndex}>
            {characters.map((char, index) => (
              <span
                className={["mtk-ticker-text__item", itemClassName]
                  .filter(Boolean)
                  .join(" ")}
                key={`${copyIndex}-${char}-${index}`}
                style={{ "--mtk-index": index } as MotionStyle}
              >
                {char}
              </span>
            ))}
            <span aria-hidden="true" className="mtk-ticker-text__gap">
              {" "}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}
