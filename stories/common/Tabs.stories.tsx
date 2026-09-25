import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { Tabs } from '../../libs/ui';
import { ThemeDecorator } from '../ThemeDecorator';
import { HomeIcon, EnvelopeIcon, BriefcaseIcon } from '@heroicons/react/20/solid';

const meta: Meta<typeof Tabs> = {
  title: 'Common/Tabs',
  component: Tabs,
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary', 'switcher'],
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'info', 'custom'],
    },
    height: {
      control: { type: 'text' },
    },
  },

  args: {
    type: 'primary',
    height: '40px',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Reusable tab lists
const tabList = [
  { name: 'home', title: 'Home' },
  { name: 'messages', title: 'Messages' },
];

const tabListWithIcons = [
  { name: 'home', title: 'Home', icon: <HomeIcon /> },
  { name: 'messages', title: 'Messages', icon: <EnvelopeIcon /> },
];

const tabListWithIconsAndBadges = [
  { name: 'home', title: 'Home', icon: <HomeIcon />, badge: 5 },
  { name: 'messages', title: 'Messages', icon: <EnvelopeIcon />, badge: 100 },
];

const renderWithState = (args) => {
  const [activeIndex, setActiveIndex] = useState(args.activeIndex);

  return (
    <div className="bg-card rounded-lg p-4">
      <Tabs
        {...args}
        activeIndex={activeIndex}
        onTabChange={(index) => {
          setActiveIndex(index);
          args.onTabChange?.(index);
        }}
      />
    </div>
  );
};

export const DefaultTabs: Story = {
  render: renderWithState,
  args: {
    tabs: tabList,
    activeIndex: 0,
    type: 'primary',
    onTabChange: (index) => console.log(`Tab changed to index: ${index}`),
  },
};

export const TabsWithIcons: Story = {
  render: renderWithState,
  args: {
    tabs: tabListWithIcons,
    activeIndex: 0,
    type: 'primary',
    onTabChange: (index) => console.log(`Tab changed to index: ${index}`),
  },
};

export const SecondaryTabs: Story = {
  render: renderWithState,
  args: {
    tabs: tabList,
    activeIndex: 0,
    type: 'secondary',
    height: '40px',
    onTabChange: (index) => console.log(`Tab changed to index: ${index}`),
  },
};

export const SecondaryTabsWithIcons: Story = {
  render: renderWithState,
  args: {
    tabs: tabListWithIcons,
    activeIndex: 0,
    type: 'secondary',
    height: '40px',
    onTabChange: (index) => console.log(`Tab changed to index: ${index}`),
  },
};

export const SecondaryTabsWithIconsAndBadge: Story = {
  render: renderWithState,
  args: {
    tabs: tabListWithIconsAndBadges,
    activeIndex: 0,
    type: 'secondary',
    height: '40px',
    onTabChange: (index) => console.log(`Tab changed to index: ${index}`),
  },
};

export const TertiaryTabs: Story = {
  render: renderWithState,
  args: {
    tabs: tabList,
    activeIndex: 0,
    type: 'tertiary',
    height: '40px',
    onTabChange: (index) => console.log(`Tab changed to index: ${index}`),
  },
};

export const SwitcherTabs: Story = {
  render: renderWithState,
  args: {
    tabs: tabList,
    activeIndex: 0,
    type: 'switcher',
    height: '40px',
    onTabChange: (index) => console.log(`Tab changed to index: ${index}`),
  },
};

export const SwitcherTabsWithGaps: Story = {
  render: renderWithState,
  args: {
    tabs: tabList,
    activeIndex: 0,
    type: 'switcher',
    height: '40px',
    withGaps: true,
    onTabChange: (index) => console.log(`Tab changed to index: ${index}`),
  },
};

/**
 * Custom switcher variant that demonstrates configurable gap and
 * active / inactive colors, similar to the "Discover / My Jobs" pills.
 */
export const SwitcherTabsCustomSegmented: Story = {
  render: renderWithState,
  args: {
    tabs: [
      { name: 'discover', title: 'Discover', icon: <HomeIcon />, tabClassName: 'px-4' },
      { name: 'my-jobs', title: 'My Jobs', icon: <BriefcaseIcon />, tabClassName: 'px-4' },
    ],
    activeIndex: 1,
    type: 'switcher',
    variant: 'custom',
    height: '30px',
    contentClassName: 'space-x-1.5',
    tabGapClassName: 'gap-2',
    activeTabClassName: 'bg-[#FF007A] text-white font-bold',
    inactiveTabClassName: 'bg-[#F5F5F7] text-black font-bold',
    onTabChange: (index) => console.log(`Tab changed to index: ${index}`),
  },
};

/**
 * Tertiary tabs with custom underline and text colors like the
 * "Draft / Saved by You / Applied" design.
 */
export const TertiaryTabsCustomUnderline: Story = {
  render: renderWithState,
  args: {
    tabs: [
      { name: 'draft', title: 'Draft', icon: <HomeIcon /> },
      { name: 'saved-by-you', title: 'Saved by You', icon: <HomeIcon /> },
      { name: 'applied', title: 'Applied', icon: <HomeIcon /> },
    ],
    activeIndex: 0,
    type: 'tertiary',
    variant: 'custom',
    height: '40px',
    position: 'left',
    contentClassName: 'h-full w-full py-3 px-4 flex gap-3 mb-[8px]',
    tertiaryActiveTextClassName: 'text-black  text-xs',
    tertiaryInactiveTextClassName: 'text-black text-xs',
    tertiaryActiveUnderlineClassName: 'border-black',
    tertiaryInactiveUnderlineClassName: 'border-gray-200',
    activeTabClassName: 'bg-[#F4F4F5] rounded-[4px]',
    // inactiveTabClassName: 'bg-blue-500',
    bottomBorderReq: true,
    onTabChange: (index) => console.log(`Tab changed to index: ${index}`),
  },
};
