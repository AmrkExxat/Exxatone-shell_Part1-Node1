import React, { FC, ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { Button, TextArea } from '../../../components';

interface ChatActionItemsProps {
  placeholder?: string;
  handleOnSend: (data: { message: string }) => void;
  focusToInput?: boolean;
  label?: string;
  hintText?: string;
}

const ChatActionItems: FC<ChatActionItemsProps> = ({
  handleOnSend,
  placeholder = 'Type your message...',
  focusToInput = false,
  label = '',
  hintText = '',
}): ReactElement => {
  const [typedMessage, setTypedMessage] = useState('');
  const [isSendDisabled, setIsSendDisabled] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsSendDisabled(!typedMessage?.trim().length);
  }, [typedMessage]);

  useEffect(() => {
    if (focusToInput) {
      setFocusToInput();
    }
  }, [focusToInput]);

  const setFocusToInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = () => {
    if (!typedMessage?.trim()) return;

    handleOnSend({ message: typedMessage });
    setTypedMessage('');
    setFocusToInput();
  };

  const handleKeyDown = (e: any) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      handleSend();
      e?.preventDefault();
    }
  };

  const handleInputChange = (value: any) => {
    setTypedMessage(value);
  };

  return (
    <div className="bg-card flex flex-row items-end justify-end gap-3 border-t-2 p-4 pb-2">
      <div className="w-full">
        {label?.length > 0 && (
          <div className="mb-2">
            <span className="ml-1 text-sm font-semibold">{label}</span>
          </div>
        )}
        <TextArea
          ref={inputRef}
          id="messageInput"
          className="max-h-[48px]"
          name="messageInput"
          value={typedMessage}
          placeholder={placeholder}
          onChange={(e) => handleInputChange(e?.target?.value)}
          onKeyDown={(e) => handleKeyDown(e)}
        />
      </div>

      <div className="pb-[6px]">
        <Button variant="flat" color="primary" disabled={isSendDisabled} onClick={handleSend}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatActionItems;
