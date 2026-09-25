import React, { useEffect } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/20/solid';
import { type PaginationProps } from './Pagination.types';
import classNames from 'classnames';

export default function Pagination({
  totalResults,
  onChange,
  resultsPerPage,
  containerClass = '',
  defaultPage = 1,
  showItemsPerPage = false,
  itemsPerPageOptions = [20, 50, 100],
  onItemsPerPageChange,
}: PaginationProps): JSX.Element {
  const noOfPages = Math.ceil(totalResults / resultsPerPage);

  const [page, setPage] = React.useState(defaultPage);

  useEffect(() => {
    setPage(defaultPage);
  }, [totalResults, resultsPerPage]);

  return (
    <div
      className={classNames(
        containerClass?.length > 0
          ? containerClass
          : 'bg-card flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6'
      )}
    >
      <div className="flex flex-1 items-center justify-between">
        {showItemsPerPage ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Items per Page:</span>
              <select
                value={resultsPerPage}
                onChange={(e) => onItemsPerPageChange?.(Number(e.target.value))}
                className="rounded border border-gray-300 px-2 py-1 pr-6 text-sm"
              >
                {itemsPerPageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-sm text-gray-700">
              {page} of {noOfPages} pages ({totalResults} items)
            </p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{page}</span> to{' '}
              <span className="font-medium">{noOfPages}</span> of{' '}
              <span className="font-medium">{totalResults}</span> results
            </p>
          </div>
        )}
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <a
              onClick={() => {
                if (page === 1) return;
                setPage(1);
                onChange(1);
              }}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">first page</span>
              <ChevronDoubleLeftIcon className="h-5 w-5" aria-hidden="true" />
            </a>
            <a
              onClick={() => {
                if (page === 1) return;
                setPage(page - 1);
                onChange(page - 1);
              }}
              className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </a>
            {page > 1 && noOfPages > 2 && (
              <a
                onClick={() => {
                  if (page === 2) {
                    setPage(1);
                    onChange(1);
                    return;
                  }
                  setPage(page - 2);
                  onChange(page - 2);
                }}
                className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 ring-inset focus:outline-offset-0"
              >
                ...
              </a>
            )}
            {page === noOfPages && page !== 1 && (
              <a
                className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                onClick={() => {
                  setPage(page - 1);
                  onChange(page - 1);
                }}
              >
                {page - 1}
              </a>
            )}
            <a
              aria-current="page"
              className="bg-primary focus-visible:outline-primary relative z-10 inline-flex items-center px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {page}
            </a>
            {page < noOfPages && (
              <a
                className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                onClick={() => {
                  setPage(page + 1);
                  onChange(page + 1);
                }}
              >
                {page + 1}
              </a>
            )}
            {page < noOfPages - 1 && (
              <a
                onClick={() => {
                  setPage(page + 2);
                  onChange(page + 2);
                }}
                className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 ring-inset focus:outline-offset-0"
              >
                ...
              </a>
            )}

            <a
              onClick={() => {
                if (page === noOfPages) return;
                setPage(page + 1);
                onChange(page + 1);
              }}
              className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </a>
            <a
              onClick={() => {
                if (page === noOfPages) return;
                setPage(noOfPages);
                onChange(noOfPages);
              }}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">first page</span>
              <ChevronDoubleRightIcon className="h-5 w-5" aria-hidden="true" />
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
}
