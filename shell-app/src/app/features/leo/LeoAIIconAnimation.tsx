import { useEffect, useRef, useState } from "react";
import { ASK_LEO_BRAND_PINK } from "./leoAssets";
import { cn } from "../../components/ui/utils";

/**
 * Centralised Leo mark assembly animation.
 *
 * Renders the Leo logo as inline SVG that draws itself: four curved strokes
 * spiral inward via stroke-dashoffset while the whole group rotates from
 * −270° to 0°; a center dot scales in once the strokes have arrived. The
 * source-of-truth motion is defined in
 * `/Users/nsuthar/Downloads/logo-animation.svg` and is reproduced here with
 * native SMIL so the markup stays portable to other contexts (favicons,
 * marketing assets, etc.).
 *
 * Honours `prefers-reduced-motion` by skipping the animation and rendering
 * the assembled final state directly. `loop` repeats indefinitely (e.g. for
 * a thinking indicator); when `loop` is false (the default) the animation
 * plays once and freezes on the final mark.
 */
/**
 * Animation variant.
 * - `default`: original — strokes spiral inward, group rotates -270°→0°, dot scales in last.
 * - `default-out`: assembled → disappear → assembled. Mark sits drawn,
 *                  un-draws (dot first, then strokes, group rotates outward),
 *                  holds empty, then redraws back to the assembled mark.
 *                  Loops cleanly (start- and end-state are identical).
 * - `disappear`: one-shot exit — assembled mark un-draws (dot first, then
 *                strokes, group rotates 0°→-270° outward), ends empty.
 *                Useful for "icon is going away" transitions.
 * - `from-dot`: dot lands first, then arcs bloom in a tap-tap … tap-tap rhythm
 *               while the group sweeps -540°→0° (CW from the viewer's POV).
 * - `from-dot-reverse`: same bloom, opposite rotation (+540°→0°, CCW).
 * - `star`: builds the Leo logo, then BLOOMS 4 extra L copies at 45°
 *           rotational offsets to form an 8-point starburst, while the
 *           whole group spins through 360°. Sparkle in, hold, retreat —
 *           ends back at the Leo logo.
 */
export type LeoIconVariant =
  | "default"
  | "default-out"
  | "disappear"
  | "from-dot"
  | "from-dot-reverse"
  | "star";

export type LeoAIIconAnimationProps = {
  /** Final pixel size of the square icon. Defaults to 44. */
  size?: number;
  /** Total assembly duration in ms. Defaults to 2000. */
  durationMs?: number;
  /** Play automatically on mount. Defaults to true. */
  autoPlay?: boolean;
  /** Loop the assembly continuously. Defaults to false (plays once, holds). */
  loop?: boolean;
  /** Stroke / dot colour. Defaults to the Leo brand pink. */
  color?: string;
  /** Stroke width in the 73×73 viewBox. Defaults to 5. */
  strokeWidth?: number;
  /** Animation choreography. Defaults to `default`. */
  variant?: LeoIconVariant;
  /** Called once the final dot has settled (only fires when `loop` is false). */
  onComplete?: () => void;
  /** Adds aria-label / role. Defaults to decorative (aria-hidden). */
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
};

/** The four arcs that make up the Leo mark, sampled from logo-animation.svg.
 *  Each is a roughly-equal-length curved stroke (~44.31 path-units long) so a
 *  single dasharray value drives the draw-in for all of them. */
const ARC_PATHS = [
  "M22.0 41.0 L34.4415 53.4415 C37.527 56.527 42.516 56.5708 45.6551 53.5399 L54.5 45.0",
  "M40.3562 48.2228 L52.2677 35.273 C55.2218 32.0614 55.0573 27.075 51.898 24.065 L42.9965 15.5842",
  "M29.0 22.0 L16.5585 34.4415 C13.473 37.527 13.4292 42.516 16.4601 45.6551 L25.0 54.5",
  "M46.8897 28.9956 L34.1764 16.832 C31.0235 13.8154 26.0348 13.8819 22.9633 16.9814 L14.3093 25.7146",
] as const;
const ARC_DASH_LENGTH = 44.31;

