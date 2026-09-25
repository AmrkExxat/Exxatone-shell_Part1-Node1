'use client';

import { useEffect, type RefObject } from 'react';

type UseChartResizeReflowOptions = {
  /** When false (fixed width), observer is not attached. */
  enabled: boolean;
  /** When false, observer is not attached (e.g. empty state with no chart instance). */
  active?: boolean;
};

/**
 * Observes the chart container and calls reflow when size changes (fluid width only).
 */
export function useChartResizeReflow(
  containerRef: RefObject<HTMLDivElement | null>,
  reflowChart: () => void,
  { enabled, active = true }: UseChartResizeReflowOptions
): void {
  useEffect(() => {
    if (!enabled || !active) return;

    const container = containerRef.current;
    if (!container) return;

    let lastWidth = 0;
    let lastHeight = 0;

    const resizeObserver = new ResizeObserver(() => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === lastWidth && h === lastHeight) return;
      lastWidth = w;
      lastHeight = h;
      reflowChart();
    });
    resizeObserver.observe(container);

    requestAnimationFrame(() => reflowChart());

    return () => resizeObserver.disconnect();
  }, [enabled, active, containerRef, reflowChart]);
}
