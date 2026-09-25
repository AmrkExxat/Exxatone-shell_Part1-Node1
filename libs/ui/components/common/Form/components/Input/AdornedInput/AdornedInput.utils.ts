import CONSTANTS from './AdornedInput.constants';

function getContainerClassName(isError: boolean, disabled: boolean = false): string {
  if (isError) {
    return CONSTANTS.CONTAINER_STYLES.ERROR;
  }
  if (disabled) {
    return CONSTANTS.CONTAINER_STYLES.DISABLED;
  }
  return CONSTANTS.CONTAINER_STYLES.NORMAL;
}

export default {
  getContainerClassName,
};