/** Final mark, rendered as a static SVG (no SMIL). Used both as the
 *  reduced-motion fallback and as the post-animation freeze frame. */
function LeoStaticMark({
  color,
  strokeWidth,
}: {
  color: string;
  strokeWidth: number;
}) {
  return (
    <>
      {ARC_PATHS.map((d, i) => (
        <path
          key={i}
          d={d}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
        />
      ))}
      <circle cx="34.5" cy="35.1" r="4" fill={color} />
    </>
  );
}

type VariantProps = {
  color: string;
  strokeWidth: number;
  durSeconds: string;
  repeatCount: string;
  smilFill: string | undefined;
};

/**
 * Original choreography. Strokes spiral inward via stroke-dashoffset while
 * the group rotates -270°→0°; dot scales in last.
 */
function DefaultVariant({
  color,
  strokeWidth,
  durSeconds,
  repeatCount,
  smilFill,
}: VariantProps) {
  return (
    <>
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="-270 34.5 35.1; 0 34.5 35.1; 0 34.5 35.1"
          keyTimes="0;0.7;1"
          calcMode="spline"
          keySplines="0.2 0.6 0.2 1; 0 0 1 1"
          dur={durSeconds}
          repeatCount={repeatCount}
          fill={smilFill}
        />
        {ARC_PATHS.map((d, i) => (
          <path
            key={i}
            d={d}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={ARC_DASH_LENGTH}
            strokeDashoffset={ARC_DASH_LENGTH}
          >
            <animate
              attributeName="stroke-dashoffset"
              values={`${ARC_DASH_LENGTH};0;0`}
              keyTimes="0;0.7;1"
              calcMode="spline"
              keySplines="0.2 0.6 0.2 1; 0 0 1 1"
              dur={durSeconds}
              repeatCount={repeatCount}
              fill={smilFill}
            />
          </path>
        ))}
      </g>
      <circle cx="34.5" cy="35.1" r="0" fill={color}>
        <animate
          attributeName="r"
          values="0;0;4;4"
          keyTimes="0;0.55;0.7;1"
          calcMode="spline"
          keySplines="0 0 1 1;0.2 0.6 0.2 1;0 0 1 1"
          dur={durSeconds}
          repeatCount={repeatCount}
          fill={smilFill}
        />
      </circle>
    </>
  );
}

/**
 * One-shot disappear — the assembled mark un-draws and *stays* empty.
 * Used for "icon is going away" transitions (e.g. the FAB hiding behind
 * the drawer). Mirrors the original {@link DefaultVariant} exactly:
 *   1. Mark holds the assembled state for the first 5% (avoids a jump
 *      while the SMIL graph initialises).
 *   2. Dot vanishes first (0.05 → 0.20) — it was the *last* element to
 *      land in the appear, so it's the *first* to leave on the way out.
 *   3. Strokes simultaneously start un-drawing (0.05 → 1.0) while the
 *      group rotates 0° → -270° outward. Ease-in cubic on both so motion
 *      accelerates as it leaves the frame, the natural inversion of an
 *      ease-out entrance.
 *
 * Ends fully empty (`strokeDashoffset={DASH}`, `r=0`) and freezes there
 * via `smilFill="freeze"`.
 */
function DisappearVariant({
  color,
  strokeWidth,
  durSeconds,
  repeatCount,
  smilFill,
}: VariantProps) {
  const EASE_IN = "0.55 0 0.45 0.45";

  return (
    <>
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 34.5 35.1; 0 34.5 35.1; -270 34.5 35.1"
          keyTimes="0;0.05;1"
          calcMode="spline"
          keySplines={`0 0 1 1; ${EASE_IN}`}
          dur={durSeconds}
          repeatCount={repeatCount}
          fill={smilFill}
        />
        {ARC_PATHS.map((d, i) => (
          <path
            key={i}
            d={d}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={ARC_DASH_LENGTH}
            strokeDashoffset={0}
          >
            <animate
              attributeName="stroke-dashoffset"
              values={`0;0;${ARC_DASH_LENGTH}`}
              keyTimes="0;0.05;1"
              calcMode="spline"
              keySplines={`0 0 1 1; ${EASE_IN}`}
              dur={durSeconds}
              repeatCount={repeatCount}
              fill={smilFill}
            />
          </path>
        ))}
      </g>
      <circle cx="34.5" cy="35.1" r="4" fill={color}>
        <animate
          attributeName="r"
          values="4;4;0;0"
          keyTimes="0;0.05;0.20;1"
          calcMode="spline"
          keySplines={`0 0 1 1; ${EASE_IN}; 0 0 1 1`}
          dur={durSeconds}
          repeatCount={repeatCount}
          fill={smilFill}
        />
      </circle>
    </>
  );
}

