import React, { useEffect, useState } from 'react';
import {
  fileNameAccessibilityHelper,
  generateSheetHtmls,
  internationalizeVariables,
} from './helper';
import { Spinner } from '../Spinner';
import { Tabs } from '../Tabs';
import { Button } from '../Buttons';
import { faCloudDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface XlsxPreviewProps {
  file: { id?: string; binaryData?: string; [x: string]: any };
  showSnackbar?: any;
  handleDownload?: any;
}

const XlsxPreview: React.FC<XlsxPreviewProps> = ({ file, showSnackbar, handleDownload }) => {
  const [sheetHtmls, setSheetHtmls] = useState<Array<{ name: string; html: string }>>([]);
  const [activeSheetIndex, setActiveSheetIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasLargeData, setHasLargeData] = useState<boolean>(false);
  const { noPreview, largeDataMessage } = internationalizeVariables;

  useEffect(() => {
    if (!file?.binaryData) return;

    setIsLoading(true);
    setHasLargeData(false);
    setSheetHtmls([]);
    setActiveSheetIndex(0);

    fetch(file.binaryData)
      .then((r) => r.arrayBuffer())
      .then((buf) => {
        const htmls = generateSheetHtmls(buf);
        if (htmls?.hasLargeData) {
          setHasLargeData(true);
        } else {
          setSheetHtmls(htmls?.htmls);
        }
        setActiveSheetIndex(0);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log('Error processing XLSX:', err);
        showSnackbar('error', err?.message || err);
        setIsLoading(false);
      });
  }, [file?.binaryData, file?.id]);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner size="md" />
      </div>
    );
  }

  if (hasLargeData) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-4">
        <div id="file.largeData">{largeDataMessage}</div>
        <Button
          variant="basic"
          id={'download_file_' + file.id}
          testid={'download_file_' + file.id}
          aria-label={`${fileNameAccessibilityHelper(file?.fileName ?? file?.name)} download`}
          className="flex h-15 w-15 flex-col items-center justify-center rounded-full hover:bg-blue-100"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e?.stopPropagation();
              handleDownload(file);
            }
          }}
          onClick={(event) => {
            event?.stopPropagation();
            handleDownload(file);
          }}
        >
          <FontAwesomeIcon icon={faCloudDownload} className="text-primary h-10 w-10" />
        </Button>
      </div>
    );
  }

  if (!sheetHtmls?.length || (!sheetHtmls[activeSheetIndex]?.html && !hasLargeData)) {
    return (
      <div className="flex items-center justify-center p-4">
        <div id="file.noPreview">{noPreview}</div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <Tabs
        id="excelSheet"
        tabs={sheetHtmls}
        position="start"
        type="tertiary"
        bottomBorderReq={false}
        activeIndex={activeSheetIndex}
        onTabChange={setActiveSheetIndex}
        className="border-b"
        bottomBorderClass="border-gray-100"
      />
      <div
        data-testid={`${file?.id}-xlsx-preview`}
        style={{ overflow: 'auto' }}
        tabIndex={-1}
        className="flex-1 overflow-auto"
        dangerouslySetInnerHTML={{
          __html: sheetHtmls[activeSheetIndex]?.html || '',
        }}
      />
    </div>
  );
};

export default XlsxPreview;
