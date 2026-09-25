import { useState, useEffect } from 'react';
import type { JSX } from 'react';
import { SpinnerProps } from './Spinner';

type StarSpinnerSize = SpinnerProps['size'] | number;

type StarSpinnerProps = {
  size?: StarSpinnerSize;
  delay?: number;
  colors?: string[];
  id?: string;
  ariaLabel?: string;
};

const SIZE_TO_PIXELS: Record<Exclude<SpinnerProps['size'], undefined>, number> = {
  xs: 24,
  sm: 32,
  md: 48,
  lg: 64,
  xl: 80,
};

const DEFAULT_COLORS: string[] = ['#2D63EB', '#B1C5F7', '#B1C5F7', '#DAE4FB'];
const SPOKES = 8;

const getPixelSize = (size: StarSpinnerSize | undefined): number => {
  if (typeof size === 'number') return size;
  const key = size ?? 'lg';
  return SIZE_TO_PIXELS[key];
};

const StarSpinner = ({
  size = 'lg',
  delay = 100,
  colors = DEFAULT_COLORS,
  id,
  ariaLabel = 'Loading...',
}: StarSpinnerProps): JSX.Element => {
  const [step, setStep] = useState(0);

  const COLORS = colors;

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s + 1) % SPOKES);
    }, delay);
    return () => clearInterval(interval);
  }, [delay]);

  const pixelSize = getPixelSize(size);
  const baseSize = 64;
  const scale = pixelSize / baseSize;

  const cx = pixelSize / 2;
  const cy = pixelSize / 2;
  const r = pixelSize / 2;

  const centerRadius = 14 * scale;
  const innerGap = centerRadius + 4 * scale;
  const outerReach = r - 2 * scale;
  const spokeWidth = 8 * scale;
  const pad = spokeWidth / 2 + 2 * scale;

  return (
    <div role="status" aria-live="polite" aria-busy="true" aria-label={ariaLabel}>
      <svg
        aria-hidden="true"
        id={id}
        width={pixelSize}
        height={pixelSize}
        viewBox={`${-pad} ${-pad} ${pixelSize + 2 * pad} ${pixelSize + 2 * pad}`}
      >
        {Array.from({ length: SPOKES }).map((_, i) => {
          const angleDeg = (i * 360) / SPOKES - 90;
          const angleRad = (angleDeg * Math.PI) / 180;

          const dist = Math.min((i - step + SPOKES) % SPOKES, (step - i + SPOKES) % SPOKES);
          const color = COLORS[Math.min(dist, COLORS.length - 1)];

          const x1 = cx + Math.cos(angleRad) * innerGap;
          const y1 = cy + Math.sin(angleRad) * innerGap;
          const x2 = cx + Math.cos(angleRad) * outerReach;
          const y2 = cy + Math.sin(angleRad) * outerReach;

          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={color}
              strokeWidth={spokeWidth}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
};

export default StarSpinner;