/**
 * Disappear → reappear cycle. Starts assembled, un-draws (dot leaves first),
 * holds empty, then redraws — ending in the same assembled state it started
 * in. One disappear and one re-appear per cycle: when looped, you see the
 * mark vanish and reappear over and over, with no double-appear seam at
 * loop boundaries.
 *
 * Timeline (fractions of `durSeconds`):
 *   0.000 – 0.250  Hold the assembled mark.
 *   0.250 – 0.350  Dot vanishes (mirror of the original's last-to-land pop).
 *   0.250 – 0.500  Strokes un-draw; group rotates 0°→-270° outward.
 *                  Both run in parallel with the dot, but the dot finishes
 *                  first so it leads visually.
 *   0.500 – 0.700  Hold empty.
 *   0.700 – 0.900  Strokes redraw; group rotates -270°→0°. Dot stays hidden
 *                  until 0.840, then pops back in (matches the original's
 *                  0.55→0.70 dot timing relative to the appear phase).
 *   0.900 – 1.000  Hold the assembled mark.
 *
 * Easing: ease-out (`EASE_OUT`) for appear motion, ease-in (`EASE_IN`,
 * mirror of EASE_OUT) for disappear motion — matches the symmetry the
 * original `DefaultVariant` already establishes.
 *
 * Initial element values are the *assembled* state (`strokeDashoffset={0}`,
 * `r={4}`) so the mark renders correctly before the animation fires and
 * loops are seamless.
 */
function DefaultOutVariant({
  color,
  strokeWidth,
  durSeconds,
  repeatCount,
  smilFill,
}: VariantProps) {
  const EASE_OUT = "0.2 0.6 0.2 1"; // appear easing (matches DefaultVariant)
  const EASE_IN = "0.55 0 0.45 0.45"; // disappear (mirror of EASE_OUT)
  const HOLD = "0 0 1 1"; // linear; segment values are equal so easing is moot

  // Group rotation & arc strokes share an identical 6-keyframe skeleton:
  //   hold full → disappear → hold empty → appear → hold full.
  const SKELETON_TIMES = "0;0.25;0.50;0.70;0.90;1";
  const SKELETON_SPLINES = `${HOLD}; ${EASE_IN}; ${HOLD}; ${EASE_OUT}; ${HOLD}`;

  return (
    <>
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 34.5 35.1; 0 34.5 35.1; -270 34.5 35.1; -270 34.5 35.1; 0 34.5 35.1; 0 34.5 35.1"
          keyTimes={SKELETON_TIMES}
          calcMode="spline"
          keySplines={SKELETON_SPLINES}
          dur={durSeconds}
          repeatCount={repeatCount}
          fill={smilFill}
        />
        {ARC_PATHS.map((d, i) => (
          <path
            key={i}
            d={d}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={ARC_DASH_LENGTH}
            strokeDashoffset={0}
          >
            <animate
              attributeName="stroke-dashoffset"
              values={`0;0;${ARC_DASH_LENGTH};${ARC_DASH_LENGTH};0;0`}
              keyTimes={SKELETON_TIMES}
              calcMode="spline"
              keySplines={SKELETON_SPLINES}
              dur={durSeconds}
              repeatCount={repeatCount}
              fill={smilFill}
            />
          </path>
        ))}
      </g>
      {/* Dot has its own schedule: it leaves first on the way out (0.25 →
          0.35) and lands last on the way back (0.840 → 0.890), mirroring
          the original DefaultVariant's "dot-arrives-last" trick. */}
      <circle cx="34.5" cy="35.1" r="4" fill={color}>
        <animate
          attributeName="r"
          values="4;4;0;0;4;4"
          keyTimes="0;0.25;0.35;0.84;0.89;1"
          calcMode="spline"
          keySplines={`${HOLD}; ${EASE_IN}; ${HOLD}; ${EASE_OUT}; ${HOLD}`}
          dur={durSeconds}
          repeatCount={repeatCount}
          fill={smilFill}
        />
      </circle>
    </>
  );
}

