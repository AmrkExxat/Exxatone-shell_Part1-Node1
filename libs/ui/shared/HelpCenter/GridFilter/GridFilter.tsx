'use client';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { myTicketFilterConfig } from '../MyTickets/MyTicketsColumn';
import { FilterForm } from '../../FilterForm';
import { cloneDeep } from 'lodash';

export interface TicketFilter {
  created?: {
    from?: Date | string;
    to?: Date | string;
  };
  updated?: {
    from?: Date | string;
    to?: Date | string;
  };
  status?: any[];
  search?: string;
}

const status = {
  new: ['new'],
  'in-progress': ['open', 'pending', 'hold'],
  closed: ['solved', 'closed'],
};

const GridFilter = ({
  filterData,
  updateFilter,
}: {
  filterData?: any;
  updateFilter?: (query: any) => any;
}): JSX.Element => {
  const [data, setData] = useState<TicketFilter>(filterData ? filterData : {});
  const [filterConfig, setFilterConfig] = useState<any>([]);

  useEffect(() => {
    let stringFilter: any = localStorage.getItem('helpFilterData');
    let filters;
    if (stringFilter) {
      filters = JSON.parse(stringFilter);
      if (typeof filters === 'object' && Object.keys(filters)?.length) {
        setData(filters);
        getSearchQuery(filters);
      }
    }
    let config = myTicketFilterConfig(filters ?? {});
    setFilterConfig(config);
  }, []);

  const getSearchQuery = (filter) => {
    let searchQuery = '';
    if (filter?.created?.start) {
      searchQuery += 'created>' + filter?.created?.start + ' ';
    }
    if (filter?.created?.end) {
      searchQuery += 'created<' + filter?.created?.end + ' ';
    }
    if (filter?.updated?.start) {
      searchQuery += 'updated>' + filter?.updated?.start + ' ';
    }
    if (filter?.updated?.end) {
      searchQuery += 'updated<' + filter?.updated?.end + ' ';
    }
    if (filter?.status?.length) {
      filter.status.forEach((st) => {
        let stat = st.value;
        if (stat && status[stat] && status[stat].length) {
          for (let i = 0; i < status[stat].length; i++) {
            searchQuery += 'status:' + status[stat][i] + ' ';
          }
        }
      });
    }
    localStorage.setItem('helpFilterData', JSON.stringify(filter));
    if (updateFilter)
      updateFilter({ query: encodeURIComponent(searchQuery), searchedText: filter?.search ?? '' });
  };

  const clearFilters = () => {
    setData({});
    localStorage.removeItem('helpFilterData');
    if (updateFilter) updateFilter('');
  };

  const onFilter = (e) => {
    let values = cloneDeep(e);
    if (values?.created?.start) {
      values.created.start = moment(values.created.start).format('YYYY-MM-DD');
    }
    if (values?.created?.end) {
      values.created.end = moment(values.created.end).format('YYYY-MM-DD');
    }
    if (values?.updated?.start) {
      values.updated.start = moment(values.updated.start).format('YYYY-MM-DD');
    }
    if (values?.updated?.end) {
      values.updated.end = moment(values.updated.end).format('YYYY-MM-DD');
    }
    getSearchQuery(values);
    localStorage.setItem('helpFilterData', JSON.stringify(values));
  };

  return (
    <div>
      {filterConfig?.length > 0 && (
        <FilterForm
          searchable={true}
          addFilter={false}
          config={filterConfig}
          onFilterChange={onFilter}
          searchPlaceholder="Search by availability name"
          searchText={data?.search ?? ''}
          onFilterReset={clearFilters}
        />
      )}
    </div>
  );
};

export default GridFilter;
