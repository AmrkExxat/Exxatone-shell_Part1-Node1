/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/display-name */
import { useMemo, useState, forwardRef, type RefObject, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { type GanttComponent } from '@syncfusion/ej2-react-gantt';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronLeft, faChevronRight } from '@fortawesome/pro-light-svg-icons';
import moment from 'moment';
import { CalendarViewMode, ResourceViewMode } from '../../components/common/GanttScheduler';
import { Button, ToggleGroupButton } from '../../components/common';

export interface ToolbarDatepickerInputProps {
  value?: string;
  onClick?: () => void;
}

export interface onChangeEventType {
  selectedCalendarView: CalendarViewMode;
  selectedResourceView: ResourceViewMode;
  selectedDate: Date;
}

const calendarViewToggleOptions = [
  {
    id: 'Month',
    label: 'Month',
    value: 'Month',
  },
  {
    id: 'Week',
    label: 'Week',
    value: 'Week',
  },
  // {
  //   id: "Day",
  //   label: "Day",
  //   value: "Day",
  // },
];

const resourceViewToggleOptions = [
  {
    id: 'Detailed',
    label: 'Detailed View',
    value: 'Detailed',
  },
  {
    id: 'Compact',
    label: 'Compact View',
    value: 'Compact',
  },
];

