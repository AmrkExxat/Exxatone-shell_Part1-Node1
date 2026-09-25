'use client';

import React, { useRef, useState, useEffect, useLayoutEffect, useCallback, useId } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Menu, MenuActionItem, MenuItem } from '../../../../../radixUi/Menu/Menu';
import { faEye, faTrash, faRotate } from '@fortawesome/pro-light-svg-icons';
import { faCircleExclamation, faEllipsisVertical, faPlus } from '@fortawesome/free-solid-svg-icons';
import { twMerge } from 'tailwind-merge';

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
}

const defaultItemsInMenu: MenuItem[] = [
  {
    id: 'view',
    label: 'View',
    testId: 'menu-item-view',
    icon: <FontAwesomeIcon icon={faEye} className="h-4 w-4" />,
  },
  { id: 'separator1', type: 'separator' },
  {
    id: 'replace',
    label: 'Replace',
    testId: 'menu-item-replace',
    icon: <FontAwesomeIcon icon={faRotate} className="h-4 w-4" />,
  },
  { id: 'separator2', type: 'separator' },
  {
    id: 'delete',
    label: 'Delete',
    testId: 'menu-item-delete',
    icon: <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />,
    variant: 'danger',
  },
];

/** Progress callback type for upload function */
export type UploadProgressCallback = (progress: number) => void;

/** Upload result type - returned from upload function */
export interface UploadResult {
  success: boolean;
  error?: string;
}

/** Upload function type - receives file and progress callback, returns upload result */
export type UploadFunction = (
  file: File,
  onProgress: UploadProgressCallback
) => Promise<UploadResult>;

export interface NewFileUploadProps {
  /** Text shown in the drop zone area */
  dropzoneText?: string;
  /** Hint text showing supported formats */
  formatHint?: string;
  /** Maximum file size in MB */
  maxFileSizeMB?: number;
  /** Array of accepted file extensions (e.g., ['.pdf', '.doc']) */
  acceptedExtensions?: string[];
  /** Text shown while file is uploading */
  uploadingText?: string;
  /** Text shown when upload fails */
  uploadFailedText?: string;
  /** Text for replace file button */
  replaceText?: string;
  /** Upload function - receives file and progress callback, returns UploadResult with success/failure */
  onUploadFile?: UploadFunction;
  /** Width of the drop zone container */
  width?: string | number;
  /** Selected file */
  selectedFile?: File | null;
  /** Height of the drop zone container */
  height?: string | number;
  menuItems?: MenuItem[] | null;
  clearBit?: number;
  handleChangeMenuItems?: (item: MenuActionItem) => void;
  handleFiles?: (file: File | null) => void;
  containerClassName?: string;
  disabled?: boolean;
}

