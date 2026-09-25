import { useState, useEffect, JSX } from 'react';
import type { SpinnerProps } from './Spinner';

type PieSpinnerSize = SpinnerProps['size'] | number;

type PieSpinnerProps = {
  size?: PieSpinnerSize;
  color?: string;
  delay?: number;
  id?: string;
  strokeWidth?: number;
  strokeColor?: string;
  ariaLabel?: string;
};

const SIZE_TO_PIXELS: Record<Exclude<SpinnerProps['size'], undefined>, number> = {
  xs: 24,
  sm: 32,
  md: 48,
  lg: 64,
  xl: 80,
};

const getPixelSize = (size: PieSpinnerSize | undefined): number => {
  if (typeof size === 'number') return size;
  const key = size ?? 'md';
  return SIZE_TO_PIXELS[key];
};

const PieSpinner = ({
  size = 'md',
  color = '#2D63EB',
  delay = 3000,
  id,
  strokeWidth = 4,
  strokeColor = '#ffffff',
  ariaLabel = 'Loading...',
}: PieSpinnerProps): JSX.Element => {
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    let raf: number;
    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = (elapsed % delay) / delay;
      setAngle(progress * 360);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [delay]);

  const pixelSize = getPixelSize(size);

  const r = pixelSize / 2;
  const cx = r;
  const cy = r;
  const outerRadius = r - strokeWidth / 2 - 1;
  const gap = pixelSize * 0.07;
  const innerRadius = outerRadius - gap;

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const endX = cx + innerRadius * Math.sin(toRad(angle));
  const endY = cy - innerRadius * Math.cos(toRad(angle));
  const largeArc = angle > 180 ? 1 : 0;
  const fullCircle = angle >= 359.99;

  return (
    <div role="status" aria-live="polite" aria-busy="true" aria-label={ariaLabel}>
      <svg
        id={id}
        aria-hidden="true"
        width={pixelSize}
        height={pixelSize}
        viewBox={`0 0 ${pixelSize} ${pixelSize}`}
      >
        <circle
          cx={cx}
          cy={cy}
          r={outerRadius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
        <circle cx={cx} cy={cy} r={innerRadius} fill="none" />
        {fullCircle ? (
          <circle cx={cx} cy={cy} r={innerRadius} fill={color} />
        ) : angle > 0 ? (
          <path
            d={`M ${cx} ${cy} L ${cx} ${cy - innerRadius} A ${innerRadius} ${innerRadius} 0 ${largeArc} 1 ${endX} ${endY} Z`}
            fill={color}
          />
        ) : null}
      </svg>
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
};

export default PieSpinner;
