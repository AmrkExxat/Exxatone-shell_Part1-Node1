import classNames from 'classnames';
import { Button } from '../../common/Buttons';
import { Dialog, Transition } from '@headlessui/react';
import { faXmark } from '@fortawesome/pro-light-svg-icons';
import { DrawerComponentProps, DrawerWidth } from './types';
import React, { Fragment, JSX, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Drawer: React.FC<DrawerComponentProps> = ({
  drawerOpen,
  size = 'small',
  drawer,
  children,
  actionButtons,
  fullDrawer = false,
  closeButtonTitle,
  zIndexClass = 'z-50',
  contentClass = '',
}): JSX.Element => {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setTimeout(() => {
      if (drawerOpen && closeButtonRef.current) {
        closeButtonRef.current.focus();
      }
    });
  }, [drawerOpen]);

  return (
    <Transition.Root show={drawerOpen} as={Fragment}>
      <Dialog
        as="div"
        className={`relative ${zIndexClass}`}
        onClose={(e) => {
          drawer.onClose();
        }}
      >
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden bg-[#0009]">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-200 sm:duration-200"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-200 sm:duration-200"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className={`pointer-events-auto z-900 w-screen ${DrawerWidth[size]}`}>
                  <div
                    className="bg-container flex h-full flex-col shadow-xl"
                    role="dialog"
                    aria-labelledby="drawer-title"
                  >
                    {fullDrawer ? (
                      children
                    ) : (
                      <>
                        <div className="bg-header flex max-h-[48px] min-h-[48px] items-center justify-between border-b border-l py-3 pr-4 pl-3">
                          <div className="flex flex-row items-center justify-center gap-2">
                            <Button
                              variant="basic"
                              id={`close_${typeof drawer.title === 'string' ? drawer.title.replace(/\s+/g, '_') : 'btn'}`}
                              testid="close_drawer_button"
                              type="button"
                              className="icon-btn"
                              onClick={() => {
                                drawer.onClose();
                              }}
                              ref={closeButtonRef}
                            >
                              <span className="sr-only">
                                {closeButtonTitle ?? 'Close ' + drawer.title}
                              </span>
                              <FontAwesomeIcon
                                icon={faXmark}
                                className="text-default h-4 w-4"
                                aria-hidden="true"
                              />
                            </Button>
                            {typeof drawer?.title === 'string' ? (
                              <span
                                id="drawer-title"
                                className="font-semibold"
                                role="heading"
                                aria-level={2}
                              >
                                {drawer?.title}
                              </span>
                            ) : (
                              drawer?.title
                            )}
                          </div>

                          {actionButtons !== null && actionButtons !== undefined && (
                            <div className="flex flex-shrink-0 items-center justify-end">
                              {actionButtons}
                            </div>
                          )}
                        </div>
                        <div
                          id="drawer_content"
                          className={classNames(
                            contentClass
                              ? contentClass
                              : 'relative mt-4 flex-1 overflow-y-auto px-4 sm:px-4'
                          )}
                        >
                          {children}
                        </div>
                      </>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Drawer;
