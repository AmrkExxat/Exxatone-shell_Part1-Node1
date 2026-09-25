import { useAccordionListChildActionsContext } from './AccordionListChildActionsContext';

export function useMoveChildItem() {
  const context = useAccordionListChildActionsContext();

  if (context == null) {
    throw new Error('useMoveChildItem must be used within AccordionList');
  }

  return context;
}