/**
 * "Bloom" choreography. Re-orchestrates the original drawing motion with
 * dynamic, rhythmic pacing instead of uniform clockwork:
 *   1. Dot lands FIRST with a soft overshoot (0..10% of timeline) — short
 *      and tight, so there's no dead air before the strokes start.
 *   2. The arc group performs a -540° → 0° sweep (1.5 turns) — bigger than
 *      the default variant's -270° so the bloom really swings into place.
 *      Eased with the same gentle `0.2 0.6 0.2 1` spline.
 *   3. The four arcs draw in a "tap-tap … tap-tap" pulse rather than evenly
 *      spaced beats: top fires the instant the dot peaks, right chases,
 *      a small breath, then bottom and left close the phrase. Alternating
 *      easings (snap → flow → snap → flow) keep it from feeling metronomic.
 *
 * SMIL `keySplines` values must stay in [0,1]; the dot's soft overshoot is
 * achieved purely via the value list (`0; 4.2; 4`).
 */
function FromDotVariant({
  color,
  strokeWidth,
  durSeconds,
  repeatCount,
  smilFill,
  reverseRotation = false,
}: VariantProps & { reverseRotation?: boolean }) {
  // Two easing personalities that we alternate between arcs to break
  // uniformity and inject rhythm. Both are valid SMIL ease-outs.
  const SNAP = "0.16 1 0.3 1"; // ease-out-expo — sharp attack, long settle
  const FLOW = "0.34 1 0.64 1"; // ease-out-quart — smooth, gentle settle

  // [pathIndex, start, end, spline]. Top arc starts at 0.10 — the SAME
  // moment the dot peaks — so there's no dead air between the dot landing
  // and the first stroke firing. Top + right form a quick beat-pair, then
  // a small breath, then bottom + left close the phrase. Slot lengths vary
  // (30, 32, 32, 36%) so the cadence breathes instead of pulsing flat.
  const ARC_SCHEDULE: Array<[number, number, number, string]> = [
    [3, 0.10, 0.40, SNAP], // top    — lead, fires as the dot peaks
    [1, 0.22, 0.54, FLOW], // right  — flows out of top (12% offset)
    [0, 0.42, 0.74, SNAP], // bottom — second beat pair, snappy
    [2, 0.56, 0.92, FLOW], // left   — final flow, longest slot to settle
  ];

  return (
    <>
      {/* Dot lands FIRST with a single soft overshoot — and tightens to
          end at 0.10, so the first arc fires the instant the dot peaks. */}
      <circle cx="34.5" cy="35.1" r="0" fill={color}>
        <animate
          attributeName="r"
          values="0;4.2;4;4"
          keyTimes="0;0.07;0.10;1"
          calcMode="spline"
          keySplines="0.34 0.6 0.4 1; 0.5 0 0.5 1; 0 0 1 1"
          dur={durSeconds}
          repeatCount={repeatCount}
          fill={smilFill}
        />
      </circle>

      {/* Rotating arc group. Full ±540° sweep (1.5 turns) — direction
          flipped via `reverseRotation`. Same gentle ease-out spline as
          the default variant so the rotation feels generous rather than
          mechanical. Starts at 0.10 alongside the first arc. */}
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          values={
            reverseRotation
              ? "540 34.5 35.1; 540 34.5 35.1; 0 34.5 35.1; 0 34.5 35.1"
              : "-540 34.5 35.1; -540 34.5 35.1; 0 34.5 35.1; 0 34.5 35.1"
          }
          keyTimes="0;0.10;0.94;1"
          calcMode="spline"
          keySplines="0 0 1 1; 0.2 0.6 0.2 1; 0 0 1 1"
          dur={durSeconds}
          repeatCount={repeatCount}
          fill={smilFill}
        />

        {/* Rhythmic cascade. Alternating snap/flow easings give the
            sequence a tap-tap … tap-tap pulse. */}
        {ARC_SCHEDULE.map(([pathIdx, start, end, spline]) => (
          <path
            key={pathIdx}
            d={ARC_PATHS[pathIdx]}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={ARC_DASH_LENGTH}
            strokeDashoffset={ARC_DASH_LENGTH}
          >
            <animate
              attributeName="stroke-dashoffset"
              values={`${ARC_DASH_LENGTH};${ARC_DASH_LENGTH};0;0`}
              keyTimes={`0;${start.toFixed(2)};${end.toFixed(2)};1`}
              calcMode="spline"
              keySplines={`0 0 1 1; ${spline}; 0 0 1 1`}
              dur={durSeconds}
              repeatCount={repeatCount}
              fill={smilFill}
            />
          </path>
        ))}
      </g>
    </>
  );
}

