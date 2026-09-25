import { NotificationItemType } from '../../../shared/Notification';

export type InfiniteScrollProps = {
  fetchDataOnScroll: (p: any) => Promise<any>;
  onDataLoad: (
    pageData: { totalCount: number; data: NotificationItemType[] }[],
    key: string
  ) => void;
  children: (getFlatData: () => any[]) => React.ReactNode;
  pageSize: number;
  queryKey: string;
  externalQuery: string;
  filterPayload: Record<string, any> | null;
  containerHeight: string;
  id?: string;
  reRenderTrigger: any;
  ref?: React.Ref<InfiniteScrollHandle>;
  a11yRoleType?: string;
};

export interface InfiniteScrollHandle {
  clearData: () => void;
  getData: () => any;
  setData: (data: any) => void;
  refresh: () => void;
}
