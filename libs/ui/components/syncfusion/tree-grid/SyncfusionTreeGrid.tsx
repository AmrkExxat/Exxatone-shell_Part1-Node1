'use client';

import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import {
  TreeGridComponent,
  ColumnsDirective,
  ColumnDirective,
  Page,
  Sort,
  Filter,
  Reorder,
  Resize,
  Freeze,
  VirtualScroll,
  ColumnChooser,
  Inject,
} from '@syncfusion/ej2-react-treegrid';
import { RowDataBoundEventArgs, type RowSelectEventArgs } from '@syncfusion/ej2-grids';
import { DataManager } from '@syncfusion/ej2-data';
import { Button, Spinner, Tooltip } from '../../common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWrench } from '@fortawesome/pro-light-svg-icons';
import classNames from 'classnames';
import { registerLicense } from '@syncfusion/ej2-base';

import ColumnSettingsDrawer, {
  type ColumnSettingsFunction,
} from '../settings/ColumnSettingsDrawer';
import { SyncfusionTreeGridProps } from './types';
import TreeGridCustomAdaptor from './TreeGridCustomAdaptor';
import { gridUserInteraction } from '../utils';

registerLicense(
  'Ngo9BigBOggjHTQxAR8/V1NNaF5cXmBCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdmWXped3RdRGBfU0B0XUtWYE4='
);

