/* eslint-disable object-shorthand */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/jsx-key */

import classNames from 'classnames';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';

import { InfiniteScrollHandle, InfiniteScrollProps } from './types';

const InfiniteScroll = forwardRef<InfiniteScrollHandle, InfiniteScrollProps>(
  (
    {
      fetchDataOnScroll,
      onDataLoad,
      children,
      queryKey,
      pageSize,
      containerHeight,
      reRenderTrigger,
      id = 'scrollableDiv',
      a11yRoleType,
    },
    ref
  ): JSX.Element => {
    const queryClient = useQueryClient();
    const containerRef = React.useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      clearData: () => {
        queryClient.removeQueries({ queryKey: [queryKey, reRenderTrigger] });
      },
      getData: () => queryClient.getQueryData([queryKey, reRenderTrigger]),
      setData: (data) => queryClient.setQueryData([queryKey, reRenderTrigger], data),
      refresh: async () => {
        await queryClient.invalidateQueries({ queryKey: [queryKey, reRenderTrigger] });
        const result = await refetch();
        return result;
      },
    }));

    const { data, fetchNextPage, isFetching, isFetchingNextPage, isSuccess, refetch }: any =
      useInfiniteQuery({
        queryKey: [queryKey, reRenderTrigger],
        queryFn: async ({ pageParam = { page: 1, pageSize: pageSize } }) =>
          await fetchDataOnScroll({ pageParam }),
        initialPageParam: { page: 1, pageSize: pageSize },
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
          return { page: lastPageParam.page + 1, pageSize: lastPageParam.pageSize };
        },
        refetchOnWindowFocus: false,
      });

    const flatData = React.useMemo(
      () =>
        data?.pages !== undefined && data?.pages.length > 0
          ? data?.pages?.flatMap((page: any) => page?.data ?? page)
          : [],
      [data, reRenderTrigger]
    );
    const totalDBRowCount = data?.pages?.[0]?.totalCount ?? 0;
    const totalFetched = flatData.length;

    useEffect(() => {
      isSuccess && onDataLoad && onDataLoad(data?.pages ?? [], queryKey);
    }, [isSuccess, totalFetched, reRenderTrigger]);

    const fetchMoreOnBottomReached = (containerRefElement?: HTMLDivElement | null) => {
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
    };

    function getFlatData() {
      return flatData;
    }

    return (
      <div className={classNames(`${containerHeight}`)} id={id}>
        <div
          className="mt-4 h-full overflow-auto pb-4"
          onScroll={(e) => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
          ref={containerRef}
          role={a11yRoleType ?? ''}
        >
          {children(getFlatData)}
          {totalDBRowCount > 0 && (isFetching || isFetchingNextPage) && (
            <div role="status" className="animate-pulse p-4">
              <div className="mb-2.5 h-2 rounded-full bg-gray-300"></div>
              <div className="mb-2.5 h-2 rounded-full bg-gray-300"></div>
              <div className="bg-opacity-70 mb-2.5 h-2 rounded-full bg-gray-400"></div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default InfiniteScroll;
