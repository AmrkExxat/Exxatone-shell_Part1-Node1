import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';

import { ThemeDecorator } from '../ThemeDecorator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faTrashAlt } from '@fortawesome/pro-light-svg-icons';

const meta = {
  title: 'Common/Card',
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'fullScreen',
  },
  tags: ['autodocs'],
} satisfies Meta<any>;

export default meta;

type Story = StoryObj<any>;

export const VariationOne: Story = {
  render: () => {
    return (
      <div className="card">
        <div className="card-header">
          <span className="card-header-title">Publish Options</span>
          <button type="button" className="icon-btn" aria-label="Edit Publish Options">
            <FontAwesomeIcon icon={faPen} className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 gap-x-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold">Name</span>
              <span className="text-sm">Adaptial - Easton</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold">Alias Name</span>
              <span className="text-sm">--</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold">Phone</span>
              <span className="text-sm">(303) 196-2491</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold">Address</span>
              <span className="text-sm">2464 Royal Ln. Mesa, New Jersey 45463</span>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

export const VariationTwo: Story = {
  render: () => {
    return (
      <div className="card">
        <div className="card-header">
          <span className="card-header-title">Internal notes</span>
          <button type="button" className="icon-btn" aria-label="Edit Internal Notes">
            <FontAwesomeIcon icon={faPen} className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="card-content mb-4 grid grid-cols-1 gap-2">
          <div className="flex min-h-[44px] items-center justify-between border-b pb-2">
            <div className="text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
              dolor in reprehenderit.
            </div>
          </div>
          <div className="flex min-h-[44px] flex-row items-center justify-between">
            <div className="text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
              dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </div>
            <div className="flex flex-row items-center justify-start gap-1">
              <button type="button" className="icon-btn" aria-label="Edit">
                <FontAwesomeIcon icon={faPen} className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="icon-btn text-warn hover:bg-warn-50"
                aria-label="Delete"
              >
                <FontAwesomeIcon icon={faTrash} className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  },
};
