import type * as React from "react";
import { useState } from "react";
import type { BaseMotionProps, MotionElement, MotionStyle } from "./types";

type NativeProps<TElement extends MotionElement> = Omit<
  React.ComponentPropsWithoutRef<TElement>,
  keyof NumberDeltaTextOwnProps<TElement>
>;

type NumberDeltaTextOwnProps<TElement extends MotionElement = "span"> =
  BaseMotionProps<TElement> & {
    value: number;
    locale?: string;
    formatOptions?: Intl.NumberFormatOptions;
    prefix?: string;
    suffix?: string;
    showSign?: boolean;
    duration?: number;
    blur?: number;
    distance?: number | string;
    stagger?: number;
    easing?: string;
  };

export type NumberDeltaTextProps<TElement extends MotionElement = "span"> =
  NumberDeltaTextOwnProps<TElement> & NativeProps<TElement>;

type NumberDeltaState = {
  label: string;
  previousLabel: string;
  value: number;
  version: number;
};

type NumberDeltaWheel = {
  direction: "up" | "down";
  sequence: string[];
};

function formatDeltaValue(
  value: number,
  locale?: string,
  formatOptions?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
    ...formatOptions,
  }).format(Math.abs(value));
}

function normalizeDeltaLabels(previousLabel: string, currentLabel: string) {
  const length = Math.max(previousLabel.length, currentLabel.length);

  return {
    current: Array.from(currentLabel.padStart(length, "\u00a0")),
    previous: Array.from(previousLabel.padStart(length, "\u00a0")),
  };
}

function isDigit(character: string): boolean {
  return /^\d$/.test(character);
}

function createDigitWheel(
  previousCharacter: string,
  currentCharacter: string,
): NumberDeltaWheel | null {
  if (
    previousCharacter === currentCharacter ||
    !isDigit(previousCharacter) ||
    !isDigit(currentCharacter)
  ) {
    return null;
  }

  const previousDigit = Number(previousCharacter);
  const currentDigit = Number(currentCharacter);
  const upwardSteps = (currentDigit - previousDigit + 10) % 10;
  const downwardSteps = (previousDigit - currentDigit + 10) % 10;

  if (upwardSteps <= downwardSteps) {
    return {
      direction: "up",
      sequence: Array.from({ length: upwardSteps + 1 }, (_, index) =>
        String((previousDigit + index) % 10),
      ),
    };
  }

  return {
    direction: "down",
    sequence: Array.from({ length: downwardSteps + 1 }, (_, index) =>
      String((currentDigit + index) % 10),
    ),
  };
}

export function NumberDeltaText<TElement extends MotionElement = "span">({
  as,
  value,
  locale,
  formatOptions,
  prefix,
  suffix,
  showSign = true,
  duration = 1080,
  blur = 3,
  distance = ".86em",
  stagger = 64,
  easing = "cubic-bezier(.22, 1, .36, 1)",
  className,
  style,
  ...props
}: NumberDeltaTextProps<TElement>): React.ReactElement {
  const Component = as ?? "span";
  const direction = value >= 0 ? "up" : "down";
  const sign = showSign ? (value >= 0 ? "+" : "-") : "";
  const label = `${sign}${prefix ?? ""}${formatDeltaValue(
    value,
    locale,
    formatOptions,
  )}${suffix ?? ""}`;
  const [deltaState, setDeltaState] = useState<NumberDeltaState>({
    label,
    previousLabel: label,
    value,
    version: 0,
  });

  if (deltaState.value !== value || deltaState.label !== label) {
    setDeltaState({
      label,
      previousLabel: deltaState.label,
      value,
      version: deltaState.version + 1,
    });
  }

  const labels = normalizeDeltaLabels(deltaState.previousLabel, label);
  const motionStyle: MotionStyle = {
    "--mtk-delta-duration": `${duration}ms`,
    "--mtk-delta-blur": `${blur}px`,
    "--mtk-delta-distance":
      typeof distance === "number" ? `${distance}px` : distance,
    "--mtk-delta-stagger": `${stagger}ms`,
    "--mtk-delta-ease": easing,
    ...style,
  };

  return (
    <Component
      aria-label={label}
      className={["mtk-number-delta", className].filter(Boolean).join(" ")}
      data-direction={direction}
      data-version={deltaState.version}
      style={motionStyle}
      {...props}
    >
      <span aria-hidden="true" className="mtk-number-delta__value">
        {labels.current.map((character, index) => {
          const previousCharacter = labels.previous[index] ?? "\u00a0";
          const changed = previousCharacter !== character;
          const wheel = createDigitWheel(previousCharacter, character);
          const steps = wheel ? wheel.sequence.length - 1 : 0;
          const wheelStyle = {
            "--mtk-index": index,
            "--mtk-delta-wheel-from":
              wheel?.direction === "down"
                ? `calc(var(--mtk-delta-wheel-step) * -${steps})`
                : "0em",
            "--mtk-delta-wheel-to":
              wheel?.direction === "down"
                ? "0em"
                : `calc(var(--mtk-delta-wheel-step) * -${steps})`,
          } as MotionStyle;

          return (
            <span
              className="mtk-number-delta__digit-cell"
              data-changing={changed ? "" : undefined}
              data-stagger={index}
              data-wheel={wheel ? wheel.direction : undefined}
              key={`${deltaState.version}-${index}`}
              style={wheelStyle}
            >
              {wheel ? (
                <span className="mtk-number-delta__wheel">
                  {wheel.sequence.map((wheelCharacter, wheelIndex) => (
                    <span
                      className="mtk-number-delta__wheel-item"
                      key={`${wheelCharacter}-${wheelIndex}`}
                    >
                      {wheelCharacter}
                    </span>
                  ))}
                </span>
              ) : (
                <>
                  <span className="mtk-number-delta__digit mtk-number-delta__digit--old">
                    {previousCharacter}
                  </span>
                  <span className="mtk-number-delta__digit mtk-number-delta__digit--new">
                    {character}
                  </span>
                </>
              )}
            </span>
          );
        })}
      </span>
    </Component>
  );
}