/**
 * Star burst choreography. Keeps the four original L arcs and adds four
 * more L *copies* rotated 45° — but the trick is that during the star
 * phase, each L *translates outward radially* from the centre. The eight
 * arcs fly out from the dot, separating into eight distinct star arms,
 * before flying back to reform the Leo logo.
 *
 * Why it reads as a star (this time): each L is a curved "U" shape that
 * naturally points its tip outward (the curve is the outermost part of
 * the L). Translating each L further out along its own outward direction
 * creates eight visually distinct curved arms radiating from the centre
 * dot — a curved 8-point star.
 *
 * Timeline (fractions of `durSeconds`):
 *   0.000 – 0.220  Logo assembles — original 4 Ls draw in, group rotates
 *                  -270° → 0°. Dot pops at the end (default appear).
 *   0.220 – 0.300  Hold the Leo logo.
 *   0.300 – 0.500  Burst out — every L translates outward (along its own
 *                  radial direction) by `STAR_RADIUS` units. Extras
 *                  cascade in (drawing themselves *while* flying out, so
 *                  they emerge from centre like sparks).
 *   0.500 – 0.650  Hold the 8-point star at full extent.
 *   0.650 – 0.800  Retreat — every L translates back to centre. Extras
 *                  un-draw in REVERSE cascade as they collapse inward.
 *   0.220 – 0.850  Group continuously rotates a full 360° through the
 *                  whole star phase — gives the burst a sparkler/pinwheel
 *                  feel rather than a static pose.
 *   0.800 – 1.000  Hold the Leo logo.
 *
 * Dot pulses larger (4 → 5.5) at the star peak then settles to 4.
 */
