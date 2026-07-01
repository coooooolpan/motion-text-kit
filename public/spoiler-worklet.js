// Vendored + modified from molefrog/spoiled (MIT) — the CSS Houdini paint
// worklet that draws the animated particle noise. Loaded via
// CSS.paintWorklet.addModule("/spoiler-worklet.js").
//
// Our additions over the original:
//   --mx / --my : mouse position (0..1 of the box, or -1 when inactive). Nearby
//                 particles are pushed away from the cursor (minimal interaction).
//   --ox / --oy : reveal origin (0..1). Particles fade in/out ordered by their
//                 distance from this point, so the reveal spreads from where you
//                 click instead of sequentially.

const M = Math;

const lcgrand =
  (seed = 1) =>
  (a = 0, b = 1) =>
    a +
    (M.abs(b - a) * (M.imul(48271, (seed = M.imul(214013, seed) + 2531011)) & 0x7fffffff)) /
      0x7fffffff;

const pol2vec = (l, a = 0) => [l * M.cos(a), l * M.sin(a)];

const trapezoidalWave = (l, a, b) => {
  const s = M.max(a, l - b);
  return (t) => {
    if (t < a) return M.max(0, t / a);
    if (t > s) return M.max(0, 1 - (t - s) / (l - s));
    return 1;
  };
};

const clamp = (min, x, max) => Math.max(min, Math.min(x, max));

const getCSSVar = (props, name) => {
  const val = props.get(name);
  if (typeof val === "string") return val;
  return val?.length >= 1 ? val[0] : undefined;
};

const easeOutCubic = (t) => --t * t * t + 1;

// Fade order is driven by `frac` (0..1) instead of particle index, so we can
// order it by distance from the reveal origin.
const animateFadeInOut = (World, frac, duration, ease = easeOutCubic) => {
  const direction = World.tStop <= World.t ? "out" : "in";
  const animationStartT = direction === "in" ? World.tStart : World.tStop;
  const t = animationStartT + (2 / 3) * duration * frac;
  const fadeFor = (1 / 3) * duration;
  let progress = 0.0;
  if (direction === "in") {
    progress = (fadeFor + t - World.t) / fadeFor || 0;
  } else {
    progress = (World.t - t) / fadeFor || 1;
  }
  return ease(1.0 - clamp(0, progress, 1));
};

const FAKE_WORDS = [5, 3, 4, 4, 2, 4, 7, 6, 8, 6, 3, 1, 6];

const makeWordDistribution = (line, em, space) => {
  let marker = 0,
    i = 0,
    wordslen = 0,
    chunks = [];
  do {
    const endOfWord = Math.min(line, marker + FAKE_WORDS[i++ % FAKE_WORDS.length] * em);
    wordslen += endOfWord - marker;
    chunks.push([marker, (marker = endOfWord)]);
  } while ((marker += space) < line);
  if (chunks.length >= 0) chunks[chunks.length - 1][1] = line;
  return (t) => {
    const w = t * wordslen;
    let m = 0.0;
    for (const [start, end] of chunks) {
      const wordLength = end - start;
      if (m < w && w <= m + wordLength) return start + w - m;
      m += wordLength;
    }
    return 0;
  };
};

class SpoilerPainterWorklet {
  static get contextOptions() {
    return { alpha: true };
  }

  static get inputProperties() {
    return [
      "--t",
      "--t-stop",
      "--fade",
      "--gap",
      "--accent",
      "--words",
      "--density",
      "--mx",
      "--my",
      "--ox",
      "--oy",
      "--rows",
      "--lh",
      "--row-widths",
    ];
  }

