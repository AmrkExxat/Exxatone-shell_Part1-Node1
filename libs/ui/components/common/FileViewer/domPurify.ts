import DOMPurify from 'dompurify';

if (typeof window !== 'undefined' && !(DOMPurify as any).__exxat_rel_hook_installed) {
  DOMPurify.addHook('afterSanitizeAttributes', (node: Element) => {
    if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
      node.setAttribute('rel', 'noopener noreferrer');
    }
  });
  (DOMPurify as any).__exxat_rel_hook_installed = true;
}

export const purifyHTML = (data: any) => {
  const sanitizedHtml = DOMPurify.sanitize(data, {
    ADD_ATTR: ['target'],
  });
  return sanitizedHtml;
};

export const purifyFieldContent = (data: any) => {
  if (!data) return '';

  return DOMPurify.sanitize(String(data), {
    ADD_TAGS: ['style'],
    ADD_ATTR: [
      'target',
      'class',
      'style',
      'id',
      'rowspan',
      'colspan',
      'width',
      'height',
      'align',
      'valign',
      'border',
      'cellpadding',
      'cellspacing',
      'scope',
      'headers',
    ],
    ALLOW_DATA_ATTR: true,
  });
};
