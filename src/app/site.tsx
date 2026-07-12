"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { BorderBeam } from "border-beam";
import localFont from "next/font/local";
import Link from "next/link";
import {
  CheckIcon,
  CopyIcon,
  GlobeIcon,
  RotateCcwIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FooterCredit } from "@/components/footer-credit";
import {
  Menu,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from "@/components/ui/menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs";
import {
  AiStreamText,
  BreathingText,
  BreathingWordsText,
  DecryptText,
  ElasticLettersText,
  FocusBlurText,
  GradientSweepText,
  HeartbeatText,
  IridescentText,
  MorphWordsText,
  NumberDeltaText,
  SoftScrambleText,
  RollingNumber,
  SpoilerText,
  TextReveal,
  TickerText,
  TypewriterText,
  WeightSweepText,
} from "@/motion-text-kit";
import {
  getLocale,
  setLocale,
  subscribeToLocale,
  type Locale,
} from "@/lib/locale";

type ActivePage = "motion" | "npm" | "notes";

const noteHandFont = localFont({
  src: "./fonts/QingSongShouXieTi1-2.ttf",
  display: "swap",
  preload: false,
});

type MotionCard = {
  id: string;
  title: string;
  description: string;
  scenario: string;
  preview: ReactNode;
  code: string;
};

type CodeMode = "css" | "react" | "framer" | "prompt";

type ExpandedMotionCard = {
  item: MotionCard;
  origin: DOMRect;
  state: "opening" | "open" | "closing";
};

const githubRepositoryUrl = "https://github.com/coooooolpan/motion-text-kit";

const pageCopy = {
  zh: {
    languageToggleLabel: "切换到英文",
    languageToggleText: "中",
    languageMenuLabel: "语言",
    languageOptions: {
      zh: "中文",
      en: "English",
    },
    githubLabel: "打开 GitHub 仓库",
    startLabel: "开始",
    themeLabel: "切换深色模式",
    logoLabel: "Motion Text Kit 标志",
    heroSlogan: "让文字自然流动",
    heroDescription:
      "Motion Text Kit 是一组轻量、开箱即用的 React 文本动效组件，为界面注入恰到好处的动态表达。",
    copyLabel: "复制",
    currentTimeLabel: "当前时间",
    footerPrefix: "Crafted by",
    resetInvisibleLabel: "复原隐形",
    scenarioLabel: "适用场景",
    notes: {
      title: "Notes",
      description:
        "记录 Motion Text Kit 的版本变化、设计判断，以及那些启发这个组件库的人与作品。",
      releaseTitle: "版本记录",
      inspirationTitle: "灵感坐标",
      inspirationDescription:
        "向这些启发 Motion Text Kit 的产品、网站与动效语言致敬。",
      releases: [
        {
          version: "v0.3.0",
          date: "2026.07.12",
          summary: "上线在线 Playground，让文本动效可以实时调整、预览与复用。",
          items: [
            "新增 Playground，支持 18 个文本动效的实时预览、重播和 React 代码复制。",
            "支持修改文本、字号、时长、模糊、强度与字符间隔，参数调整即时反馈。",
            "将 Motion、Playground、Package 和 Notes 拆分为独立路由，统一导航与底部签名。",
          ],
        },
        {
          version: "v0.2.1",
          date: "2026.07.09",
          summary: "修复 AI 流式显现的循环闪烁，并稳定近期新增动效。",
          items: [
            "修复 AiStreamText 文本消失后短暂跳回完整文本的问题。",
            "将词语变形示例统一为相同字母长度的单词，减少切换时的宽度跳动。",
            "补充并稳定 SoftScrambleText、BreathingWordsText 和隐形墨水的交付细节。",
          ],
        },
        {
          version: "v0.2.0",
          date: "2026.07.05",
          summary: "扩展文本动效能力并打磨官网交互。",
          items: [
            "新增虹彩文字、心跳文本、弹性字母、词语变形和数字涨跌。",
            "优化卡片全屏、入口加载、npm 预览滚动和手写 logo 动效。",
            "补齐 npm 页面 Installation、Usage 和组件 API。",
          ],
        },
        {
          version: "v0.1.0",
          date: "2026.06.16",
          summary: "完成第一组核心文本动效。",
          items: [
            "提供文本高光、逐字显隐、数字滚动、文本解码和隐形墨水。",
            "以 CSS 动效和 React 组件封装为主，不绑定 Next.js。",
          ],
        },
      ],
      inspirations: [
        {
          name: "Transitions.dev",
          type: "Interaction library",
          description: "启发了紧凑、可浏览、可复制的动效卡片结构。",
          href: "https://transitions.dev/",
          domain: "transitions.dev",
          x: 36,
          y: 34,
          rotate: -2,
        },
        {
          name: "Recent Design",
          type: "Product archive",
          description: "参考它对近期产品界面、趋势和细节的高密度收集方式。",
          href: "https://recent.design/",
          domain: "recent.design",
          x: 272,
          y: 72,
          rotate: 2,
        },
        {
          name: "Detail",
          type: "Interface details",
          description: "启发了对微交互、排版层级和局部状态的观察方式。",
          href: "https://detail.design/",
          domain: "detail.design",
          x: 498,
          y: 42,
          rotate: -1,
        },
        {
          name: "Arlan",
          type: "Personal site",
          description: "参考其个人作品集里自然、轻巧、有节奏的表达方式。",
          href: "https://www.arlan.me/",
          domain: "arlan.me",
          x: 78,
          y: 268,
          rotate: 2,
        },
        {
          name: "SwiftUI",
          type: "Spring feel",
          description: "启发了数字滚动、弹性字母和轻量状态反馈的手感。",
          href: "https://developer.apple.com/xcode/swiftui/",
          domain: "developer.apple.com",
          x: 324,
          y: 250,
          rotate: -3,
        },
        {
          name: "ChatGPT",
          type: "Thinking motion",
          description: "启发了高光滑动、等待态和 AI thinking 文本节奏。",
          href: "https://chatgpt.com/",
          domain: "chatgpt.com",
          x: 536,
          y: 246,
          rotate: 2,
        },
      ],
    },
    cards: {
      gradient: {
        title: "文本高光",
        description: "一道柔和高光从文字表面滑过",
        scenario: "适合强调关键词、品牌标语、AI 思考状态或需要柔和吸引注意力的短文本。",
        previewText: "Stay hungry, stay foolish.",
      },
      reveal: {
        title: "逐字显隐",
        description: "字符依次出现、停留，然后淡出",
        scenario: "适合首屏标题、引导文案、空状态提示和需要节奏感出现的短句。",
        previewText: "Letters enter and leave.",
      },
      rolling: {
        title: "数字计时",
        description: "按 HH:mm:ss 滚动展示当前时间",
        scenario: "适合时间、倒计时、统计面板和需要数字更新反馈的实时信息。",
      },
      spoiler: {
        title: "隐形墨水",
        description: "像隐形墨水一样按下后显露文字",
        scenario: "适合敏感信息、谜底揭示、互动提示和需要用户主动查看的内容。",
        previewText: "Tap to reveal this.",
      },
      decrypt: {
        title: "文本解码",
        description: "随机字符逐步解析为最终文本",
        scenario: "适合权限状态、终端反馈、加载完成提示和带技术感的结果揭示。",
        previewText: "ACCESS GRANTED",
      },
      weight: {
        title: "字重扫光",
        description: "字重从细到粗平滑扫过文字",
        scenario: "适合导航激活态、强调词、品牌标题和需要低调动态质感的文本。",
        previewText: "Weight wave passes.",
      },
      focus: {
        title: "模糊聚焦",
        description: "文字从失焦模糊聚拢到清晰",
        scenario: "适合加载态、内容进入视野、AI 生成完成和从不确定到确定的状态表达。",
        previewText: "Focus sharpens softly.",
      },
      aiStream: {
        title: "AI 流式显现",
        description: "字符依次上浮，彩色闪过后落成正文",
        scenario: "适合大模型输出、智能助手回复、生成态标题和 AI 产品的反馈文本。",
        previewText: "Generating thoughtful motion",
      },
      ticker: {
        title: "流动字幕",
        description: "文本在两端带光感模糊并持续循环",
        scenario: "适合公告栏、新闻摘要、状态播报和空间有限但需要展示长文本的区域。",
        previewText:
          "Stay hungry, stay foolish. Steve Jobs believed that design is not just what it looks like and feels like, design is how it works. The people who are crazy enough to think they can change the world are the ones who do.",
      },
      typewriter: {
        title: "打字光标",
        description: "逐字输入并带闪烁光标",
        scenario: "适合搜索建议、命令输入、AI 回复预览和需要模拟输入过程的短文本。",
        previewText: "Typing with a cursor",
      },
      breathing: {
        title: "呼吸文本",
        description: "整体文本以轻微透明度、模糊和缩放呼吸",
        scenario: "适合等待态、AI thinking、空状态和需要安静持续反馈的提示文案。",
        previewText: "Almost there...",
      },
      breathingWords: {
        title: "词语呼吸",
        description: "每个词以不同节奏轻微明暗变化",
        scenario: "适合等待态、thinking、ambient UI 和需要安静生命感的提示文案。",
        previewText: "Quiet signals keep moving",
      },
      softScramble: {
        title: "柔和扰动",
        description: "少量字符轻微随机替换后归位",
        scenario: "适合加载完成、内容更新、状态刷新和不想太强技术感的结果反馈。",
        previewText: "Status updated softly",
      },
      delta: {
        title: "数字涨跌",
        description: "数字变化时带正负方向和弹性入场",
        scenario: "适合价格涨跌、指标变化、交易数据和需要表达正负方向的统计数字。",
      },
      elastic: {
        title: "弹性字母",
        description: "字符水平轻微拉伸后回弹出现",
        scenario: "适合按钮反馈、短标题出现、品牌字动效和需要 SwiftUI 弹性感的轻量文本。",
        previewText: "Swift-like motion",
      },
      laser: {
        title: "虹彩文字",
        description: "文字短暂浮现虹彩后回到本色",
        scenario: "适合 hero slogan、品牌关键词、发布页标题和需要材质感但不突兀的短文本。",
        previewText: "Matter of care",
      },
      morph: {
        title: "词语变形",
        description: "一句 slogan 中的关键词柔和切换",
        scenario: "适合品牌 slogan、价值主张、加载文案和需要轮播关键词的标题。",
        previewBefore: "Build",
        previewWords: ["better", "faster", "softer"],
      },
      cursor: {
        title: "心跳文本",
        description: "文字以真实双峰心跳节奏轻微起伏",
        scenario: "适合生命体征、等待状态、情绪反馈、健康数据和需要有温度的短文本。",
        previewText: "Still alive",
      },
    },
  },
  en: {
    languageToggleLabel: "Switch to Chinese",
    languageToggleText: "EN",
    languageMenuLabel: "Language",
    languageOptions: {
      zh: "中文",
      en: "English",
    },
    githubLabel: "Open GitHub repository",
    startLabel: "Start",
    themeLabel: "Toggle dark mode",
    logoLabel: "Motion Text Kit logo",
    heroSlogan: "Text, in motion.",
    heroDescription:
      "Motion Text Kit is a lightweight, ready-to-use set of React text motion components that brings just-right dynamic expression to interfaces.",
    copyLabel: "Copy",
    currentTimeLabel: "Current time",
    footerPrefix: "Crafted by",
    resetInvisibleLabel: "Hide again",
    scenarioLabel: "Use cases",
    notes: {
      title: "Notes",
      description:
        "A small record of Motion Text Kit releases, design decisions, and the people and places that shaped its motion language.",
      releaseTitle: "Release Notes",
      inspirationTitle: "Inspiration Map",
      inspirationDescription:
        "A small tribute to the products, websites, and motion languages that shaped Motion Text Kit through quiet, lasting interface details.",
      releases: [
        {
          version: "v0.3.0",
          date: "2026.07.12",
          summary:
            "Introduced the live Playground for tuning, previewing, and reusing text effects in real time.",
          items: [
            "Added a Playground with live previews, replay, and copyable React code for all 18 text effects.",
            "Added controls for text, size, duration, blur, intensity, and stagger with immediate visual feedback.",
            "Split Motion, Playground, Package, and Notes into separate routes with shared navigation and footer credit.",
          ],
        },
        {
          version: "v0.2.1",
          date: "2026.07.09",
          summary:
            "Fixed the AI stream loop flash and stabilized the latest motion components.",
          items: [
            "Fixed AiStreamText briefly flashing the full text after the disappear phase.",
            "Updated the morph words demo to use same-length words for steadier switching.",
            "Refined delivery details for SoftScrambleText, BreathingWordsText, and invisible ink.",
          ],
        },
        {
          version: "v0.2.0",
          date: "2026.07.05",
          summary: "Expanded the text motion set and refined the demo site.",
          items: [
            "Added IridescentText, HeartbeatText, ElasticLettersText, MorphWordsText, and NumberDeltaText.",
            "Improved expanded cards, page entrance motion, npm preview marquee, and the handwritten logo.",
            "Completed the npm page with Installation, Usage, and component API sections.",
          ],
        },
        {
          version: "v0.1.0",
          date: "2026.06.16",
          summary: "Shipped the first core text motion components.",
          items: [
            "Included highlight sweep, character reveal, rolling digits, decrypt text, and invisible ink.",
            "Focused on CSS-powered motion wrapped as React components, without a Next.js dependency.",
          ],
        },
      ],
      inspirations: [
        {
          name: "Transitions.dev",
          type: "Interaction library",
          description: "Inspired the compact, browsable, copy-friendly motion card structure.",
          href: "https://transitions.dev/",
          domain: "transitions.dev",
          x: 36,
          y: 34,
          rotate: -2,
        },
        {
          name: "Recent Design",
          type: "Product archive",
          description: "A reference for dense, current product UI and trend curation.",
          href: "https://recent.design/",
          domain: "recent.design",
          x: 272,
          y: 72,
          rotate: 2,
        },
        {
          name: "Detail",
          type: "Interface details",
          description: "Shaped the way small interactions, hierarchy, and local states are observed.",
          href: "https://detail.design/",
          domain: "detail.design",
          x: 498,
          y: 42,
          rotate: -1,
        },
        {
          name: "Arlan",
          type: "Personal site",
          description: "A reference for natural, light, and well-paced portfolio expression.",
          href: "https://www.arlan.me/",
          domain: "arlan.me",
          x: 78,
          y: 268,
          rotate: 2,
        },
        {
          name: "SwiftUI",
          type: "Spring feel",
          description: "Shaped the feel of rolling numbers, elastic letters, and light state feedback.",
          href: "https://developer.apple.com/xcode/swiftui/",
          domain: "developer.apple.com",
          x: 324,
          y: 250,
          rotate: -3,
        },
        {
          name: "ChatGPT",
          type: "Thinking motion",
          description: "Inspired the highlight sweep, waiting states, and AI thinking text rhythm.",
          href: "https://chatgpt.com/",
          domain: "chatgpt.com",
          x: 536,
          y: 246,
          rotate: 2,
        },
      ],
    },
    cards: {
      gradient: {
        title: "Gradient Text Sweep",
        description: "A soft highlight glides across the text",
        scenario: "Best for keywords, brand lines, AI thinking states, or short text that needs soft attention.",
        previewText: "Stay hungry, stay foolish.",
      },
      reveal: {
        title: "Character Reveal",
        description: "Characters enter, hold, then leave",
        scenario: "Best for hero headlines, onboarding copy, empty states, and rhythmic short-form text.",
        previewText: "Letters enter and leave.",
      },
      rolling: {
        title: "Rolling Time Digits",
        description: "Current HH:mm:ss time with rolling digits",
        scenario: "Best for time, countdowns, dashboards, and live numeric feedback.",
      },
      spoiler: {
        title: "Invisible Ink Text",
        description: "Press to reveal text through particles",
        scenario: "Best for sensitive values, hidden answers, interactive hints, and user-triggered reveals.",
        previewText: "Tap to reveal this.",
      },
      decrypt: {
        title: "Decrypt Text",
        description: "Random glyphs resolve into final text",
        scenario: "Best for permission states, terminal feedback, completion messages, and technical reveals.",
        previewText: "ACCESS GRANTED",
      },
      weight: {
        title: "Weight Sweep",
        description: "Text weight sweeps from thin to bold",
        scenario: "Best for active navigation, emphasized words, brand headings, and subtle typographic motion.",
        previewText: "Weight wave passes.",
      },
      focus: {
        title: "Blur Focus",
        description: "Text resolves from soft blur into focus",
        scenario: "Best for loading states, content entrances, AI completion, and uncertainty resolving into clarity.",
        previewText: "Focus sharpens softly.",
      },
      aiStream: {
        title: "AI Stream Text",
        description: "Characters rise in, flash through color, then settle to plain text",
        scenario: "Best for model output, assistant replies, generated headings, and AI product feedback text.",
        previewText: "Generating thoughtful motion",
      },
      ticker: {
        title: "Flowing Ticker",
        description: "Horizontal notice text loops through soft glowing edges",
        scenario: "Best for announcements, news snippets, status broadcasts, and long text in compact spaces.",
        previewText:
          "Stay hungry, stay foolish. Steve Jobs believed that design is not just what it looks like and feels like, design is how it works. The people who are crazy enough to think they can change the world are the ones who do.",
      },
      typewriter: {
        title: "Typewriter Cursor",
        description: "Characters type in with a blinking caret",
        scenario: "Best for search suggestions, command input, AI response previews, and simulated typing.",
        previewText: "Typing with a cursor",
      },
      breathing: {
        title: "Breathing Text",
        description: "Whole text breathes with subtle opacity, blur, and scale",
        scenario: "Best for waiting states, AI thinking, empty states, and quiet continuous feedback.",
        previewText: "Almost there...",
      },
      breathingWords: {
        title: "Breathing Words",
        description: "Each word shifts brightness with a different slow rhythm",
        scenario: "Best for waiting states, thinking, ambient UI, and quiet living feedback text.",
        previewText: "Quiet signals keep moving",
      },
      softScramble: {
        title: "Soft Scramble",
        description: "A few characters softly swap, then settle back into place",
        scenario: "Best for loading completion, content updates, state refreshes, and quiet result feedback.",
        previewText: "Status updated softly",
      },
      delta: {
        title: "Number Delta",
        description: "Signed number changes with directional spring motion",
        scenario: "Best for price moves, metric changes, trading data, and signed numeric feedback.",
      },
      elastic: {
        title: "Elastic Letters",
        description: "Letters stretch horizontally then settle softly",
        scenario: "Best for button feedback, short title entrances, brand text, and SwiftUI-like elastic motion.",
        previewText: "Swift-like motion",
      },
      laser: {
        title: "Iridescent Text",
        description: "A brief iridescent sheen appears, then returns to plain text",
        scenario: "Best for hero slogans, brand keywords, launch headlines, and quiet premium emphasis.",
        previewText: "Matter of care",
      },
      morph: {
        title: "Morph Words",
        description: "One keyword inside a slogan morphs softly",
        scenario: "Best for brand slogans, value props, loading copy, and rotating headline keywords.",
        previewBefore: "Build",
        previewWords: ["better", "faster", "softer"],
      },
      cursor: {
        title: "Heartbeat Text",
        description: "Text pulses with a restrained double-beat rhythm",
        scenario: "Best for vitals, waiting states, emotional feedback, health data, and warm short copy.",
        previewText: "Still alive",
      },
    },
  },
} as const;
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.86 8.37 6.84 9.73.5.09.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.32 9.32 0 0 1 12 7c.85 0 1.71.12 2.51.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.95.68 1.92 0 1.38-.01 2.49-.01 2.83 0 .27.18.59.69.49A10.18 10.18 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

function FilledMoonIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
    </svg>
  );
}

function FilledSunIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10ZM12 1.75a.9.9 0 0 1 .9.9v1.4a.9.9 0 1 1-1.8 0v-1.4a.9.9 0 0 1 .9-.9ZM12 19.05a.9.9 0 0 1 .9.9v1.4a.9.9 0 1 1-1.8 0v-1.4a.9.9 0 0 1 .9-.9ZM22.25 12a.9.9 0 0 1-.9.9h-1.4a.9.9 0 1 1 0-1.8h1.4a.9.9 0 0 1 .9.9ZM4.95 12a.9.9 0 0 1-.9.9h-1.4a.9.9 0 1 1 0-1.8h1.4a.9.9 0 0 1 .9.9ZM19.25 4.75a.9.9 0 0 1 0 1.27l-.99.99a.9.9 0 1 1-1.27-1.27l.99-.99a.9.9 0 0 1 1.27 0ZM7.01 16.99a.9.9 0 0 1 0 1.27l-.99.99a.9.9 0 1 1-1.27-1.27l.99-.99a.9.9 0 0 1 1.27 0ZM19.25 19.25a.9.9 0 0 1-1.27 0l-.99-.99a.9.9 0 1 1 1.27-1.27l.99.99a.9.9 0 0 1 0 1.27ZM7.01 7.01a.9.9 0 0 1-1.27 0l-.99-.99a.9.9 0 1 1 1.27-1.27l.99.99a.9.9 0 0 1 0 1.27Z" />
    </svg>
  );
}

function MotionLogo({ label }: { label: string }) {
  const strokes = [
    "M18.0007 41.3292C43.5447 39.6822 150.408 28.3462 143.604 32.4412",
    "M80.3577 40.2061C82.5117 59.3671 74.3868 204.896 84.2688 203.009",
    "M202.191 140.352C280.45 129.862 286.9 57.495 218.601 88.455C177.2 107.221 197.964 239.085 275.607 167.755",
    "M346.141 105.52C335.975 107.461 410.979 167.677 424.497 176.858",
    "M407.535 81.2781C413.159 39.2431 334.134 229.711 365.76 201.455",
    "M486.002 101.244C497.532 94.7859 599.272 83.1499 572.722 89.8579",
    "M530.952 18.0039C510.162 60.5229 514.392 175.565 571.522 189.77",
    "M675.242 192.829C671.702 192.355 672.472 193.359 672.942 189.816",
  ];

  return (
    <svg
      aria-label={label}
      className="motion-logo"
      role="img"
      viewBox="0 0 694 223"
    >
      <g aria-hidden="true" className="motion-logo__strokes">
        {strokes.map((stroke, index) => (
          <path
            className="motion-logo__stroke"
            d={stroke}
            key={stroke}
            pathLength={1}
            style={{ "--motion-logo-stroke-index": index } as CSSProperties}
          />
        ))}
      </g>
    </svg>
  );
}

function MotionLogoCard({
  isDark,
  label,
}: {
  isDark: boolean;
  label: string;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const tiltFrameRef = useRef<number | null>(null);
  const tiltPointRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    return () => {
      if (tiltFrameRef.current !== null) {
        window.cancelAnimationFrame(tiltFrameRef.current);
      }
    };
  }, []);

  function resetTilt() {
    const wrap = wrapRef.current;
    const card = cardRef.current;

    if (tiltFrameRef.current !== null) {
      window.cancelAnimationFrame(tiltFrameRef.current);
      tiltFrameRef.current = null;
    }

    wrap?.classList.remove("is-hover");

    if (!card) {
      return;
    }

    card.classList.remove("is-tilting");
    card.style.setProperty("--tilt-rx", "0deg");
    card.style.setProperty("--tilt-ry", "0deg");
    card.style.setProperty("--tilt-gx", "50%");
    card.style.setProperty("--tilt-gy", "50%");
  }

  function applyTilt() {
    tiltFrameRef.current = null;

    const wrap = wrapRef.current;
    const card = cardRef.current;

    if (!wrap || !card) {
      return;
    }

    const rect = wrap.getBoundingClientRect();
    const px = Math.max(0, Math.min(1, (tiltPointRef.current.x - rect.left) / rect.width));
    const py = Math.max(0, Math.min(1, (tiltPointRef.current.y - rect.top) / rect.height));
    const tiltX = (0.5 - py) * 44;
    const tiltY = (px - 0.5) * 44;

    wrap.classList.add("is-hover");
    card.classList.add("is-tilting");
    card.style.setProperty("--tilt-rx", `${tiltX.toFixed(2)}deg`);
    card.style.setProperty("--tilt-ry", `${tiltY.toFixed(2)}deg`);
    card.style.setProperty("--tilt-gx", `${(px * 100).toFixed(1)}%`);
    card.style.setProperty("--tilt-gy", `${(py * 100).toFixed(1)}%`);
  }

  function scheduleTilt(clientX: number, clientY: number) {
    tiltPointRef.current = { x: clientX, y: clientY };

    if (tiltFrameRef.current === null) {
      tiltFrameRef.current = window.requestAnimationFrame(applyTilt);
    }
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    scheduleTilt(event.clientX, event.clientY);
  }

  function handlePointerLeave() {
    resetTilt();
  }

  return (
    <div
      className="logo-tilt t-tilt"
      onPointerCancel={handlePointerLeave}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      onPointerUp={() => cardRef.current?.classList.remove("is-tilting")}
      ref={wrapRef}
    >
      <div className="t-tilt-card" ref={cardRef}>
        <BorderBeam
          size="pulse-outside"
          colorVariant="mono"
          strength={0.8}
          theme={isDark ? "dark" : "light"}
        >
          <Card className="logo-card grid size-[3.625rem] place-items-center overflow-visible rounded-[1.05rem] border-black/[0.045] bg-white p-0 shadow-[0_14px_36px_rgba(59,130,246,.13)] dark:border-white/8 dark:bg-neutral-900 dark:shadow-[0_14px_36px_rgba(59,130,246,.08)]">
            <MotionLogo label={label} />
          </Card>
        </BorderBeam>
      </div>
    </div>
  );
}

function BrandMark({ label }: { label: string }) {
  return (
    <Link
      aria-label={label}
      className="inline-flex items-center rounded-full text-neutral-900 transition-colors duration-200 hover:text-neutral-700 dark:text-neutral-100 dark:hover:text-neutral-300"
      href="/"
    >
      <span className="text-[15px] font-semibold leading-none tracking-normal [font-family:var(--font-saans)]">
        Motion Text Kit
      </span>
    </Link>
  );
}

