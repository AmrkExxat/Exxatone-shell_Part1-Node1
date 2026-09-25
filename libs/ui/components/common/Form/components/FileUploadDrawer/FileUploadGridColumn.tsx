import React from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/20/solid';
import { faTrashAlt } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '../../../Buttons';
import moment from 'moment';

export const FileUploadGridColumn = (
  onDownload: (file: any) => void,
  onDelete: (file: any, from: string) => void,
  onUpload: (file: any) => void,
  formatBytes: (bytes: any) => void,
  getFileIcon: (type: string) => void,
  canDelete: boolean = true,
  canDownload: boolean = true
) => {
  const tbCols = [
    {
      id: 'col_fileName',
      fieldName: 'name',
      headerName: 'NAME',
      isBold: true,
      width: 280,
      hiddenOrder: 11,
      canSort: true,
      renderCell: (row: any) => {
        return (
          <Button
            id="upload_file"
            testid="upload_file"
            variant="basic"
            onClick={() => {
              onUpload(row);
            }}
            disabled={row?.disabled}
          >
            <span className="mr-2">{getFileIcon(row?.contentType)}</span>
            <span className={`${row?.disabled ? 'text-gray-500' : 'text-primary'}`}>
              {row?.name ? row.name : ''}
            </span>
          </Button>
        );
      },
    },
    {
      id: 'col_product',
      fieldName: 'product',
      headerName: 'Product',
      isBold: true,
      width: 100,
      hiddenOrder: 11,
      renderCell: (row: any) => {
        return <span>{row?.tags?.[0] ?? '-'}</span>;
      },
    },
    // {
    // 	id: 'col_fileSize',
    // 	fieldName: 'size',
    // 	headerName: 'FILE SIZE',
    // 	width: 100,
    // 	hiddenOrder: 11,
    // 	canSort: true,
    // 	renderCell: (row: any) => {
    // 		return (
    // 			<div className="flex flex-row items-start">
    // 				{row?.size ? formatBytes(row.size) : '--'}
    // 			</div>
    // 		);
    // 	},
    // },
    {
      id: 'col_date',
      fieldName: 'createdTimestamp',
      headerName: 'Date Shared',
      isBold: true,
      width: 100,
      hiddenOrder: 11,
      renderCell: (row: any) => {
        return (
          <span>
            {row?.createdTimestamp
              ? moment(row?.createdTimestamp)
                  .tz(moment.tz.guess())
                  .format('MM/DD/YYYY, hh:mm A (z)')
              : ''}
          </span>
        );
      },
    },
    // {
    // 	id: 'col_fileType',
    // 	fieldName: 'fileType',
    // 	headerName: 'FILE TYPE',
    // 	isBold: true,
    // 	width: 100,
    // 	hiddenOrder: 11,
    // 	renderCell: (row: any) => {
    // 		return <span>{row?.fileType ?? ''}</span>;
    // 	},
    // }
  ];
  if (canDelete || canDownload) {
    tbCols.push({
      id: 'col_actions',
      fieldName: 'actions',
      headerName: 'ACTIONS',
      width: 100,
      hiddenOrder: 11,
      canSort: false,
      renderCell: (row: any) => {
        return (
          <div className="flex flex-row items-center justify-start gap-2">
            {canDownload && (
              <Button
                aria-label={`Download ${row?.name}`}
                id={`files_download_${row.name}_btn`}
                testid={`files_download_btn`}
                variant="basic"
                onClick={() => onDownload(row)}
                className="focus-visible:outline-primary cursor-pointer p-1 px-1 text-blue-400 hover:text-blue-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <ArrowDownTrayIcon className="text-default h-4 w-4" aria-hidden="true" />
              </Button>
            )}
            {canDelete && (
              <Button
                variant="basic"
                aria-label={`files_delete_${row.name || ''}`}
                testid={`delete_file_btn`}
                onClick={() => onDelete(row, 'grid')}
                className={`hover:bg-grey-100 flex h-6 w-6 items-center justify-center rounded-md text-red-400 focus:ring-2 focus:ring-red-300 focus:outline-none`}
                id={`files_delete_${row.name || ''}`}
              >
                <FontAwesomeIcon icon={faTrashAlt} className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}
          </div>
        );
      },
    });
  }
  return tbCols;
};
