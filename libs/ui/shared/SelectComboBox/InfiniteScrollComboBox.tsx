/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import useDebounce from '../../../utilities/utils/debounce';
import React, { useEffect, useState } from 'react';
import Select, { type MenuPlacement } from 'react-select';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';

const InfiniteScrollComboBox = ({
  fetchDataOnScroll,
  queryKey,
  onSelect,
  searchable = true,
  placeholder,
  defaultValues,
  disabled = false,
  menuPlacement = 'top',
  isMulti = true,
  id = 'paginated_select',
}: {
  fetchDataOnScroll: (query: any) => Promise<any>;
  queryKey: string[];
  onSelect: (rowData: any) => void;
  defaultValues: any[];
  placeholder?: string;
  searchable?: boolean;
  maxHeight?: string;
  minHeight?: string;
  disabled?: boolean;
  menuPlacement?: MenuPlacement;
  isMulti?: boolean;
  id?: string;
}) => {
  const comboBoxRef = React.useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const debouncedSearch = useDebounce(query, 500);
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.clear();
  }, [debouncedSearch]);

  const { data, status, error, fetchNextPage, isFetching, hasNextPage, refetch } = useInfiniteQuery(
    {
      queryKey: queryKey,
      queryFn: (params) => fetchDataOnScroll({ params, debouncedSearch }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages, lastPageParam) => {
        const nextPage = lastPageParam + 1;
        return nextPage;
      },
      refetchOnWindowFocus: false,
    }
  );

  const flatData = React.useMemo(() => data?.pages?.flatMap((page) => page.data) ?? [], [data]);
  const totalDBRowCount = data?.pages?.[0]?.totalCount ?? 0;
  const totalFetched = flatData.length;

  const fetchMoreOnBottomReached = React.useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;

        if (
          scrollHeight - scrollTop - clientHeight < 300 &&
          !isFetching &&
          totalFetched < totalDBRowCount
        ) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount]
  );
  React.useEffect(() => {
    fetchMoreOnBottomReached(comboBoxRef.current);
  }, [fetchMoreOnBottomReached]);

  const loadingOption = {
    value: 'loading',
    label: 'Loading...',
    isDisabled: true,
  };

  return (
    <div>
      <div className="bg-card w-full rounded-bl-md border-gray-200">
        <div>
          <Select
            menuPortalTarget={document.body}
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            }}
            defaultValue={defaultValues ? defaultValues : []}
            isMulti={isMulti}
            id={id}
            options={isFetching ? [...flatData, loadingOption] : flatData}
            placeholder={placeholder ? placeholder : 'Search'}
            maxMenuHeight={240}
            onMenuScrollToBottom={(e) => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
            ref={comboBoxRef}
            menuPlacement={menuPlacement}
            isSearchable={searchable}
            onInputChange={(e) => {
              setQuery(e);
            }}
            onChange={onSelect}
            isDisabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};

export default InfiniteScrollComboBox;
