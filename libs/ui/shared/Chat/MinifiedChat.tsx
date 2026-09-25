import React, { FC, ReactElement } from 'react';
import { ChatItemType } from './types';
import { ChatItems, ChatActionItems } from './components';
import { Button } from '../../components';

interface MinifiedChatProps {
  chatItems: ChatItemType[];
  slice?: number;
  label?: string;
  hintText?: string;
  placeholder?: string;
  handleOnSend: (data: { message: string }) => void;
  onShowMoreClick: () => void;
}

const MinifiedChat: FC<MinifiedChatProps> = ({
  chatItems,
  slice = 2,
  label,
  hintText,
  handleOnSend,
  onShowMoreClick,
  placeholder = 'Type your message...',
}): ReactElement => {
  return (
    <div className="bg-card flex w-full flex-col rounded-lg pt-4">
      <div className="flex flex-col pr-8 pl-4">
        <ChatItems chatItems={chatItems?.slice(0, slice)} />
      </div>

      {chatItems?.length > slice && (
        <div className="flex flex-row items-center justify-center py-3" id="togglebutton">
          <Button variant="basic" color="primary" onClick={onShowMoreClick}>
            Show more
          </Button>
        </div>
      )}

      <ChatActionItems
        handleOnSend={handleOnSend}
        placeholder={placeholder}
        label={label}
        hintText={hintText}
      />
    </div>
  );
};

export default MinifiedChat;
