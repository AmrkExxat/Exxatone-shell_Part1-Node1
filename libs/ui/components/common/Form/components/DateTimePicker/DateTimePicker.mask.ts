import { format as dateFnsFormat, isValid, parse } from 'date-fns';

const TOKEN_PATTERN = /yyyy|YYYY|yyy|yy|y|MMMM|MMM|MM|M|dd|d|HH|H|hh|h|mm|m|ss|s|aa|a/g;

type MaskSegment =
  { type: 'literal'; value: string } | { type: 'digit'; length: number } | { type: 'amPm' };

const DIGIT_LENGTH: Record<string, number> = {
  yyyy: 4,
  YYYY: 4,
  yyy: 4,
  y: 4,
  yy: 2,
  MM: 2,
  M: 2,
  dd: 2,
  d: 2,
  HH: 2,
  H: 2,
  hh: 2,
  h: 2,
  mm: 2,
  m: 2,
  ss: 2,
  s: 2,
};

/** Normalize common aliases to date-fns tokens. */
export function toDateFnsFormat(format: string): string {
  // Prefer replacing longest tokens first via TOKEN_PATTERN.
  return format.replace(TOKEN_PATTERN, (token) => {
    if (token === 'YYYY') return 'yyyy';
    if (token === 'y') return 'yyyy';
    if (token === 'a') return 'aa';
    return token;
  });
}

export function getMaskPlaceholder(format: string): string {
  return format.replace(TOKEN_PATTERN, (token) => {
    if (token === 'a' || token === 'aa') return '__';
    if (token === 'yyyy' || token === 'YYYY' || token === 'yyy' || token === 'y') return '____';
    if (token === 'yy') return '__';
    return '_'.repeat(DIGIT_LENGTH[token] ?? Math.max(token.length, 1));
  });
}

function parseSegments(format: string): MaskSegment[] {
  const segments: MaskSegment[] = [];
  let lastIndex = 0;
  const re = new RegExp(TOKEN_PATTERN.source, 'g');
  let match: RegExpExecArray | null;

  while ((match = re.exec(format)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'literal', value: format.slice(lastIndex, match.index) });
    }
    const token = match[0];
    if (token === 'a' || token === 'aa') {
      segments.push({ type: 'amPm' });
    } else {
      segments.push({
        type: 'digit',
        length: DIGIT_LENGTH[token] ?? Math.max(token.length, 1),
      });
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < format.length) {
    segments.push({ type: 'literal', value: format.slice(lastIndex) });
  }

  return segments;
}

export function getAllowedMaskChars(format: string): Set<string> {
  const chars = new Set<string>(['a', 'A', 'p', 'P', 'm', 'M']);
  parseSegments(format).forEach((segment) => {
    if (segment.type === 'literal') {
      segment.value.split('').forEach((char) => chars.add(char));
    }
  });
  return chars;
}

/**
 * Apply format-based masking.
 * Digits fill token slots left-to-right; separators are taken from the format.
 */
export function applyDateTimeMask(rawInput: string, format: string): string {
  const segments = parseSegments(format);
  const hasAmPm = segments.some((segment) => segment.type === 'amPm');
  const digits = rawInput.replace(/\D/g, '');
  const amPmMatch = rawInput.match(/([ap])m?/i);
  const amPm = hasAmPm && amPmMatch ? (amPmMatch[1].toUpperCase() === 'P' ? 'PM' : 'AM') : '';

  let digitIndex = 0;
  let result = '';
  let filledAny = false;

  for (const segment of segments) {
    if (segment.type === 'literal') {
      if (filledAny || digitIndex > 0) {
        result += segment.value;
      }
      continue;
    }

    if (segment.type === 'digit') {
      if (digitIndex >= digits.length) break;
      const slice = digits.slice(digitIndex, digitIndex + segment.length);
      result += slice;
      digitIndex += slice.length;
      filledAny = true;
      if (slice.length < segment.length) break;
      continue;
    }

    if (segment.type === 'amPm' && amPm) {
      result += amPm;
      filledAny = true;
    }
  }

  return result;
}

export function isMaskComplete(maskedValue: string, format: string): boolean {
  const segments = parseSegments(format);
  let cursor = 0;

  for (const segment of segments) {
    if (segment.type === 'literal') {
      if (maskedValue.slice(cursor, cursor + segment.value.length) !== segment.value) {
        return false;
      }
      cursor += segment.value.length;
      continue;
    }

    if (segment.type === 'digit') {
      const part = maskedValue.slice(cursor, cursor + segment.length);
      if (!/^\d+$/.test(part) || part.length !== segment.length) return false;
      cursor += segment.length;
      continue;
    }

    const part = maskedValue.slice(cursor, cursor + 2).toUpperCase();
    if (part !== 'AM' && part !== 'PM') return false;
    cursor += 2;
  }

  return cursor === maskedValue.length || maskedValue.slice(cursor).trim() === '';
}

export function parseMaskedDateTime(
  maskedValue: string,
  format: string,
  referenceDate: Date = new Date()
): Date | null {
  if (!maskedValue?.trim()) return null;
  try {
    const parsed = parse(maskedValue.trim(), toDateFnsFormat(format), referenceDate);
    return isValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function formatDateTimeValue(value: Date | null | undefined, format: string): string {
  if (!value || !isValid(value)) return '';
  try {
    return dateFnsFormat(value, toDateFnsFormat(format));
  } catch {
    return value.toLocaleString();
  }
}

export function getTimeFormat(format: string): string {
  const normalized = toDateFnsFormat(format);
  const is12Hour = /aa|a/.test(normalized);
  const hasSeconds = /ss/.test(normalized);
  if (is12Hour) return hasSeconds ? 'h:mm:ss aa' : 'h:mm aa';
  return hasSeconds ? 'HH:mm:ss' : 'HH:mm';
}

export function is12HourDateTimeFormat(format: string): boolean {
  return /aa|a/.test(toDateFnsFormat(format));
}

export function resolveTimeOnlyFormat(
  userFormat: string | undefined,
  use12HourFormat: boolean
): string {
  if (use12HourFormat) return 'hh:mm aa';
  if (userFormat && is12HourDateTimeFormat(userFormat)) return userFormat;
  return userFormat || 'HH:mm';
}
