'use client';

import React, { memo, useCallback, useMemo } from 'react';
const DEFAULT_PAGE_SIZE_OPTIONS = [25, 50, 75, 100];

interface PaginationControlsProps {
  table: any;
  isFetching?: boolean;
  totalItems?: number;
  pageSizeOptions?: number[];
}

const FOCUS_DELAY = 100;

export const PaginationControls = memo(
  ({
    table,
    isFetching = false,
    totalItems,
    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  }: PaginationControlsProps) => {
    const { pageIndex, pageSize } = table.getState().pagination;
    const pageCount = table.getPageCount();
    const canPrev = table.getCanPreviousPage();
    const canNext = table.getCanNextPage();
    const actualTotal = totalItems ?? table.getFilteredRowModel().rows.length;

    const goToPage = useCallback(
      (page: number) => {
        if (page >= 0 && page < pageCount) {
          table.setPageIndex(page);
        }
      },
      [table, pageCount]
    );

    const handlePageMove = useCallback(
      (direction: 'prev' | 'next') => {
        const currentIndex = table.getState().pagination.pageIndex;
        const nextIndex =
          direction === 'prev'
            ? Math.max(currentIndex - 1, 0)
            : Math.min(currentIndex + 1, pageCount - 1);

        table.setPageIndex(nextIndex);
        if (nextIndex === 0 || nextIndex === pageCount - 1) {
          setTimeout(() => {
            document.getElementById(`pagination_page_${nextIndex}`)?.focus();
          }, 0);
        }
      },
      [table, pageCount]
    );

    const changePageSize = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        table.setPageSize(Number(e.target.value));
        table.setPageIndex(0);
      },
      [table]
    );
    const optionsForSelect = useMemo(() => {
      const set = new Set(pageSizeOptions);
      if (!set.has(pageSize)) return [pageSize, ...pageSizeOptions].sort((a, b) => a - b);
      return [...pageSizeOptions].sort((a, b) => a - b);
    }, [pageSizeOptions, pageSize]);

    const visiblePages = useMemo(() => {
      const pages: (number | '...')[] = [];
      if (pageCount === 0) return [];
      if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i);

      pages.push(0);
      let start = Math.max(1, pageIndex - 1);
      let end = Math.min(pageCount - 2, pageIndex + 1);

      if (pageIndex <= 2) end = Math.min(3, pageCount - 2);
      if (pageIndex >= pageCount - 3) start = Math.max(1, pageCount - 4);
      if (start > 1) pages.push('...');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < pageCount - 2) pages.push('...');
      if (pageCount > 1) pages.push(pageCount - 1);

      return pages;
    }, [pageIndex, pageCount]);

    if (pageCount === 0) return null;

    const baseBtn =
      'inline-flex items-center justify-center min-w-[40px] h-9 px-3 rounded-md border text-sm font-medium tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';
    const ghostBtn = 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400';
    const activeBtn = 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-sm';

    return (
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <label
            htmlFor="page-size-select"
            className="text-sm font-medium whitespace-nowrap text-gray-700"
          >
            Rows per page
          </label>
          <select
            id="page-size-select"
            value={pageSize}
            onChange={changePageSize}
            className="bg-card h-9 rounded-md border border-gray-300 py-1.5 pr-8 text-sm focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
          >
            {optionsForSelect.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="text-sm whitespace-nowrap text-gray-700" aria-live="polite" role="status">
          Page <span className="font-semibold">{pageIndex + 1}</span> of{' '}
          <span className="font-semibold">{pageCount}</span>
          {actualTotal > 0 && (
            <span className="ml-1 text-gray-500">({actualTotal.toLocaleString()} items)</span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            id="pagination_first_page_btn"
            onClick={() => {
              goToPage(0);
              document.getElementById(`pagination_page_${0}`)?.focus();
            }}
            disabled={!canPrev}
            aria-label="Go to first page"
            className={`${baseBtn} ${ghostBtn}`}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            type="button"
            id="pagination_prev_page_btn"
            onClick={() => handlePageMove('prev')}
            disabled={!canPrev}
            aria-label="Go to previous page"
            className={`${baseBtn} ${ghostBtn}`}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {visiblePages.map((page, idx) =>
            page === '...' ? (
              <span
                key={`ellipsis-${idx}`}
                className="inline-flex h-9 min-w-[40px] items-center justify-center px-3 text-gray-500"
              >
                …
              </span>
            ) : (
              <button
                key={page}
                id={`pagination_page_${page}`}
                type="button"
                onClick={() => goToPage(page as number)}
                disabled={false}
                aria-current={page === pageIndex ? 'page' : undefined}
                aria-label={`Go to page ${(page as number) + 1}`}
                className={`${baseBtn} ${page === pageIndex ? activeBtn : ghostBtn}`}
              >
                {(page as number) + 1}
              </button>
            )
          )}

          <button
            type="button"
            id="pagination_next_page_btn"
            onClick={() => handlePageMove('next')}
            disabled={!canNext}
            aria-label="Go to next page"
            className={`${baseBtn} ${ghostBtn}`}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            type="button"
            id="pagination_last_page_btn"
            onClick={() => {
              goToPage(pageCount - 1);
              document.getElementById(`pagination_page_${pageCount - 1}`)?.focus();
            }}
            disabled={!canNext}
            aria-label="Go to last page"
            className={`${baseBtn} ${ghostBtn}`}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }
);

PaginationControls.displayName = 'PaginationControls';
