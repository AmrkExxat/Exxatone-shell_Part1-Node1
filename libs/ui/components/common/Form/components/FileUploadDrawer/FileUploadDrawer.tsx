/* eslint-disable @typescript-eslint/no-floating-promises */
import { useEffect, useRef, useState } from 'react';
import { cloneDeep } from 'lodash';
import { FileUploadGridColumn } from './FileUploadGridColumn';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BottomSheet } from '../../../../layout';
import { Button } from '../../../Buttons';
import { Checkbox } from '../Checkbox';
import InfiniteScrollTable from '../../../Table/InfiniteScrollTable';
import { Modal } from '../../../Modal';
import { Skeleton } from '../../../Skeleton';
import { Spinner } from '../../../Spinner';
import { Tabs } from '../../../Tabs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmarkCircle } from '@fortawesome/pro-solid-svg-icons';
import {
  faArrowUpFromBracket,
  faFile,
  faFileImage,
  faFileLines,
  faFilePdf,
  faFilePowerpoint,
  faFileSpreadsheet,
  faLayerGroup,
  faTriangleExclamation,
  faXmark,
} from '@fortawesome/pro-light-svg-icons';

const queryClient = new QueryClient();
const tabs = [
  {
    name: 'Upload',
    title: 'Upload',
    id: 'Upload',
    icon: <FontAwesomeIcon icon={faArrowUpFromBracket} className="h-4 w-4" role="img" />,
  },
  {
    name: 'Document Library',
    title: 'Document Library',
    id: 'library',
    icon: <FontAwesomeIcon icon={faLayerGroup} className="h-4 w-4" role="img" />,
  },
];

