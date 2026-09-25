import React, { useState, ChangeEvent, DragEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp, faTrashAlt } from '@fortawesome/pro-light-svg-icons';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from './constants';
import { FileUploadProps } from './FileUpload.types';

function FileUpload({
  disabled = false,
  hideLabel = false,
  handleFileChange,
  selectedFiles,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState(selectedFiles ? selectedFiles : []);

  const handleFileSelection = (files: FileList) => {
    const validFiles = Array.from(files).filter((file) => {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        alert(`Invalid file format: ${file.name}. Please upload a valid file.`);
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        alert(`File size exceeds the 7 MB limit: ${file.name}`);
        return false;
      }
      return true;
    });
    setFiles((prev) => {
      const updatedFiles = [...prev, ...validFiles];
      handleFileChange(updatedFiles);
      setTimeout(() => document.getElementById('delete_0_btn')?.focus(), 100);
      return updatedFiles;
    });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      handleFileSelection(event.target.files);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    if (event.dataTransfer.files) {
      handleFileSelection(event.dataTransfer.files);
    }
  };

  const handleDeleteFile = (fileToDelete: File) => {
    // const updatedFiles = selectedFiles.filter((file) => file !== fileToDelete);
    setFiles((prev) => {
      const index = prev?.findIndex((file) => file === fileToDelete);
      const updatedFiles = prev.filter((file) => file !== fileToDelete);
      handleFileChange(updatedFiles);
      setTimeout(() => {
        if (updatedFiles.length > 0) {
          const element = document.getElementById(
            `delete_${index > 0 && (index < updatedFiles.length ? index : index - 1)}_btn`
          );
          element?.focus();
        } else {
          document.getElementById('file_upload_btn')?.focus();
        }
      }, 100);
      return updatedFiles;
    });
  };
  return (
    <div className="bg-card w-full">
      <label
        htmlFor="file-upload"
        className={`block text-sm leading-6 font-medium text-gray-900 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        Upload Attachments
        <div
          className={`mt-2 flex items-center justify-center rounded-lg border ${isDragOver ? 'border-primary' : `border-dashed ${disabled ? 'border-gray-900/25' : 'file-upload-border'}`} px-6 py-4`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="region"
        >
          <div className="py-2 text-center">
            <FontAwesomeIcon
              icon={faCloudArrowUp}
              className={`mx-auto mt-2 h-8 w-8 ${disabled ? 'text-gray-600' : 'text-primary'}`}
              aria-hidden="true"
            />
            <div className="flex items-center justify-center text-sm leading-6 text-gray-600">
              <label
                className={`focus-within:ring-primary bg-card relative rounded-md font-semibold focus-within:ring-2 focus-within:ring-offset-2 focus-within:outline-none ${disabled ? 'cursor-not-allowed text-gray-600' : 'text-primary hover:text-primary cursor-pointer'}`}
                id="file_upload_btn"
              >
                <div
                  role="button"
                  aria-describedby="upload-description"
                  tabIndex={0}
                  aria-label={`Upload files : Currently uploaded ${files.length} files`}
                >
                  Upload files
                </div>
                <div className="text-xs font-light text-gray-600">(or drag and drop the files)</div>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleChange}
                  disabled={disabled}
                  multiple
                  tabIndex={-1}
                />
              </label>
            </div>
          </div>
        </div>
      </label>

      {selectedFiles?.length > 0 && (
        <div className="mt-2">
          {files.map((file, index) => (
            <div key={index} className="mb-2 flex items-center text-sm text-gray-600">
              <strong className="file-name mr-2">{file.name}</strong>
              <button
                tabIndex={0}
                id={`delete_${index}_btn`}
                onClick={() => handleDeleteFile(file)}
                aria-label={`Delete file ${file.name}`}
                className={`delete-button focus-indicator ml-2 h-4 w-4 text-red-600 hover:text-red-700`}
              >
                <FontAwesomeIcon icon={faTrashAlt} className="cursor-pointer" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500" id="upload-description">
        <p>
          You can upload files in the following formats: .pdf, .doc, .jpg, .jpeg, .png, .docx,
          .xlsx, .pptx, .pptm, .potx, .potm, .ppt, .rtf, .xls, .docm, .bmp, .csv, .gif, .tiff, .jp2,
          and .mp4. However, files with extensions like .pdf, .doc, .docx, .xlsx, .pptx, .pptm,
          .potx, .potm, .ppt, .rtf, .xls, .docm, .bmp, .csv, .tiff, .jp2, and .mp4 can't be viewed
          within the document viewer. They can be downloaded for offline access.
        </p>
        <p>
          Size limit for a single file is 7 MB. The total of all email attachments cannot exceed 25
          MB.
        </p>
        <p>
          We recommend saving the files in PDF format if you encounter any issues viewing the
          uploaded files in other formats.
        </p>
      </div>
    </div>
  );
}

export default FileUpload;
