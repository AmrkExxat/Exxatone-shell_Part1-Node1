// @import '@syncfusion/ej2-base/styles/tailwind.css';
// @import '@syncfusion/ej2-buttons/styles/tailwind.css';
// @import '@syncfusion/ej2-inputs/styles/tailwind.css';
// @import '@syncfusion/ej2-popups/styles/tailwind.css';
// @import '@syncfusion/ej2-lists/styles/tailwind.css';
// @import '@syncfusion/ej2-navigations/styles/tailwind.css';
// @import '@syncfusion/ej2-dropdowns/styles/tailwind.css';
// @import '@syncfusion/ej2-react-pdfviewer/styles/tailwind.css';

// .content-wrapper-pdfviewer {
//   padding: 12px;
// }

// #uploader-pdfviewer .e-upload {
//   border: none;
// }

// #uploader-pdfviewer .e-file-select-wrap {
//   display: none;
// }

// #drop {
//   color: #6b7280;
//   font-size: 14px;
// }
// Import Above CSS lines to global or syncfusion css level
// 'use client';
// import * as React from 'react';
// import {
//   PdfViewerComponent,
//   Toolbar,
//   Magnification,
//   Navigation,
//   LinkAnnotation,
//   BookmarkView,
//   ThumbnailView,
//   Print,
//   TextSelection,
//   TextSearch,
//   Annotation,
//   FormFields,
//   FormDesigner,
//   PageOrganizer,
//   Inject,
// } from '@syncfusion/ej2-react-pdfviewer';
// import '../../pdf.component.css';
// import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
// import { UploaderComponent } from '@syncfusion/ej2-react-inputs';
// import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
// import { Spinner } from '@exxat/ui';

// const SYNCFUSION_API_URL =
//   'https://document.syncfusion.com/web-services/pdf-viewer/api/pdfviewer/LoadFile';

// interface IProps {
//   /** When provided, auto-loads this file in the viewer (hides upload UI) */
//   file?: any;
// }

// function MultiFormatViewer({ file }: IProps) {
//   const isFileMode = Boolean(file);

//   let viewer: PdfViewerComponent;
//   let allowedExtensions: string;
//   let parentElement: any;
//   const dropAreaRef = React.useRef<HTMLDivElement>(null);
//   let filesData: any;
//   const uploadObj = React.useRef<UploaderComponent>(null);
//   const linear = React.useRef<any>(null);
//   const [style, setStyle] = React.useState<React.CSSProperties>({ color: '' });
//   const [autoLoading, setAutoLoading] = React.useState(false);
//   let pdfViewerProgressValue = 0;
//   let uploadProgressValue = 0;

//   React.useEffect(() => {
//     if (!isFileMode) {
//       rendereComplete();
//     }
//   }, [isFileMode]);

//   React.useEffect(() => {
//     if (isFileMode && file?.binaryData) {
//       loadFileIntoViewer(file);
//     }
//   }, [file?.id, file?.binaryData]);

//   const loadFileIntoViewer = async (fileObj: any) => {
//     const fileName = fileObj.fileName ?? fileObj.name ?? '';
//     const type = fileName.split('.').pop()?.toLowerCase() ?? '';
//     const binaryData: string = fileObj.binaryData;

//     setAutoLoading(true);
//     const container = document.getElementById('pdfviewer_container');
//     if (container) container.style.display = 'none';

//     try {
//       let base64Data: string;
//       if (binaryData.startsWith('blob:')) {
//         const res = await fetch(binaryData);
//         const buf = await res.arrayBuffer();
//         const bytes = new Uint8Array(buf);
//         let binary = '';
//         for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
//         base64Data = btoa(binary);
//       } else if (binaryData.startsWith('data:')) {
//         const commaIdx = binaryData.indexOf(',');
//         base64Data = commaIdx >= 0 ? binaryData.substring(commaIdx + 1) : '';
//       } else {
//         base64Data = binaryData;
//       }

