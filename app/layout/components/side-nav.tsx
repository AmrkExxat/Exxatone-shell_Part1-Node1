'use client';

import React, { useState } from 'react';
import Image from 'next/image';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SIDENAV_ITEMS } from '../constants';
import { SideNavItem } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faMagnifyingGlass } from '@fortawesome/pro-light-svg-icons';

function customSort(a: SideNavItem, b: SideNavItem): number {
  // If a is "Home", it should come before b
  if (a.title === 'Home') {
    return -1;
  }
  // If b is "Home", it should come after a
  if (b.title === 'Home') {
    return 1;
  }
  // Otherwise, sort alphabetically by title
  return a.title.localeCompare(b.title);
}

const SideNav = () => {
  const sortedItems = SIDENAV_ITEMS?.sort(customSort);

  const [filterItems, setFilterItems] = useState<Array<SideNavItem>>(sortedItems);

  function filterItemsByTitle(title: string) {
    let result = sortedItems;

    if (title && title !== null && title?.length > 0) {
      result = sortedItems.filter((item) => item.title.toLowerCase().includes(title.toLowerCase()));
    }

    setFilterItems(result);
  }

  return (
    <div className="bg-card fixed hidden h-screen flex-1 border-r border-zinc-200 md:flex md:w-60">
      <div className="flex w-full flex-col space-y-2">
        <Link
          href="/"
          className="flex h-12 w-full flex-row items-center justify-center space-x-3 border-b border-zinc-200 md:justify-start md:px-6"
        >
          <Image
            src="/exxat-ui.png"
            alt="Exxat UI Logo"
            className="dark:invert"
            width={40}
            height={40}
            priority
          />
          <span className="hidden text-lg font-bold md:flex">Exxat UI</span>
        </Link>

        <div className="relative flex flex-row items-center justify-center">
          <input
            type="search"
            name="serch"
            placeholder="Search"
            onChange={(e) => {
              filterItemsByTitle(e.target.value);
            }}
            className="bg-card h-10 rounded-full border border-gray-300 px-5 pr-10 text-sm placeholder:text-[#5D5D5D] focus:outline-none dark:border-white"
          />
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="absolute top-0 right-6 mt-3 mr-4 h-4 w-4"
            aria-hidden="true"
          />
        </div>

        <div className="flex flex-col space-y-2 overflow-auto md:px-6">
          {filterItems.map((item, idx) => {
            return <MenuItem key={idx} item={item} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default SideNav;

const MenuItem = ({ item }: { item: SideNavItem }) => {
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  return (
    <div className="">
      {item.submenu ? (
        <>
          <button
            onClick={toggleSubMenu}
            className={`hover:bg-hover flex w-full flex-row items-center justify-between rounded-lg p-2 ${
              pathname.includes(item.path) ? 'bg-container' : ''
            }`}
          >
            <div className="flex flex-row items-center space-x-4">
              {item.icon}
              <span className="text-md flex font-semibold">{item.title}</span>
            </div>

            <div className={`${subMenuOpen ? 'rotate-180' : ''} flex`}>
              <FontAwesomeIcon icon={faAngleDown} className="h-4 w-4" aria-hidden="true" />
            </div>
          </button>

          {subMenuOpen && (
            <div className="my-2 ml-12 flex flex-col space-y-1">
              {item.subMenuItems?.map((subItem, idx) => {
                return (
                  <Link
                    key={idx}
                    href={subItem.path}
                    className={`${
                      subItem.path === pathname ? 'bg-hover font-bold' : ''
                    } hover:bg-hover flex flex-row items-center justify-start rounded-lg p-2`}
                  >
                    <span>{subItem.title}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <Link
          href={item.path}
          className={`hover:bg-hover flex flex-row items-center space-x-4 rounded-lg p-2 ${
            item.path === pathname ? 'bg-hover' : ''
          }`}
        >
          {item.icon}
          <span className="text-md flex font-semibold">{item.title}</span>
        </Link>
      )}
    </div>
  );
};
