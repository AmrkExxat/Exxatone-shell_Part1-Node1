import React, { createContext, useContext } from 'react';

export interface AccordionListChildDropIndicator {
  accordionId: string;
  insertIndex: number;
}

export interface AccordionListChildDragContextValue {
  activeItemId: string | null;
  activeHeight: number | undefined;
  dropIndicator: AccordionListChildDropIndicator | null;
}

const AccordionListChildDragContext = createContext<AccordionListChildDragContextValue>({
  activeItemId: null,
  activeHeight: undefined,
  dropIndicator: null,
});

export const AccordionListChildDragProvider = AccordionListChildDragContext.Provider;

export const useAccordionListChildDragContext = () => useContext(AccordionListChildDragContext);