const GanttSchedulerToolbar = ({
  ganttSchedulerRef,
  onChange,
  loading = false,
  defaultSelectedDate = new Date(),
  defaultCalendarView = 'Month',
  defaultResourceView = 'Detailed',
}: {
  ganttSchedulerRef: RefObject<GanttComponent>;
  loading: boolean;
  onChange: (eventData: onChangeEventType) => void;
  defaultSelectedDate?: Date;
  defaultCalendarView?: CalendarViewMode;
  defaultResourceView?: ResourceViewMode;
}): JSX.Element => {
  const [selectedCalendarView, setSelectedCalendarView] =
    useState<CalendarViewMode>(defaultCalendarView);

  const [selectedResourceView, setSelectedResourceView] =
    useState<ResourceViewMode>(defaultResourceView);

  const [selectedDate, setSelectedDate] = useState<Date>(defaultSelectedDate);

  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const [pickerMode, setPickerMode] = useState({
    showYear: true,
    showMonthYear: false,
  });

  const formattedDate = useMemo(() => {
    switch (selectedCalendarView) {
      case 'Month':
        return moment(selectedDate).format('YYYY');
      case 'Week':
        return moment(selectedDate).format('MMM, YYYY');
      case 'Day':
        return moment(selectedDate).format('MMM DD, YYYY');
      default:
        return '';
    }
  }, [selectedDate, selectedCalendarView]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (loading) {
      setIsDisabled(true);
    } else {
      timer = setTimeout(() => {
        setIsDisabled(false);
      }, 250);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [loading]);

  const DatepickerCustomInput = forwardRef<HTMLButtonElement, ToolbarDatepickerInputProps>(
    ({ onClick }, ref) => (
      <Button
        id="gantt-scheduler-toolbar-date-picker-btn"
        testid="gantt-scheduler-toolbar-date-picker-btn"
        variant="basic"
        onClick={onClick}
        ref={ref}
      >
        <div className="flex flex-row items-center justify-center gap-4">
          <span className="text-default text-[18px] font-semibold">{formattedDate}</span>
          <FontAwesomeIcon className="text-default h-4 w-4" icon={faChevronDown} />
        </div>
      </Button>
    )
  );

  const handleOnCalendarViewChange = (
    event: React.MouseEvent<HTMLElement>,
    value: CalendarViewMode
  ) => {
    setSelectedCalendarView(value);
    setPickerMode({
      showYear: value === 'Month',
      showMonthYear: value === 'Week',
    });
    onChange?.({
      selectedCalendarView: value,
      selectedResourceView,
      selectedDate,
    });
  };

  const handleOnResourceViewChange = (
    event: React.MouseEvent<HTMLElement>,
    value: ResourceViewMode
  ) => {
    setSelectedResourceView(value);
    onChange?.({
      selectedCalendarView,
      selectedResourceView: value,
      selectedDate,
    });
  };

  const handleOnPrevNextClick = (type: 'previous' | 'next') => {
    const increment = type === 'next' ? 1 : -1;

    const newDate = new Date(selectedDate);

    switch (selectedCalendarView) {
      case 'Month':
        newDate.setFullYear(newDate.getFullYear() + increment);
        break;
      case 'Week':
        newDate.setMonth(newDate.getMonth() + increment);
        break;
      case 'Day':
        newDate.setDate(newDate.getDate() + increment);
        break;
    }

    setSelectedDate(newDate);

    onChange?.({
      selectedCalendarView,
      selectedResourceView,
      selectedDate: newDate,
    });
  };

  return (
    <div className="gantt-scheduler-toolbar bg-card flex h-[40px] flex-row items-center justify-between px-4">
      <div className="my-2 flex items-center justify-start gap-6">
        <DatePicker
          selected={selectedDate}
          disabled={isDisabled}
          id="gantt-scheduler-toolbar-date-picker"
          onChange={(date: Date | null) => {
            if (date !== null) {
              setSelectedDate(date);
              onChange?.({
                selectedCalendarView,
                selectedDate: date,
                selectedResourceView,
              });
            }
          }}
          showYearPicker={pickerMode.showYear}
          showMonthYearPicker={pickerMode.showMonthYear}
          showPopperArrow={false}
          customInput={<DatepickerCustomInput />}
        />
      </div>
      <div className="mb-2 flex items-center justify-end gap-6">
        <ToggleGroupButton
          id="resource-view-toggle-button"
          options={resourceViewToggleOptions}
          initialSelected={defaultResourceView}
          onChange={handleOnResourceViewChange}
          disabled={isDisabled}
          customStyles={{
            selectedBg: '#3f51b5',
            selectedColor: 'white',
            textTranform: 'capitalize',
            hoverBg: '#e8eaf6',
          }}
          size="small"
        />

        {/* <ToggleGroupButton
					id="calendar-view-toggle-button"
					options={calendarViewToggleOptions}
					initialSelected={defaultCalendarView}
					onChange={handleOnCalendarViewChange}
					customStyles={{
						selectedBg: '#3f51b5',
						selectedColor: 'white',
						hoverBg: '#e8eaf6',
					}}
					size="small"
				/> */}

        <Button
          variant="stroked"
          id="scheduler-today-btn"
          testid="scheduler-today-btn"
          aria-label="today"
          disabled={isDisabled}
          onClick={() => {
            const _today = new Date();
            setSelectedDate(_today);

            onChange?.({
              selectedCalendarView,
              selectedResourceView,
              selectedDate: _today,
            });
          }}
        >
          Today
        </Button>

        <div className="flex flex-row items-center justify-start gap-2">
          <Button
            id="schedules_timeline_previous_btn"
            testid="schedules_timeline_previous_btn"
            className="hover:bg-hover flex h-7 w-7 flex-col items-center justify-center rounded-full"
            variant="basic"
            aria-label="previous"
            disabled={isDisabled}
            onClick={() => {
              handleOnPrevNextClick('previous');
            }}
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-default h-4 w-4" />
          </Button>
          <Button
            id="schedules_timeline_next_btn"
            testid="schedules_timeline_next_btn"
            className="hover:bg-hover flex h-7 w-7 flex-col items-center justify-center rounded-full"
            variant="basic"
            disabled={isDisabled}
            aria-label="next"
            onClick={() => {
              handleOnPrevNextClick('next');
            }}
          >
            <FontAwesomeIcon icon={faChevronRight} className="text-default h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GanttSchedulerToolbar;
