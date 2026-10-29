import { useEffect, useState } from 'react';
import { SEED_ATTACHMENT_TEMPLATES, type AttachmentTemplate } from './attachmentTemplates';

let templates: AttachmentTemplate[] = SEED_ATTACHMENT_TEMPLATES.map((item) => ({ ...item }));
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function useAttachmentTemplates() {
  const [list, setList] = useState(templates);

  useEffect(() => {
    const listener = () => setList(templates);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const setTemplates = (
    next: AttachmentTemplate[] | ((prev: AttachmentTemplate[]) => AttachmentTemplate[]),
  ) => {
    templates = typeof next === 'function' ? next(templates) : next;
    setList(templates);
    emit();
  };

  return [list, setTemplates] as const;
}
