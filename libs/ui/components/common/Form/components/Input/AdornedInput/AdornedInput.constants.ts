const CONTAINER_BASE =
  'flex w-full items-center rounded-lg bg-input border h-10 px-3 gap-3 transition-colors';

const CONTAINER_NORMAL = `${CONTAINER_BASE} focus-within:ring-1 focus-within:ring-ring`;
const CONTAINER_ERROR = `${CONTAINER_BASE} border-red-500 focus-within:ring-1 focus-within:ring-red-500`;
const CONTAINER_DISABLED = `${CONTAINER_BASE} cursor-not-allowed opacity-75 border-[#e5e7eb]`;

const CONTAINER_STYLES = {
  NORMAL: CONTAINER_NORMAL,
  ERROR: CONTAINER_ERROR,
  DISABLED: CONTAINER_DISABLED,
};

const INPUT_BASE =
  'flex-1 min-w-0 bg-transparent border-none outline-none text-sm placeholder:text-[#5D5D5D] h-full focus:outline-none focus:ring-0';

export default {
  CONTAINER_STYLES,
  INPUT_BASE,
};
