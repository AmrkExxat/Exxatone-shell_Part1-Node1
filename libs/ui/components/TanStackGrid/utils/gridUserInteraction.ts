export interface GridUserInteraction {
  sorting?: any;
  columnFilters?: any;
  columnVisibility?: any;
  columnOrder?: any;
  columnPinning?: any;
  columnSizing?: Record<string, number>;
  pagination?: {
    pageSize: number;
    pageIndex?: number;
  };
}

export const gridUserInteraction = (
  gridId: string,
  action: 'get' | 'set' | 'clear',
  interactionKey?: string,
  data?: GridUserInteraction
): GridUserInteraction | null => {
  if (!gridId) return null;

  const storageKey = interactionKey
    ? `grid_interaction_${gridId}_${interactionKey}`
    : `grid_interaction_${gridId}`;

  try {
    switch (action) {
      case 'get':
        const stored = localStorage.getItem(storageKey);
        return stored ? JSON.parse(stored) : null;

      case 'set':
        if (data) {
          const sanitized = JSON.parse(JSON.stringify(data));
          localStorage.setItem(storageKey, JSON.stringify(sanitized));
        }
        return data || null;

      case 'clear':
        localStorage.removeItem(storageKey);
        return null;

      default:
        return null;
    }
  } catch (error) {
    console.error('Grid interaction storage error:', error);
    return null;
  }
};