function TabUnderline({ type }: { type: ActivePage }) {
  const underlines = {
    motion: {
      viewBox: "0 0 546 83",
      path: "M27.6121 55.3016C-13.0489 50.4336 56.6541 57.3815 60.7091 57.0435C77.4091 55.6505 94.0451 53.1445 110.439 49.6745C132.068 45.0965 153.257 38.6455 174.614 32.9325C191.488 28.4195 208.228 23.4065 225.13 18.9965C229.628 17.8235 235.916 12.5375 238.788 16.1915C241.437 19.5595 230.995 19.7566 227.057 21.4476C216.169 26.1236 205.197 30.6015 194.315 35.2915C172.782 44.5715 144.727 46.5985 130.757 65.4285C128.13 68.9695 139.526 67.6225 143.891 67.0015C162.296 64.3795 180.464 60.1905 198.523 55.7785C230.209 48.0365 261.218 37.7376 292.727 29.3096C298.793 27.6866 307.145 19.9025 311.025 24.8385C314.144 28.8055 290.888 34.7216 279.948 43.3226C277.364 45.3536 271.476 50.3185 274.522 51.5535C308.488 65.3335 357.304 39.2125 390.091 32.0835C396.712 30.6445 404.45 26.6736 410.317 30.0636C415.548 33.0876 383.852 54.2625 403.056 53.6185C431.094 52.6795 461.141 38.1046 489.645 35.1196C527.905 31.1136 488.373 53.6826 530.974 42.2876",
    },
    npm: {
      viewBox: "0 0 359 75",
      path: "M31.7679 40.4521C20.3489 39.0851 7.12593 58.531 20.6539 59.104C43.6779 60.081 59.0299 52.5241 82.1149 46.4791C94.2629 43.2981 106.484 40.3961 118.712 37.5381C123.237 36.4801 136.024 31.8591 132.37 34.7321C119.921 44.5191 95.4149 45.7391 101.292 53.2151C108.474 62.3501 124.384 49.7821 135.438 46.2011C146.38 42.6561 157.091 38.431 167.918 34.547C175.651 31.772 183.302 28.7541 191.118 26.2221C193.329 25.5061 198.775 22.6481 197.947 24.8191C195.33 31.6861 180.235 33.8421 182.717 40.7591C186.337 50.8481 259.007 19.0891 270.708 29.0891C272.074 30.2571 256.007 45.7021 257.405 47.4801C263.529 55.2701 326.626 24.069 336.286 19.177C338.649 17.979 344.507 13.1881 343.377 15.5851C340.241 22.2311 332.921 25.9381 328.146 31.5241",
    },
    notes: {
      viewBox: "0 0 428 74",
      path: "M28.4 44.8C16.6 43.4 8.6 55.2 20.8 57.1C45.7 61 77.4 49.8 101.5 44.7C119.4 40.9 137.1 36.3 154.8 31.8C161.2 30.2 174.6 23.2 173.1 29.6C171.4 36.7 150.9 42.1 154.6 48.4C160.7 58.7 188.7 45.6 200.1 42.2C218.9 36.7 237.3 29.4 256.5 25.5C262.3 24.3 273.2 19.7 272.9 25.6C272.5 33.9 249.8 43.3 256.6 48.1C270.5 58 313.5 36.5 329.8 32.4C341.7 29.4 357.3 20.9 366.5 29.1C372.2 34.2 350.4 47.6 357.7 50.2C376.4 56.8 396.5 39.7 414.3 31.2",
    },
  };
  const underline = underlines[type];

  return (
    <svg
      aria-hidden="true"
      className="page-switcher-underline"
      key={type}
      viewBox={underline.viewBox}
    >
      <path
        className="page-switcher-underline__stroke"
        d={underline.path}
        pathLength={1}
      />
    </svg>
  );
}

function CurrentTimePreview({ label }: { label: string }) {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  const hours = currentTime?.getHours() ?? 0;
  const minutes = currentTime?.getMinutes() ?? 0;
  const seconds = currentTime?.getSeconds() ?? 0;

  useEffect(() => {
    const updateTime = () => setCurrentTime(new Date());

    const initialTimer = window.setTimeout(updateTime, 0);
    const timer = window.setInterval(updateTime, 1000);

    return () => {
      window.clearInterval(timer);
      window.clearTimeout(initialTimer);
    };
  }, []);

  return (
    <div
      aria-label={`${label} ${hours}:${minutes}:${seconds}`}
      className="inline-flex items-center justify-center font-mono text-[14px] font-semibold leading-[22px] tracking-normal"
    >
      <RollingNumber
        directionY={-1}
        duration={500}
        formatOptions={{ minimumIntegerDigits: 2, useGrouping: false }}
        key={`h-${hours}`}
        stagger={58}
        value={hours}
      />
      <span aria-hidden="true" className="px-1">
        :
      </span>
      <RollingNumber
        directionY={-1}
        duration={500}
        formatOptions={{ minimumIntegerDigits: 2, useGrouping: false }}
        key={`m-${minutes}`}
        stagger={58}
        value={minutes}
      />
      <span aria-hidden="true" className="px-1">
        :
      </span>
      <RollingNumber
        directionY={-1}
        duration={500}
        formatOptions={{ minimumIntegerDigits: 2, useGrouping: false }}
        key={`s-${seconds}`}
        stagger={58}
        value={seconds}
      />
    </div>
  );
}

function NumberDeltaPreview() {
  const gains = [24, 38, 16, 42] as const;
  const losses = [-18, -31, -12, -27] as const;
  const [index, setIndex] = useState(0);
  const gain = gains[index % gains.length];
  const loss = losses[index % losses.length];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => current + 1);
    }, 3600);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="inline-flex items-center justify-center gap-4 text-center">
      <NumberDeltaText
        className="font-mono text-[15px] font-semibold leading-[24px] tracking-normal text-neutral-800 dark:text-neutral-100"
        duration={1480}
        stagger={84}
        value={gain}
      />
      <span
        aria-hidden="true"
        className="h-3.5 w-px bg-neutral-200 dark:bg-neutral-700/60"
      />
      <NumberDeltaText
        className="font-mono text-[15px] font-semibold leading-[24px] tracking-normal text-neutral-500 dark:text-neutral-400"
        duration={1480}
        stagger={84}
        value={loss}
      />
    </div>
  );
}

function SpoilerPreview({
  resetLabel,
  text,
}: {
  resetLabel: string;
  text: string;
}) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="relative grid h-full w-full place-items-center text-center">
      <SpoilerText
        className="font-heading text-[14px] font-semibold leading-[22px] tracking-normal text-neutral-800 dark:text-neutral-100"
        onRevealedChange={setRevealed}
        particleColor="color-mix(in srgb, currentColor 82%, transparent)"
        revealed={revealed}
        text={text}
      />
      {revealed ? (
        <Button
          aria-label={resetLabel}
          className="absolute bottom-0 right-0 size-8 rounded-full bg-white text-neutral-500 shadow-sm hover:bg-neutral-100 hover:text-neutral-900 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-neutral-50 [&_svg]:size-3.5"
          onClick={() => setRevealed(false)}
          size="icon"
          type="button"
          variant="secondary"
        >
          <RotateCcwIcon strokeWidth={2.1} />
        </Button>
      ) : null}
    </div>
  );
}

function createMotionCards(
  copy: (typeof pageCopy)[Locale],
  isDark: boolean,
): MotionCard[] {
  return [
    {
      id: "reveal",
      title: copy.cards.reveal.title,
      description: copy.cards.reveal.description,
      scenario: copy.cards.reveal.scenario,
      preview: (
        <div className="grid place-items-center text-center">
          <TextReveal
            className="max-w-56 justify-center text-balance font-heading text-[14px] font-semibold leading-[22px]"
            distance={14}
            duration={560}
            hold={880}
            mode="in-out"
            repeat
            stagger={34}
            text={copy.cards.reveal.previewText}
          />
        </div>
      ),
      code: `<TextReveal text="Letters enter and leave." mode="in-out" repeat />`,
    },
    {
      id: "rolling",
      title: copy.cards.rolling.title,
      description: copy.cards.rolling.description,
      scenario: copy.cards.rolling.scenario,
      preview: <CurrentTimePreview label={copy.currentTimeLabel} />,
      code: `<RollingNumber value={new Date().getSeconds()} />`,
    },
    {
      id: "spoiler",
      title: copy.cards.spoiler.title,
      description: copy.cards.spoiler.description,
      scenario: copy.cards.spoiler.scenario,
      preview: (
        <SpoilerPreview
          resetLabel={copy.resetInvisibleLabel}
          text={copy.cards.spoiler.previewText}
        />
      ),
      code: `<SpoilerText text="Tap to reveal this." />`,
    },
    {
      id: "weight",
      title: copy.cards.weight.title,
      description: copy.cards.weight.description,
      scenario: copy.cards.weight.scenario,
      preview: (
        <div className="grid place-items-center text-center">
          <WeightSweepText
            className="font-heading text-[14px] leading-[22px] tracking-normal"
            maxWeight={820}
            minWeight={280}
            text={copy.cards.weight.previewText}
          />
        </div>
      ),
      code: `<WeightSweepText text="Weight wave passes." />`,
    },
    {
      id: "decrypt",
      title: copy.cards.decrypt.title,
      description: copy.cards.decrypt.description,
      scenario: copy.cards.decrypt.scenario,
      preview: (
        <div className="grid place-items-center text-center">
          <DecryptText
            className="font-mono text-[14px] font-semibold leading-[22px] tracking-normal"
            text={copy.cards.decrypt.previewText}
          />
        </div>
      ),
      code: `<DecryptText text="ACCESS GRANTED" />`,
    },
    {
      id: "gradient",
      title: copy.cards.gradient.title,
      description: copy.cards.gradient.description,
      scenario: copy.cards.gradient.scenario,
      preview: (
        <div className="grid place-items-center text-center">
          <GradientSweepText
            accentColor={isDark ? "rgba(255,255,255,.72)" : "rgba(229,231,235,.92)"}
            angle={90}
            baseColor={isDark ? "rgba(245,245,245,.34)" : "rgba(163,163,163,.52)"}
            className="font-heading text-[14px] font-semibold leading-[22px] tracking-normal text-neutral-800 dark:text-neutral-100"
            duration={2200}
            highlightColor="#ffffff"
          >
            {copy.cards.gradient.previewText}
          </GradientSweepText>
        </div>
      ),
      code: `<GradientSweepText>Highlight sweep</GradientSweepText>`,
    },
    {
      id: "focus",
      title: copy.cards.focus.title,
      description: copy.cards.focus.description,
      scenario: copy.cards.focus.scenario,
      preview: (
        <div className="grid place-items-center text-center">
          <FocusBlurText
            blur={9}
            className="max-w-56 justify-center text-balance font-heading text-[14px] font-semibold leading-[22px]"
            duration={960}
            text={copy.cards.focus.previewText}
          />
        </div>
      ),
      code: `<FocusBlurText text="Focus sharpens softly." />`,
    },
    {
      id: "ai-stream",
      title: copy.cards.aiStream.title,
      description: copy.cards.aiStream.description,
      scenario: copy.cards.aiStream.scenario,
      preview: (
        <div className="grid place-items-center text-center">
          <AiStreamText
            className="max-w-56 justify-center text-balance font-heading text-[14px] font-semibold leading-[22px] tracking-normal text-neutral-950 dark:text-neutral-50"
            colorA="#38bdf8"
            colorB="#a78bfa"
            colorC="#22c55e"
            text={copy.cards.aiStream.previewText}
          />
        </div>
      ),
      code: `<AiStreamText text="Generating thoughtful motion" />`,
    },
    {
      id: "soft-scramble",
      title: copy.cards.softScramble.title,
      description: copy.cards.softScramble.description,
      scenario: copy.cards.softScramble.scenario,
      preview: (
        <div className="grid place-items-center text-center">
          <SoftScrambleText
            className="max-w-56 justify-center text-balance font-heading text-[14px] font-semibold leading-[22px] tracking-normal"
            intensity={0.16}
            text={copy.cards.softScramble.previewText}
          />
        </div>
      ),
      code: `<SoftScrambleText text="Status updated softly" />`,
    },
    {
      id: "ticker",
      title: copy.cards.ticker.title,
      description: copy.cards.ticker.description,
      scenario: copy.cards.ticker.scenario,
      preview: (
        <div className="grid place-items-center text-center">
          <TickerText
            blur={6}
            className="w-56 font-heading text-[14px] font-semibold leading-[22px] tracking-normal"
            duration={18000}
            stagger={34}
            text={copy.cards.ticker.previewText}
          />
        </div>
      ),
      code: `<TickerText text="Stay hungry, stay foolish. Steve Jobs believed..." />`,
    },
    {
      id: "typewriter",
      title: copy.cards.typewriter.title,
      description: copy.cards.typewriter.description,
      scenario: copy.cards.typewriter.scenario,
      preview: (
        <div className="grid place-items-center text-center">
          <TypewriterText
            className="font-mono text-[14px] font-semibold leading-[22px] tracking-normal"
            deleteSpeed={30}
            loopDelay={980}
            speed={56}
            text={copy.cards.typewriter.previewText}
          />
        </div>
      ),
      code: `<TypewriterText text="Typing with a cursor" />`,
    },
    {
      id: "breathing",
      title: copy.cards.breathing.title,
      description: copy.cards.breathing.description,
      scenario: copy.cards.breathing.scenario,
      preview: (
        <div className="grid place-items-center text-center">
          <BreathingText
            blur={1.8}
            className="font-heading text-[14px] font-semibold leading-[22px] tracking-normal"
            duration={3200}
            text={copy.cards.breathing.previewText}
          />
        </div>
      ),
      code: `<BreathingText text="Almost there..." />`,
    },
    {
      id: "breathing-words",
      title: copy.cards.breathingWords.title,
      description: copy.cards.breathingWords.description,
      scenario: copy.cards.breathingWords.scenario,
      preview: (
        <div className="grid place-items-center text-center">
          <BreathingWordsText
            blur={0.7}
            className="max-w-56 justify-center text-balance font-heading text-[14px] font-semibold leading-[22px] tracking-normal"
            duration={4300}
            stagger={150}
            text={copy.cards.breathingWords.previewText}
          />
        </div>
      ),
      code: `<BreathingWordsText text="Quiet signals keep moving" />`,
    },
    {
      id: "delta",
      title: copy.cards.delta.title,
      description: copy.cards.delta.description,
      scenario: copy.cards.delta.scenario,
      preview: <NumberDeltaPreview />,
      code: `<NumberDeltaText value={24} /> <NumberDeltaText value={-18} />`,
    },
    {
      id: "elastic",
      title: copy.cards.elastic.title,
      description: copy.cards.elastic.description,
      scenario: copy.cards.elastic.scenario,
      preview: (
        <div className="grid place-items-center text-center">
          <ElasticLettersText
            className="max-w-56 justify-center text-balance font-heading text-[14px] font-semibold leading-[22px] tracking-normal"
            duration={700}
            stagger={30}
            text={copy.cards.elastic.previewText}
          />
        </div>
      ),
      code: `<ElasticLettersText text="Swift-like motion" />`,
    },
    {
      id: "laser",
      title: copy.cards.laser.title,
      description: copy.cards.laser.description,
      scenario: copy.cards.laser.scenario,
      preview: (
        <div className="grid place-items-center text-center">
          <IridescentText
            className="max-w-56 text-balance font-heading text-[14px] font-semibold leading-[22px] tracking-normal"
            text={copy.cards.laser.previewText}
          />
        </div>
      ),
      code: `<IridescentText text="Matter of care" />`,
    },
    {
      id: "morph",
      title: copy.cards.morph.title,
      description: copy.cards.morph.description,
      scenario: copy.cards.morph.scenario,
      preview: (
        <div className="grid place-items-center text-center">
          <p className="inline-flex max-w-56 items-baseline justify-center font-heading text-[14px] font-semibold leading-[24px] tracking-normal">
            <span>{copy.cards.morph.previewBefore}&nbsp;</span>
            <MorphWordsText
              className="align-baseline text-neutral-950 dark:text-neutral-50"
              words={[...copy.cards.morph.previewWords]}
            />
          </p>
        </div>
      ),
      code: `Build <MorphWordsText words={["better", "faster", "softer"]} />`,
    },
    {
      id: "cursor",
      title: copy.cards.cursor.title,
      description: copy.cards.cursor.description,
      scenario: copy.cards.cursor.scenario,
      preview: (
        <div className="grid place-items-center text-center">
          <HeartbeatText
            className="max-w-56 text-balance font-heading text-[14px] font-semibold leading-[22px] tracking-normal"
            text={copy.cards.cursor.previewText}
          />
        </div>
      ),
      code: `<HeartbeatText text="Still alive" />`,
    },
  ];
}

