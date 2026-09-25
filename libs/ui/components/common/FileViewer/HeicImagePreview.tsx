import heicDecode from 'heic-decode';
import jpeg from 'jpeg-js';
import React, { useEffect, useState } from 'react';
import { fileNameAccessibilityHelper } from './helper';
import { Spinner } from '../Spinner';

interface HeicImagePreviewProps {
  file: {
    id?: string;
    binaryData?: string;
    fileName?: string;
    [x: string]: any;
  };
  showSnackbar?: any;
}

const HeicImagePreview: React.FC<HeicImagePreviewProps> = ({ file, showSnackbar }) => {
  const [isConverting, setIsConverting] = useState<boolean>(false);

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    const convertHeicToJpeg = async () => {
      try {
        setIsConverting(true);
        const response = await fetch(file?.binaryData);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        const { width, height, data } = await heicDecode({ buffer });
        const rawImageData = { data, width, height };
        const jpegData = jpeg.encode(rawImageData, 90);
        const uint8Array = new Uint8Array(jpegData?.data);
        const blob = new Blob([uint8Array], { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        objectUrl = url;
        setPreview(url);
      } catch (error) {
        console.log('Error converting HEIC to JPEG:', error);
        showSnackbar('error', error?.message || 'Failed to convert HEIC image');
        setPreview(file?.binaryData || null);
      } finally {
        setIsConverting(false);
      }
    };

    const isHeicByContentType = ['image/heif', 'image/heic'].includes(file?.contentType || '');
    const isHeicByExtension = /\.(heic|heif)$/i.test(file?.fileName || '');

    if ((isHeicByContentType || isHeicByExtension) && file?.binaryData) {
      convertHeicToJpeg();
    } else {
      setPreview(file?.binaryData || `data:${file.contentType};base64,${file.base64Content}`);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [file]);

  if (isConverting) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner size="md" />
      </div>
    );
  }

  return (
    <img
      data-testid={`${file?.id}-heic-image-preview`}
      src={preview || file?.binaryData}
      alt={`${fileNameAccessibilityHelper(file?.fileName)} preview`}
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
};

export default HeicImagePreview;
