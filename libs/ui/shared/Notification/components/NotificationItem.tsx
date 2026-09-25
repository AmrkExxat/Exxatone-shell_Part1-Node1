import { faUserTag } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NotificationItemType } from '../types';

interface NotificationItemProps {
  message: NotificationItemType;
  onMessageClick?: (message: NotificationItemType) => void;
  onMessageMarkAsReadClick?: (message: NotificationItemType) => void;
  icon?: React.ReactNode;
}

const getNotificationDate = (date: Date | string | null | undefined): string => {
  if (!date) return '';

  const inputDate = typeof date === 'string' ? new Date(date) : date;

  if (!(inputDate instanceof Date) || isNaN(inputDate.getTime())) {
    return '';
  }

  return inputDate.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const NotificationItem: React.FC<NotificationItemProps> = ({
  message,
  onMessageClick,
  onMessageMarkAsReadClick,
  icon,
}) => {
  return (
    <div
      className={`cursor-pointer border-b p-4 focus-visible:ring focus-visible:ring-violet-300 focus-visible:outline-none ${message.id === 0 ? 'dark:bg-card bg-[#FBF8FD]' : 'bg-card'}`}
      key={message.id}
      onClick={() => onMessageClick?.(message)}
    >
      <div className="flex items-start justify-between">
        <div className="flex pb-3">
          {icon}
          <span className="text-[10px]">{message.type}</span>
        </div>
        <div className="flex text-[10px]">
          <div className="text-secondary pr-2">{message.sendBy}</div>
          {message.date && (
            <div className="text-secondary pr-2">
              {message.timezone
                ? `${getNotificationDate(message.date)} (${message.timezone})`
                : getNotificationDate(message.date)}
            </div>
          )}
          <div className="flex items-center">
            <span className="mr-1 h-1 max-h-1 w-1 max-w-1 rounded-full bg-[#d1d1d1]"></span>
            <a
              aria-label={message.isRead ? 'Mark as Unread' : 'Mark as Read'}
              className="link-text rounded focus-visible:ring-offset-2"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onMessageMarkAsReadClick?.(message);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.stopPropagation();
                  onMessageMarkAsReadClick?.(message);
                }
              }}
            >
              {message.isRead ? 'Mark as Unread' : 'Mark as Read'}
            </a>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="relative mr-3 pr-4">
          {message.primaryImage && (
            <div className="relative">
              <div className="absolute top-[-5px] right-[-15px] flex w-8 items-center justify-center rounded-full bg-[#2196F3] py-1.5">
                <FontAwesomeIcon
                  icon={faUserTag}
                  className="h-5 w-5 text-[#fff]"
                  aria-hidden="true"
                />
              </div>
              {message.primaryImage}
            </div>
          )}
        </div>
        <div className="w-full">
          <div className="flex justify-between">
            <div className="line-clamp-2 text-sm font-semibold" role="heading" aria-level={3}>
              <span
                role="link"
                tabIndex={0}
                className="focus-visible:outline-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onMessageClick?.(message);
                  }
                }}
              >
                {message.title}
              </span>
            </div>
            {!message.isRead && <div className="h-2 max-h-1.5 w-2 rounded-full bg-[#2196F3]"></div>}
          </div>
          <div className="secondary-text line-clamp-2 pt-3 text-xs">{message.description}</div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
