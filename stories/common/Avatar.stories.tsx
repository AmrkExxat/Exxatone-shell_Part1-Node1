import type { Meta, StoryObj } from '@storybook/nextjs';

import { Avatar } from '../../libs/ui';
import { ThemeDecorator } from '../ThemeDecorator';

const meta = {
  title: 'Common/Avatar',
  decorators: [ThemeDecorator],
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const defaultAvatar: Story = {
  args: {
    id: 'default',
    testid: 'defaultAvatar',
    className: 'h-[50px] w-[50px]',
  },
};
export const AvatarWithSRC: Story = {
  args: {
    id: 'avatarSrc',
    testid: 'Avatar_with_src',
    src: 'https://via.placeholder.com/90',
    alt: 'placeholder image',
    className: 'h-[50px] w-[50px]',
  },
};

export const AvatarWithName: Story = {
  args: {
    id: 'avatarName',
    testid: 'Avatar_with_Name',
    fgColor: 'white',
    firstName: 'Harvey',
    lastName: 'Specter',
    className: 'h-[60px] w-[60px] text-xl rounded-md bg-gray-500 text-white',
  },
};
