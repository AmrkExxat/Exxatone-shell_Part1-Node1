import { renderAsync as renderDocx } from 'docx-preview';
import React, { useEffect, useRef } from 'react';

interface DocxPreviewProps {
  file: { id?: string; binaryData?: string; [x: string]: any };
  showSnackbar?: any;
}

const DocxPreview: React.FC<DocxPreviewProps> = ({ file, showSnackbar }) => {
  const docxContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!file?.binaryData || !docxContainerRef.current) return;

    if (docxContainerRef.current) {
      docxContainerRef.current.innerHTML = '';
    }

    fetch(file.binaryData)
      .then((r) => r.arrayBuffer())
      .then((buf) => renderDocx(buf, docxContainerRef.current as HTMLDivElement))
      .catch((err) => {
        console.log('Error rendering DOCX:', err);
        showSnackbar('error', err?.message || err);
      });
  }, [file?.binaryData, file?.id]);

  return (
    <div
      data-testid={`${file?.id}-docx-preview`}
      ref={docxContainerRef}
      style={{ width: '100%' }}
    />
  );
};

export default DocxPreview;
