import classNames from 'classnames';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

import {
  faArrowDown,
  faArrowUp,
  faEye,
  faEyeSlash,
  faGripVertical,
  faThumbTack,
  faThumbTackSlash,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../Buttons/Button';

const ColumnItem = ({
  column,
  onToggleVisibility = () => {},
  onMoveUp = () => {},
  onMoveDown = () => {},
  isFirst,
  isLast,
  onColumnPin = () => {},
  columnOptions,
  index,
  isPinningAllowed,
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
        role="listitem"
        className={classNames(
          'group bg-card mb-2 flex items-center rounded-md border p-3 shadow-sm',
          'hover:border-primary/30 transition-all duration-200'
        )}
      >
        <div
          className="mr-3 cursor-grab text-gray-400 hover:text-gray-600 active:cursor-grabbing"
          {...attributes}
          {...listeners}
          tabIndex={-1}
        >
          <FontAwesomeIcon icon={faGripVertical} size="20" />
        </div>

        <div className="flex-1 font-medium uppercase">{column?.headerName}</div>

        <div className="flex items-center space-x-2">
          <div className="flex flex-col space-y-1">
            <Button
              id={`${column?.headerName}_up`}
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onMoveUp(column.id, index)}
              disabled={isFirst}
              aria-label={`Move ${column?.headerName} column up`}
            >
              <FontAwesomeIcon icon={faArrowUp} />
            </Button>

            <Button
              id={`${column?.headerName}_down`}
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onMoveDown(column.id, index)}
              disabled={isLast}
              aria-label={`Move ${column?.headerName} column down`}
            >
              <FontAwesomeIcon icon={faArrowDown} className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-col space-y-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onColumnPin(column, index)}
              disabled={!isPinningAllowed || column?.visible === false}
              aria-label={
                column?.isSticky
                  ? `Unpin ${column?.headerName} column`
                  : `Pin ${column?.headerName} column`
              }
            >
              <FontAwesomeIcon
                icon={column?.isSticky ? faThumbTack : faThumbTackSlash}
                className="h-4 w-4"
              />
            </Button>
          </div>

          <div className="flex flex-col space-y-1">
            <Button
              size="md"
              variant="basic"
              className="h-6 w-6"
              onClick={() => onToggleVisibility(column, index)}
              disabled={column?.isSticky ? true : false}
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
