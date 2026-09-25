export const PAGE_SIZE_OPTIONS = [5, 10, 20, 30, 40, 50, 200, 500, 1000];
export const EMPTY_STYLE = {};

// This is now deprecated - use getPinningStylesForCell from the component instead
export const getPinningStyles = (column: any, isHeader: boolean = false) => {
  const pinned = column.getIsPinned();
  if (!pinned) {
    return EMPTY_STYLE;
  }
  return {
    position: 'sticky' as const,
    left: pinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: pinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    zIndex: isHeader ? 30 : 10,
    top: isHeader ? 0 : undefined,
  };
};