//       const post = JSON.stringify({
//         data: `data:application/octet-stream;base64,${base64Data}`,
//         type,
//       });
//       const xhr = new XMLHttpRequest();
//       xhr.open('Post', SYNCFUSION_API_URL, true);
//       xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
//       xhr.onreadystatechange = function () {
//         if (xhr.responseText !== '' && xhr.readyState === 4) {
//           setAutoLoading(false);
//           if (xhr.status === 200) {
//             const pdfViewer = (document.getElementById('pdfviewer') as any)?.ej2_instances?.[0];
//             if (pdfViewer) pdfViewer.documentPath = xhr.responseText;
//             if (container) container.style.display = 'block';
//           }
//         }
//       };
//       xhr.send(post);
//     } catch {
//       setAutoLoading(false);
//     }
//   };

//   const rendereComplete = () => {
//     if (uploadObj.current) {
//       uploadObj.current.dropArea = dropAreaRef.current;
//     }
//     const browseBtn = document.getElementById('browse');
//     if (browseBtn) {
//       browseBtn.onclick = () => {
//         document.getElementsByClassName('e-file-select-wrap')[0].querySelector('button').click();
//         return false;
//       };
//     }
//   };

//   allowedExtensions =
//     '.doc, .docx, .rtf, .docm, .dotm, .dotx, .dot, .xls, .xlsx, .pptx, .pptm, .potx, .potm .jpeg, .png, .bmp, .pdf, .jpg';

//   const onSelect = (args) => {
//     linear.current.value == 0;
//     linear.current.refresh();
//     let extensions = [
//       'doc',
//       'docx',
//       'rtf',
//       'docm',
//       'dotm',
//       'dotx',
//       'dot',
//       'xls',
//       'xlsx',
//       'pptx',
//       'pptm',
//       'potx',
//       'potm',
//       'jpeg',
//       'png',
//       'bmp',
//       'pdf',
//       'jpg',
//     ];
//     let progressBarContainer: any = document.getElementById('progressBar') as HTMLElement;
//     let progressBar: any = document.getElementById('linearProgressBar') as HTMLElement;
//     let progressMessage: any = document.getElementById('uploadedMessage') as HTMLElement;
//     document.getElementById('fileDetails').style.display = 'block';
//     document.getElementById('FailedMessage').style.display = 'none';
//     var fileSizeValidation = document.getElementById('fileSizeValidation');
//     progressBarContainer.style.display = 'block';
//     progressBar.style.display = 'flex';
//     progressMessage.style.display = 'none';
//     fileSizeValidation.style.display = 'none';
//     if (!uploadObj.current.element.querySelector('li')) {
//       filesData = [];
//     }
//     if (isNullOrUndefined(uploadObj.current.element.querySelector('.e-upload-files'))) {
//       parentElement = createElement('ul', {
//         className: 'e-upload-files',
//       });
//       document.getElementsByClassName('e-upload')[0].appendChild(parentElement);
//     }
//     var validFiles = args.filesData;
//     if (validFiles.length === 0) {
//       progressBarContainer.style.display = 'block';
//       progressBar.style.display = 'none';
//       progressMessage.style.display = 'block';
//       args.cancel = true;
//       return;
//     }
//     if (!extensions.includes(validFiles[0].type)) {
//       document.getElementById('FailedMessage').style.display = 'block';
//       document.getElementById('fileDetails').style.display = 'none';
//       progressBar.style.display = 'none';
//       progressMessage.style.display = 'none';
//       document.getElementById('pdfviewer_container').style.display = 'none';
//       args.cancel = true;
//       return;
//     }
//     if (validFiles[0].type != 'pdf' && validFiles[0].size > 4000000) {
//       fileSizeValidation.style.display = 'block';
//       progressBar.style.display = 'none';
//       document.getElementById('fileDetails').style.display = 'none';
//       document.getElementById('pdfviewer_container').style.display = 'none';
//       args.cancel = true;
//       return;
//     }
//     document.getElementById('fileName').innerHTML = args.filesData[0].name;
//     viewer = (document.getElementById('pdfviewer') as any).ej2_instances[0];
//     viewer.downloadFileName = args.filesData[0].name;
//     viewer.exportAnnotationFileName = args.filesData[0].name;
//     let size = document.getElementById('fileSize') as HTMLElement;
//     if (args.filesData[0].size.toString().length <= 7) {
//       size.innerHTML = (args.filesData[0].size / 1024).toFixed(1).toString() + ' KB';
//     } else {
//       let kbsize = args.filesData[0].size / 1024;
//       size.innerHTML = (kbsize / 1024).toFixed(1).toString() + ' MB';
//     }
//     document.getElementById('fileSize');
//     formSelectedData(validFiles[0], uploadObj.current);
//     filesData = filesData.concat(validFiles);
//     const totalProgress = calculateTotalProgress();
//     updateProgressBar(totalProgress);
//     (document.getElementById('progress-status') as any).innerHTML = totalProgress.toString() + '%';
//   };

