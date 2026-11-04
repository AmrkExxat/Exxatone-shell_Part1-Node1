import { useEffect, useRef } from 'react';
import { cn } from '../../components/ui/utils';
import { decoratePlain, serializePlain } from './tags';
import { useTagDetails, type DescribeTag } from './TagDetails';
import { useTagTypeahead } from './TagTypeahead';

interface Props {
  value: string;
  onChange: (v: string) => void;
  label: string;
  placeholder?: string;
  describe?: DescribeTag;
  disabled?: boolean;
  className?: string;
}

/** Single-line field (the subject) with the same @ list and tag chips as the message body. */
export function TagField({ value, onChange, label, placeholder, describe, disabled, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const emit = () => ref.current && onChange(serializePlain(ref.current));
  const ta = useTagTypeahead(ref, emit);
  const td = useTagDetails(emit, describe);

  useEffect(() => {
    const el = ref.current;
    if (el && serializePlain(el) !== value) el.innerHTML = decoratePlain(value);
  }, [value]);

  return (
    <>
      <div
        ref={ref}
        role="textbox"
        aria-label={label}
        aria-multiline="false"
        aria-readonly={disabled || undefined}
        aria-describedby="tag-hint"
        {...ta.listProps}
        contentEditable={!disabled}
        suppressContentEditableWarning
        data-placeholder={placeholder}
        spellCheck
        onInput={() => {
          const el = ref.current;
          if (el && !el.textContent) el.innerHTML = '';
          emit();
          ta.onInput();
        }}
        onKeyDown={(e) => {
          if (ta.onKeyDown(e)) return;
          td.onKeyDown(e);
          if (e.key === 'Enter') e.preventDefault();
        }}
        onClick={td.onClick}
        onPaste={(e) => {
          e.preventDefault();
          document.execCommand('insertText', false, e.clipboardData.getData('text/plain').replace(/\s+/g, ' '));
        }}
        className={cn(
          'min-h-7 w-full overflow-hidden whitespace-nowrap py-1 text-sm font-medium leading-5 outline-none',
          'empty:before:pointer-events-none empty:before:font-normal empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)]',
          className,
        )}
      />
      {ta.popup}
      {td.popup}
    </>
  );
}
