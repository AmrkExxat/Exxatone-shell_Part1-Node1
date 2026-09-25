const BASE_INPUT =
  'flex w-full rounded-md bg-input border border-[#8C8C92] h-9 py-1 px-3 text-sm placeholder:text-[#5D5D5D] transition-colors';

const DISABLED_INPUT = `${BASE_INPUT} text-gray-900 disabled:cursor-not-allowed disabled:opacity-75 disabled:border-[#e5e7eb]`;
const NORMAL_INPUT = `${BASE_INPUT} focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring`;
const ERROR_INPUT = `${BASE_INPUT} text-red-600 border-red-500 placeholder:text-red-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500 pl-3 pr-10`;

const STYLES = {
  DISABLED: DISABLED_INPUT,
  NORMAL: NORMAL_INPUT,
  ERROR: ERROR_INPUT,
};

const ICON_CONTAINING_DIV = 'relative rounded-md shadow-sm';

export default {
  STYLES,
  ICON_CONTAINING_DIV,
};
