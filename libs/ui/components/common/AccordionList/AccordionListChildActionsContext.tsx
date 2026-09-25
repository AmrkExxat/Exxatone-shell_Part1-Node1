import React, { createContext, useContext } from 'react';

import type { AccordionMoveDirection } from './AccordionList.types';

export interface AccordionListChildActionsContextValue {
  moveChildItem: (accordionId: string, itemId: string, direction: AccordionMoveDirection) => void;
  canMoveChildItem: (
    accordionId: string,
    itemId: string,
    direction: AccordionMoveDirection
  ) => boolean;
}

const AccordionListChildActionsContext =
  createContext<AccordionListChildActionsContextValue | null>(null);

export const AccordionListChildActionsProvider = AccordionListChildActionsContext.Provider;

export const useAccordionListChildActionsContext = () =>
  useContext(AccordionListChildActionsContext);
