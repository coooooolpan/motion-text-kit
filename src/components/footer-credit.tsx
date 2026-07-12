import type { CSSProperties } from "react";

function FooterArrowMark() {
  const strokes = [
    "M15.7549 222.508C2.15494 171.019 163.405 86.9586 203.415 110.987C267.705 149.591 143.425 211.862 152.875 151.395C163.525 83.1927 389.545 14.9927 340.345 63.4157",
    "M209.535 31.7736C306.275 6.21158 424.315 -3.66243 316.495 102.466",
  ];

  return (
    <svg aria-hidden="true" className="footer-arrow" viewBox="0 0 375 238">
      {strokes.map((stroke, index) => (
        <path
          className="footer-arrow__stroke"
          d={stroke}
          key={stroke}
          pathLength={1}
          style={{ "--footer-arrow-stroke-index": index } as CSSProperties}
        />
      ))}
    </svg>
  );
}

export function FooterCredit({ prefix }: { prefix: string }) {
  return (
    <p className="mt-14 inline-flex w-full items-center justify-center gap-3.5 text-center text-[14px] leading-7 text-neutral-400 dark:text-neutral-500">
      <span className="translate-y-[3px]">{prefix}</span>
      <a
        aria-label="coooooolpan"
        className="group inline-flex items-center gap-2 font-semibold text-neutral-600 transition-colors duration-300 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-100"
        href="https://coooooolpan.vercel.app/"
        rel="noreferrer"
        target="_blank"
      >
        <span aria-hidden="true" className="footer-signature" />
        <span className="inline-grid size-[18px] translate-y-[3px] place-items-center">
          <FooterArrowMark />
        </span>
      </a>
    </p>
  );
}
