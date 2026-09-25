'use client';

import React, { forwardRef, useRef, useEffect, useMemo, useState, useCallback } from 'react';
import {
  ColumnChooser,
  ColumnDirective,
  ColumnModel,
  ColumnsDirective,
  Filter,
  Freeze,
  GridComponent,
  Inject,
  Page,
  Reorder,
  Resize,
  type RowSelectEventArgs,
  Sort,
  VirtualScroll,
} from '@syncfusion/ej2-react-grids';
import { DataManager } from '@syncfusion/ej2-data';
import Tooltip from '../../../components/common/Tooltip/Tooltip';
import CustomAdaptor from './CustomRemoteAdaptor';

import { registerLicense } from '@syncfusion/ej2-base';
import { Tooltip as SyncfusionTooltip } from '@syncfusion/ej2-popups';

import ColumnSettingsDrawer, {
  type ColumnSettingsFunction,
} from '../settings/ColumnSettingsDrawer';
import { Button, Spinner } from '../../common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faChevronsLeft,
  faChevronsRight,
  faWrench,
} from '@fortawesome/pro-light-svg-icons';
import classNames from 'classnames';
import { SyncfusionGridPaginationProps } from './types';
import { announce } from '@react-aria/live-announcer';
import { gridUserInteraction } from '../utils';

registerLicense(
  'Ngo9BigBOggjHTQxAR8/V1NNaF5cXmBCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdmWXped3RdRGBfU0B0XUtWYE4='
);

