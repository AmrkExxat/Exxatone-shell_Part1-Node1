/* eslint-disable prettier/prettier */

export function isPropValid(prop: any): boolean {
  return prop !== undefined && prop !== null;
}

export function classNames(...classes: any): any {
  return classes.filter(Boolean).join(' ');
}
