'use client';

import React, { useCallback, useEffect, useMemo, useState, memo, useRef } from 'react';
import {
  Column,
  ColumnOrderState,
  ColumnPinningState,
  VisibilityState,
} from '@tanstack/react-table';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGripVertical,
  faArrowUp,
  faArrowDown,
  faEye,
  faEyeSlash,
  faXmark,
} from '@fortawesome/pro-solid-svg-icons';
import { FocusTrap } from 'focus-trap-react';

type PinPosition = 'left' | 'right' | 'fixed' | 'none';

type ColumnConfig = {
  id: string;
  label: string;
  pinPosition: PinPosition;
  visible: boolean;
  disableColumnConfig: boolean;
};

interface ColumnConfigItemProps {
  column: ColumnConfig;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onMove: (index: number, columnId: string, direction: 'up' | 'down') => void;
  onToggleVisibility: (index: number) => void;
  onPinPositionChange: (index: number, position: PinPosition) => void;
}

const isPinned = (pinPosition: PinPosition) =>
  pinPosition === 'left' || pinPosition === 'right' || pinPosition === 'fixed';

const ColumnConfigItem = memo(
  ({
    column,
    index,
    isFirst,
    isLast,
    onMove,
    onToggleVisibility,
    onPinPositionChange,
  }: ColumnConfigItemProps) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
      id: column.id,
    });

    const style = useMemo(
      () => ({
        transform: CSS.Transform.toString(transform),
        transition: isDragging ? 'none' : transition,
        opacity: isDragging ? 0.9 : 1,
      }),
      [transform, transition, isDragging]
    );

    const pinned = isPinned(column.pinPosition);

    return (
      <div
        ref={setNodeRef}
        style={style}
        className="column-settings-card bg-card grid grid-cols-[40px_minmax(0,1fr)_52px_88px_32px] items-center gap-3 rounded-lg border border-gray-200 p-3 transition-all duration-150 hover:bg-gray-50"
      >
        <button
          type="button"
          className={`focus-indicator col-start-1 flex h-8 w-10 flex-shrink-0 items-center justify-center text-gray-400 ${pinned ? 'cursor-default opacity-50' : 'cursor-grab hover:text-gray-600 active:cursor-grabbing'}`}
          {...(pinned ? {} : { ...attributes, ...listeners })}
          aria-label={pinned ? `${column.label} (pinned – order locked)` : `Drag ${column.label}`}
          disabled={pinned}
        >
          <FontAwesomeIcon icon={faGripVertical} className="text-base" />
        </button>

        <span className="col-start-2 min-w-0 truncate text-sm font-medium text-gray-700 uppercase">
          {column.label}
        </span>

        <div className="col-start-3 flex flex-shrink-0 gap-1">
          <button
            type="button"
            id={`column_${column.id}_move-up`}
            onClick={() => {
              onMove(index, column.id, 'up');
            }}
            disabled={isFirst || pinned}
            className="focus-indicator rounded p-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label={`Move ${column.label} up`}
            title={pinned ? 'Pinned columns stay in place' : 'Move up'}
          >
            <FontAwesomeIcon icon={faArrowUp} className="text-xs" />
          </button>
          <button
            type="button"
            id={`column_${column.id}_move-down`}
            onClick={() => onMove(index, column.id, 'down')}
            disabled={isLast || pinned}
            className="focus-indicator rounded p-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label={`Move ${column.label} down`}
            title={pinned ? 'Pinned columns stay in place' : 'Move down'}
          >
            <FontAwesomeIcon icon={faArrowDown} className="text-xs" />
          </button>
        </div>

        <select
          value={column.pinPosition}
          onChange={(e) => onPinPositionChange(index, e.target.value as PinPosition)}
          disabled={!column.visible || column.disableColumnConfig}
          className="focus-indicator bg-card col-start-4 w-full min-w-0 appearance-none rounded border border-gray-300 px-2 py-1.5 pr-6 text-xs text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={`Freeze position for ${column.label}${column.disableColumnConfig ? ' (locked)' : ''}`}
          title={column.disableColumnConfig ? 'Column config is locked' : undefined}
        >
          <option value="none">None</option>
          <option value="left">Left</option>
          <option value="right">Right</option>
          <option value="fixed">Fixed</option>
        </select>

        <button
          type="button"
          onClick={() => !column.disableColumnConfig && onToggleVisibility(index)}
          disabled={column.disableColumnConfig}
          className={`focus-indicator col-start-5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded p-1.5 transition-colors ${
            column.disableColumnConfig
              ? 'cursor-not-allowed text-gray-300'
              : column.visible
                ? 'text-blue-500 hover:bg-blue-50'
                : 'text-gray-400 hover:bg-gray-100'
          }`}
          aria-label={column.visible ? `Hide ${column.label}` : `Show ${column.label}`}
          aria-pressed={column.visible}
          title={
            column.disableColumnConfig
              ? 'Column config is locked'
              : column.visible
                ? 'Hide column'
                : 'Show column'
          }
        >
          <FontAwesomeIcon icon={column.visible ? faEye : faEyeSlash} className="text-sm" />
        </button>
      </div>
    );
  }
);

