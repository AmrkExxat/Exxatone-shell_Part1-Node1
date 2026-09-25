import { type Option } from '../Form';

export type FilterType = {
  id?: string;
  filterOptions: Option[];
  filterName: string;
  placeholder?: string;
  multiSelect?: boolean;
  treeSelect?: boolean;
  defaultValue?: Option[] | string | string[] | any;
  label?: string;
  className?: string;
};

export type SelectedFilter = Record<string, Option[] | []>;

export type FilterProps = {
  filters: FilterType[];
  onFilterChange: (filters: SelectedFilter) => void;
  reset?: boolean;
  defaultSelectedOptions?: any[];
};
