import React, { useEffect, useRef, useState } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import {
  ColumnChooser,
  ColumnDirective,
  ColumnsDirective,
  Freeze,
  GridComponent,
  Inject,
  Page,
  Reorder,
  Resize,
  Sort,
  Selection,
} from '@syncfusion/ej2-react-grids';
import { throttle } from 'lodash';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { announce } from '@react-aria/live-announcer';
import { faWrench } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { registerLicense } from '@syncfusion/ej2-base';

import { Button, Spinner, useWindowSize } from '../../common';
import { useDebounce } from '../../../../utilities';
import ColumnSettingsDrawer, { ColumnSettingsFunction } from './settings/ColumnSettingsDrawer';
import '@syncfusion/ej2-react-grids/styles/material.css';

registerLicense(
  'Ngo9BigBOggjHTQxAR8/V1NNaF5cXmBCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdmWXped3RdRGBfU0B0XUtWYE4='
);

const SyncFusionInfiniteScrollTable = ({
  columns,
  fetchDataOnScroll,
  queryKey,
  allowReordering = true,
  allowSorting = false,
  allowMultiSorting = false,
  allowResizing = true,
  allowPaging = false,
  checkboxSelection = false,
  toolTipPosition = 'LeftCenter',
  showSelectAll = false,
  disableSelectAll,
  radioButtonSelection,
  recordPrimaryKey = 'id',
  radioGroupName = 'radioGroup',
  tableHeight = 400,
  rounded = true,

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
  children,
  tableLegends = [],
}: {
  columns: any;
  fetchDataOnScroll: (query: any) => Promise<any>;
  queryKey: string[];
  allowReordering: boolean;
  allowSorting: boolean;
  allowMultiSorting?: boolean;
  allowResizing: boolean;
  allowPaging: boolean;
  checkboxSelection?: boolean;
  recordPrimaryKey?: string;
  toolTipPosition: string;
  showSelectAll?: boolean;
  disableSelectAll?: boolean;
  radioGroupName?: string;
  radioButtonSelection?: boolean;
  tableHeight?: number;
  rounded?: boolean;

  tableActions?: React.ReactNode;
  onRadioButtonSelect?: (rowData: any) => void;
  onCheckboxAllSelect?: (selectAll: boolean) => void;
  onCheckboxSelect?: (rows: any[], isSelect: boolean) => void;
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
  children: any;
  tableLegends?: any[];
}) => {
  const settingsRef = React.useRef<ColumnSettingsFunction>();
  const [gridData, setGridData] = useState([]);
  const [totalFetched, setTotalFetched] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const checkbox = useRef<any>();
  const [checkAll, setCheckAll] = useState<boolean>(false);
  const [query, setQuery] = useState('');
  const [currentSort, setCurrentSort] = useState<any>({});

  const gridRef: any = useRef();

  const [tableColumns, setTableColumns] = useState(columns || []);

  const debouncedSearch = useDebounce(query, 500);
  const queryClient = useQueryClient();
  const [width] = useWindowSize();

  const [selectedRecords, setSelectedRecords] = useState<any[]>([]);

  const fetchingRef = useRef(false);

  useEffect(() => {
    externalQuery !== undefined && setQuery(externalQuery);
  }, [externalQuery]);

  useEffect(() => {
    setTableColumns(columns);

    (gridRef?.current as GridComponent)?.refreshColumns();
  }, [columns]);

  useEffect(() => {
    if (defaultSortColumn?.column && defaultSortColumn?.order) {
      let columnToSort = tableColumns?.find((i) => i.fieldName.includes(defaultSortColumn.column));
      if (columnToSort) {
        // sortColumn(columnToSort, defaultSortColumn.order);
      }
    }
  }, [defaultSortColumn]);

  const { data, status, error, fetchNextPage, isFetching, hasNextPage, refetch, isInitialLoading } =
    useInfiniteQuery({
      queryKey: queryKey,
      queryFn: (params) => fetchDataOnScroll({ params, currentSort }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages, lastPageParam) => {
        const nextPage = lastPageParam + 1;
        return nextPage;
      },
      refetchOnWindowFocus: false,
    });

  useEffect(() => {
    const totalDBRowCount = data?.pages?.[0]?.totalCount ?? 0;

    if (data?.pages) {
      const allItems = data.pages.flatMap((page) => page.data) ?? [];
      setGridData([...allItems]);
      setTotalCount(totalDBRowCount);
      setTotalFetched(allItems.length);
      setTimeout(() => {
        const _gridContent = (gridRef?.current as GridComponent)?.getContent()
          .firstChild as HTMLDivElement;
        if (data?.pages?.length === 1 && _gridContent !== undefined) {
          _gridContent.scrollTop = 0;
        }
      }, 100);
    }
  }, [data]);

  useEffect(() => {
    if (gridData?.length > 0 && !isFetching) {
      announce(`Showing ${gridData.length} of ${totalCount} results`, 'polite');
    } else if (gridData?.length === 0 && !isFetching) {
      announce('No results found', 'polite');
    }
  }, [gridData?.length, totalCount, isFetching]);

  const updateColumnOnSave = (cols: any[]) => {
    cols.map((c) => {
      let column = gridRef?.current?.getColumnByField(c.fieldName);
      column.freeze = c?.freeze ? c.freeze : 'None';
    });

    onColumnSettingsSave?.(cols);
  };

  const handleScroll = (e: any) => {
    const gridContent = gridRef.current?.getContent().firstChild;

    if (!gridContent && isFetching) return;

    if (!gridContent || fetchingRef.current || isFetching || !hasNextPage) return;

    // scrollTopRef.current = gridContent.scrollTop;

    const { scrollTop, scrollHeight, clientHeight } = gridContent;

    if (
      scrollTop + clientHeight >= scrollHeight - 100 &&
      !isFetching &&
      totalFetched < totalCount
    ) {
      e?.preventDefault();

      fetchingRef.current = true;

      e?.stopImmediatePropagation();
      // scrollTopRef.current = gridContent.scrollTop;
      fetchNextPage().finally(() => {
        // Release lock after fetch completes
        setTimeout(() => {
          fetchingRef.current = false;
        }, 100);
      });
    }
  };

  useEffect(() => {
    if (!gridRef.current && isFetching) return;

    const contentElement = gridRef.current.element.querySelector('.e-content');
    if (!contentElement) return;

    const throttledScrollHandler = throttle(handleScroll, 100);

    contentElement.addEventListener('scroll', throttledScrollHandler);

    return () => {
      contentElement.removeEventListener('scroll', throttledScrollHandler);
    };
  }, [isFetching, totalFetched, totalCount, tableColumns]);

  const handleColumnDragStart = (args) => {
    const reorderableColumns = [];
    if (reorderableColumns && !reorderableColumns?.includes(args.column.field)) {
      args.cancel = true;
    }
  };

  const handleActionBegin = (args) => {
    if (args.requestType === 'infiniteScroll' || args.requestType === 'refresh') {
      gridRef.current?.showSpinner();
    }
    if (args.requestType === 'sorting') {
      if (args?.columnName) {
        const sortField = args.columnName;
        const direction =
          args.direction === 'Ascending' ? 'asc' : args.direction === 'Descending' ? 'desc' : '';

        setCurrentSort({ ...currentSort, [sortField]: direction });
      }
    }
  };

  useEffect(() => {
    const grid = gridRef?.current;
    if (!grid) return;

    isFetching ? grid.showSpinner() : grid.hideSpinner();
  }, [isFetching]);

  const handleActionComplete = (args) => {
    if (args.requestType === 'infiniteScroll' || args.requestType === 'refresh') {
      gridRef.current?.hideSpinner();
    }
    if (args.requestType === 'sorting') {
      const grid = gridRef.current;
      const currentSort = grid.sortSettings.columns; // active sort columns
      if (currentSort.length == 0) {
        setCurrentSort({});
      }
    }
  };

  const rowDataBound = (args: any) => {
    const row: HTMLTableRowElement | undefined = args?.row;
    const status = (args?.data?.status as string)?.toLowerCase();
    const isCancelledOrRevoked = ['cancelled', 'revoked'].includes(status);
    const isDisabled = args?.data?.disabled;
    const isSelected = args?.data?.isSelected;

    if (!row) return;

    if (isCancelledOrRevoked || isDisabled) {
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
      }
    } else if (isSelected) {
      args.isSelectable = true;
    }
  };

  useEffect(() => {
    if (
      gridRef?.current === undefined ||
      gridRef?.current === null ||
      selectedRecords?.length === 0
    )
      return;

    const grid: GridComponent = gridRef.current;
    const gridContent = grid.getContent()?.firstChild as HTMLElement;

    if (gridContent === undefined || gridContent === null) return;

    const originalScrollTop = gridContent.scrollTop;
    gridContent.style.overflow = 'hidden';

    const timer = setTimeout(() => {
      grid.clearSelection();

      selectedRecords.forEach((record) => {
        const rowIndex = grid.getRowIndexByPrimaryKey(record?.[recordPrimaryKey]);
        const rowElement = grid.getRowByIndex(rowIndex);

        if (rowIndex !== -1 && rowElement !== undefined) {
          grid.selectRow(rowIndex);
        }
      });

      setTimeout(() => {
        gridContent.scrollTop = originalScrollTop;
        gridContent.style.overflow = 'auto';
      }, 50);
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [gridData]);

  const onRowSelected = (args: RowSelectEventArgs) => {
    let _selectedRows: any[] = [];

    if (args?.data !== undefined && typeof args.data === 'object' && !Array.isArray(args.data)) {
      const selectedItem = { ...args.data, isSelected: true };
      _selectedRows = [selectedItem];

      setSelectedRecords((prev) => {
        const exists = prev?.some(
          (item) => item?.[recordPrimaryKey] === args.data?.[recordPrimaryKey]
        );
        return exists ? prev : [...prev, args.data];
      });
    } else if (Array.isArray(args.data)) {
      _selectedRows = args.data.map((item: any) => ({ ...item, isSelected: true }));

      setSelectedRecords((prev) => {
        const newItems = (args?.data as any[]).filter(
          (item: any) =>
            !prev?.some((prevItem) => prevItem?.[recordPrimaryKey] === item?.[recordPrimaryKey])
        );
        return [...prev, ...newItems];
      });
    }

    onCheckboxSelect?.(_selectedRows, true);
  };

  const onRowDeselected = (args: any) => {
    if (args?.data !== undefined && typeof args.data === 'object' && !Array.isArray(args.data)) {
      const rowData = { ...args.data, isSelected: false };

      onCheckboxSelect?.([rowData], false);

      setSelectedRecords((prev) =>
        prev.filter((item) => item?.[recordPrimaryKey] !== args.data?.[recordPrimaryKey])
      );
    } else if (Array.isArray(args.data)) {
      const deselectedRows = args.data.map((item: any) => ({
        ...item,
        isSelected: false,
      }));

      onCheckboxSelect?.(deselectedRows, false);

      setSelectedRecords((prev) =>
        prev.filter(
          (item) =>
            !(args?.data as any[]).some(
              (d: any) => d?.[recordPrimaryKey] === item?.[recordPrimaryKey]
            )
        )
      );
    }
  };

  const handleColumnSettings = () => {
    const clonedData = JSON.parse(JSON.stringify(tableColumns));
    settingsRef?.current?.handleDrawer({
      open: true,
      columns: clonedData,
      loading: false,
    });
  };

  useEffect(() => {
    queryClient.resetQueries();
  }, [currentSort, filterPayload]);

  // useEffect(() => {
  // 	if (gridRef.current) {
  // 		const grid = gridRef.current;
  // 		// Clear existing selection
  // 		grid.clearSelection();

  // 		if (selectedRecords?.length > 0) {
  // 			console.log('selectedRecords', selectedRecords);
  // 			// Re-select rows
  // 			selectedRecords?.forEach((record) => {
  // 				const rowIndex = grid.getRowIndexByPrimaryKey(record?.id);
  // 				if (rowIndex !== -1) {
  // 					grid?.selectRow(rowIndex);
  // 				}
  // 			});
  // 		}
  // 	}
  // }, [gridData]);

  const onDataBound = (args: any) => {
    !isFetching && gridRef?.current?.hideSpinner();
  };

  return (
    <>
      <div className="bg-card flex w-full flex-row justify-between rounded-t-md border px-4 py-2">
        {children}
        <div className="flex-end">
          {configureColumns && (
            <div className="flex-end flex items-center justify-end">
              <TooltipComponent
                className="tooltip-box"
                content="Configure column options"
                target="#tooltip"
                position="RightCenter"
              >
                <Button
                  id="tooltip"
                  variant="basic"
                  onClick={() => handleColumnSettings()}
                  className="focus-indicator ml-2 h-7 w-7 p-2"
                  aria-label="Configure column options"
                >
                  <FontAwesomeIcon icon={faWrench} className="text-primary h-4 w-4" />
                </Button>
              </TooltipComponent>
            </div>
          )}
        </div>
      </div>
      <div className="flex w-full flex-col" role="region">
        <div className={classNames('bg-table', rounded && 'rounded-md border border-b-0')}>
          <div className={classNames('w-full rounded-br-md rounded-bl-md')}>
            <div style={{ position: 'relative' }}>
              {isInitialLoading && (
                <div className="bg-card absolute inset-0 z-10 flex h-full w-full items-center justify-center">
                  <Spinner size="xl" />
                </div>
              )}
              <GridComponent
                ref={gridRef}
                dataSource={gridData}
                height={tableHeight}
                allowReordering={allowReordering}
                allowSorting={allowSorting}
                allowMultiSorting={allowMultiSorting}
                allowResizing={allowResizing}
                allowPaging={allowPaging}
                loadingIndicator={{ indicatorType: 'Spinner' }}
                columnDragStart={handleColumnDragStart}
                actionBegin={handleActionBegin}
                actionComplete={handleActionComplete}
                selectionSettings={{
                  type: 'Multiple',
                  persistSelection: true,
                  checkboxOnly: true,
                }}
                rowSelected={onRowSelected}
                rowDeselected={onRowDeselected}
                rowDataBound={rowDataBound}
                dataBound={onDataBound}
                cssClass={classNames(
                  !showSelectAll ? 'hide-header-checkbox' : '',
                  !checkboxSelection ? 'enable-horizontal-scroll' : ''
                )}
              >
                <ColumnsDirective>
                  {checkboxSelection && (
                    <ColumnDirective type="checkbox" width="50" freeze="Left" />
                  )}

                  <ColumnDirective field={recordPrimaryKey} isPrimaryKey={true} visible={false} />

                  {columns?.map((column, i) => {
                    return (
                      <ColumnDirective
                        key={column?.id}
                        field={column.fieldName}
                        headerText={column.headerName}
                        minWidth={column.width}
                        width={column.width}
                        freeze={column?.freeze}
                        clipMode="EllipsisWithTooltip"
                        template={column?.renderCell}
                        allowSorting={column?.canSort ?? false}
                        visible={column?.visible !== undefined ? column.visible : true}
                        allowReordering={
                          column?.canReorder !== undefined ? column.canReorder : true
                        }
                      ></ColumnDirective>
                    );
                  })}
                </ColumnsDirective>
                <Inject
                  services={[Freeze, Page, Reorder, Resize, ColumnChooser, Sort, Selection]}
                />
              </GridComponent>
            </div>

            <div
              className={classNames(
                'flex flex-row items-center justify-end space-x-3 rounded-br-md rounded-bl-md border border-r-0 border-l-0 p-2 text-xs'
              )}
            >
              {tableLegends?.length > 0 &&
                tableLegends.map((item: any) => {
                  return <div className="border-r-2 border-[#D1D1D1] px-2">{item}</div>;
                })}
              <div>
                Showing {gridData.length} of {totalCount} results
              </div>
            </div>
          </div>
        </div>

        <ColumnSettingsDrawer
          handleOnSave={updateColumnOnSave}
          gridTitle={'asdd'}
          ref={settingsRef}
        />
      </div>
    </>
  );
};

export default SyncFusionInfiniteScrollTable;
