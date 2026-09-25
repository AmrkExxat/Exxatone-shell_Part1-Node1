import { map } from 'lodash';
import { Menu, Transition } from '@headlessui/react';
import React, { Fragment, ReactNode, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/pro-light-svg-icons';

export type SelectDropdownItemType = {
  value: string;
  label?: string;
  bgColor?: string;
  renderItem?: () => ReactNode;
};

export type SelectDropdownPropsType = {
  items: Array<SelectDropdownItemType>;
  placeholder: string;
  default?: string | null;
  onChange: (selected: any) => void;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const SelectDropdown = (props: SelectDropdownPropsType) => {
  const { items, placeholder } = props;
  const [selected, setSelected] = useState<string | null | undefined>(
    props?.default?.trim()?.toLowerCase()
  );

  const [selectedItem, setSelectedItem] = useState<SelectDropdownItemType | null>(null);

  const [selectedNode, setSelectedNode] = useState<ReactNode | null>(null);

  useEffect(() => {
    if (selected !== undefined && selected !== null) {
      const selectedItem = items?.find(
        (x) => x.value?.trim()?.toLowerCase() === selected?.trim()?.toLowerCase()
      );

      if (selectedItem !== undefined) {
        setSelectedItem(selectedItem);

        setSelectedNode(selectedItem?.renderItem ?? selectedItem?.label);
      }
    }
  }, [selected, items]);

  const updateSelection = (value: string): void => {
    setSelected(value?.trim()?.toLowerCase());
    props?.onChange(value);
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button
          className={classNames(
            selectedItem !== undefined && selectedItem !== null
              ? `bg-[${selectedItem?.bgColor}] pr-2`
              : 'bg-card border px-3',
            'text-default inline-flex w-full min-w-[78px] items-center justify-center gap-x-1.5 truncate rounded-sm py-1 text-sm font-semibold'
          )}
        >
          {selectedNode ?? placeholder}
          <FontAwesomeIcon
            icon={faAngleDown}
            className="mt-1 ml-1 h-4 w-4 text-black"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="bg-card ring-opacity-5 absolute left-0 z-10 mt-2 origin-top-right rounded-md border shadow-lg ring-1 ring-black focus:outline-none">
          <div className="py-1">
            {items !== undefined &&
              items !== null &&
              items?.length > 0 &&
              map(items, (item: SelectDropdownItemType, index) => {
                return (
                  <Menu.Item key={`dropdown_${item.value}_${index}`}>
                    <div className="hover:bg-hover flex cursor-pointer flex-row">
                      <a
                        onClick={() => updateSelection(item?.value)}
                        className={classNames(
                          selected === item?.value ? 'text-default bg-gray-100' : 'text-secondary',
                          'block w-full px-4 py-2 text-sm'
                        )}
                      >
                        {item?.renderItem !== undefined && item?.renderItem !== null
                          ? item?.renderItem()
                          : item?.label}
                      </a>
                    </div>
                  </Menu.Item>
                );
              })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default SelectDropdown;