function StarVariant({
  color,
  strokeWidth,
  durSeconds,
  repeatCount,
  smilFill,
}: VariantProps) {
  const EASE_OUT = "0.2 0.6 0.2 1"; // appear / pop / fly-out
  const EASE_IN = "0.55 0 0.45 0.45"; // retreat / fly-in
  const EASE_IN_OUT = "0.4 0 0.6 1"; // smooth spin
  const LINEAR = "0 0 1 1"; // hold (segment values equal anyway)

  // How far each L flies outward from centre at the star peak (path units
  // in the 73×73 viewBox). Tuned so the eight arms separate cleanly
  // without clipping the viewBox.
  const STAR_RADIUS = 10;

  // Per-arc *local-frame* outward direction. Each L sits at one of the
  // four cardinal positions in the Leo mark and naturally faces outward
  // along this vector. (The extras live inside a rotate(45°) parent, so
  // these LOCAL vectors automatically map to NE/SE/SW/NW in world coords
  // — that's exactly what we want.)
  const ARC_OUTWARD: ReadonlyArray<readonly [number, number]> = [
    [0, 1], // path 0 — south (bottom)
    [1, 0], // path 1 — east (right)
    [-1, 0], // path 2 — west (left)
    [0, -1], // path 3 — north (top)
  ];

  // Translate keyframes shared by all 8 arcs: hold at 0, fly out, hold,
  // fly back. Shared timeline keeps the burst synchronous.
  const TRANSLATE_KEYTIMES = "0;0.30;0.50;0.65;0.80;1";
  const TRANSLATE_SPLINES = `${LINEAR}; ${EASE_OUT}; ${LINEAR}; ${EASE_IN}; ${LINEAR}`;

  /** Render one L with its own translate animation + stroke-draw schedule. */
  const renderArc = (
    pathIndex: number,
    keySuffix: string,
    schedule:
      | { kind: "stay"; drawEnd: number }
      | { kind: "cascade"; drawStart: number; drawEnd: number; undrawStart: number; undrawEnd: number },
  ) => {
    const [dx, dy] = ARC_OUTWARD[pathIndex];
    const tx = (dx * STAR_RADIUS).toFixed(2);
    const ty = (dy * STAR_RADIUS).toFixed(2);

    const strokeProps =
      schedule.kind === "stay"
        ? {
            values: `${ARC_DASH_LENGTH};0;0`,
            keyTimes: `0;${schedule.drawEnd.toFixed(2)};1`,
            keySplines: `${EASE_OUT}; ${LINEAR}`,
          }
        : {
            values: `${ARC_DASH_LENGTH};${ARC_DASH_LENGTH};0;0;${ARC_DASH_LENGTH};${ARC_DASH_LENGTH}`,
            keyTimes: `0;${schedule.drawStart.toFixed(2)};${schedule.drawEnd.toFixed(2)};${schedule.undrawStart.toFixed(2)};${schedule.undrawEnd.toFixed(2)};1`,
            keySplines: `${LINEAR}; ${EASE_OUT}; ${LINEAR}; ${EASE_IN}; ${LINEAR}`,
          };

    return (
      <g key={`${keySuffix}-${pathIndex}`}>
        <animateTransform
          attributeName="transform"
          type="translate"
          values={`0 0; 0 0; ${tx} ${ty}; ${tx} ${ty}; 0 0; 0 0`}
          keyTimes={TRANSLATE_KEYTIMES}
          calcMode="spline"
          keySplines={TRANSLATE_SPLINES}
          dur={durSeconds}
          repeatCount={repeatCount}
          fill={smilFill}
        />
        <path
          d={ARC_PATHS[pathIndex]}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={ARC_DASH_LENGTH}
          strokeDashoffset={ARC_DASH_LENGTH}
        >
          <animate
            attributeName="stroke-dashoffset"
            values={strokeProps.values}
            keyTimes={strokeProps.keyTimes}
            calcMode="spline"
            keySplines={strokeProps.keySplines}
            dur={durSeconds}
            repeatCount={repeatCount}
            fill={smilFill}
          />
        </path>
      </g>
    );
  };

  return (
    <>
      <g>
        {/* Continuous 360° spin through the whole star phase — gives the
            burst a sparkler/pinwheel quality rather than a static pose. */}
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="-270 34.5 35.1; 0 34.5 35.1; -360 34.5 35.1; -360 34.5 35.1"
          keyTimes="0;0.22;0.85;1"
          calcMode="spline"
          keySplines={`${EASE_OUT}; ${EASE_IN_OUT}; ${LINEAR}`}
          dur={durSeconds}
          repeatCount={repeatCount}
          fill={smilFill}
        />

        {/* Original 4 Ls — draw with the default appear (stay drawn the
            rest of the timeline) and translate outward during the burst. */}
        {ARC_PATHS.map((_, i) =>
          renderArc(i, "orig", { kind: "stay", drawEnd: 0.22 }),
        )}

        {/* Extra 4 Ls at 45° offset — cascade in/out and translate
            outward in their LOCAL frame (so they fly to NE/SE/SW/NW in
            world coords, filling the diagonals between originals). */}
        <g transform="rotate(45 34.5 35.1)">
          {ARC_PATHS.map((_, i) =>
            renderArc(i, "extra", {
              kind: "cascade",
              drawStart: 0.3 + i * 0.04,
              drawEnd: 0.3 + i * 0.04 + 0.18,
              // Reverse cascade on retreat: last to bloom is first to fade.
              undrawStart: 0.7 - i * 0.02,
              undrawEnd: 0.7 - i * 0.02 + 0.1,
            }),
          )}
        </g>
      </g>

      {/* Centre dot — pops in last, pulses bigger at the star peak. */}
      <circle cx="34.5" cy="35.1" r="0" fill={color}>
        <animate
          attributeName="r"
          values="0;0;4;4;5.5;4;4"
          keyTimes="0;0.17;0.22;0.4;0.55;0.78;1"
          calcMode="spline"
          keySplines={`${LINEAR}; ${EASE_OUT}; ${LINEAR}; ${EASE_OUT}; ${EASE_IN}; ${LINEAR}`}
          dur={durSeconds}
          repeatCount={repeatCount}
          fill={smilFill}
        />
      </circle>
    </>
  );
}

