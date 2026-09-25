export type FileUploadFileType =
  | 'application/pdf'
  | 'application/msword'
  | 'image/jpeg'
  | 'image/png'
  | 'application/vnd.ms-powerpoint'
  | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  | 'application/vnd.ms-excel'
  | 'video/mp4'
  | 'image/gif'
  | 'image/bmp'
  | 'application/vnd.ms-excel.sheet.macroenabled.12'
  | 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  | 'application/rtf'
  | 'image/tiff'
  | 'image/jp2'
  | 'application/vnd.ms-excel.sheet.binary.macroenabled.12';

export type FileUploadProps = {
  disabled?: boolean;
  hideLabel?: boolean;
  handleFileChange: React.Dispatch<React.SetStateAction<File[]>>;
  selectedFiles: File[];
};

export type FileUploadFile = {
  name: string;
  type: FileUploadFileType;
  size: number;
};
