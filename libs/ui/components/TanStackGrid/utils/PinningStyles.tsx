import { Column } from '@tanstack/react-table';

export interface PinningStylesParams {
  column: Column<any, unknown>;
  isHeader: boolean;
  rowState?: {
    isHovered: boolean;
    isSelected: boolean;
    isEven: boolean;
  };
  columnPinning: {
    left?: string[];
    right?: string[];
    fixed?: string[];
  };
  enableStripedRows: boolean;
  scrollLeft: number;
  allColumns: Column<any, unknown>[];
  containerWidth: number;
}

export function getPinningStylesForCell({
  column,
  isHeader,
  rowState,
  columnPinning,
  enableStripedRows,
  scrollLeft,
  allColumns,
  containerWidth,
}: PinningStylesParams): React.CSSProperties {
  const pinned = column.getIsPinned();
  const id = column.id;
  const isFixed = columnPinning.fixed?.includes(id);

  if (!pinned && !isFixed) return {};

  // Body rows use CSS variable --row-bg (set on <tr> with hover) to avoid re-renders on hover
  const backgroundColor = isHeader
    ? '#e8eaf6' // light header tint
    : 'var(--row-bg, white)';

  // Base sticky styles
  const stickyBase: React.CSSProperties = {
    position: 'sticky',
    top: isHeader ? 0 : undefined,
    zIndex: isHeader ? 30 : 10,
    backgroundColor,
  };

  // Handle regular left/right pinned columns
  if (pinned === 'left') {
    return { ...stickyBase, left: `${column.getStart('left')}px` };
  }

  if (pinned === 'right') {
    return { ...stickyBase, right: `${column.getAfter('right')}px` };
  }

  // Handle fixed columns (scrollable within viewport)
  if (!isFixed) return { backgroundColor };

  const leftPinned = columnPinning.left ?? [];
  const rightPinned = columnPinning.right ?? [];
  const fixedList = columnPinning.fixed ?? [];

  // Calculate width of pinned columns
  const calcPinnedWidth = (ids: string[]) =>
    ids.reduce((w, cid) => {
      const col = allColumns.find((c) => c.id === cid);
      return col ? w + col.getSize() : w;
    }, 0);

  const leftPinnedWidth = calcPinnedWidth(leftPinned);
  const rightPinnedWidth = calcPinnedWidth(rightPinned);

  // Get scrollable columns (not left/right pinned)
  const scrollableColumns = allColumns.filter(
    (col) => !leftPinned.includes(col.id) && !rightPinned.includes(col.id)
  );

  // Map scrollable column positions
  const scrollablePositions = new Map<string, { left: number; size: number }>();
  let pos = 0;
  scrollableColumns.forEach((col) => {
    scrollablePositions.set(col.id, { left: pos, size: col.getSize() });
    pos += col.getSize();
  });

  // Get fixed columns sorted by position
  const fixedColumns = fixedList
    .map((cid) => {
      const p = scrollablePositions.get(cid);
      return p ? { id: cid, ...p } : null;
    })
    .filter(Boolean)
    .sort((a: any, b: any) => a.left - b.left);

  const currentIndex = fixedColumns.findIndex((c) => c.id === id);
  if (currentIndex === -1) return { backgroundColor };

  const currentCol = fixedColumns[currentIndex];
  const viewportLeft = leftPinnedWidth;
  const naturalLeft = viewportLeft + currentCol.left - scrollLeft;
  const naturalRight = naturalLeft + currentCol.size;

  // Check if should stick to left
  let leftEdge = leftPinnedWidth;
  for (let i = 0; i < currentIndex; i++) {
    const prev = fixedColumns[i];
    if (viewportLeft + prev.left - scrollLeft <= leftEdge) {
      leftEdge += prev.size;
    }
  }

  if (naturalLeft <= leftEdge) {
    return {
      ...stickyBase,
      left: `${leftEdge}px`,
      zIndex: isHeader ? 25 : 8,
    };
  }

  // Check if should stick to right
  const scrollableAreaRight = containerWidth - rightPinnedWidth;
  let rightEdge = rightPinnedWidth;
  for (let i = fixedColumns.length - 1; i > currentIndex; i--) {
    const next = fixedColumns[i];
    const nextRight = viewportLeft + next.left + next.size - scrollLeft;
    if (nextRight >= scrollableAreaRight - rightEdge) {
      rightEdge += next.size;
    }
  }

  if (naturalRight >= scrollableAreaRight - rightEdge) {
    return {
      ...stickyBase,
      right: `${rightEdge}px`,
      zIndex: isHeader ? 25 : 8,
    };
  }

  // Column is in normal scroll zone
  return { backgroundColor };
}