export function LeoAIIconAnimation({
  size = 44,
  durationMs = 2000,
  autoPlay = true,
  loop = false,
  color = ASK_LEO_BRAND_PINK,
  strokeWidth = 5,
  variant = "default",
  onComplete,
  ariaLabel,
  className,
  style,
}: LeoAIIconAnimationProps) {
  const [prefersReduced, setPrefersReduced] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const update = () => setPrefersReduced(mq.matches);
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  // Fire onComplete when the one-shot animation lands. Looping animations
  // never settle, so we skip the callback in that mode.
  useEffect(() => {
    if (!autoPlay || loop || prefersReduced) return;
    if (!onCompleteRef.current) return;
    const id = window.setTimeout(() => onCompleteRef.current?.(), durationMs + 40);
    return () => window.clearTimeout(id);
  }, [autoPlay, durationMs, loop, prefersReduced]);

  const decorative = !ariaLabel;
  const showStatic = prefersReduced || !autoPlay;
  const durSeconds = `${(durationMs / 1000).toFixed(3)}s`;
  const repeatCount = loop ? "indefinite" : "1";
  // SMIL `fill="freeze"` holds the final keyframe value; only meaningful for
  // non-looping playback. When looping we let `fill` default to `remove`.
  const smilFill = loop ? undefined : "freeze";

  const px = Math.round(size);

  return (
    <span
      data-leo-mark
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center leading-none",
        className,
      )}
      style={{ width: px, height: px, minWidth: px, minHeight: px, ...style }}
      role={decorative ? "presentation" : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : ariaLabel}
    >
      <svg
        viewBox="0 0 73 73"
        width={px}
        height={px}
        xmlns="http://www.w3.org/2000/svg"
        focusable="false"
        aria-hidden
        className="size-full block"
        shapeRendering="geometricPrecision"
      >
        {showStatic ? (
          <LeoStaticMark color={color} strokeWidth={strokeWidth} />
        ) : variant === "from-dot" ? (
          <FromDotVariant
            color={color}
            strokeWidth={strokeWidth}
            durSeconds={durSeconds}
            repeatCount={repeatCount}
            smilFill={smilFill}
          />
        ) : variant === "from-dot-reverse" ? (
          <FromDotVariant
            color={color}
            strokeWidth={strokeWidth}
            durSeconds={durSeconds}
            repeatCount={repeatCount}
            smilFill={smilFill}
            reverseRotation
          />
        ) : variant === "default-out" ? (
          <DefaultOutVariant
            color={color}
            strokeWidth={strokeWidth}
            durSeconds={durSeconds}
            repeatCount={repeatCount}
            smilFill={smilFill}
          />
        ) : variant === "disappear" ? (
          <DisappearVariant
            color={color}
            strokeWidth={strokeWidth}
            durSeconds={durSeconds}
            repeatCount={repeatCount}
            smilFill={smilFill}
          />
        ) : variant === "star" ? (
          <StarVariant
            color={color}
            strokeWidth={strokeWidth}
            durSeconds={durSeconds}
            repeatCount={repeatCount}
            smilFill={smilFill}
          />
        ) : (
          <DefaultVariant
            color={color}
            strokeWidth={strokeWidth}
            durSeconds={durSeconds}
            repeatCount={repeatCount}
            smilFill={smilFill}
          />
        )}
      </svg>
    </span>
  );
}

export default LeoAIIconAnimation;
