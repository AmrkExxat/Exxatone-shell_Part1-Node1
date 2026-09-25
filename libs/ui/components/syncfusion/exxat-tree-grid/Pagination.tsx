import {
  faChevronLeft,
  faChevronRight,
  faChevronsLeft,
  faChevronsRight,
} from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useEffect } from 'react';
import { Button } from '../../common';
import { announce } from '@react-aria/live-announcer';

interface PaginationProps {
  currentPage: number;
  pageSize: number;
  pageSizes: number[];
  pageCount: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  lastFocusedButtonID?: string;
  onFocusChange?: (buttonId: string) => void;
}

const defaultPageSizeOptions = [
  {
    label: '50',
    value: 50,
    id: '50',
  },
  {
    label: '75',
    value: 75,
    id: '75',
  },
  {
    label: '100',
    value: 100,
    id: '100',
  },
];

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  pageSize,
  pageSizes,
  pageCount,
  totalCount,
  onPageChange,
  onPageSizeChange,
  lastFocusedButtonID,
  onFocusChange,
}) => {
  const announceRef = useRef<HTMLDivElement>(null);
  const currentPageRef = useRef(currentPage);
  const totalPagesRef = useRef(Math.max(1, Math.ceil(totalCount / pageSize)));

  useEffect(() => {
    currentPageRef.current = currentPage;
    totalPagesRef.current = Math.max(1, Math.ceil(totalCount / pageSize));
  }, [currentPage, totalCount, pageSize]);

  const announceMessage = (message: string) => {
    if (announceRef.current) {
      announceRef.current.textContent = message;
    }
    announce(message);
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const displayPageCount = Math.min(pageCount, totalPages);

  // Calculate start and end page numbers for pagination window
  let startPage = Math.max(1, currentPage - Math.floor(displayPageCount / 2));
  let endPage = startPage + displayPageCount - 1;
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - displayPageCount + 1);
  }

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (newPage: number, buttonId: string) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onFocusChange?.(buttonId);
      onPageChange(newPage);
      announceMessage(`Page ${newPage} of ${totalPages}`);
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    onFocusChange?.('pageSizeSelect');
    onPageSizeChange(newSize);
    const newTotalPages = Math.max(1, Math.ceil(totalCount / newSize));
    announceMessage(`${newSize} items per page, page ${currentPage} of ${newTotalPages}`);
  };

  useEffect(() => {
    if (!lastFocusedButtonID) return;

    const timeoutId = setTimeout(() => {
      let targetButtonId = lastFocusedButtonID;

      if (lastFocusedButtonID === 'back_page' && currentPageRef.current === 1) {
        targetButtonId = 'page-1';
      } else if (lastFocusedButtonID === 'first_start') {
        targetButtonId = 'page-1';
      } else if (
        lastFocusedButtonID === 'next_page' &&
        currentPageRef.current === totalPagesRef.current
      ) {
        targetButtonId = `page-${totalPagesRef.current}`;
      } else if (lastFocusedButtonID === 'last_page') {
        targetButtonId = `page-${totalPagesRef.current}`;
      }

      // Focus the target element
      const element = document.getElementById(targetButtonId);
      if (element) {
        element.focus();
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [lastFocusedButtonID]);

  const handleBlur = (e: React.FocusEvent<HTMLButtonElement | HTMLSelectElement>) => {
    e.target.setAttribute('tabindex', '0');
  };

  return (
    <>
      <div ref={announceRef} aria-live="polite" className="sr-only" />
      <nav
        className="bg-card flex w-full items-center justify-end gap-2 rounded-b-lg border-t border-r-[1px] border-b-[1px] border-l-[1px] px-4 py-1 text-sm"
        aria-label="Pagination"
      >
        <div className="flex items-center gap-2">
          <select
            value={pageSize}
            id="pageSizeSelect"
            name="pageSizeSelect"
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="rounded border py-1 focus:outline-none"
            aria-label="Items per page"
            onBlur={handleBlur}
            tabIndex={0}
          >
            {pageSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-[.8rem] text-gray-600">Items per page</span>
          <span className="mx-2">
            {`${currentPage} of ${totalPages} pages `}
            <span className="ml-1 text-[.8rem] text-gray-600">({totalCount} items)</span>
          </span>
          <Button
            id="first_start"
            testid="first_start"
            aria-label="Go to first page"
            className="focus-indicator hover:bg-hover focus-visible:ring-primary flex h-7 w-7 flex-col items-center justify-center rounded rounded-full border focus-visible:ring focus-visible:ring-2 focus-visible:ring-offset-2"
            onClick={() => handlePageChange(1, 'first_start')}
            variant="basic"
            disabled={currentPage === 1}
            onBlur={handleBlur}
            tabIndex={0}
          >
            <FontAwesomeIcon icon={faChevronsLeft} className="h-3 w-3 text-[#5D779A]" />
          </Button>
          <Button
            id="back_page"
            testid="back_page"
            aria-label="Go to previous page"
            className="focus-indicator hover:bg-hover focus-visible:ring-primary flex h-7 w-7 flex-col items-center justify-center rounded rounded-full border focus-visible:ring focus-visible:ring-2 focus-visible:ring-offset-2"
            onClick={() => handlePageChange(currentPage - 1, 'back_page')}
            variant="basic"
            disabled={currentPage === 1}
            onBlur={handleBlur}
            tabIndex={0}
          >
            <FontAwesomeIcon icon={faChevronLeft} className="h-3 w-3 text-[#5D779A]" />
          </Button>
          {pageNumbers.map((page) => (
            <button
              key={page}
              id={`page-${page}`}
              onClick={() => handlePageChange(page, `page-${page}`)}
              className={`focus-indicator focus-visible:ring-primary rounded border px-3 py-1 focus-visible:ring focus-visible:ring-2 focus-visible:ring-offset-2 ${page === currentPage ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
              aria-current={page === currentPage ? 'page' : undefined}
              aria-label={`Go to page ${page}`}
              onBlur={handleBlur}
              tabIndex={0}
            >
              {page}
            </button>
          ))}
          <Button
            id="next_page"
            testid="next_page"
            aria-label="Go to next page"
            className="focus-indicator hover:bg-hover focus-visible:ring-primary flex h-7 w-7 flex-col items-center justify-center rounded rounded-full border focus-visible:ring focus-visible:ring-2 focus-visible:ring-offset-2"
            onClick={() => handlePageChange(currentPage + 1, 'next_page')}
            variant="basic"
            disabled={currentPage === totalPages}
            onBlur={handleBlur}
            tabIndex={0}
          >
            <FontAwesomeIcon icon={faChevronRight} className="h-3 w-3 text-[#5D779A]" />
          </Button>
          <Button
            id="last_page"
            testid="last_page"
            aria-label="Go to last page"
            className="focus-indicator hover:bg-hover focus-visible:ring-primary flex h-7 w-7 flex-col items-center justify-center rounded rounded-full border focus-visible:ring focus-visible:ring-2 focus-visible:ring-offset-2"
            onClick={() => handlePageChange(totalPages, 'last_page')}
            variant="basic"
            disabled={currentPage === totalPages}
            onBlur={handleBlur}
            tabIndex={0}
          >
            <FontAwesomeIcon icon={faChevronsRight} className="h-3 w-3 text-[#5D779A]" />
          </Button>
        </div>
      </nav>
    </>
  );
};

export default Pagination;
