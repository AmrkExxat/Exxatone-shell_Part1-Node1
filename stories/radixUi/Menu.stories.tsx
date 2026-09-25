import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import {
  ArrowPathIcon,
  ChevronRightIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faGlobe, faUserCheck } from '@fortawesome/free-solid-svg-icons';

import { Menu, type MenuActionItem, type MenuItem } from '../../libs/ui/radixUi/Menu';
import { ThemeDecorator } from '../ThemeDecorator';

const MenuStoryWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="rounded-xl bg-gray-700 p-6">
    <div className="mb-4 text-xs font-semibold tracking-wide text-gray-300 uppercase">
      Menu Options
    </div>
    <div>{children}</div>
  </div>
);

const triggerButton = (
  <button
    type="button"
    className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-gray-700 shadow-sm hover:bg-violet-200 focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:outline-none"
    aria-label="Open menu"
  >
    <EllipsisVerticalIcon className="h-5 w-5" />
  </button>
);

const defaultItems: MenuItem[] = [
  {
    id: 'view',
    label: 'View',
    icon: <EyeIcon className="h-4 w-4" />,
    testId: 'menu-item-view',
  },
  {
    id: 'replace',
    label: 'Replace',
    icon: <ArrowPathIcon className="h-4 w-4" />,
    testId: 'menu-item-replace',
  },
  { id: 'separator', type: 'separator' },
  {
    id: 'delete',
    label: 'Delete',
    ariaLabel: 'click on delete button',
    icon: <TrashIcon className="h-4 w-4" />,
    variant: 'danger',
    testId: 'menu-item-delete',
  },
];

const nestedItems: MenuItem[] = [
  {
    id: 'view',
    label: 'View',
    icon: <EyeIcon className="h-4 w-4" />,
    testId: 'menu-item-view',
  },
  {
    id: 'actions',
    type: 'submenu',
    label: 'More actions',
    testId: 'menu-sub-trigger',
    contentTestId: 'menu-sub-content',
    items: [
      {
        id: 'copy-link',
        label: 'Copy link',
        testId: 'menu-item-copy-link',
      },
      {
        id: 'duplicate',
        label: 'Duplicate',
      },
    ],
  },
  { id: 'separator', type: 'separator' },
  {
    id: 'delete',
    label: 'Delete',
    ariaLabel: 'click on delete button',
    icon: <TrashIcon className="h-4 w-4" />,
    variant: 'danger',
    testId: 'menu-item-delete',
  },
];

const labeledItems: MenuItem[] = [
  {
    id: 'label-actions',
    type: 'label',
    label: 'Quick actions',
  },
  {
    id: 'refresh',
    label: 'Refresh',
    icon: <ArrowPathIcon className="h-4 w-4" />,
    shortcut: 'R',
  },
  {
    id: 'view',
    label: 'View details',
    icon: <EyeIcon className="h-4 w-4" />,
    shortcut: 'V',
  },
  { id: 'separator-actions', type: 'separator' },
  {
    id: 'label-danger',
    type: 'label',
    label: 'Danger zone',
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: <TrashIcon className="h-4 w-4" />,
    variant: 'danger',
    disabled: true,
  },
];

const OnSelectStory: React.FC = () => {
  const [selectedItem, setSelectedItem] = React.useState<MenuActionItem | null>(null);

  return (
    <MenuStoryWrapper>
      <div className="mb-3 text-xs text-gray-200" data-testid="menu-selection">
        {selectedItem ? selectedItem.id : 'No selection'}
      </div>
      <Menu
        items={defaultItems}
        onSelect={(item) => {
          setSelectedItem(item);
          console.log('item', item);
        }}
        triggerTestId="menu-trigger"
        contentTestId="menu-content"
      >
        {triggerButton}
      </Menu>
    </MenuStoryWrapper>
  );
};

