import React, { ReactElement, FC, useEffect, useRef, useCallback } from 'react';
import { ChatItemType } from './types';
import { ChatItems, ChatActionItems } from './components';

interface ChatProps {
  id?: string;
  containerHeight: string;
  chatItems: ChatItemType[];
  placeholder?: string;
  handleOnSend: (data: { message: string }) => void;
}

const Chat: FC<ChatProps> = ({
  chatItems,
  containerHeight,
  handleOnSend,
  placeholder = 'Type your message...',
}): ReactElement => {
  const containerClasses = `flex flex-col ${containerHeight} overflow-y-auto pt-4 px-4`;

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      containerRef.current?.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }, 0);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  const handleSend = (e: any) => {
    handleOnSend({ message: e?.message });
    scrollToBottom();
  };

  return (
    <div className="flex w-full flex-col">
      <div className={containerClasses} ref={containerRef}>
        <ChatItems chatItems={chatItems} />
      </div>

      <ChatActionItems handleOnSend={handleSend} placeholder={placeholder} focusToInput={true} />
    </div>
  );
};

export default Chat;
