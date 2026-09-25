import {
  faCamera as faCameraLight,
  faHeadSide,
  faMinus,
  faPlus,
  faTrashAlt,
  faXmark,
} from '@fortawesome/pro-light-svg-icons';
import { faCamera, faCheck } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Cropper, { type Area } from 'react-easy-crop';
import { JSX, useCallback, useEffect, useRef, useState } from 'react';
import { Modal } from '../Modal';
import { Button } from '../Buttons';
import { Spinner } from '../Spinner';

const AVATAR_OUTPUT_MAX_EDGE_PX = 1024;

const JPEG_EXPORT_QUALITY = 0.99;

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', (error) => reject(error));
    img.setAttribute('crossOrigin', 'anonymous');
    img.src = url;
  });

const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<Blob> => {
  const image = await createImage(imageSrc);

  const canvas = document.createElement('canvas');

  const ctx = canvas.getContext('2d');

  if (ctx == null) {
    throw new Error('Could not get canvas context');
  }

  const srcW = pixelCrop.width;

  const srcH = pixelCrop.height;

  const maxEdge = Math.max(srcW, srcH);

  const scale = maxEdge > AVATAR_OUTPUT_MAX_EDGE_PX ? AVATAR_OUTPUT_MAX_EDGE_PX / maxEdge : 1;

  const outW = Math.max(1, Math.round(srcW * scale));

  const outH = Math.max(1, Math.round(srcH * scale));

  canvas.width = outW;

  canvas.height = outH;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outW,
    outH
  );

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob == null) {
          reject(new Error('Canvas is empty'));
          return;
        }
        resolve(blob);
      },
      'image/jpeg',
      JPEG_EXPORT_QUALITY
    );
  });
};

type AvatarUploadProps = {
  loading: boolean;
  avatarUrl?: string | null;
  allowedExtensions?: string[]; // e.g. ['image/jpeg', 'image/png', 'image/jpg']
  maxFileSize?: number | undefined; // in MB
  onAvatarChange?: (payload: { blob: Blob; previewUrl: string }) => void;
  ariaLabel: string;
  onError?: (
    error: string | unknown,
    details?: {
      size: number;
      limit?: number;
      name: string;
      allowedExtensions?: string[];
    }
  ) => void;
  onDeleteAvatar?: () => void;
};

/**
 * AvatarUpload component
 * @param loading - boolean to indicate if the component is loading
 * @param avatarUrl - string to indicate the avatar url
 * @param allowedExtensions - array of allowed extensions (e.g. ['image/jpeg', 'image/png', 'image/jpg'])
 * @param maxFileSize - number to indicate the maximum file size in MB
 * @param onAvatarChange - function to call when the avatar is changed
 * @param onError - function to call when an error occurs
 * @param onDeleteAvatar - function to call when the avatar is deleted
 * @returns AvatarUpload component
 */