const meta = {
  title: 'Radix UI/Menu',
  component: Menu,
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Generic menu component built on Radix Dropdown Menu primitives.',
          '',
          '**Features:**',
          '- Trigger wraps any element via `children`',
          '- Data-driven items with separators and labels',
          '- `onSelect` callback receives the clicked item',
          '- Nested submenus using `type: "submenu"`',
          '- Variants for destructive actions',
          '',
          '**Usage:**',
          '```tsx',
          'const items: MenuItem[] = [',
          "  { id: 'view', label: 'View' },",
          "  { id: 'separator', type: 'separator' },",
          '  {',
          "    id: 'more',",
          "    type: 'submenu',",
          "    label: 'More actions',",
          "    items: [{ id: 'copy', label: 'Copy link' }],",
          '  },',
          '];',
          '',
          '<Menu items={items}>',
          '  <button type="button">Open menu</button>',
          '</Menu>',
          '',
          '<Menu',
          '  items={items}',
          '  onSelect={(item) => console.log(item.id)}',
          '>',
          '  <button type="button">Open menu</button>',
          '</Menu>',
          '```',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Menu>;

export default meta;

type Story = StoryObj<typeof Menu>;

export const Default: Story = {
  render: () => (
    <MenuStoryWrapper>
      <Menu items={defaultItems} triggerTestId="menu-trigger" contentTestId="menu-content">
        {triggerButton}
      </Menu>
    </MenuStoryWrapper>
  ),
};

export const Nested: Story = {
  render: () => (
    <MenuStoryWrapper>
      <Menu
        items={nestedItems}
        triggerTestId="menu-trigger"
        contentTestId="menu-content"
        submenuIndicator={<ChevronRightIcon className="h-4 w-4" />}
        itemClassName="bg-gray-100 text-gray-900 !px-1 !py-1"
      >
        {triggerButton}
      </Menu>
    </MenuStoryWrapper>
  ),
};

export const WithLabels: Story = {
  render: () => (
    <MenuStoryWrapper>
      <Menu items={labeledItems} triggerTestId="menu-trigger" contentTestId="menu-content">
        {triggerButton}
      </Menu>
    </MenuStoryWrapper>
  ),
};

export const OnSelect: Story = {
  render: () => <OnSelectStory />,
};

const OpenOnFocusStory: React.FC = () => {
  const [triggerClicks, setTriggerClicks] = React.useState(0);

  return (
    <MenuStoryWrapper>
      <div className="mb-3 space-y-1 text-xs text-gray-200">
        <p>
          Hover the trigger to open the menu after delay. Press Enter/Space to open immediately.
          Click the trigger to increment (no menu toggle).
        </p>
        <p data-testid="trigger-click-count">Trigger clicks: {triggerClicks}</p>
      </div>
      <Menu
        openOnFocus
        focusOpenDuration={1000}
        onTriggerClick={() => setTriggerClicks((c) => c + 1)}
        items={defaultItems}
        onSelect={(item) => console.log('Selected', item)}
        triggerTestId="menu-trigger"
        contentTestId="menu-content"
      >
        {triggerButton}
      </Menu>
    </MenuStoryWrapper>
  );
};

export const OpenOnFocus: Story = {
  render: () => <OpenOnFocusStory />,
  parameters: {
    docs: {
      description: {
        story:
          'When `openOnFocus` is true, the menu opens on hover (not focus). ' +
          'Enter/Space can still open the menu from keyboard focus. ' +
          'By default it stays open for 2000ms (configurable via `focusOpenDuration`). ' +
          'Clicking the trigger does not open/close the menu and instead invokes `onTriggerClick`.',
      },
    },
  },
};

const TabClosesAndMovesFocusStory: React.FC = () => {
  return (
    <MenuStoryWrapper>
      <div className="flex items-center gap-3">
        <Menu items={defaultItems} triggerTestId="menu-trigger" contentTestId="menu-content">
          {triggerButton}
        </Menu>
        <button
          type="button"
          data-testid="menu-next-focus-target"
          className="bg-card inline-flex h-10 items-center justify-center rounded-lg px-3 text-sm text-gray-900 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
        >
          Next focus target
        </button>
      </div>
    </MenuStoryWrapper>
  );
};

export const TabClosesAndMovesFocus: Story = {
  render: () => <TabClosesAndMovesFocusStory />,
};

// Simple placeholder icons for active/inactive nav items
const ActiveHomeIcon: React.FC = () => (
  <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
);
const InactiveHomeIcon: React.FC = () => (
  <span className="inline-block h-2 w-2 rounded-full bg-gray-400" />
);
const ActiveCalendarIcon: React.FC = () => (
  <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
);
const InactiveCalendarIcon: React.FC = () => (
  <span className="inline-block h-2 w-2 rounded-full bg-gray-400" />
);
const ActiveBriefcaseIcon: React.FC = () => (
  <span className="inline-block h-2 w-2 rounded-full bg-purple-500" />
);
const InactiveBriefcaseIcon: React.FC = () => (
  <span className="inline-block h-2 w-2 rounded-full bg-gray-400" />
);

const navItemsConfig = [
  {
    path: 'home',
    label: 'Home',
    activeIcon: ActiveHomeIcon,
    inactiveIcon: InactiveHomeIcon,
    showWhenLoggedOut: false,
  },
  {
    path: 'academic-internships',
    label: 'Internship',
    activeIcon: ActiveCalendarIcon,
    inactiveIcon: InactiveCalendarIcon,
    showWhenLoggedOut: true,
    disabledWhenLoggedOut: true,
    pathMenuItems: [
      {
        id: 'schedules',
        label: 'Schedules',
        testId: 'menu-item-schedules',
        icon: (
          <FontAwesomeIcon
            icon={faArrowRightFromBracket}
            className="h-[16px] w-[16px] text-[#9E0003]"
          />
        ),
      },
      {
        id: 'wishlist',
        label: 'Wishlist',
        testId: 'menu-item-wishlist',
        icon: (
          <FontAwesomeIcon
            icon={faArrowRightFromBracket}
            className="h-[16px] w-[16px] text-[#9E0003]"
          />
        ),
      },
    ],
  },
  {
    path: 'jobs',
    label: 'Jobs',
    activeIcon: ActiveBriefcaseIcon,
    inactiveIcon: InactiveBriefcaseIcon,
    showWhenLoggedOut: true,
    activeWhenLoggedOut: true,
    pathMenuItems: [
      {
        id: 'discover-jobs',
        label: 'Discover',
        testId: 'menu-item-discover-jobs',
        icon: <FontAwesomeIcon icon={faGlobe} className="text-black" />,
      },
      {
        id: 'my-jobs',
        label: 'My Jobs',
        testId: 'menu-item-my-jobs',
        icon: <FontAwesomeIcon icon={faUserCheck} className="ms-1 text-black" />,
      },
    ],
  },
] as const;

type NavItemConfig = (typeof navItemsConfig)[number];

type PathMenuItemInput = {
  id: string;
  label: string;
  testId?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'danger';
};

const buildMenuItemsFromPathMenuItems = (pathMenuItems: readonly PathMenuItemInput[]): MenuItem[] =>
  pathMenuItems.map((item) => ({
    id: item.id,
    label: item.label,
    testId: item.testId,
    icon: item.icon,
    ...(item.variant ? { variant: item.variant } : {}),
  }));

const threeNavItemsWithPathMenusConfig = [
  {
    path: 'dashboard',
    label: 'Dashboard',
    activeIcon: ActiveHomeIcon,
    inactiveIcon: InactiveHomeIcon,
    pathMenuItems: [
      {
        id: 'dash-overview',
        label: 'Overview',
        testId: 'menu-item-dash-overview',
        icon: <EyeIcon className="h-4 w-4 text-slate-600" />,
      },
      {
        id: 'dash-analytics',
        label: 'Analytics',
        testId: 'menu-item-dash-analytics',
        icon: <FontAwesomeIcon icon={faGlobe} className="text-slate-700" />,
      },
      {
        id: 'dash-reports',
        label: 'Reports',
        testId: 'menu-item-dash-reports',
        icon: <ArrowPathIcon className="h-4 w-4 text-slate-600" />,
      },
    ],
  },
  {
    path: 'projects',
    label: 'Projects',
    activeIcon: ActiveCalendarIcon,
    inactiveIcon: InactiveCalendarIcon,
    pathMenuItems: [
      {
        id: 'proj-active',
        label: 'Active',
        testId: 'menu-item-proj-active',
        icon: <FontAwesomeIcon icon={faUserCheck} className="text-slate-700" />,
      },
      {
        id: 'proj-archived',
        label: 'Archived',
        testId: 'menu-item-proj-archived',
        icon: <EyeIcon className="h-4 w-4 text-slate-600" />,
      },
      {
        id: 'proj-templates',
        label: 'Templates',
        testId: 'menu-item-proj-templates',
        icon: <ArrowPathIcon className="h-4 w-4 text-slate-600" />,
      },
    ],
  },
  {
    path: 'account',
    label: 'Account',
    activeIcon: ActiveBriefcaseIcon,
    inactiveIcon: InactiveBriefcaseIcon,
    pathMenuItems: [
      {
        id: 'acct-profile',
        label: 'Profile',
        testId: 'menu-item-acct-profile',
        icon: <EyeIcon className="h-4 w-4 text-slate-600" />,
      },
      {
        id: 'acct-settings',
        label: 'Settings',
        testId: 'menu-item-acct-settings',
        icon: <FontAwesomeIcon icon={faGlobe} className="text-slate-700" />,
      },
      {
        id: 'acct-sign-out',
        label: 'Sign out',
        testId: 'menu-item-acct-sign-out',
        icon: (
          <FontAwesomeIcon
            icon={faArrowRightFromBracket}
            className="h-[16px] w-[16px] text-[#9E0003]"
          />
        ),
        variant: 'danger' as const,
      },
    ],
  },
] as const satisfies readonly {
  path: string;
  label: string;
  activeIcon: React.FC;
  inactiveIcon: React.FC;
  pathMenuItems: readonly PathMenuItemInput[];
}[];

const ThreeNavItemsWithPathMenusStory: React.FC = () => {
  const [activePath, setActivePath] = React.useState<string>('dashboard');

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-slate-800 p-6">
        <div className="mb-4 text-xs font-semibold tracking-wide text-slate-300 uppercase">
          Three nav items, each with multiple path menu items
        </div>
        <nav className="flex flex-wrap gap-4" aria-label="Navigation with path menus">
          {threeNavItemsWithPathMenusConfig.map((navItem) => {
            const isActive = navItem.path === activePath;
            const Icon = isActive
              ? navItem.activeIcon
              : (navItem.inactiveIcon ?? navItem.activeIcon);

            const items = buildMenuItemsFromPathMenuItems(navItem.pathMenuItems);

            const triggerContent = (
              <button
                type="button"
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none ${
                  isActive
                    ? 'bg-slate-100 text-slate-900'
                    : 'bg-transparent text-white hover:bg-slate-700'
                }`}
                data-testid={`nav-item-${navItem.path}`}
              >
                <Icon />
                <span>{navItem.label}</span>
              </button>
            );

            return (
              <Menu
                key={navItem.path}
                items={items}
                openOnFocus
                focusOpenDuration={1000}
                onSelect={(item) => console.log('path menu', navItem.path, item.id)}
                onTriggerClick={() => setActivePath(navItem.path)}
                triggerTestId={`menu-trigger-${navItem.path}`}
                contentTestId={`menu-content-${navItem.path}`}
              >
                {triggerContent}
              </Menu>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

const NavWithMenusStory: React.FC = () => {
  const [activePath, setActivePath] = React.useState<string>('home');

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-slate-800 p-6">
        <div className="mb-4 text-xs font-semibold tracking-wide text-slate-300 uppercase">
          Navigation with Menus
        </div>
        <nav className="flex gap-4" aria-label="Main navigation">
          {navItemsConfig.map((navItem) => {
            const isActive = navItem.path === activePath;
            const Icon = isActive
              ? navItem.activeIcon
              : (navItem.inactiveIcon ?? navItem.activeIcon);

            const pathMenuItems = 'pathMenuItems' in navItem ? navItem.pathMenuItems : undefined;
            const hasMenu = Array.isArray(pathMenuItems) && pathMenuItems.length > 0;

            const triggerContent = (
              <button
                type="button"
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none ${
                  isActive
                    ? 'bg-slate-100 text-slate-900'
                    : 'bg-transparent text-white hover:bg-slate-700'
                }`}
                data-testid={`nav-item-${navItem.path}`}
              >
                <Icon />
                <span>{navItem.label}</span>
              </button>
            );

            if (!hasMenu) {
              return (
                <div key={navItem.path} className="flex items-center">
                  {triggerContent}
                </div>
              );
            }

            const items = buildMenuItemsFromPathMenuItems(pathMenuItems!);

            return (
              <Menu
                key={navItem.path}
                items={items}
                openOnFocus={false}
                focusOpenDuration={1000}
                onTriggerClick={() => setActivePath(navItem.path)}
                triggerTestId={`menu-trigger-${navItem.path}`}
                contentTestId={`menu-content-${navItem.path}`}
              >
                {triggerContent}
              </Menu>
            );
          })}
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
          >
            <FontAwesomeIcon
              icon={faArrowRightFromBracket}
              className="h-[16px] w-[16px] text-[#9E0003]"
            />
          </button>
        </nav>
      </div>
    </div>
  );
};

export const NavWithMenus: Story = {
  render: () => <NavWithMenusStory />,
};

export const ThreeNavItemsWithPathMenus: Story = {
  render: () => <ThreeNavItemsWithPathMenusStory />,
  parameters: {
    docs: {
      description: {
        story:
          'Three top-level nav triggers (Dashboard, Projects, Account). Each opens a menu built from multiple `pathMenuItems`, similar to app shell navigation.',
      },
    },
  },
};
