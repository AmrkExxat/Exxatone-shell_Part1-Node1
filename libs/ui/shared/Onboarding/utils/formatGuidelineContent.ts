import DOMPurify from 'dompurify';

export interface SanitizeOptions {
  allowedTags?: string[];
  allowedAttributes?: string[];
  allowDataAttributes?: boolean;
}

const ALLOWED_TAGS = [
  'p',
  'br',
  'strong',
  'b',
  'em',
  'i',
  'u',
  'span',
  'div',
  'ul',
  'ol',
  'li',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'a',
  'blockquote',
  'code',
  'pre',
  'mark',
  'del',
  'ins',
];
const ALLOWED_ATTR = ['href', 'target', 'rel', 'class', 'id', 'title', 'alt'];
const ALLOWED_URI_REGEXP = /^(https?|mailto|tel):/i;

function sanitizeHtml(html: string, options: SanitizeOptions = {}): string {
  if (!html || typeof html !== 'string') return '';
  try {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: options.allowedTags ?? ALLOWED_TAGS,
      ALLOWED_ATTR: options.allowedAttributes ?? ALLOWED_ATTR,
      ALLOW_DATA_ATTR: options.allowDataAttributes ?? false,
      ALLOWED_URI_REGEXP,
      SANITIZE_DOM: true,
      FORBID_TAGS: ['script', 'style', 'object', 'embed', 'form', 'input'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
    });
  } catch {
    return html.replace(/<[^>]*>/g, '');
  }
}

function hasHtmlTags(content: string): boolean {
  return /<[^>]*>/.test(content);
}

function textToHtml(text: string): string {
  return text
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/~~(.*?)~~/g, '<del>$1</del>')
    .replace(/__(.*?)__/g, '<u>$1</u>');
}

/**
 * Sanitizes and formats content for guidelines display.
 * If the content already contains HTML it is sanitized; otherwise it is
 * wrapped in a <li> tag, light-Markdown-converted, then sanitized.
 */
export function formatGuidelineContent(content: string, options: SanitizeOptions = {}): string {
  if (!content || typeof content !== 'string') return '';
  if (hasHtmlTags(content)) return sanitizeHtml(content, options);
  return sanitizeHtml(textToHtml(`<li>${content}</li>`), options);
}
