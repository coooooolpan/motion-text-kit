# motion-text-kit

Small, polished React text motion components for interfaces that need a little more life.

[中文](#中文) | [English](#english)

---

## 中文

`motion-text-kit` 是一组轻量、可配置、开箱即用的 React 文本动效组件。

它把产品界面里常见但容易散落在各处的文本动效沉淀为统一组件：逐字出现、数字滚动、隐形墨水、虹彩文字、打字机、呼吸态、心跳态、词语变形等。核心动效由 CSS 驱动，不绑定 Next.js，也不依赖 Framer Motion 这类运行时动画库。

适合用于：

- 需要更精致文本反馈的 SaaS、AI 产品、Dashboard、个人作品集和官网。
- 需要把动效沉淀进设计系统，而不是在业务页面里临时写动画。
- 需要 React 组件化接入，同时保持足够轻量的项目。

如果你正在整理自己的 motion system，这个仓库值得收藏。

### 特点

- **CSS-first**：核心动效由 CSS animation / transition 驱动，运行时成本低。
- **React 封装**：组件 API 直接、可组合，支持 `className`、`style` 和常用动效参数。
- **框架无关**：可用于 Next.js、Vite、Remix、Storybook 或任意 React 项目。
- **可访问性友好**：字符拆分主要服务视觉层，保留可读文本与 `prefers-reduced-motion` 降级。
- **适合设计系统**：统一命名、统一样式入口、统一动效语义，方便长期维护。

### 安装

```bash
npm install motion-text-kit
```

在应用入口处引入一次样式：

```tsx
import "motion-text-kit/styles.css";
```

### 快速开始

```tsx
import {
  GradientSweepText,
  MorphWordsText,
  NumberDeltaText,
  TextReveal,
} from "motion-text-kit";
import "motion-text-kit/styles.css";

export function HeroCopy() {
  return (
    <section>
      <TextReveal text="Letters enter and leave." mode="in-out" repeat />

      <h1>
        Build <MorphWordsText words={["steady", "smooth", "crafted"]} />
      </h1>

      <GradientSweepText>Stay hungry, stay foolish.</GradientSweepText>

      <NumberDeltaText value={24} />
      <NumberDeltaText value={-18} />
    </section>
  );
}
```

### 组件一览

| Component | 动效 | 适用场景 |
| --- | --- | --- |
| `TextReveal` | 逐字或逐词出现、消失、循环显隐 | 首屏标题、引导文案、空状态提示 |
| `GradientSweepText` | 柔和高光从文字表面滑过 | 关键词、品牌标语、AI thinking |
| `RollingNumber` | 数字字符弹入 | 时间、倒计时、统计面板 |
| `NumberDeltaText` | 正负数字按数字轮盘滚动变化 | 价格涨跌、指标变化、交易数据 |
| `SpoilerText` | 隐形墨水式按下显露 | 敏感信息、谜底揭示、交互提示 |
| `DecryptText` | 随机字符解析为最终文本 | 权限状态、终端反馈、技术感结果 |
| `WeightSweepText` | 字重从细到粗扫过 | 导航激活态、强调词、品牌标题 |
| `FocusBlurText` | 从模糊聚焦到清晰，再模糊消失 | 加载态、AI 生成完成、内容进入 |
| `TickerText` | 横向滚动公告，两端字符级渐隐、变小、模糊 | 公告栏、状态播报、长文本摘要 |
| `TypewriterText` | 逐字输入、删除和光标 | 搜索建议、命令输入、AI 回复预览 |
| `BreathingText` | 整体文字以 opacity / blur / scale 呼吸 | 等待态、AI thinking、空状态 |
| `ElasticLettersText` | 字符水平轻微拉伸后回弹出现 | 按钮反馈、短标题、品牌字动效 |
| `IridescentText` | 从左向右流动的虹彩渐变，平滑回到本色 | Hero slogan、品牌关键词、发布页标题 |
| `MorphWordsText` | 短词之间柔和变形切换 | Slogan、价值主张、轮播关键词 |
| `HeartbeatText` | 文字以真实双峰心跳节奏轻微起伏 | 生命体征、等待状态、情绪反馈 |
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

#### `NumberDeltaText`

```tsx
<NumberDeltaText value={24} duration={1080} />
<NumberDeltaText value={-18} duration={1080} />
```

`NumberDeltaText` 会保留上一帧数字，并按 0-9 轮盘路径滚动到新数字。例如 `6 -> 3` 会经过 `5`、`4` 到 `3`，`3 -> 8` 会经过 `4`、`5`、`6`、`7` 到 `8`。

#### `IridescentText`

```tsx
<IridescentText text="Matter of care" />
```

`IridescentText` 会保留正常文本作为底层，虹彩渐变作为覆盖层从左向右持续流动，并通过透明度自然回到普通状态。

#### `MorphWordsText`

```tsx
<h1>
  Build <MorphWordsText words={["steady", "smooth", "crafted"]} />
</h1>
```

#### `TickerText`

```tsx
<TickerText
  text="Motion text kit is now available."
  duration={18000}
  blur={6}
/>
```

#### 更多组件

```tsx
<SpoilerText text="Tap to reveal this." />
<DecryptText text="ACCESS GRANTED" />
<WeightSweepText text="Weight wave passes." minWeight={280} maxWeight={820} />
<FocusBlurText text="Focus sharpens softly." blur={9} duration={960} />
<TypewriterText text="Typing with a cursor" speed={56} deleteSpeed={30} />
<BreathingText text="Almost there..." duration={3200} blur={1.8} />
<ElasticLettersText text="Swift-like motion" duration={700} stagger={30} />
<HeartbeatText text="Still alive" />
```

### 样式和可访问性

- 所有核心动效都由 CSS 驱动。
- 组件支持 `className` 和 `style`，也支持通过 CSS 变量进一步调整动效。
- 多数字符拆分组件会保留可读的 `aria-label`，拆分字符仅用于视觉层。
- 样式文件包含 `prefers-reduced-motion: reduce` 降级。

### 本地开发

仓库内包含一个 Next.js demo 站点，页面组件使用 coss UI。可复用 npm 包源码位于 `src/motion-text-kit`。

Demo 站点包含 `Motion`、`Package`、`Notes` 三个页面。`Notes` 中的「灵感坐标」整理并致敬启发 Motion Text Kit 的产品、网站和动效语言。

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

### Star

如果这个项目帮你少写了一组文本动效，或者给你的设计系统带来一点更自然的 motion 语言，欢迎给它一个 star。它会帮助这个小组件库继续打磨下去。

### License

MIT

---

## English

`motion-text-kit` is a lightweight, configurable set of React text motion components for product interfaces.

It turns common text animations into reusable building blocks: character reveal, number rolling, invisible ink, iridescent text, typewriter motion, breathing states, heartbeat rhythm, morphing words, and more. The core motion is CSS-powered, framework-agnostic, and does not require Framer Motion or another runtime animation library.

Use it when you want:

- Product copy that feels more alive without adding a heavy animation stack.
- Text motion that can live inside a design system instead of scattered page code.
- React components that work in Next.js, Vite, Remix, Storybook, and regular React apps.

If you are shaping a motion system for your interface, this repository is worth saving.

### Highlights

- **CSS-first**: animation and transition driven, low runtime overhead.
- **React-ready**: clean component APIs with `className`, `style`, and motion props.
- **Framework-agnostic**: no Next.js dependency in the package itself.
- **Accessible by default**: visual character splitting with readable labels and reduced-motion fallbacks.
- **Design-system friendly**: consistent naming, a single stylesheet entry, and reusable motion semantics.

### Install

```bash
npm install motion-text-kit
```

Import the CSS once near your app root:

```tsx
import "motion-text-kit/styles.css";
```

### Quick Start

```tsx
import {
  GradientSweepText,
  MorphWordsText,
  NumberDeltaText,
  TextReveal,
} from "motion-text-kit";
import "motion-text-kit/styles.css";

export function HeroCopy() {
  return (
    <section>
      <TextReveal text="Letters enter and leave." mode="in-out" repeat />

      <h1>
        Build <MorphWordsText words={["steady", "smooth", "crafted"]} />
      </h1>

      <GradientSweepText>Stay hungry, stay foolish.</GradientSweepText>

      <NumberDeltaText value={24} />
      <NumberDeltaText value={-18} />
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
| `TickerText` | Horizontal ticker with character-level edge blur, opacity, and scale | Announcements, status broadcasts, long snippets |
| `TypewriterText` | Typing, deleting, and caret motion | Search suggestions, command input, AI response previews |
| `BreathingText` | Whole text breathes with opacity, blur, and scale | Waiting states, AI thinking, empty states |
| `ElasticLettersText` | Letters stretch horizontally and settle softly | Button feedback, short titles, brand text |
| `IridescentText` | Left-to-right iridescent gradient flow that returns to plain text | Hero slogans, brand keywords, launch headlines |
| `MorphWordsText` | Short words morph through soft transitions | Slogans, value props, rotating keywords |
| `HeartbeatText` | Restrained double-beat text pulse | Vitals, waiting states, emotional feedback |
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

#### `NumberDeltaText`

```tsx
<NumberDeltaText value={24} duration={1080} />
<NumberDeltaText value={-18} duration={1080} />
```

`NumberDeltaText` keeps the previous value visible and rolls each digit along a 0-9 wheel path. For example, `6 -> 3` rolls through `5` and `4`; `3 -> 8` rolls through `4`, `5`, `6`, and `7`.

#### `IridescentText`

```tsx
<IridescentText text="Matter of care" />
```

`IridescentText` keeps normal text as the base layer, then fades in an iridescent overlay that flows from left to right before fading back to the plain state.

#### `MorphWordsText`

```tsx
<h1>
  Build <MorphWordsText words={["steady", "smooth", "crafted"]} />
</h1>
```

#### `TickerText`

```tsx
<TickerText
  text="Motion text kit is now available."
  duration={18000}
  blur={6}
/>
```

#### More Components

```tsx
<SpoilerText text="Tap to reveal this." />
<DecryptText text="ACCESS GRANTED" />
<WeightSweepText text="Weight wave passes." minWeight={280} maxWeight={820} />
<FocusBlurText text="Focus sharpens softly." blur={9} duration={960} />
<TypewriterText text="Typing with a cursor" speed={56} deleteSpeed={30} />
<BreathingText text="Almost there..." duration={3200} blur={1.8} />
<ElasticLettersText text="Swift-like motion" duration={700} stagger={30} />
<HeartbeatText text="Still alive" />
```

### Styling and Accessibility

- Core motion is CSS-powered.
- Components accept `className` and `style`, and many values can be tuned through props or CSS variables.
- Most split-text components expose readable `aria-label` values while split characters remain visual-only.
- The stylesheet includes `prefers-reduced-motion: reduce` fallbacks.

### Development

This repository includes a Next.js demo site that uses coss UI for the page surface. The reusable package source lives in `src/motion-text-kit`.

The demo site includes `Motion`, `Package`, and `Notes` pages. The `Notes` page collects and credits the products, websites, and motion languages behind Motion Text Kit.

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

### Star

If this project saves you from rewriting one more text animation, or helps your design system feel a little more natural, a star helps keep the kit moving.

### License

MIT
