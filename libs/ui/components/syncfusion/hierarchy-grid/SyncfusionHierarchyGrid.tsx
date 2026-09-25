'use client';

import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import {
  ColumnChooser,
  ColumnDirective,
  type ColumnModel,
  ColumnsDirective,
  Filter,
  Freeze,
  GridComponent,
  DetailRow,
  Inject,
  Page,
  Reorder,
  Resize,
  type RowSelectEventArgs,
  Sort,
  VirtualScroll,
} from '@syncfusion/ej2-react-grids';
import { DataManager, Query } from '@syncfusion/ej2-data';
import CustomAdaptor from './HierarchyRemoteAdaptor';

import { registerLicense } from '@syncfusion/ej2-base';

import { Button, Spinner } from '../../common';

import classNames from 'classnames';
import { type SyncfusionHierarchyGridProps } from './types';

import Tooltip from '../../common/Tooltip/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWrench } from '@fortawesome/pro-light-svg-icons';
import ColumnSettingsDrawer, {
  type ColumnSettingsFunction,
} from '../settings/ColumnSettingsDrawer';
import { gridUserInteraction } from '../utils';

registerLicense(
  'Ngo9BigBOggjHTQxAR8/V1NNaF5cXmBCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdmWXped3RdRGBfU0B0XUtWYE4='
);

