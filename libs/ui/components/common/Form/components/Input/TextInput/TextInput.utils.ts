import CONSTANTS from './TextInput.constants';

function getInputClassName(
  error: boolean,
  disabled: boolean = false,
  hasLeadingIcon: boolean = false
): string {
  let result;
  if (error) {
    result = CONSTANTS.STYLES.ERROR;
  } else if (disabled) {
    result = CONSTANTS.STYLES.DISABLED;
  } else {
    result = CONSTANTS.STYLES.NORMAL;
  }
  return hasLeadingIcon ? result + ' pl-10' : result;
}

export default {
  getInputClassName,
};
