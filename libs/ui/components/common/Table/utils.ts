import React from 'react';
import { ColumnConfigType } from './types';

export const useWindowSize = () => {
  // Starts at 0 so server and first client render agree; the effect fills in real
  // dimensions once mounted.
  const [size, setSize] = React.useState([0, 0]);

  React.useEffect(() => {
    const handleResize = () => setSize([window.innerWidth, window.innerHeight]);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
};

export const determineVisibleColumns = (screenWidth: number, columns: ColumnConfigType[]) => {
  // Width is unknown until the first client effect runs; show everything rather than
  // collapsing to the narrowest breakpoint.
  if (!screenWidth) return columns.slice();

  const breakpoints = [1400, 1280, 1024, 768, 640]; // Customize these breakpoints as needed

  let visibleColumns = columns.slice();
  breakpoints.forEach((breakpoint, index) => {
    if (screenWidth < breakpoint) {
      visibleColumns = visibleColumns.filter((column) => column.hiddenOrder > index + 1);
    }
  });

  return visibleColumns;
};
