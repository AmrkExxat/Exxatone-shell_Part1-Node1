import { ReactNode, type SelectHTMLAttributes } from 'react';
import {
  type Control,
  type FieldValues,
  type ControllerRenderProps,
  type RegisterOptions,
  type FieldErrors,
} from 'react-hook-form';

export type Option = {
  value: string;
  label: string;
  id?: string;
  tooltip?: any;
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
};

export type SelectHeadlessProps = {
  field?: ControllerRenderProps<any, string>;
  error?: FieldErrors<FieldValues>;
  loading?: boolean;
};

export interface SelectProps<T extends FieldValues> extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'name' | 'onChange'
> {
  label?: string;
  name: string;
  options: Option[];
  defaultValue?: string | Option;
  defaultValues?: Option[];
  multiple?: boolean;
  control?: Control<T>;
  rules?: Omit<
    RegisterOptions<FieldValues, string>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  onChange?: (value: string | Option[] | Option, parentReset?: boolean) => void;
  onBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;
  loading?: boolean;
  placeholder?: string;
  reset?: boolean;
  inputClass?: string;
  searchable?: boolean;
  className?: string;
  buttonClassName?: string;
  optionsContainerClassName?: string;
  optionClassName?: string;
  LeadingIcon?: ReactNode;
  dropIcon?: any;
  isChip?: boolean;
  clearList?: string[];
  clearBit?: number;
  selectAllRequired?: boolean;
  buttonElement?: ReactNode;
  openPanel?: boolean;
  extraFilter?: boolean;
  hideFilter?: () => void;
  hidden: boolean;
  btnEleClassname?: string;
  classWrap?: string;
  optionRenderer?: (option: any, selected: any) => ReactNode;
  closeButtonReq?: boolean;
  clearButtonReq?: boolean;
  detachedBox?: boolean;
  hideLabelOnSelect?: boolean;
  addNewButton?: boolean;
  testid?: string;
  handleAddNewButton?: () => void;
  labelledby?: string;
  useUnderlineStyle?: boolean;
  addedFilter?: boolean;
  infoMsg?: string;
  onCloseTrigger?: () => void;
  section?: any;
  sendOptionForSingleSelect?: boolean;
  autoSelectSingleIndependentValue?: boolean;
  pendoId?: string;
  isDarkTheme?: boolean;
  isDisableTextUI?: boolean;
  showMoreProp?: any;
  prevDefaultData?: any;
  disabledLabel?: any;
  showChevronIcon?: boolean;
  fromModal?: boolean;
}

export interface ServerSelectProps<T extends FieldValues> extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'name' | 'onChange'
> {
  label?: string;
  name: string;
  defaultValue?: any;
  defaultValues?: Option[];
  multiple?: boolean;
  control?: Control<T>;
  rules?: Omit<
    RegisterOptions<FieldValues, string>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  onChange?: (value: string | Option[] | Option) => void;
  loading?: boolean;
  placeholder?: string;
  reset?: boolean;
  searchable?: boolean;
  className?: string;
  buttonClassName?: string;
  optionsContainerClassName?: string;
  optionClassName?: string;
  dropIcon?: any;
  clearList?: string[];
  isChip?: boolean;
  clearBit?: number;
  selectAllRequired?: boolean;
  fetchDataOnScroll: (query: any) => Promise<any>;
  queryKey: string[];
  extraFilter?: boolean;
  hideFilter?: () => void;
  hidden: boolean;
  classWrap?: string;
  buttonElement?: ReactNode;
  btnEleClassname?: string;
  optionRenderer?: (option: any, selected: any) => ReactNode;
  closeButtonReq?: boolean;
  clearButtonReq?: boolean;
  detachedBox?: boolean;
  hideLabelOnSelect?: boolean;
  canInitialFetch?: boolean;
  useUnderlineStyle?: boolean;
  addedFilter?: boolean;
  isDarkTheme?: boolean;
  idToRemove?: string;
  isDisableTextUI?: boolean;
  showMoreProp?: any;
}
