import React from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs';
import { ThemeDecorator } from '../ThemeDecorator';
import { ShowMore } from '../../libs/ui';

const meta = {
  title: 'Common/ShowMore',
  component: ShowMore,
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'fullScreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ShowMore>;

export default meta;

type Story = StoryObj<typeof ShowMore>;

export const ShowmoreWithoutHyperLink: Story = {
  render: () => {
    const data = [
      { id: 1, name: 'Angular' },
      { id: 2, name: 'React' },
      { id: 3, name: 'Next js' },
      { id: 4, name: 'JavaScript' },
      { id: 5, name: 'FrontEnd' },
    ];
    return (
      <ShowMore type="list" rowData={data} selector={['name']} showTooltip={true} maxLength={2} />
    );
  },
};

export const ShowmoreWithHyperLink: Story = {
  render: () => {
    const data = [
      { id: 1, name: 'Angular', url: 'common-table--docs' },
      { id: 2, name: 'React', url: 'common-modal--docs' },
      { id: 3, name: 'Next js', url: 'common-card--docs' },
      { id: 4, name: 'JavaScript', url: 'common-button--docs' },
      { id: 5, name: 'frontEnd', url: 'form-checkbox--docs' },
    ];

    return (
      <div className="flex flex-row items-center justify-center">
        <ShowMore
          type="list"
          rowData={data}
          selector={['name']}
          isHyperLink={true}
          routePath="?path=/docs"
          routeSelector="url"
          showTooltip={true}
          maxLength={3}
        />
      </div>
    );
  },
};
