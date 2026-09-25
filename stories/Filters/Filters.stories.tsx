import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { ThemeDecorator } from '../ThemeDecorator';
import { FilterForm } from '../../libs/ui';
import { filterConfig } from '../shared-ui/data/dummyJson';
import { faChartPie, faCourtSport, faSportsball } from '@fortawesome/pro-light-svg-icons';

const meta = {
  title: 'Filters/Select',
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'fullScreen',
  },
  tags: ['autodocs'],
} satisfies Meta<any>;

export default meta;

type Story = StoryObj<any>;

const SingleSelectOptions = [
  {
    value: '1',
    label: 'Michael Jordan (Basketball)',
    id: 'Michael Jordan',
  },
  {
    value: '2',
    label: 'Serena Williams (Tennis)',
    id: 'Serena Williams',
  },
  {
    value: '3',
    label: 'Usain Bolt (Track and Field)',
    id: 'Usain Bolt',
  },
  {
    value: '4',
    label: 'Lionel Messi (Football/Soccer)',
    id: 'Lionel Messi',
  },
  {
    value: '5',
    label: 'LeBron James (Basketball)',
    id: 'LeBron James',
  },
  {
    value: '6',
    label: 'Cristiano Ronaldo (Football/Soccer)',
    id: 'Cristiano Ronaldo',
  },
  {
    value: '7',
    label: 'Tiger Woods (Golf)',
    id: 'Tiger Woods',
  },
  {
    value: '8',
    label: 'Roger Federer (Tennis)',
    id: 'Roger Federer',
  },
  {
    value: '9',
    label: 'Muhammad Ali (Boxing)',
    id: 'Muhammad Ali',
  },
  {
    value: '10',
    label: 'Tom Brady (American Football)',
    id: 'Tom Brady',
  },
  {
    value: '11',
    label: 'Simone Biles (Gymnastics)',
    id: 'Simone Biles',
  },
  {
    value: '12',
    label: 'Michael Phelps (Swimming)',
    id: 'Michael Phelps',
  },
  {
    value: '13',
    label: 'Kobe Bryant (Basketball)',
    id: 'Kobe Bryant',
  },
  {
    value: '14',
    label: 'Sachin Tendulkar (Cricket)',
    id: 'Sachin Tendulkar',
  },
  {
    value: '15',
    label: 'Floyd Mayweather (Boxing)',
    id: 'Floyd Mayweather',
  },
  {
    value: '16',
    label: 'Kylian Mbappé (Football/Soccer)',
    id: 'Kylian Mbappé',
  },
  {
    value: '17',
    label: 'Vladimir Putin (Judo)',
    id: 'Vladimir Putin',
  },
  {
    value: '18',
    label: 'Manny Pacquiao (Boxing)',
    id: 'Manny Pacquiao',
  },
  {
    value: '19',
    label: 'Mia Hamm (Soccer)',
    id: 'Mia Hamm',
  },
  {
    value: '20',
    label: 'Nadia Comăneci (Gymnastics)',
    id: 'Nadia Comăneci',
  },
];

const defaultSelectedSingle = {
  value: '8',
  label: 'Roger Federer (Tennis)',
  id: 'Roger Federer',
};

const defaultSelectedMulti = [
  {
    value: '6',
    label: 'Cristiano Ronaldo (Football/Soccer)',
    id: 'Cristiano Ronaldo',
  },
  {
    value: '7',
    label: 'Tiger Woods (Golf)',
    id: 'Tiger Woods',
  },
  {
    value: '8',
    label: 'Roger Federer (Tennis)',
    id: 'Roger Federer',
  },
];

export const SingleSelect: Story = {
  render: () => {
    const onFilterChange = (values) => {
      console.log(values);
    };

    const height = { height: '500px' };

    return (
      <div className="bg-card p-2" style={height}>
        <FilterForm
          config={[
            {
              id: 'singleDrop',
              type: 'dropdown',
              label: 'Sports Personalities',
              options: SingleSelectOptions,
              name: 'Single select',
              icon: faSportsball,
              searchable: true,
              placeholder: 'Select Your favourite Athelete',
              defaultValue: defaultSelectedSingle,
            },
          ]}
          onFilterChange={onFilterChange}
        />
      </div>
    );
  },
};

export const MultiSelect: Story = {
  render: () => {
    const onFilterChange = (values) => {
      console.log(values);
    };

    const height = { height: '500px' };

    return (
      <div className="bg-card p-2" style={height}>
        <FilterForm
          config={[
            {
              id: 'multiDrop',
              type: 'dropdown',
              label: 'Multi select',
              options: SingleSelectOptions,
              name: 'Multi Althletes',
              multiple: true,
              searchable: true,
              icon: faCourtSport,
              placeholder: 'Select multiple Athletes',
              selectAllRequired: true,
              defaultValues: defaultSelectedMulti,
            },
          ]}
          onFilterChange={onFilterChange}
        />
      </div>
    );
  },
};

