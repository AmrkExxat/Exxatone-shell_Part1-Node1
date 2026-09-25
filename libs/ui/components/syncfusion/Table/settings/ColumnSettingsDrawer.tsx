import React, { useState } from 'react';

import ColumnItem from './ColumnItem';
import Button from '../../../common/Buttons/Button';
import Drawer from '../../../layout/Drawer/Drawer';
import {
  closestCenter,
  DndContext,
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
} from '@dnd-kit/sortable';
import classNames from 'classnames';

export interface ColumnSettingsFunction {
  handleDrawer: (data: any) => void;
  closeDrawer: () => void;
}

const ColumnSettingsDrawer = React.forwardRef(
  (
    { handleOnSave, gridTitle }: { handleOnSave: (columns: any) => void; gridTitle: string },
    ref: any
  ) => {
    const [state, setState] = useState<{
      open: boolean;
      columns: null | [];
      loading: boolean;
    }>({
      open: false,
      columns: null,
      loading: false,
    });
    const [columnOptions, setColumnOptions] = useState<{
      canPin: boolean;
      canEdit: boolean;
    }>({
      canPin: true,
      canEdit: true,
    });

    const [initialColOptions, setInitialColOptions] = useState();
    const [ariaLiveMessage, setAriaLiveMessage] = useState('');
    const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
    );

    const handleDrawer = (data: any): void => {
      setState({
        open: true,
        columns: data.columns,
        loading: false,
      });
      setInitialColOptions(data.columns);
    };

    const closeDrawer = (): void => {
      setState({ open: false, columns: null, loading: true });
    };

    React.useImperativeHandle(ref, (): ColumnSettingsFunction => {
      return {
        handleDrawer,
        closeDrawer,
      };
    });

    const onMoveDown = (column, index) => {
      const columns = state?.columns;
      [columns[index], columns[index + 1]] = [columns[index + 1], columns[index]];
      setState({ ...state, columns });

      const length = columns?.length;
      if (index === length - 2) {
        document.getElementById(`${columns?.[index + 1]?.headerName}_up`)?.focus();
      }

      setTimeout(() => {
        setAriaLiveMessage(`Position ${index + 2} ${columns?.[index + 1]?.headerName}`);
      }, 100);
    };

    const onMoveUp = (column, index) => {
      const columns = state?.columns;
      [columns[index - 1], columns[index]] = [columns[index], columns[index - 1]];
      setState({ ...state, columns });

      if (index == 1) {
        document.getElementById(`${columns?.[0]?.headerName}_down`)?.focus();
      }

      setTimeout(() => {
        setAriaLiveMessage(`Position ${index} ${columns?.[index - 1]?.headerName}`);
      }, 100);
    };

    const onToggleVisibility = (column, index): void => {
      const columns: any = state?.columns;
      columns[index].visible = !column?.visible;
      setState({ ...state, columns });
    };

    const handleFreezePositionChange = (column, index, value): void => {
      const columns: any = state?.columns;
      columns[index].freeze = value;
      setState({ ...state, columns });
    };

    const handleDragEnd = (event) => {
      const { active, over } = event;
      if (active.id !== over?.id) {
        const oldIndex = state?.columns?.findIndex((c) => c.id === active.id);
        const newIndex = state?.columns?.findIndex((c) => c.id === over.id);
        const newItems = arrayMove(state?.columns, oldIndex, newIndex);
        setState({ ...state, columns: newItems });
      }
    };

    return (
      <Drawer
        drawerOpen={state?.open}
        size="medium"
        drawer={{
          title: 'Configure Column options',
          onClose: () => {
            setState({ ...state, columns: initialColOptions });
            closeDrawer();
          },
        }}
        actionButtons={
          <>
            <Button
              aria-label="save configured column options"
              id={`${gridTitle}_column_settings_drawer_save_btn`}
              testid={`${gridTitle}_column_settings_drawer_save_btn`}
              onClick={() => {
                handleOnSave(state?.columns);
                closeDrawer();
              }}
            >
              Save
            </Button>
          </>
        }
      >
        <div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={state?.columns || []} strategy={verticalListSortingStrategy}>
              <div role="list">
                <div
                  role="listitem"
                  className={classNames(
                    'group mb-2 flex items-center p-3 pr-1 font-semibold shadow-sm'
                  )}
                >
                  <div className="flex-1">Columns</div>

                  <div className="flex w-[392px] items-center">
                    <div className="flex w-[100px]">Order</div>

                    <div className="flex w-[200px] items-center justify-center">
                      Freeze Position
                    </div>

                    <div className="flex w-[92px] items-end justify-end">Visibility</div>
                  </div>
                </div>

                {state?.columns?.map((column: any, index: number) => {
                  const isFirst = index == 0;
                  const isLast = index == state.columns.length - 1;

                  column.freeze = column?.freeze !== undefined ? column?.freeze : 'None';

                  column.visible = column.visible !== undefined ? column?.visible : true;

                  return (
                    <ColumnItem
                      key={column?.id}
                      id={column?.id}
                      column={column}
                      index={index}
                      columnOptions={columnOptions}
                      onMoveUp={onMoveUp}
                      onMoveDown={onMoveDown}
                      onToggleVisibility={onToggleVisibility}
                      isFirst={isFirst}
                      handleFreezePositionChange={handleFreezePositionChange}
                      isLast={isLast}
                    >
                      {column}
                    </ColumnItem>
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
          <div
            role="status"
            aria-live="polite"
            className="sr-only"
            aria-label={ariaLiveMessage}
          ></div>
        </div>
      </Drawer>
    );
  }
);
export default ColumnSettingsDrawer;