const SyncfusionGridPagination = forwardRef<GridComponent, SyncfusionGridPaginationProps>(
  (props, ref) => {
    const {
      children,
      fetchData,
      columns,
      pageSize = 50,
      allowReordering = true,
      allowSorting = true,
      allowMultiSorting = false,
      allowResizing = true,
      allowPaging = true,
      allowFiltering = false,
      allowKeyboard = true,
      allowSelection = false,
      checkboxSelection = false,
      allowTextWrap = false,
      configureColumns,
      metaData,
      onCheckboxSelect,
      onColumnSettingsSave,
      getFetchedData,
      onlyCountNeeded = true,
      clearSelectedRows,
      showSelectAll = false,
      pageName,
      gridHeight = 400,
      recordPrimaryKey = 'id',
      tableLegends = [],
      pageSettings,
      uniqueEntityName = 'name',
      saveUserInteraction = false,
      interactionKey = '',
      dataBound,
      id = '',
    } = props;

    const settingsRef = useRef<ColumnSettingsFunction>();
    const userInteraction = saveUserInteraction
      ? gridUserInteraction(id, 'get', interactionKey)
      : null;
    const initialRender = useRef<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [tableColumns, setTableColumns] = useState<any>(columns || []);
    const [defaultSortSetting, setDefaultSortSetting] = useState<any>(() =>
      userInteraction?.sort ? { columns: [userInteraction.sort] } : null
    );

    const [selectedRowIds, setSelectedRowIds] = useState(new Set([10, 1, 0, 7, 40]));
    const [paginationSettings, setPaginationSettings] = useState({
      pageSize: pageSettings?.pageSize ?? 50,
      pageCount: pageSettings?.pageCount ?? 5,
      pageSizes: pageSettings?.pageSizes ?? ['50', '75', '100'],
      currentPage:
        userInteraction?.page && typeof userInteraction.page === 'number'
          ? userInteraction.page
          : (pageSettings?.currentPage ?? 1),
      startPage: pageSettings?.currentPage ?? 1,
    });
    const [lastFocusedButtonID, setLastFocusedButtonID] = useState('');
    const sortableHeadersRef = useRef([]);
    const gridRef = useRef(null);
    const [isGridReady, setIsGridReady] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);

    const dataManager = useMemo(() => {
      return new DataManager({
        url: 'https://your.api/endpoint',
        adaptor: new CustomAdaptor(
          metaData?.tenantId,
          fetchData,
          metaData?.filterPayload,
          { id, can: saveUserInteraction, interactionKey },
          {
            onDataLoadStart: () => {
              setEmptyCellMessageVisibility(false);
            },
            onDataLoadEnd: (e) => {
              setEmptyCellMessageVisibility(true);
              if (getFetchedData && e) {
                if (onlyCountNeeded) {
                  getFetchedData(e?.count);
                } else {
                  getFetchedData(e);
                }
              }
            },
          }
        ),
        crossDomain: true,
      });
    }, [metaData]);

    useEffect(() => {
      if (document.getElementById('syncfusion-grid-checkbox-focus-styles')) return;

      const styleEl = document.createElement('style');
      styleEl.id = 'syncfusion-grid-checkbox-focus-styles';
      styleEl.textContent = `
			  .e-grid .e-rowcell.e-gridchkbox:focus-within,
			  .e-grid .e-rowcell.e-gridchkbox:focus-visible {
				outline: 2px double #3F51B5 !important;
				outline-offset: -5px !important;
			  }
			`;

      document.head.appendChild(styleEl);

      return () => document.getElementById('syncfusion-grid-checkbox-focus-styles')?.remove();
    }, []);

    useEffect(() => {
      setTableColumns(columns);
    }, [columns]);

    const focusHeaderWithScroll = (header) => {
      focusHeader(header);
      scrollIntoView(header);
    };

    const cacheSortableHeaders = useCallback(() => {
      sortableHeadersRef.current = Array.from(
        document.querySelectorAll('th[aria-sort]') || []
      ).filter((th) => {
        const textNode = th.querySelector('.e-headertext')?.childNodes[0];
        return textNode?.nodeType === 3 && textNode.textContent.trim().toLowerCase() !== 'id';
      });
    }, []);

    const cacheGridInstance = useCallback(() => {
      const gridEl = document.querySelector?.('.e-grid');
      gridRef.current = gridEl?.ej2_instances?.[0] || null;
    }, []);

    const clearAllHeaderFocus = useCallback(() => {
      const headers =
        sortableHeadersRef.current?.length > 0
          ? sortableHeadersRef.current
          : Array.from(document.querySelectorAll?.('th') || []);

      headers.forEach((th) => {
        if (th?.style) {
          th.style.boxShadow = '';
          th.classList?.remove('e-focused', 'e-focus');
        }
      });
    }, []);

    const focusHeader = useCallback(
      (th) => {
        if (!th) return;

        clearAllHeaderFocus();
        th.classList?.add('e-focused', 'e-focus');
        if (th.style) th.style.boxShadow = '0 0 0 1px #4f46e5 inset';
        th.focus?.();

        const gridInstance = gridRef.current;
        if (gridInstance?.focusModule) {
          gridInstance.focusModule.currentInfo = { element: th, elementToFocus: th };
        }
      },
      [clearAllHeaderFocus]
    );

    const updateColumnOnSave = (tCols: any[]) => {
      const grid: GridComponent = ref?.current;

      if (grid) {
        setRefreshing(true);

        const gridColumns = grid.columns;

        tCols?.map((col) => {
          const column: ColumnModel | undefined = gridColumns?.find(
            (c) => c.field === col.fieldName
          );

          if (column) {
            column.freeze = col.freeze;
            column.visible = col.visible;
          }
        });

        grid.setProperties(
          {
            columns: gridColumns,
            pageRequireRefresh: false,
            isManualRefresh: false,
          },
          false
        );
      }

      onColumnSettingsSave?.(tCols);

      grid?.refreshColumns();
    };

    const handleColumnSettings = () => {
      const clonedColumns = [...columns];
      settingsRef?.current?.handleDrawer({
        open: true,
        columns: clonedColumns,
        loading: false,
      });
    };

    const onRowSelected = (args: RowSelectEventArgs) => {
      const rowIndex = args?.rowIndex;
      const updatedSet = new Set(selectedRowIds);
      updatedSet.add(rowIndex);
      setSelectedRowIds(updatedSet);

      onCheckboxSelect?.(Array.isArray(args?.data) ? args?.data : [args?.data], true);
    };

    const onRowDeselected = (args: any) => {
      const rowIndex = args?.rowIndex;
      const updatedSet = new Set(selectedRowIds);
      updatedSet.delete(rowIndex);
      setSelectedRowIds(updatedSet);

      onCheckboxSelect?.(Array.isArray(args?.data) ? args?.data : [args?.data], false);
    };

    const handleOnActionBegin = (args: any) => {
      if (args?.requestType === 'refresh') {
        setRefreshing(true);
      }

      if (args.requestType === 'sorting') {
        clearSelectedRows && clearSelectedRows(true);
      }
      setTimeout(updateSortableIcons, 50);
    };

    const handleOnActionComplete = (args: any) => {
      if (args?.requestType === 'refresh') {
        setRefreshing(false);
      }
      if (args?.requestType === 'paging') {
        setTimeout(() => {
          if (lastFocusedButtonID) {
            document.getElementById(`${lastFocusedButtonID}`)?.focus();
          }
        }, 100);
      }
    };

    const rowDataBound = (args: any) => {
      const row: HTMLTableRowElement | undefined = args?.row;
      const status = (args?.data?.status as string)?.toLowerCase();
      const isCancelledOrRevoked = ['cancelled', 'revoked'].includes(status);
      const isDisabled = args?.data?.disabled;
      const isDisabledRow = args?.data?.disableRow;
      const isSelected = args?.data?.isSelected;

      if (!row) return;

      if (isCancelledOrRevoked || isDisabledRow) {
        row.classList.add('row-disabled');
      }

      if (isDisabled) {
        args.isSelectable = false;

        if (checkboxSelection) {
          const checkboxCell: HTMLTableCellElement | undefined = row.cells?.[0];
          checkboxCell?.classList.add(
            'cursor-not-allowed',
            'pointer-event-none',
            'bg-[#ececec]',
            'row-disabled'
          );

          const checkbox = checkboxCell?.querySelector('input.e-checkselect') as HTMLInputElement;
          if (checkbox) {
            checkbox.disabled = true;
          }
        }
      } else {
        if (checkboxSelection) {
          const checkboxCell: HTMLTableCellElement | undefined = row.cells?.[0];
          const checkbox = checkboxCell?.querySelector('input.e-checkselect') as HTMLInputElement;
          if (checkbox && checkboxCell) {
            checkbox.classList.add('focus-indicator');
            checkboxCell.classList.add('focus-indicator');
            const ariaLabel = args?.data?.[uniqueEntityName] || 'Select Row';
            checkbox.setAttribute('aria-label', `${ariaLabel}`);
          }
        }
        if (isSelected) {
          args.isSelectable = true;
        }
      }
    };

    const updateSortableIcons = useCallback(() => {
      document.querySelectorAll('th[aria-sort]').forEach((header) => {
        const text = header.querySelector('.e-headertext');
        const icon = header.querySelector('.sortable-indicator');
        header.querySelectorAll('.e-sortfilterdiv').forEach((el) => {
          (el as HTMLElement).style.color = '#374151';
        });
        const headerName = text?.textContent ? text.textContent.trim().replace('↕', '') : '';
        const isSortable = header.getAttribute('aria-sort') === 'none';
        const sortDirection =
          header.getAttribute('aria-sort') === 'ascending' ? 'ascending' : 'descending';
        if (isSortable) {
          header.setAttribute('aria-label', `${headerName}, sortable column header, clickable`);
        } else {
          header.setAttribute('aria-label', `${headerName}, sorted in ${sortDirection} order`);
        }
        if (isSortable) {
          if (!icon && text) {
            text.classList.add('flex', 'justify-between', 'items-center');

            const span = document.createElement('span');
            span.className = `
							sortable-indicator ml-1 text-xs px-1.5 pb-0.5 rounded 
							text-[#374151] cursor-pointer transition 
							 hover:text-black
						`.trim();
            span.textContent = '↕';
            span.setAttribute('aria-hidden', 'true');

            text.appendChild(span);
          }
        } else {
          icon?.remove();
        }
      });
    }, []);

    const handleGridCreated = useCallback(() => {
      const spans = document.querySelectorAll?.('[id^="headerTitle-grid-column"]') || [];

      spans.forEach((span) => {
        const text = span.textContent?.trim();
        if (text === 'Press Ctrl space to group' || 'Press Enter to sort.') {
          span.remove?.();
        } else if (text?.includes('Press Ctrl space to group')) {
          span.textContent = text.replace('Press Ctrl space to group', '').trim();
        }
      });
      const firstColumnHeader = document.querySelector(
        'th[aria-colindex="1"] [id^="headerTitle-grid-column"]'
      );
      if (firstColumnHeader?.textContent?.trim() === 'Press Enter to sort') {
        firstColumnHeader.remove();
      }

      removeIncorrectAriaProperties();

      setTimeout(() => {
        const primaryKeyHeader = document.querySelector('th.e-hide[aria-colindex]');
        if (!primaryKeyHeader) return;
        primaryKeyHeader.setAttribute('aria-hidden', 'true');
        primaryKeyHeader.setAttribute('tabindex', '-1');
        const allHeaders = Array.from(document.querySelectorAll('th[role="columnheader"]'));
        let colIndex = 1;

        allHeaders.forEach((header) => {
          if (header.classList.contains('e-hide')) {
            return;
          }
          header.setAttribute('aria-colindex', colIndex.toString());
          colIndex++;
        });

        const dataRows = document.querySelectorAll('tr[role="row"]:not(.e-columnheader)');
        dataRows.forEach((row) => {
          const cells = Array.from(row.querySelectorAll('td[aria-colindex]'));
          let cellIndex = 1;

          cells.forEach((cell, index) => {
            const correspondingHeader = allHeaders[index];
            if (correspondingHeader && correspondingHeader.classList.contains('e-hide')) {
              cell.setAttribute('aria-hidden', 'true');
              cell.setAttribute('tabindex', '-1');
              return;
            }
            cell.setAttribute('aria-colindex', cellIndex.toString());
            cellIndex++;
          });
        });
      }, 200);

      requestAnimationFrame(() => {
        cacheSortableHeaders();
        cacheGridInstance();
        setIsGridReady?.(true);
        setTimeout(updateSortableIcons, 100);
      });
    }, [cacheSortableHeaders, cacheGridInstance, updateSortableIcons]);

    useEffect(() => {
      if (!isGridReady) return;

      const timeoutId = setTimeout(cacheSortableHeaders, 100);
      return () => clearTimeout(timeoutId);
    }, [tableColumns, cacheSortableHeaders, isGridReady]);

    const scrollIntoView = (element) => {
      if (!element) return;
      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    };

    const handleGridKeyPress = useCallback(
      (args) => {
        const { keyCode, shiftKey } = args || {};
        const activeElement = document?.activeElement;
        if (keyCode === 32) {
          args.cancel = true;
          return;
        }

        if (!activeElement || (keyCode !== 9 && keyCode !== 13)) return;

        args.cancel = true;
        const sortableHeaders = sortableHeadersRef?.current || [];

        if (keyCode === 9) {
          const currentIndex = sortableHeaders?.indexOf(activeElement);

          removeIncorrectAriaProperties();

          // Handle checkbox/first column
          if (
            activeElement.classList?.contains('e-checkselectall') ||
            (activeElement.tagName === 'TH' &&
              activeElement.getAttribute?.('tabindex') === '0' &&
              activeElement.getAttribute?.('aria-colindex') === '1' &&
              currentIndex === -1)
          ) {
            if (shiftKey) {
              args.cancel = false;
              return;
            }
            if (sortableHeaders[0]) {
              requestAnimationFrame(() => focusHeaderWithScroll(sortableHeaders[0]));
            }
            return;
          }

          // Navigate within headers
          if (currentIndex !== -1) {
            const isLastHeader = currentIndex === sortableHeaders?.length - 1;
            const isFirstHeader = currentIndex === 0;

            if (shiftKey) {
              if (isFirstHeader) {
                requestAnimationFrame(clearAllHeaderFocus);
              } else {
                requestAnimationFrame(() =>
                  focusHeaderWithScroll(sortableHeaders[currentIndex - 1])
                );
              }
            } else {
              if (isLastHeader) {
                requestAnimationFrame(clearAllHeaderFocus);
              } else {
                requestAnimationFrame(() =>
                  focusHeaderWithScroll(sortableHeaders[currentIndex + 1])
                );
              }
            }
            return;
          }

          // Handle aria-sort headers not in list
          if (
            activeElement.hasAttribute?.('aria-sort') &&
            currentIndex === -1 &&
            sortableHeaders[0]
          ) {
            requestAnimationFrame(() => focusHeaderWithScroll(sortableHeaders[0]));
            return;
          }

          // Handle shift+tab from TD to last header
          if (shiftKey && activeElement.tagName === 'TD') {
            const nextElement =
              activeElement?.previousElementSibling ||
              activeElement.parentElement?.previousElementSibling?.lastElementChild;
            if (nextElement?.tagName === 'TH' && sortableHeaders.length > 0) {
              requestAnimationFrame(() =>
                focusHeaderWithScroll(sortableHeaders[sortableHeaders.length - 1])
              );
            }
          }
        }

        if (keyCode === 13) {
          const currentTd =
            activeElement.tagName === 'TD' ? activeElement : activeElement.closest?.('td');
          const currentTh =
            activeElement.tagName === 'TH' ? activeElement : activeElement.closest?.('th');

          const focusInput = (input) => {
            input?.classList?.add('focus-indicator');
            input?.focus?.();
            requestAnimationFrame(() =>
              input?.dispatchEvent?.(new MouseEvent('click', { bubbles: true, cancelable: true }))
            );
          };

          if (currentTd) {
            const input =
              activeElement.tagName === 'INPUT'
                ? activeElement
                : currentTd?.querySelector?.('input');
            if (input) focusInput(input);
          } else if (currentTh?.hasAttribute?.('aria-sort')) {
            focusHeader(currentTh);
            requestAnimationFrame(() => {
              currentTh.dispatchEvent?.(
                new MouseEvent('click', { bubbles: true, cancelable: true })
              );
              requestAnimationFrame(() => {
                const refreshedTh = document.querySelector?.(
                  `th[aria-colindex="${currentTh.getAttribute?.('aria-colindex')}"][aria-sort]`
                );
                if (refreshedTh) focusHeaderWithScroll(refreshedTh);
              });
            });
          } else if (currentTh) {
            const input =
              activeElement.tagName === 'INPUT'
                ? activeElement
                : currentTh?.querySelector?.('input');
            if (input) focusInput(input);
          }
        }

        if (!['TH', 'TD'].includes(activeElement.tagName)) {
          requestAnimationFrame(clearAllHeaderFocus);
        }
      },
      [focusHeader, clearAllHeaderFocus]
    );

    const announceGridResults = useCallback(() => {
      const grid = ref?.current;
      const count = grid?.pageSettings?.totalRecordsCount;

      if (typeof count === 'number') {
        setTotalRecords(count);
        setTimeout(() => {
          if (count === 0) {
            announce('No records to display');
          } else {
            const pageSize = grid?.pageSettings?.pageSize || 0;
            const currentPage = grid?.pageSettings?.currentPage || 1;
            const startItem = count ? (currentPage - 1) * pageSize + 1 : 0;
            const endItem = Math.min(currentPage * pageSize, count);
            announce(`showing ${startItem}–${endItem} of ${count} items`);
          }
        }, 500);
      }
    }, []);

    const onDataBound = () => {
      setRefreshing(false);

      const { selectedIndexes } = getSelectedIndexes();

      if (selectedIndexes?.length > 0 && ref !== null && ref !== undefined) {
        const grid: GridComponent = ref?.current;

        if (grid) {
          grid?.selectRows(selectedIndexes);
        }
      }

      addTabIndexToOverflowingTruncateSpans();

      removeIncorrectAriaProperties();

      setTimeout(() => {
        const primaryKeyHeader = document.querySelector('th.e-hide[aria-colindex]');
        if (!primaryKeyHeader) return;
        const allHeaders = Array.from(document.querySelectorAll('th[role="columnheader"]'));
        const dataRows = document.querySelectorAll('tr[role="row"]:not(.e-columnheader)');
        dataRows.forEach((row) => {
          const cells = Array.from(row.querySelectorAll('td[aria-colindex]'));
          let cellIndex = 1;

          cells.forEach((cell, index) => {
            const correspondingHeader = allHeaders[index];
            if (correspondingHeader && correspondingHeader.classList.contains('e-hide')) {
              cell.setAttribute('aria-hidden', 'true');
              cell.setAttribute('tabindex', '-1');
              return;
            }
            cell.setAttribute('aria-colindex', cellIndex.toString());
            cellIndex++;
          });
        });
      }, 200);

      announceGridResults();

      dataBound?.();
    };

    const getSelectedIndexes = (): {
      selectedIndexes: number[];
    } => {
      const selectedIndexes: number[] = [];

      if (ref !== null && ref !== undefined) {
        const grid: GridComponent = ref?.current;

        if (grid) {
          grid?.getCurrentViewRecords()?.forEach((item: any, index: number) => {
            if (item?.isSelected) {
              selectedIndexes?.push(index);
            }
          });
        }
      }

      return {
        selectedIndexes,
      };
    };

    const removeIncorrectAriaProperties = () => {
      setTimeout(() => {
        const gridInstance = ref as React.RefObject<GridComponent>;
        const gridElement = gridInstance?.current?.element;
        if (!gridElement) return;

        gridElement.removeAttribute('aria-rowcount');
        gridElement.removeAttribute('aria-colcount');
        gridElement.removeAttribute('aria-multiselectable');

        const tdElementsList = gridElement.querySelectorAll('td');
        tdElementsList.forEach((td) => {
          td.removeAttribute('aria-label');
          td.setAttribute('tabindex', '-1');
        });
      }, 500);
    };

    const addTabIndexToOverflowingTruncateSpans = () => {
      setTimeout(() => {
        try {
          const gridInstance = ref as React.RefObject<GridComponent>;
          const gridElement = gridInstance?.current?.element;
          if (!gridElement) return;
          const style = document.createElement('style');
          style.textContent = `
						.e-grid .truncate {
							max-width: 100%;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							display: inline-block;
						}
					`;
          document.head.appendChild(style);

          const cells = gridElement.querySelectorAll('td.e-rowcell');

          cells.forEach((cell) => {
            const cellElement = cell as HTMLElement;
            const truncateSpans = cellElement.querySelectorAll('.truncate');

            truncateSpans.forEach((span) => {
              const spanElement = span as HTMLElement;

              spanElement.style.maxWidth = '100%';
              spanElement.style.display = 'inline-block';

              setTimeout(() => {
                const text = spanElement.textContent || '';
                const isOverflowing = spanElement.scrollWidth > spanElement.clientWidth + 2;
                if (isOverflowing) {
                  spanElement.setAttribute('tabindex', '0');
                  spanElement.setAttribute('aria-label', text);
                  spanElement.classList.add('focus-indicator');

                  const uniqueId = `truncate-span-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                  spanElement.id = uniqueId;

                  const tooltip = new SyncfusionTooltip({
                    content: text,
                    showTipPointer: true,
                    animation: {
                      open: { effect: 'FadeIn', duration: 300 },
                      close: { effect: 'FadeOut', duration: 300 },
                    },
                    target: `#${uniqueId}`,
                    opensOn: 'Focus',
                  });

                  tooltip.appendTo(document.body);
                }
              }, 100);
            });
          });
        } catch (error) {
          console.error('Error in addTabIndexToOverflowingTruncateSpans:', error);
        }
      }, 1000);
    };

    useEffect(() => {
      let currPage =
        initialRender?.current && paginationSettings?.currentPage
          ? paginationSettings.currentPage
          : 1;
      initialRender.current = false;
      setPaginationSettings((prev) => ({
        ...prev,
        currentPage: currPage,
        startPage: 1,
      }));
    }, [metaData?.filterPayload]);

    const handleBlur = (e: React.FocusEvent<HTMLButtonElement | HTMLSelectElement>) => {
      e.target.setAttribute('tabindex', '0');
    };

    const handlePaginationEvent = (buttonId: string, curPage: number, stPage: number) => {
      setLastFocusedButtonID(buttonId);
      handlePageChange(curPage, stPage);
    };

    const handlePageChange = (curPage: number, stPage: number) => {
      const totalPages = getTotalPages();
      const newCurrentPage = Math.min(Math.max(1, curPage), totalPages);
      const newStartPage = Math.min(Math.max(1, stPage), totalPages);

      setPaginationSettings((prev) => ({
        ...prev,
        currentPage: newCurrentPage,
        startPage: newStartPage,
      }));
    };

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newSize = parseInt(e.target.value);
      const totalPages = getTotalPages();
      setPaginationSettings((prev) => ({
        ...prev,
        pageSize: newSize,
        currentPage: totalPages === 0 ? 0 : 1,
        startPage: totalPages === 0 ? 0 : 1,
      }));
      if (totalRecords > 0) {
        announce(
          `Items per page changed to ${newSize}, showing 1–${Math.min(newSize, totalRecords)} of ${totalRecords}`
        );
      }
    };

    const getTotalPages = () => {
      const grid = typeof ref === 'object' && ref !== null ? ref.current : null;
      const totalRecordsCount = grid?.pageSettings?.totalRecordsCount ?? 0;
      const pageSize = paginationSettings.pageSize ?? 1;
      if (!pageSize) return 0;
      return Math.ceil(totalRecordsCount / pageSize);
    };

    const renderPageNumbers = useCallback(() => {
      const { startPage, pageCount, currentPage } = paginationSettings;
      const totalPages = getTotalPages();
      const pages = [];
      const endPage = Math.min(startPage + pageCount - 1, totalPages);
      const paginationButtonClass = `h-6 mr-1 cursor-pointer border-0 items-center justify-center hover:bg-hover focus-indicator disabled:pointer-events-none disabled:cursor-not-allowed`;

      if (startPage > 1) {
        pages.push(
          <Button
            key="prev-more"
            size="sm"
            tabindex={0}
            id="prev_more_page"
            variant="basic"
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handlePaginationEvent(
                  `${startPage > pageCount + 1 ? 'prev_more_page' : 'page-1'}`,
                  startPage - pageCount,
                  startPage - pageCount
                );
              }
            }}
            onClick={() =>
              handlePaginationEvent(
                `${startPage > pageCount + 1 ? 'prev_more_page' : 'page-1'}`,
                startPage - pageCount,
                startPage - pageCount
              )
            }
            className={`${paginationButtonClass} w-6`}
            aria-label="Load Previous Pages"
          >
            <span className="text-default">...</span>
          </Button>
        );
      }

      for (let i = startPage; i > 0 && i <= endPage; i++) {
        pages.push(
          <Button
            key={i}
            variant="basic"
            size="sm"
            tabindex={0}
            id={`page-${i}`}
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handlePaginationEvent(`syncFusionpaginationGrid`, i, startPage);
              }
            }}
            onClick={() => handlePaginationEvent(`syncFusionpaginationGrid`, i, startPage)}
            className={`${paginationButtonClass} ${currentPage === i ? 'active-page focus:bg-primary focus-visible:bg-primary hover:cursor-not-allowed' : ''} max-w-[44px] min-w-[24px]`}
            aria-label={`Page ${i}`}
            {...(currentPage === i && { 'aria-current': 'page' })}
          >
            <span className="text-default">{i}</span>
          </Button>
        );
      }

      if (endPage < totalPages) {
        pages.push(
          <Button
            key="next-more"
            tabindex={0}
            variant="basic"
            size="sm"
            id="next_more_page"
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handlePaginationEvent(
                  `${endPage < totalPages - pageCount ? 'next_more_page' : `page-${startPage + pageCount}`}`,
                  startPage + pageCount,
                  startPage + pageCount
                );
              }
            }}
            onClick={() =>
              handlePaginationEvent(
                `${endPage < totalPages - pageCount ? 'next_more_page' : `page-${startPage + pageCount}`}`,
                startPage + pageCount,
                startPage + pageCount
              )
            }
            className={`${paginationButtonClass} w-6`}
            aria-label="Load Next Pages"
          >
            <span className="text-default">...</span>
          </Button>
        );
      }

      return pages;
    }, [paginationSettings, ref?.current]);

    const CustomPaginationTemplate = useMemo(() => {
      return (pagerData) => {
        const grid = typeof ref === 'object' && ref !== null ? ref.current : null;
        if (!grid) return null;

        const { pageSize, currentPage, startPage, pageCount, pageSizes } = paginationSettings;
        const totalPages = getTotalPages();

        useEffect(() => {
          if (currentPage && totalPages) {
            announce(`Page ${currentPage} of ${totalPages}`);
          }
        }, [currentPage, totalPages]);

        const paginationButtonClass = `h-6 mr-1 cursor-pointer border-0 items-center justify-center focus-indicator hover:bg-hover disabled:pointer-events-none disabled:cursor-not-allowed`;

        return (
          <div className="pagercontainer" role="navigation" aria-label="pagination">
            {pageSizes?.length > 0 && (
              <div className="pagerdropdown">
                <div id="itemPerPage" className="mr-2 text-[#5D5D5D]">
                  Items per Page:
                </div>
                <select
                  tabIndex={0}
                  id="page-size-dropdown"
                  aria-labelledby="itemPerPage"
                  value={pageSize}
                  onChange={(e) => {
                    setLastFocusedButtonID('page-size-dropdown');
                    handlePageSizeChange(e);
                  }}
                  className="border-[#888888]"
                  onBlur={handleBlur}
                >
                  {pageSizes?.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="pagerDetail">
              <div className="text-default mr-2">
                {isNaN(totalPages) || totalPages === 0 ? 0 : currentPage} of{' '}
                {isNaN(totalPages) ? 0 : totalPages} pages
              </div>
              <div className="text-[#5D5D5D]">
                ({pagerData?.totalRecordsCount ?? 0}{' '}
                {pagerData?.totalRecordsCount === 1 ? 'item' : 'items'})
              </div>
            </div>
            <div className="pagercontent">
              <Button
                variant="basic"
                aria-label="Go To First Page"
                size="sm"
                id="first_page"
                tabindex={0}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handlePaginationEvent('page-1', 1, 1);
                  }
                }}
                onClick={() => handlePaginationEvent('page-1', 1, 1)}
                disabled={currentPage <= 1}
                className={`${paginationButtonClass} w-6 ${currentPage <= 1 ? 'disabled-icon' : ''}`}
              >
                <FontAwesomeIcon icon={faChevronsLeft} className="text-default h-2 w-4" />
              </Button>
              <Button
                variant="basic"
                aria-label="Go To Previous Page"
                size="sm"
                id="prev_page"
                tabindex={0}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handlePaginationEvent(
                      `${currentPage === 2 ? 'page-1' : 'prev_page'}`,
                      currentPage - 1,
                      currentPage === startPage ? startPage - pageCount : startPage
                    );
                  }
                }}
                onClick={() =>
                  handlePaginationEvent(
                    `${currentPage === 2 ? 'page-1' : 'prev_page'}`,
                    currentPage - 1,
                    currentPage === startPage ? startPage - pageCount : startPage
                  )
                }
                disabled={currentPage <= 1}
                className={`${paginationButtonClass} w-6 ${currentPage <= 1 ? 'disabled-icon' : ''}`}
              >
                <FontAwesomeIcon icon={faChevronLeft} className="text-default h-2 w-4" />
              </Button>
              {renderPageNumbers()}
              <Button
                variant="basic"
                aria-label="Go To Next Page"
                size="sm"
                id="next_page"
                tabindex={0}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handlePaginationEvent(
                      `${currentPage === totalPages - 1 ? `page-${totalPages}` : 'next_page'}`,
                      currentPage + 1,
                      currentPage === startPage + pageCount - 1 ? currentPage + 1 : startPage
                    );
                  }
                }}
                onClick={() =>
                  handlePaginationEvent(
                    `${currentPage === totalPages - 1 ? `page-${totalPages}` : 'next_page'}`,
                    currentPage + 1,
                    currentPage === startPage + pageCount - 1 ? currentPage + 1 : startPage
                  )
                }
                disabled={currentPage >= totalPages}
                className={`${paginationButtonClass} w-6 ${currentPage >= totalPages ? 'disabled-icon' : ''}`}
              >
                <FontAwesomeIcon icon={faChevronRight} className="text-default h-2 w-4" />
              </Button>
              <Button
                variant="basic"
                aria-label="Go To Last Page"
                tabindex={0}
                size="sm"
                id="last_page"
                onBlur={handleBlur}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handlePaginationEvent(
                      `page-${totalPages}`,
                      totalPages,
                      totalPages - pageCount + 1
                    );
                  }
                }}
                onClick={() =>
                  handlePaginationEvent(
                    `page-${totalPages}`,
                    totalPages,
                    totalPages - pageCount + 1
                  )
                }
                disabled={currentPage >= totalPages}
                className={`${paginationButtonClass} w-6 ${currentPage >= totalPages ? 'disabled-icon' : ''}`}
              >
                <FontAwesomeIcon icon={faChevronsRight} className="text-default h-2 w-4" />
              </Button>
            </div>
          </div>
        );
      };
    }, [paginationSettings, ref?.current]);

    const setEmptyCellMessageVisibility = (isVisible: boolean = false) => {
      const grid: GridComponent = ref?.current;

      const emptyRow = grid?.element?.getElementsByClassName('e-emptyrow')?.[0];

      if (emptyRow !== undefined && emptyRow !== null) {
        if (isVisible) {
          emptyRow?.setAttribute('style', 'color:#111827 !important');
        }
      }
    };

    return (
      <div>
        <div className="bg-card flex w-full flex-row items-start rounded-t-md border py-2 pr-4">
          <div className="min-w-0 flex-1">{children}</div>
          <div className="ml-2 flex items-center gap-2">
            {configureColumns && (
              <Tooltip
                triggerElement={() => (
                  <Button
                    id="tooltip"
                    variant="basic"
                    onClick={() => handleColumnSettings()}
                    className="focus-indicator h-7 w-7 p-2"
                    aria-label="Configure column options"
                  >
                    <FontAwesomeIcon icon={faWrench} className="text-default h-4 w-4" />
                  </Button>
                )}
                tooltip={() => <div className="p-2">Configure column options</div>}
              />
            )}
          </div>
        </div>

        <div>
          <div style={{ position: 'relative' }}>
            <GridComponent
              ref={ref}
              id="syncFusionpaginationGrid"
              height={gridHeight}
              dataSource={dataManager}
              created={handleGridCreated}
              allowPaging={allowPaging}
              allowResizing={allowResizing}
              allowReordering={allowReordering}
              allowKeyboard={true}
              allowSorting={allowSorting}
              allowFiltering={allowFiltering}
              sortSettings={defaultSortSetting}
              actionBegin={handleOnActionBegin}
              actionComplete={handleOnActionComplete}
              loadingIndicator={{ indicatorType: 'Spinner' }}
              rowSelected={onRowSelected}
              allowTextWrap={allowTextWrap}
              textWrapSettings={{ wrapMode: 'Content' }}
              rowDeselected={onRowDeselected}
              rowDataBound={rowDataBound}
              keyPressed={handleGridKeyPress}
              dataBound={onDataBound}
              dataSourceChanged={(a) => {
                console.log(a);
              }}
              selectionSettings={{
                type: 'Multiple',
                persistSelection: true,
                checkboxOnly: true,
              }}
              pageSettings={{
                ...paginationSettings,
                template: CustomPaginationTemplate,
              }}
              cssClass={classNames(
                showSelectAll ? '' : 'hide-header-checkbox',
                checkboxSelection ? '' : 'enable-horizontal-scroll'
              )}
            >
              <ColumnsDirective>
                {checkboxSelection && (
                  <ColumnDirective type="checkbox" width="50" freeze="Left" field="checkboxField" />
                )}

                <ColumnDirective
                  field={recordPrimaryKey}
                  isPrimaryKey={true}
                  visible={false}
                  aria-hidden={true}
                />

                {tableColumns?.map((column: any, i: number) => {
                  return (
                    <ColumnDirective
                      key={`${column.fieldName}_${i}`}
                      field={column.fieldName}
                      headerText={column.headerName}
                      minWidth={column.width}
                      width={column.width}
                      freeze={column?.freeze ?? 'None'}
                      allowSorting={column.canSort !== undefined ? column.canSort : false}
                      visible={column?.visible !== undefined ? column.visible : true}
                      clipMode={allowTextWrap ? 'Clip' : 'EllipsisWithTooltip'}
                      template={column?.renderCell}
                    ></ColumnDirective>
                  );
                })}
              </ColumnsDirective>
              <Inject
                services={[
                  Page,
                  Sort,
                  Filter,
                  Reorder,
                  Resize,
                  Freeze,
                  VirtualScroll,
                  ColumnChooser,
                ]}
              />
            </GridComponent>
            {tableLegends?.length > 0 && (
              <div className="absolute bottom-4 flex flex-row items-center justify-center text-[12px]">
                {tableLegends.map((item: any, index: number) => {
                  return (
                    <div key={index} className="border-r-2 border-[#D1D1D1] px-2">
                      {item}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <ColumnSettingsDrawer
            handleOnSave={updateColumnOnSave}
            gridTitle={'Table'}
            ref={settingsRef}
          />
        </div>
      </div>
    );
  }
);
SyncfusionGridPagination.displayName = 'SyncfusionGridPagination';

export default SyncfusionGridPagination;