const SyncfusionTreeGrid = forwardRef<TreeGridComponent, SyncfusionTreeGridProps>(
  (props: SyncfusionTreeGridProps, ref: any) => {
    const {
      columns = [],
      metaData,
      fetchData,
      children,
      height,
      configureColumns = false,
      parentMapping = 'parentItem',
      childMapping = 'children',
      pageSize = 50,
      allowReordering = true,
      allowSorting = true,
      allowMultiSorting = false,
      allowResizing = true,
      allowFiltering = false,
      allowKeyboard = true,
      allowSelection = false,
      checkboxSelection = false,
      checkboxMode = 'Default',
      checkboxSelectionType = 'Multiple',
      showSelectAll = false,
      onColumnSettingsSave,
      onCheckboxSelect,
      treeColumnIndex = 1,
      selectedIds = [],
      autoCheckHierarchy = false,
      showCheckbox = false,
      recordPrimaryKey = 'id',
      saveUserInteraction = false,
      id = '',
      interactionKey = '',
    } = props;

    const settingsRef = useRef<ColumnSettingsFunction>(null);
    const userInteraction = saveUserInteraction
      ? gridUserInteraction(id, 'get', interactionKey)
      : null;
    const [refreshing, setRefreshing] = useState(false);
    const [tableColumns, setTableColumns] = useState<any[]>(columns);
    const [selectedRowIds, setSelectedRowIds] = useState<Set<string | number>>(new Set());
    const treeGridRef = useRef<HTMLDivElement>(null);
    const [defaultSortSetting, setDefaultSortSetting] = useState<any>(() =>
      userInteraction?.sort ? { columns: [userInteraction.sort] } : null
    );

    const customAdaptorRef = useRef<TreeGridCustomAdaptor>();

    const dataManager = useMemo(() => {
      const adaptor = new TreeGridCustomAdaptor(
        metaData?.tenantId,
        fetchData,
        metaData?.filterPayload,
        {
          id,
          can: saveUserInteraction,
          interactionKey,
        },
        {
          onDataLoadStart: () => {
            setEmptyCellMessageVisibility(false);
          },
          onDataLoadEnd: () => {
            setEmptyCellMessageVisibility(true);
          },
        }
      );

      customAdaptorRef.current = adaptor;

      return new DataManager({
        url: 'https://your.api/endpoint',
        adaptor,
        crossDomain: true,
      });
    }, [metaData]);

    useEffect(() => {
      setTableColumns(columns);
    }, [columns]);

    // Remove tabindex from the tree grid container
    useEffect(() => {
      const removeTabIndex = () => {
        if (treeGridRef.current) {
          const treeGridElement = treeGridRef.current.querySelector('.e-treegrid');
          if (treeGridElement && treeGridElement.hasAttribute('tabindex')) {
            treeGridElement.removeAttribute('tabindex');
          }
        }
      };
      removeTabIndex();
      const observer = new MutationObserver(removeTabIndex);
      if (treeGridRef.current) {
        observer.observe(treeGridRef.current, { childList: true, subtree: true });
      }

      return () => {
        observer.disconnect();
      };
    }, []);

    const handleOpenSettings = () => {
      settingsRef.current?.handleDrawer({
        open: true,
        columns: [...columns],
        loading: false,
      });
    };

    const handleSaveSettings = (updatedCols: any[]) => {
      const grid = ref.current;

      if (grid) {
        setRefreshing(true);

        const gridColumns = grid.columns;

        updatedCols.forEach((col) => {
          const existing = gridColumns.find((c: any) => c.field === col.fieldName);
          if (existing) {
            existing.freeze = col.freeze;
            existing.visible = col.visible;
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

        grid.refreshColumns();
      }

      onColumnSettingsSave?.(updatedCols);
    };

    const rowDataBound = (args: RowDataBoundEventArgs) => {
      const rowElement: Element | HTMLTableRowElement | undefined = args?.row;

      const rowData: any = args?.data;

      const rowIndex: number = rowData?.index;

      const status = (rowData?.status as string)?.toLowerCase();

      const isCancelledOrRevoked = ['cancelled', 'revoked'].includes(status);

      const isDisabled = rowData?.disabled;

      const isSelected = rowData?.isSelected;

      if (!rowElement) return;

      if (isCancelledOrRevoked || isDisabled) {
        rowElement?.classList.add('row-disabled');
      }

      if (isDisabled) {
        args.isSelectable = false;

        if (checkboxSelection) {
          const checkboxCell = (rowElement as HTMLTableRowElement)?.cells?.[0];
          checkboxCell?.classList.add(
            'cursor-not-allowed',
            'pointer-event-none',
            'bg-[#ececec]',
            'row-disabled'
          );
        }
      } else if (isSelected) {
        args.isSelectable = true;

        const updatedSet = new Set(selectedRowIds);

        updatedSet.add(rowIndex);

        setSelectedRowIds(updatedSet);
      }
    };

    const userExpand = () => {
      const grid: TreeGridComponent = ref?.current;
      if (saveUserInteraction && grid) {
        const userInt = gridUserInteraction(id, 'get', interactionKey);
        if (userInt?.expandIds?.length) {
          const idx = [];
          grid?.flatData?.forEach((item: any, index: number) => {
            if (userInt.expandIds.includes(item[recordPrimaryKey])) {
              idx.push(index);
            }
          });
          idx?.forEach((index: number) => {
            const _row: any = grid?.getRowByIndex(index);
            if (_row) {
              grid?.expandRow(_row);
            }
          });
        }
      }
    };

    const onDataBound = () => {
      setRefreshing(false);

      const grid: TreeGridComponent = ref.current;
      userExpand();
      const { selectedIndexes, expandedIndexes } = getSelectedAndExpandedIndexes();

      if (selectedIndexes?.length > 0) {
        if (autoCheckHierarchy) {
          grid?.selectCheckboxes(selectedIndexes);

          selectedIndexes?.forEach((index: number) => {
            const rowData = grid?.flatData[index];

            const rowElement = grid?.getRowByIndex(index);

            const args = {
              checked: true,
              rowIndex: index,
              rowData,
              rowElement,
            };

            onCheckboxChange(args);
          });
        } else {
          grid?.selectRows(selectedIndexes);
        }
      }

      if (expandedIndexes?.length > 0) {
        expandedIndexes?.forEach((index: number) => {
          const _row: any = grid?.getRowByIndex(index);

          if (!_row) return;

          grid?.expandRow(_row);
        });
      }

      grid?.hideSpinner();
    };

    const getSelectedAndExpandedIndexes = (): {
      selectedIndexes: number[];
      expandedIndexes: number[];
    } => {
      const grid: TreeGridComponent = ref.current;

      const selectedIndexes: number[] = [];

      const expandedIndexes: number[] = [];

      grid?.flatData?.forEach((item: any, index: number) => {
        if (item?.isSelected) {
          selectedIndexes?.push(index);
        }

        if (item?.isExpanded) {
          expandedIndexes?.push(index);
        }
      });

      return {
        selectedIndexes,
        expandedIndexes,
      };
    };

    const onRowSelecting = (args: any) => {
      const selectedIndexes = ref.current?.getSelectedRowIndexes() || [];

      if (selectedIndexes.length > 0 && checkboxSelectionType === 'Single') {
        ref.current?.clearSelection();
      }
    };

    const onRowSelected = (args: RowSelectEventArgs) => {
      const rowIndex = args?.rowIndex;

      if (rowIndex === undefined) return;

      const updatedSet = new Set(selectedRowIds);

      if (checkboxSelectionType === 'Single') {
        updatedSet.clear();
      }

      updatedSet.add(rowIndex);

      setSelectedRowIds(updatedSet);

      onCheckboxSelect?.(Array.isArray(args?.data) ? args?.data : [args?.data], true);
    };

    const onRowDeselected = (args: RowSelectEventArgs) => {
      if (args?.isInteracted) {
        const rowIndex = args?.rowIndex;
        if (rowIndex === undefined) return;

        const updatedSet = new Set(selectedRowIds);
        updatedSet.delete(rowIndex);
        setSelectedRowIds(updatedSet);

        onCheckboxSelect?.([args?.data], false);
      }
    };

    const onCheckboxChange = (args: any) => {
      if (autoCheckHierarchy) {
        const { rowElement, rowData: selectedRowData, checked } = args;

        if (rowElement) {
          rowElement.classList.toggle('row-selected', checked === true);
        }

        const checkboxCell = rowElement?.getElementsByClassName('e-treegridcheckbox')?.[0];

        const checkBoxContainer = checkboxCell?.getElementsByClassName(
          'e-treecheckbox-container'
        )?.[0];

        const eCheckContainer = checkBoxContainer?.getElementsByClassName('e-check')?.[0];

        eCheckContainer?.classList?.remove('hidden-check-mark');

        const rowIndex = selectedRowData?.index;

        const updatedSet = new Set(selectedRowIds);

        const allDescendantIds: number[] =
          getAllDescendants(selectedRowData)?.map((x: any) => x?.index) ?? [];

        if (checked) {
          updatedSet.add(rowIndex);
        } else {
          updatedSet.delete(rowIndex);
        }

        allDescendantIds?.forEach((childIndex: any) => updatedSet.delete(childIndex));

        setSelectedRowIds(updatedSet);

        toggleDisableAllDescendants(selectedRowData, checked === true);

        if (args?.name === 'checkboxChange') {
          onCheckboxSelect?.(
            Array.isArray(selectedRowData) ? selectedRowData : [selectedRowData],
            checked === true
          );
        }
      }
    };

    const getAllDescendants = (record: any): any[] => {
      const _record = Array?.isArray(record) ? record?.[0] : record;

      const descendants: any[] = [];

      const traverse = (node: any) => {
        if (node?.childRecords?.length > 0) {
          node.childRecords.forEach((child: any) => {
            descendants?.push(child);
            traverse(child);
          });
        }
      };

      traverse(_record);

      return descendants;
    };

    const toggleDisableAllDescendants = (record: any, disable: boolean) => {
      const grid: TreeGridComponent = ref?.current;

      const allDescendants = getAllDescendants(record) ?? [];

      if (!allDescendants.length) return;

      const dataRows: any[] = grid?.flatData ?? [];

      const indexesToToggle = allDescendants
        .map((rowItem) =>
          dataRows.findIndex((item) => item?.[recordPrimaryKey] === rowItem?.[recordPrimaryKey])
        )
        .filter((index) => index !== -1);

      indexesToToggle?.forEach((index: number) => {
        const _row = grid?.getRowByIndex(index);

        toggleDisableStateRow(_row, disable);
      });
    };

    const toggleDisableStateRow = (_row: HTMLTableRowElement | Element, disable: boolean) => {
      if (!_row) return;

      const checkboxCell = _row?.getElementsByClassName('e-treegridcheckbox')?.[0];

      const checkBoxContainer = checkboxCell?.getElementsByClassName(
        'e-treecheckbox-container'
      )?.[0];

      const eCheckContainer = checkBoxContainer?.getElementsByClassName('e-check')?.[0];

      if (disable) {
        _row?.classList?.add('row-selected');

        checkboxCell?.classList?.add(
          'cursor-not-allowed',
          'pointer-event-none',
          'bg-primary-100',
          'row-selected'
        );

        checkBoxContainer?.classList?.add('hidden');
      } else {
        _row?.classList?.remove('row-selected');

        _row?.removeAttribute('style');

        checkboxCell?.classList.remove(
          'cursor-not-allowed',
          'pointer-event-none',
          'bg-primary-100',
          'row-selected'
        );

        eCheckContainer?.classList?.add('hidden-check-mark');

        checkBoxContainer?.classList?.remove('hidden');
      }
    };

    const setEmptyCellMessageVisibility = (isVisible: boolean = false) => {
      const grid: TreeGridComponent = ref?.current;

      const emptyRow = grid?.element?.getElementsByClassName('e-emptyrow')?.[0];

      if (emptyRow !== undefined && emptyRow !== null) {
        if (isVisible) {
          emptyRow?.setAttribute('style', 'color:#111827 !important');
        }
      }
    };

    const expandCollapseRow = (expand: boolean, rowData: any) => {
      if (!saveUserInteraction) return;

      const rowId = rowData?.data?.[recordPrimaryKey];
      if (!rowId) return;
      let userInt = gridUserInteraction(id, 'get', interactionKey) ?? {};
      let expandIds: string[] = userInt.expandIds ?? [];

      if (expand) {
        if (!expandIds.includes(rowId)) {
          expandIds = [...expandIds, rowId];
        }
      } else {
        expandIds = expandIds.filter((item) => item !== rowId);
      }
      gridUserInteraction(id, 'set', interactionKey, { ...userInt, expandIds });
    };

    return (
      <>
        {metaData?.tenantId ? (
          <div ref={treeGridRef}>
            <div className="bg-card flex w-full flex-row items-start rounded-t-md border py-2 pr-4">
              <div className="min-w-0 flex-1">{children}</div>
              <div className="mt-2 flex items-center gap-2">
                {configureColumns && (
                  <Tooltip
                    triggerElement={() => (
                      <Button
                        id="tooltip"
                        variant="basic"
                        className="focus-indicator ml-2 h-7 w-7 p-2"
                        aria-label="Configure column options"
                        onClick={handleOpenSettings}
                      >
                        <FontAwesomeIcon icon={faWrench} className="text-default h-4 w-4" />
                      </Button>
                    )}
                    tooltip={() => <div className="p-2">Configure column options</div>}
                  />
                )}
              </div>
            </div>

            <div className="control-pane">
              <div className="control-section">
                <div style={{ position: 'relative' }}>
                  <TreeGridComponent
                    ref={ref}
                    dataSource={dataManager}
                    childMapping={childMapping}
                    loadChildOnDemand={false}
                    height={height}
                    selectionSettings={{
                      checkboxMode,
                      type: checkboxSelectionType,
                      checkboxOnly: true,
                    }}
                    pageSettings={{
                      pageSize,
                      pageSizes: [50, 75, 100],
                      currentPage:
                        userInteraction?.page && typeof userInteraction.page === 'number'
                          ? userInteraction.page
                          : 1,
                      pageCount: 5,
                    }}
                    sortSettings={defaultSortSetting}
                    treeColumnIndex={treeColumnIndex}
                    allowReordering={allowReordering}
                    allowSorting={allowSorting}
                    allowResizing={allowResizing}
                    allowKeyboard={allowKeyboard}
                    allowFiltering={allowFiltering}
                    checkboxChange={onCheckboxChange}
                    allowPaging={true}
                    enableCollapseAll={true}
                    idMapping="id"
                    expanded={(e) => expandCollapseRow(true, e)}
                    collapsed={(e) => expandCollapseRow(false, e)}
                    rowSelecting={onRowSelecting}
                    rowDataBound={rowDataBound}
                    rowSelected={onRowSelected}
                    rowDeselected={onRowDeselected}
                    dataBound={onDataBound}
                    parentIdMapping={parentMapping}
                    className={classNames(
                      showSelectAll ? '' : 'hide-header-checkbox',
                      checkboxSelection ? '' : 'enable-horizontal-scroll'
                    )}
                  >
                    <ColumnsDirective>
                      {checkboxSelection && (
                        <ColumnDirective
                          type={showCheckbox ? undefined : 'checkbox'}
                          width="20"
                          freeze="Left"
                          field="checkboxField"
                          headerText=""
                          allowReordering={false}
                          showCheckbox={showCheckbox}
                        />
                      )}

                      {tableColumns.map((col, i) => (
                        <ColumnDirective
                          key={`${col.fieldName}_${i}`}
                          field={col.fieldName}
                          headerText={col.headerName}
                          minWidth={col.width}
                          width={col.width}
                          freeze={col.freeze ?? 'None'}
                          allowSorting={col.canSort ?? false}
                          visible={col.visible ?? true}
                          clipMode={col?.clipMode ?? 'EllipsisWithTooltip'}
                          template={col.renderCell}
                          showCheckbox={col?.showCheckbox}
                        />
                      ))}
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
                  </TreeGridComponent>
                </div>
              </div>

              <ColumnSettingsDrawer
                handleOnSave={handleSaveSettings}
                gridTitle="Table"
                ref={settingsRef}
              />
            </div>
          </div>
        ) : (
          <Spinner size={'md'} className="" id="sync-fusion-tree-grid-spinner" />
        )}
      </>
    );
  }
);

SyncfusionTreeGrid.displayName = 'SyncfusionTreeGrid';

export default SyncfusionTreeGrid;
