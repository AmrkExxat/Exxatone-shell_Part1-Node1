import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { map } from 'lodash';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

const DropDownMenu = ({
  buttonTitle,
  options,
  disabled,
}: {
  buttonTitle: string;
  options: any[];
  disabled: boolean;
}) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="bg-card inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset hover:bg-gray-50">
          {buttonTitle}
          <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
        </Menu.Button>
      </div>
      {!disabled && (
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="bg-card ring-opacity-5 absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md shadow-lg ring-1 ring-black focus:outline-none">
            <div className="py-1">
              {options &&
                map(options, (option) => {
                  return (
                    <Menu.Item key={option.label}>
                      {({ active }) => (
                        <div
                          key={`${option.label}_menu`}
                          className={classNames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                          )}
                          onClick={() => option.onClick()}
                        >
                          {option.label}
                        </div>
                      )}
                    </Menu.Item>
                  );
                })}
            </div>
          </Menu.Items>
        </Transition>
      )}
    </Menu>
  );
};

export default DropDownMenu;