function MotionCatalogCard({
  index,
  item,
  onOpen,
}: {
  index: number;
  item: MotionCard;
  onOpen: (item: MotionCard, origin: DOMRect) => void;
}) {
  function openCard(event: React.MouseEvent<HTMLDivElement>) {
    onOpen(item, event.currentTarget.getBoundingClientRect());
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    onOpen(item, event.currentTarget.getBoundingClientRect());
  }

  function applyTilt(element: HTMLElement, clientX: number, clientY: number) {
    const rect = element.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    const rotateX = (0.5 - y) * 6;
    const rotateY = (x - 0.5) * 6;

    element.classList.add("is-hover", "is-tilting");
    element.style.setProperty("--catalog-rx", `${rotateX.toFixed(2)}deg`);
    element.style.setProperty("--catalog-ry", `${rotateY.toFixed(2)}deg`);
  }

  function resetTilt(element: HTMLElement) {
    element.classList.remove("is-hover", "is-tilting");
    element.style.setProperty("--catalog-rx", "0deg");
    element.style.setProperty("--catalog-ry", "0deg");
  }

  return (
    <div
      className="motion-catalog-card-shell"
      style={{ "--motion-card-index": index } as CSSProperties}
    >
      <Card
        className="motion-catalog-card group cursor-pointer overflow-hidden rounded-[1.25rem] border-neutral-200/45 bg-white shadow-[0_1px_1px_rgba(15,23,42,.02)] outline-none hover:border-neutral-300/70 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 before:hidden dark:border-neutral-800/55 dark:bg-neutral-900 dark:hover:border-neutral-700/45 sm:rounded-[1.5rem]"
        onClick={openCard}
        onKeyDown={handleKeyDown}
        onPointerCancel={(event) => resetTilt(event.currentTarget)}
        onPointerEnter={(event) =>
          applyTilt(event.currentTarget, event.clientX, event.clientY)
        }
        onPointerLeave={(event) => resetTilt(event.currentTarget)}
        onPointerMove={(event) =>
          applyTilt(event.currentTarget, event.clientX, event.clientY)
        }
        onPointerUp={(event) =>
          event.currentTarget.classList.remove("is-tilting")
        }
        role="button"
        tabIndex={0}
      >
        <div className="m-2 flex h-[132px] items-center justify-center rounded-[0.75rem] border border-neutral-200/45 bg-neutral-50 p-3 dark:border-neutral-700/28 dark:bg-neutral-950/28 sm:m-3 sm:h-[218px] sm:p-5">
          {item.preview}
        </div>
        <div className="px-3 pb-3 pt-1 sm:px-5 sm:pb-5">
          <div className="min-w-0">
            <h2 className="font-semibold text-[13px] leading-5 text-neutral-900 dark:text-neutral-100">
              {item.title}
            </h2>
            <p className="mt-0.5 text-[11px] leading-4 text-neutral-500 dark:text-neutral-400 sm:text-[12px] sm:leading-5">
              {item.description}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function CopyCodeButton({
  className,
  code,
  iconClassName,
  label,
  size = "icon",
}: {
  className?: string;
  code: string;
  iconClassName: string;
  label: string;
  size?: "icon" | "icon-xs";
}) {
  const [copied, setCopied] = useState(false);
  const resetTimerRef = useRef<number | null>(null);
  const Icon = copied ? CheckIcon : CopyIcon;

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  function handleCopy(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    void navigator.clipboard?.writeText(code);
    setCopied(true);

    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
    }

    resetTimerRef.current = window.setTimeout(() => {
      setCopied(false);
      resetTimerRef.current = null;
    }, 1400);
  }

  return (
    <Button
      aria-label={label}
      className={className}
      onClick={handleCopy}
      size={size}
      variant="ghost"
    >
      <Icon className={iconClassName} />
    </Button>
  );
}

const codeModeLabels: Record<CodeMode, string> = {
  css: "CSS",
  react: "React",
  framer: "Framer Motion",
  prompt: "提示词",
};

const motionImplementationPrompts: Record<string, string> = {
  reveal: `实现“逐字显隐”文本动效：
- 不要安装 motion-text-kit、Framer Motion 或其他动画组件库，只用 React + CSS。
- 创建一个 TextReveal 组件，props 至少包含 text、splitBy("character"|"word")、mode("in"|"out"|"in-out")、duration、hold、stagger、distance、blur、repeat、className、style。
- 用 Intl.Segmenter 按 grapheme 拆字符，浏览器不支持时 fallback 到 Array.from；按词拆分时保留空格，让换行和间距不丢失。
- 根元素使用 aria-label={text} 保存可读文本，每个视觉字符 span 设置 aria-hidden="true"，并用 CSS 变量 --index 控制 stagger。
- CSS：根元素 inline-flex + flex-wrap + white-space: pre-wrap；字符初始 opacity:0、filter:blur(var(--blur))、transform:translateY(var(--distance))。
- keyframes：in 从下方模糊进入到清晰；out 从清晰向上淡出；in-out 的 0% 进入、30%-68% 停留、100% 向上淡出。每个字符 delay = baseDelay + index * stagger。
- repeat=true 时循环播放，否则只播放一次；prefers-reduced-motion 下禁用动画，所有字符直接清晰显示。`,
  rolling: `实现“数字计时 / 滚动数字”动效：
- 不要安装 motion-text-kit、Framer Motion 或其他动画组件库，只用 React + CSS。
- 创建 RollingNumber 组件，props 包含 value、locale、formatOptions、prefix、suffix、duration、stagger、distance、blur、directionX、directionY、className、style。
- 用 Intl.NumberFormat 格式化数字，把 prefix + formatted value + suffix 拆成字符；根元素 aria-label 使用完整字符串，视觉字符 aria-hidden。
- 根元素 inline-flex、align-items: baseline、font-variant-numeric: tabular-nums，避免数字宽度跳动。
- 每个字符 span 设置 --index；CSS keyframes 从 opacity:0、blur、translate(direction * distance) 进入到 opacity:1、blur(0)、translate(0)。
- 每个字符 animation-delay = index * stagger，easing 使用带回弹的 cubic-bezier(0.34,1.45,0.64,1)。
- 如果要做 HH:mm:ss 当前时间，用 setInterval 每秒更新 Date，并分别渲染 hour/minute/second；变化时可通过 key 重新挂载对应 RollingNumber 触发动画。
- prefers-reduced-motion 下禁用动画，数字直接显示。`,
  spoiler: `实现“隐形墨水”文本揭示动效：
- 不要安装 motion-text-kit、Framer Motion 或其他动画组件库，只用 React + CSS。
- 创建 SpoilerText 组件，props 包含 text、defaultRevealed、revealed、onRevealedChange、interactive、particleColor、duration、revealDuration、className、style。
- 支持受控和非受控 revealed 状态；interactive=true 时根元素用 button 语义或 role="button" + tabIndex=0，支持点击、Enter、Space 揭示。
- DOM 使用一个根容器，内部两层：content 层放真实文本，particles 层放遮罩颗粒。根元素 aria-label={text}，视觉层 aria-hidden 按需设置。
- 未揭示时 content opacity:0 + blur(3px)，particles 用多层 radial-gradient 生成细小颗粒，并用 steps 动画轻微漂移和闪烁。
- 鼠标/触摸移动时记录指针相对位置到 CSS 变量 --x、--y；hover/active 时用 radial-gradient mask 在指针附近开一个小窗口。
- 揭示时设置 data-revealed：content 清晰可见并取消 mask，particles opacity 降到 0、blur 增加，形成墨水散开的感觉。
- 可选增强：支持 CSS Houdini paint worklet；如果浏览器不支持、worklet 加载失败或 Safari 环境，自动使用 CSS gradient fallback。
- prefers-reduced-motion 下直接显示明文，不播放颗粒和揭示动画。`,
  weight: `实现“字重扫光”文本动效：
- 不要安装 motion-text-kit、Framer Motion 或其他动画组件库，只用 React + CSS。
- 创建 WeightSweepText 组件，props 包含 text、minWeight、maxWeight、duration、stagger、delay、className、style。
- 把 text 拆成 grapheme 字符；根元素 inline-flex + white-space: pre-wrap；根元素 aria-label={text}，字符 span aria-hidden。
- 每个字符外层 cell 用 inline-grid，并用 ::before 放同一个字符、font-weight=maxWeight、visibility:hidden 作为占位，避免字重变化导致布局抖动。
- 可见字符绝对定位在 cell 内，设置 font-weight 和 font-variation-settings:"wght" var(--weight)。
- keyframes：0%/14%/100% 为 minWeight，34%/70% 为中间字重，52% 到 maxWeight。每个字符 delay = index * stagger，形成扫过文字的波。
- 使用较慢 duration（约 2600ms）和 cubic-bezier(.45,0,.15,1)，让它像排版质感而不是强提示。
- prefers-reduced-motion 下停止动画，直接显示 maxWeight 或正常字重。`,
  decrypt: `实现“文本解码”动效：
- 不要安装 motion-text-kit、Framer Motion 或其他动画组件库，只用 React + CSS。
- 创建 DecryptText 组件，props 包含 text、alphabet、duration、tick、loop、loopDelay、className、style。
- 用 useState 保存 displayText；用 useEffect 启动 interval，每 tick 根据 elapsed/duration 计算 progress。
- revealedCount = floor(progress * text.length)。index < revealedCount 或空格时显示原字符，其他位置从 alphabet 中随机取字符。
- progress 到 1 后清除 interval，displayText 固定为最终 text；loop=true 时等待 loopDelay 后重新开始。
- 根元素 aria-label={text}，内部 span aria-hidden 显示 displayText；使用 font-variant-numeric: tabular-nums、white-space: pre 保持稳定宽度。
- CSS 可加轻微 flicker：steps(12) opacity 在 0.78-1 之间变化，强化终端解码感但不要过度闪烁。
- 组件卸载时清理 interval/timeout；prefers-reduced-motion 下直接显示最终 text。`,
  gradient: `实现“文本高光扫过”动效：
- 不要安装 motion-text-kit、Framer Motion 或其他动画组件库，只用 React + CSS。
- 创建 GradientSweepText 组件，props 包含 children、duration、delay、angle、baseColor、highlightColor、accentColor、pauseOnHover、className、style。
- 根元素 inline-block，文字本身通过 background-clip:text 显示；不要额外包每个字符。
- background-image 使用两层：底层是 baseColor 的线性渐变，顶层是透明 -> accent -> highlight -> accent -> 透明的窄高光带。
- 顶层 background-size 约 300% 100%，background-position 从 100% 50% 动画到 0% 50%，duration 约 2800ms，linear infinite。
- 设置 -webkit-background-clip:text、background-clip:text、-webkit-text-fill-color:transparent；保留 color:inherit 作为降级基础。
- pauseOnHover=true 时 hover 暂停 animation-play-state。
- prefers-reduced-motion 下禁用动画，并把 -webkit-text-fill-color 恢复为 currentColor，保证文字清晰可读。`,
  focus: `实现“模糊聚焦”文本动效：
- 不要安装 motion-text-kit、Framer Motion 或其他动画组件库，只用 React + CSS。
- 创建 FocusBlurText 组件，props 包含 text、duration、delay、blur、scale、repeat、iterationCount、className、style。
- 根元素 aria-label={text}，内部视觉 span aria-hidden 显示 text；根元素 inline-block + white-space: pre-wrap。
- CSS 变量控制 --duration、--cycle、--blur、--scale。cycle 可为 duration + 停留时间，默认约 2400ms。
- keyframes：0% opacity:0、filter:blur(blur)、scale(scale)；28%-72% 清晰、opacity:1、scale(1)；82% 轻微再失焦；100% opacity:0、blur(blur*.65)、scale(1.045)。
- repeat=true 时 infinite，否则按 iterationCount 播放。
- 动效语气要安静：blur 和 scale 都要小，适合“从不确定到确定”的状态。
- prefers-reduced-motion 下直接显示清晰文本。`,
  "ai-stream": `实现“AI 流式显现”文本动效：
- 不要安装 motion-text-kit、Framer Motion 或其他动画组件库，只用 React + CSS。
- 创建 AiStreamText 组件，props 包含 text、duration、hold、stagger、distance、blur、mutedColor、colorA、colorB、colorC、repeat、className、itemClassName、style。
- 用 Intl.Segmenter 拆 grapheme；根元素 aria-label={text}，每个字符 span aria-hidden，并设置 data-char 和 --char-delay。
- 字符本体 keyframes：从 mutedColor、opacity:0、blur、translateY(distance) 上浮进入；中段保持 mutedColor；结束变成 inherit、opacity:1、blur(0)、translateY(0)。
- 每个字符用 ::after 叠一层同字符彩色渐变，background-clip:text，渐变从右到左扫过；0%-26% 不透明度为 0，约 50% 显示，82%-100% 淡出。
- repeat=true 时用 React 定时控制 cycle：先把整行 data-cycle-hidden 置为隐藏，等待 resetGuard 后显示字符，接近 cycle 末尾时淡出整行，再进入下一轮。这样避免循环时突然闪回完整文本。
- cycle = duration + stagger * (字符数 - 1) + hold；整行隐藏用 opacity + blur transition。
- prefers-reduced-motion 下禁用所有动画，直接显示完整文本。`,
  "soft-scramble": `实现“柔和扰动”文本动效：
- 不要安装 motion-text-kit、Framer Motion 或其他动画组件库，只用 React + CSS。
- 创建 SoftScrambleText 组件，props 包含 text、alphabet、duration、delay、tick、intensity、loop、loopDelay、className、itemClassName、style。
- 用 Intl.Segmenter 拆 grapheme；只允许非空白字符参与扰动，空格始终保留。
- 用 useState 保存 displayParts 和 activeIndexes。每 tick 计算 progress=elapsed/duration，wave=Math.sin(progress*Math.PI)，扰动数量 = ceil(可变字符数 * intensity * wave)。
- 每 tick 从可变字符索引中随机挑一批 activeIndexes，把这些位置替换为 alphabet 随机字符；progress 到 1 时恢复原文本。
- 每个字符 span aria-hidden；根元素 aria-label={text}，inline-flex + flex-wrap + white-space: pre-wrap。
- active 字符用 CSS transition 做轻微 color 变淡、blur(.45px)、opacity(.76)、translateY(-.04em)、scale(.98)，tick 约 70ms。
- loop=true 时等待 loopDelay 后重播；组件卸载清理 interval/timeout；prefers-reduced-motion 下直接显示原文本。`,
  ticker: `实现“流动字幕”文本动效：
- 不要安装 motion-text-kit、Framer Motion 或其他动画组件库，只用 React + CSS。
- 创建 TickerText 组件，props 包含 text、duration、delay、blur、stagger、repeat、className、itemClassName、style。
- 用 Intl.Segmenter 拆 grapheme，把空格渲染为 non-breaking space。为实现无缝循环，把同一段文本复制 4 份，每份末尾加 gap。
- 根容器 inline-block、overflow:hidden、white-space:nowrap、固定或最大宽度；track 使用 inline-flex，keyframes 从 translateX(0) 到 translateX(-25%)。
- 每个字符单独 span，方便做边缘效果。用 requestAnimationFrame 读取容器和字符 rect，计算字符离左右边缘的 progress。
- 根据 progress 给字符写 CSS 变量：edge opacity、edge blur、edge scale、edge x。越靠边越透明、越模糊、越小，并向外侧轻微偏移。
- hover 可选择降低速度；repeat=false 时只播放指定次数。
- prefers-reduced-motion 下停止横向动画，取消边缘 blur/scale/opacity，完整显示文本。`,
  typewriter: `实现“打字光标”文本动效：
- 不要安装 motion-text-kit、Framer Motion 或其他动画组件库，只用 React + CSS。
- 创建 TypewriterText 组件，props 包含 text、speed、startDelay、loop、loopDelay、deleteSpeed、cursor、className、style。
- 用 useState 保存 visibleCount、exitCount、phase("idle"|"typing"|"deleting")；按 speed 递增 visibleCount，输入完成后等待 loopDelay，再按 deleteSpeed 递减。
- 删除时不要立刻移除字符：把 exitCount 保持在旧数量约 260ms，让离开的字符有 out 动画，动画后再收缩。
- DOM：根元素 aria-label={text}；letters 容器 aria-hidden；渲染 characters.slice(0, max(visibleCount, exitCount))。
- 每个字符根据状态设置 data-state="entering|settled|leaving"，靠近光标的 settled 字符可设置 data-near 产生细微缩放。
- CSS entering：max-inline-size 从 0 到 1em，opacity 0->1，blur 1.2px->0，translateX(-.12em)->0；leaving 反向收缩并向右淡出。
- 光标 span 使用 steps(2) 闪烁；typing/deleting 阶段光标常亮。
- prefers-reduced-motion 下直接显示完整文本和静态光标。`,
  breathing: `实现“呼吸文本”动效：
- 不要安装 motion-text-kit、Framer Motion 或其他动画组件库，只用 React + CSS。
- 创建 BreathingText 组件，props 包含 text、duration、delay、blur、scale、minOpacity、repeat、className、style。
- 根元素直接显示 text，aria-label 可省略或等于 text；display:inline-block，transform-origin:50% 55%。
- CSS keyframes：0% 和 100% 使用 opacity=minOpacity、filter:blur(blur)、scale(.988)；50% 使用 opacity:1、blur(0)、scale(scale)。
- duration 默认约 3200ms，easing 使用 cubic-bezier(.45,0,.15,1)，循环无限。幅度必须很小，像等待态呼吸，不要像弹跳。
- 支持 repeat=false 或 iterationCount 时只播放有限次数。
- prefers-reduced-motion 下停止动画，显示 opacity:1、filter:none、transform:none。`,
  "breathing-words": `实现“词语呼吸”文本动效：
- 不要安装 motion-text-kit、Framer Motion 或其他动画组件库，只用 React + CSS。
- 创建 BreathingWordsText 组件，props 包含 text、duration、stagger、variance、minOpacity、maxOpacity、blur、repeat、className、itemClassName、style。
- 用正则 /\\S+\\s*|\\s+/g 按词拆分并保留空格；根元素 aria-label={text}，每个词 span aria-hidden。
- 根元素 inline-flex + flex-wrap + white-space: pre-wrap。每个词设置 --index、--word-duration、--word-opacity。
- 为避免所有词同步，用固定的 variance 序列如 [0.18,-0.12,0.08,-0.2,0.14,-0.06] 调整每个词 duration；最短不要低于 900ms。
- keyframes：0%/100% opacity=minOpacity + blur；42% opacity=wordOpacity + blur(0)；64% 轻微回落到 wordOpacity*.86 和 blur*.28。
- 每个词 delay = index * stagger，形成柔和、错落的 ambient breathing。
- prefers-reduced-motion 下所有词清晰显示。`,
  delta: `实现“数字涨跌”动效：
- 不要安装 motion-text-kit、Framer Motion 或其他动画组件库，只用 React + CSS。
- 创建 NumberDeltaText 组件，props 包含 value、locale、formatOptions、prefix、suffix、showSign、duration、stagger、distance、blur、className、style。
- 用 Intl.NumberFormat 格式化 Math.abs(value)，再按 showSign 添加 + 或 -；根元素 data-direction 根据 value 正负设置 up/down。
- 用 useState 保存上一帧 label、当前 label、version。value 或 label 变化时，把当前 label 存为 previousLabel 并 version+1。
- 为了逐位对齐，把 previousLabel 和 currentLabel padStart 到同样长度，再拆字符。
- 数字位变化时计算最短轮盘路径：例如 6->3 向下经过 5、4、3；3->8 向上经过 4、5、6、7、8。非数字位用 old/new 两层淡入淡出。
- CSS：每位 digit-cell 宽 1ch、高约 1.62em、overflow:hidden、上下 mask 渐隐；wheel 用 column flex，translateY 从 from 到 to。
- 正数新数字从下向上进入，负数相反；每位 delay = index * stagger。
- prefers-reduced-motion 下直接显示当前 label。`,
  elastic: `实现“弹性字母”文本动效：
- 不要安装 motion-text-kit、Framer Motion 或其他动画组件库，只用 React + CSS。
- 创建 ElasticLettersText 组件，props 包含 text、duration、stagger、stretch、blur、repeat、className、itemClassName、style。
- 用 Intl.Segmenter 拆 grapheme；根元素 aria-label={text}，字符 span aria-hidden；根元素 inline-flex、align-items:baseline、white-space:pre-wrap。
- 每个字符初始 opacity:0、filter:blur(blur)、transform:scaleX(.58)，transform-origin:0 50%。
- keyframes：0% 压缩且模糊；18% 拉伸到 stretch(约 1.22) 并接近可见；32%-72% 回到 scaleX(1) 且清晰；100% 可轻微淡出/压缩用于循环。
- 字符 delay = index * stagger，easing 使用 cubic-bezier(.18,1.18,.28,1) 形成 SwiftUI 式轻弹。
- 如果只做入场，把 100% 保持清晰；如果循环，cycle 可大于 duration 留出停留时间。
- prefers-reduced-motion 下直接显示完整文本。`,
  laser: `实现“虹彩文字”动效：
- 不要安装 motion-text-kit、Framer Motion 或其他动画组件库，只用 React + CSS。
- 创建 IridescentText 组件，props 包含 text、duration、delay、colorA、colorB、colorC、intensity、repeat、className、style。
- 根元素显示普通 text，同时设置 position:relative、display:inline-block、isolation:isolate、data-text={text}。
- 用 ::after 叠加同样的文字 content:attr(data-text)，设置多色 linear-gradient 背景，background-size 约 260% 150%，background-clip:text，text-fill-color:transparent。
- ::after 的 keyframes：起始 background-position 180% 50%、opacity:0；24%-72% 横向流过并提高 opacity；88%-100% 移出并 opacity:0。
- 根元素本身只做非常轻微的 saturate/brightness 变化，保持普通正文色，不要一直保持彩虹色。
- intensity 控制 ::after 的 opacity、saturate、brightness；默认材质感克制，适合短句。
- prefers-reduced-motion 下禁用动画，显示普通文本或静态轻微虹彩。`,
  morph: `实现“词语变形”动效：
- 不要安装 motion-text-kit、Framer Motion 或其他动画组件库，只用 React + CSS。
- 创建 MorphWordsText 组件，props 包含 words、duration、delay、blur、scale、repeat、className、itemClassName、style。
- 用 useState 保存 activeIndex、previousIndex、cycles；每 duration+delay 切到下一个词，并把旧 activeIndex 记为 previousIndex。
- 根元素 inline-grid、white-space:pre、inline-size:max-content；aria-label 使用 words.join(", ")。
- 加一个隐藏 sizer span，内容为最长词，visibility:hidden、opacity:0，用来固定容器宽度，避免关键词切换时布局跳动。
- 所有词绝对叠在同一 grid-area。active 词 opacity:1、blur(0)、scale(1)、translateX(0)；previous 词 opacity:0、blur(blur*.75)、scale(1.018)、translateX(-.14em)；idle 词隐藏在右侧轻微 blur + scale(scale)。
- transition duration 约为 duration 的 0.34，previous 稍短；easing 使用 cubic-bezier(.22,1,.36,1)。
- prefers-reduced-motion 下只显示第一个词，其他词 opacity:0。`,
  cursor: `实现“心跳文本”动效：
- 不要安装 motion-text-kit、Framer Motion 或其他动画组件库，只用 React + CSS。
- 创建 HeartbeatText 组件，props 包含 text、duration、delay、scale、settleScale、blur、repeat、className、style。
- 根元素直接显示 text，display:inline-block，transform-origin:50% 58%，white-space:pre-wrap。
- 使用一个循环 keyframes 模拟真实双峰心跳，而不是普通 pulse：0%-16% 静止；22% 轻微收缩 scale(.992)；30% 第一拍放大到 scale；38% 回落；48% 第二拍放大到 settleScale；60% 回到 1；76%-100% 保持静止。
- 第一拍可以加入很轻的 blur，opacity 保持接近 1，不要改变颜色或加明显 glow，避免廉价闪烁。
- duration 默认约 1650ms，easing 使用 cubic-bezier(.2,0,.12,1)。
- prefers-reduced-motion 下停止动画，显示静态文本。`,
};

function getPromptSnippet(item: MotionCard): string {
  const implementationPrompt =
    motionImplementationPrompts[item.id] ??
    `实现“${item.title}”文本动效：
- 不要安装 motion-text-kit、Framer Motion 或其他动画组件库，只用 React + CSS。
- 创建一个可复用 React 组件，支持 className、style、duration、delay、repeat 等基础 props。
- 优先用 CSS animation / transition 实现动效，React 只负责拆分文本、状态切换和定时。
- 根元素保留 aria-label，视觉拆分字符或词语时给子元素 aria-hidden="true"。
- 使用 CSS 变量暴露时长、延迟、模糊、距离、颜色等参数，方便业务侧覆盖。
- 加入 prefers-reduced-motion 降级，关闭动画后仍完整显示文本。`;

  return `请在现有 React 项目中从零实现一个“${item.title}”文本动效，不安装 npm 组件库，也不要依赖 motion-text-kit。

动效目标：${item.description}
适用场景：${item.scenario}

${implementationPrompt}

交付要求：
- 输出完整组件代码和配套 CSS；如果项目使用 Tailwind，也把关键动画写成普通 CSS，避免依赖额外插件。
- 组件应可复制到任意 React / Next.js / Vite 项目中使用。
- 默认样式不要侵入业务排版，只控制 display、white-space、animation、transform、filter、opacity 等动效必要属性。
- 注意清理 setTimeout、setInterval、requestAnimationFrame，避免组件卸载后继续运行。
- 保持动效克制、流畅、产品级，不要加入无关装饰。`;
}

function getCodeSnippets(item: MotionCard): Record<CodeMode, string> {
  const componentNames = Array.from(
    new Set([...item.code.matchAll(/<([A-Z][A-Za-z0-9]*)/g)].map((match) => match[1])),
  );
  const imports = componentNames.length ? componentNames.join(", ") : "TextReveal";
  const demoName = `${componentNames[0] ?? "TextMotion"}Demo`;
  const reactBody = item.code.trim().startsWith("<")
    ? item.code
    : `<>${item.code}</>`;

  return {
    css: `/* ${item.title} - CSS sketch */
.motion-${item.id} {
  display: inline-block;
  animation: motion-${item.id} 720ms cubic-bezier(.22, 1, .36, 1) both;
  will-change: opacity, filter, transform;
}

@keyframes motion-${item.id} {
  0% {
    opacity: 0;
    filter: blur(8px);
    transform: translate3d(0, 8px, 0) scale(.98);
  }

  100% {
    opacity: 1;
    filter: blur(0);
    transform: translate3d(0, 0, 0) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .motion-${item.id} {
    animation: none;
    filter: none;
    opacity: 1;
    transform: none;
  }
}`,
    react: `import { ${imports} } from "motion-text-kit";
import "motion-text-kit/styles.css";

export function ${demoName}() {
  return (
    ${reactBody}
  );
}`,
    framer: `import { motion } from "framer-motion";

export function ${demoName}() {
  return (
    <motion.span
      initial={{ opacity: 0, filter: "blur(8px)", y: 8, scale: 0.98 }}
      animate={{ opacity: 1, filter: "blur(0px)", y: 0, scale: 1 }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
    >
      ${item.title}
    </motion.span>
  );
}`,
    prompt: getPromptSnippet(item),
  };
}

function ExpandedMotionCardOverlay({
  copyLabel,
  expanded,
  onClose,
  scenarioLabel,
}: {
  copyLabel: string;
  expanded: ExpandedMotionCard;
  onClose: () => void;
  scenarioLabel: string;
}) {
  const [codeMode, setCodeMode] = useState<CodeMode>("react");
  const codeSnippets = getCodeSnippets(expanded.item);
  const selectedCode = codeSnippets[codeMode];
  const overlayStyle = {
    "--motion-card-origin-x": `${expanded.origin.left}px`,
    "--motion-card-origin-y": `${expanded.origin.top}px`,
    "--motion-card-origin-w": `${expanded.origin.width}px`,
    "--motion-card-origin-h": `${expanded.origin.height}px`,
    "--motion-card-target-w": `${Math.min(window.innerWidth - 24, 760)}px`,
    "--motion-card-target-h": `${Math.min(window.innerHeight - 28, 620)}px`,
    "--motion-card-start-x": `${
      expanded.origin.left + expanded.origin.width / 2 - window.innerWidth / 2
    }px`,
    "--motion-card-start-y": `${
      expanded.origin.top + expanded.origin.height / 2 - window.innerHeight / 2
    }px`,
    "--motion-card-start-scale-x": `${(
      expanded.origin.width / Math.min(window.innerWidth - 24, 760)
    ).toFixed(4)}`,
    "--motion-card-start-scale-y": `${(
      expanded.origin.height / Math.min(window.innerHeight - 28, 620)
    ).toFixed(4)}`,
  } as React.CSSProperties & Record<`--${string}`, string>;
  const glassFilter =
    expanded.state === "open"
      ? "blur(34px) saturate(1.22)"
      : "blur(0px) saturate(1)";
  const glassStyle = {
    backdropFilter: glassFilter,
    WebkitBackdropFilter: glassFilter,
  } as React.CSSProperties;

  return (
    <div
      className="motion-card-overlay"
      data-state={expanded.state}
      role="presentation"
      style={overlayStyle}
    >
      <span
        aria-hidden="true"
        className="motion-card-glass"
        style={glassStyle}
      />
      <button
        aria-label="Close expanded card"
        className="motion-card-backdrop"
        onClick={onClose}
        type="button"
      />
      <div
        aria-label={expanded.item.title}
        aria-modal="true"
        className="motion-card-expanded"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="motion-card-expanded__preview">
          {expanded.item.preview}
        </div>
        <div className="motion-card-expanded__body">
          <div className="motion-card-expanded__content min-w-0">
            <h2 className="font-semibold text-[16px] leading-6 text-neutral-900 dark:text-neutral-100">
              {expanded.item.title}
            </h2>
            <p className="mt-1 text-[13px] leading-6 text-neutral-500 dark:text-neutral-400">
              {expanded.item.description}
            </p>
            <div className="mt-4 border-t border-neutral-200/60 pt-3 dark:border-neutral-800">
              <p className="text-[11px] font-semibold leading-4 text-neutral-400 dark:text-neutral-500">
                {scenarioLabel}
              </p>
              <p className="mt-1 text-[13px] leading-6 text-neutral-500 dark:text-neutral-400">
                {expanded.item.scenario}
              </p>
            </div>
            <div className="motion-code-panel mt-4">
              <Tabs
                className="w-fit gap-0"
                onValueChange={(value) => setCodeMode(value as CodeMode)}
                value={codeMode}
              >
                <TabsList className="motion-code-tabs rounded-full bg-neutral-100 p-1 dark:bg-white/[0.08] [&_[data-slot=tab-indicator]]:rounded-full">
                  {(Object.keys(codeModeLabels) as CodeMode[]).map((mode) => (
                    <TabsTab
                      className="motion-code-tab h-7 rounded-full px-3 text-[11px] text-neutral-500 hover:text-neutral-800 data-active:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-200 dark:data-active:text-neutral-50"
                      key={mode}
                      value={mode}
                    >
                      {codeModeLabels[mode]}
                    </TabsTab>
                  ))}
                </TabsList>
              </Tabs>
              <div className="motion-code-preview relative overflow-hidden rounded-2xl border border-neutral-200/60 bg-neutral-100/70 dark:border-white/[0.08] dark:bg-neutral-950/60">
                <ScrollArea className="motion-code-scroll" scrollbarGutter scrollFade>
                  <pre className="m-0 p-3 pr-11 text-left">
                    <code>{selectedCode}</code>
                  </pre>
                </ScrollArea>
                <CopyCodeButton
                  className="motion-code-copy absolute right-2.5 top-2.5 !size-7 rounded-full bg-transparent text-neutral-500 shadow-none hover:bg-neutral-200 hover:text-neutral-950 active:shadow-none dark:text-neutral-400 dark:hover:bg-white/[0.08] dark:hover:text-neutral-50"
                  code={selectedCode}
                  iconClassName="size-3.5"
                  label={`${copyLabel} ${codeModeLabels[codeMode]}`}
                  size="icon"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocsCodeBlock({
  code,
  label,
}: {
  code: string;
  label: string;
}) {
  return (
    <div className="relative rounded-2xl border border-neutral-200/70 bg-neutral-100 p-3 text-neutral-800 shadow-[0_1px_1px_rgba(15,23,42,.04)] dark:border-white/8 dark:bg-neutral-950 dark:text-neutral-100 sm:p-4">
      <pre className="overflow-x-auto pr-9 font-mono text-[11px] leading-6 tracking-normal sm:pr-10 sm:text-[12px]">
        <code>{code}</code>
      </pre>
      <CopyCodeButton
        className="absolute right-3 top-3 !size-7 rounded-full bg-transparent text-neutral-500 shadow-none hover:bg-neutral-200 hover:text-neutral-900 active:shadow-none dark:text-neutral-400 dark:hover:bg-white/8 dark:hover:text-neutral-50 [&_svg]:size-3.5"
        code={code}
        iconClassName="size-3.5"
        label={label}
        size="icon"
      />
    </div>
  );
}

type DocsApiItem = {
  name: string;
  description: string;
  usage: string;
  props: string[];
};

const docsApiItems: DocsApiItem[] = [
  {
    name: "TextReveal",
    description: "逐字或逐词进入、消失，也可以循环播放。",
    usage: '<TextReveal text="Letters enter and leave." mode="in-out" repeat />',
    props: [
      "text",
      "splitBy",
      "mode",
      "duration",
      "hold",
      "stagger",
      "distance",
      "blur",
      "repeat",
    ],
  },
  {
    name: "GradientSweepText",
    description: "柔和高光从文字表面滑过，适合强调短句。",
    usage: "<GradientSweepText>Stay hungry, stay foolish.</GradientSweepText>",
    props: [
      "children",
      "duration",
      "delay",
      "angle",
      "baseColor",
      "highlightColor",
      "accentColor",
      "pauseOnHover",
    ],
  },
  {
    name: "RollingNumber",
    description: "数字字符弹入，适合时间、倒计时和统计数字。",
    usage: '<RollingNumber value={128000} prefix="$" locale="en-US" />',
    props: [
      "value",
      "locale",
      "formatOptions",
      "prefix",
      "suffix",
      "duration",
      "stagger",
      "distance",
      "blur",
    ],
  },
  {
    name: "NumberDeltaText",
    description: "数字涨跌按轮盘路径滚动，支持正负方向感。",
    usage: "<NumberDeltaText value={24} />",
    props: [
      "value",
      "locale",
      "formatOptions",
      "prefix",
      "suffix",
      "showSign",
      "duration",
      "blur",
      "stagger",
    ],
  },
  {
    name: "SpoilerText",
    description: "隐形墨水式文本揭示，用于敏感内容或谜底。",
    usage: '<SpoilerText text="Tap to reveal this." />',
    props: [
      "text",
      "revealed",
      "defaultRevealed",
      "onRevealedChange",
      "particleColor",
      "duration",
      "revealDuration",
      "interactive",
      "workletUrl",
    ],
  },
  {
    name: "DecryptText",
    description: "随机字符逐步解析为最终文本。",
    usage: '<DecryptText text="ACCESS GRANTED" />',
    props: ["text", "alphabet", "duration", "tick", "loop", "loopDelay"],
  },
  {
    name: "WeightSweepText",
    description: "字重从细到粗扫过文字，形成轻量强调。",
    usage: '<WeightSweepText text="Weight wave passes." />',
    props: ["text", "minWeight", "maxWeight", "duration", "stagger"],
  },
  {
    name: "FocusBlurText",
    description: "整体文字从模糊聚焦到清晰，再柔和消失。",
    usage: '<FocusBlurText text="Focus sharpens softly." />',
    props: [
      "text",
      "duration",
      "delay",
      "blur",
      "scale",
      "repeat",
      "iterationCount",
    ],
  },
  {
    name: "AiStreamText",
    description: "字符上浮显现，经过彩色渐变闪过后落成正文色。",
    usage: '<AiStreamText text="Generating thoughtful motion" />',
    props: [
      "text",
      "duration",
      "delay",
      "hold",
      "stagger",
      "distance",
      "blur",
      "mutedColor",
      "colorA",
      "colorB",
      "colorC",
      "repeat",
      "itemClassName",
    ],
  },
  {
    name: "SoftScrambleText",
    description: "少量字符轻微随机替换后归位，形成柔和内容刷新感。",
    usage: '<SoftScrambleText text="Status updated softly" />',
    props: [
      "text",
      "alphabet",
      "duration",
      "delay",
      "tick",
      "intensity",
      "loop",
      "loopDelay",
      "itemClassName",
    ],
  },
  {
    name: "TickerText",
    description: "横向滚动公告，两端字符渐隐、缩小并模糊。",
    usage: '<TickerText text="Motion text kit is now available." />',
    props: [
      "text",
      "duration",
      "delay",
      "blur",
      "stagger",
      "repeat",
      "itemClassName",
    ],
  },
  {
    name: "TypewriterText",
    description: "逐字输入和删除，带跟随文本的光标。",
    usage: '<TypewriterText text="Typing with a cursor" />',
    props: [
      "text",
      "speed",
      "startDelay",
      "loop",
      "loopDelay",
      "deleteSpeed",
      "cursor",
    ],
  },
  {
    name: "BreathingText",
    description: "整体文字做轻微 opacity、blur、scale 呼吸。",
    usage: '<BreathingText text="Almost there..." />',
    props: [
      "text",
      "duration",
      "delay",
      "blur",
      "scale",
      "minOpacity",
      "repeat",
    ],
  },
  {
    name: "BreathingWordsText",
    description: "每个词以不同节奏做轻微明暗和模糊呼吸。",
    usage: '<BreathingWordsText text="Quiet signals keep moving" />',
    props: [
      "text",
      "duration",
      "delay",
      "stagger",
      "variance",
      "minOpacity",
      "maxOpacity",
      "blur",
      "repeat",
      "itemClassName",
    ],
  },
  {
    name: "ElasticLettersText",
    description: "字符水平轻微拉伸后回弹，形成 SwiftUI 式弹性。",
    usage: '<ElasticLettersText text="Swift-like motion" />',
    props: [
      "text",
      "duration",
      "delay",
      "stagger",
      "stretch",
      "blur",
      "repeat",
    ],
  },
  {
    name: "IridescentText",
    description: "文字表面呈现轻微虹彩变化，偏材质感而不是明确扫光。",
    usage: '<IridescentText text="Matter of care" />',
    props: [
      "text",
      "duration",
      "delay",
      "colorA",
      "colorB",
      "colorC",
      "glowColor",
      "intensity",
      "repeat",
    ],
  },
  {
    name: "MorphWordsText",
    description: "几个短词之间以模糊和缩放柔和切换。",
    usage: 'Build <MorphWordsText words={["better", "faster", "softer"]} />',
    props: [
      "words",
      "duration",
      "delay",
      "blur",
      "scale",
      "repeat",
      "itemClassName",
    ],
  },
  {
    name: "HeartbeatText",
    description: "文字以真实双峰心跳节奏轻微起伏。",
    usage: '<HeartbeatText text="Still alive" />',
    props: [
      "text",
      "duration",
      "delay",
      "scale",
      "settleScale",
      "blur",
      "glowColor",
      "repeat",
    ],
  },
  {
    name: "LiquidText",
    description: "实验性的液体融合/分离文字动效。",
    usage: '<LiquidText text="Liquid motion" />',
    props: [
      "text",
      "duration",
      "delay",
      "stagger",
      "distance",
      "blur",
      "repeat",
    ],
  },
  {
    name: "PixelResolveText",
    description: "实验性的像素块还原文字动效。",
    usage: '<PixelResolveText text="Pixels resolve." />',
    props: ["text", "duration", "delay", "stagger", "pixelSize", "repeat"],
  },
];

function DocsApiCard({ item }: { item: DocsApiItem }) {
  return (
    <article className="rounded-2xl border border-neutral-200/70 bg-white p-4 shadow-[0_1px_1px_rgba(15,23,42,.03)] dark:border-white/8 dark:bg-neutral-950/50">
      <h3 className="font-mono text-[13px] font-semibold leading-5 text-neutral-900 dark:text-neutral-100">
        {item.name}
      </h3>
      <p className="mt-1 text-[13px] leading-6 text-neutral-500 dark:text-neutral-400">
        {item.description}
      </p>
      <code className="mt-3 block overflow-x-auto whitespace-nowrap font-mono text-[11px] leading-5 text-neutral-400 dark:text-neutral-500">
        {item.usage}
      </code>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {item.props.map((prop) => (
          <span
            className="rounded-full bg-neutral-100 px-2 py-1 font-mono text-[11px] leading-4 text-neutral-500 dark:bg-white/8 dark:text-neutral-400"
            key={prop}
          >
            {prop}
          </span>
        ))}
      </div>
    </article>
  );
}

function LandingHero({
  description,
  isDark,
  logoLabel,
  onStart,
  startLabel,
  title,
}: {
  description: string;
  isDark: boolean;
  logoLabel: string;
  onStart: () => void;
  startLabel: string;
  title: string;
}) {
  return (
    <section className="mx-auto mt-8 flex max-w-[460px] flex-col items-center text-center sm:mt-12">
      <div className="mb-6 sm:mb-7">
        <MotionLogoCard isDark={isDark} label={logoLabel} />
      </div>
      <h1 className="text-balance font-heading text-[24px] font-semibold leading-tight tracking-normal sm:text-[28px]">
        {title}
      </h1>
      <p className="mt-3 text-balance px-1 text-[14px] leading-6 text-neutral-500 dark:text-neutral-400 sm:px-0 sm:text-[16px] sm:leading-7">
        {description}
      </p>
      <div className="mt-6 flex w-full flex-col items-stretch justify-center gap-2.5 sm:mt-7 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
        <Button
          className="!h-[40px] w-full rounded-full border-transparent bg-neutral-950 px-5 text-[13px] font-semibold text-white shadow-none transition-[background-color,color] duration-200 hover:bg-neutral-800 active:shadow-none data-pressed:shadow-none dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 sm:w-auto"
          onClick={onStart}
          variant="secondary"
        >
          {startLabel}
        </Button>
        <Button
          className="!h-[40px] w-full rounded-full px-5 text-[13px] font-semibold shadow-none transition-[background-color,color] duration-200 hover:bg-neutral-200 hover:text-neutral-950 active:shadow-none data-pressed:shadow-none dark:bg-white/[0.08] dark:text-neutral-100 dark:hover:bg-white/[0.13] dark:hover:text-neutral-50 sm:w-auto [&_svg]:size-5"
          render={
            <a href={githubRepositoryUrl} rel="noreferrer" target="_blank" />
          }
          variant="secondary"
        >
          <GithubIcon className="size-5" />
          GitHub
          <GithubStarCount />
        </Button>
      </div>
    </section>
  );
}

function GithubStarCount() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("https://api.github.com/repos/coooooolpan/motion-text-kit", {
      headers: { Accept: "application/vnd.github+json" },
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { stargazers_count?: unknown } | null) => {
        if (typeof data?.stargazers_count === "number") {
          setStars(data.stargazers_count);
        }
      })
      .catch(() => {});

    return () => controller.abort();
  }, []);

  if (stars === null) {
    return null;
  }

  return (
    <span
      aria-label={`${stars} GitHub stars`}
      className="-ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-black/[0.05] px-1.5 font-mono text-[11px] text-neutral-500 tabular-nums dark:bg-white/[0.08] dark:text-neutral-400"
    >
      {stars.toLocaleString()}
    </span>
  );
}

