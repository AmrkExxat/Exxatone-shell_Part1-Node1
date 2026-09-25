import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faGrid2, faRetweet } from '@fortawesome/pro-light-svg-icons';
import KeyboardTabOutlinedIcon from '@mui/icons-material/KeyboardTabOutlined';
import React from 'react';
import { Tabs } from '../../components/common';

interface TimeTabsProps {
  activeIndex: number;
  onTabChange: (index: number) => void;
}

const timeTabs = [
  {
    title: 'All',
    name: 'all',
    query: 'all',
    icon: <FontAwesomeIcon icon={faGrid2} className="text-default h-4 w-4" />,
  },
  {
    title: 'Upcoming',
    name: 'upcoming',
    query: 'upcoming',
    icon: <KeyboardTabOutlinedIcon className="mat-icon h-5 w-5" />,
  },
  {
    title: 'Current',
    name: 'current',
    query: 'current',
    icon: <FontAwesomeIcon icon={faRetweet} className="text-default h-5 w-5" />,
  },
  {
    title: 'Completed',
    name: 'completed',
    query: 'completed',
    icon: <FontAwesomeIcon icon={faCircleCheck} className="text-default h-5 w-5" />,
  },
];

const TimeTabs: React.FC<TimeTabsProps> = ({ activeIndex, onTabChange }) => {
  return (
    <div className="flex items-center">
      <Tabs
        activeIndex={activeIndex}
        height="40px"
        onTabChange={onTabChange}
        tabs={timeTabs}
        type="tertiary"
        bottomBorderClass={'border-[#e5e7eb]'}
      />
    </div>
  );
};

export default TimeTabs;
