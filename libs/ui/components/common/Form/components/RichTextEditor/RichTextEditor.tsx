import React, { useEffect, useMemo, useRef, useState } from 'react';
import 'quill/dist/quill.snow.css';
// import Quill from 'quill';
import { twMerge } from 'tailwind-merge';

type QuillToolbarConfig = Array<
  string | Record<string, unknown> | Array<string | Record<string, unknown>>
>;

const quillEditorBaseStyles = [
  'w-full',
  '[&_.ql-editor]:min-h-[120px] [&_.ql-editor]:max-h-[300px] [&_.ql-editor]:overflow-y-auto [&_.ql-editor]:text-sm [&_.ql-editor]:leading-[1.5] [&_.ql-editor]:text-gray-900',
  '[&_.ql-container]:focus-within:border-blue-500 [&_.ql-container]:focus-within:ring-2 [&_.ql-container]:focus-within:ring-blue-500/10',
  '[&_.ql-toolbar]:rounded-t-md [&_.ql-toolbar]:border [&_.ql-toolbar]:border-gray-300 [&_.ql-toolbar]:bg-gray-50',
  '[&_.ql-container]:rounded-b-md [&_.ql-container]:border [&_.ql-container]:border-gray-300 [&_.ql-container]:bg-card',
].join(' ');

const quillEditorDarkStyles = [
  'dark:[&_.ql-toolbar]:bg-gray-700 dark:[&_.ql-toolbar]:border-gray-600 dark:[&_.ql-toolbar]:text-gray-50',
  'dark:[&_.ql-container]:bg-[#1e1e1e] dark:[&_.ql-container]:border-gray-600',
  'dark:[&_.ql-editor]:bg-[#1e1e1e] dark:[&_.ql-editor]:text-gray-50 dark:[&_.ql-editor]:before:text-gray-400',
  'dark:[&_.ql-toolbar_.ql-stroke]:stroke-gray-50 dark:[&_.ql-toolbar_.ql-fill]:fill-gray-50',
  'dark:[&_.ql-toolbar_button]:hover:bg-gray-600 dark:[&_.ql-toolbar_button.ql-active]:bg-gray-500',
  'dark:[&_.ql-toolbar_.ql-picker-label]:text-gray-50 dark:[&_.ql-toolbar_.ql-picker-options]:bg-gray-700 dark:[&_.ql-toolbar_.ql-picker-options]:border-gray-600',
  'dark:[&_.ql-toolbar_.ql-picker-item]:text-gray-50 dark:[&_.ql-toolbar_.ql-picker-item]:hover:bg-gray-600',
].join(' ');

const quillEditorEmailVariantStyles =
  '[&.email-editor_.ql-editor]:!min-h-[400px] [&.email-editor_.ql-editor]:!max-h-[400px]';

/** Unique ID for the Quill container. Required when multiple Quill instances exist on the page. */
interface RichTextEditorProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  maxLength?: number;
  modules?: unknown;
  toolbar?: unknown;
  charCountMessage?: string | ((count: number, max: number) => string);
  variant?: 'default' | 'email';
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  id,
  value,
  onChange,
  placeholder = 'Enter text...',
  disabled = false,
  className = '',
  maxLength,
  modules,
  toolbar,
  charCountMessage,
  variant = 'default',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [charCount, setCharCount] = useState(0);
  const quillRef = useRef<any>(null);

  const defaultToolbar: QuillToolbarConfig = [
    ['bold', 'italic', 'underline', 'strike'],
    [{ header: 1 }, { header: 2 }],
    [{ size: ['small', false, 'large', 'huge'] }],
    [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
    ['link'],
    ['clean'],
  ];

  const computedModules = useMemo(() => {
    if (modules) {
      return modules;
    }
    if (toolbar) {
      return {
        toolbar: toolbar,
      };
    }
    return {
      toolbar: defaultToolbar,
    };
  }, [modules, toolbar]);

  const getCharCountMessage = useMemo(() => {
    if (typeof charCountMessage === 'function') {
      return charCountMessage;
    }
    if (typeof charCountMessage === 'string') {
      return () => charCountMessage;
    }
    return (count: number, max: number) => `${count}/${max} characters`;
  }, [charCountMessage]);

  useEffect(() => {
    if (!containerRef.current) return;

    let quillInstance: any;

    const load = async () => {
      // TO PREVENT BUILD ERRORS DUE TO MISSING DOCUMENT IN NEXT JS BUILD
      const { default: Quill } = await import('quill');

      if (!containerRef.current) return;
      containerRef.current.innerHTML = '';

      const editorElement = document.createElement('div');
      editorElement.id =
        id || `quill-editor-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
      containerRef.current.appendChild(editorElement);

      const effectivePlaceholder = disabled && value ? '' : placeholder;

      quillInstance = new Quill(editorElement, {
        theme: 'snow',
        placeholder: effectivePlaceholder,
        modules: computedModules as Record<string, unknown>,
      });

      if (value) {
        quillInstance.root.innerHTML = value;
      }

      quillInstance.on('text-change', () => {
        const plainText = quillInstance.getText().trim();
        setCharCount(plainText.length);

        if (maxLength && plainText.length > maxLength) {
          const lengthToDelete = quillInstance.getLength() - 1 - maxLength;
          if (lengthToDelete > 0) {
            quillInstance.deleteText(maxLength, lengthToDelete);
          }
          setCharCount(maxLength);
          return;
        }

        onChange(quillInstance.root.innerHTML);
      });

      quillRef.current = quillInstance;
    };

    load();

    return () => {
      quillInstance?.off?.('text-change');
      quillRef.current = null;
    };
  }, [id]);

  useEffect(() => {
    if (quillRef.current) {
      const currentContent = quillRef.current.root.innerHTML;
      if (currentContent !== value) {
        quillRef.current.root.innerHTML = value;
        setCharCount(quillRef.current.getText().trim().length);
      }
    }
  }, [value]);

  useEffect(() => {
    if (quillRef.current) {
      quillRef.current.enable(!disabled);
    }
  }, [disabled]);

  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.root;
      const effectivePlaceholder = disabled && value ? '' : placeholder || '';
      editor.dataset.placeholder = effectivePlaceholder;
    }
  }, [placeholder, disabled, value]);

  const rootClassName = twMerge(
    'quill-editor',
    quillEditorBaseStyles,
    quillEditorDarkStyles,
    variant === 'email' && 'email-editor',
    variant === 'email' && quillEditorEmailVariantStyles,
    className
  );

  return (
    <div className={rootClassName}>
      <div ref={containerRef} style={{ minHeight: '160px' }} />
      {maxLength && (
        <div className="mt-1 text-right text-xs text-gray-500 dark:text-gray-400">
          {getCharCountMessage(charCount, maxLength)}
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
