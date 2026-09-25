import classNames from 'classnames';
import { Fragment, ReactNode, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';

import { Button } from '../Buttons';
import { ModalProps } from './Modal.types';

const Modal = ({
  children,
  open,
  setOpen,
  title,
  description,
  onSecondary,
  secondaryAction,
  OnPrimary,
  primaryAction,
  primaryButtonVariant = 'flat',
  primaryButtonColor = 'primary',
  secondaryButtonVariant = 'stroked',
  secondaryButtonColor = 'warn',
  id,
  testid,
  className = '',
  modalTitle = 'modal-title',
  zIndex = 'z-50',
}: ModalProps): ReactNode => {
  const cancelButtonRef = useRef(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const isDescription = (): boolean => {
    return description !== undefined && description !== null && description?.length > 0;
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className={`relative ${zIndex}`}
        initialFocus={cancelButtonRef}
        ref={dialogRef}
        aria-labelledby={modalTitle}
        onClose={() => setOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="bg-opacity-50 fixed inset-0 bg-[#0009] transition-opacity" />
        </Transition.Child>

        <div className={`fixed inset-0 ${zIndex} w-screen overflow-y-auto`}>
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                id={id}
                data-testid={testid}
                testid={testid}
                className={classNames(
                  isDescription() ? 'p-0' : 'p-4',
                  'bg-card relative transform overflow-hidden rounded-lg shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg dark:ring dark:ring-gray-500 dark:ring-offset-0',
                  className
                )}
                aria-labelledby={modalTitle}
                {...(children !== null && children !== undefined
                  ? {
                      role: 'dialog',
                      'aria-modal': 'true',
                      tabIndex: -1,
                    }
                  : {})}
              >
                {children === null || children === undefined ? (
                  <>
                    <div className="flex w-full flex-col items-start justify-start gap-2">
                      {title !== null && title !== undefined && (
                        <Dialog.Title
                          as="h2"
                          id={modalTitle}
                          className={classNames(
                            isDescription() ? 'border-b p-4' : '',
                            'flex w-full flex-row items-center justify-start text-sm font-semibold'
                          )}
                        >
                          {title}
                        </Dialog.Title>
                      )}
                      {isDescription() && (
                        <Dialog.Description className="flex flex-row items-center justify-start p-2 pb-0 text-sm">
                          <p id="modal-description">{description}</p>
                        </Dialog.Description>
                      )}
                    </div>
                    <div
                      className={classNames(
                        isDescription() ? 'pr-4 pb-4' : '',
                        'mt-2 flex flex-wrap justify-end gap-2'
                      )}
                    >
                      {secondaryAction !== null && secondaryAction !== undefined && (
                        <Button
                          id="cancel-btn"
                          variant={secondaryButtonVariant}
                          color={secondaryButtonColor}
                          onClick={() => onSecondary?.(false)}
                          ref={cancelButtonRef}
                        >
                          {secondaryAction}
                        </Button>
                      )}
                      {primaryAction !== null && primaryAction !== undefined && (
                        <Button
                          id="yes-btn"
                          variant={primaryButtonVariant}
                          color={primaryButtonColor}
                          onClick={() => OnPrimary?.(true)}
                        >
                          {primaryAction}
                        </Button>
                      )}
                    </div>
                  </>
                ) : (
                  <>{children}</>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
