# motion-text-kit

[中文](#中文) | [English](#english)

## 中文

`motion-text-kit` 是一个轻量的 React 文本动效组件库，将常见文本动画沉淀为可配置、可复用的 CSS 动效组件。

组件本身不依赖 Next.js，也不依赖运行时动画库。你可以在 Next.js、Vite、Remix、Storybook 或任意 React 项目中使用。

### 核心组件

- `TextReveal`：逐字或逐词出现、消失、循环出现消失动效。
- `GradientSweepText`：类似 iOS “滑动解锁”的平滑文字高光扫光动效。
- `RollingNumber`：数字字符弹入动效，支持模糊、错峰、方向和格式化配置。

### 安装

```bash
npm i motion-text-kit
```

在应用入口处引入一次样式：

```tsx
import "motion-text-kit/styles.css";
```

### 快速使用

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

### 点击重播数字动效

`RollingNumber` 会在组件渲染时播放 digit pop-in 动画。需要点击按钮重播时，可以切换数值并通过 `key` 重新挂载组件。

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

### API

#### `TextReveal`

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

主要参数：

- `splitBy`：`"character"` 或 `"word"`。
- `mode`：`"in"`、`"out"` 或 `"in-out"`。
- `repeat`：设为 `true` 后循环播放。
- `iterationCount`：未使用 `repeat` 时，可自定义 CSS 动画循环次数。

#### `GradientSweepText`

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

扫光动效使用连续的 no-repeat masked gradient，减少循环时的跳动感。

#### `RollingNumber`

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

默认数字动效参考 Transitions.dev 的 number pop-in：每个字符按顺序位移、淡入并移除模糊，配合带弹性的 easing。

### 本地开发

仓库内包含一个 Next.js demo 站点，页面组件使用 coss UI。可复用 npm 包源码位于 `src/motion-text-kit`。

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
```

包产物由 `tsup` 输出到 `dist`，并已在 git 中忽略。

### License

MIT

---

## English

`motion-text-kit` is a lightweight React text motion library that turns common text animations into configurable, reusable CSS-powered components.

The components do not depend on Next.js or a runtime animation library. Use them in Next.js, Vite, Remix, Storybook, or any React app.

### Core Components

- `TextReveal`: staggered character or word reveal, exit, or looping in-out motion.
- `GradientSweepText`: smooth masked highlight sweep, similar to the classic iOS slide-to-unlock shimmer.
- `RollingNumber`: digit pop-in number animation with blur, stagger, direction, and formatting options.

### Install

```bash
npm i motion-text-kit
```

Import the CSS once near your app root:

```tsx
import "motion-text-kit/styles.css";
```

### Quick Usage

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

### Replay Number Motion

`RollingNumber` runs its digit pop-in animation when the component renders. To replay it on click, change the value and remount the component with a `key`.

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

### API

#### `TextReveal`

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

#### `GradientSweepText`

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

The sweep uses a continuous no-repeat masked gradient to reduce visible loop jumps.

#### `RollingNumber`

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

The default number effect is based on Transitions.dev's number pop-in pattern: each character translates in, fades from zero opacity, and removes blur with a spring-like easing curve.

### Development

This repository includes a Next.js demo site that uses coss UI for the page surface. The reusable package source lives in `src/motion-text-kit`.

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
```

Package output is generated into `dist` by `tsup` and is ignored by git.

### License

MIT
