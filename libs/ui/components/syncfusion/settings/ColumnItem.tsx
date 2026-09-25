import classNames from 'classnames';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

import {
  faArrowDown,
  faArrowUp,
  faEye,
  faEyeSlash,
  faGripVertical,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Select } from '../../common';

const ColumnItem = ({
  column,
  onToggleVisibility = () => {},
  onMoveUp = () => {},
  onMoveDown = () => {},
  isFirst,
  isLast,
  handleFreezePositionChange = (c: any, i: number, pos: any) => {},
  index,
}: any) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column?.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div
        role="row"
        className={classNames(
          'bg-card group mb-2 flex items-center rounded-md border p-3 shadow-sm',
          'hover:border-primary/30 transition-all duration-200'
        )}
      >
        <div
          className="mr-3 cursor-grab text-gray-400 hover:text-gray-600 active:cursor-grabbing"
          {...attributes}
          {...listeners}
          tabIndex={-1}
          aria-hidden="true"
        >
          <FontAwesomeIcon icon={faGripVertical} size="20" />
        </div>

        <div className="flex-1 font-medium uppercase" role="gridcell">
          {column?.headerName}
        </div>

        <div className="flex items-center gap-8 space-x-4" role="gridcell">
          <div className="flex flex-col space-x-4">
            <div className="flex flex-row justify-center gap-1">
              <Button
                id={`${column?.headerName}_up`}
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onMoveUp(column.id, index)}
                disabled={isFirst || column?.freeze !== 'None'}
                aria-label={`Move ${column?.headerName} column up`}
              >
                <FontAwesomeIcon icon={faArrowUp} className="h-4 w-4" />
              </Button>

              <Button
                id={`${column?.headerName}_down`}
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onMoveDown(column.id, index)}
                disabled={isLast || column?.freeze !== 'None'}
                aria-label={`Move ${column?.headerName} column down`}
              >
                <FontAwesomeIcon icon={faArrowDown} className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex w-[200px] flex-col space-y-1" role="gridcell">
            <Select
              name={`freezePosition_${index}`}
              defaultValue={column?.freeze ?? 'None'}
              options={[
                {
                  value: 'Left',
                  label: 'Left',
                  id: `left_position_${index}`,
                },
                {
                  value: 'Right',
                  label: 'Right',
                  id: `right_position_${index}`,
                },
                {
                  value: 'Fixed',
                  label: 'Fixed',
                  id: `center_position_${index}`,
                },
                {
                  value: 'None',
                  label: 'None',
                  id: `no_position_${index}`,
                },
              ]}
              disabled={column?.visible === false}
              hidden={false}
              onChange={(pos) => handleFreezePositionChange(column, index, pos)}
              labelledby={`Freeze position ${column?.headerName} ${column?.freeze || 'None'}`}
            />
          </div>

          <div className="flex flex-col space-y-1" role="gridcell">
            <Button
              size="md"
              variant="basic"
              className="h-6 w-6"
              onClick={() => onToggleVisibility(column, index)}
              disabled={column?.freeze !== 'None'}
              aria-label={`${column?.visible ? 'Hide' : 'Show'} ${column.headerName} column`}
            >
              <FontAwesomeIcon icon={column?.visible ? faEye : faEyeSlash} className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColumnItem;
