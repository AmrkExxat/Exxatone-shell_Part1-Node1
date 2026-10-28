import { useEffect, useState } from 'react';
import { SEED_EMAIL_TEMPLATES, type EmailTemplateRecord } from './emailTemplates';

let templates: EmailTemplateRecord[] = SEED_EMAIL_TEMPLATES.map((item) => ({
  ...item,
  history: [...item.history],
  headerFooterLayout: item.headerFooterLayout ?? 'siteHeaderExxatFooter',
  attachments: item.attachments ? [...item.attachments] : [],
}));

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function useEmailTemplates() {
  const [list, setList] = useState(templates);

  useEffect(() => {
    const listener = () => setList(templates);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const setTemplates = (
    next: EmailTemplateRecord[] | ((prev: EmailTemplateRecord[]) => EmailTemplateRecord[]),
  ) => {
    templates = typeof next === 'function' ? next(templates) : next;
    setList(templates);
    emit();
  };

  return [list, setTemplates] as const;
}
