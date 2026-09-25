import { type Option } from '../../shared';

function findSelectedOptionByValue(value: string, options: Option[]): Option {
  const foundOption = options.find((option) => option.value === value);
  if (foundOption != null) {
    return foundOption;
  } else {
    throw new Error(`Option with value '${value}' not found.`);
  }
}

export default { findSelectedOptionByValue };