export const InfinitePaginationSelect: Story = {
  render: () => {
    const onFilterChange = (values) => {
      console.log(values);
    };

    const height = { height: '500px' };
    const fetchOptions = (query) => {
      const params = query.params;
      const searchedText = query.debouncedSearch;
      return new Promise((resolve) => {
        setTimeout(() => {
          let data = Array.from({ length: 20 }, (_, index) => ({
            value: `${params.pageParam * 20 + index + 1}`,
            label: `Option ${params.pageParam * 20 + index + 1}`,
            id: `Option ${params.pageParam * 20 + index + 1}`,
          }));
          let count = 300;
          if (searchedText) {
            data = data.filter((option) =>
              option.label.toLowerCase().includes(searchedText.toLowerCase())
            );
            count = data.length;
          }
          const result = { data: data, totalCount: count };
          console.log(result);
          console.log(query);
          resolve(result);
        }, 1000); // Simulate 1 second delay
      });
    };
    const defaultSelectedServer = [
      {
        value: '22',
        label: 'Option 22',
        id: 'Option 22',
      },
      {
        value: '23',
        label: 'Option 23',
        id: 'Option 23',
      },
      {
        value: '42',
        label: 'Option 42',
        id: 'Option 42',
      },
      {
        value: '43',
        label: 'Option 43',
        id: 'Option 43',
      },
      {
        value: '82',
        label: 'Option 82',
        id: 'Option 82',
      },
      {
        value: '83',
        label: 'Option 83',
        id: 'Option 83',
      },
    ];
    return (
      <div className="bg-card p-2" style={height}>
        <FilterForm
          config={[
            {
              id: 'infiPagination',
              type: 'infiniteDropdown',
              label: 'Infinite Pagination',
              options: SingleSelectOptions,
              defaultValues: defaultSelectedServer,
              multiple: true,
              searchable: true,
              icon: faCourtSport,
              placeholder: 'Select multiple Athletes',
              selectAllRequired: true,
              callback: fetchOptions,
            },
          ]}
          onFilterChange={onFilterChange}
        />
      </div>
    );
  },
};

export const ChipSelect: Story = {
  render: () => {
    const onFilterChange = (values) => {
      console.log(values);
    };

    const height = { height: '500px' };
    const ChipSelectData = [
      {
        id: 'the-rock',
        label: 'The Rock',
        value: 'The Rock',
        bgColor: '#FFDD80',
        borderColor: '#FFBB33',
        textColor: '#FF6F00',
      },
      {
        id: 'stone-cold',
        label: 'Stone Cold Steve Austin',
        value: 'Stone Cold Steve Austin',
        bgColor: '#A5D6A7',
        borderColor: '#66BB6A',
        textColor: '#1B5E20',
      },
      {
        id: 'undertaker',
        label: 'The Undertaker',
        value: 'The Undertaker',
        bgColor: '#9E9E9E',
        borderColor: '#616161',
        textColor: '#212121',
      },
      {
        id: 'john-cena',
        label: 'John Cena',
        value: 'John Cena',
        bgColor: '#80DEEA',
        borderColor: '#00BCD4',
        textColor: '#006064',
      },
      {
        id: 'randy-orton',
        label: 'Randy Orton',
        value: 'Randy Orton',
        bgColor: '#FFAB91',
        borderColor: '#FF7043',
        textColor: '#BF360C',
      },
      {
        id: 'triple-h',
        label: 'Triple H',
        value: 'Triple H',
        bgColor: '#D1C4E9',
        borderColor: '#7E57C2',
        textColor: '#4A148C',
      },
      {
        id: 'brock-lesnar',
        label: 'Brock Lesnar',
        value: 'Brock Lesnar',
        bgColor: '#FFCDD2',
        borderColor: '#EF5350',
        textColor: '#C62828',
      },
      {
        id: 'edge',
        label: 'Edge',
        value: 'Edge',
        bgColor: '#FFECB3',
        borderColor: '#FFB300',
        textColor: '#BF360C',
      },
      {
        id: 'batista',
        label: 'Batista',
        value: 'Batista',
        bgColor: '#F8BBD0',
        borderColor: '#EC407A',
        textColor: '#880E4F',
      },
    ];

    return (
      <div className="bg-card p-2" style={height}>
        <FilterForm
          config={[
            {
              id: 'chipDrop',
              type: 'dropdown',
              label: 'Chip select',
              options: ChipSelectData,
              multiple: true,
              name: 'Chip select',
              icon: faChartPie,
              isChip: true,
            },
          ]}
          onFilterChange={onFilterChange}
        />
      </div>
    );
  },
};

export const SearchableFilters: Story = {
  render: () => {
    const onFilterChange = (values) => {
      console.log(values);
    };

    const height = { height: '500px' };

    return (
      <div className="bg-card p-2" style={height}>
        <FilterForm
          searchable={true}
          addFilter={true}
          config={filterConfig}
          onFilterChange={onFilterChange}
        />
      </div>
    );
  },
};

export const SearchableWithDropdownFilters: Story = {
  render: () => {
    const onFilterChange = (values) => {
      console.log(values);
    };

    const height = { height: '500px' };

    return (
      <div className="bg-card p-2" style={height}>
        <FilterForm
          searchable={true}
          multiAttributeSearch={true}
          searchAttributes={[
            { id: 'student', label: 'Students' },
            { id: 'faculty', label: 'Clinical Instructor' },
            { id: 'availability', label: 'Availability Name' },
          ]}
          addFilter={true}
          config={filterConfig}
          onFilterChange={onFilterChange}
          searchWidth="350"
        />
      </div>
    );
  },
};

export const HiddenFilters: Story = {
  render: () => {
    const onFilterChange = (values) => {
      console.log(values);
    };

    const height = { height: '500px' };

    return (
      <div className="bg-card p-2" style={height}>
        <FilterForm
          searchable={true}
          addFilter={true}
          config={filterConfig}
          onFilterChange={onFilterChange}
        />
      </div>
    );
  },
};

export const AddFilters: Story = {
  render: () => {
    const onFilterChange = (values) => {
      console.log(values);
    };

    const height = { height: '500px' };

    return (
      <div className="bg-card p-2" style={height}>
        <FilterForm
          searchable={true}
          addFilter={true}
          config={filterConfig}
          onFilterChange={onFilterChange}
        />
      </div>
    );
  },
};