//   const formSelectedData = (file, proxy) => {
//     var liEle = createElement('li', {
//       className: 'e-upload-file-list',
//       attrs: {
//         'data-file-name': file.name,
//       },
//     });
//     readURL(liEle, file);
//     proxy.fileList.push(liEle);
//   };

//   const readURL = (li, args) => {
//     var file = args.rawFile;
//     var reader = new FileReader();
//     var type = args.type;
//     reader.addEventListener(
//       'load',
//       function () {
//         let post = JSON.stringify({
//           data: reader.result,
//           type: type,
//         });
//         let xhr = new XMLHttpRequest();
//         xhr.open('Post', SYNCFUSION_API_URL, true);
//         xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
//         xhr.upload.addEventListener('progress', (event) => {
//           if (event.lengthComputable) {
//             let progressValue = Math.round((event.loaded / event.total) * 100);
//             uploadProgressValue = progressValue;
//             const totalProgress = calculateTotalProgress();
//             updateProgressBar(totalProgress);
//             (document.getElementById('progress-status') as any).innerHTML =
//               totalProgress.toString() + '%';
//           }
//         });
//         xhr.onreadystatechange = function (event) {
//           if (xhr.responseText != '' && xhr.readyState === 4) {
//             if (xhr.status === 200) {
//               viewer = (document.getElementById('pdfviewer') as any).ej2_instances[0];
//               viewer.documentPath = xhr.responseText;
//               pdfViewerProgressValue = 20;
//               const totalProgress = calculateTotalProgress();
//               updateProgressBar(totalProgress);
//               document.getElementById('progress-status').innerHTML = totalProgress.toString() + '%';
//               document.getElementById('pdfviewer_container').style.display = 'block';
//             } else {
//               console.error('Error:', xhr.statusText);
//             }
//           }
//         }.bind(this);
//         xhr.send(post);
//       },
//       false
//     );
//     if (file) {
//       reader.readAsDataURL(file);
//     }
//   };

//   const documentLoad = (args) => {
//     pdfViewerProgressValue = 100;
//     const totalProgress = calculateTotalProgress();
//     updateProgressBar(totalProgress);
//     (document.getElementById('progress-status') as any).innerHTML = totalProgress.toString() + '%';
//     setTimeout(() => {
//       document.getElementById('linearProgressBar').style.display = 'none';
//       document.getElementById('uploadedMessage').style.display = 'block';
//       uploadProgressValue = 0;
//       pdfViewerProgressValue = 0;
//       linear.current.value = 0;
//     }, 1000);
//   };

//   const calculateTotalProgress = () => {
//     const totalProgress = (uploadProgressValue + pdfViewerProgressValue) / 2;
//     return totalProgress;
//   };

//   const updateProgressBar = (progress) => {
//     if (linear) {
//       linear.current.value = progress;
//     }
//   };

//   const progressLoad = (args) => {
//     let selectedTheme: string = location.pathname.split('/')[1];
//     selectedTheme = selectedTheme ? selectedTheme : 'Material';
//     args.progressBar.theme = (selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1))
//       .replace(/-dark/i, 'Dark')
//       .replace(/contrast/i, 'Contrast');
//     if (
//       args.progressBar.theme === 'HighContrast' ||
//       args.progressBar.theme === 'Bootstrap5Dark' ||
//       args.progressBar.theme === 'BootstrapDark' ||
//       args.progressBar.theme === 'FabricDark' ||
//       args.progressBar.theme === 'TailwindDark' ||
//       args.progressBar.theme === 'MaterialDark' ||
//       args.progressBar.theme === 'FluentDark' ||
//       args.progressBar.theme === 'Material3Dark'
//     ) {
//       setStyle({ color: 'White' });
//     }
//   };

