import React, { useEffect, useState, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';

import { ThemeDecorator } from '../ThemeDecorator';
import { SyncfusionTreeGrid } from '../../libs/ui';

const meta = {
  title: 'SyncFusion/SyncFusion/Tree Grid',
  component: SyncfusionTreeGrid,
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'fullScreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SyncfusionTreeGrid>;

export default meta;

type Story = StoryObj<typeof SyncfusionTreeGrid>;

let count = 0;

function addGuidsToArray<T extends object>(
  arr: T[],
  key: string = 'id'
): (T & { [k: string]: string })[] {
  return arr.map((item) => ({
    ...item,
    [key]: crypto.randomUUID(),
  }));
}

export const SyncFusionTreeGridStory: Story = {
  render: () => {
    const gridRef = useRef();
    const [columns, setColumns] = useState([]);

    const columnsList = [];

    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    const fetchData = async () => {
      const da = [];

      await sleep(2000); // sleep for 2 seconds

      for (let i = 0; i < 21; i++) {
        da.push({
          ...data[i],
          name: `${data[i].name}_${count + 1}_index`,
        });
        count = ++count;
      }

      return {
        data: addGuidsToArray(da, 'id'),
        totalCount: 210,
      };
    };

    useEffect(() => {
      setColumns(columnsList);
    }, []);

    return (
      <SyncfusionTreeGrid
        ref={gridRef}
        columns={columns}
        fetchData={fetchData}
        filterPayload={{}}
        configureColumns={true}
        allowSorting={true}
        allowResizing={true}
        allowReordering={true}
        checkboxSelection={true}
        showSelectAll={true}
      >
        <div></div>
      </SyncfusionTreeGrid>
    );
  },
};
