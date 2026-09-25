import { useState, useEffect } from 'react';
import type { JSX } from 'react';
import type { SpinnerProps } from './Spinner';

type DotSpinnerSize = SpinnerProps['size'] | number;

type DotSpinnerProps = {
  size?: DotSpinnerSize;
  delay?: number;
  colors?: string[];
  id?: string;
  ariaLabel?: string;
};

const DOTS = 16;
const TOTAL_STEPS = DOTS + 1;

const DEFAULT_COLORS: string[] = ['#2D63EB', '#B1C5F7', '#B1C5F7', '#DAE4FB'];

const SIZE_TO_PIXELS: Record<Exclude<SpinnerProps['size'], undefined>, number> = {
  xs: 24,
  sm: 32,
  md: 48,
  lg: 64,
  xl: 80,
};

const getPixelSize = (size: DotSpinnerSize | undefined): number => {
  if (typeof size === 'number') return size;
  const key = size ?? 'md';
  return SIZE_TO_PIXELS[key];
};

const DotSpinner = ({
  size = 'md',
  delay = 120,
  colors = DEFAULT_COLORS,
  id,
  ariaLabel = 'Loading...',
}: DotSpinnerProps): JSX.Element => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s + 1) % TOTAL_STEPS);
    }, delay);
    return () => clearInterval(interval);
  }, [delay]);

  const pixelSize = getPixelSize(size);
  const cx = pixelSize / 2;
  const cy = pixelSize / 2;

  const radius = pixelSize * (28 / 51);
  const dotW = pixelSize * (8 / 51);
  const dotH = pixelSize * (12 / 51);
  const dotR = dotW / 2;

  // Extra padding so rounded dots are never clipped, even at larger sizes
  const pad = dotH + dotW;

  const isLastStep = step === DOTS;

  return (
    <div role="status" aria-live="polite" aria-busy="true" aria-label={ariaLabel}>
      <svg
        id={id}
        aria-hidden="true"
        width={pixelSize}
        height={pixelSize}
        viewBox={`${-pad} ${-pad} ${pixelSize + 2 * pad} ${pixelSize + 2 * pad}`}
      >
        {Array.from({ length: DOTS }).map((_, i) => {
          const angleDeg = (i * 360) / DOTS - 90;
          const angleRad = (angleDeg * Math.PI) / 180;

          let color = 'transparent';

          if (isLastStep) {
            color = colors[0] ?? DEFAULT_COLORS[0];
          } else if (step > 0) {
            if (i < step) {
              const stepsBack = step - 1 - i;
              const paletteIndex = Math.min(stepsBack, colors.length - 1);
              color =
                colors[paletteIndex] ??
                colors[colors.length - 1] ??
                DEFAULT_COLORS[DEFAULT_COLORS.length - 1];
            }
          }

          const dotCx = cx + Math.cos(angleRad) * radius;
          const dotCy = cy + Math.sin(angleRad) * radius;

          return (
            <rect
              key={i}
              x={dotCx - dotW / 2}
              y={dotCy - dotH / 2}
              width={dotW}
              height={dotH}
              rx={dotR}
              ry={dotR}
              fill={color}
              transform={`rotate(${angleDeg + 90}, ${dotCx}, ${dotCy})`}
            />
          );
        })}
      </svg>
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
};

export default DotSpinner;
