import * as _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import CsvPreview from './CsvPreview';
import DocxPreview from './DocxPreview';
import HeicImagePreview from './HeicImagePreview';
import XlsxPreview from './XlsxPreview';
import {
  ensureBinarySrc,
  fileDownloadHelper,
  fileNameAccessibilityHelper,
  internationalizeVariables,
  previewSupportedFileTypes,
} from './helper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudDownload, faXmarkCircle } from '@fortawesome/pro-solid-svg-icons';
import { Spinner } from '../Spinner';
import { BottomSheet } from '../../layout';
import { Button } from '../Buttons';
import Notifications, { NotificationFunction } from '../Notifications/Notifications';

const FILE_UPDATED_AT_FORMAT = 'MM/DD/YYYY, hh:mm:ss A [GMT]Z';
interface Iprops {
  previewFile: string | boolean;
  onClose: () => void;
  filesArray: any;
  field?: any;
  onViewed?: (...args: any) => void;
  downloadHandler?: (file: any) => Promise<any>;
  fetchFileData: (id: string) => void;
  downloadTemporaryFile?: (file: any) => void;
  downloadCloudFile: (id: string, collectionId: string) => void;
}

const FileViewer = React.forwardRef(
  (
    {
      previewFile,
      filesArray,
      field,
      onClose,
      onViewed,
      downloadHandler,
      fetchFileData,
      downloadTemporaryFile,
      downloadCloudFile,
    }: Iprops,
    ref
  ) => {
    const [selectedFile, setSelectedFile] = useState<any>();
    const selectedFileIdRef = useRef<string | null>(null);
    const [loader, showLoader] = useState(false);
    const lastObjectUrlRef = React.useRef<string | null>(null);

    const newFileKey = '00000000-0000-0000-0000-000000000000';
    const { unSupportedFileMessage } = internationalizeVariables;
    const notificationRef = useRef<NotificationFunction>(null);

    const showSnackbar = (type, msg) => {
      notificationRef?.current?.handleNotification({
        show: true,
        message: msg,
        description: '',
        colorCode: type,
      });
    };

    const handleDownload = async (file: any) => {
      if (Boolean(downloadHandler)) {
        try {
          showLoader(true);
          await downloadHandler?.(file);
        } catch (error) {
          showSnackbar?.('error', error?.message);
        } finally {
          showLoader(false);
        }
        return;
      }
      if (file?.binaryData) fileDownloadHelper(file?.binaryData, file);
      else handleFileApiCall(file, true);
    };

    const { fileNotSelected } = internationalizeVariables;

    const fetchFileType = (file: any) => {
      const fileName = file.fileName ?? file.name;
      const nameArray = fileName?.split('.');
      return nameArray[nameArray?.length - 1];
    };

    React.useImperativeHandle(ref, () => {
      return {
        handleDownload: (file: any) => handleDownload(file),
      };
    });

    useEffect(() => {
      if (!previewFile || !filesArray?.length) {
        setSelectedFile(false);
        selectedFileIdRef.current = null;
        return;
      }
      if (typeof previewFile == 'string')
        handleFilePreview(_.find(filesArray, (file) => file.id === previewFile));
      else handleFilePreview(filesArray[0]);
    }, [previewFile, filesArray]);

    useEffect(() => {
      if (previewFile) {
        setTimeout(() => {
          const btn = document.getElementById(`file_viewer_close_btn`);
          btn?.focus();
        }, 0);
      }
    }, [previewFile]);

    const setSelectedFileWithSrc = (file: any, src: string, isObjectUrl: boolean) => {
      if (lastObjectUrlRef.current) {
        URL.revokeObjectURL(lastObjectUrlRef.current);
        lastObjectUrlRef.current = null;
      }
      if (isObjectUrl) lastObjectUrlRef.current = src;
      setSelectedFile({
        ...file,
        binaryData: src || file?.binaryData,
        isObjectUrl,
      });
    };

    const fetchFileHelper = async (id: string, file: any, type: string, download?: boolean) => {
      showLoader(true);
      const colId = file.fileCollectionKey ?? file.collectionId;
      try {
        let res: any = null;
        if (Boolean(downloadHandler)) {
          res = await downloadCloudFile(file.id, colId);
        } else if (file?.cloudUpload && (!colId || colId === newFileKey) && downloadTemporaryFile)
          res = await downloadTemporaryFile(file);
        else res = await fetchFileData(id);

        const { src, isObjectUrl } = ensureBinarySrc(file, type, res?.content);
        setSelectedFileWithSrc(file, src, isObjectUrl);

        let downloadFile = download;
        if (previewSupportedFileTypes?.includes(type?.toLowerCase()) && !downloadFile) {
          showLoader(false);
        } else if (downloadFile) showLoader(false);
        else {
          showSnackbar?.('info', 'File format not supported for preview. File is being downloaded');
          showLoader(false);
          downloadFile = true;
        }

        if (downloadFile) fileDownloadHelper(src, file);
      } catch (err) {
        showLoader(false);
        showSnackbar?.('error', err?.message);
      }
    };

    const handleFileApiCall = (file: any, download?: boolean) => {
      const type = fetchFileType(file);
      fetchFileHelper(file?.id, file, type, download);
    };

    const filePreviewHelper = (file: any) => {
      const type = fetchFileType(file);
      const { src, isObjectUrl } = ensureBinarySrc(file, type);
      setSelectedFileWithSrc(file, src, isObjectUrl);
      if (!previewSupportedFileTypes?.includes(type?.toLowerCase())) {
        showSnackbar?.('info', 'File format not supported for preview. File is being downloaded');
        fileDownloadHelper(file?.binaryData, file);
      }
    };

    const handleFilePreview = (file: any) => {
      if (!file) return;
      const colId = file.fileCollectionKey ?? file.collectionId;

      const isMinimalServerFile = !file?.binaryData && !file?.cloudUpload && !colId;

      if (file?.id && selectedFile?.id === file?.id && !isMinimalServerFile) {
        return;
      }
      selectedFileIdRef.current = file?.id;
      if (Boolean(downloadHandler)) {
        handleFileApiCall(file);
        return;
      }

      if (isMinimalServerFile || (file?.cloudUpload && (!colId || colId === newFileKey))) {
        handleFileApiCall(file);
        return;
      }

      if (file?.binaryData) {
        filePreviewHelper(file);
        return;
      }

      handleFileApiCall(file);
    };

    const renderPreview = () => {
      if (!previewFile) return <></>;
      try {
        if (field?.sourceLink) {
          return (
            <iframe
              title={`${field?.description || field?.fieldId} video preview`}
              data-testid={`${field?.fieldId}-iframe-preview`}
              width={'100%'}
              height={'100%'}
              src={`${field?.sourceLink}?autoplay=1&controls=${field?.videoControls ? '1' : '0'}`}
            ></iframe>
          );
        } else {
          const fileName = selectedFile.fileName ?? selectedFile.name;
          const fileTypeAr = selectedFile ? fileName?.split('.') : [];
          const fileType = fileTypeAr[fileTypeAr?.length - 1] || '';

          if (fileType === 'mp4') {
            return (
              <video
                data-testid={`${selectedFile?.id}-video-preview`}
                aria-label={`${fileNameAccessibilityHelper(selectedFile?.fileName ?? selectedFile?.name)} video preview`}
                src={selectedFile?.binaryData}
                controls={field?.videoControls}
                autoPlay
                onEnded={onViewed}
              ></video>
            );
          }

          if (['png', 'jpg', 'jpeg', 'bmp', 'gif'].includes(fileType)) {
            return (
              <img
                data-testid={`${selectedFile?.id}-image-preview`}
                src={selectedFile?.binaryData}
                alt={`${fileNameAccessibilityHelper(selectedFile?.fileName ?? selectedFile?.name)} preview`}
                style={{ maxWidth: '100%', height: 'auto' }}
                className="rounded-lg"
              />
            );
          }

          if (fileType === 'heic') {
            return <HeicImagePreview file={selectedFile} showSnackbar={showSnackbar} />;
          }

          if (fileType === 'pdf') {
            return (
              <iframe
                title={`${fileNameAccessibilityHelper(selectedFile?.fileName ?? selectedFile?.name)} pdf preview`}
                data-testid={`${selectedFile?.id}-pdf-preview`}
                width={'100%'}
                height={'100%'}
                src={selectedFile?.binaryData}
                style={{ colorScheme: 'light' }}
              ></iframe>
            );
          }

          if (fileType === 'mp3') {
            return (
              <audio
                data-testid={`${selectedFile?.id}-audio-preview`}
                controls
                src={selectedFile?.binaryData}
              />
            );
          }

          if (fileType === 'csv') {
            return (
              <CsvPreview
                file={selectedFile}
                showSnackbar={showSnackbar}
                handleDownload={handleDownload}
              />
            );
          }

          if (fileType === 'docx') {
            return <DocxPreview file={selectedFile} showSnackbar={showSnackbar} />;
          }

          if (
            ['doc', 'rtf', 'tiff', 'docm', 'ppt', 'pptm', 'potx', 'potm', 'pptx']?.includes(
              fileType
            )
          ) {
            return (
              <div className="flex items-center justify-center p-4">
                <div id="file.unSupportedFileMessage">{unSupportedFileMessage}</div>
              </div>
            );
          }

          if (fileType === 'xlsx' || fileType === 'xls') {
            return (
              <XlsxPreview
                file={selectedFile}
                showSnackbar={showSnackbar}
                handleDownload={handleDownload}
              />
            );
          }

          return <></>;
        }
      } catch (err) {
        showSnackbar?.('error', err?.message);
      }
    };

    const renderPreviewContent = () => {
      if (loader) {
        return (
          <div
            role="status"
            aria-label="Loading file preview"
            className="flex h-full w-full items-center justify-center"
          >
            <Spinner size="md" />
          </div>
        );
      }

      const hasPreviewContent = (field && field?.sourceLink) || selectedFile;
      if (hasPreviewContent) {
        return renderPreview();
      }

      return (
        <div className="flex items-center justify-center py-2">
          <div id="file.unSupportedFileMessage">{fileNotSelected}</div>
        </div>
      );
    };

    useEffect(() => {
      return () => {
        if (lastObjectUrlRef.current) {
          URL.revokeObjectURL(lastObjectUrlRef.current);
          lastObjectUrlRef.current = null;
        }
      };
    }, []);

    return (
      <BottomSheet
        isOpen={previewFile ? true : false}
        onClose={onClose}
        ariaLabelledBy={'File Viewer'}
        zIndex={'z-[51]'}
        className="h-[97vh] w-[95%]"
      >
        {previewFile && (
          <div className="flex flex-col gap-2 p-4">
            <Notifications ref={notificationRef} />
            <div className="flex w-full items-center justify-between">
              <div className="text-lg font-semibold">File Viewer</div>
              <Button
                id="file_viewer_close_btn"
                testid="file_viewer_close_btn"
                aria-label="Close File Viewer"
                className="hover:bg-hover flex h-7 w-7 flex-col items-center justify-center rounded-full"
                onClick={() => {
                  onClose();
                  setTimeout(
                    () =>
                      document
                        .getElementById('internship_school_request_move_slots_cancel_btn')
                        ?.focus(),
                    500
                  );
                }}
                variant="basic"
              >
                <FontAwesomeIcon icon={faXmarkCircle} className="h-5 w-5 text-[#5D779A]" />
              </Button>
            </div>
            <div className="flex flex-1 gap-1">
              <div
                role="listbox"
                aria-label="Files"
                className="flex h-[calc(97vh_-_70px)] max-w-[28%] flex-col gap-2 overflow-y-auto pr-1"
              >
                {_.map(filesArray, (file: any, index: number) => {
                  const isFileSelected = file?.id === selectedFile?.id;
                  const m = moment.utc(file?.updatedTimestamp).local();
                  const updatedAtDisplay =
                    file?.updatedTimestamp && m.isValid() ? m.format(FILE_UPDATED_AT_FORMAT) : '';
                  return (
                    <div
                      key={file?.id}
                      role="option"
                      tabIndex={0}
                      data-testid={`file-${file?.id}-details`}
                      className={`flex cursor-pointer justify-between gap-2 rounded-lg border px-2 py-2 ${selectedFileIdRef.current === file?.id ? 'bg-blue-50' : ''}`}
                      aria-label={`${fileNameAccessibilityHelper(file?.fileName ?? file?.name)} preview`}
                      aria-selected={isFileSelected}
                      onClick={() => handleFilePreview(file)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleFilePreview(file);
                        }
                      }}
                    >
                      <div className="flex flex-col gap-1">
                        <div>{file.fileName ?? file.name}</div>
                        <div className="text-xs text-gray-500">{updatedAtDisplay}</div>
                      </div>
                      <Button
                        variant="basic"
                        id={'download_file_' + index}
                        testid={'download_file_' + index}
                        aria-label={`${fileNameAccessibilityHelper(file?.fileName ?? file?.name)} download`}
                        className="flex h-4 w-4 flex-col items-center justify-center rounded-full hover:bg-blue-100"
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
                        <FontAwesomeIcon icon={faCloudDownload} className="text-primary h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
              <div
                aria-live="polite"
                aria-atomic="false"
                aria-label="File preview"
                className={`h-[calc(97vh_-_70px)] flex-1 overflow-auto rounded-lg ${selectedFile?.name?.includes('xlsx') || selectedFile?.name?.includes('xls') ? 'border' : ''} ${selectedFile?.name?.includes('docx') ? 'border-2' : ''}`}
              >
                {renderPreviewContent()}
              </div>
            </div>
          </div>
        )}
      </BottomSheet>
    );
  }
);

export default FileViewer;
