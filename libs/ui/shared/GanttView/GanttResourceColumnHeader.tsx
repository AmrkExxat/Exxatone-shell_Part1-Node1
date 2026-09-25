/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useEffect, useState, type RefObject } from 'react';

import { type GanttComponent } from '@syncfusion/ej2-react-gantt';
import { faSquareCaretLeft, faSquareCaretRight } from '@fortawesome/pro-light-svg-icons';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const GanttResourceColumnHeader = ({
  ganttSchedulerRef,
  title,
}: {
  ganttSchedulerRef: RefObject<GanttComponent>;
  title: string;
}): JSX.Element => {
  const [splitterCollapsed, setSplitterCollapsed] = useState<boolean>(false);

  const handleOnSplitterToggle = () => {
    setSplitterCollapsed(!splitterCollapsed);
  };

  useEffect(() => {
    if (splitterCollapsed) {
      ganttSchedulerRef?.current?.setSplitterPosition('2%', 'position');
    } else {
      ganttSchedulerRef?.current?.setSplitterPosition(1, 'columnIndex');
    }
  }, [ganttSchedulerRef, splitterCollapsed]);

  return (
    <div
      className={classNames(
        'mt-1 flex w-full flex-row items-center justify-between',
        splitterCollapsed ? 'px-2' : 'pr-2 pl-4'
      )}
    >
      {!splitterCollapsed && <span className="text-[10px] font-semibold capitalize">{title}</span>}

      <FontAwesomeIcon
        id="schedules_timeline_splitter_toggle_btn"
        testid="schedules_timeline_splitter_toggle_btn"
        tabIndex={0}
        aria-label="toggle left sidebar"
        icon={splitterCollapsed ? faSquareCaretRight : faSquareCaretLeft}
        onClick={handleOnSplitterToggle}
        className="text-default h-4 w-4 cursor-pointer"
      />
    </div>
  );
};

export default GanttResourceColumnHeader;
