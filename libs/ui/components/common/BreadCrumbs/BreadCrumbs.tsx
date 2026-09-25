import React from 'react';
import Link from 'next/link';
import { map } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/pro-light-svg-icons';
import { type BreadCrumbsProps } from './types';

const BreadCrumbs: React.FC<BreadCrumbsProps> = ({
  id,
  testid,
  items,
  metaInformation,
  onItemClick,
  separator = (
    <FontAwesomeIcon
      id="separator_icon"
      icon={faChevronRight}
      className="text-disabled mx-2 h-4 w-4"
    />
  ),
  ariaLabel = 'Breadcrumb',
  router,
  ...props
}) => {
  return (
    <div className="flex flex-col">
      <nav
        className="mb-2 flex"
        id={id}
        data-testid={testid}
        testid={testid}
        aria-label={ariaLabel}
        {...props}
      >
        <ol role="list" className="flex flex-row items-center">
          {map(items, (item, index) => {
            return item ? (
              <li key={item.label} onClick={() => onItemClick?.(item)}>
                <div className="flex flex-row items-center">
                  {item?.href === 'goBack' ? (
                    <a
                      tabIndex={0}
                      onClick={() => {
                        onItemClick?.(item);
                        router?.back();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onItemClick?.(item);
                          router?.back();
                        }
                      }}
                      className="link-text hover:text-primary-900 cursor-pointer text-sm break-all focus-visible:ring-offset-2"
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.label}
                    </a>
                  ) : item?.href ? (
                    <Link
                      href={item.href}
                      className="link-text hover:text-primary-900 cursor-pointer text-sm focus-visible:ring-offset-2"
                      aria-current={item.current ? 'page' : undefined}
                      onClick={() => onItemClick?.(item)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onItemClick?.(item);
                          router?.push(item.href);
                        }
                      }}
                    >
                      {item?.label}
                    </Link>
                  ) : (
                    <div
                      className="text-sm text-[#5D5D5D]"
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item?.label}
                    </div>
                  )}
                  {index < items.length - 1 && separator}
                </div>
              </li>
            ) : null;
          })}
        </ol>
      </nav>
      {metaInformation}
    </div>
  );
};

export default BreadCrumbs;
