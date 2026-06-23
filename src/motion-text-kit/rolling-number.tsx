import type * as React from "react";
import type { BaseMotionProps, MotionElement, MotionStyle } from "./types";

type NativeProps<TElement extends MotionElement> = Omit<
  React.ComponentPropsWithoutRef<TElement>,
  keyof RollingNumberOwnProps<TElement>
>;

type RollingNumberOwnProps<TElement extends MotionElement = "span"> =
  BaseMotionProps<TElement> & {
    value: number;
    from?: number;
    locale?: string;
    formatOptions?: Intl.NumberFormatOptions;
    prefix?: string;
    suffix?: string;
    duration?: number;
    delay?: number;
    stagger?: number;
    distance?: number;
    blur?: number;
    directionX?: number;
    directionY?: number;
    easing?: string;
  };

export type RollingNumberProps<TElement extends MotionElement = "span"> =
  RollingNumberOwnProps<TElement> & NativeProps<TElement>;

function formatValue(
  value: number,
  locale?: string,
  formatOptions?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(locale, formatOptions).format(value);
}

export function RollingNumber<TElement extends MotionElement = "span">({
  as,
  value,
  from: _from = 0,
  locale,
  formatOptions,
  prefix,
  suffix,
  duration = 500,
  delay = 0,
  stagger = 70,
  distance = 8,
  blur = 2,
  directionX = 0,
  directionY = 1,
  easing = "cubic-bezier(0.34, 1.45, 0.64, 1)",
  className,
  style,
  ...props
}: RollingNumberProps<TElement>): React.ReactElement {
  const Component = as ?? "span";
  void _from;
  const target = `${prefix ?? ""}${formatValue(value, locale, formatOptions)}${
    suffix ?? ""
  }`;
  const characters = Array.from(target);
  const motionStyle: MotionStyle = {
    "--mtk-number-duration": `${duration}ms`,
    "--mtk-number-delay": `${delay}ms`,
    "--mtk-number-stagger": `${stagger}ms`,
    "--mtk-number-distance": `${distance}px`,
    "--mtk-number-blur": `${blur}px`,
    "--mtk-number-dir-x": directionX,
    "--mtk-number-dir-y": directionY,
    "--mtk-number-ease": easing,
    ...style,
  };

  return (
    <Component
      aria-label={target}
      className={["mtk-rolling-number", className].filter(Boolean).join(" ")}
      style={motionStyle}
      {...props}
    >
      {characters.map((char, index) => (
        <span
          aria-hidden="true"
          className="mtk-rolling-number__digit"
          data-stagger={index}
          key={`${char}-${index}`}
          style={{ "--mtk-index": index } as MotionStyle}
        >
          {char}
        </span>
      ))}
    </Component>
  );
}
