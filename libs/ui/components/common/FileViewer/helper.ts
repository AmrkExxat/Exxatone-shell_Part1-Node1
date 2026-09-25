import * as XLSX from 'xlsx';
import { purifyHTML } from './domPurify';

export const previewSupportedFileTypes = [
  'png',
  'jpg',
  'jpeg',
  'heic',
  'pdf',
  'docx',
  'xlsx',
  'xls',
  'csv',
  'bmp',
  'gif',
  'mp4',
  'mp3',
];

const base64ToUint8Array = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString?.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString?.charCodeAt(i);
  }
  return bytes;
};

const createPdfObjectUrl = (base64Content: string) => {
  const bytes = base64ToUint8Array(base64Content);
  const blob = new Blob([bytes], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
};

export const fileDownloadHelper = (binData: string, file: any) => {
  let link = document.createElement('a');
  link.href = binData;
  link.download = file?.fileName ?? file.name;
  link.click();
  link.remove();
};

export const ensureBinarySrc = (
  file: any,
  type: string,
  fetchedBase64?: string
): { src: string; isObjectUrl: boolean } => {
  const lowerType = (type || '').toLowerCase();
  const existing = file?.binaryData as string | undefined;

  if (existing) {
    if (lowerType === 'pdf' || file?.contentType?.includes('pdf')) {
      if (existing?.startsWith('blob:')) {
        return { src: existing, isObjectUrl: true };
      }
      let base64Content = existing;
      if (existing?.startsWith('data:')) {
        const commaIdx = existing.indexOf(',');
        base64Content = commaIdx >= 0 ? existing.substring(commaIdx + 1) : '';
      }
      const objectUrl = createPdfObjectUrl(base64Content);
      return { src: objectUrl, isObjectUrl: true };
    }
    return { src: existing, isObjectUrl: existing.startsWith('blob:') };
  }

  const base64Content = fetchedBase64 || '';
  if (lowerType === 'pdf' || file?.contentType?.includes('pdf')) {
    const objectUrl = createPdfObjectUrl(base64Content);
    return { src: objectUrl, isObjectUrl: true };
  }
  const dataUrl = `data:${file?.contentType};base64,` + base64Content;
  return { src: dataUrl, isObjectUrl: false };
};

export const internationalizeVariables = {
  largeDataMessage: 'Data too large to be previewed. Please download the file to view it.',
  unSupportedFileMessage: 'File format not supported for preview. File is being downloaded',
  noPreview: 'No data available for preview',
  fileNotSelected: 'No file selected for preview',
};

export const focusElementById = (id: string, formRef: React.MutableRefObject<HTMLFormElement>) => {
  const selector = `#${CSS.escape(id)}`;
  const el = formRef?.current?.querySelector(selector) as HTMLButtonElement | null;
  if (el && !el.disabled) {
    el.focus();
    return true;
  }
  return false;
};

const escapeHtml = (value: any): string => {
  const str = value == null ? '' : String(value);
  return str
    ?.replace(/&/g, '&amp;')
    ?.replace(/</g, '&lt;')
    ?.replace(/>/g, '&gt;')
    ?.replace(/"/g, '&quot;')
    ?.replace(/'/g, '&#x27;');
};

export const buildTrimmedSheetHtml = (sheet: XLSX.WorkSheet): string => {
  try {
    const rows = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      blankrows: false,
      raw: false,
    }) as Array<Array<any>>;

    if (!rows || rows?.length === 0) {
      return '<table style="border-collapse:collapse;border-spacing:0;width:100%"><tbody></tbody></table>';
    }

    let maxCol = 0;
    for (const row of rows || []) {
      for (let i = row?.length - 1; i >= 0; i--) {
        const cell = row?.[i];
        if (cell != null && String(cell)?.trim() !== '') {
          maxCol = Math.max(maxCol, i + 1);
          break;
        }
      }
    }

    const trimmedRows = rows?.filter((row) => {
      for (let i = 0; i < maxCol; i++) {
        const cell = row?.[i];
        if (cell != null && String(cell)?.trim() !== '') return true;
      }
      return false;
    });

    let html = '<table style="border-collapse:collapse;border-spacing:0;width:100%"><tbody>';
    for (let index = 0; index < (trimmedRows || []).length; index++) {
      const row = trimmedRows[index];
      html += `<tr style="border-bottom:1px solid #eee" class="${index % 2 === 1 ? 'bg-gray-100' : ''}">`;
      for (let i = 0; i < maxCol; i++) {
        html += `<td style="border:1px solid #e0e0e0;padding:4px 8px;vertical-align:top">${escapeHtml(
          row[i]
        )}</td>`;
      }
      html += '</tr>';
    }
    html += '</tbody></table>';
    return (
      html ||
      '<table style="border-collapse:collapse;border-spacing:0;width:100%"><tbody></tbody></table>'
    );
  } catch (error) {
    return '<table style="border-collapse:collapse;border-spacing:0;width:100%"><tbody></tbody></table>';
  }
};

export const generateSheetHtmls = (buf: ArrayBuffer) => {
  const workbook = XLSX.read(buf, { type: 'array', dateNF: 'mm/dd/yyyy' });

  const hasLargeData = workbook?.SheetNames?.some((sheetName: any) => {
    const sheet = workbook?.Sheets?.[sheetName];

    if (!sheet?.['!ref']) return false;

    const range = XLSX.utils.decode_range(sheet?.['!ref']);
    const rows = range.e.r + 1;
    const cols = range.e.c + 1;

    return rows > 1000 || cols > 200;
  });

  if (hasLargeData) {
    return {
      htmls: [],
      hasLargeData: true,
    };
  }

  const htmls: Array<{ name: string; html: string; title: string; id: string }> =
    workbook?.SheetNames?.map((name: string, index: number) => {
      const sheet = workbook?.Sheets?.[name];
      const generated = buildTrimmedSheetHtml(sheet);
      return { name, html: purifyHTML(generated), title: name, id: 'sheet_' + index };
    });
  return { htmls };
};

export const fileNameAccessibilityHelper = (fileName: string) => {
  const dotIndex = fileName?.lastIndexOf('.');
  if (dotIndex === -1) return fileName;
  return fileName?.substring(0, dotIndex);
};
