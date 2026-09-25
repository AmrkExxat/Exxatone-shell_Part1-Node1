import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

/**
 * Tracks horizontal scroll position for fixed columns
 */
export function useScrollTracking() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => setScrollLeft(container.scrollLeft);
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return { containerRef, scrollLeft };
}

/**
 * Manages virtualization for large datasets
 */
export function useGridVirtualization(
  enabled: boolean,
  rowCount: number,
  containerRef: React.RefObject<HTMLDivElement>,
  overscan: number = 10
) {
  const rowVirtualizer = useVirtualizer({
    count: enabled ? rowCount : 0,
    getScrollElement: () => containerRef.current,
    estimateSize: useCallback(() => 52, []),
    overscan,
    enabled,
  });

  const virtualRows = enabled ? rowVirtualizer.getVirtualItems() : [];
  const totalSize = enabled ? rowVirtualizer.getTotalSize() : 0;
  const paddingTop = virtualRows.length > 0 ? virtualRows[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0 ? totalSize - (virtualRows[virtualRows.length - 1]?.end || 0) : 0;

  return { virtualRows, paddingTop, paddingBottom };
}

/**
 * Generates memoized key strings for tracking column changes
 */
export function useColumnKeys(
  visibleColumns: any[],
  columnPinning: { left?: string[]; right?: string[]; fixed?: string[] }
) {
  const columnOrderKey = useMemo(
    () => visibleColumns.map((col) => col.id).join(','),
    [visibleColumns]
  );

  const columnPinningKey = useMemo(
    () =>
      `${columnPinning.left?.join(',') || 'none'}-${columnPinning.right?.join(',') || 'none'}-${
        columnPinning.fixed?.join(',') || 'none'
      }`,
    [columnPinning]
  );

  return { columnOrderKey, columnPinningKey };
}

/**
 * Calculates derived grid metrics
 */
export function useGridMetrics(
  visibleColumns: any[],
  columnSizing: any,
  gridHeight: number | string
) {
  const totalTableWidth = useMemo(
    () => visibleColumns.reduce((acc, col) => acc + col.getSize(), 0),
    [visibleColumns, columnSizing]
  );

  const calculatedGridHeight = typeof gridHeight === 'number' ? `${gridHeight}px` : gridHeight;

  return { totalTableWidth, calculatedGridHeight };
}

/**
 * Generates array indices for skeleton/filler rows
 */
export function useRowIndices(targetRowCount: number, fillerRowCount: number = 0) {
  const skeletonIndices = useMemo(
    () => Array.from({ length: targetRowCount }, (_, i) => i),
    [targetRowCount]
  );

  const fillerIndices = useMemo(
    () => Array.from({ length: fillerRowCount }, (_, i) => i),
    [fillerRowCount]
  );

  return { skeletonIndices, fillerIndices };
}
