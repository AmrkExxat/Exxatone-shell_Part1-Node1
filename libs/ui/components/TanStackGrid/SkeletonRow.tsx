'use client';

import React, { memo, useMemo } from 'react';
import { Column } from '@tanstack/react-table';
import { getPinningStyles } from './utils';

interface SkeletonRowProps {
  rowIndex: number;
  columns: Column<any, unknown>[];
}

export const SkeletonRow = memo(({ rowIndex, columns }: SkeletonRowProps) => {
  return (
    <tr className="animate-pulse border-b border-gray-200">
      {columns.map((column, columnIndex) => {
        const isPinned = column.getIsPinned();
        const pinningStyles = getPinningStyles(column);
        const widthClass =
          column.id === '__select' || column.id === '__expand'
            ? 'w-4'
            : columnIndex % 3 === 0
              ? 'w-3/4'
              : columnIndex % 3 === 1
                ? 'w-1/2'
                : 'w-1/4';

        return (
          <td
            key={`${rowIndex}-${column.id ?? columnIndex}`}
            style={pinningStyles}
            className="border-r border-b border-gray-200 px-3 py-2 last:border-r-0"
          >
            <div className={`h-4 rounded bg-gray-200 ${widthClass}`} />
          </td>
        );
      })}
    </tr>
  );
});

SkeletonRow.displayName = 'SkeletonRow';