const NewFileUpload = ({
  dropzoneText = 'Upload or drag & drop your file',
  formatHint = 'PDF, DOC or DOCX • Max 2 MB',
  maxFileSizeMB = 2,
  acceptedExtensions = ['.pdf', '.doc', '.docx'],
  uploadingText = 'Uploading file...',
  uploadFailedText = 'Upload failed. Please try again.',
  replaceText = 'Replace file',
  width = 480,
  onUploadFile,
  selectedFile,
  height = 230,
  menuItems = defaultItemsInMenu,
  clearBit = 0,
  handleChangeMenuItems,
  handleFiles,
  containerClassName = '',
  disabled = false,
}: NewFileUploadProps): React.ReactNode => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(selectedFile ?? null);
  const [error, setError] = useState<string | null>(null);
  const [uploadFailed, setUploadFailed] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [liveAnnouncement, setLiveAnnouncement] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileActionsButtonRef = useRef<HTMLButtonElement>(null);
  const uploadPlusFocusRef = useRef<HTMLDivElement>(null);
  const shouldFocusFileActionsAfterUploadRef = useRef(false);
  const shouldFocusUploadAfterDeleteRef = useRef(false);
  const acceptString = acceptedExtensions.join(',');
  const fileInputId = useId();
  const errorMessageId = useId();
  const uploadFailedId = useId();
  const formatHintId = useId();
  const progressStatusId = useId();
  const actionsLabelId = useId();

  const getFileExtension = (filename: string): string => {
    return filename.split('.').pop()?.toUpperCase() || 'FILE';
  };

  const handleFile = useCallback(
    async (file: File) => {
      if (disabled) return;
      setError(null);
      setUploadFailed(false);

      // Validate file extension
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!acceptedExtensions.includes(fileExtension)) {
        const formattedExtensions = acceptedExtensions
          .map((ext) => ext.replace('.', '').toUpperCase())
          .join(', ');
        setError(`Invalid file format: ${file.name}. Please upload a ${formattedExtensions} file.`);
        return;
      }

      // Validate file size
      const maxSizeInBytes = maxFileSizeMB * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        setError(`File size exceeds the ${maxFileSizeMB} MB limit: ${file.name}`);
        return;
      }

      // Set the uploaded file
      setUploadedFile(file);

      // Call upload function if provided
      if (onUploadFile) {
        setIsUploading(true);
        setUploadProgress(0);
        setLiveAnnouncement('');
        setTimeout(() => {
          setLiveAnnouncement(uploadingText);
        }, 100);
        requestAnimationFrame(() => {
          document.getElementById(progressStatusId)?.focus();
        });

        const result = await onUploadFile(file, (progress) => {
          setUploadProgress(progress);
        });

        setIsUploading(false);
        setLiveAnnouncement('');

        if (!result.success) {
          setUploadFailed(true);
          if (result.error) {
            setError(result.error);
          }
        } else {
          shouldFocusFileActionsAfterUploadRef.current = true;
        }
      } else {
        shouldFocusFileActionsAfterUploadRef.current = true;
      }
    },
    [maxFileSizeMB, acceptedExtensions, onUploadFile, disabled, uploadingText]
  );

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    },
    [disabled]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    },
    [disabled]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 1) {
        setError('Please upload only one file at a time');
        return;
      }

      if (files.length === 1) {
        handleFile(files[0]);
      }
    },
    [handleFile, disabled]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFile(files[0]);
      }
      // Reset input value to allow re-uploading same file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [handleFile, disabled]
  );

  const handleUploadClick = useCallback(() => {
    if (disabled) return;
    fileInputRef.current?.click();
  }, [disabled]);

  const containerStyle: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  const handleDeleteFile = useCallback(() => {
    if (disabled) return;
    shouldFocusUploadAfterDeleteRef.current = true;
    setUploadedFile(null);
    handleFiles?.(null);
  }, [disabled, handleFiles]);

  useLayoutEffect(() => {
    if (!shouldFocusFileActionsAfterUploadRef.current) return;

    if (!uploadedFile || uploadFailed || isUploading) return;

    shouldFocusFileActionsAfterUploadRef.current = false;

    const raf = requestAnimationFrame(() => {
      fileActionsButtonRef.current?.focus();
    });

    return () => cancelAnimationFrame(raf);
  }, [uploadedFile, uploadFailed, isUploading]);

  useLayoutEffect(() => {
    if (!shouldFocusUploadAfterDeleteRef.current) return;

    if (uploadedFile !== null) return;

    shouldFocusUploadAfterDeleteRef.current = false;

    if (disabled) return;

    const raf = requestAnimationFrame(() => {
      setTimeout(() => {
        uploadPlusFocusRef.current?.focus();
      }, 500);
    });

    return () => cancelAnimationFrame(raf);
  }, [uploadedFile, disabled]);

  useEffect(() => {
    if (clearBit > 0) {
      handleDeleteFile();
    }
  }, [clearBit]);

  const onChangeMenuItems = useCallback(
    (item: MenuActionItem) => {
      if (item?.id === 'delete') {
        handleDeleteFile();
      } else if (item?.id === 'replace') {
        handleUploadClick();
      } else {
        handleChangeMenuItems?.(item);
      }
    },
    [handleDeleteFile, handleUploadClick, handleChangeMenuItems]
  );

  const isDropZoneActive = !uploadedFile || uploadFailed;

  return (
    <div
      id="drop-zone-container"
      style={containerStyle}
      className={twMerge(
        `relative flex flex-col items-center justify-center rounded-xl border p-4 text-center transition-all duration-200 ${
          disabled
            ? 'cursor-not-allowed border-gray-200 bg-gray-50 opacity-60'
            : isUploading
              ? 'cursor-default border-gray-200'
              : uploadedFile && !uploadFailed
                ? 'cursor-default border-gray-200'
                : isDragging
                  ? 'cursor-pointer border-violet-500 bg-violet-50'
                  : 'cursor-pointer border-gray-300'
        } ${isDropZoneActive ? '' : ''}`,
        containerClassName
      )}
      onDragEnter={isUploading || disabled ? undefined : handleDragEnter}
      onDragLeave={isUploading || disabled ? undefined : handleDragLeave}
      onDragOver={isUploading || disabled ? undefined : handleDragOver}
      onDrop={isUploading || disabled ? undefined : handleDrop}
      role={isDropZoneActive ? undefined : 'group'}
      aria-disabled={disabled || undefined}
    >
      <div aria-live="assertive" aria-atomic="true" className="sr-only">
        {liveAnnouncement}
      </div>
      <div className="flex h-full w-full flex-col items-center justify-center">
        {uploadedFile && !uploadFailed ? (
          /* Uploading / Uploaded State with Progress Bar */
          <div className="flex w-full flex-col items-center px-2">
            {/* Progress Bar with File Type and Filename */}
            <div
              className="mx-auto w-full max-w-[244px] cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-[56px] w-full overflow-hidden rounded-md bg-gray-200">
                <div
                  className="absolute inset-0 overflow-hidden rounded-md"
                  role="progressbar"
                  aria-valuenow={isUploading ? uploadProgress : 100}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={
                    isUploading ? 'Upload progress' : `File uploaded: ${uploadedFile.name}`
                  }
                  aria-describedby={progressStatusId}
                >
                  {/* Progress Fill with content inside */}
                  <div
                    className="absolute inset-y-0 left-0 overflow-hidden bg-violet-200 transition-all duration-150 ease-out"
                    style={{ width: `${isUploading ? uploadProgress : 100}%` }}
                  >
                    {/* File Type Badge + Filename (only visible within progress fill) */}
                    <div className="flex h-full w-full items-center gap-2 px-3 whitespace-nowrap">
                      <span className="flex items-center gap-1 rounded">
                        <span className="flex items-center gap-1">
                          <span className="bg-card rounded px-1.5 py-0.5 text-xs font-semibold text-red-600">
                            {getFileExtension(uploadedFile.name)}
                          </span>

                          <span className="max-w-[160px] truncate text-sm font-medium text-gray-900">
                            {uploadedFile.name.replace(/\.[^/.]+$/, '')}
                          </span>
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                {!isUploading && (
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <div className="pointer-events-auto">
                      <Menu
                        items={menuItems ?? []}
                        onSelect={onChangeMenuItems}
                        triggerTestId="menu-trigger"
                        contentTestId="menu-content"
                        triggerProps={{ 'aria-labelledby': actionsLabelId }}
                      >
                        <button
                          ref={fileActionsButtonRef}
                          type="button"
                          tabIndex={0}
                          className="focus-indicator inline-flex shrink-0 cursor-pointer appearance-none rounded border-0 bg-transparent p-1 outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
                          aria-labelledby={actionsLabelId}
                          aria-label={` ${uploadedFile.name.replace(/\.[^/.]+$/, '')} file actions`}
                        >
                          <FontAwesomeIcon
                            icon={faEllipsisVertical}
                            className="h-4 w-4 text-black"
                            aria-hidden
                          />
                        </button>
                      </Menu>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Status Text - described by progressbar via aria-describedby */}
            {isUploading ? (
              <p id={progressStatusId} className="mt-3 text-sm text-[#727279]">
                {uploadingText}
              </p>
            ) : (
              <button
                id={progressStatusId}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUploadClick();
                }}
                className="focus-indicator mt-3 text-sm font-medium text-black outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
              >
                {replaceText}
              </button>
            )}
          </div>
        ) : (
          /* Upload Prompt - label extends clickable area to entire drop zone and associates with file input */
          <label
            htmlFor={fileInputId}
            className={twMerge(
              'flex h-full w-full flex-col items-center justify-center',
              disabled ? 'pointer-events-none cursor-not-allowed opacity-60' : 'cursor-pointer'
            )}
          >
            <div className="mb-6 flex justify-center">
              <div
                ref={uploadPlusFocusRef}
                className={`focus-indicator focus-visible:ring-primary flex h-7 w-7 items-center justify-center rounded-full border-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  isDragging ? 'border-violet-400 bg-violet-100' : 'bg-card border-black'
                }`}
                tabIndex={disabled || (uploadedFile && !uploadFailed) ? -1 : 0}
                aria-labelledby="dropzone-label"
                aria-describedby={formatHintId}
                role="button"
                onKeyDown={(e) => {
                  if (disabled) return;
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
              >
                <FontAwesomeIcon
                  icon={faPlus}
                  className={`h-4 w-4 transition-colors ${
                    isDragging ? 'text-violet-600' : 'text-black'
                  }`}
                  aria-hidden
                />
              </div>
            </div>
            <p id="dropzone-label" className="font-medium text-gray-700">
              {dropzoneText}
            </p>
            <p id={formatHintId} className="text-sm text-gray-700">
              {formatHint}
            </p>
          </label>
        )}

        {/* File input: visually hidden but focusable for keyboard and screen reader */}
        <input
          id={fileInputId}
          ref={fileInputRef}
          type="file"
          className="sr-only"
          disabled={disabled}
          accept={acceptString}
          onChange={handleFileInputChange}
          aria-describedby={
            error
              ? errorMessageId
              : uploadFailed
                ? uploadFailedId
                : isDropZoneActive
                  ? formatHintId
                  : undefined
          }
          tabIndex={-1}
        />
      </div>

      {/* Upload Failed Banner - announced immediately to screen readers */}
      {uploadFailed && (
        <div
          id={uploadFailedId}
          role="alert"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-100 px-4 py-3"
          aria-live="assertive"
        >
          <FontAwesomeIcon
            icon={faCircleExclamation}
            className="h-4 w-4 text-red-500"
            aria-hidden
          />
          <span className="text-sm text-red-600">{uploadFailedText}</span>
        </div>
      )}

      {/* Validation Error Message - announced to screen readers */}
      {error && !uploadFailed && (
        <div
          id={errorMessageId}
          role="alert"
          className="flex w-full items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600"
          aria-live="polite"
        >
          <FontAwesomeIcon
            icon={faCircleExclamation}
            className="h-4 w-4 shrink-0 text-red-500"
            aria-hidden
          />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default NewFileUpload;
