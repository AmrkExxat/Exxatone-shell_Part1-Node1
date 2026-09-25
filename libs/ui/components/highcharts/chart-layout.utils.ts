import type { CSSProperties } from 'react';

/**
 * Fluid layout: chart fills its container and reflows on resize.
 * Fixed layout (legacy): explicit width is passed through to Highcharts and the wrapper.
 */
export function isFluidChartWidth(width?: number | string | null): boolean {
  if (width === undefined || width === null) {
    return true;
  }
  if (typeof width === 'number') {
    return false;
  }
  const normalized = String(width).trim().toLowerCase();
  return normalized === '' || normalized === '100%';
}

export function getChartContainerLayout({
  width,
  height,
  className = '',
  style = {},
  /** Use minHeight for fluid charts with data; use fixed height for empty states. */
  useMinHeight = true,
}: {
  width?: number | string | null;
  height?: number | string;
  className?: string;
  style?: CSSProperties;
  useMinHeight?: boolean;
}): {
  isFluidWidth: boolean;
  className: string;
  style: CSSProperties;
} {
  const isFluidWidth = isFluidChartWidth(width);

  if (isFluidWidth) {
    return {
      isFluidWidth: true,
      className: `w-full min-w-0 ${className}`.trim(),
      style: {
        ...style,
        ...(useMinHeight ? { minHeight: height } : { height }),
        width: '100%',
      },
    };
  }

  return {
    isFluidWidth: false,
    className,
    style: {
      ...style,
      height,
      width: width as number | string,
    },
  };
}
