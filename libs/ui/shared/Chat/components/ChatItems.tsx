import React, { ReactElement, FC } from 'react';
import ChatItem from './ChatItem';
import { ChatItemType } from '../types';

interface ChatItemsProps {
  chatItems: ChatItemType[];
}

const ChatItems: FC<ChatItemsProps> = ({ chatItems }): ReactElement => (
  <>
    {chatItems.map((messageItem, index) => (
      <ChatItem key={index} messageItem={messageItem} />
    ))}
  </>
);

export default ChatItems;
