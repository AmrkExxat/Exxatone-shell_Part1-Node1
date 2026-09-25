import React, { createRef, RefObject, useCallback, useEffect, useState } from 'react';
import {
  NotificationDrawerFunctions,
  NotificationDrawerInitialState,
  NotificationDrawerProps,
  NotificationDrawerStateType,
  NotificationItemType,
} from './types';
import {
  Button,
  Drawer,
  InfiniteScroll,
  InfiniteScrollHandle,
  Skeleton,
  Spinner,
  Tabs,
  ToggleSwitch,
  Tooltip,
} from '../../components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faGear, faXmark } from '@fortawesome/pro-light-svg-icons';
// import { faEnvelopes, faMailbox, faMessages } from '@fortawesome/pro-duotone-svg-icons';

import { faEnvelopes, faMailbox, faMessages } from '@fortawesome/pro-solid-svg-icons';
import { NotificationItem } from './components';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const PAGE_SIZE = 10;

const queryClient = new QueryClient();
interface TabProps {
  title: string | React.ReactNode;
  name?: string;
  icon?: React.ReactNode;
  badge?: number;
  totalCount?: number;
  query?: string;
  href?: string;
  subtext?: string | number | React.ReactNode;
  scrollId: string;
  scrollRef?: RefObject<InfiniteScrollHandle>;
}

let _tabs: TabProps[] = [
  {
    title: 'All',
    name: 'All',
    icon: <FontAwesomeIcon icon={faEnvelopes as IconProp} className="text-blue-500" />,
    badge: 0,
    totalCount: 0,
    scrollId: 'all',
  },
  {
    title: 'All Messages',
    name: 'All Messages',
    icon: <FontAwesomeIcon icon={faMessages as IconProp} className="text-green-600" />,
    badge: 0,
    totalCount: 0,
    scrollId: 'message',
  },
  {
    title: 'All Updates',
    name: 'All Updates',
    icon: <FontAwesomeIcon icon={faMailbox as IconProp} className="text-purple-500" />,
    badge: 0,
    totalCount: 0,
    scrollId: 'update',
  },
];

const DEFAULT_TAB_INDEX = 0;
const MAX_TAB_INDEX = _tabs.length - 1;
const DEFAULT_UNREAD_ONLY = false;

const getInitialTabIndex = (tabIndexProp?: number) => {
  if (tabIndexProp == null) {
    return DEFAULT_TAB_INDEX;
  }
  return Math.min(Math.max(tabIndexProp, DEFAULT_TAB_INDEX), MAX_TAB_INDEX);
};

const getInitialUnreadOnly = (unreadOnlyProp?: boolean) => unreadOnlyProp ?? DEFAULT_UNREAD_ONLY;

