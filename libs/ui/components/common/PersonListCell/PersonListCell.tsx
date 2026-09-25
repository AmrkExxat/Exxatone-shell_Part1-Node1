import Link from 'next/link';
import { RefObject } from 'react';
import { Tooltip } from '../Tooltip';
import { announce } from '@react-aria/live-announcer';
import { faCopy } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface PersonCellItem {
  title?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  userEmail?: string;
  profileHref?: string;
}

export interface PersonListCellProps {
  items: PersonCellItem[];
  role?: string;
  notificationRef?: RefObject<any>;
  emptyText?: string;
  from?: string;
  hideEmail?: boolean;
}

const handleCopyEmail = async (email: string, role: string, notificationRef?: RefObject<any>) => {
  await navigator?.clipboard?.writeText(email);

  notificationRef?.current?.handleNotification({
    show: true,
    message: `${role} Email ID copied`,
    description: '',
    colorCode: 'custom',
    customIcon: <FontAwesomeIcon icon={faCopy} className="text-primary" />,
    className: 'bg-blue-200 text-primary',
  });

  announce(`${role} Email ID has been copied.`);
};

const PersonRow = ({
  item,
  role,
  notificationRef,
  from,
  hideEmail = false,
}: {
  item: PersonCellItem;
  role: string;
  notificationRef?: RefObject<any>;
  from?: string;
  hideEmail?: boolean;
}) => {
  const fullName =
    `${item?.title ?? ''} ${item?.firstName ?? ''} ${typeof item?.lastName === 'string' ? item?.lastName : ''}`.trim();

  const email = item?.email ?? item?.userEmail;

  return (
    <div className="flex min-w-0 flex-col text-sm">
      {item?.profileHref ? (
        <Link
          className="link-text min-w-0 truncate font-medium"
          href={item?.profileHref}
          target="_blank"
          rel="noopener noreferrer"
          title={fullName}
        >
          {fullName}
        </Link>
      ) : (
        <span className="min-w-0 truncate font-medium" title={fullName}>
          {fullName}
        </span>
      )}

      {email && !hideEmail && (
        <button
          type="button"
          className="min-w-0 truncate text-left text-xs text-gray-500 hover:underline"
          title={`${email} — click to copy`}
          aria-label={`${email} ${role} email, click to copy to clipboard`}
          onClick={() => handleCopyEmail(email!, role, notificationRef)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleCopyEmail(email!, role, notificationRef);
          }}
        >
          {email}
        </button>
      )}
    </div>
  );
};

const PersonListCell = ({
  items,
  role = 'Person',
  notificationRef,
  emptyText = '-',
  from = '',
  hideEmail = false,
}: PersonListCellProps) => {
  if (!items?.length) {
    return <span className="text-sm text-gray-500">{emptyText}</span>;
  }

  const [first, ...rest] = items;

  return (
    <div className={`flex min-w-0 items-baseline gap-2 ${from === 'card' ? 'w-full' : ''}`}>
      <PersonRow
        item={first}
        role={role}
        notificationRef={notificationRef}
        from={from}
        hideEmail={hideEmail}
      />

      {rest.length > 0 && (
        <Tooltip
          id="person-list-overflow"
          ariaLabel={`${rest.length} more`}
          triggerElement={() => (
            <span className="text-primary inline-flex shrink-0 cursor-default items-center text-sm font-medium">
              +{rest.length}
            </span>
          )}
          tooltip={() => (
            <div className="flex flex-col gap-3 p-2">
              {rest.map((item, i) => (
                <PersonRow
                  key={i}
                  item={item}
                  role={role}
                  notificationRef={notificationRef}
                  from={from}
                  hideEmail={hideEmail}
                />
              ))}
            </div>
          )}
        />
      )}
    </div>
  );
};

export default PersonListCell;
