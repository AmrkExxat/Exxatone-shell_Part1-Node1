import { type DataManager, type Query, type QueryOptions, UrlAdaptor } from '@syncfusion/ej2-data';
import { debounce } from 'lodash';
import { getSortPageData, gridUserInteraction, TreeGridAdaptorCallbacks } from '../utils';

/**
 * Response structure for the fetch data method
 */
interface FetchDataResponse {
  data: any[];
  totalCount: number;
}

/**
 * Parameters for the fetch data method
 */
interface FetchDataParams {
  siteId: string;
  pageIndex: number;
  pageSize: number;
  sortedColumns?: Record<string, string | boolean>;
  filterPayload?: any;
}

/**
 * Type definition for the fetch data method
 */
type FetchDataMethod = (params: FetchDataParams) => Promise<FetchDataResponse>;

/**
 * Interface for deferred object used in Syncfusion grid
 */
interface DeferredObject {
  resolve: (data: any) => void;
  reject: (error: any) => void;
}

/**
 * Custom adaptor for Syncfusion grid to handle remote data fetching with pagination, sorting, and filtering
 */
class CustomAdaptor extends UrlAdaptor {
  private readonly fetchData: FetchDataMethod;
  private readonly siteId: string;
  private readonly filterPayload: any;
  private readonly callbacks: TreeGridAdaptorCallbacks;
  private readonly DEBOUNCE_TIME = 600;

  /**
   * Debounced version of the process query method
   */
  private debouncedProcessQuery: (
    dm: DataManager,
    query: Query,
    hierarchyFilters?: Object[]
  ) => Object;

  /**
   * Debounced version of the data fetching logic
   */
  private debouncedFetchGridData: (params: FetchDataParams, deferred: DeferredObject) => void;

  constructor(
    siteId: string,
    fetchData: FetchDataMethod,
    filterPayload: any,
    interaction: any,
    callbacks: TreeGridAdaptorCallbacks = {}
  ) {
    super();
    this.siteId = siteId;
    this.fetchData = fetchData;
    this.filterPayload = filterPayload;
    this.callbacks = callbacks;

    // Initialize debounced methods
    this.debouncedProcessQuery = debounce(
      (dm: DataManager, query: Query, hierarchyFilters?: Object[]): Object => {
        const request = super.processQuery(dm, query, hierarchyFilters);
        if (request && typeof request === 'object' && 'data' in request) {
          request.data = JSON.stringify(request.data);
        }
        return request;
      },
      this.DEBOUNCE_TIME
    );

    this.debouncedFetchGridData = debounce(
      (params: FetchDataParams, deferred: DeferredObject): void => {
        this.callbacks.onDataLoadStart?.();
        if (interaction?.can) {
          const { pageIndex, sortedColumns } = params;
          const userInt = getSortPageData(pageIndex, sortedColumns);
          const previousUserInt = gridUserInteraction(
            interaction.id,
            'get',
            interaction.interactionKey
          );
          if (previousUserInt?.expandIds) {
            userInt.expandIds = previousUserInt.expandIds;
          }
          gridUserInteraction(interaction.id, 'set', interaction.interactionKey, userInt);
        }
        this.fetchData(params)
          .then((response) => {
            deferred.resolve({
              result: response.data,
              count: response.totalCount,
            });
          })
          .catch((error) => {
            const errorMessage =
              error instanceof Error
                ? error.message
                : `Error fetching data for site: ${params.siteId}, page: ${params.pageIndex}`;

            deferred.reject([{ error: errorMessage }]);
          })
          ?.finally(() => {
            this.callbacks.onDataLoadEnd?.();
          });
      },
      this.DEBOUNCE_TIME
    );
  }

  /**
   * Process the query for the data manager
   * @param dm DataManager instance
   * @param query Query object
   * @param hierarchyFilters Optional hierarchy filters
   * @returns Processed request object
   */
  processQuery(dm: DataManager, query: Query, hierarchyFilters?: Object[]): Object {
    return this.debouncedProcessQuery(dm, query, hierarchyFilters);
  }

  /**
   * Make the request to fetch data
   * @param request Request object
   * @param deferred Deferred object for promise resolution
   * @param args Additional arguments
   * @param query Query object
   */
  makeRequest(request: Object, deferred: DeferredObject, args: Object, query: Query): void {
    try {
      // Extract pagination parameters
      const pageQuery = query.queries.find((q: any) => q.fn === 'onPage');
      let pageIndex = pageQuery?.e?.pageIndex ?? 1;
      let pageSize = pageQuery?.e?.pageSize ?? 10;

      // Extract sorting parameters
      const sortQuery = query.queries.find((q) => q.fn === 'onSortBy') as QueryOptions | undefined;
      let sortedColumns: Record<string, string | boolean> = {};

      if (sortQuery?.e) {
        const direction =
          sortQuery.e.direction === 'ascending'
            ? true
            : sortQuery.e.direction === 'descending'
              ? false
              : '';

        sortedColumns = {
          [sortQuery.e.fieldName]: direction,
        };
      }

      // Make the debounced request
      this.debouncedFetchGridData(
        {
          siteId: this.siteId,
          pageIndex,
          pageSize,
          sortedColumns,
          filterPayload: this.filterPayload,
        },
        deferred
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unexpected error while processing grid request';

      deferred.reject([{ error: errorMessage }]);
    }
  }
}

export default CustomAdaptor;
