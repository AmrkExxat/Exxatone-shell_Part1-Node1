export function removeDuplicates(array: any[], uniqueKey: string): any[] {
  const uniqueItems = new Map();

  if (array?.length === 0) return [];

  array.forEach((item) => {
    if (!uniqueItems.has(item[uniqueKey])) {
      uniqueItems.set(item[uniqueKey], item);
    }
  });

  return Array.from(uniqueItems.values());
}

export const buildOptionsForInfiniteDropFromResponse = (
  response: any,
  putWholeItemInValue: boolean
): any => {
  const totalCount = response?.totalCount;
  const result = response?.data?.map((item: any) => {
    return { id: item.id, label: item.name, value: putWholeItemInValue ? item : item.id };
  });

  return { data: result, totalCount };
};

const vwToPx = (vwValue: string): number => {
  const vw = parseFloat(vwValue);
  const viewportWidth = window.innerWidth;
  return (vw / 100) * viewportWidth;
};
export const getStyles = (
  column: { width?: number; isSticky?: boolean; leftClass?: string },
  index: number,
  visibleColumns: any,
  ColumnFixedMaxWidth: string,
  ColumnFixedMinWidth: string,
  checkboxSelection: boolean,
  radioButtonSelection: boolean
) => {
  const { width } = column;
  let style = {
    maxWidth: width ?? ColumnFixedMaxWidth,
    minWidth: width ?? ColumnFixedMinWidth,
  };

  let previousWidths: number[] = [];

  for (let i = index - 1; i >= 0; i--) {
    const prevColumnWidth = visibleColumns[i]?.['width'];

    if (prevColumnWidth) {
      if (typeof prevColumnWidth === 'string' && prevColumnWidth.includes('vw')) {
        previousWidths.push(vwToPx(prevColumnWidth));
      } else if (typeof prevColumnWidth === 'string' && prevColumnWidth.includes('px')) {
        previousWidths.push(parseFloat(prevColumnWidth));
      } else if (typeof prevColumnWidth === 'number') {
        previousWidths.push(prevColumnWidth);
      }
    }
  }

  const totalPreviousWidth = previousWidths.reduce((sum, currentWidth) => sum + currentWidth, 0);

  if (column?.isSticky) {
    let leftClass = `${totalPreviousWidth}px`;

    if (checkboxSelection || radioButtonSelection) {
      leftClass = `${parseFloat(leftClass) + 32}px`;
    }

    style = {
      ...style,
      zIndex: 10 - index,
      left: leftClass,
      position: 'sticky',
      backgroundColor: 'inherit',
    };
  }

  return style;
};

export function mapLocationItemToTreeNode(item: any, subLabelRequired?: boolean): any {
  return {
    ...item,
    id: item.id,
    label: item.name,
    value: item.id,
    selected: false,
    hasChildren: item?.hasChildren ? true : false,
    subLabel: subLabelRequired ? item.paths && getPathForLocation(item.paths) : '',
    children: item.children?.map(mapLocationItemToTreeNode) ?? [],
  };
}
export const getPathForLocation = (paths: any): string => {
  if (!paths?.length || !paths?.[0]) return '';
  const pathArray = paths.flat().filter((i: any) => i && i.name);
  const pathString = pathArray?.length > 0 && pathArray.map((i: any) => i.name).join(' > ');
  if (pathString?.length > 0) {
    return `(${pathString})`;
  } else {
    return '';
  }
};

export function transformLocationLabel(data: any[]): any {
  return data.map((item) => {
    if (item.paths && item.paths[0] && item.paths[0].length > 0) {
      const pathString = item.paths[0].map((x: any) => x.name).join(` > `);
      return {
        ...item,
        label: `${item.name} (${pathString})`,
      };
    }
    return item;
  });
}

type AnyObject = Record<string, any>;

export function mergeArraysById<T extends AnyObject = AnyObject>(
  arr1?: T[] | null,
  arr2?: T[] | null
): T[] {
  const resultMap = new Map<string, T>();

  (arr1 ?? []).forEach((item) => {
    if (item && item.id) {
      resultMap.set(item.id, { ...item });
    }
  });

  (arr2 ?? []).forEach((item) => {
    if (item && item.id) {
      const existing = resultMap.get(item.id);
      resultMap.set(item.id, {
        ...existing,
        ...item,
      });
    }
  });

  return Array.from(resultMap.values());
}
