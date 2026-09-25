import { TrashIcon } from '@heroicons/react/24/outline';
import Tooltip from '../../../Tooltip/Tooltip';
import { Button } from '../../../Buttons';
import {
  faCloudArrowUp,
  faFile,
  faFileImage,
  faFileLines,
  faFilePdf,
  faFilePowerpoint,
  faFileSpreadsheet,
  faInfoCircle,
} from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { map } from 'lodash';
import { FileUploadDrawer } from '../FileUploadDrawer';

const Files = ({
  globalCollectionId,
  entityCollectionId,
  limit = 10, // in mb
  previousSelectedFiles = [],
  openSheet = false,
  multiple = true,
  acceptedFileType = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.gif',
  acceptedTypeLabel = 'PDF, DOCX, XLSX, PPT, PNG, JPG, GIF up to',
  canDelete = true,
  canDownload = true,
  globalCollectionOnly = false,
  consentLabel = 'Upload the new file to the document library',
  duplicateFileErrorLabel = 'File is already uploaded in the previous step.',
  profileId = '',
  userEmail = '',
  useClientSideQuery = true,
  showAllErrors = false,
  searchPlaceholder = 'documents by name',
  externalDownload = false,
  acceptedHintText = 'We recommend switching to PDF format if you encounter issues viewing the uploaded file in other formats.',
  isDisabled = false,
  uploadFromGlobal,
  setOpenSheet,
  handleOnUpload,
  deletebyFileIdAction,
  getGlobalFilesAction,
  downloadFile,
  reloadFiles,
  onLocalFileDelete,
}: {
  globalCollectionId: string | null;
  entityCollectionId: string;
  openSheet: boolean;
  limit?: number;
  previousSelectedFiles?: any[];
  multiple?: boolean;
  acceptedFileType?: string;
  acceptedTypeLabel?: string;
  canDelete?: boolean;
  canDownload?: boolean;
  globalCollectionOnly?: boolean;
  helpText?: string;
  consentLabel?: string;
  duplicateFileErrorLabel?: string;
  profileId?: string;
  userEmail?: string;
  useClientSideQuery?: boolean;
  showAllErrors?: boolean;
  searchPlaceholder?: string;
  externalDownload?: boolean;
  acceptedHintText?: string;
  isDisabled?: boolean;
  uploadFromGlobal: (formData: any) => Promise<any>;
  setOpenSheet: (open: boolean) => void;
  handleOnUpload: (data: any) => Promise<any>;
  deletebyFileIdAction: (data: any) => Promise<any>;
  getGlobalFilesAction: (data: any, queryParams: any) => Promise<any>;
  downloadFile: (data: any) => Promise<any>;
  reloadFiles?: (data: any) => void;
  onLocalFileDelete: (file: any) => void;
}) => {
  const getFileIcon = (type: string) => {
    let icon = faFile;
    if (type?.includes('pdf')) {
      icon = faFilePdf;
    } else if (type?.includes('sheet') || type?.includes('xls')) {
      icon = faFileSpreadsheet;
    } else if (type?.includes('doc') || type?.includes('word')) {
      icon = faFileLines;
    } else if (type?.includes('presentation')) {
      icon = faFilePowerpoint;
    } else if (type?.includes('image')) {
      icon = faFileImage;
    }
    return <FontAwesomeIcon icon={icon} className="h-4 w-4" role="img" />;
  };

  return (
    <div className="bg-card rounded-xl border-[1px]">
      <div className="p-4 font-semibold">Upload a document</div>
      {previousSelectedFiles?.length > 0 ? (
        <div className="mb-2 flex flex-col px-4">
          <ul>
            {map(previousSelectedFiles, (file, index) => {
              const type = file?.contentType || file?.type || '';
              return (
                <li key={index} className="flex w-full items-center justify-between gap-1">
                  <div className="max-w-[calc(100%-60px)] truncate text-sm text-gray-800">
                    <span className="mr-2">{getFileIcon(type)}</span>
                    {file?.name}
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      id={`files_delete_${index}_btn`}
                      aria-label={`Delete ${file?.name}`}
                      testid={`files_delete_btn`}
                      variant="basic"
                      disabled={!canDelete}
                      onClick={() => onLocalFileDelete(file)}
                      className="focus-visible:outline-primary p-1 text-red-400 hover:text-red-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                      <TrashIcon className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="pt-4 text-center text-gray-400">
          Recently uploaded files will appear here
        </div>
      )}
      <div className="flex items-center justify-between gap-4 p-4">
        <button
          className="flex w-full items-center gap-4 rounded-lg border p-3"
          disabled={isDisabled}
          onClick={() => setOpenSheet(true)}
        >
          <div className="rounded-lg bg-[#F1E9FE] p-4">
            <FontAwesomeIcon icon={faCloudArrowUp} className="h-4 w-4" role="img" />
          </div>
          <div className="flex flex-col items-start">
            <div className="font-semibold">Browse Files</div>
            <div>Click here to upload</div>
          </div>
        </button>
        <div>
          <Tooltip
            triggerElement={() => {
              return (
                <div className="flex flex-col items-center text-sm">
                  <FontAwesomeIcon icon={faInfoCircle} className="h-4 w-4" role="img" />
                  <div>Supported</div>
                  <div>formats</div>
                </div>
              );
            }}
            tooltip={() => {
              return (
                <div className="w-full p-2 text-sm whitespace-break-spaces text-[#5D5D5D]">
                  <div>Supported formats:</div>
                  <div>{acceptedFileType}</div>
                  <div className="pt-4">{acceptedHintText}</div>
                </div>
              );
            }}
          />
        </div>
      </div>
      <div className="px-4 pb-2 text-sm">
        You can only upload files with file size under {limit} MB.
      </div>
      {openSheet && (
        <FileUploadDrawer
          globalCollectionId={globalCollectionId}
          entityCollectionId={entityCollectionId}
          limit={limit}
          previousSelectedFiles={previousSelectedFiles}
          openSheet={openSheet}
          multiple={multiple}
          acceptedFileType={acceptedFileType}
          acceptedTypeLabel={acceptedTypeLabel}
          canDelete={canDelete}
          canDownload={canDownload}
          globalCollectionOnly={globalCollectionOnly}
          consentLabel={consentLabel}
          duplicateFileErrorLabel={duplicateFileErrorLabel}
          profileId={profileId}
          userEmail={userEmail}
          useClientSideQuery={useClientSideQuery}
          showAllErrors={showAllErrors}
          searchPlaceholder={searchPlaceholder}
          externalDownload={externalDownload}
          uploadFromGlobal={uploadFromGlobal}
          setOpenSheet={setOpenSheet}
          handleOnUpload={handleOnUpload}
          deletebyFileIdAction={deletebyFileIdAction}
          getGlobalFilesAction={getGlobalFilesAction}
          downloadFile={downloadFile}
          reloadFiles={reloadFiles}
        />
      )}
    </div>
  );
};

export default Files;
