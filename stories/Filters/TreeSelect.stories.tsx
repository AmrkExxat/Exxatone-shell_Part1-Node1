import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { ThemeDecorator } from '../ThemeDecorator';
import { FilterForm } from '../../libs/ui';
import { faCar, faHospital } from '@fortawesome/pro-light-svg-icons';

const meta = {
  title: 'Filters/TreeSelect',
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'fullScreen',
  },
  tags: ['autodocs'],
} satisfies Meta<any>;

export default meta;

type Story = StoryObj<any>;

export const TreeSelect: Story = {
  render: () => {
    const onFilterChange = (values) => {
      console.log(values);
    };

    const height = { height: '500px' };

    const filterOptions = [
      {
        id: 'audi',
        label: 'Audi',
        checked: false,
        indeterminate: false,
        type: 'parent',
        unncesessaryKey: true,
        children: [
          {
            id: 'audi-a3',
            label: 'Audi A3',
            checked: false,
            indeterminate: false,
            children: [],
            type: 'child',
            unncesessaryKey: true,
          },
          {
            id: 'audi-a6',
            label: 'Audi A6',
            checked: false,
            indeterminate: false,
            children: [],
            type: 'child',
            unncesessaryKey: true,
          },
          {
            id: 'audi-q7',
            label: 'Audi Q7',
            checked: false,
            indeterminate: false,
            children: [],
            type: 'child',
            unncesessaryKey: true,
          },
        ],
      },
      {
        id: 'bmw',
        label: 'BMW',
        checked: false,
        indeterminate: false,
        type: 'parent',
        unncesessaryKey: true,
        children: [
          {
            id: 'bmw-3-series',
            label: 'BMW 3 Series',
            checked: false,
            indeterminate: false,
            children: [],
            type: 'child',
            unncesessaryKey: true,
          },
          {
            id: 'bmw-x5',
            label: 'BMW X5',
            checked: false,
            indeterminate: false,
            children: [],
            type: 'child',
            unncesessaryKey: true,
          },
        ],
      },
      {
        id: 'mercedes-benz',
        label: 'Mercedes-Benz',
        checked: false,
        indeterminate: false,
        type: 'parent',
        unncesessaryKey: true,
        children: [
          {
            id: 'mercedes-benz-e-class',
            label: 'Mercedes-Benz E-Class',
            checked: false,
            indeterminate: false,
            children: [],
            type: 'child',
            unncesessaryKey: true,
          },
          {
            id: 'mercedes-benz-g-class',
            label: 'Mercedes-Benz G-Class',
            checked: false,
            indeterminate: false,
            children: [],
            type: 'child',
            unncesessaryKey: true,
          },
          {
            id: 'mercedes-benz-s-class',
            label: 'Mercedes-Benz S-Class',
            checked: false,
            indeterminate: false,
            children: [],
            type: 'child',
            unncesessaryKey: true,
          },
        ],
      },
      {
        id: 'porsche',
        label: 'Porsche',
        checked: false,
        indeterminate: false,
        type: 'parent',
        unncesessaryKey: true,
        children: [
          {
            id: 'porsche-911',
            label: 'Porsche 911',
            checked: false,
            indeterminate: false,
            children: [],
            type: 'child',
            unncesessaryKey: true,
          },
          {
            id: 'porsche-cayenne',
            label: 'Porsche Cayenne',
            checked: false,
            indeterminate: false,
            children: [],
            type: 'child',
            unncesessaryKey: true,
          },
        ],
      },
      {
        id: 'lamborghini',
        label: 'Lamborghini',
        checked: false,
        indeterminate: false,
        type: 'parent',
        unncesessaryKey: true,
        children: [
          {
            id: 'lamborghini-aventador',
            label: 'Lamborghini Aventador',
            checked: false,
            indeterminate: false,
            children: [],
            type: 'child',
            unncesessaryKey: true,
          },
          {
            id: 'lamborghini-huracan',
            label: 'Lamborghini Huracan',
            checked: false,
            indeterminate: false,
            children: [],
            type: 'child',
            unncesessaryKey: true,
          },
        ],
      },
      {
        id: 'rolls-royce',
        label: 'Rolls-Royce',
        checked: false,
        indeterminate: false,
        type: 'parent',
        unncesessaryKey: true,
        children: [
          {
            id: 'rolls-royce-phantom',
            label: 'Rolls-Royce Phantom',
            checked: false,
            indeterminate: false,
            children: [],
            type: 'child',
            unncesessaryKey: true,
          },
          {
            id: 'rolls-royce-cullinan',
            label: 'Rolls-Royce Cullinan',
            checked: false,
            indeterminate: false,
            children: [],
            type: 'child',
            unncesessaryKey: true,
          },
        ],
      },
      {
        id: 'ferrari',
        label: 'Ferrari',
        checked: false,
        indeterminate: false,
        type: 'parent',
        unncesessaryKey: true,
        children: [
          {
            id: 'ferrari-488',
            label: 'Ferrari 488',
            checked: false,
            indeterminate: false,
            children: [],
            type: 'child',
            unncesessaryKey: true,
          },
          {
            id: 'ferrari-portofino',
            label: 'Ferrari Portofino',
            checked: false,
            indeterminate: false,
            children: [],
            type: 'child',
            unncesessaryKey: true,
          },
        ],
      },
    ];

    const defaultSelections = [
      {
        id: 'audi',
        children: [
          {
            id: 'audi-a3',
          },
          {
            id: 'audi-q7',
          },
        ],
      },
      {
        id: 'bmw',
        children: [
          {
            id: 'bmw-3-series',
          },
        ],
      },
      {
        id: 'mercedes-benz',
        children: [
          {
            id: 'mercedes-benz-s-class',
          },
        ],
      },
      {
        id: 'rolls-royce',
        children: [
          {
            id: 'rolls-royce-phantom',
          },
        ],
      },
      {
        id: 'ferrari',
        children: [
          {
            id: 'ferrari-488',
          },
        ],
      },
    ];

    return (
      <div className="bg-card p-2" style={height}>
        <FilterForm
          config={[
            {
              id: 'disciplinceAndSpecialization',
              type: 'treeDropdown',
              label: 'Luxury Cars',
              parentLabel: 'Specialization',
              placeholder: 'Search for one or more Luxury Cars',
              options: filterOptions,
              icon: faCar,
              showSelected: true,
              defaultValues: defaultSelections,
            },
          ]}
          onFilterChange={onFilterChange}
        />
      </div>
    );
  },
};
