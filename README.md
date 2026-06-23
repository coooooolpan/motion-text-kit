# motion-text-kit

Reusable React text motion components powered by CSS animations.

`motion-text-kit` collects common text animation patterns into a small,
framework-neutral package. The components are written as React wrappers around
CSS motion primitives, so they can be used in Next.js, Vite, Remix, Storybook,
or any React app without depending on a runtime animation library.

## Components

- `TextReveal` - staggered character or word reveal, exit, or looping in-out motion.
- `GradientSweepText` - smooth masked highlight sweep, similar to the classic iOS slide-to-unlock shimmer.
- `RollingNumber` - digit pop-in number animation with blur, stagger, and configurable direction.

## Install

```bash
npm i motion-text-kit
```

Import the CSS once near your app root:

```tsx
import "motion-text-kit/styles.css";
```

## Usage

```tsx
import {
  GradientSweepText,
  RollingNumber,
  TextReveal,
} from "motion-text-kit";
import "motion-text-kit/styles.css";

export function Example() {
  return (
    <section>
      <TextReveal
        as="h1"
        mode="in-out"
        repeat
        splitBy="word"
        text="Every word enters and leaves with rhythm."
      />

      <GradientSweepText baseColor="#8a8a8a">
        slide to unlock
      </GradientSweepText>

      <RollingNumber value={9864} prefix="$" />
    </section>
  );
}
```

## Replay Number Motion

`RollingNumber` runs its digit pop-in animation when the component renders.
To replay it on click, change the value and remount the component with a key.

```tsx
import { useState } from "react";
import { RollingNumber } from "motion-text-kit";

const values = [9864, 12480, 7352, 16024];

export function CounterDemo() {
  const [index, setIndex] = useState(0);
  const value = values[index];

  return (
    <div>
      <RollingNumber key={value} value={value} prefix="$" />
      <button onClick={() => setIndex((current) => (current + 1) % values.length)}>
        Animate
      </button>
    </div>
  );
}
```

## API

### `TextReveal`

```tsx
<TextReveal
  text="Motion-ready product copy"
  splitBy="character"
  mode="in"
  delay={0}
  duration={620}
  hold={900}
  stagger={26}
  distance={16}
  blur={8}
  easing="cubic-bezier(.16, 1, .3, 1)"
  repeat={false}
/>
```

Key props:

- `splitBy`: `"character"` or `"word"`.
- `mode`: `"in"`, `"out"`, or `"in-out"`.
- `repeat`: loops the animation when `true`.
- `iterationCount`: custom CSS iteration count when `repeat` is not used.

### `GradientSweepText`

```tsx
<GradientSweepText
  duration={3600}
  angle={110}
  baseColor="currentColor"
  highlightColor="rgba(255,255,255,.98)"
  accentColor="rgba(255,255,255,.72)"
  easing="linear"
>
  slide to unlock
</GradientSweepText>
```

The sweep is continuous and uses a no-repeat masked gradient to avoid visible
loop jumps.

### `RollingNumber`

```tsx
<RollingNumber
  value={128000}
  prefix="$"
  locale="en-US"
  formatOptions={{ maximumFractionDigits: 0 }}
  duration={500}
  stagger={70}
  distance={8}
  blur={2}
  directionX={0}
  directionY={1}
/>
```

The default number effect is based on Transitions.dev's number pop-in pattern:
each character translates in, fades from zero opacity, and removes blur with a
spring-like easing curve.

## Development

This repository includes a Next.js demo site that uses coss UI for the page
surface. The reusable package source lives in `src/motion-text-kit`.

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
```

Package output is generated into `dist` by `tsup` and is ignored by git.

## License

MIT