const NotificationDrawer = React.forwardRef((props: NotificationDrawerProps, ref: any) => {
  const [state, setState] = useState<NotificationDrawerStateType>(NotificationDrawerInitialState);
  const [showUnreadOnly, setShowUnreadOnly] = useState(() =>
    getInitialUnreadOnly(props.unreadOnly)
  );
  const [tabIndex, setTabIndex] = useState<number>(() => getInitialTabIndex(props.tabIndex));
  const [tabs, setTabs] = useState<TabProps[] | []>(_tabs);
  const [spin, setSpin] = useState<boolean>(false);

  useEffect(() => {
    if (typeof props?.topReload === 'boolean') {
      setSpin(props?.topReload);
    }
  }, [props?.topReload]);

  useEffect(() => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) => ({ ...tab, scrollRef: createRef<InfiniteScrollHandle>() }))
    );
  }, []);

  const getData = useCallback(
    (getFlatData: () => NotificationItemType[]) => {
      let data = getFlatData();
      return data.map((message: NotificationItemType, i: number) => (
        <div key={i} role="listitem">
          <NotificationItem
            message={message}
            onMessageClick={props?.onMessageClick}
            onMessageMarkAsReadClick={async (data) => {
              await props?.onMessageMarkAsReadClick(data);
              tabs.forEach(async (tab) => await tab.scrollRef?.current?.refresh());
            }}
            icon={
              message.type?.toLowerCase() === 'message' ? (
                <FontAwesomeIcon
                  icon={faMessages}
                  className="h-4 w-4 pr-2 text-[#3DA709]"
                  aria-hidden="true"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faMailbox}
                  className="h-4 w-4 pr-2 text-[#985CF6]"
                  aria-hidden="true"
                />
              )
            }
          />
        </div>
      ));
    },
    [tabs, tabIndex]
  );

  const onDataLoad = (
    pageData: { totalCount: number; data: NotificationItemType[] }[],
    key: string
  ) => {
    setState((prev) => ({
      ...prev,
      loading: false,
    }));

    setTabs((prevTabs) =>
      prevTabs.map((tab, index) => {
        if (Number(key) === index) {
          const badgeCount = pageData.reduce(
            (sum, section) => sum + (section.data?.length || 0),
            0
          );
          return {
            ...tab,
            badge: badgeCount,
            totalCount: Array.isArray(pageData) ? pageData[0]?.totalCount : 0,
          };
        }
        return tab;
      })
    );
  };

  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({ ...prev, loading: true }));
    setShowUnreadOnly(event.target.checked);
  };

  //#region [Drawer Methods]

  const handleDrawer = (drawerStateData: any) => {
    if (spin) {
      setSpin(false);
    }
    if (drawerStateData?.open) {
      setTabIndex(getInitialTabIndex(props.tabIndex));
      setShowUnreadOnly(getInitialUnreadOnly(props.unreadOnly));
    }
    setState(drawerStateData);
  };

  const closeDrawer = () => {
    tabs.forEach((tab) => tab?.scrollRef?.current?.clearData());
    if (spin) {
      setSpin(false);
    }
    setTabIndex(DEFAULT_TAB_INDEX);
    setShowUnreadOnly(DEFAULT_UNREAD_ONLY);
    setState(NotificationDrawerInitialState);
  };

  React.useImperativeHandle(ref, (): NotificationDrawerFunctions => {
    return {
      handleDrawer,
      closeDrawer,
    };
  });

  const handleTabChange = (index: number) => {
    setTabIndex(index);
  };

  //#endregion

  return (
    <Drawer
      drawerOpen={state.open}
      size="small"
      drawer={{
        title: props?.drawerTitle ? props?.drawerTitle : 'Notifications',
        onClose: () => closeDrawer(),
      }}
      actionButtons={
        <div className="flex w-full flex-row items-center justify-between gap-3" id="DrawerHeader">
          <div className="flex flex-shrink-0 items-center space-x-2">
            <Button
              variant="link"
              key="3"
              className="focus-indicator flex cursor-pointer items-center justify-center gap-2"
              id="header_notification_mark_all_read_btn"
              testid="header_notification_mark_all_read_btn"
              aria-label="Mark all read"
              onClick={async () => {
                setState((prev) => ({ ...prev, loading: true }));
                await props?.onMarkAllRead();
                await Promise.all(tabs.map((tab) => tab.scrollRef?.current?.refresh()));
                setState((prev) => ({ ...prev, loading: false }));
              }}
            >
              <div className="flex flex-row items-center justify-center gap-2">
                <FontAwesomeIcon
                  icon={state.toggleAllRead ? faXmark : faCheck}
                  className="text-primary h-5 w-5"
                  aria-hidden="true"
                />
                {state.toggleAllRead ? 'Mark all Unread' : 'Mark all Read'}
              </div>
            </Button>
          </div>

          <div className="mx-3 h-6 border-l border-gray-200"></div>

          <div className="flex flex-shrink-0 items-center space-x-2">
            <span className="text-sm">Unread Only</span>
            <ToggleSwitch
              id="unreadToggle"
              checked={showUnreadOnly}
              onChange={handleToggleChange}
              ariaLabel="Unread Only"
            />
          </div>

          {props?.showSettingsIcon && (
            <>
              <div className="mx-3 h-6 border-l border-gray-200"></div>
              <div className="flex flex-shrink-0 items-center space-x-2">
                <Tooltip
                  tabIndex={0}
                  triggerElement={() => {
                    return (
                      <Button
                        variant="basic"
                        id="icon-btn"
                        testid="icon-btn"
                        onClick={() => {
                          props?.onSettingClick();
                          closeDrawer();
                        }}
                        aria-label="setting"
                      >
                        <FontAwesomeIcon icon={faGear} className="h-5 w-5" aria-hidden="true" />
                      </Button>
                    );
                  }}
                  tooltip={() => {
                    return <div className="w-full p-2">Notification Configuration</div>;
                  }}
                />
              </div>
            </>
          )}
        </div>
      }
    >
      <div className={`${spin ? 'relative' : ''} flex h-full flex-col`} id="notificationTabs">
        {spin && (
          <div className="absolute z-20 flex h-full w-full items-center justify-center bg-white/30 backdrop-blur-[1px]">
            <Spinner size="lg" />
          </div>
        )}
        <div className="bg-card sticky top-0 z-10 flex-shrink-0 border-b border-gray-200">
          {state?.loading ? (
            <div className="p-4">
              <Skeleton lines={2} type={'default'} />
            </div>
          ) : (
            <Tabs
              onTabChange={handleTabChange}
              tabs={tabs}
              activeIndex={tabIndex}
              type="secondary"
              className="flex w-full justify-between text-sm"
            />
          )}
        </div>

        <QueryClientProvider client={queryClient}>
          <div className="flex-1 overflow-hidden">
            {state.open &&
              tabs.map((tab, index) => (
                <div key={index} className={`h-full ${tabIndex === index ? '' : 'hidden'}`}>
                  <InfiniteScroll
                    fetchDataOnScroll={async ({ pageParam }) =>
                      await props.fetchPaginatedData(
                        pageParam.page,
                        { type: tab.scrollId, unRead: showUnreadOnly },
                        pageParam.pageSize
                      )
                    }
                    onDataLoad={onDataLoad}
                    queryKey={index.toString()}
                    externalQuery=""
                    pageSize={props?.pageSize ?? PAGE_SIZE}
                    filterPayload={null}
                    containerHeight="h-full"
                    id="notification-scroll_all"
                    reRenderTrigger={showUnreadOnly}
                    ref={tab?.scrollRef}
                    a11yRoleType="list"
                  >
                    {getData}
                  </InfiniteScroll>
                </div>
              ))}
          </div>
        </QueryClientProvider>
      </div>
    </Drawer>
  );
});

export default NotificationDrawer;
