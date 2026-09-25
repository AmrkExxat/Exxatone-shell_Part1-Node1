// @vitest-environment jsdom
/**
 * Pure unit tests for FileViewer/helper.ts and FileViewer/domPurify.ts.
 * No React rendering — functions only.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// Mock XLSX so sheet parsing tests can control the data returned
// ---------------------------------------------------------------------------
vi.mock('xlsx', () => {
  const utils = {
    sheet_to_json: vi.fn(),
    decode_range: vi.fn(),
  };
  return { utils, read: vi.fn() };
});

import * as XLSX from 'xlsx';
import {
  previewSupportedFileTypes,
  fileNameAccessibilityHelper,
  internationalizeVariables,
  ensureBinarySrc,
  fileDownloadHelper,
  buildTrimmedSheetHtml,
  generateSheetHtmls,
} from '../../../libs/ui/components/common/FileViewer/helper';
import {
  purifyHTML,
  purifyFieldContent,
} from '../../../libs/ui/components/common/FileViewer/domPurify';

// ---------------------------------------------------------------------------
// previewSupportedFileTypes
// ---------------------------------------------------------------------------
describe('previewSupportedFileTypes', () => {
  it('contains all supported image types', () => {
    (['png', 'jpg', 'jpeg', 'bmp', 'gif', 'heic'] as const).forEach((t) =>
      expect(previewSupportedFileTypes).toContain(t)
    );
  });

  it('contains media types', () => {
    expect(previewSupportedFileTypes).toContain('mp4');
    expect(previewSupportedFileTypes).toContain('mp3');
  });

  it('contains document types', () => {
    (['pdf', 'docx', 'xlsx', 'xls', 'csv'] as const).forEach((t) =>
      expect(previewSupportedFileTypes).toContain(t)
    );
  });

  it('does not include types that are not previewed (doc, ppt, rtf)', () => {
    (['doc', 'ppt', 'rtf', 'pptx', 'potx'] as const).forEach((t) =>
      expect(previewSupportedFileTypes).not.toContain(t)
    );
  });
});

// ---------------------------------------------------------------------------
// fileNameAccessibilityHelper
// ---------------------------------------------------------------------------
describe('fileNameAccessibilityHelper', () => {
  it('strips the file extension', () => {
    expect(fileNameAccessibilityHelper('report.pdf')).toBe('report');
  });

  it('strips only the last extension when multiple dots are present', () => {
    expect(fileNameAccessibilityHelper('my.report.final.pdf')).toBe('my.report.final');
  });

  it('returns the full name when there is no extension', () => {
    expect(fileNameAccessibilityHelper('README')).toBe('README');
  });

  it('returns an empty string for a dotfile like ".gitignore"', () => {
    // lastIndexOf('.') === 0 → substring(0, 0) === ''
    expect(fileNameAccessibilityHelper('.gitignore')).toBe('');
  });

  it('returns undefined without throwing when given undefined', () => {
    expect(fileNameAccessibilityHelper(undefined as any)).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// internationalizeVariables
// ---------------------------------------------------------------------------
describe('internationalizeVariables', () => {
  it('has the correct largeDataMessage', () => {
    expect(internationalizeVariables.largeDataMessage).toBe(
      'Data too large to be previewed. Please download the file to view it.'
    );
  });

  it('has the correct unSupportedFileMessage', () => {
    expect(internationalizeVariables.unSupportedFileMessage).toBe(
      'File format not supported for preview. File is being downloaded'
    );
  });

  it('has the correct noPreview message', () => {
    expect(internationalizeVariables.noPreview).toBe('No data available for preview');
  });

  it('has the correct fileNotSelected message', () => {
    expect(internationalizeVariables.fileNotSelected).toBe('No file selected for preview');
  });
});

// ---------------------------------------------------------------------------
// ensureBinarySrc
// ---------------------------------------------------------------------------
describe('ensureBinarySrc', () => {
  beforeEach(() => {
    globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock-url-123');
    globalThis.URL.revokeObjectURL = vi.fn();
  });

  it('returns existing binaryData as-is for a non-PDF image', () => {
    const file = { binaryData: 'data:image/png;base64,abc123', contentType: 'image/png' };
    const { src, isObjectUrl } = ensureBinarySrc(file, 'png');
    expect(src).toBe('data:image/png;base64,abc123');
    expect(isObjectUrl).toBe(false);
  });

  it('returns a blob: URL as-is for a PDF that already has blob: binaryData', () => {
    const file = { binaryData: 'blob:http://localhost/f00', contentType: 'application/pdf' };
    const { src, isObjectUrl } = ensureBinarySrc(file, 'pdf');
    expect(src).toBe('blob:http://localhost/f00');
    expect(isObjectUrl).toBe(true);
  });

  it('creates an object URL for a PDF with raw base64 binaryData', () => {
    const file = { binaryData: btoa('fake pdf bytes'), contentType: 'application/pdf' };
    const { src, isObjectUrl } = ensureBinarySrc(file, 'pdf');
    expect(URL.createObjectURL).toHaveBeenCalledOnce();
    expect(src).toBe('blob:mock-url-123');
    expect(isObjectUrl).toBe(true);
  });

  it('strips the data: prefix before creating a PDF object URL', () => {
    const file = {
      binaryData: `data:application/pdf;base64,${btoa('fake pdf bytes')}`,
      contentType: 'application/pdf',
    };
    const { isObjectUrl } = ensureBinarySrc(file, 'pdf');
    expect(URL.createObjectURL).toHaveBeenCalledOnce();
    expect(isObjectUrl).toBe(true);
  });

  it('builds a data URL from fetched base64 for non-PDF files that have no binaryData', () => {
    const file = { contentType: 'image/jpeg' };
    const b64 = btoa('jpeg bytes');
    const { src, isObjectUrl } = ensureBinarySrc(file, 'jpg', b64);
    expect(src).toBe(`data:image/jpeg;base64,${b64}`);
    expect(isObjectUrl).toBe(false);
  });

  it('creates a PDF object URL from fetched base64 when file has no binaryData', () => {
    const file = { contentType: 'application/pdf' };
    const { isObjectUrl } = ensureBinarySrc(file, 'pdf', btoa('pdf content'));
    expect(URL.createObjectURL).toHaveBeenCalledOnce();
    expect(isObjectUrl).toBe(true);
  });

  it('marks a blob: binaryData as isObjectUrl true even for non-PDF types', () => {
    const file = { binaryData: 'blob:http://localhost/img', contentType: 'image/png' };
    const { isObjectUrl } = ensureBinarySrc(file, 'png');
    expect(isObjectUrl).toBe(true);
  });

  it('uses contentType to detect PDF even when the type param is empty', () => {
    const file = { binaryData: btoa('pdf'), contentType: 'application/pdf' };
    const { isObjectUrl } = ensureBinarySrc(file, '');
    expect(isObjectUrl).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// fileDownloadHelper
// ---------------------------------------------------------------------------
describe('fileDownloadHelper', () => {
  it('creates an anchor element, sets href and download, then clicks and removes it', () => {
    const mockAnchor = { href: '', download: '', click: vi.fn(), remove: vi.fn() };
    vi.spyOn(document, 'createElement').mockReturnValueOnce(mockAnchor as any);

    fileDownloadHelper('data:image/png;base64,abc', { fileName: 'photo.png' });

    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(mockAnchor.href).toBe('data:image/png;base64,abc');
    expect(mockAnchor.download).toBe('photo.png');
    expect(mockAnchor.click).toHaveBeenCalledOnce();
    expect(mockAnchor.remove).toHaveBeenCalledOnce();
  });

  it('falls back to file.name when fileName is absent', () => {
    const mockAnchor = { href: '', download: '', click: vi.fn(), remove: vi.fn() };
    vi.spyOn(document, 'createElement').mockReturnValueOnce(mockAnchor as any);

    fileDownloadHelper('blob:http://localhost/abc', { name: 'image.jpg' });
    expect(mockAnchor.download).toBe('image.jpg');
  });
});

// ---------------------------------------------------------------------------
// buildTrimmedSheetHtml
// ---------------------------------------------------------------------------
describe('buildTrimmedSheetHtml', () => {
  it('returns an empty table when the sheet has no rows', () => {
    (XLSX.utils.sheet_to_json as any).mockReturnValue([]);
    const html = buildTrimmedSheetHtml({} as any);
    expect(html).toContain('<table');
    expect(html).toContain('<tbody>');
    expect(html).not.toContain('<tr');
  });

  it('renders <tr> rows for each non-empty data row', () => {
    (XLSX.utils.sheet_to_json as any).mockReturnValue([
      ['Name', 'Score'],
      ['Alice', '95'],
    ]);
    const html = buildTrimmedSheetHtml({} as any);
    expect(html).toContain('<tr');
    expect(html).toContain('Name');
    expect(html).toContain('Alice');
    expect(html).toContain('95');
  });

  it('escapes HTML entities to prevent XSS in cell values', () => {
    (XLSX.utils.sheet_to_json as any).mockReturnValue([
      ['<script>alert(1)</script>', '"quoted"', "'single'", '&amp;'],
    ]);
    const html = buildTrimmedSheetHtml({} as any);
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('&quot;quoted&quot;');
    expect(html).toContain('&#x27;single&#x27;');
    expect(html).not.toContain('<script>');
  });

  it('handles null and undefined cell values without throwing', () => {
    (XLSX.utils.sheet_to_json as any).mockReturnValue([[null, undefined, 'ok']]);
    expect(() => buildTrimmedSheetHtml({} as any)).not.toThrow();
  });

  it('applies bg-gray-100 to odd-indexed rows', () => {
    (XLSX.utils.sheet_to_json as any).mockReturnValue([['row0'], ['row1'], ['row2']]);
    const html = buildTrimmedSheetHtml({} as any);
    expect(html).toContain('bg-gray-100');
  });

  it('trims trailing rows that contain only empty/null cells', () => {
    (XLSX.utils.sheet_to_json as any).mockReturnValue([
      ['A', 'B'],
      [null, null],
      ['', '  '],
    ]);
    const html = buildTrimmedSheetHtml({} as any);
    const rowCount = (html.match(/<tr/g) ?? []).length;
    expect(rowCount).toBe(1);
  });

  it('returns an empty table (does not throw) when sheet parsing raises an error', () => {
    (XLSX.utils.sheet_to_json as any).mockImplementation(() => {
      throw new Error('parse error');
    });
    const html = buildTrimmedSheetHtml({} as any);
    expect(html).toContain('<table');
    expect(html).not.toContain('<tr');
  });
});

// ---------------------------------------------------------------------------
// generateSheetHtmls
// ---------------------------------------------------------------------------
describe('generateSheetHtmls', () => {
  it('returns hasLargeData: true when a sheet exceeds 1000 rows', () => {
    (XLSX.read as any).mockReturnValue({
      SheetNames: ['Sheet1'],
      Sheets: { Sheet1: { '!ref': 'A1:Z1002' } },
    });
    (XLSX.utils.decode_range as any).mockReturnValue({ e: { r: 1001, c: 25 } });

    const result = generateSheetHtmls(new ArrayBuffer(8));
    expect(result.hasLargeData).toBe(true);
    expect(result.htmls).toHaveLength(0);
  });

  it('returns hasLargeData: true when a sheet exceeds 200 columns', () => {
    (XLSX.read as any).mockReturnValue({
      SheetNames: ['Wide'],
      Sheets: { Wide: { '!ref': 'A1:GS5' } },
    });
    (XLSX.utils.decode_range as any).mockReturnValue({ e: { r: 4, c: 200 } });

    const result = generateSheetHtmls(new ArrayBuffer(8));
    expect(result.hasLargeData).toBe(true);
  });

  it('returns an htmls entry per sheet for a normal-sized workbook', () => {
    (XLSX.read as any).mockReturnValue({
      SheetNames: ['Data', 'Summary'],
      Sheets: {
        Data: { '!ref': 'A1:D10' },
        Summary: { '!ref': 'A1:B5' },
      },
    });
    (XLSX.utils.decode_range as any).mockReturnValue({ e: { r: 9, c: 3 } });
    (XLSX.utils.sheet_to_json as any).mockReturnValue([
      ['h1', 'h2'],
      ['r1', 'r2'],
    ]);

    const result = generateSheetHtmls(new ArrayBuffer(8));
    expect(result.hasLargeData).toBeUndefined();
    expect(result.htmls).toHaveLength(2);
    expect(result.htmls![0].name).toBe('Data');
    expect(result.htmls![1].name).toBe('Summary');
    expect(result.htmls![0].id).toBe('sheet_0');
  });

  it('assigns sheet index-based ids to each entry', () => {
    (XLSX.read as any).mockReturnValue({
      SheetNames: ['A', 'B', 'C'],
      Sheets: { A: { '!ref': 'A1:A2' }, B: { '!ref': 'A1:A2' }, C: { '!ref': 'A1:A2' } },
    });
    (XLSX.utils.decode_range as any).mockReturnValue({ e: { r: 1, c: 0 } });
    (XLSX.utils.sheet_to_json as any).mockReturnValue([['v']]);

    const { htmls } = generateSheetHtmls(new ArrayBuffer(8));
    expect(htmls![0].id).toBe('sheet_0');
    expect(htmls![1].id).toBe('sheet_1');
    expect(htmls![2].id).toBe('sheet_2');
  });

  it('skips the large-data check for sheets without a !ref property', () => {
    (XLSX.read as any).mockReturnValue({
      SheetNames: ['Empty'],
      Sheets: { Empty: {} },
    });
    (XLSX.utils.sheet_to_json as any).mockReturnValue([]);

    const result = generateSheetHtmls(new ArrayBuffer(8));
    expect(result.hasLargeData).toBeUndefined();
    expect(result.htmls).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// purifyHTML — uses real DOMPurify (available in jsdom environment)
// ---------------------------------------------------------------------------
describe('purifyHTML', () => {
  it('passes safe HTML through unchanged', () => {
    const output = purifyHTML('<p>Hello <strong>world</strong></p>');
    expect(output).toContain('Hello');
    expect(output).toContain('<strong>');
  });

  it('strips <script> tags', () => {
    const output = purifyHTML('<p>safe</p><script>alert(1)</script>');
    expect(output).not.toContain('<script>');
    expect(output).toContain('<p>safe</p>');
  });

  it('returns an empty string for empty input', () => {
    expect(purifyHTML('')).toBe('');
  });

  it('adds rel="noopener noreferrer" to <a target="_blank"> links (custom hook)', () => {
    const output = purifyHTML('<a href="https://example.com" target="_blank">link</a>');
    expect(output).toContain('noopener noreferrer');
  });
});

// ---------------------------------------------------------------------------
// purifyFieldContent — uses real DOMPurify (available in jsdom environment)
// ---------------------------------------------------------------------------
describe('purifyFieldContent', () => {
  it('returns an empty string for null', () => {
    expect(purifyFieldContent(null)).toBe('');
  });

  it('returns an empty string for undefined', () => {
    expect(purifyFieldContent(undefined)).toBe('');
  });

  it('returns an empty string for an empty string', () => {
    expect(purifyFieldContent('')).toBe('');
  });

  it('passes safe styled content through', () => {
    const output = purifyFieldContent('<p style="color:red">Hello</p>');
    expect(output).toContain('Hello');
  });

  it('strips <script> tags while preserving safe markup', () => {
    const output = purifyFieldContent('<span>ok</span><script>evil()</script>');
    expect(output).not.toContain('<script>');
    expect(output).toContain('ok');
  });

  it('retains rowspan and colspan attributes on table cells', () => {
    const output = purifyFieldContent(
      '<table><tr><td rowspan="2" colspan="3">cell</td></tr></table>'
    );
    expect(output).toContain('rowspan');
    expect(output).toContain('colspan');
  });
});
