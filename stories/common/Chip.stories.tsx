import { Meta, Story } from '@storybook/nextjs';
import React from 'react';
import { ChipProps, CustomChip } from '../../libs/ui';
import { ThemeDecorator } from '../ThemeDecorator';
import Avatar from '@mui/material/Avatar';

const meta: Meta<typeof CustomChip> = {
  title: 'Common/Chip',
  component: CustomChip,
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    label: { control: 'text' },
    onDelete: { action: 'deleted' },
    disabled: { control: 'boolean' },
    icon: { control: false },
    avatar: { control: false },
    variant: {
      control: {
        type: 'radio',
        options: ['filled', 'outlined'],
      },
    },
    color: {
      control: {
        type: 'radio',
        options: ['default', 'primary', 'secondary', 'error', 'info', 'success', 'warning'],
      },
    },
    size: {
      control: {
        type: 'radio',
        options: ['small', 'medium'],
      },
    },
    clickable: { control: 'boolean' },
    component: { control: 'text' },
    deleteIcon: { control: false },
    className: { control: 'text' },
  },
  tags: ['autodocs'],
};

export default meta;

type ChipStory = Story<ChipProps>;

const chipStyles = {
  display: 'inline-flex',
  margin: '0 4px 4px 0',
};

export const BasicChip: ChipStory = {
  args: {
    label: 'Filled Chip',
    variant: 'outlined',
  },
  render: ({ label, ...args }) => (
    <div>
      <h1 className="text-2xl font-bold dark:text-gray-100">Filled Chip</h1>
      <div className="mt-5">
        <CustomChip label={label} {...args} style={chipStyles} />
      </div>
    </div>
  ),
};

export const Outlined: ChipStory = {
  args: {
    label: 'Outlined Chip',
    variant: 'outlined',
  },
  render: ({ label, ...args }) => (
    <div>
      <h1 className="text-2xl font-bold dark:text-gray-100">Outlined Chip</h1>
      <div className="mt-5">
        <CustomChip label={label} {...args} style={chipStyles} />
      </div>
    </div>
  ),
};

export const Colors: ChipStory = {
  render: () => (
    <div>
      <h1 className="text-2xl font-bold dark:text-gray-100">Chip Colors</h1>
      <div className="mt-5 flex flex-wrap gap-4">
        <CustomChip label="Default" color="default" style={chipStyles} />
        <CustomChip label="Primary" color="primary" style={chipStyles} />
        <CustomChip label="Secondary" color="secondary" style={chipStyles} />
        <CustomChip label="Error" color="error" style={chipStyles} />
        <CustomChip label="Info" color="info" style={chipStyles} />
        <CustomChip label="Success" color="success" style={chipStyles} />
        <CustomChip label="Warning" color="warning" style={chipStyles} />
      </div>
    </div>
  ),
};

export const Sizes: ChipStory = {
  render: () => (
    <div>
      <h1 className="text-2xl font-bold dark:text-gray-100">Chip Sizes</h1>
      <div className="mt-5 flex flex-wrap gap-4">
        <CustomChip label="Small" size="small" style={chipStyles} />
        <CustomChip label="Medium" size="medium" style={chipStyles} />
      </div>
    </div>
  ),
};

export const WithIcon: ChipStory = {
  render: () => (
    <div>
      <h1 className="text-2xl font-bold dark:text-gray-100">Chip with Icon</h1>
      <div className="mt-5 flex flex-wrap gap-4">
        <CustomChip label="Chip with Icon" icon={<span>🌟</span>} style={chipStyles} />
      </div>
    </div>
  ),
};

export const WithAvatar: ChipStory = {
  render: () => (
    <div>
      <h1 className="text-2xl font-bold dark:text-gray-100">Chip with Avatar</h1>
      <div className="mt-5 flex flex-wrap gap-4">
        <CustomChip label="Avatar (Letter)" avatar={<Avatar>G</Avatar>} style={chipStyles} />
        <CustomChip
          label="Avatar (Image)"
          avatar={<Avatar src="https://via.placeholder.com/150" />}
          style={chipStyles}
        />
      </div>
    </div>
  ),
};

export const OnDelete: ChipStory = {
  render: () => (
    <div>
      <h1 className="text-2xl font-bold dark:text-gray-100">Chip with onDelete</h1>
      <div className="mt-5 flex flex-wrap gap-4">
        <CustomChip label="Default Delete" onDelete={() => alert('Deleted!')} style={chipStyles} />
        <CustomChip
          label="Custom Delete"
          onDelete={() => alert('Custom delete action!')}
          style={chipStyles}
        />
      </div>
    </div>
  ),
};

export const Clickable: ChipStory = {
  render: () => (
    <div>
      <h1 className="text-2xl font-bold dark:text-gray-100">Clickable Chip</h1>
      <div className="mt-5 flex flex-wrap gap-4">
        <CustomChip label="Clickable" clickable style={chipStyles} />
      </div>
    </div>
  ),
};

export const ClickableAndDeletable: ChipStory = {
  render: () => (
    <div>
      <h1 className="text-2xl font-bold dark:text-gray-100">Clickable and Deletable Chip</h1>
      <div className="mt-5 flex flex-wrap gap-4">
        <CustomChip
          label="Clickable and Deletable"
          clickable
          onDelete={() => alert('Deleted!')}
          style={chipStyles}
        />
      </div>
    </div>
  ),
};

export const ClickableLink: ChipStory = {
  render: () => (
    <div>
      <h1 className="text-2xl font-bold dark:text-gray-100">Clickable Link Chip</h1>
      <div className="mt-5 flex flex-wrap gap-4">
        <CustomChip
          label="Clickable Link"
          clickable
          component="a"
          href="https://example.com"
          style={chipStyles}
        />
      </div>
    </div>
  ),
};

export const ChipArray: ChipStory = {
  render: () => {
    const chipData: ChipProps[] = [
      { label: 'Tag 1', color: 'default' },
      { label: 'Tag 2', color: 'primary' },
      { label: 'Tag 3', color: 'secondary' },
      { label: 'Tag 4', color: 'error' },
      { label: 'Tag 5', color: 'info' },
      { label: 'Tag 6', color: 'success' },
      { label: 'Tag 7', color: 'warning' },
    ];

    return (
      <div>
        <h1 className="text-2xl font-bold dark:text-gray-100">Chip Array</h1>
        <div className="mt-5 flex flex-wrap gap-4">
          {chipData.map((chip, index) => (
            <CustomChip key={index} {...chip} style={chipStyles} />
          ))}
        </div>
      </div>
    );
  },
};
