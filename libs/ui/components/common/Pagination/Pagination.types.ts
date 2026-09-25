export type PaginationProps = {
  totalResults: number;
  onChange: (page: number) => void;
  resultsPerPage: number & Exclude<number, 0>;
  containerClass: string;
  defaultPage: number;
  showItemsPerPage?: boolean;
  itemsPerPageOptions?: number[];
  onItemsPerPageChange?: (itemsPerPage: number) => void;
};