function scrollToInstallation() {
  const installation = document.getElementById("installation");

  if (!installation) {
    return;
  }

  const previewOffset = Math.min(340, Math.max(260, window.innerHeight * 0.32));
  const targetTop =
    installation.getBoundingClientRect().top + window.scrollY - previewOffset;

  window.scrollTo({
    behavior: "smooth",
    top: Math.max(0, targetTop),
  });
}

function EffectPreviewMarquee({ items }: { items: MotionCard[] }) {
  const marqueeItems = [...items, ...items];
  const trackRef = useRef<HTMLDivElement | null>(null);
  const offsetRef = useRef(0);
  const previousTimeRef = useRef<number | null>(null);
  const targetSpeedRef = useRef(32);
  const speedRef = useRef(32);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let frame = 0;

    function tick(time: number) {
      const track = trackRef.current;
      const previous = previousTimeRef.current ?? time;
      const delta = Math.min(time - previous, 48) / 1000;
      previousTimeRef.current = time;

      speedRef.current += (targetSpeedRef.current - speedRef.current) * 0.08;

      if (track) {
        const loopWidth = track.scrollWidth / 2;

        if (loopWidth > 0) {
          offsetRef.current = (offsetRef.current + speedRef.current * delta) % loopWidth;
          track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
        }
      }

      frame = window.requestAnimationFrame(tick);
    }

    frame = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <section
      aria-label="Effect previews"
      className="effect-marquee"
      onPointerEnter={() => {
        targetSpeedRef.current = 13;
      }}
      onPointerLeave={() => {
        targetSpeedRef.current = 32;
      }}
    >
      <div className="effect-marquee__track" ref={trackRef}>
        {marqueeItems.map((item, index) => (
          <article
            className="effect-marquee__card"
            key={`${item.id}-${index}`}
            style={
              { "--effect-card-index": index % items.length } as CSSProperties
            }
          >
            <div className="effect-marquee__preview">{item.preview}</div>
            <p className="effect-marquee__title">{item.title}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function NpmPage({
  copyLabel,
  footerPrefix,
  heroDescription,
  heroSlogan,
  isDark,
  logoLabel,
  motionCards,
  startLabel,
}: {
  copyLabel: string;
  footerPrefix: string;
  heroDescription: string;
  heroSlogan: string;
  isDark: boolean;
  logoLabel: string;
  motionCards: MotionCard[];
  startLabel: string;
}) {
  return (
    <>
      <LandingHero
        description={heroDescription}
        isDark={isDark}
        logoLabel={logoLabel}
        onStart={scrollToInstallation}
        startLabel={startLabel}
        title={heroSlogan}
      />
      <EffectPreviewMarquee items={motionCards} />
      <section className="mx-auto mt-10 w-full max-w-[760px] sm:mt-14">
        <div className="space-y-9 sm:space-y-12">
          <div className="scroll-mt-8" id="installation">
            <h1 className="text-[18px] font-medium leading-7 tracking-normal text-neutral-900 dark:text-neutral-100">
              Installation
            </h1>
            <div className="mt-4">
              <DocsCodeBlock
                code="npm install motion-text-kit"
                label={`${copyLabel} npm install`}
              />
            </div>
            <div className="mt-3">
              <DocsCodeBlock
                code={`pnpm add motion-text-kit
yarn add motion-text-kit`}
                label={`${copyLabel} alternative install`}
              />
            </div>
            <p className="mt-3 text-[13px] leading-6 text-neutral-500 dark:text-neutral-400">
              Import the stylesheet once near your app root. The components are
              React-only and do not depend on Next.js or a runtime animation
              library.
            </p>
            <div className="mt-4">
              <DocsCodeBlock
                code={`import "motion-text-kit/styles.css";`}
                label={`${copyLabel} import styles`}
              />
            </div>
          </div>

          <div>
            <h2 className="text-[18px] font-medium leading-7 tracking-normal text-neutral-900 dark:text-neutral-100">
              Usage
            </h2>
            <div className="mt-4">
              <DocsCodeBlock
                code={`import {
  AiStreamText,
  BreathingText,
  BreathingWordsText,
  GradientSweepText,
  NumberDeltaText,
  SoftScrambleText,
  TextReveal,
} from "motion-text-kit";
import "motion-text-kit/styles.css";

export function Example() {
  return (
    <section>
      <TextReveal text="Letters enter and leave." mode="in-out" repeat />

      <AiStreamText text="Generating thoughtful motion" />

      <SoftScrambleText text="Status updated softly" />

      <GradientSweepText>Stay hungry, stay foolish.</GradientSweepText>

      <NumberDeltaText value={24} />
      <NumberDeltaText value={-18} />

      <BreathingText text="Almost there..." />
      <BreathingWordsText text="Quiet signals keep moving" />
    </section>
  );
}`}
                label={`${copyLabel} usage`}
              />
            </div>
          </div>

          <div>
            <h2 className="text-[18px] font-medium leading-7 tracking-normal text-neutral-900 dark:text-neutral-100">
              Component API
            </h2>
            <p className="mt-2 text-[13px] leading-6 text-neutral-500 dark:text-neutral-400">
              All components accept `className`, `style`, and native span props.
              Most components also support `as` to render a different element.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {docsApiItems.map((item) => (
                <DocsApiCard item={item} key={item.name} />
              ))}
            </div>
          </div>
        </div>
      </section>
      <FooterCredit prefix={footerPrefix} />
    </>
  );
}

function InspirationBoard({
  items,
}: {
  items: (typeof pageCopy)[Locale]["notes"]["inspirations"];
}) {
  const [positions, setPositions] = useState(() =>
    Object.fromEntries(
      items.map((item) => [item.name, { x: item.x, y: item.y }]),
    ) as Record<string, { x: number; y: number }>,
  );
  const [activeNote, setActiveNote] = useState<string>(items[0]?.name ?? "");
  const dragRef = useRef<{
    id: string;
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    moved: boolean;
  } | null>(null);

  function openInspiration(href: string) {
    window.open(href, "_blank", "noopener,noreferrer");
  }

  function applyNoteTilt(element: HTMLElement, clientX: number, clientY: number) {
    const rect = element.getBoundingClientRect();
    const px = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const py = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    const tiltX = (0.5 - py) * 18;
    const tiltY = (px - 0.5) * 18;

    element.classList.add("is-hover", "is-tilting");
    element.style.setProperty("--note-rx", `${tiltX.toFixed(2)}deg`);
    element.style.setProperty("--note-ry", `${tiltY.toFixed(2)}deg`);
    element.style.setProperty("--note-gx", `${(px * 100).toFixed(1)}%`);
    element.style.setProperty("--note-gy", `${(py * 100).toFixed(1)}%`);
  }

  function resetNoteTilt(element: HTMLElement) {
    element.classList.remove("is-hover", "is-tilting", "is-dragging");
    element.style.setProperty("--note-rx", "0deg");
    element.style.setProperty("--note-ry", "0deg");
    element.style.setProperty("--note-gx", "50%");
    element.style.setProperty("--note-gy", "50%");
  }

  function handlePointerDown(
    event: React.PointerEvent<HTMLElement>,
    item: (typeof items)[number],
  ) {
    const position = positions[item.name] ?? { x: item.x, y: item.y };
    setActiveNote(item.name);
    applyNoteTilt(event.currentTarget, event.clientX, event.clientY);
    event.currentTarget.classList.add("is-dragging");
    dragRef.current = {
      id: item.name,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLElement>) {
    applyNoteTilt(event.currentTarget, event.clientX, event.clientY);

    const drag = dragRef.current;

    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;

    if (Math.hypot(deltaX, deltaY) > 4) {
      drag.moved = true;
    }

    setPositions((current) => ({
      ...current,
      [drag.id]: {
        x: Math.max(8, Math.min(554, drag.originX + deltaX)),
        y: Math.max(8, Math.min(354, drag.originY + deltaY)),
      },
    }));
  }

  function handlePointerUp(
    event: React.PointerEvent<HTMLElement>,
    href: string,
  ) {
    const drag = dragRef.current;

    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    event.currentTarget.releasePointerCapture(event.pointerId);
    event.currentTarget.classList.remove("is-dragging", "is-tilting");
    if (!event.currentTarget.matches(":hover")) {
      resetNoteTilt(event.currentTarget);
    }
    dragRef.current = null;

    if (!drag.moved) {
      openInspiration(href);
    }
  }

  return (
    <div
      className={`inspiration-board mt-5 overflow-x-auto rounded-[1.7rem] border border-neutral-200/70 bg-white/70 p-3 dark:border-white/8 dark:bg-neutral-950/35 ${noteHandFont.className}`}
    >
      <div className="inspiration-board__surface">
        {items.map((item) => {
          const position = positions[item.name] ?? { x: item.x, y: item.y };
          const favicon = `https://www.google.com/s2/favicons?domain=${item.domain}&sz=64`;

          return (
            <article
              aria-label={`${item.name}: ${item.description}`}
              className="inspiration-note"
              key={item.name}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  openInspiration(item.href);
                }
              }}
              onPointerDown={(event) => handlePointerDown(event, item)}
              onFocus={() => setActiveNote(item.name)}
              onPointerMove={handlePointerMove}
              onPointerEnter={(event) =>
                applyNoteTilt(event.currentTarget, event.clientX, event.clientY)
              }
              onPointerLeave={(event) => {
                if (dragRef.current?.id !== item.name) {
                  resetNoteTilt(event.currentTarget);
                }
              }}
              onPointerUp={(event) => handlePointerUp(event, item.href)}
              role="link"
              style={
                {
                  "--note-rotate": `${item.rotate}deg`,
                  "--note-x": `${position.x}px`,
                  "--note-y": `${position.y}px`,
                  "--note-z": activeNote === item.name ? 10 : 1,
                } as CSSProperties
              }
              tabIndex={0}
            >
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="block size-6 shrink-0 -translate-y-px bg-center bg-no-repeat"
                  style={
                    {
                      backgroundImage: `url(${favicon})`,
                      backgroundSize: "24px 24px",
                    } as CSSProperties
                  }
                />
                <div>
                  <h3 className="text-[15px] font-normal leading-[18px] text-neutral-950 dark:text-neutral-950">
                    {item.name}
                  </h3>
                  <p className="text-[11px] leading-[14px] text-neutral-700/80 dark:text-neutral-800">
                    {item.type}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-[12px] leading-5 text-neutral-800/85 dark:text-neutral-900">
                {item.description}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function NotesPage({
  footerPrefix,
  notes,
}: {
  footerPrefix: string;
  notes: (typeof pageCopy)[Locale]["notes"];
}) {
  return (
    <>
      <section className="mx-auto mt-16 w-full max-w-[760px]">
        <div className="space-y-12">
          <section>
            <h2 className="text-[18px] font-medium leading-7 tracking-normal text-neutral-900 dark:text-neutral-100">
              {notes.releaseTitle}
            </h2>
            <div className="mt-5 divide-y divide-neutral-200/70 border-y border-neutral-200/70 dark:divide-white/10 dark:border-white/10">
              {notes.releases.map((release) => (
                <article
                  className="grid gap-3 py-5 md:grid-cols-[8rem_1fr]"
                  key={release.version}
                >
                  <div>
                    <p className="text-[13px] font-semibold leading-5 text-neutral-950 dark:text-neutral-50">
                      {release.version}
                    </p>
                    <p className="mt-1 font-mono text-[11px] leading-5 text-neutral-400 dark:text-neutral-500">
                      {release.date}
                    </p>
                  </div>
                  <div>
                    <p className="text-[13px] font-medium leading-6 text-neutral-800 dark:text-neutral-200">
                      {release.summary}
                    </p>
                    <ul className="mt-2 space-y-1.5 text-[13px] leading-6 text-neutral-500 dark:text-neutral-400">
                      {release.items.map((item) => (
                        <li className="flex gap-2" key={item}>
                          <span className="mt-[0.7rem] size-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-[18px] font-medium leading-7 tracking-normal text-neutral-900 dark:text-neutral-100">
              {notes.inspirationTitle}
            </h2>
            <p className="mt-2 text-[13px] leading-6 text-neutral-500 dark:text-neutral-400">
              {notes.inspirationDescription}
            </p>
            <InspirationBoard
              items={notes.inspirations}
              key={notes.inspirationTitle}
            />
          </section>
        </div>
      </section>
      <FooterCredit prefix={footerPrefix} />
    </>
  );
}

export default function Site({ initialPage }: { initialPage: ActivePage }) {
  const [isDark, setIsDark] = useState(false);
  const locale = useSyncExternalStore(
    subscribeToLocale,
    getLocale,
    (): Locale => "zh",
  );
  const activePage = initialPage;
  const [expandedCard, setExpandedCard] = useState<ExpandedMotionCard | null>(
    null,
  );
  const closeTimerRef = useRef<number | null>(null);
  const copy = pageCopy[locale];
  const motionCards = createMotionCards(copy, isDark);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const syncTheme = (event: MediaQueryList | MediaQueryListEvent) => {
      setIsDark(event.matches);
    };

    syncTheme(mediaQuery);
    mediaQuery.addEventListener("change", syncTheme);

    return () => mediaQuery.removeEventListener("change", syncTheme);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  }, [locale]);

  useEffect(() => {
    if (!expandedCard) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeExpandedCard();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [expandedCard]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  function openExpandedCard(item: MotionCard, origin: DOMRect) {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setExpandedCard({ item, origin, state: "opening" });
    window.requestAnimationFrame(() => {
      setExpandedCard((current) =>
        current?.item.id === item.id ? { ...current, state: "open" } : current,
      );
    });
  }

  function closeExpandedCard() {
    setExpandedCard((current) =>
      current ? { ...current, state: "closing" } : current,
    );

    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
    }

    closeTimerRef.current = window.setTimeout(() => {
      setExpandedCard(null);
      closeTimerRef.current = null;
    }, 500);
  }

  function openNpmAndScrollToInstallation() {
    window.location.assign("/package#installation");
  }

  return (
    <main className="min-h-svh bg-background text-neutral-900 transition-colors dark:text-neutral-100">
      <div
        className="app-shell mx-auto flex w-full max-w-[1040px] flex-col px-3 pb-12 pt-4 sm:px-4 sm:pb-16 sm:pt-5"
        data-overlay-state={expandedCard?.state ?? "closed"}
      >
        <header className="flex flex-wrap items-center justify-between gap-2 gap-y-3 sm:gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-7">
            <BrandMark label={copy.logoLabel} />
            <nav aria-label="Page switcher" className="flex items-center gap-3 sm:gap-5">
              <Link
                className={[
                  "page-switcher-button relative inline-flex h-5 items-center text-[14px] font-medium leading-none transition-colors duration-200",
                  activePage === "motion"
                    ? "text-neutral-950 dark:text-neutral-50"
                    : "text-neutral-400 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300",
                ].join(" ")}
                data-state={activePage === "motion" ? "active" : "inactive"}
                href="/"
              >
                <span className="page-switcher-label">Motion</span>
                {activePage === "motion" ? <TabUnderline type="motion" /> : null}
              </Link>
              <Link
                className="page-switcher-button relative inline-flex h-5 items-center text-[14px] font-medium leading-none text-neutral-400 transition-colors duration-200 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300"
                href="/playground"
              >
                Playground
              </Link>
              <Link
                className={[
                  "page-switcher-button relative inline-flex h-5 items-center text-[14px] font-medium leading-none transition-colors duration-200",
                  activePage === "npm"
                    ? "text-neutral-950 dark:text-neutral-50"
                    : "text-neutral-400 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300",
                ].join(" ")}
                data-state={activePage === "npm" ? "active" : "inactive"}
                href="/package"
              >
                <span className="page-switcher-label">Package</span>
                {activePage === "npm" ? <TabUnderline type="npm" /> : null}
              </Link>
              <Link
                className={[
                  "page-switcher-button relative inline-flex h-5 items-center text-[14px] font-medium leading-none transition-colors duration-200",
                  activePage === "notes"
                    ? "text-neutral-950 dark:text-neutral-50"
                    : "text-neutral-400 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300",
                ].join(" ")}
                data-state={activePage === "notes" ? "active" : "inactive"}
                href="/notes"
              >
                <span className="page-switcher-label">Notes</span>
                {activePage === "notes" ? <TabUnderline type="notes" /> : null}
              </Link>
            </nav>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Menu>
              <MenuTrigger
                render={
                  <Button
                    aria-label={copy.languageMenuLabel}
                    className="!size-8 rounded-full shadow-none transition-[background-color,color] duration-200 hover:bg-neutral-200 hover:text-neutral-950 active:shadow-none data-popup-open:bg-neutral-200 dark:bg-white/[0.08] dark:hover:bg-white/[0.13] dark:hover:text-neutral-50 dark:data-popup-open:bg-white/[0.13] [&_svg]:size-3.5"
                    size="icon"
                    variant="secondary"
                  />
                }
              >
                <GlobeIcon className="size-3.5" strokeWidth={2.1} />
              </MenuTrigger>
              <MenuPopup
                align="start"
                alignOffset={-11}
                className="min-w-[9rem] rounded-2xl border-black/[0.08] bg-white/95 shadow-[0_18px_44px_rgba(15,23,42,.14)] backdrop-blur-xl before:rounded-[calc(var(--radius-2xl)-1px)] dark:border-white/[0.08] dark:bg-neutral-900/95 dark:shadow-[0_18px_44px_rgba(0,0,0,.38)] [&>div]:p-1.5"
                sideOffset={10}
              >
                <MenuRadioGroup
                  className="grid gap-1"
                  onValueChange={(value) => setLocale(value as Locale)}
                  value={locale}
                >
                  <MenuRadioItem
                    className="min-h-9 grid-cols-[1.1rem_1fr] gap-1.5 rounded-xl ps-2.5 pe-4 text-[14px] font-medium text-neutral-700 transition-colors duration-150 data-checked:bg-neutral-100 data-highlighted:bg-neutral-100 data-highlighted:text-neutral-950 dark:text-neutral-200 dark:data-checked:bg-white/[0.08] dark:data-highlighted:bg-white/[0.08] dark:data-highlighted:text-neutral-50 [&_svg]:size-4 [&_svg]:text-neutral-950 dark:[&_svg]:text-neutral-50"
                    closeOnClick
                    label="中文"
                    value="zh"
                  >
                    {copy.languageOptions.zh}
                  </MenuRadioItem>
                  <MenuRadioItem
                    className="min-h-9 grid-cols-[1.1rem_1fr] gap-1.5 rounded-xl ps-2.5 pe-4 text-[14px] font-medium text-neutral-700 transition-colors duration-150 data-checked:bg-neutral-100 data-highlighted:bg-neutral-100 data-highlighted:text-neutral-950 dark:text-neutral-200 dark:data-checked:bg-white/[0.08] dark:data-highlighted:bg-white/[0.08] dark:data-highlighted:text-neutral-50 [&_svg]:size-4 [&_svg]:text-neutral-950 dark:[&_svg]:text-neutral-50"
                    closeOnClick
                    label="English"
                    value="en"
                  >
                    {copy.languageOptions.en}
                  </MenuRadioItem>
                </MenuRadioGroup>
              </MenuPopup>
            </Menu>
            <Button
              aria-label={copy.githubLabel}
              className="!size-8 rounded-full shadow-none transition-[background-color,color] duration-200 hover:bg-neutral-200 hover:text-neutral-950 active:shadow-none dark:bg-white/[0.08] dark:hover:bg-white/[0.13] dark:hover:text-neutral-50 [&_svg]:size-3.5"
              onClick={(event) => {
                event.preventDefault();
                window.open(githubRepositoryUrl, "_blank", "noopener,noreferrer");
              }}
              render={
                <a
                  href={githubRepositoryUrl}
                  rel="noreferrer"
                  target="_blank"
                />
              }
              variant="secondary"
            >
              <GithubIcon className="size-3.5" />
            </Button>
            <Button
              aria-label={copy.themeLabel}
              aria-pressed={isDark}
              className="!size-8 rounded-full shadow-none transition-[background-color,color] duration-200 hover:bg-neutral-200 hover:text-neutral-950 active:shadow-none dark:bg-white/[0.08] dark:hover:bg-white/[0.13] dark:hover:text-neutral-50 [&_svg]:size-3.5"
              onClick={() => setIsDark((current) => !current)}
              variant="secondary"
            >
              {isDark ? (
                <FilledSunIcon className="size-3.5" />
              ) : (
                <FilledMoonIcon className="size-3.5" />
              )}
            </Button>
          </div>
        </header>

        <div className="page-content-panel" key={activePage}>
          {activePage === "motion" ? (
            <>
              <LandingHero
                description={copy.heroDescription}
                isDark={isDark}
                logoLabel={copy.logoLabel}
                onStart={openNpmAndScrollToInstallation}
                startLabel={copy.startLabel}
                title={copy.heroSlogan}
              />

              <section className="mt-9 grid grid-cols-2 gap-2.5 sm:mt-11 sm:gap-5 lg:grid-cols-3" id="effects">
                {motionCards.map((item, index) => (
                  <MotionCatalogCard
                    index={index}
                    item={item}
                    key={item.id}
                    onOpen={openExpandedCard}
                  />
                ))}
              </section>

              <FooterCredit prefix={copy.footerPrefix} />
            </>
          ) : activePage === "npm" ? (
            <NpmPage
              copyLabel={copy.copyLabel}
              footerPrefix={copy.footerPrefix}
              heroDescription={copy.heroDescription}
              heroSlogan={copy.heroSlogan}
              isDark={isDark}
              logoLabel={copy.logoLabel}
              motionCards={motionCards}
              startLabel={copy.startLabel}
            />
          ) : (
            <NotesPage footerPrefix={copy.footerPrefix} notes={copy.notes} />
          )}
        </div>
      </div>
      {expandedCard ? (
        <ExpandedMotionCardOverlay
          copyLabel={copy.copyLabel}
          expanded={expandedCard}
          onClose={closeExpandedCard}
          scenarioLabel={copy.scenarioLabel}
        />
      ) : null}
    </main>
  );
}