  paint(ctx, size, props) {
    const rand = lcgrand(4011505);

    const dprx = 1.0,
      accent = (getCSSVar(props, "--accent") || "0 0% 0%").split(" "),
      mimicWords = getCSSVar(props, "--words") === "true",
      vmin = 1,
      vmax = 4,
      width = size.width / dprx,
      height = size.height / dprx,
      [hgap, vgap] = (getCSSVar(props, "--gap") || "0px 0px").split(" ").map(parseFloat),
      density = parseFloat(getCSSVar(props, "--density")) || 0.08,
      sizedev = devicePixelRatio > 1 ? 0.5 : 0.0,
      fadeDuration = parseFloat(getCSSVar(props, "--fade")) || 0.0;

    // --- our inputs ---
    const mx = parseFloat(getCSSVar(props, "--mx") ?? "-1"),
      my = parseFloat(getCSSVar(props, "--my") ?? "-1"),
      mouseActive = mx >= 0 && my >= 0,
      mpx = mx * width,
      mpy = my * height,
      MR = 22, // push influence radius (small/local)
      MAMP = 3, // max push in px (gentle)
      MDR = 48, // darken radius around the cursor
      MDARK = 36, // how much darker (lightness pts) at the cursor
      ox = parseFloat(getCSSVar(props, "--ox") ?? "0.5") * width,
      oy = parseFloat(getCSSVar(props, "--oy") ?? "0.5") * height,
      // Max distance from the CLICK ORIGIN to any corner — so `frac` spans the
      // full 0..1 range and the reveal staggers clearly outward from the click.
      // (Using the box diagonal here compressed frac toward 0, so every particle
      // faded at nearly the same time and the reveal looked all-at-once.)
      maxDist =
        Math.max(
          Math.hypot(ox - 0, oy - 0),
          Math.hypot(ox - width, oy - 0),
          Math.hypot(ox - 0, oy - height),
          Math.hypot(ox - width, oy - height),
        ) || 1,
      rows = Math.max(1, Math.round(parseFloat(getCSSVar(props, "--rows") ?? "1"))),
      lh = parseFloat(getCSSVar(props, "--lh") ?? String(height)),
      // per-row text width as a 0..1 fraction of the box width; the last
      // (short) line gets a short noise band instead of a full-width one
      rowWidths = (getCSSVar(props, "--row-widths") || "1")
        .trim()
        .split(/\s+/)
        .map(parseFloat);

    const World = {
      t: parseFloat(getCSSVar(props, "--t") ?? 0.0),
      tStop: parseFloat(getCSSVar(props, "--t-stop") ?? "Infinity"),
      tStart: 0,
      n: M.round(M.min(5000, density * (width - 2 * hgap) * (height - 2 * vgap))),
    };

    const lineWidth = width - 2 * hgap,
      lineHeight = height - 2 * vgap;

    const wordDist = mimicWords
      ? makeWordDistribution(lineWidth, lineHeight, Math.max(12, lineHeight / 4))
      : (x) => x * (width - 2 * hgap);

    ctx.clearRect(0, 0, size.width, size.height);

    // Particles must stay within the TEXT extent (rows * lh), not the full box
    // height — a tall inline child (e.g. a chip pill) can inflate the box past
    // the last line, and clamping to `height` then painted noise in that empty
    // overhang. Cap the band to the actual text rows.
    const textBottom = M.min(height - vgap, vgap + rows * lh);

    // Pick a row WEIGHTED by its width, so a short line gets proportionally fewer
    // particles and the density stays uniform across lines (an even row pick made
    // a short last line denser). Build a cumulative weight table once.
    const rowWeights = [];
    let totalW = 0;
    for (let r = 0; r < rows; r++) {
      totalW += rowWidths[M.min(r, rowWidths.length - 1)] || 1;
      rowWeights.push(totalW);
    }
    const pickRow = () => {
      if (rows <= 1) return 0;
      const target = rand() * totalW;
      for (let r = 0; r < rows; r++) if (target <= rowWeights[r]) return r;
      return rows - 1;
    };

    for (let i = 0; i < World.n; ++i) {
      // pick the row (width-weighted), then place x within THAT row's real width
      // so a short last line gets a short, equally-dense noise band
      const row = pickRow();
      const rowFrac = rowWidths[M.min(row, rowWidths.length - 1)] || 1;
      const x0 = hgap + wordDist(rand()) * rowFrac;
      // confine to text rows so particles sit on the lines, not in the gaps
      const y0 = clamp(
        vgap,
        vgap + row * lh + lh * 0.5 + (rand() - 0.5) * lh * 0.6,
        textBottom,
      );

      const v0mag = rand(vmin, vmax),
        size0 = rand(1.0, 1.0 + sizedev);

      const _l = parseInt(accent[2]);
      const ldir = _l > 50 ? -1 : 1;
      let lightness = M.floor(clamp(0, _l + ldir * rand(0, 30), 100));

      const v0 = pol2vec(v0mag, rand(0, M.PI * 2));
      const [vx0, vy0] = v0;

      const lifetime = rand(0.9, 2.6);
      const respawn = rand(0, 1);
      const visibilityFn = trapezoidalWave(lifetime, 0.15, 0.3);
      const phase = rand(0, lifetime + respawn);

      const cantSpawnNoMore =
        Math.floor((World.tStop + phase) / (lifetime + respawn)) <
        Math.floor((World.t + phase) / (lifetime + respawn));
      if (cantSpawnNoMore) continue;

      let t = M.min(lifetime, (World.t + phase) % (lifetime + respawn));

      let x = x0 + vx0 * t;
      let y = y0 + vy0 * t;

      // mouse repulsion — push particles away from the cursor a little, and
      // darken the ones closest to it (cursor "ink" effect)
      if (mouseActive) {
        const ddx = x - mpx,
          ddy = y - mpy,
          dd = Math.hypot(ddx, ddy);
        if (dd < MR && dd > 0.001) {
          const push = (1 - dd / MR) * MAMP;
          x += (ddx / dd) * push;
          y += (ddy / dd) * push;
        }
        if (dd < MDR) {
          lightness = M.max(0, lightness - (1 - dd / MDR) * MDARK);
        }
      }

      // reveal/hide ordered by distance from the click origin (--ox/--oy), so
      // particles clear outward from where you clicked
      const frac = clamp(0, Math.hypot(x0 - ox, y0 - oy) / maxDist, 1);
      const fade = animateFadeInOut(World, frac, fadeDuration);

      const alpha = fade * (1 - t / lifetime);
      const size = fade * (size0 * visibilityFn(t));

      // round particles, drawn once (no edge wrap/clipping)
      ctx.beginPath();
      ctx.fillStyle = `hsl(${accent[0]} ${accent[1]} ${lightness}% / ${M.round(alpha * 100)}%)`;
      ctx.arc(dprx * x, dprx * y, (dprx * size) / 2, 0, M.PI * 2);
      ctx.fill();
    }
  }
}

registerPaint("spoiler", SpoilerPainterWorklet);
