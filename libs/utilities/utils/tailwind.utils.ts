function classNames(...classes: Array<string | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

const tailwindUtils = {
  classNames,
};

export default tailwindUtils;
