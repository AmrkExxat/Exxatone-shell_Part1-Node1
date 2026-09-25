export interface TreeGridAdaptorCallbacks {
  onDataLoadStart?: () => void;
  onDataLoadEnd?: (e?: any) => void;
}

export const gridUserInteraction = (tenantId: string, type: string, key: string, value?: any) => {
  if (!key || !tenantId) return null;
  const storage = sessionStorage.getItem(`${tenantId}/gridInteraction`);
  if (type === 'get') {
    if (storage) {
      const parsedStorage = JSON.parse(storage);
      return parsedStorage[key] ?? false;
    }
    return false;
  } else if (type === 'set') {
    const parsedStorage = storage ? JSON.parse(storage) : {};
    parsedStorage[key] = value;
    sessionStorage.setItem(`${tenantId}/gridInteraction`, JSON.stringify(parsedStorage));
  }
};

export const getSortPageData = (page: any, sort: any) => {
  let sortData = null;
  if (typeof sort === 'object') {
    const field = Object.keys(sort);
    if (field?.length && field?.[0]) {
      let type = 'Descending';
      if (sort[field[0]]) {
        type = 'Ascending';
      }
      sortData = { field: field[0], direction: type };
    }
  }
  const data = {
    page,
    sort: sortData,
  };
  return data;
};
