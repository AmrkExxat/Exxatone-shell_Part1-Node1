import { type DataManager, type Query, type QueryOptions, UrlAdaptor } from '@syncfusion/ej2-data';
import { debounce } from '../../../../utilities/utils/debounce';
import { getSortPageData, gridUserInteraction, TreeGridAdaptorCallbacks } from '../utils';

interface FetchDataResponse {
  data: Array<Record<string, any>>;
  totalCount: number;
  selectedIds?: string[];
}

interface FetchDataParams {
  siteId: string;
  pageIndex: number;
  pageSize: number;
  sortedColumns?: Record<string, string | boolean>;
  filterPayload?: Record<string, any>;
  parentId?: string | null;
}

type FetchDataMethod = (params: FetchDataParams) => Promise<FetchDataResponse>;

interface Deferred {
  resolve: (data: { result: any[]; count: number }) => void;
  reject: (error: any) => void;
}

class TreeGridCustomAdaptor extends UrlAdaptor {
  private readonly fetchData: FetchDataMethod;
  private readonly siteId: string;
  private readonly filterPayload: Record<string, any>;
  private readonly interaction: any;
  private readonly callbacks: TreeGridAdaptorCallbacks;
  private readonly DEBOUNCE_TIME = 600; // ms

  private selectedIds: any[] = [];

  private readonly debouncedProcessQuery: (
    dm: DataManager,
    query: Query,
    hierarchyFilters?: Array<Record<string, unknown>>
  ) => Record<string, unknown>;

  private readonly debouncedMakeRequest: (params: FetchDataParams, deferred: Deferred) => void;

  constructor(
    siteId: string,
    fetchData: FetchDataMethod,
    filterPayload: Record<string, any>,
    interaction: any,
    callbacks: TreeGridAdaptorCallbacks = {}
  ) {
    super();
    this.siteId = siteId;
    this.fetchData = fetchData;
    this.filterPayload = filterPayload;
    this.interaction = interaction;
    this.callbacks = callbacks;

    this.debouncedProcessQuery = debounce(this.processQueryImpl.bind(this), this.DEBOUNCE_TIME);
    this.debouncedMakeRequest = debounce(this.makeRequestImpl.bind(this), this.DEBOUNCE_TIME);
  }

  processQuery(dm: DataManager, query: Query, hierarchyFilters?: Object[]): Object {
    // The debounced function doesn't actually return a value immediately
    // We need to call the implementation directly to match the expected return type
    const request = this.processQueryImpl(dm, query, hierarchyFilters);
    // Start the debounced version in the background
    this.debouncedProcessQuery(dm, query, hierarchyFilters);
    return request;
  }

  private processQueryImpl(dm: DataManager, query: Query, hierarchyFilters?: Object[]): Object {
    const request = super.processQuery(dm, query, hierarchyFilters);
    if (request && typeof request === 'object' && 'data' in request) {
      request.data = JSON.stringify(request.data);
    }
    return request;
  }

  makeRequest(request: Object, deferred: Deferred, args: Object, query: Query): void {
    try {
      const params = this.extractParamsFromQuery(query);
      this.debouncedMakeRequest(params, deferred);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unexpected error while processing request';

      console.error('Error in makeRequest:', errorMessage);
      deferred.reject([{ error: errorMessage }]);
    }
  }

  private extractParamsFromQuery(query: Query): FetchDataParams {
    const pageQuery = query.queries.find((q) => q.fn === 'onPage');
    const sortQuery: QueryOptions | undefined = query.queries.find((q) => q.fn === 'onSortBy');

    const pageIndex: number = pageQuery?.e?.pageIndex ?? 1;
    const pageSize: number = pageQuery?.e?.pageSize ?? 10;
    let sortedColumns: Record<string, string | boolean> = {};

    if (sortQuery?.e) {
      const direction: boolean | string =
        sortQuery.e.direction === 'ascending'
          ? true
          : sortQuery.e.direction === 'descending'
            ? false
            : '';

      sortedColumns = {
        [sortQuery.e.fieldName]: direction,
      };
    }

    const onExpand = query.queries.find((q) => q.fn === 'onWhere');
    const parentId: string | number | null = (onExpand?.e?.value as string) ?? null;

    return {
      siteId: this.siteId,
      pageIndex,
      pageSize,
      sortedColumns,
      filterPayload: this.filterPayload,
      parentId,
    };
  }

  private makeRequestImpl(params: FetchDataParams, deferred: Deferred): void {
    this.callbacks.onDataLoadStart?.();
    if (this?.interaction?.can) {
      const { pageIndex, sortedColumns } = params;
      const userInt = getSortPageData(pageIndex, sortedColumns);
      const previousUserInt = gridUserInteraction(
        this.interaction.id,
        'get',
        this.interaction.interactionKey
      );
      if (previousUserInt?.expandIds) {
        userInt.expandIds = previousUserInt.expandIds;
      }
      gridUserInteraction(this.interaction.id, 'set', this.interaction.interactionKey, userInt);
    }
    this.fetchData(params)
      .then((response) => {
        this.selectedIds = response?.selectedIds ?? [];

        deferred.resolve({
          result: response.data,
          count: response.totalCount,
        });
      })
      .catch((error) => {
        const errorMessage =
          error instanceof Error
            ? error.message
            : `Error while fetching data for ${JSON.stringify({
                siteId: params.siteId,
                pageIndex: params.pageIndex,
                pageSize: params.pageSize,
                sortedColumns: params.sortedColumns,
              })}`;

        console.error('Fetch data error:', errorMessage);
        deferred.reject([{ error: errorMessage }]);
      })
      ?.finally(() => {
        this.callbacks.onDataLoadEnd?.();
      });
  }

  public getSelectedIds() {
    return this.selectedIds;
  }
}

export default TreeGridCustomAdaptor;
