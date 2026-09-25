import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { Button, NonPortalModal } from '../../libs/ui';
import { ThemeDecorator } from '../ThemeDecorator';

const meta = {
  title: 'Common/NonPortalModal',
  component: NonPortalModal,
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NonPortalModal>;

export default meta;

type Story = StoryObj<typeof NonPortalModal>;

const RenderModal = ({ size = 'lg' }: { size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative h-[70vh]">
      <Button id="non-portal-modal-open-btn" variant="flat" onClick={() => setOpen(true)}>
        Open Non Portal Modal
      </Button>
      <NonPortalModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Non Portal Modal"
        message="This modal renders in place without using a portal."
        size={size}
      >
        <div data-testid="non-portal-modal-content" className="text-sm text-gray-700">
          Modal content area
        </div>
      </NonPortalModal>
    </div>
  );
};

export const Default: Story = {
  render: () => <RenderModal />,
};

export const Small: Story = {
  render: () => <RenderModal size="sm" />,
};

export const Medium: Story = {
  render: () => <RenderModal size="md" />,
};

export const Large: Story = {
  render: () => <RenderModal size="lg" />,
};

export const ExtraLarge: Story = {
  render: () => <RenderModal size="xl" />,
};

export const TwoExtraLarge: Story = {
  render: () => <RenderModal size="2xl" />,
};