const AvatarUpload = ({
  loading,
  avatarUrl: avatarUrlProp = null,
  allowedExtensions,
  maxFileSize,
  onAvatarChange,
  onError,
  onDeleteAvatar,
  ariaLabel = 'Click to edit or upload profile picture',
}: AvatarUploadProps): JSX.Element => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(avatarUrlProp ?? null);

  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const [zoom, setZoom] = useState<number>(1);

  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setAvatarUrl(avatarUrlProp ?? null);
  }, [avatarUrlProp]);

  useEffect(() => {
    if (isModalOpen && avatarUrl != null && imageSrc == null) {
      setImageSrc(avatarUrl);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
      setCroppedAreaPixels(null);
    }
  }, [isModalOpen, avatarUrl, imageSrc]);

  useEffect(() => {
    if (isModalOpen && imageSrc != null) {
      const timer = setTimeout(() => {
        const cropperEl = document.querySelector('[data-testid="cropper"]');
        if (cropperEl) {
          cropperEl.setAttribute(
            'aria-label',
            'Profile Photo. Use arrow key to reposition the image.'
          );
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isModalOpen, imageSrc]);

  const onCropComplete = useCallback((_croppedArea: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleUploadClick = (): void => {
    fileInputRef.current?.click();
  };

  const resetFileInput = (): void => {
    if (fileInputRef.current != null) {
      fileInputRef.current.value = '';
    }
  };

  const handleZoomChange = (value: number): void => {
    const clamped = Math.min(3, Math.max(1, value));
    setZoom(clamped);
  };

  const handleZoomOut = (): void => {
    handleZoomChange(zoom - 0.2);
  };

  const handleZoomIn = (): void => {
    handleZoomChange(zoom + 0.2);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { files } = event.target;

    const file = files?.[0];

    if (file == null) {
      return;
    }

    if (maxFileSize && file.size > maxFileSize * 1024 ** 2) {
      onError?.(
        `MAX_FILE_SIZE_EXCEEDED: File size exceeds the ${maxFileSize} MB limit: ${file.name}`,
        {
          limit: maxFileSize * 1024 ** 2,
          ...file,
        }
      );
      resetFileInput();
      return;
    }

    if (allowedExtensions && !allowedExtensions.includes(file.type)) {
      onError?.(`INVALID_FILE_EXTENSION: File extension is not allowed: ${file.name}`, {
        ...file,
        allowedExtensions: allowedExtensions,
      });
      resetFileInput();
      return;
    }

    const reader = new FileReader();

    reader.addEventListener('load', () => {
      setImageSrc(reader.result as string);

      setZoom(1);

      setCrop({ x: 0, y: 0 });

      resetFileInput();
    });

    reader.readAsDataURL(file);
  };

  const handleDelete = (): void => {
    setAvatarUrl(null);

    setImageSrc(null);

    setCroppedAreaPixels(null);

    resetFileInput();

    if (onDeleteAvatar != null) {
      onDeleteAvatar();
    }
  };

  const handleSave = async (): Promise<void> => {
    if (imageSrc == null || croppedAreaPixels == null) return;

    try {
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels);

      const previewUrl = URL.createObjectURL(blob);

      setAvatarUrl(previewUrl);

      setImageSrc(null);

      setCroppedAreaPixels(null);

      if (onAvatarChange != null) {
        onAvatarChange({ blob, previewUrl });
      }

      setIsModalOpen(false);
    } catch (e: any) {
      onError?.(e);
    }
  };

  const shiftFocusById = (id: string) => {
    setTimeout(() => {
      document?.getElementById(id)?.focus();
    }, 250);
  };

  return (
    <>
      <button
        className="focus-visible:border-primary relative flex h-24 w-24 cursor-pointer items-center justify-center rounded-full focus-visible:border-4"
        onClick={() => {
          setIsModalOpen(true);

          shiftFocusById('profile_picture_close_header');
        }}
        aria-label={ariaLabel}
        id="profile_picture_edit_btn"
      >
        <>
          {!loading ? (
            <>
              {avatarUrl != null ? (
                <img
                  src={avatarUrl}
                  alt="Profile avatar"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-[#92D7F8]">
                  <FontAwesomeIcon icon={faHeadSide} className="h-11 w-11" />
                </div>
              )}

              <div className="bg-card absolute right-[0.5] bottom-[0.5] flex h-6 w-6 items-center justify-center rounded-lg shadow">
                <FontAwesomeIcon icon={faCamera} className="h-3 w-3" />
              </div>
            </>
          ) : (
            <>
              <div className="flex h-full w-full items-center justify-center rounded-full bg-[#92D7F8]">
                <Spinner size="xl" />
              </div>
              <div className="bg-card absolute right-[0.5] bottom-[0.5] flex h-6 w-6 items-center justify-center rounded-lg shadow">
                <FontAwesomeIcon icon={faCamera} className="h-3 w-3" />
              </div>
            </>
          )}
        </>
      </button>
      <Modal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        className={
          'bg-card relative flex w-[584px] transform flex-col gap-4 overflow-hidden rounded-xl p-4 text-left shadow-xl transition-all sm:max-w-[584px] md:max-w-[584px] lg:max-w-[584px] xl:max-w-[584px]'
        }
      >
        <div className="flex w-full flex-row items-center justify-between">
          <h2 className="text-lg font-bold" tabIndex={-1} id="profile_picture_close_header">
            Profile Photo
          </h2>
          <Button
            className="hover:bg-hover focus-visible:border-primary flex h-7 w-7 items-center justify-center rounded-full focus-visible:border-3"
            onClick={() => {
              setIsModalOpen(false);
              shiftFocusById('profile_picture_edit_btn');
            }}
            variant="basic"
            aria-label="close"
            id="profile_picture_close_btn"
          >
            <FontAwesomeIcon icon={faXmark} className="h-4 w-4 text-[#5D779A]" />
          </Button>
        </div>

        <div className="flex w-full flex-row items-center justify-center">
          <div className="flex w-full flex-col items-center justify-center gap-6">
            <div className="relative flex h-[240px] w-full items-center justify-center rounded-xl border border-[#E5E7EB] bg-[#949299]">
              {imageSrc != null ? (
                <>
                  <div className="relative h-[240px] w-[240px]">
                    <Cropper
                      image={imageSrc}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      cropShape="round"
                      showGrid={false}
                      cropSize={{ width: 240, height: 240 }}
                      onCropChange={setCrop}
                      onZoomChange={handleZoomChange}
                      onCropComplete={onCropComplete}
                    />
                    <div className="pointer-events-none absolute top-1/2 left-1/2 h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white" />
                    <div className="pointer-events-none absolute inset-0 rounded-xl border border-black/5" />
                  </div>
                  <div className="absolute right-4 bottom-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleZoomOut}
                      aria-label="zoom out"
                      className="bg-card flex h-8 w-8 items-center justify-center rounded-md text-[#4B5563] shadow focus-visible:border-3 focus-visible:border-black"
                    >
                      <FontAwesomeIcon icon={faMinus} className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={handleZoomIn}
                      aria-label="zoom in"
                      className="bg-card flex h-8 w-8 items-center justify-center rounded-md text-[#4B5563] shadow focus-visible:border-3 focus-visible:border-black"
                    >
                      <FontAwesomeIcon icon={faPlus} className="h-3 w-3" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex h-[240px] w-[240px] flex-col items-center justify-center gap-3">
                  <div className="flex h-[237px] w-[237px] items-center justify-center rounded-full border-2 border-white bg-[#F6F3FF]">
                    <FontAwesomeIcon icon={faHeadSide} className="h-28 w-28 text-[#9CA3AF]" />
                  </div>
                </div>
              )}
            </div>
            <div className="flex w-full flex-row items-center justify-between">
              <Button
                className="focus-visible:border-primary flex items-center justify-center gap-2 rounded-lg border border-[#111827] text-[#111827] hover:bg-[#111827]/10 focus-visible:border-3 disabled:border-[#111827]/10 disabled:text-[#111827]/40"
                variant="stroked"
                aria-label="Delete"
                disabled={avatarUrl == null && imageSrc == null}
                onClick={handleDelete}
              >
                <FontAwesomeIcon icon={faTrashAlt} className="h-4 w-4" />
                Delete
              </Button>
              <div className="flex flex-row items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={allowedExtensions ? allowedExtensions.join(',') : 'image/*'}
                  className="hidden"
                  onChange={handleFileChange}
                />
                {imageSrc == null ? (
                  <Button
                    className="flex min-w-[104px] items-center justify-center gap-2 rounded-lg bg-[#111827] text-white hover:bg-[#111827]/90 focus-visible:ring focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-3"
                    variant="flat"
                    aria-label="upload"
                    onClick={handleUploadClick}
                  >
                    <FontAwesomeIcon icon={faCameraLight} className="h-3 w-3 text-white" />
                    Upload
                  </Button>
                ) : (
                  <Button
                    className="flex min-w-[104px] items-center justify-center gap-2 rounded-lg bg-[#111827] text-white hover:bg-[#111827]/90 focus-visible:ring focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-3"
                    variant="flat"
                    aria-label="save"
                    disabled={croppedAreaPixels == null}
                    onClick={handleSave}
                  >
                    <>
                      <FontAwesomeIcon icon={faCheck} className="h-3 w-3" />
                      Save
                    </>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AvatarUpload;
