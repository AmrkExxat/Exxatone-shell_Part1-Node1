import { SideNavItem } from '../types';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBarsProgress,
  faCalendarWeek,
  faDistributeSpacingVertical,
  faFilter,
  faGripDots,
  faHome,
  faInbox,
  faInputNumeric,
  faListCheck,
  faListDropdown,
  faRectangleBarcode,
  faServer,
  faTable,
  faTableLayout,
  faTableRows,
  faTags,
  faUser,
  faToggleOn,
} from '@fortawesome/pro-light-svg-icons';

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: 'Home',
    path: '/',
    icon: <FontAwesomeIcon icon={faHome} className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: 'Accordion',
    path: '/pages/accordion',
    icon: <FontAwesomeIcon icon={faServer} className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: 'Avatar',
    path: '/pages/avatar',
    icon: <FontAwesomeIcon icon={faUser} className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: 'Breadcrumb',
    path: '/pages/breadcrumb',
    icon: <FontAwesomeIcon icon={faInbox} className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: 'Buttons',
    path: '/pages/buttons',
    icon: <FontAwesomeIcon icon={faInbox} className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: 'Card',
    path: '/pages/card',
    icon: <FontAwesomeIcon icon={faHome} className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: 'Dropdowns',
    path: '/pages/dropdowns',
    icon: <FontAwesomeIcon icon={faListDropdown} className="h-5 w-5" aria-hidden="true" />,
    submenu: true,
    subMenuItems: [
      { title: 'DropDownMenu', path: '/pages/dropdownmenu' },
      { title: 'SelectDropDown', path: '/pages/selectdropdown' },
    ],
  },
  {
    title: 'Filter',
    path: '/pages/filter',
    icon: <FontAwesomeIcon icon={faFilter} className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: 'Form',
    path: '/pages/form',
    icon: <FontAwesomeIcon icon={faListCheck} className="h-5 w-5" aria-hidden="true" />,
    submenu: true,
    subMenuItems: [
      { title: 'Checkbox', path: '/pages/checkbox' },
      { title: 'Combobox', path: '/pages/combobox' },
      { title: 'Input', path: '/pages/input' },
      { title: 'Radio', path: '/pages/radio' },
      { title: 'Select', path: '/pages/select' },
    ],
  },
  {
    title: 'Modal',
    path: '/pages/modal',
    icon: (
      <FontAwesomeIcon icon={faDistributeSpacingVertical} className="h-5 w-5" aria-hidden="true" />
    ),
  },
  {
    title: 'Pagination',
    path: '/pages/pagination',
    icon: <FontAwesomeIcon icon={faInputNumeric} className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: 'PrimarySteps',
    path: '/pages/primarysteps',
    icon: <FontAwesomeIcon icon={faServer} className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: 'Status',
    path: '/pages/status',
    icon: <FontAwesomeIcon icon={faRectangleBarcode} className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: 'Show More',
    path: '/pages/showmore',
    icon: <FontAwesomeIcon icon={faGripDots} className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: 'Skeleton',
    path: '/pages/skeleton',
    icon: <FontAwesomeIcon icon={faBarsProgress} className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: 'Table',
    path: '/pages/table',
    icon: <FontAwesomeIcon icon={faTable} className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: 'Tabs',
    path: '/pages/tabs',
    icon: <FontAwesomeIcon icon={faTableRows} className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: 'Tooltip',
    path: '/pages/tooltip',
    icon: <FontAwesomeIcon icon={faTags} className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: 'Toggle Group Button',
    path: '/pages/toggleGroupButton',
    icon: <FontAwesomeIcon icon={faToggleOn} className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: 'WeekView',
    path: '/pages/weekview',
    icon: <FontAwesomeIcon icon={faCalendarWeek} className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: 'Drawer',
    path: '/pages/drawer',
    icon: <FontAwesomeIcon icon={faTableLayout} className="h-5 w-5" aria-hidden="true" />,
  },
];
