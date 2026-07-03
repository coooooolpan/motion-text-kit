# motion-text-kit

[中文](#中文) | [English](#english)

## 中文

`motion-text-kit` 是一个轻量的 React 文本动效组件库，将常见文本动画沉淀为可配置、可复用的 CSS 动效组件。

组件本身不依赖 Next.js，也不依赖运行时动画库。你可以在 Next.js、Vite、Remix、Storybook 或任意 React 项目中使用。

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
  BreathingText,
  GradientSweepText,
  NumberDeltaText,
  TextReveal,
} from "motion-text-kit";
import "motion-text-kit/styles.css";

export function Example() {
  return (
    <section>
      <TextReveal text="Letters enter and leave." mode="in-out" repeat />

      <GradientSweepText>Stay hungry, stay foolish.</GradientSweepText>

      <NumberDeltaText value={24} />
      <NumberDeltaText value={-18} />

      <BreathingText text="Almost there..." />
    </section>
  );
}
```

### 组件能力

| Component | 效果 | 适用场景 |
| --- | --- | --- |
| `TextReveal` | 逐字或逐词出现、消失、循环显隐 | 首屏标题、引导文案、空状态提示 |
| `GradientSweepText` | 柔和高光从文字表面滑过 | 关键词、品牌标语、AI thinking |
| `RollingNumber` | 数字字符弹入 | 时间、倒计时、统计面板 |
| `NumberDeltaText` | 正负数字按数字轮盘滚动变化 | 价格涨跌、指标变化、交易数据 |
| `SpoilerText` | 隐形墨水式按下显露 | 敏感信息、谜底揭示、交互提示 |
| `DecryptText` | 随机字符解析为最终文本 | 权限状态、终端反馈、技术感结果 |
| `WeightSweepText` | 字重从细到粗扫过 | 导航激活态、强调词、品牌标题 |
| `FocusBlurText` | 从模糊聚焦到清晰，再模糊消失 | 加载态、AI 生成完成、内容进入 |
| `TickerText` | 横向滚动公告，两端字符渐隐变小变模糊 | 公告栏、状态播报、长文本摘要 |
| `TypewriterText` | 逐字输入、删除和光标 | 搜索建议、命令输入、AI 回复预览 |
| `BreathingText` | 整体文字轻微 opacity / blur / scale 呼吸 | 等待态、AI thinking、空状态 |
| `ElasticLettersText` | 字符水平轻微拉伸后回弹出现 | 按钮反馈、短标题、品牌字动效 |
| `LiquidText` | 字符液体式融合/分离 | 实验性品牌动效、情绪化标题 |
| `PixelResolveText` | 像素块还原文字 | 复古/像素化主题动效 |

### 常用示例

#### `TextReveal`

```tsx
<TextReveal
  text="Motion-ready product copy"
  splitBy="character"
  mode="in-out"
  duration={620}
  hold={900}
  stagger={26}
  distance={16}
  blur={8}
  repeat
/>
```

#### `GradientSweepText`

```tsx
<GradientSweepText
  duration={2800}
  angle={110}
  baseColor="color-mix(in srgb, currentColor 34%, transparent)"
  highlightColor="currentColor"
>
  slide to unlock
</GradientSweepText>
```

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
  directionY={1}
/>
```

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

#### `NumberDeltaText`

```tsx
<NumberDeltaText value={24} duration={1080} />
<NumberDeltaText value={-18} duration={1080} />
```

`NumberDeltaText` 默认使用 `1080ms` 的较慢滚动节奏。组件会保留上一帧数字，并按 0-9 轮盘路径滚动到新数字。例如 `6 -> 3` 会经过 `5`、`4` 到 `3`，`3 -> 8` 会经过 `4`、`5`、`6`、`7` 到 `8`。

#### `SpoilerText`

```tsx
<SpoilerText text="Tap to reveal this." />
```

#### `DecryptText`

```tsx
<DecryptText text="ACCESS GRANTED" />
```

#### `WeightSweepText`

```tsx
<WeightSweepText text="Weight wave passes." minWeight={280} maxWeight={820} />
```

#### `FocusBlurText`

```tsx
<FocusBlurText text="Focus sharpens softly." blur={9} duration={960} />
```

#### `TickerText`

```tsx
<TickerText
  text="Motion text kit is now available."
  duration={18000}
  blur={6}
/>
```

#### `TypewriterText`

```tsx
<TypewriterText
  text="Typing with a cursor"
  speed={56}
  deleteSpeed={30}
  loopDelay={980}
/>
```

#### `BreathingText`

```tsx
<BreathingText text="Almost there..." duration={3200} blur={1.8} />
```

#### `ElasticLettersText`

```tsx
<ElasticLettersText text="Swift-like motion" duration={700} stagger={30} />
```

### 样式和可访问性

- 所有核心动效都由 CSS 驱动。
- 大多数组件会设置可读的 `aria-label`，拆分字符仅用于视觉层。
- 样式文件包含 `prefers-reduced-motion: reduce` 降级。
- 组件支持 `className` 和 `style`，也支持通过 CSS 变量进一步调整动效。

### 本地开发