const SyncfusionHierarchyGrid = forwardRef<GridComponent, SyncfusionHierarchyGridProps>(
  (props, ref) => {
    const {
      children,
      metaData,
      fetchData,
      fetchChildData,
      columns,
      childGridColumns = [],
      pageSize = 50,
      allowReordering = true,
      allowSorting = true,
      allowResizing = true,
      allowPaging = true,
      allowFiltering = false,
      allowKeyboard = true,
      checkboxSelection = false,
      configureColumns,
      onCheckboxSelect,
      onColumnSettingsSave,
      clearSelectedRows,
      showSelectAll = false,
      pageName,
      gridHeight = 400,
      recordPrimaryKey = 'id',
      tableLegends = [],
      traverseChildren = false,
      onChildGridCheckboxSelect,
      onChildGridCheckboxDeselect,
      saveUserInteraction = false,
      interactionKey = '',
      id = '',
    } = props;

    const settingsRef = React.useRef<ColumnSettingsFunction>();
    const userInteraction = saveUserInteraction
      ? gridUserInteraction(id, 'get', interactionKey)
      : null;
    const [childGrid, setChildGrid] = useState<any>(null);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [tableColumns, setTableColumns] = useState<any>(columns || []);
    const [selectedRowIds, setSelectedRowIds] = useState(new Set([10, 1, 0, 7, 40]));
    const [defaultSortSetting, setDefaultSortSetting] = useState<any>(() =>
      userInteraction?.sort ? { columns: [userInteraction.sort] } : null
    );
    const [paginationSettings, setPaginationSettings] = useState({
      pageSize: 50,
      pageCount: 5,
      pageSizes: ['50', '75', '100'],
      currentPage:
        userInteraction?.page && typeof userInteraction.page === 'number'
          ? userInteraction.page
          : 1,
      startPage: 1,
    });

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
            onDataLoadEnd: () => {
              setEmptyCellMessageVisibility(true);
            },
          }
        ),
        crossDomain: true,
      });
    }, [metaData]);

    useEffect(() => {
      setTableColumns(columns);
    }, [columns]);

    useEffect(() => {
      const grid = ref.current;
      if (!grid || !saveUserInteraction) return;

      const handler = (ev: Event) => {
        if (!grid.element.contains(ev.target as Node)) return;

        const target = (ev.target as HTMLElement).closest(
          '.e-detailrowcollapse, .e-detailrowexpand'
        );
        if (!target) return;

        const row = (target as HTMLElement).closest('tr.e-row');
        if (!row) return;

        const info = grid.getRowInfo(row as HTMLElement);
        const pk = info?.rowData?.[recordPrimaryKey];
        if (!pk) return;

        setTimeout(() => {
          const expanded = target.getAttribute('aria-expanded') === 'true';

          let userInt = gridUserInteraction(id, 'get', interactionKey) ?? {};
          let expandIds: string[] = userInt?.expandIds ?? [];

          const alreadyExpanded = expandIds.includes(pk);
          let changed = false;

          if (expanded && !alreadyExpanded) {
            expandIds = [...expandIds, pk];
            changed = true;
          } else if (!expanded && alreadyExpanded) {
            expandIds = expandIds.filter((item) => item !== pk);
            changed = true;
          }

          if (changed) {
            gridUserInteraction(id, 'set', interactionKey, {
              ...userInt,
              expandIds,
            });
          }
        });
      };

      grid.element.addEventListener('click', handler);
      return () => grid.element.removeEventListener('click', handler);
    }, [ref, recordPrimaryKey]);

    useEffect(() => {
      const _childGrid = {
        queryString: 'id',
        allowPaging: false,
        allowReordering: false,
        selectionSettings: {
          type: 'Multiple',
          checkboxOnly: true,
          persistSelection: true,
        },
        rowSelected: (args: any) => {
          onChildGridCheckboxSelect?.(args);
        },
        rowDeselected: (args: any) => {
          onChildGridCheckboxDeselect?.(args);
        },
        rowDataBound: (args: any) => {
          onRowDataBound(args);
        },
        dataSource: [],
        pageSettings: {
          pageSize,
          pageSizes: [50, 75, 100],
          currentPage: 1,
          pageCount: 5,
        },
        columns: childGridColumns,
      };

      setChildGrid(_childGrid);
    }, [childGridColumns]);

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

      onCheckboxSelect?.([args?.data], true);
    };

    const onRowDeselected = (args: any) => {
      const rowIndex = args?.rowIndex;
      const updatedSet = new Set(selectedRowIds);
      updatedSet.delete(rowIndex);
      setSelectedRowIds(updatedSet);

      onCheckboxSelect?.([args?.data], false);
    };

    const handleOnActionBegin = (args: any) => {
      if (args?.requestType === 'refresh') {
        setRefreshing(true);
      }

      if (args.requestType === 'sorting') {
        clearSelectedRows && clearSelectedRows(true);
      }
    };

    const handleOnActionComplete = (args: any) => {
      if (args?.requestType === 'refresh') {
        setRefreshing(false);
      }
    };

    const onRowSelecting = (args) => {
      if (args.data.hasChildren && traverseChildren) {
      }
    };

    const rowDataBound = (args: any) => {
      onRowDataBound(args);
    };

    const onRowDataBound = (args: any) => {
      const row: HTMLTableRowElement | undefined = args?.row;
      const status = (args?.data?.status as string)?.toLowerCase();
      const isCancelledOrRevoked = ['cancelled', 'revoked'].includes(status);
      const isDisabled = args?.data?.disabled;
      const isSelected = args?.data?.isSelected;

      const rowType = args?.data?.rowType;

      const memberType = args?.data?.memberType;

      if (!row) return;

      if (rowType === 'parent' || memberType === 'faculty') {
        row.classList.add('bg-gray-100');
      } else {
        row.classList.add('bg-card');
      }

      if (isCancelledOrRevoked) {
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

    const userExpand = () => {
      const grid = ref?.current as GridComponent;
      if (!saveUserInteraction || !grid) return;

      const userInt = gridUserInteraction(id, 'get', interactionKey);
      const expandIds: string[] = userInt?.expandIds ?? [];
      if (!expandIds.length) return;

      const expandSet = new Set(expandIds); // O(1) lookups

      let rows = grid.getRows() ?? [];

      rows =
        rows?.filter((x: Element) => !Array?.from(x?.classList)?.includes('e-detailrow')) ?? [];

      rows?.forEach((rowEl, index) => {
        const row = grid.getRowInfo(rowEl);
        const pk = row?.rowData?.[recordPrimaryKey];
        if (pk && expandSet.has(pk)) {
          console.log(pk, index);
          grid.detailRowModule?.expand(index);
        }
      });
    };

    const onDataBound = () => {
      const grid = ref?.current;

      if (!grid) {
        setRefreshing(false);
        return;
      }

      const rootElement = grid.getRootElement?.();
      const contentElement = grid.getContent?.();

      const toggleColumnHeader = rootElement?.querySelector('.e-detailheadercell');
      const toggleColumns = contentElement?.getElementsByClassName('e-detailrowcollapse') || [];

      const hasFrozenColumn = columns?.some((col: any) => ['Left', 'Fixed'].includes(col?.freeze));

      if (hasFrozenColumn) {
        toggleColumnHeader?.classList?.add('left-sticky-column');

        Array.from(toggleColumns).forEach((el: any) => {
          el?.classList?.add('left-sticky-column');
        });
      }

      setRefreshing(false);
      userExpand();
    };

    const onDetailDataBound = async (args) => {
      const childData = await fetchChildData(args?.data);

      args.childGrid.query = new Query();
      args.childGrid.dataSource = childData?.data ?? [];
    };

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
              height={gridHeight}
              childGrid={childGrid}
              dataSource={dataManager}
              allowPaging={allowPaging}
              allowResizing={allowResizing}
              allowReordering={allowReordering}
              allowKeyboard={allowKeyboard}
              allowSorting={allowSorting}
              allowFiltering={allowFiltering}
              sortSettings={defaultSortSetting}
              actionBegin={handleOnActionBegin}
              actionComplete={handleOnActionComplete}
              loadingIndicator={{ indicatorType: 'Spinner' }}
              rowSelecting={onRowSelecting}
              rowSelected={onRowSelected}
              rowDeselected={onRowDeselected}
              rowDataBound={rowDataBound}
              detailDataBound={onDetailDataBound}
              dataBound={onDataBound}
              selectionSettings={{
                type: 'Multiple',
                persistSelection: true,
                checkboxOnly: true,
              }}
              pageSettings={paginationSettings}
              cssClass={classNames(
                showSelectAll ? '' : 'hide-header-checkbox',
                checkboxSelection ? '' : 'enable-horizontal-scroll'
              )}
            >
              <ColumnsDirective>
                {checkboxSelection && (
                  <ColumnDirective type="checkbox" width="50" freeze="Left" field="checkboxField" />
                )}

                <ColumnDirective field={recordPrimaryKey} isPrimaryKey={true} visible={false} />

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
                      clipMode={column?.clipMode ?? 'EllipsisWithTooltip'}
                      template={column?.renderCell}
                    ></ColumnDirective>
                  );
                })}
              </ColumnsDirective>
              <Inject
                services={[
                  DetailRow,
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

SyncfusionHierarchyGrid.displayName = 'SyncfusionHierarchyGrid';

export default SyncfusionHierarchyGrid;
