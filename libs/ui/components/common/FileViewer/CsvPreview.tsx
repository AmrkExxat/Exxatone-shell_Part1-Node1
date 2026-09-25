import React, { useEffect, useState } from 'react';
import {
  fileNameAccessibilityHelper,
  generateSheetHtmls,
  internationalizeVariables,
} from './helper';
import { Spinner } from '../Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudDownload } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../Buttons';

interface CsvPreviewProps {
  file: { id?: string; binaryData?: string; [x: string]: any };
  showSnackbar?: any;
  handleDownload?: any;
}

const CsvPreview: React.FC<CsvPreviewProps> = ({ file, showSnackbar, handleDownload }) => {
  const [sheetHtmls, setSheetHtmls] = useState<Array<{ name: string; html: string }>>([]);
  const [hasLargeData, setHasLargeData] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { noPreview, largeDataMessage } = internationalizeVariables;

  useEffect(() => {
    if (!file?.binaryData) return;

    setIsLoading(true);
    setHasLargeData(false);
    setSheetHtmls([]);

    fetch(file.binaryData)
      .then((r) => r.arrayBuffer())
      .then((buf) => {
        const htmls = generateSheetHtmls(buf);
        if (htmls?.hasLargeData) {
          setHasLargeData(true);
        } else {
          setSheetHtmls(htmls?.htmls);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        showSnackbar?.('error', err?.message || err);
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

  if (!sheetHtmls?.length || (!sheetHtmls[0]?.html && !hasLargeData)) {
    return (
      <div className="flex items-center justify-center p-4">
        <div id="file.noPreview">{noPreview}</div>
      </div>
    );
  }

  return (
    <div
      data-testid={`${file?.id}-csv-preview`}
      style={{ overflow: 'auto', height: '100%' }}
      tabIndex={-1}
      dangerouslySetInnerHTML={{
        __html: sheetHtmls[0]?.html || '',
      }}
    />
  );
};

export default CsvPreview;
