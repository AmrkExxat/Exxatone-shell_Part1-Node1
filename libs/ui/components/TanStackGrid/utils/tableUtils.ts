import { ColumnPinningState } from '@tanstack/react-table';

export const getBorderStyle = (
  isActuallySticky: boolean,
  isPinned: string | false,
  isFixedColumn: boolean
): string => {
  if (!isActuallySticky) return '';

  if (isPinned === 'left') return 'shadow-[2px_0_4px_-2px_rgba(99,102,241,0.3)]';
  if (isPinned === 'right') return 'shadow-[-2px_0_4px_-2px_rgba(99,102,241,0.3)]';
  if (isFixedColumn) return 'shadow-[0_0_4px_rgba(147,51,234,0.3)]';

  return '';
};

export const getRowBackgroundColor = (
  isHeader: boolean,
  rowState?: { isSelected: boolean; isHovered: boolean; isEven: boolean },
  enableStripedRows?: boolean
): string => {
  if (isHeader) return '#e8eaf6';

  if (!rowState) return 'white';

  if (rowState.isSelected) return 'rgb(239, 246, 255)';
  if (rowState.isHovered) return 'rgb(243, 244, 246)';
  if (enableStripedRows && !rowState.isEven) return 'rgb(243, 244, 246)';

  return 'white';
};

export const calculatePinningStyles = (
  column: any,
  isPinned: string | false,
  isFixedColumn: boolean,
  scrollLeft: number,
  containerWidth: number,
  columnPinning: ColumnPinningState,
  allColumns: any[],
  isHeader: boolean,
  backgroundColor: string
) => {
  if (!isPinned && !isFixedColumn) return {};

  const baseStyle = {
    position: 'sticky' as const,
    zIndex: isHeader ? 30 : 10,
    top: isHeader ? 0 : undefined,
    backgroundColor,
  };

  // Handle regular left/right pinned columns
  if (isPinned === 'left') {
    return {
      ...baseStyle,
      left: `${column.getStart('left')}px`,
    };
  }

  if (isPinned === 'right') {
    return {
      ...baseStyle,
      right: `${column.getAfter('right')}px`,
    };
  }

  // Handle fixed position columns with stacking
  if (isFixedColumn) {
    const columnStart = column.getStart();
    const columnId = column.id;
    const columnWidth = column.getSize();

    // Calculate width of all left-pinned columns
    let leftPinnedWidth = 0;
    (columnPinning.left || []).forEach((id: string) => {
      const col = allColumns.find((c: any) => c.id === id);
      if (col && id !== columnId) leftPinnedWidth += col.getSize();
    });

    // Calculate width of all right-pinned columns
    let rightPinnedWidth = 0;
    (columnPinning.right || []).forEach((id: string) => {
      const col = allColumns.find((c: any) => c.id === id);
      if (col && id !== columnId) rightPinnedWidth += col.getSize();
    });

    // Get all fixed columns sorted by their natural position (left to right)
    const fixedColumns = ((columnPinning as any).fixed || [])
      .map((id: string) => {
        const col = allColumns.find((c: any) => c.id === id);
        return col ? { id, col, start: col.getStart(), size: col.getSize() } : null;
      })
      .filter(Boolean)
      .sort((a: any, b: any) => a.start - b.start);

    const currentIndex = fixedColumns.findIndex((fc: any) => fc.id === columnId);
    const naturalLeft = columnStart - scrollLeft;
    const naturalRight = naturalLeft + columnWidth;

    // LEFT STICKING LOGIC - Check each previous column sequentially
    let leftEdge = leftPinnedWidth;

    for (let i = 0; i < currentIndex; i++) {
      const prevCol = fixedColumns[i];
      const prevNaturalLeft = prevCol.start - scrollLeft;

      // Check if this previous column should be stuck at the current leftEdge
      // It sticks if its natural position is at or to the left of leftEdge
      if (prevNaturalLeft <= leftEdge) {
        // This column is stuck, so move the leftEdge to include it
        leftEdge += prevCol.size;
      }
      // Note: We don't break here - we need to check ALL previous columns
      // because each one cascades from the previous
    }

    // Now check if THIS column should stick at the leftEdge
    if (naturalLeft <= leftEdge) {
      return {
        position: 'sticky' as const,
        left: `${leftEdge}px`,
        zIndex: isHeader ? 25 : 8,
        top: isHeader ? 0 : undefined,
        backgroundColor,
      };
    }

    // RIGHT STICKING LOGIC - Check each next column sequentially
    let rightEdge = rightPinnedWidth;

    for (let i = fixedColumns.length - 1; i > currentIndex; i--) {
      const nextCol = fixedColumns[i];
      const nextNaturalLeft = nextCol.start - scrollLeft;
      const nextNaturalRight = nextNaturalLeft + nextCol.size;

      // Check if this next column should be stuck at the current rightEdge
      // It sticks if its natural right position is at or beyond the viewport right minus rightEdge
      if (nextNaturalRight >= containerWidth - rightEdge) {
        // This column is stuck, so move the rightEdge to include it
        rightEdge += nextCol.size;
      }
      // Note: We don't break here - we need to check ALL next columns
    }

    // Now check if THIS column should stick at the rightEdge
    if (naturalRight >= containerWidth - rightEdge) {
      return {
        position: 'sticky' as const,
        right: `${rightEdge}px`,
        zIndex: isHeader ? 25 : 8,
        top: isHeader ? 0 : undefined,
        backgroundColor,
      };
    }
    return { backgroundColor };
  }

  return {};
};
