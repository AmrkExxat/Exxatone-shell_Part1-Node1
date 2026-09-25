import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';

import { AvatarUpload } from '../../libs/ui';
import { ThemeDecorator } from '../ThemeDecorator';

const meta = {
  title: 'Common/AvatarUpload',
  decorators: [ThemeDecorator],
  component: AvatarUpload,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onAvatarChange: fn(),
    onError: fn(),
    onDeleteAvatar: fn(),
  },
  argTypes: {
    loading: { control: 'boolean' },
    avatarUrl: { control: 'text' },
    maxFileSize: {
      control: 'number',
      description: 'Maximum file size in MB (optional)',
    },
  },
} satisfies Meta<typeof AvatarUpload>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    loading: false,
    avatarUrl: null,
    maxFileSize: 1,
    allowedExtensions: ['image/jpeg', 'image/png', 'image/jpg'],
  },
};

export const WithAvatarUrl: Story = {
  args: {
    loading: false,
    avatarUrl: 'https://via.placeholder.com/96',
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    avatarUrl: null,
  },
};

export const WithSizeLimit: Story = {
  args: {
    loading: false,
    avatarUrl: null,
    maxFileSize: 2,
  },
};
