import React, { ReactElement, FC, useState, useRef, useEffect } from 'react';
import { ChatItemType } from '../types';
import { getParticipantInitials, getParticipantTitle } from '../helper';
import classNames from 'classnames';

interface ChatItemProps {
  messageItem: ChatItemType;
}

const ChatItem: FC<ChatItemProps> = ({ messageItem }): ReactElement => {
  const { participant, sentBy, message } = messageItem || {};

  const isCurrentUser = participant?.isCurrentUser;

  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const textHeight = textRef?.current?.scrollHeight;
      if (textHeight > 60) {
        setShowButton(true);
      }
    }
  }, [message]);

  const containerStyles = isCurrentUser ? 'flex justify-end mb-4' : 'flex justify-start mb-4';

  const bubbleStyles = isCurrentUser
    ? 'mr-2 py-3 px-4  bg-[#EBEEF3]  min-w-[350px] rounded-2xl'
    : 'ml-2 py-3 px-4 bg-[#5D6FD1] min-w-[350px] rounded-2xl ';

  const renderAvatar = () => {
    if (participant?.avatar !== undefined) {
      return <div className="h-[40px] w-[40px]">{participant.avatar}</div>;
    } else if ((participant?.src as string)?.length > 0) {
      <div className="bg-card flex h-[40px] w-[40px] items-center justify-center rounded-full text-sm font-semibold">
        <img src={participant?.src} />
      </div>;
    }

    return (
      <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-gray-400 text-sm font-semibold text-white">
        {getParticipantInitials(participant)}
      </div>
    );
  };

  return (
    <div className={containerStyles}>
      {!isCurrentUser && <div className="pr-2">{renderAvatar()}</div>}
      <div className={bubbleStyles}>
        <div className="flex flex-col">
          <span
            className={classNames(
              'pb-2 text-sm font-semibold dark:text-gray-900',
              isCurrentUser ? 'text-black' : 'text-white'
            )}
          >
            {getParticipantTitle(participant)}
          </span>

          <span
            className={classNames(
              'pb-2 text-xs font-normal dark:text-gray-800',
              isCurrentUser ? 'text-[#495F80]' : 'text-[#F5F7FA]'
            )}
          >
            {sentBy}
          </span>
        </div>
        <div
          ref={textRef}
          style={{
            transition: 'max-height 0.3s',
          }}
          className={classNames(
            'overflow-hidden text-sm font-normal dark:text-gray-800',
            isCurrentUser ? 'text-black' : 'text-white',
            isExpanded ? 'max-h-none' : 'max-h-[60px]'
          )}
        >
          {message}
        </div>
        {showButton && (
          <a
            className={classNames(
              'mt-4 cursor-pointer text-sm font-semibold hover:underline dark:text-gray-800',
              isCurrentUser ? 'text-primary' : 'text-white'
            )}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </a>
        )}
      </div>
      {isCurrentUser && renderAvatar()}
    </div>
  );
};

export default ChatItem;