const FileUploadDrawer = ({
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
  uploadFromGlobal,
  setOpenSheet,
  handleOnUpload,
  deletebyFileIdAction,
  getGlobalFilesAction,
  downloadFile,
  reloadFiles,
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
  uploadFromGlobal: (formData: any) => Promise<any>;
  setOpenSheet: (open: boolean) => void;
  handleOnUpload: (data: any) => Promise<any>;
  deletebyFileIdAction: (data: any) => Promise<any>;
  getGlobalFilesAction: (data: any, queryParams: any) => Promise<any>;
  downloadFile: (data: any) => Promise<any>;
  reloadFiles?: (data: any) => void;
}) => {
  const [showMoveSheet, setShowMoveSheet] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [errorModal, setErrorModal] = useState<boolean>(false);
  // const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  // const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [consent, setConsent] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [tabIndex, setTabIndex] = useState(1);
  const [globalFiles, setGlobalFiles] = useState([]);
  const [errorMap, setErrorMap] = useState([]);
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setShowMoveSheet(openSheet);
  }, [openSheet]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files && fileInputRef.current) {
      onFileUpload({ target: { files } } as any);
    }
  };

  const onDownload = (file: any) => {
    let data = {
      globalCollectionId,
      profileId,
      userEmail,
      file,
    };
    if (externalDownload) {
      downloadFile(data);
    } else {
      downloadFile(data).then(async (response: any) => {
        const src = 'data:image/png;base64,' + response.data;
        const link = document.createElement('a');
        link.href = `${src}`;
        link.download = file.name;
        link.click();
      });
    }
  };

  const handleDelete = (file: any, from?: string) => {
    let data = {
      globalCollectionId,
      profileId,
      userEmail,
      file,
    };
    deletebyFileIdAction(data).then((res) => {
      // let _files = cloneDeep(selectedFiles);
      // _files = _files?.filter((item: any) => item?.id !== file.id);
      // setSelectedFiles(_files);
      // if (from === 'grid') {
      // 	queryClient?.refetchQueries();
      // } else {
      // 	if (!multiple && _files?.length === 0) {
      // 		selectUnselectAllFromGrid(false);
      // 	}
      // }
      queryClient?.refetchQueries();
    });
  };

  // const deleteUploadedFile = (index: any) => {
  // 	const updatedFiles = cloneDeep(uploadedFiles);
  // 	updatedFiles.splice(index, 1);
  // 	setUploadedFiles(updatedFiles);
  // 	if (!multiple && updatedFiles?.length === 0) {
  // 		selectUnselectAllFromGrid(false);
  // 	}
  // };

  const onGridFileUpload = (file: any) => {
    setUploading(true);
    const data = {
      globalCollectionId,
      entityCollectionId,
      file,
      userEmail,
      profileId,
    };
    uploadFromGlobal(data)
      .then((res) => {
        if (res?.errors?.length) {
          setErrorMap(res?.errors);
          setErrorModal(true);
        } else {
          reloadFiles?.(data);
          closeBottomSheet();
        }
      })
      .catch((e) => {
        if (e?.errors?.length) {
          setErrorMap(e?.errors);
        } else {
          setErrorMap([
            {
              name: file?.name,
              error: 'Error uploading this file',
              size: file?.size,
            },
          ]);
        }
        setErrorModal(true);
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const formatBytes = (bytes: any) => {
    if (typeof bytes !== 'number' || isNaN(bytes) || bytes < 0) {
      return '--';
    }
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let i = 0;
    while (bytes >= 1024 && i < units.length - 1) {
      bytes /= 1024;
      i++;
    }
    return `${bytes.toFixed(2)} ${units[i]}`;
  };

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

  const columns = FileUploadGridColumn(
    onDownload,
    handleDelete,
    onGridFileUpload,
    formatBytes,
    getFileIcon,
    canDelete,
    canDownload
  );

  const fetchData = async (queryParams: any) => {
    try {
      let data = {
        globalCollectionId,
        profileId,
        userEmail,
      };
      let res = await getGlobalFilesAction(data, queryParams);
      let gridData = res?.data;
      if (useClientSideQuery) {
        setGlobalFiles(gridData);
      }
      if (previousSelectedFiles?.length > 0) {
        for (const prev of previousSelectedFiles) {
          if (!prev) continue;

          const idx = gridData.findIndex(
            (i: any) =>
              (prev.id && i.id === prev.id) ||
              (prev.name && prev.size && i.name === prev.name && i.size === prev.size)
          );

          if (idx > -1) {
            gridData[idx].disabled = true;
            // gridData[idx].isSelected = true;
          }
        }
        // for (const prev of selectedFiles) {
        // 	if (prev?.id) {
        // 		const idx = gridData.findIndex((i: any) => i.id === prev.id);
        // 		if (idx > -1) {
        // 			gridData[idx].isSelected = true;
        // 		}
        // 	}
        // }
      }
      gridData = disableUnsupportedFormats(gridData);
      if (useClientSideQuery) {
        gridData = updatedResponse(queryParams, gridData);
      }
      res.data = gridData;
      let totalCount = res?.data?.length ? res.data.length : 0;
      if (res?.totalCount) {
        totalCount = res.totalCount;
      }
      return { data: res?.data?.length ? res.data : [], totalCount: totalCount };
    } catch (error) {
      console.log('error in fetchData', error);
      return { data: [], totalCount: 0 };
    }
  };

  const disableUnsupportedFormats = (res) => {
    const fileTypes = acceptedFileType.split(',').map((type) => type.trim());
    if (res?.length) {
      for (let i = 0; i < res?.length; i++) {
        if (res[i]?.name && !isAllowedFile(res[i].name, fileTypes)) {
          res[i].disabled = true;
        }
        const fileSize = res[i]?.size / 1024 ** 2;
        if (fileSize > limit) {
          res[i].disabled = true;
        }
      }
    }
    return res;
  };

  const isAllowedFile = (filename, fileTypes) => {
    const ext = '.' + filename.split('.').pop().toLowerCase();
    return fileTypes.includes(ext);
  };

  const updatedResponse = (params: any, res: any) => {
    if (params?.debouncedSearch?.trim() && res?.length) {
      res = res.filter((item: any) =>
        item.name.toLowerCase().includes(params?.debouncedSearch?.trim().toLowerCase())
      );
    }
    if (params?.currentSort?.field) {
      res = res.sort((a: any, b: any) => {
        const column = params.currentSort.field;
        if (params.currentSort?.order === 'asc') {
          return a[column] > b[column] ? 1 : -1;
        } else if (params.currentSort?.order === 'desc') {
          return a[column] < b[column] ? 1 : -1;
        }
      });
    }
    return res;
  };

  const checkForGlobalData = (file: any) => {
    if (useClientSideQuery && globalFiles?.length && file?.name && file?.size) {
      const idx = globalFiles.findIndex((i) => i?.name === file.name && i?.size === file.size);
      if (idx > -1) {
        return false; // if file + extension + size is same then don't store in global collection
      }
    }
    return consent;
  };

  const onFileUpload = (data: any) => {
    // need to update this to support multi select
    setErrorMap([]);
    const files = data?.target?.files && data?.target?.files;
    const errors = [];
    const filesData = [];
    if (files?.length) {
      const fileTypes = acceptedFileType.split(',').map((type) => type.trim());
      for (let i = 0; i < files.length; i++) {
        const fileSize = files[i]?.size / 1024 ** 2;
        if (fileSize > limit) {
          errors.push({
            name: files[i]?.name,
            size: files[i]?.size,
            error: `File exceeds the ${limit} MB limit`,
            hint: 'Try compressing or uploading a smaller file',
            type: files[i]?.type,
          });
        }
        if (files?.[i]?.name && !isAllowedFile(files[i].name, fileTypes)) {
          errors.push({
            name: files[i]?.name,
            size: files[i]?.size,
            error: `File format is not supported`,
            hint: 'We recommend uploading a file in one of the supported formats listed below:',
            subHint: acceptedFileType,
            type: files[i]?.type,
          });
        }
        if (previousSelectedFiles?.length) {
          const idx = previousSelectedFiles.findIndex(
            (prev) =>
              prev?.name && prev?.size && files[i].name === prev.name && files[i].size === prev.size
          );
          if (idx > -1) {
            errors.push({
              name: files[i]?.name,
              size: files[i]?.size,
              error: duplicateFileErrorLabel,
            });
          }
        }
        filesData.push({
          global: checkForGlobalData(files[i]),
          file: files[i],
        });
      }
      if (fileInputRef?.current) {
        fileInputRef.current.value = '';
      }
      if (errors?.length) {
        setErrorMap(errors);
        return;
      }
      const data = {
        globalCollectionId,
        entityCollectionId,
        files: filesData,
        consent,
        userEmail,
        profileId,
      };
      setUploading(true);
      handleOnUpload?.(data)
        .then((res) => {
          if (res?.errors?.length) {
            setErrorMap(res?.errors);
          } else {
            reloadFiles?.(data);
            closeBottomSheet();
          }
        })
        .catch((e) => {
          if (e?.errors?.length) {
            setErrorMap(e?.errors);
          } else {
            const errors = [];
            for (let i = 0; i < files.length; i++) {
              errors.push({
                name: files[i]?.name,
                error: 'Error uploading this file',
                size: files[i]?.size,
              });
            }
            setErrorMap(errors);
          }
        })
        .finally(() => {
          setUploading(false);
        });
    }
    // if (file) {
    // 	const fileSize = file.size / 1024 ** 2;
    // 	if (fileSize > limit) {
    // 		setShowError(true);
    // 		setTimeout(() => {
    // 			setShowError(false);
    // 		}, 4000);
    // 	} else {
    // 		let fileObj = file;
    // 		if (requiredAsFormData) {
    // 			const formData = new FormData();
    // 			const fileType = file.type.indexOf('image') > -1 ? '1' : '0';
    // 			formData.append('File', file, file.name);
    // 			formData.append('FileType', fileType);
    // 			formData.append('IsPersist', 'true');
    // 			formData.append('Description', '');
    // 			formData.append('Annotations', '');
    // 			fileObj = formData;
    // 		}
    // 		const fileData = {
    // 			name: file.name,
    // 			file: fileObj,
    // 		};
    // 		if (multiple) {
    // 			setUploadedFiles([...uploadedFiles, fileData]);
    // 		} else {
    // 			setUploadedFiles([fileData]);
    // 			selectUnselectAllFromGrid(true);
    // 		}
    // 	}
    // }
  };

  // const uploadFromGrid = (file) => {
  // 	const formData = new FormData();
  // 	const fileType = file.type.indexOf('image') > -1 ? '1' : '0';
  // 	let colId = entityCollectionId;
  // 	// if (!consent || colId === null) {
  // 	// 	colId = entityCollectionId ?? null;
  // 	// }
  // 	formData.append('File', file, file.name);
  // 	formData.append('CollectionId', colId);
  // 	formData.append('FileType', fileType);
  // 	formData.append('IsPersist', 'true');
  // 	formData.append('Description', '');
  // 	formData.append('Annotations', '');
  // 	setLoading(true);
  // 	uploadFileAction(formData)
  // 		.then((fileUploadResponse) => {
  // 			if (fileUploadResponse) {
  // 				fileUploadResponse['uploadedNow'] = true;
  // 				if (!consent && !entityCollectionId) {
  // 					setEntityCollectionId(fileUploadResponse.collectionId);
  // 				}
  // 				if (multiple) {
  // 					setSelectedFiles([...selectedFiles, fileUploadResponse]);
  // 				} else {
  // 					setSelectedFiles([fileUploadResponse]);
  // 					selectUnselectAllFromGrid(true);
  // 				}
  // 			}
  // 		})
  // 		.finally(() => {
  // 			setLoading(false);
  // 		});
  // };

  // const handleSelectionChange = (rowItem: any) => {
  // 	const queryData: any = queryClient?.getQueryData(['fileUpload_window']);
  // 	const preSelectedIds = previousSelectedFiles?.map((i) => i.id);
  // 	if (queryData && queryData?.pages?.length > 0) {
  // 		const selectedData = selectedFiles ? cloneDeep(selectedFiles) : [];
  // 		queryData?.pages?.forEach((page: any) => {
  // 			if (page?.data?.length > 0) {
  // 				page?.data?.forEach((row: any) => {
  // 					if (row.id === rowItem.id) {
  // 						row.isSelected = !row.isSelected;
  // 					} else {
  // 						if (!multiple && !preSelectedIds?.includes(row.id)) {
  // 							row.isSelected = false;
  // 						}
  // 					}
  // 					const idx = selectedData?.findIndex((i) => i.id === row.id);
  // 					if (idx > -1 && !row.isSelected) {
  // 						selectedData.splice(idx, 1);
  // 					} else if (
  // 						row.isSelected &&
  // 						idx === -1 &&
  // 						!preSelectedIds?.includes(row.id)
  // 					) {
  // 						selectedData.push(rowItem);
  // 					}
  // 				});
  // 			}
  // 		});
  // 		setSelectedFiles(selectedData);

  // 		queryClient.setQueryData(['fileUpload_window'], (data) => ({
  // 			pages: queryData?.pages,
  // 			pageParams: queryData?.pageParams,
  // 		}));
  // 	}
  // };

  // const selectUnselectAllFromGrid = (disable: boolean) => {
  // 	const queryData: any = queryClient?.getQueryData(['fileUpload_window']);
  // 	if (queryData && queryData?.pages?.length > 0) {
  // 		queryData?.pages?.forEach((page: any) => {
  // 			if (page?.data?.length > 0) {
  // 				page?.data?.forEach((row: any) => {
  // 					const preSelectedIds = previousSelectedFiles?.map((i) => i.id);
  // 					if (!preSelectedIds?.includes(row.id)) {
  // 						row.isSelected = false;
  // 						row.disabled = disable;
  // 					}
  // 				});
  // 			}
  // 		});
  // 		queryClient.setQueryData(['fileUpload_window'], (data) => ({
  // 			pages: queryData?.pages,
  // 			pageParams: queryData?.pageParams,
  // 		}));
  // 	}
  // };

  // const handleOnSave = () => {
  // 	let data = {
  // 		globalCollectionId,
  // 		selectedFiles: selectedFiles ?? [],
  // 		uploadedFiles: uploadedFiles?.length ? uploadedFiles.map((i) => i.file) : [],
  // 		consent,
  // 		userEmail,
  // 		profileId,
  // 	};
  // 	handleOnUpload?.(data);
  // 	closeBottomSheet();
  // };

  const closeBottomSheet = () => {
    // setSelectedFiles([]);
    // setUploadedFiles([]);
    setUploading(false);
    // setLoading(false);
    setTabIndex(1);
    setErrorModal(false);
    setGlobalFiles([]);
    setShowMoveSheet(false);
    setOpenSheet(false);
    setConsent(true);
    setErrorMap([]);
  };

  const handleTabChange = (e) => {
    setErrorModal(false);
    setErrorMap([]);
    setTabIndex(e);
  };

  const errorPart = (error: any, index: number, fromModal: boolean = false) => {
    return (
      <div className="truncate rounded border-[1px] p-2 shadow-sm">
        <div className="items-between flex flex-row rounded border-[1px] border-[#9E585C] bg-[#FEF2F2] px-2 py-1 text-[#9E585C]">
          <div className="flex w-full items-center gap-2">
            <FontAwesomeIcon icon={faTriangleExclamation} className="h-4 w-4" role="img" />
            <div>{error?.error ?? 'Error uploading file'}</div>
          </div>
          <Button
            variant="basic"
            id="delete_error_file"
            testid="delete_error_file"
            aria-label="close schedule details"
            className="flex h-7 w-7 flex-col items-center justify-center rounded-full hover:bg-[#ffe1e1]"
            onClick={() => {
              if (fromModal) {
                setErrorModal(false);
              }
              setErrorMap((prev) => {
                const errorList = cloneDeep(prev);
                errorList.splice(index, 1);
                return errorList;
              });
            }}
          >
            <FontAwesomeIcon icon={faXmark} className="h-4 w-4 text-[#74272c]" role="img" />
          </Button>
        </div>
        <div className="mt-1 flex items-center gap-3">
          <div className="truncate font-semibold">{error?.name}</div>
          {error?.size && (
            <>
              <div>|</div>
              <div>{formatBytes(error?.size)}</div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <BottomSheet
      isOpen={showMoveSheet}
      onClose={() => {
        // closeBottomSheet();
      }}
      zIndex={'z-[51]'}
      className="h-[93%] w-[91%]"
    >
      {showMoveSheet && (
        <div className="h-full">
          <div className="px-5 pt-5 pb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-bold lg:text-[22px]">Upload/Select files</h2>
              <div>
                <Button
                  id="close_file_drawer"
                  testid="close_file_drawer"
                  aria-label="Close file"
                  className="hover:bg-hover mr-2 flex h-7 w-7 flex-col items-center justify-center rounded-full"
                  onClick={() => {
                    setDeleteModalOpen(true);
                  }}
                  variant="basic"
                >
                  <FontAwesomeIcon icon={faXmarkCircle} className="h-5 w-5 text-[#5D779A]" />
                </Button>

                {/* <Button
									id="file_save_btn"
									testid="file_save_btn"
									disabled={!selectedFiles?.length && !uploadedFiles?.length}
									className="w-[80px]"
									onClick={() => {
										handleOnSave();
									}}>
									Save
								</Button> */}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {loading ? (
                <div className="mx-2">
                  <Spinner id="file_upload_spinner" size="md" className="" />
                </div>
              ) : (
                <>
                  <Tabs
                    id="fileUploadSheet"
                    tabs={tabs}
                    position="start"
                    type="tertiary"
                    bottomBorderReq={false}
                    activeIndex={tabIndex}
                    onTabChange={handleTabChange}
                    className="border-b"
                    bottomBorderClass="border-[#e5e7eb]"
                  />
                  {tabIndex === 0 ? (
                    <div className="flex flex-col items-center justify-center">
                      {uploading ? (
                        <div className="mt-10 flex flex-col items-center pt-10">
                          <Spinner id="loading_spinner" size="md" />
                          <div className="w-full p-2 whitespace-break-spaces text-[#999999]">
                            Uploading
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-full rounded bg-gray-100 p-2">
                            <Checkbox
                              id="file_upload_consent_checkbox"
                              testid="file_upload_consent_checkbox"
                              label={consentLabel}
                              checked={consent}
                              disabled={globalCollectionOnly}
                              onChange={(e) => setConsent(e?.target?.checked)}
                            />
                          </div>
                          <div
                            className={`mt-10 flex flex-col items-center pt-10 ${dragOver ? 'border-primary bg-primary/10 w-full rounded-md border-[1px] border-dashed p-6 transition-colors' : ''}`}
                            onDragOver={(e) => {
                              e.preventDefault();
                              setDragOver(true);
                            }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                          >
                            {errorMap?.length > 0 ? (
                              <div className="flex flex-col items-center text-center">
                                <div className="font-semibold text-[#B71C1C]">
                                  {errorMap[0]?.error ?? 'Error uploading file'}
                                </div>
                                <div>{errorMap[0]?.hint}</div>
                                <div className="font-semibold">{errorMap[0]?.subHint}</div>
                                <div className="mt-3 flex w-fit items-center gap-3 rounded-lg border-[1px] border-[#dedede] px-4 py-4">
                                  {errorMap[0]?.type && getFileIcon(errorMap[0]?.type)}
                                  <div className="truncate font-semibold">{errorMap[0]?.name}</div>
                                  {errorMap[0]?.size && (
                                    <>
                                      <div>|</div>
                                      <div>{formatBytes(errorMap[0]?.size)}</div>
                                    </>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <svg
                                width="150"
                                height="150"
                                viewBox="0 0 400 400"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  d="M302.169 13.3851C288.145 22.8251 260.076 48.2061 260.017 51.5001C260.007 52.0501 255.312 54.6801 249.584 57.3441C235.935 63.6921 223.206 71.3551 216.538 77.2391L211.167 81.9781L208.084 88.1491L205 94.3191V98.9161C205 101.445 205.386 104.86 205.859 106.507L206.717 109.5L196.109 108.829C183.615 108.038 184.712 107.263 182.559 118.4C179.584 133.784 174.833 145.624 161.253 171.5C154.237 184.867 149.617 197.281 150.18 201.249L150.5 203.5L153.426 203.833L156.353 204.167L135.426 209.5C116.31 214.372 88.4321 223.164 86.8501 224.82C86.4931 225.194 88.0051 235.312 90.2111 247.305C94.9211 272.906 96.1021 269.952 80.8741 270.666L68.5001 271.246L65.3421 272.693C62.2961 274.089 60.8051 276.54 59.5861 282.156C58.2591 288.265 64.3161 334.879 69.9911 362.236C73.1921 377.666 76.5131 385.98 80.5271 388.61L83.2421 390.389L134.372 390.821L185.503 391.253L203.871 390.09L222.238 388.927L225.856 387.416C231.116 385.218 233.519 382.577 239.042 372.927C255.794 343.654 276.383 292.774 277.724 277.335L278.26 271.169L275.792 268.701L273.323 266.232L268.287 265.54L263.252 264.847L264.242 260.946C265.701 255.197 265.197 254.72 253.355 250.661C247.385 248.614 241.871 246.549 241.103 246.07L239.706 245.201L241.351 238.85C253.866 190.525 253.183 195.535 247.457 194.093C244.958 193.464 243.058 192.623 243.234 192.225C243.41 191.826 249.052 180.475 255.771 167L267.988 142.5L269.619 134.081L271.25 125.662L270.658 119.998C270.332 116.883 269.778 113.584 269.426 112.667L268.786 111H262.096H255.406L251.538 107.039L247.671 103.079L252.716 104.692C260.705 107.247 263.496 104.314 259.036 98.0501L257.071 95.2921L259.642 91.8961C261.055 90.0281 262.858 87.0071 263.648 85.1811L265.084 81.8631L268.792 80.2761C270.831 79.4031 273.986 78.7751 275.802 78.8791C277.618 78.9841 281.443 78.3811 284.302 77.5401C287.161 76.6981 296.544 74.6681 305.152 73.0291C323.063 69.6181 330.151 67.1581 334.712 62.7711L337.924 59.6811L338.989 54.5551L340.053 49.4291L339.122 42.9651C337.238 29.8701 331.62 19.4911 323.224 13.5901L319.01 10.6281L313.255 10.2131L307.5 9.79712L302.169 13.3851ZM265.75 48.1151L263 50.1671V52.9021C263 60.2641 268.817 71.8691 274.314 75.4701L276.667 77.0121L280.084 75.8581C281.963 75.2231 283.666 74.5661 283.869 74.3991C284.072 74.2321 282.661 72.2531 280.733 70.0021C276.559 65.1251 271.1 54.3911 270.306 49.4991C269.648 45.4431 269.423 45.3751 265.75 48.1151ZM244.948 62.7411C214.406 78.0381 203.127 92.0521 208.975 107.435L209.95 110H215.092H220.233L219.63 107.75C219.299 106.513 219.021 104.969 219.014 104.32C219.006 103.67 218.023 102.995 216.828 102.82C215.634 102.644 214.493 102.002 214.293 101.393L213.929 100.287L218.988 99.6881C225.927 98.8661 226.722 98.1171 223.034 95.8741C221.311 94.8261 220.174 93.5281 220.507 92.9881L221.114 92.0071L224.307 93.6241C226.063 94.5141 228.263 95.9091 229.195 96.7261L230.891 98.2111L230.303 109.91C229.979 116.345 230.035 123.749 230.427 126.365L231.141 131.121L233.32 130.81L235.5 130.5L238.754 124L242.007 117.5L243.253 109.597L244.5 101.694L249.654 97.8871C257.034 92.4341 261.335 85.8131 263.545 76.5001C264.198 73.7501 265.223 71.6061 265.824 71.7361C266.425 71.8661 265.984 70.3931 264.846 68.4631C263.707 66.5331 262.221 63.0751 261.543 60.7791C259.875 55.1321 260.223 55.0901 244.948 62.7411ZM274.323 68.6011C273.615 70.4451 276.034 72.3661 277.374 71.0261C278.466 69.9341 277.464 67.0001 276 67.0001C275.415 67.0001 274.661 67.7201 274.323 68.6011ZM266.763 75.4581C266.249 78.1501 266.441 78.2771 269.315 77.1441L271.13 76.4281L269.19 74.6721L267.249 72.9161L266.763 75.4581ZM252.058 99.4301L250.871 100.861L252.87 101.93C256.998 104.14 258.757 103.282 256.965 99.9341C255.74 97.6471 253.711 97.4381 252.058 99.4301ZM224.75 101.24C221.58 102.308 221.434 103.004 223.526 107.05C226.04 111.912 228.693 109.277 227.828 102.778L227.5 100.314L224.75 101.24ZM246.397 108.407C245.566 110.572 246.294 111.242 249.031 110.831L251.234 110.5L249.138 108.614L247.042 106.728L246.397 108.407ZM186.609 113.139C182.382 133.712 178.563 143.912 165.536 169.434C159.903 180.471 154.721 191.913 154.02 194.863L152.746 200.225L153.95 200.969C157.282 203.028 220.555 212.947 230.568 212.98L236.636 213L237.763 204.576L238.89 196.152L242.408 187.654C244.343 182.98 248.499 174.508 251.644 168.828C265.776 143.305 270.441 127.71 267.37 116.25L266.767 114H255.992H245.217L244.613 116.407C244.28 117.731 243.744 119.503 243.421 120.346L242.833 121.877L247.167 122.188L251.5 122.5L251.798 128.172C252.22 136.23 249.964 143.918 240.99 165C236.659 175.175 232.36 186.537 231.436 190.25L229.757 197L227.628 197.001C223.753 197.004 167.508 191.797 167.085 191.397C165.845 190.222 171.101 176.543 178.188 162.5C188.37 142.326 191.049 135.271 191.856 126.5L192.5 119.5H199C202.575 119.5 210.338 119.833 216.25 120.24L227 120.981V117.125V113.27L213.25 112.614C205.688 112.254 196.709 111.693 193.297 111.368L187.094 110.777L186.609 113.139ZM194.985 124.75C194.954 130.585 191.703 140.954 186.52 151.75C183.549 157.938 181.257 163 181.427 163C181.596 163 184.726 160.994 188.382 158.543C199.467 151.11 204.846 151.21 210.75 158.962C215.227 164.84 214.758 164.744 220.661 161C226.788 157.115 229.129 157.219 233.969 161.591L237.944 165.183L240.552 159.341C244.661 150.138 248.781 137.027 249.538 130.75L250.23 125H246.234H242.237L239.41 128.75C237.855 130.813 236.227 132.65 235.793 132.833C235.358 133.016 235.288 134.947 235.636 137.125L236.269 141.085L233.96 143.542C231.161 146.522 228.665 146.665 226 144C223.314 141.314 223.481 138.428 226.496 135.413L228.992 132.918L228.085 128.881C227.586 126.661 226.903 124.57 226.567 124.234C225.941 123.608 208.258 122.177 199.75 122.063L195 122L194.985 124.75ZM228.2 137.2C226.525 138.875 226.702 141.948 228.513 142.643C230.632 143.457 233 141.206 233 138.378V136H231.2C230.21 136 228.86 136.54 228.2 137.2ZM196.141 157.048C194.843 157.581 190.22 160.526 185.867 163.593L177.954 169.17L175.854 173.287C173.159 178.569 169.846 188.179 170.495 188.829C171.003 189.336 218.923 193.881 224.578 193.958L227.657 194L228.862 188.778L230.067 183.557L224.989 179.028C222.196 176.538 216.648 170.45 212.658 165.5L205.405 156.5L201.953 156.289C200.054 156.174 197.438 156.515 196.141 157.048ZM221.044 163.965L216.588 166.921L223.127 173.461C231.127 181.46 231.092 181.459 234.115 173.75L236.565 167.5L232.911 164.25C228.412 160.248 226.707 160.208 221.044 163.965ZM241.119 201.144C240.533 204.09 239.928 208.525 239.776 211L239.5 215.5L229 215.331C223.225 215.238 212.658 214.256 205.517 213.148C189.934 210.729 191.323 208.741 196.16 226.537C200.586 242.825 200.931 243.562 204.423 244.23L206.785 244.681L207.438 239.756C208.118 234.631 211.572 224.229 213.165 222.508L214.083 221.517L215.026 223.008C215.545 223.829 215.992 226.075 216.02 228C216.048 229.925 216.714 232.625 217.5 234C219.67 237.797 219.31 241.36 216.487 244.012L213.974 246.374L212.963 245.363L211.953 244.353L213.976 242.521C216.441 240.291 216.533 237.914 214.318 233.7L212.635 230.5L211.396 234.699C210.714 237.009 209.718 242.521 209.183 246.95L208.21 255.001L211.51 265.251C213.326 270.888 216.473 282.7 218.505 291.5C221.814 305.833 222.989 308.933 225.133 308.985C226.146 309.009 226.972 304.89 226.986 299.743C227.021 287.657 231.811 263.901 242.124 224.672C246.003 209.916 248.992 197.658 248.765 197.432C248.539 197.206 246.966 196.743 245.27 196.404L242.186 195.787L241.119 201.144ZM158.5 206.679C133.824 212.193 97.2291 222.667 91.0131 225.993L89.2851 226.918L91.0171 236.209C91.9701 241.319 93.7531 251.012 94.9811 257.75L97.2121 270H103.481C111.365 270 116 269.096 116 267.558V266.366L131.25 262.746C139.637 260.756 152.87 257.861 160.654 256.313L174.809 253.5L175.389 249.921C176.208 244.868 179.881 239.816 184.317 237.642L188.107 235.784L192.141 236.808L196.175 237.832L195.549 235.166C195.205 233.7 193.545 227.532 191.859 221.461L188.794 210.421L175.647 208.191C168.416 206.965 162.05 206.022 161.5 206.097C160.95 206.171 159.6 206.433 158.5 206.679ZM160.5 227.673C133.411 233.342 112.378 238.222 111.578 239.022C109.292 241.308 113.048 240.874 132.157 236.644C143.346 234.167 156.438 231.372 161.25 230.433L170 228.726V227.363C170 225.754 169.608 225.767 160.5 227.673ZM183.615 241.088C182.155 242.237 180.243 244.563 179.367 246.258L177.773 249.339L178.137 260.202L178.5 271.066L147.5 271.561C71.4041 272.775 64.8481 273.437 62.8511 280.103L61.6321 284.172L63.8711 304.641C68.6551 348.379 75.7811 381.284 81.4911 386L83.3071 387.5L121.903 388.209C202.335 389.688 228.436 387.325 230.916 378.341L231.932 374.662L225.433 340.081C215.605 287.792 209.386 263.513 202.337 249.913L198.923 243.325L195.075 241.163C190.241 238.445 187.001 238.424 183.615 241.088ZM133.08 246.348L113.659 250.5L113.246 251.75L112.833 253L115.167 252.919C116.45 252.875 126.015 250.962 136.422 248.669L155.344 244.5L155.755 243.25C156.336 241.486 154.906 241.681 133.08 246.348ZM238.511 250.25C237.465 253.319 235 263.941 235 265.381C235 266.27 236.624 267.652 238.677 268.51L242.354 270.046L241.34 271.06L240.326 272.074L237.496 270.998L234.666 269.922L233.848 271.211C233.399 271.92 233.024 273.251 233.015 274.168C233.007 275.086 232.758 276.468 232.461 277.24L231.923 278.644L234.461 279.8C237.816 281.329 237.707 283.151 234.284 282.788L231.568 282.5L230.837 287.461L230.105 292.422L231.238 293.787L232.371 295.152L231.042 295.974L229.713 296.796L229.219 304.495L228.724 312.195L225.862 311.622C224.288 311.308 223 311.308 223 311.623C223 312.721 230.214 350.502 230.478 350.789C232.713 353.213 263.295 261.816 261.667 257.575C260.702 255.06 239.191 248.255 238.511 250.25ZM156.5 260.058C146.6 262.111 134 264.913 128.5 266.285L118.5 268.781L147.25 268.89L176 269L175.942 266.25C175.911 264.738 175.573 261.886 175.192 259.913L174.5 256.326L156.5 260.058Z"
                                  fill="#040404"
                                />
                              </svg>
                            )}
                            <label
                              className={`bg-primary focus-within:ring-primary relative mt-10 cursor-pointer rounded-md px-3 py-2 text-white focus-within:ring-2 focus-within:ring-offset-2 focus-within:outline-none`}
                            >
                              <span>Browse files</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                onChange={onFileUpload}
                                accept={acceptedFileType}
                                ref={fileInputRef}
                                multiple={multiple}
                              />
                            </label>
                            <div className="w-full pt-2 text-center text-sm whitespace-break-spaces text-[#999999]">
                              or drag files here to upload
                            </div>
                            <div className="w-full text-center text-sm whitespace-break-spaces text-[#999999]">
                              {acceptedTypeLabel} {limit} MB
                            </div>
                          </div>
                          {showAllErrors && (
                            <div className="flex w-full justify-center px-4 py-2">
                              {errorMap?.length > 0 && (
                                <div className="w-[80%] md:w-[50%] lg:w-[40%] xl:w-[33%]">
                                  {errorMap.map((error: any, pIdx) => (
                                    <>{errorPart(error, pIdx)}</>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      {uploading ? (
                        <div className="mt-10 flex flex-col items-center pt-10">
                          <Spinner id="loading_spinner" size="md" />
                          <div className="w-full p-2 whitespace-break-spaces text-[#999999]">
                            Uploading
                          </div>
                        </div>
                      ) : (
                        <div className={`w-full`}>
                          <div className="py-2">
                            <div className="font-semibold">Previously uploaded documents</div>
                            <div className="text-sm">
                              Your centrally stored files, ready to be reused anytime
                            </div>
                          </div>
                          {columns ? (
                            <QueryClientProvider client={queryClient}>
                              <InfiniteScrollTable
                                showToggleView={false}
                                columns={columns}
                                rounded={true}
                                fetchDataOnScroll={fetchData}
                                searchable={true}
                                showSelectAll={false}
                                checkboxSelection={false}
                                queryKey={['fileUpload_window']}
                                placeholderText={searchPlaceholder}
                                maxHeight={`${window?.innerHeight - 314}px`}
                                minHeight={`${window?.innerHeight - 314}px`}
                                // onCheckboxSelect={handleSelectionChange}
                              />
                            </QueryClientProvider>
                          ) : (
                            <Skeleton />
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <Modal open={deleteModalOpen} setOpen={setDeleteModalOpen} zIndex="z-[52]">
            <div className="flex flex-col items-start p-2">
              <div className="font-semibold">Are you sure you want to discard ?</div>
              <div className="flex w-full items-center justify-end gap-2 pt-2">
                <Button
                  id="internship_school_request_move_slots_cancel_btn"
                  testid="internship_school_request_move_slots_cancel_btn"
                  variant="stroked"
                  className="border-primary text-primary hover:text-primary focus-visible:outline-primary flex flex-row items-center justify-center rounded border px-2 py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  onClick={() => setDeleteModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  id="file_upload_discard_btn"
                  testid="file_upload_discard_btn"
                  className="focus-visible:outline-primary flex flex-row items-center justify-center rounded bg-[#BB1E1F] px-4 py-1 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  color="warn-900"
                  onClick={() => {
                    setDeleteModalOpen(false);
                    closeBottomSheet();
                  }}
                >
                  Discard
                </Button>
              </div>
            </div>
          </Modal>
          {tabIndex === 1 && (
            <Modal
              open={errorModal}
              setOpen={(e) => {
                setErrorModal(e);
                if (e === false) {
                  setErrorMap([]);
                }
              }}
              zIndex="z-[52]"
            >
              {errorMap?.length > 0 && errorPart(errorMap[0], 0, true)}
            </Modal>
          )}
        </div>
      )}
    </BottomSheet>
  );
};

export default FileUploadDrawer;
