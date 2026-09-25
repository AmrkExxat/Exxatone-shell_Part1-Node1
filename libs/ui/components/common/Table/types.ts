export type ColumnConfigType = {
  fieldName: string;
  headerName: string;
  hiddenOrder: number;
  isBold?: boolean;
  canSort?: boolean;
  hideSortIcon?: boolean;
  width?: string;
  isSticky?: boolean;
  isTruncate?: boolean;
  renderCell?: (row: any) => JSX.Element;
};
