/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { ThemeDecorator } from '../ThemeDecorator';
import { FilterForm } from '../../libs/ui';
import { filterConfig } from './data/dummyJson';
import { cloneDeep } from 'lodash';
import { faPlus } from '@fortawesome/pro-light-svg-icons';

const meta = {
  title: 'Shared UI/FilterForm',
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'fullScreen',
  },
  tags: ['autodocs'],
} satisfies Meta<any>;

export default meta;

type Story = StoryObj<any>;

export const Filterform: Story = {
  render: () => {
    const onFilterChange = (values) => {
      console.log('values', values);
    };

    const height = { height: '500px' };
    function optionRenderer(option, selected) {
      return (
        <div>
          <span>{option.label}</span>
          <span className="bg-red-500">{option.label}</span>
        </div>
      );
    }

    const [config, setConfig] = useState<any>([]);

    useEffect(() => {
      let fConfig = cloneDeep(filterConfig);
      // for(let i=0; i<fConfig.length; i++) {
      //   if(fConfig[i].type === 'dropdown' || fConfig[i].type === 'infiniteDropdown') {
      //     fConfig[i]['optionRenderer'] = optionRenderer;
      //     fConfig[i]['hideLabelOnSelect'] = true
      //   }
      // }
      setConfig(fConfig);
    }, []);

    return (
      <div className="bg-card p-2" style={height}>
        {config?.length > 0 && (
          <FilterForm
            // specificSearchToolTipText={'Type keywords to search'}
            // multiAttributeSearch={true}
            searchAttributes={[
              {
                id: 'Student',
                label: 'Student Name',
              },
              {
                id: 'availability',
                label: 'Availability Name',
              },
              {
                id: 'DisplayId',
                label: 'Schedule ID',
              },
            ]}
            searchable={true}
            addFilter={true}
            config={config}
            onFilterChange={onFilterChange}
            // searchInputClassName="text-red-500 rounded-full border-2 border-red-500"
            addIcon={faPlus}
            // addFilterButtonClassName="text-red-500 rounded-full border-2 border-red-500"
            // showMoreFiltersButtonClassName="text-red-500 rounded-full border-2 border-red-500"
            // resetButtonClassName="text-red-500 rounded-full border-2 border-red-500"
          />
        )}
        {config?.length > 0 && (
          <FilterForm
            // specificSearchToolTipText={'Type keywords to search'}
            // multiAttributeSearch={true}
            searchAttributes={[
              {
                id: 'Student',
                label: 'Student Name',
              },
              {
                id: 'availability',
                label: 'Availability Name',
              },
              {
                id: 'DisplayId',
                label: 'Schedule ID',
              },
            ]}
            isDarkTheme={true}
            searchable={true}
            addFilter={true}
            config={config}
            onFilterChange={onFilterChange}
            // searchInputClassName="text-red-500 rounded-full border-2 border-red-500"
            addIcon={faPlus}
            // addFilterButtonClassName="text-red-500 rounded-full border-2 border-red-500"
            // showMoreFiltersButtonClassName="text-red-500 rounded-full border-2 border-red-500"
            // resetButtonClassName="text-red-500 rounded-full border-2 border-red-500"
          />
        )}
      </div>
    );
  },
};
