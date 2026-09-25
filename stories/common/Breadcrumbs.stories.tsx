import React, { useState } from 'react'; // Ensure React is imported
import type { Meta, StoryObj } from '@storybook/nextjs';
import { BreadCrumbs, BreadCrumbItemType } from '../../libs/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faChevronDown } from '@fortawesome/pro-light-svg-icons';
import { ThemeDecorator } from '../ThemeDecorator';

const meta: Meta<typeof BreadCrumbs> = {
  title: 'Common/Breadcrumbs',
  component: BreadCrumbs,
  parameters: {
    layout: 'centered',
  },
  decorators: [ThemeDecorator],
  argTypes: {
    separator: {
      control: { type: 'text' },
      description: 'Custom separator for breadcrumb items',
    },
  },
};

export default meta;

type StoryType = StoryObj<typeof meta>;

let breadcrumbItems: BreadCrumbItemType[] = [
  { label: 'Home', href: '/', current: true },
  { label: 'Products', href: '/products', current: false },
  { label: 'Electronics', current: false }, // Last item is disabled (text only)
];

const metaInfoMap = {
  '/': 'Welcome to our website!',
  '/products': 'Browse our product categories.',
  Electronics: 'Here you can find the latest electronics.',
};

export const Default: StoryType = {
  render: () => {
    const [metaInformation, setMetaInformation] = useState<React.ReactNode>(
      metaInfoMap['Electronics']
    );

    const handleItemClick = (item: BreadCrumbItemType) => {
      breadcrumbItems = breadcrumbItems.map((res) => ({
        ...res,
        current: res.label === item.label,
      }));

      if (item.href) {
        setMetaInformation(metaInfoMap[item.href] || metaInfoMap['Electronics']);
      } else {
        setMetaInformation(metaInfoMap[item.label] || metaInfoMap['Electronics']);
      }
    };

    return (
      <div className="flex flex-col items-center">
        <BreadCrumbs
          items={breadcrumbItems}
          id="breadcrumb_id"
          testid="breadcrumb_id"
          aria-label="Breadcrumb Label"
          metaInformation={
            <div id="metaInformation" className="mt-2 text-xs text-gray-600">
              {metaInformation}
            </div>
          }
          onItemClick={handleItemClick}
        />
      </div>
    );
  },
};

export const CustomSeparatorText: StoryType = {
  args: {
    items: breadcrumbItems,
    id: 'breadcrumb_id',
    separator: (
      <span id="separator_icon" className="mx-2 text-gray-400">
        {' '}
        |{' '}
      </span>
    ),
  },
};

export const CustomSeparatorIcon: StoryType = {
  args: {
    items: breadcrumbItems,
    id: 'breadcrumb_id',
    separator: (
      <FontAwesomeIcon
        id="separator_icon"
        icon={faArrowRight}
        className="mx-2 h-4 w-4 text-gray-400"
      />
    ),
  },
};

export const CustomSeparatorIconText: StoryType = {
  args: {
    items: breadcrumbItems,
    id: 'breadcrumb_id',
    separator: (
      <div className="mx-2 flex items-center text-gray-400">
        <FontAwesomeIcon id="separator_icon" icon={faChevronDown} className="h-4 w-4" />
        <span id="separator_text" className="ml-1">
          Next
        </span>
      </div>
    ),
  },
};

export const WithMetaInformation: StoryType = {
  render: () => {
    const [metaInformation, setMetaInformation] = useState<React.ReactNode>(
      metaInfoMap['Electronics']
    );

    const handleItemClick = (item: BreadCrumbItemType) => {
      breadcrumbItems = breadcrumbItems.map((res) => ({
        ...res,
        current: res.label === item.label,
      }));

      if (item.href) {
        setMetaInformation(metaInfoMap[item.href] || metaInfoMap['Electronics']);
      } else {
        setMetaInformation(metaInfoMap[item.label] || metaInfoMap['Electronics']);
      }
    };

    return (
      <div className="flex flex-col items-center">
        <BreadCrumbs
          id="breadcrumb_id"
          testid="breadcrumb_id"
          items={breadcrumbItems}
          metaInformation={
            <div id="metaInformation" className="mt-2 text-gray-600">
              {metaInformation}
            </div>
          }
          onItemClick={handleItemClick}
        />
      </div>
    );
  },
};
