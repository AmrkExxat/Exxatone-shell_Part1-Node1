import { Key } from 'react';

interface Weekdays {
  monday?: boolean;
  tuesday?: boolean;
  wednesday?: boolean;
  thursday?: boolean;
  friday?: boolean;
  saturday?: boolean;
  sunday?: boolean;
}

type WeekViewProps = Weekdays & {
  allDays?: boolean;
  id?: string;
  daysInWeek?: string[];
  groupName?: string;
};

interface DayComponentProps {
  dayAbbreviation: string;
  dayName: string;
  isActive: boolean;
  isFirst: boolean;
  isLast: boolean;
  key: Key;
}

const DayComponent = ({
  dayAbbreviation,
  dayName,
  isActive,
  isFirst,
  isLast,
}: DayComponentProps) => (
  <li
    role="listitem"
    className={`flex w-[24px] items-center justify-center text-center text-sm ${isActive ? 'bg-[#2F7F0C] font-bold text-white' : 'text-default bg-card font-medium'} ${isFirst ? 'rounded-l-md' : ''} ${isLast ? 'rounded-r-md' : ''} border-r border-gray-200 last:border-r-0`}
    aria-selected={isActive}
  >
    <span aria-hidden="true">{dayAbbreviation}</span>
    <span className="sr-only">
      {dayName} {isActive ? 'selected' : 'not selected'}
    </span>
  </li>
);

const WeekView = ({
  monday = false,
  tuesday = false,
  wednesday = false,
  thursday = false,
  friday = false,
  saturday = false,
  sunday = false,
  allDays = false,
  daysInWeek,
  id,
  groupName = '',
}: WeekViewProps) => {
  const dayMap = {
    MON: 'monday',
    TUE: 'tuesday',
    WED: 'wednesday',
    THU: 'thursday',
    FRI: 'friday',
    SAT: 'saturday',
    SUN: 'sunday',
  };

  const getDisplayName = (name: string) => name.charAt(0).toUpperCase() + name.slice(1);

  const days = [
    { name: 'monday', value: monday, abbreviation: 'M' },
    { name: 'tuesday', value: tuesday, abbreviation: 'T' },
    { name: 'wednesday', value: wednesday, abbreviation: 'W' },
    { name: 'thursday', value: thursday, abbreviation: 'T' },
    { name: 'friday', value: friday, abbreviation: 'F' },
    { name: 'saturday', value: saturday, abbreviation: 'S' },
    { name: 'sunday', value: sunday, abbreviation: 'S' },
  ];

  // Handle both input methods
  const getDayStatus = (day: any, index: number) => {
    if (daysInWeek) {
      return daysInWeek.includes(Object.keys(dayMap)[index]);
    }
    return allDays || day.value;
  };

  // Calculate selected days for the aria-label
  const selectedDays = days
    .filter((day, index) => getDayStatus(day, index))
    .map((day) => getDisplayName(day.name))
    .join(', ');

  const ariaLabel =
    selectedDays.length > 0
      ? `${groupName ? `${groupName}: ` : 'Weekly schedule: '}${selectedDays} selected`
      : `${groupName ? `${groupName}: ` : 'Weekly schedule: '}No days selected`;

  return (
    <div id={id} className="max-w-[168px]" aria-label={ariaLabel} role="group">
      <ul
        role="list"
        className="m-0 flex h-[24px] list-none flex-row rounded-md border p-0"
        aria-label="Days of week selector"
      >
        {days.map((day, index) => (
          <DayComponent
            key={index}
            dayAbbreviation={day.abbreviation}
            dayName={getDisplayName(day.name)}
            isActive={getDayStatus(day, index)}
            isFirst={index === 0}
            isLast={index === days.length - 1}
          />
        ))}
      </ul>
    </div>
  );
};

export default WeekView;