//   const ajaxRequestSuccess = (args) => {
//     if (args.action === 'Load') {
//       pdfViewerProgressValue = 50;
//       const totalProgress = calculateTotalProgress();
//       updateProgressBar(totalProgress);
//       document.getElementById('progress-status').innerHTML = totalProgress.toString() + '%';
//     }
//   };

//   const pdfViewerToolbarSettings = {
//     showTooltip: true,
//     toolbarItems: [
//       'DownloadOption',
//       'UndoRedoTool',
//       'PageNavigationTool',
//       'MagnificationTool',
//       'PanTool',
//       'SelectionTool',
//       'CommentTool',
//       'SubmitForm',
//       'SearchOption',
//       'AnnotationEditTool',
//       'FormDesignerEditTool',
//       'PrintOption',
//     ],
//   };

//   return (
//     <div>
//       <div className="control-section">
//         {!isFileMode && (
//           <div
//             className="content-wrapper-pdfviewer"
//             ref={dropAreaRef}
//             style={{ textAlign: 'center', marginBottom: '15px' }}
//           >
//             <div style={{ height: 'auto', overflow: 'auto', marginBottom: '15px' }}>
//               <ButtonComponent id="browse">Browse...</ButtonComponent>
//               <div>
//                 <p style={{ margin: '10px' }}>OR</p>
//                 <span id="drop">Drop files (Word, Excel, PowerPoint, Image, PDF)</span>
//               </div>
//             </div>
//             <div id="progressBar" style={{ display: 'none' }}>
//               <div id="fileDetails">
//                 <p id="fileName"></p>
//                 <p id="fileSize"></p>
//               </div>
//               <div id="linearProgressBar" style={{ justifyContent: 'center', display: 'none' }}>
//                 <Spinner size="md" />
//                 <span id="progress-status" style={{ padding: '18px 5px' }}></span>
//               </div>
//               <div id="uploadedMessage" style={{ display: 'none', marginTop: '10px' }}>
//                 <p style={{ color: 'rgb(110, 218, 110)' }}>File successfully uploaded...</p>
//               </div>
//               <div id="FailedMessage" style={{ display: 'none', marginTop: '10px' }}>
//                 <p style={{ color: 'red' }}>File not Supported!</p>
//               </div>
//               <div id="fileSizeValidation" style={{ display: 'none', marginTop: '10px' }}>
//                 <p style={{ color: 'rgb(203, 38, 38)' }}>
//                   Maximum file size is (4.0 MB) for this operation...
//                 </p>
//               </div>
//             </div>
//             <div id="uploader-pdfviewer">
//               <UploaderComponent
//                 id="fileUpload"
//                 type="file"
//                 ref={uploadObj}
//                 multiple={false}
//                 selected={onSelect}
//                 allowedExtensions={allowedExtensions}
//               ></UploaderComponent>
//             </div>
//           </div>
//         )}
//         {autoLoading && (
//           <div className="flex items-center justify-center p-4">
//             <Spinner size="md" />
//           </div>
//         )}
//         <div id="pdfviewer_container" style={{ display: 'none' }}>
//           <PdfViewerComponent
//             id="pdfviewer"
//             resourceUrl="https://cdn.syncfusion.com/ej2/23.2.6/dist/ej2-pdfviewer-lib"
//             toolbarSettings={pdfViewerToolbarSettings}
//             documentLoad={isFileMode ? undefined : documentLoad}
//             ajaxRequestSuccess={isFileMode ? undefined : ajaxRequestSuccess}
//             zoomMode="FitToPage"
//             style={{ height: '640px' }}
//           >
//             <Inject
//               services={[
//                 Toolbar,
//                 Magnification,
//                 Navigation,
//                 LinkAnnotation,
//                 BookmarkView,
//                 ThumbnailView,
//                 Print,
//                 TextSelection,
//                 TextSearch,
//                 Annotation,
//                 FormFields,
//                 FormDesigner,
//                 PageOrganizer,
//               ]}
//             />
//           </PdfViewerComponent>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default MultiFormatViewer;
