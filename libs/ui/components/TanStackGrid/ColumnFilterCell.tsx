'use client';

import React, { useCallback, useMemo } from 'react';
import { Header } from '@tanstack/react-table';
import { getPinningStyles } from './utils';

interface ColumnFilterCellProps<TData> {
  header: Header<TData, unknown>;
}

export function ColumnFilterCell<TData>({ header }: ColumnFilterCellProps<TData>) {
  const column = header.column;
  const isPinned = column.getIsPinned();
  const pinningStyles = useMemo(() => getPinningStyles(column, true), [column, isPinned]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      column.setFilterValue(e.target.value);
    },
    [column]
  );

  if (header.isPlaceholder) {
    return <th />;
  }

  return (
    <th
      className="border-r border-b border-gray-300 bg-zinc-50 px-3 py-2 last:border-r-0"
      style={pinningStyles}
    >
      {column.getCanFilter() ? (
        <input
          value={(column.getFilterValue() ?? '') as string}
          onChange={handleChange}
          placeholder="Filter..."
          className="w-full rounded-md border border-zinc-200 p-1.5 text-xs focus:ring-2 focus:ring-blue-500/30 focus:outline-none"
        />
      ) : null}
    </th>
  );
}
