/* eslint-disable object-shorthand */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/jsx-key */
import { announce } from '@react-aria/live-announcer';
import {
  faMagnifyingGlass,
  faRectangleList,
  faTableCells,
  faTimes,
  faWrench,
} from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { getStyles, useDebounce } from '../../../../utilities';
import { Button } from '../Buttons';
import Tooltip from '../Tooltip/Tooltip';
import { useWindowSize } from './utils';
import ColumnSettingsDrawer, { ColumnSettingsFunction } from './settings/ColumnSettingsDrawer';
import { twMerge } from 'tailwind-merge';

const ColumnFixedMinWidth = '10vw';
const ColumnFixedMaxWidth = '10vw';

function TableSortIcon({
  active = false,
  order = 'asc',
  pageName = '',
  fieldName = '',
}: {
  order?: 'asc' | 'desc' | '';
  active?: boolean;
  pageName?: string;
  fieldName?: string;
}): JSX.Element {
  return (
    <span
      className={classNames(
        active
          ? 'text-default group-hover:bg-hover bg-gray-100'
          : 'text-slate-700 group-hover:visible group-focus:visible',
        'ml-2 flex-none rounded-md p-[2px]'
      )}
      id={
        order === 'desc'
          ? `${pageName ? pageName + '_' : ''}${fieldName ? fieldName + '_' : ''}sort_down`
          : `${pageName ? pageName + '_' : ''}${fieldName ? fieldName + '_' : ''}sort_up`
      }
    >
      {order === 'desc' && <ArrowDownIcon className="h-3 w-3" aria-hidden="true" />}
      {order === 'asc' && <ArrowUpIcon className="h-3 w-3" aria-hidden="true" />}
      {order === '' && <></>}
    </span>
  );
}