ColumnConfigItem.displayName = 'ColumnConfigItem';

export interface ColumnSettingsDrawerProps {
  isOpen: boolean;
  columns: Column<any, any>[];
  columnVisibility: VisibilityState;
  columnPinning: ColumnPinningState & { fixed?: string[] };
  columnOrder: ColumnOrderState;
  onClose: () => void;
  onSave: (config: {
    columnOrder: ColumnOrderState;
    columnPinning: ColumnPinningState & { fixed?: string[] };
    columnVisibility: VisibilityState;
  }) => void;
}

export const ColumnSettingsDrawer = memo(
  ({
    isOpen,
    columns,
    columnVisibility,
    columnPinning,
    columnOrder,
    onClose,
    onSave,
  }: ColumnSettingsDrawerProps) => {
    const [localColumns, setLocalColumns] = useState<ColumnConfig[]>([]);
    const drawerRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef(null);

    const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
    );

    useEffect(() => {
      if (!isOpen) return;

      const getPinPosition = (columnId: string): PinPosition => {
        if (columnPinning.left?.includes(columnId)) return 'left';
        if (columnPinning.right?.includes(columnId)) return 'right';
        if (columnPinning.fixed?.includes(columnId)) return 'fixed';
        return 'none';
      };

      const regularColumns = columns.filter((col) => !col.id.startsWith('__'));
      const nonSpecialColumnOrder = columnOrder.filter((id) => !id.startsWith('__'));
      const allColumnIds = regularColumns.map((col) => col.id);

      const orderedColumnIds = [
        ...nonSpecialColumnOrder.filter((id) => allColumnIds.includes(id)),
        ...allColumnIds.filter((id) => !nonSpecialColumnOrder.includes(id)),
      ];

      const config = orderedColumnIds
        .map((id) => regularColumns.find((col) => col.id === id))
        .filter(Boolean)
        .map((column) => {
          const def = column!.columnDef as { disableColumnConfig?: boolean };
          return {
            id: column!.id,
            label:
              typeof column!.columnDef.header === 'string' ? column!.columnDef.header : column!.id,
            pinPosition: getPinPosition(column!.id),
            visible: columnVisibility[column!.id] !== false,
            disableColumnConfig: def.disableColumnConfig === true,
          };
        });

      setLocalColumns(config);
      closeButtonRef.current?.focus();
    }, [isOpen, columns, columnVisibility, columnPinning, columnOrder]);

    const handleDragEnd = useCallback((event: any) => {
      const { active, over } = event;
      if (active.id === over?.id) return;

      setLocalColumns((items) => {
        const draggedItem = items.find((c) => c.id === active.id);
        // Only block dragging if the dragged column itself is pinned
        if (draggedItem && isPinned(draggedItem.pinPosition)) return items;

        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return items;

        return arrayMove(items, oldIndex, newIndex);
      });
    }, []);

    const handleMove = useCallback((index: number, columnId: string, direction: 'up' | 'down') => {
      setLocalColumns((items) => {
        const newItems = [...items];
        if (
          (direction === 'up' && index <= 0) ||
          (direction === 'down' && index >= items.length - 1)
        ) {
          return items;
        }
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        [newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]];
        setTimeout(() => {
          const newIndex = newItems.findIndex((c) => c.id === columnId);
          if (newIndex === -1) return;

          const isNowFirst = newIndex === 0;
          const isNowLast = newIndex === newItems.length - 1;

          const buttonId = isNowFirst
            ? `column_${columnId}_move-down`
            : isNowLast
              ? `column_${columnId}_move-up`
              : `column_${columnId}_move-${direction}`;

          const el = document.getElementById(buttonId) as HTMLElement | null;
          if (el) {
            el?.focus();
            el?.scrollIntoView({ block: 'nearest' });
          }
        }, 0);

        return newItems;
      });
    }, []);

    const handleToggleVisibility = useCallback((index: number) => {
      setLocalColumns((items) => {
        const newItems = [...items];
        const newVisibility = !newItems[index].visible;
        newItems[index] = {
          ...newItems[index],
          visible: newVisibility,
          pinPosition: newVisibility ? newItems[index].pinPosition : 'none',
        };
        return newItems;
      });
    }, []);

    const handlePinPositionChange = useCallback((index: number, position: PinPosition) => {
      setLocalColumns((items) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], pinPosition: position };
        return newItems;
      });
    }, []);

    const handleSave = useCallback(() => {
      const newColumnOrder = localColumns.map((col) => col.id);
      const specialLeftPinned = columnPinning.left?.filter((id) => id.startsWith('__')) || [];
      const specialRightPinned = columnPinning.right?.filter((id) => id.startsWith('__')) || [];

      const newColumnPinning = {
        left: [
          ...specialLeftPinned,
          ...localColumns
            .filter((col) =>
              col.disableColumnConfig
                ? columnPinning.left?.includes(col.id)
                : col.pinPosition === 'left' && col.visible
            )
            .map((col) => col.id),
        ],
        right: [
          ...localColumns
            .filter((col) =>
              col.disableColumnConfig
                ? columnPinning.right?.includes(col.id)
                : col.pinPosition === 'right' && col.visible
            )
            .map((col) => col.id),
          ...specialRightPinned,
        ],
        fixed: localColumns
          .filter((col) =>
            col.disableColumnConfig
              ? columnPinning.fixed?.includes(col.id)
              : col.pinPosition === 'fixed' && col.visible
          )
          .map((col) => col.id),
      };

      const newColumnVisibility: VisibilityState = {};
      localColumns.forEach((col) => {
        newColumnVisibility[col.id] = col.disableColumnConfig
          ? columnVisibility[col.id] !== false
          : col.visible;
      });

      onSave({
        columnOrder: newColumnOrder,
        columnPinning: newColumnPinning,
        columnVisibility: newColumnVisibility,
      });

      onClose();
    }, [localColumns, onSave, onClose, columnPinning, columnVisibility]);

    if (!isOpen) {
      return null;
    }

    return (
      <FocusTrap
        active
        focusTrapOptions={{
          initialFocus: false,
          allowOutsideClick: true,
          clickOutsideDeactivates: true,
          fallbackFocus: closeButtonRef.current || undefined,
        }}
      >
        <div>
          <div
            className="fixed inset-0 z-50 bg-black opacity-50 transition-opacity duration-300"
            onClick={onClose}
            aria-hidden="true"
          />

          <div
            ref={drawerRef}
            className="fixed top-0 right-0 z-50 flex h-full w-max max-w-[90vw] min-w-[500px] translate-x-0 flex-col bg-gray-50 shadow-2xl transition-transform duration-300 ease-in-out"
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
          >
            <div className="bg-card sticky top-0 z-10 border-b border-gray-200 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <button
                    id="close_settings_drawer_btn"
                    ref={closeButtonRef}
                    type="button"
                    onClick={onClose}
                    className="focus-indicator flex-shrink-0 rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                    aria-label="Close drawer"
                  >
                    <FontAwesomeIcon icon={faXmark} className="text-xl" />
                  </button>
                  <h2
                    id="drawer-title"
                    className="min-w-0 truncate text-lg font-semibold text-gray-900"
                  >
                    Configure Column options
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleSave}
                  className="focus-indicator rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="column-settings-header mb-2 grid grid-cols-[40px_minmax(0,1fr)_52px_88px_32px] items-center gap-3 border-b border-gray-200 px-3 pb-3">
                <span className="col-start-1" aria-hidden="true" />
                <span className="col-start-2 min-w-0 text-xs font-semibold tracking-wide text-gray-600 uppercase">
                  Column
                </span>
                <span className="col-start-3 text-xs font-semibold tracking-wide text-gray-600 uppercase">
                  Order
                </span>
                <span className="col-start-4 text-xs font-semibold tracking-wide text-gray-600 uppercase">
                  Freeze
                </span>
                <span className="col-start-5 text-center text-xs font-semibold tracking-wide text-gray-600 uppercase">
                  Show
                </span>
              </div>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={localColumns.map((col) => col.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2" role="list" aria-label="Column configurations">
                    {localColumns.map((column, index) => (
                      <ColumnConfigItem
                        key={column.id}
                        column={column}
                        index={index}
                        isFirst={index === 0}
                        isLast={index === localColumns.length - 1}
                        onMove={handleMove}
                        onToggleVisibility={handleToggleVisibility}
                        onPinPositionChange={handlePinPositionChange}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </div>
        </div>
      </FocusTrap>
    );
  }
);

ColumnSettingsDrawer.displayName = 'ColumnSettingsDrawer';