仓库内包含一个 Next.js demo 站点，页面组件使用 coss UI。可复用 npm 包源码位于 `src/motion-text-kit`。

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
```

包产物由 `tsup` 输出到 `dist`：

```bash
npm run build:package
npm pack --dry-run
```

### License

MIT

---

## English

`motion-text-kit` is a lightweight React text motion library that turns common text animations into configurable, reusable CSS-powered components.

The components do not depend on Next.js or a runtime animation library. Use them in Next.js, Vite, Remix, Storybook, or any React app.

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
  BreathingText,
  GradientSweepText,
  NumberDeltaText,
  TextReveal,
} from "motion-text-kit";
import "motion-text-kit/styles.css";

export function Example() {
  return (
    <section>
      <TextReveal text="Letters enter and leave." mode="in-out" repeat />

      <GradientSweepText>Stay hungry, stay foolish.</GradientSweepText>

      <NumberDeltaText value={24} />
      <NumberDeltaText value={-18} />

      <BreathingText text="Almost there..." />
    </section>
  );
}
```

### Components

| Component | Motion | Use cases |
| --- | --- | --- |
| `TextReveal` | Character or word reveal, exit, and looping in-out motion | Hero headlines, onboarding copy, empty states |
| `GradientSweepText` | Soft highlight sweep across text | Keywords, brand lines, AI thinking |
| `RollingNumber` | Digit pop-in animation | Time, countdowns, dashboards |
| `NumberDeltaText` | Signed numbers roll by digit wheel | Price moves, metric changes, trading data |
| `SpoilerText` | Invisible-ink style press-to-reveal text | Sensitive values, hidden answers, interactive hints |
| `DecryptText` | Random glyphs resolve into final text | Permission states, terminal feedback, technical reveals |
| `WeightSweepText` | Font weight sweeps from thin to bold | Active navigation, emphasized words, brand headings |
| `FocusBlurText` | Text resolves from blur into focus, then blurs out | Loading states, AI completion, content entrances |
| `TickerText` | Horizontal ticker with soft edge blur, opacity, and scale | Announcements, status broadcasts, long text snippets |
| `TypewriterText` | Typing, deleting, and caret motion | Search suggestions, command input, AI response previews |
| `BreathingText` | Whole text breathes with opacity, blur, and scale | Waiting states, AI thinking, empty states |
| `ElasticLettersText` | Letters stretch horizontally and settle softly | Button feedback, short titles, brand text |
| `LiquidText` | Liquid-like character merge and separation | Experimental brand motion, expressive headings |
| `PixelResolveText` | Pixel block text resolve | Retro or pixel-themed motion |

### Common Examples

#### `TextReveal`

```tsx
<TextReveal
  text="Motion-ready product copy"
  splitBy="character"
  mode="in-out"
  duration={620}
  hold={900}
  stagger={26}
  distance={16}
  blur={8}
  repeat
/>
```

#### `GradientSweepText`

```tsx
<GradientSweepText
  duration={2800}
  angle={110}
  baseColor="color-mix(in srgb, currentColor 34%, transparent)"
  highlightColor="currentColor"
>
  slide to unlock
</GradientSweepText>
```

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
  directionY={1}
/>
```

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

#### `NumberDeltaText`

```tsx
<NumberDeltaText value={24} duration={1080} />
<NumberDeltaText value={-18} duration={1080} />
```

`NumberDeltaText` defaults to a slower `1080ms` roll. It keeps the previous value visible and rolls each digit along a 0-9 wheel path. For example, `6 -> 3` rolls through `5` and `4`; `3 -> 8` rolls through `4`, `5`, `6`, and `7`.

#### `SpoilerText`

```tsx
<SpoilerText text="Tap to reveal this." />
```

#### `DecryptText`

```tsx
<DecryptText text="ACCESS GRANTED" />
```

#### `WeightSweepText`

```tsx
<WeightSweepText text="Weight wave passes." minWeight={280} maxWeight={820} />
```

#### `FocusBlurText`

```tsx
<FocusBlurText text="Focus sharpens softly." blur={9} duration={960} />
```

#### `TickerText`

```tsx
<TickerText
  text="Motion text kit is now available."
  duration={18000}
  blur={6}
/>
```

#### `TypewriterText`

```tsx
<TypewriterText
  text="Typing with a cursor"
  speed={56}
  deleteSpeed={30}
  loopDelay={980}
/>
```

#### `BreathingText`

```tsx
<BreathingText text="Almost there..." duration={3200} blur={1.8} />
```

#### `ElasticLettersText`

```tsx
<ElasticLettersText text="Swift-like motion" duration={700} stagger={30} />
```

### Styling and Accessibility

- Core motion is CSS-powered.
- Most components expose readable `aria-label` values while split characters remain visual-only.
- The stylesheet includes `prefers-reduced-motion: reduce` fallbacks.
- Components accept `className` and `style`, and many motion values can be tuned through props or CSS variables.

### Development

This repository includes a Next.js demo site that uses coss UI for the page surface. The reusable package source lives in `src/motion-text-kit`.

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
```

Package output is generated into `dist` by `tsup`:

```bash
npm run build:package
npm pack --dry-run
```

### License

MIT