const InfiniteScrollTable = ({
  columns,
  fetchDataOnScroll,
  queryKey,
  showSelectAll,
  disableSelectAll,
  checkboxSelection,
  radioButtonSelection,
  radioGroupName = 'radioGroup',
  searchable,
  searchHeight = 48,
  rounded = true,
  carded = false,
  tableActions,
  onRadioButtonSelect,
  onCheckboxSelect,
  onCheckboxAllSelect,
  onSort,
  filterPayload,
  maxHeight = '450px',
  minHeight = 'minContent',
  externalQuery,
  defaultSortColumn,
  placeholderText = '',
  noOfCard = 1,
  onViewChange,
  showToggleView = true,
  sortState = {},
  pageName = '',
  isCheckBoxSticky = false,
  accessibilityLabelField = 'department', //It's intended for checkbox and radio button context association.
  onColumnSettingsSave,
  configureColumns = false,
  searchInputId,
  searchInputClassName,
}: {
  columns: any;
  fetchDataOnScroll: (query: any) => Promise<any>;
  queryKey: string[];
  showSelectAll?: boolean;
  disableSelectAll?: boolean;
  checkboxSelection?: boolean;
  radioGroupName?: string;
  radioButtonSelection?: boolean;
  searchable?: boolean;
  searchHeight?: number;
  rounded?: boolean;
  carded?: boolean;
  tableActions?: React.ReactNode;
  onRadioButtonSelect?: (rowData: any) => void;
  onCheckboxAllSelect?: (selectAll: boolean) => void;
  onCheckboxSelect?: (rowData: any) => void;
  onSort?: (data: any) => void;
  filterPayload?: any;
  maxHeight?: string;
  minHeight?: string;
  externalQuery?: any;
  defaultSortColumn?: { column: string; order: 'desc' | 'asc' };
  placeholderText?: string;
  noOfCard?: number;
  onViewChange?: (event: 'card' | 'grid') => void;
  showToggleView?: boolean;
  isCheckBoxSticky?: boolean;
  sortState?: any;
  pageName?: string;
  accessibilityLabelField?: any; //Accessibility of checkbox & radio
  onColumnSettingsSave?: (cols: any) => void;
  configureColumns?: boolean;
  searchInputId?: string;
  searchInputClassName?: string;
}) => {
  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const settingsRef = React.useRef<ColumnSettingsFunction>();

  const checkbox = useRef<any>();
  const [checkAll, setCheckAll] = useState<boolean>(false);
  const [query, setQuery] = useState('');
  const [cardview, setCardview] = useState(false);
  const [cardCount, setCardCount] = useState(noOfCard);
  const [currentSort, setCurrentSort] = useState<{
    order: 'asc' | 'desc' | '';
    field?: string;
  }>({
    order: sortState?.order ?? 'asc',
    field: sortState?.field ?? '',
  });

  const [visibleColumns, setVisibleColumns] = useState<any>([]);
  const [tableColumns, setTableColumns] = useState(columns || []);
  const [searchFocused, setSearchFocused] = useState(false);
  const debouncedSearch = useDebounce(query, 500);
  const queryClient = useQueryClient();
  const [width] = useWindowSize();

  useEffect(() => {
    externalQuery !== undefined && setQuery(externalQuery);
  }, [externalQuery]);

  useEffect(() => {
    queryClient.clear();
  }, [debouncedSearch, currentSort, filterPayload]);

  useEffect(() => {
    setTableColumns(columns);
  }, [columns]);

  useEffect(() => {
    // const determinedVisibleColumns = determineVisibleColumns(width, tableColumns);
    setVisibleColumns(tableColumns);
  }, [tableColumns]);

  useEffect(() => {
    if (defaultSortColumn?.column && defaultSortColumn?.order) {
      let columnToSort = tableColumns?.find((i) => i.fieldName.includes(defaultSortColumn.column));
      if (columnToSort) {
        sortColumn(columnToSort, defaultSortColumn.order);
      }
    }
  }, [defaultSortColumn]);

  const { data, status, error, fetchNextPage, isFetching, hasNextPage, refetch } = useInfiniteQuery(
    {
      queryKey: queryKey,
      queryFn: (params) => fetchDataOnScroll({ params, debouncedSearch, currentSort }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages, lastPageParam) => {
        const nextPage = lastPageParam + 1;
        return nextPage;
      },
      refetchOnWindowFocus: false,
    }
  );

  const flatData = React.useMemo(() => data?.pages?.flatMap((page) => page.data) ?? [], [data]);
  const totalDBRowCount = data?.pages?.[0]?.totalCount ?? 0;
  const totalFetched = flatData.length;

  const fetchMoreOnBottomReached = React.useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;

        if (
          scrollHeight - scrollTop - clientHeight < 300 &&
          !isFetching &&
          totalFetched < totalDBRowCount
        ) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount]
  );

  useEffect(() => {
    if (flatData?.length > 0 && !isFetching) {
      announce(`Showing ${flatData.length} of ${totalDBRowCount} results`, 'polite');
    } else if (flatData?.length === 0 && !isFetching) {
      announce('No results found', 'polite');
    }
  }, [flatData?.length, totalDBRowCount, isFetching]);

  React.useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  const renderTruncateContent = (content: any, truncate: boolean) => {
    const triggerEl = () => {
      return <div className="truncate">{content}</div>;
    };

    const tooltip = () => {
      return <div className="w-full p-2">{content}</div>;
    };

    return (
      <Tooltip triggerElement={triggerEl} tooltip={tooltip} truncate={truncate} tabIndex={0} />
    );
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCardCount(1);
      } else {
        setCardCount(noOfCard);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sortColumn = (column: any, order?: string) => {
    setCurrentSort((prev: any) => {
      if (column.hideSortIcon ?? false) return prev;
      onSort &&
        onSort({
          field: String(column.fieldName),
          order: order
            ? order
            : prev.order === 'asc'
              ? 'desc'
              : prev.order === 'desc'
                ? ''
                : prev.order === ''
                  ? 'asc'
                  : 'asc',
        });
      return {
        field: String(column.fieldName),
        order: order
          ? order
          : prev.order === 'asc'
            ? 'desc'
            : prev.order === 'desc'
              ? ''
              : prev.order === ''
                ? 'asc'
                : 'asc',
      };
    });
  };

  const setflatData = (flatData: any[], cardCount: number) => {
    const setData = [];
    for (let i = 0; i < flatData.length; i += cardCount) {
      setData.push(flatData.slice(i, i + cardCount));
    }
    return setData;
  };

  const setColumnsData = (cols: any[], count: number) => {
    const setColumn = [];
    for (let i = 0; i < cols.length; i += count) {
      setColumn.push(cols.slice(i, i + count));
    }
    return setColumn;
  };

  const rowClassName = (row: any, index: number) => {
    if (row?.isSelected) {
      return 'bg-[#EEEEFF] dark:bg-gray-400 h-[40px]';
    } else if (
      row?.deleted === true ||
      ['cancelled', 'revoked'].includes(row?.status?.trim()?.toLowerCase())
    ) {
      return 'bg-gray-200 h-[40px]';
    } else {
      return `${index % 2 !== 0 ? 'bg-card' : 'bg-alternate-row'} h-[40px]`;
    }
  };

  const updateColumnOnSave = (cols: any[]) => {
    setTableColumns([...cols]);
    onColumnSettingsSave && onColumnSettingsSave(cols);
  };

  const handleColumnSettings = () => {
    settingsRef?.current?.handleDrawer({
      open: true,
      columns: tableColumns,
      loading: false,
    });
  };

  return (
    <div className="flex w-full flex-col" role="region">
      {showToggleView && (
        <div className="mb-4 flex flex-row items-center justify-end" role="tabpanel">
          <Button
            className="rounded-tl-lg rounded-tr-none rounded-br-none rounded-bl-lg"
            variant={!cardview ? 'flat' : 'stroked'}
            onClick={() => {
              setCardview(false);
              onViewChange?.('grid');
            }}
            aria-pressed={!cardview}
          >
            <span className="sr-only">Switch to Grid View</span>
            <FontAwesomeIcon icon={faTableCells} className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            className="rounded-tl-none rounded-tr-lg rounded-br-lg rounded-bl-none"
            variant={cardview ? 'flat' : 'stroked'}
            onClick={() => {
              setCardview(true);
              onViewChange?.('card');
            }}
            aria-pressed={cardview}
          >
            <span className="sr-only">Switch to Card View</span>
            <FontAwesomeIcon icon={faRectangleList} className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      )}
      <div
        className={classNames(
          'bg-table',
          (cardview || rounded) && 'rounded-md border border-b-0',
          carded && 'rounded-none'
        )}
      >
        <div
          className={classNames(
            'flex w-full min-w-full flex-row flex-wrap items-center justify-between gap-4',
            cardview && 'border-b',
            !carded && 'rounded-tl-md rounded-tr-md'
          )}
        >
          {searchable && (
            <div
              className={twMerge(
                'relative flex w-3/12 min-w-[200px] flex-row items-center justify-start border-r px-2',
                searchInputClassName
              )}
              style={{ height: searchHeight + 'px' }}
            >
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="dark:text-default pointer-events-none inset-y-0 left-0 w-5 text-gray-400"
                aria-hidden="true"
              />
              <input
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e?.key === 'Escape') {
                    setSearchFocused(false);
                  }
                }}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                id={searchInputId || 'search-field'}
                className="focus:visible:outline-primary text-default bg-table dark:placeholder:text-default block h-full w-full border-0 py-0 pr-0 placeholder:text-[#5D5D5D] focus-visible:ring-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] sm:text-sm"
                placeholder={`Search ${placeholderText}`}
                name="search"
                value={query}
                aria-label="Search"
                autocomplete="off"
                aria-describedby="search-input-tooltip"
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery('');
                    document?.getElementById(searchInputId || 'search-field')?.focus();
                  }}
                  className="focus-indicator ml-2"
                  aria-label="Clear search"
                  title="Clear search"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-primary" />
                </button>
              )}
              {searchFocused && query.length < 3 && (
                <div
                  id="search-input-tooltip"
                  role="tooltip"
                  className="text-default bg-card absolute top-full z-50 mt-1 ml-4 min-w-[250px] rounded-md border border-gray-200 px-3 py-2 text-sm shadow-lg"
                  style={{
                    top: `${searchHeight}px`,
                  }}
                >
                  Type at least 3 characters to search
                </div>
              )}
            </div>
          )}

          {tableActions && (
            <div className="flex flex-1 flex-row flex-wrap px-4" role="group">
              {tableActions}
            </div>
          )}
          {configureColumns && (
            <div
              className={classNames(
                'right flex-end flex items-end justify-end px-4',
                !tableActions && 'flex-1'
              )}
            >
              <Tooltip
                triggerElement={() => {
                  return (
                    <button
                      onClick={() => handleColumnSettings()}
                      className="focus-indicator ml-2 p-2"
                      aria-label="Configure column options"
                    >
                      <FontAwesomeIcon icon={faWrench} className="text-primary h-5 w-5" />
                    </button>
                  );
                }}
                tooltip={() => {
                  return <div className="w-full p-2">Configure column options</div>;
                }}
              />
            </div>
          )}
        </div>

        <div className={classNames('w-full', !carded && 'rounded-br-md rounded-bl-md')}>
          <div
            style={{
              maxHeight: maxHeight,
              minHeight: minHeight,
            }}
            onScroll={(e) => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
            id="scroller"
            className={classNames('w-full overflow-auto')}
            ref={tableContainerRef}
            role="region"
          >
            {!cardview ? (
              <table
                className={classNames(
                  'w-full border-separate border-spacing-0 border border-r-0 border-l-0'
                )}
              >
                <thead className="relative z-30">
                  <tr className="z-20 h-[40px] rounded">
                    {checkboxSelection ? (
                      <th
                        scope="col"
                        className={classNames(
                          'text-default bg-table-header sticky top-0 min-w-[40px] border-b px-2 text-left text-sm font-semibold uppercase',
                          (isCheckBoxSticky || visibleColumns[0]?.isSticky) && 'sticky left-0 z-20'
                        )}
                      >
                        {showSelectAll && (
                          <input
                            type="checkbox"
                            id={pageName ? `${pageName}_col_checkbox` : 'col_checkbox'}
                            className="focus-indicator text-primary disabled:bg-disabled dark:bg-input top-1/2 h-4 w-4 rounded disabled:cursor-not-allowed"
                            ref={checkbox}
                            checked={checkAll}
                            disabled={disableSelectAll}
                            onChange={(event: any) => {
                              setCheckAll(event?.nativeEvent?.target?.checked);
                              onCheckboxAllSelect &&
                                onCheckboxAllSelect(event?.nativeEvent?.target?.checked);
                            }}
                            aria-label="select all items."
                            testid="infiniteScroll_grid_selectAll_checkbox"
                          />
                        )}
                      </th>
                    ) : (
                      radioButtonSelection && (
                        <th
                          scope="col"
                          className={classNames(
                            'text-default bg-table-header sticky top-0 min-w-[40px] border-b px-2 text-left text-sm font-semibold uppercase',
                            isCheckBoxSticky && 'left-0 z-20'
                          )}
                        ></th>
                      )
                    )}
                    {/*Please note: The sortable table header has some functional discrepancies in not including sortable icon which previously existed. Currently for A11Y the entire sortable header is to be made clickable and focusable. Instead of having a button inside.*/}
                    {visibleColumns.map((column, index) => {
                      return column?.visible == false ? null : (
                        <th
                          id={'table_header_' + column.fieldName}
                          key={String(column.fieldName) + String(index)}
                          scope="col"
                          tabIndex={column.canSort ? 0 : undefined}
                          role={column.canSort ? 'columnheader' : undefined}
                          onClick={column.canSort ? () => sortColumn(column) : undefined}
                          onKeyDown={
                            column.canSort
                              ? (e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    sortColumn(column);
                                  }
                                }
                              : undefined
                          }
                          aria-sort={
                            column.fieldName === currentSort.field
                              ? currentSort.order === 'asc'
                                ? 'ascending'
                                : currentSort.order === 'desc'
                                  ? 'descending'
                                  : 'none'
                              : 'none'
                          }
                          aria-label={
                            column.canSort
                              ? `${column.headerName} ${
                                  currentSort.field === column.fieldName
                                    ? currentSort.order === 'asc'
                                      ? 'sorted in ascending order'
                                      : currentSort.order === 'desc'
                                        ? 'sorted in descending order'
                                        : ''
                                    : 'sortable'
                                }`
                              : undefined
                          }
                          style={getStyles(
                            column,
                            index,
                            visibleColumns,
                            ColumnFixedMaxWidth,
                            ColumnFixedMinWidth,
                            checkboxSelection,
                            radioButtonSelection
                          )}
                          className="focus-indicator text-default bg-table-header sticky top-0 cursor-pointer border-b px-2 text-left text-xs font-semibold uppercase"
                        >
                          <div className="focus-indicator flex flex-row items-center justify-start gap-x-1 uppercase">
                            {column.headerName}
                            {column.canSort && (
                              <TableSortIcon
                                active={column.fieldName === currentSort.field}
                                order={
                                  column.fieldName === currentSort.field
                                    ? currentSort.order
                                    : undefined
                                }
                                pageName={pageName ?? ''}
                                fieldName={column?.fieldName ?? ''}
                              />
                            )}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="z-1">
                  {flatData.map((row: any, index: number) => (
                    <tr
                      key={`${row.id}_tableRow_${index}`}
                      className={classNames(
                        row?.isSelected
                          ? 'bg-[#EEEEFF] dark:bg-gray-400'
                          : row?.deleted === true ||
                              ['cancelled', 'revoked']?.includes(row?.status?.trim()?.toLowerCase())
                            ? 'bg-gray-200'
                            : 'odd:bg-alternate-row',
                        'h-[40px]'
                      )}
                    >
                      {checkboxSelection && (
                        <td
                          className={classNames(
                            'min-w-[40px] px-2 text-sm',
                            (isCheckBoxSticky || visibleColumns[0]?.isSticky) &&
                              'sticky left-0 z-10',
                            rowClassName(row, index)
                          )}
                        >
                          <input
                            type="checkbox"
                            id={`${row?.id ? row.id + '_checkbox' : index + '_checkbox'}`}
                            aria-label={
                              accessibilityLabelField
                                ? typeof accessibilityLabelField === 'function'
                                  ? accessibilityLabelField(row) || `row ${index + 1}`
                                  : row[accessibilityLabelField] || `row ${index + 1}`
                                : `row ${index + 1}`
                            }
                            className={`focus-indicator text-primary dark:bg-input top-1/2 h-4 w-4 rounded disabled:cursor-not-allowed disabled:bg-gray-200 ${pageName ? `${pageName}_row_checkbox` : 'row_checkbox'}`}
                            checked={row.isSelected !== undefined ? row.isSelected : false}
                            disabled={row.disabled !== undefined ? row.disabled : false}
                            onChange={() => {
                              onCheckboxSelect && onCheckboxSelect(row);
                            }}
                            testid="infiniteScroll_grid_checkbox"
                          />
                        </td>
                      )}

                      {radioButtonSelection && (
                        <td
                          className={classNames(
                            'min-w-[40px] px-2 text-sm',
                            isCheckBoxSticky && 'sticky left-0 z-20',
                            rowClassName(row, index)
                          )}
                        >
                          <input
                            name={radioGroupName}
                            type="radio"
                            checked={row?.isSelected}
                            aria-label={
                              accessibilityLabelField && row[accessibilityLabelField]
                                ? `${row[accessibilityLabelField]}`
                                : `row ${index + 1}`
                            }
                            onChange={() => {
                              onRadioButtonSelect && onRadioButtonSelect(row);
                            }}
                            disabled={row.disabled !== undefined ? row.disabled : false}
                            className="focus:primary text-primary top-1/2 mt-1 h-4 w-4 cursor-pointer rounded-full border-gray-500 disabled:cursor-not-allowed disabled:bg-gray-200"
                          />
                        </td>
                      )}

                      {visibleColumns.map((column, ind) => {
                        const isFirstVisibleColumn = ind === 0;
                        const isSecondVisibleColumn = ind === 1;

                        return column?.visible == false ? null : (
                          <td
                            key={`${row[column.fieldName]}_${ind}`}
                            id={`${row[column.fieldName]}_${ind}_${index}`}
                            style={getStyles(
                              column,
                              ind,
                              visibleColumns,
                              ColumnFixedMaxWidth,
                              ColumnFixedMinWidth,
                              checkboxSelection,
                              radioButtonSelection
                            )}
                            className={classNames(
                              'px-2 text-sm',
                              rowClassName(row, index),
                              column.isSticky && 'sticky'
                            )}
                            onFocus={() => {
                              if (
                                (isFirstVisibleColumn || isSecondVisibleColumn) &&
                                tableContainerRef.current
                              ) {
                                tableContainerRef.current.scrollLeft = 0;
                              }
                            }}
                          >
                            {row.isUpdating ? (
                              <div role="status" className="animate-pulse">
                                <div className="mb-2.5 h-2 rounded-full bg-gray-300"></div>
                                <div className="bg-opacity-70 mb-2.5 h-2 rounded-full bg-gray-400"></div>
                              </div>
                            ) : column.renderCell !== undefined ? (
                              column?.isTruncate ? (
                                renderTruncateContent(column?.renderCell(row), column?.isTruncate)
                              ) : (
                                column.renderCell(row)
                              )
                            ) : (
                              String(row[column.fieldName])
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  {isFetching && (
                    <tr className="odd:bg-card even:bg-gray-100 dark:even:bg-gray-800">
                      {checkboxSelection && (
                        <td className="my-2 p-4">
                          <div role="status" className="animate-pulse">
                            <div className="mb-2.5 h-2 rounded-full bg-gray-300"></div>
                            <div className="bg-opacity-70 mb-2.5 h-2 rounded-full bg-gray-400"></div>
                          </div>
                        </td>
                      )}
                      {visibleColumns.map((column, index) => {
                        return (
                          <td key={`${column.fieldName}_${index}_loading`} className="my-2 p-4">
                            <div role="status" className="animate-pulse">
                              <div className="mb-2.5 h-2 rounded-full bg-gray-300"></div>
                              <div className="bg-opacity-70 mb-2.5 h-2 rounded-full bg-gray-400"></div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <div className="grid grid-cols-12 gap-4 p-4" role="list" aria-label="card view">
                {setflatData(flatData, cardCount).map((set: any[], setIndex: number) => (
                  <div key={setIndex} className="col-span-12 w-full sm:col-span-6 lg:col-span-4">
                    {set.map((row: any, index: number) => (
                      <div
                        key={index}
                        className="bg-card mb-4 rounded-lg border px-4 pt-4 shadow-sm"
                        role="listitem"
                      >
                        {setColumnsData(tableColumns, 2).map((chunk: any[], chunkIndex: number) => (
                          <div key={chunkIndex} className="mb-4">
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                              {chunk.map((column, index) => (
                                <div
                                  key={index}
                                  className="flex flex-col items-start justify-start text-sm capitalize"
                                >
                                  {column.fieldName !== 'action' && (
                                    <div className="flex flex-col items-start justify-center text-sm capitalize">
                                      <span className="font-semibold">{column.fieldName}</span>
                                      <span className="text-secondary">
                                        {row.isUpdating ? (
                                          <div role="status" className="animate-pulse">
                                            <div className="mb-2.5 h-2 rounded-full bg-gray-300"></div>
                                            <div className="bg-opacity-70 mb-2.5 h-2 rounded-full bg-gray-400"></div>
                                          </div>
                                        ) : column.renderCell !== undefined ? (
                                          column?.isTruncate ? (
                                            renderTruncateContent(
                                              column?.renderCell(row),
                                              column?.isTruncate
                                            )
                                          ) : (
                                            column.renderCell(row)
                                          )
                                        ) : (
                                          String(row[column.fieldName])
                                        )}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                        <div className="bg-opacity-75 flex justify-center rounded-b-lg border-t px-4 py-2 text-sm">
                          {tableColumns !== undefined &&
                            tableColumns?.length > 0 &&
                            (
                              tableColumns[
                                tableColumns?.findIndex((column) => column.fieldName === 'action')
                              ] as any
                            )?.renderCell(row)}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
            {!isFetching && flatData && flatData.length === 0 && (
              <div className="bg-table p-4" role="alert" aria-live="assertive">
                <span>No record found</span>
              </div>
            )}
          </div>

          <div
            className={classNames(
              'flex flex-row items-center justify-end rounded-br-md rounded-bl-md border border-r-0 border-l-0 p-2 text-xs',
              cardview && 'border-r-0 border-l-0',
              carded && 'rounded-br-none rounded-bl-none'
            )}
          >
            Showing {flatData.length} of {totalDBRowCount} results
          </div>
        </div>
      </div>

      <ColumnSettingsDrawer
        handleOnSave={updateColumnOnSave}
        gridTitle={'asdd'}
        ref={settingsRef}
      />
    </div>
  );
};

export default InfiniteScrollTable;
