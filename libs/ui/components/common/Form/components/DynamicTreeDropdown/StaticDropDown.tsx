import React, { useState, useEffect, useMemo } from 'react';
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOptions,
  Transition,
} from '@headlessui/react';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import RenderLabel from '../../shared/RenderLabel';
import { Tooltip } from '../../../Tooltip';
import { ShowMore } from '../../../ShowMore';
import RenderPreviousData from '../RenderPreviousData/RenderPreviousData';

const comboboxInputClassName =
  'focus-indicator w-full rounded-md border border-gray-500 px-3 py-2 shadow-sm placeholder:text-[#5D5D5D] disabled:cursor-not-allowed disabled:text-disabled disabled:bg-disabled disabled:bg-opacity-75 disabled:border-[#e5e7eb] disabled:shadow-none sm:text-sm';

type TreeSelectOption = {
  id: string;
  label: string;
  value: string;
  hasChildren?: boolean;
  children?: TreeSelectOption[];
};

type TreeSelectProps = {
  options: TreeSelectOption[];
  label?: string;
  defaultValues?: string;
  placeholder?: string;
  onChange?: (selected: TreeSelectOption | null, parentReset?: boolean) => void;
  id?: string;
  infoMsg?: string;
  isRequired?: boolean;
  disabled?: boolean;
  componentRef?: React.Ref<HTMLDivElement>;
  clearBit?: number;
  clearList?: string[];
  clearBitTriggerReq?: boolean;
  detachedBox?: boolean;
  isDarkTheme?: boolean;
  comboWrapperClass?: string;
  isDisableTextUI?: boolean;
  showMoreProp?: any;
  prevDefaultData?: any;
  autoSelectSingleIndependentValue?: boolean;
  disabledLabel?: string;
};

/** True if this node can expand or has nested rows (strict on hasChildren so string/0 values do not count). */
function optionHasAnyDescendants(node: TreeSelectOption): boolean {
  if (node.hasChildren === true) return true;
  return Array.isArray(node.children) && node.children.length > 0;
}

/** Deepest path under these nodes; 1 means every node in this list is a leaf (nothing nested below). */
function getTreeMaxDepthFromNodes(nodes: TreeSelectOption[] | undefined): number {
  if (!nodes?.length) return 0;
  let max = 0;
  for (const n of nodes) {
    const here = optionHasAnyDescendants(n) ? 1 + getTreeMaxDepthFromNodes(n.children) : 1;
    max = Math.max(max, here);
  }
  return max;
}

function normalizeDefaultKey(
  defaultValues: string | string[] | undefined | null
): string | undefined {
  if (defaultValues == null || defaultValues === '') return undefined;
  if (Array.isArray(defaultValues)) {
    const first = defaultValues.find((x) => x != null && x !== '');
    return first != null ? String(first) : undefined;
  }
  return String(defaultValues);
}

const StaticDropDown = ({
  options,
  label,
  defaultValues,
  onChange,
  placeholder,
  id,
  isRequired = false,
  disabled = false,
  componentRef,
  clearBit = 0,
  clearList,
  clearBitTriggerReq = false,
  infoMsg = '',
  detachedBox = false,
  isDarkTheme = false,
  comboWrapperClass = 'w-50',
  isDisableTextUI = false,
  showMoreProp = { maxLength: 1 },
  prevDefaultData = { label: 'Edited by Site', data: null },
  autoSelectSingleIndependentValue = false,
  disabledLabel = '',
}: TreeSelectProps) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<TreeSelectOption | null>(null);
  const [searchKey, setSearchKey] = useState('');
  const [previousSavedSelected, setPreviousSavedSelected] = useState<any>(null);

  const normalizedDefaultKey = useMemo(
    () => normalizeDefaultKey(defaultValues) ?? '',
    [defaultValues]
  );

  const soleLeafAutoKey = useMemo(() => {
    if (!options?.length || options.length !== 1) return '';
    if (getTreeMaxDepthFromNodes(options) !== 1) return '';
    const only = options[0];
    if (optionHasAnyDescendants(only)) return '';
    return String(only.id ?? only.value ?? '');
  }, [options]);

  useEffect(() => {
    if (!options?.length) return;
    const defaultKey = normalizeDefaultKey(defaultValues);
    let foundDefault: TreeSelectOption | null = null;
    if (defaultKey) {
      foundDefault = findOptionById(options, defaultKey);
      if (foundDefault && !selected) setSelected(foundDefault);
    }
    if (prevDefaultData?.data) {
      const foundPrev = findOptionById(options, prevDefaultData?.data);
      if (foundPrev && !previousSavedSelected) {
        setPreviousSavedSelected({
          data: foundDefault,
          prevData: foundPrev,
        });
      }
    }
  }, [defaultValues, prevDefaultData, options]);

  /** Sole-option auto-select: runs when option identity / default key / clearBit changes, not when user clears (same empty default + same sole key). */
  useEffect(() => {
    if (!autoSelectSingleIndependentValue || disabled) return;
    if (!soleLeafAutoKey || !options?.length) return;

    if (normalizedDefaultKey) {
      const foundDefault = findOptionById(options, normalizedDefaultKey);
      if (foundDefault) return;
    }

    if (options.length !== 1) return;
    if (getTreeMaxDepthFromNodes(options) !== 1) return;

    const only = options[0];
    if (optionHasAnyDescendants(only)) return;

    setSelected((prev) => {
      if (prev) return prev;
      queueMicrotask(() => {
        onChange?.(only);
      });
      return only;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- onChange is often an inline handler; omit options (soleLeafAutoKey covers identity)
  }, [autoSelectSingleIndependentValue, disabled, soleLeafAutoKey, normalizedDefaultKey, clearBit]);

  useEffect(() => {
    if (clearBit > 0) {
      setSelected(null);
      if (clearBitTriggerReq) {
        onChange?.(null);
      }
    }
  }, [clearBit]);

  useEffect(() => {
    if (clearList?.length && clearList.includes(id)) {
      setSelected(null);
      if (clearBitTriggerReq) {
        onChange?.(null, true);
      }
    }
  }, [clearList]);

  const handleExpandToggle = (id: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const handleSelect = (option: TreeSelectOption) => {
    setSelected(option);
    onChange?.(option);
  };

  const findOptionById = (items: TreeSelectOption[], id: string): TreeSelectOption | null => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children?.length) {
        const found = findOptionById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const filterTree = (items: TreeSelectOption[]): TreeSelectOption[] => {
    if (!searchKey.trim()) return items;

    const keyword = searchKey.trim().toLowerCase();

    const filterRecursive = (node: TreeSelectOption): TreeSelectOption | null => {
      const match = node.label.toLowerCase().includes(keyword);
      const filteredChildren =
        node.children
          ?.map(filterRecursive)
          .filter((child): child is TreeSelectOption => child !== null) ?? [];

      if (match || filteredChildren.length > 0) {
        return { ...node, children: filteredChildren };
      }
      return null;
    };

    return items.map(filterRecursive).filter((n): n is TreeSelectOption => n !== null);
  };

  const renderNode = (node: TreeSelectOption, depth = 0) => {
    const isExpanded = expandedIds.has(node.id);
    const hasChildren = node.children?.length > 0;

    return (
      <div
        key={node.id}
        role="treeitem"
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-level={depth + 1}
        className="mt-1 pt-1"
        style={{ marginLeft: depth * 16 }}
      >
        <div className="flex items-center gap-2">
          {hasChildren ? (
            <button
              type="button"
              className="pt-1 text-gray-500"
              onClick={() => handleExpandToggle(node.id)}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
              aria-controls={`tree-node-${node.id}`}
            >
              {isExpanded ? (
                <ChevronDownIcon className="h-4 w-4" />
              ) : (
                <ChevronRightIcon className="h-4 w-4" />
              )}
            </button>
          ) : (
            <div className="w-[16px]" />
          )}

          <label
            htmlFor={`radio-${node.id}`}
            className="flex cursor-pointer items-center gap-2 truncate p-1 text-sm select-none"
          >
            <input
              id={`radio-${node.id}`}
              type="radio"
              name="tree-select"
              aria-label={node.label}
              checked={selected?.id === node.id}
              onChange={() => handleSelect(node)}
              disabled={node.disabled ?? false}
              className={`text-primary mt-[2px] ${node.disabled ? 'bg-gray-100' : 'border-[#888888]'} focus-indicator disabled:text-disabled disabled:cursor-not-allowed disabled:bg-gray-100`}
            />
            {node?.tooltip ? (
              <Tooltip
                triggerWrapperClass="truncate"
                triggerElement={() => {
                  return (
                    <span
                      className={`${node.disabled ? 'cursor-not-allowed text-gray-500' : 'text-gray-800'}`}
                    >
                      {node.label}
                    </span>
                  );
                }}
                tooltip={() => {
                  return <div className="w-full p-2">{node.tooltip}</div>;
                }}
              />
            ) : (
              <span className="flex flex-col">
                <span
                  className={`truncate ${node.disabled ? 'cursor-not-allowed text-gray-500' : 'text-gray-800'}`}
                >
                  {node.label}
                </span>{' '}
                {node?.subLabel && (
                  <Tooltip
                    triggerWrapperClass="truncate"
                    triggerElement={() => {
                      return <span className="text-xs text-gray-400">{node?.subLabel}</span>;
                    }}
                    tooltip={() => {
                      return <div className="w-full p-2">{node?.subLabel}</div>;
                    }}
                  />
                )}
              </span>
            )}
          </label>
        </div>

        {isExpanded && node.children?.length > 0 && (
          <div role="group" id={`tree-node-${node.id}`}>
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const filteredOptions = filterTree(options);

  return (
    <div className={`w-full ${isDarkTheme ? 'dark-variant' : 'blue-variant'}`}>
      <Combobox
        value={selected?.label ?? ''}
        as="div"
        ref={componentRef}
        disabled={disabled}
        className={comboWrapperClass}
        onClose={() => setSearchKey('')}
      >
        {previousSavedSelected?.prevData && disabled ? (
          <div className="flex w-full flex-wrap items-center justify-between gap-1">
            {RenderLabel({
              label: label,
              id: id,
              required: isRequired,
              disabled: disabled,
              infoMsg: infoMsg,
            })}
            <RenderPreviousData
              label={prevDefaultData?.label}
              id={id}
              data={previousSavedSelected?.data}
              previousData={previousSavedSelected?.prevData}
              dataType={'object'}
            />
          </div>
        ) : (
          RenderLabel({
            label: label,
            id: id,
            required: isRequired,
            disabled: disabled,
            infoMsg: infoMsg,
          })
        )}
        {disabled && isDisableTextUI ? (
          <div className="form-disabled-value-text pl-0.5">
            {!selected ? (
              <>Not Specified</>
            ) : (
              <ShowMore
                type="list"
                rowData={selected ? [selected] : []}
                selector={['label']}
                showTooltip={true}
                moreTextRequired={false}
                {...showMoreProp}
              />
            )}
          </div>
        ) : (
          <div className="relative mt-1">
            {disabledLabel && disabled ? (
              <Tooltip
                triggerWrapperClass="flex"
                triggerElement={() => (
                  <ComboboxInput
                    id="tree-combobox"
                    onChange={(e) => setSearchKey(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    aria-label={placeholder || 'Search options'}
                    className={comboboxInputClassName}
                  />
                )}
                tooltip={() => <span className="p-3 text-sm text-gray-700">{disabledLabel}</span>}
              />
            ) : (
              <ComboboxInput
                id="tree-combobox"
                onChange={(e) => setSearchKey(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                aria-label={placeholder || 'Search options'}
                className={comboboxInputClassName}
              />
            )}

            <ComboboxButton
              aria-label="Toggle options"
              className="absolute inset-y-0 right-0 flex items-center pr-2"
            >
              <ChevronDownIcon className="bg-card h-5 w-5 text-gray-400" />
            </ComboboxButton>

            <Transition
              as={React.Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              {detachedBox ? (
                <ComboboxOptions
                  static
                  anchor={'bottom'}
                  transition
                  className={`bg-card absolute z-[51] mt-1 max-h-60 w-[var(--input-width)] overflow-auto rounded-md border p-2 text-sm shadow-lg ${isDarkTheme ? 'dark-variant' : 'blue-variant'}`}
                  role="tree"
                >
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option) => renderNode(option))
                  ) : (
                    <div className="px-2 py-1 text-gray-500">No results found.</div>
                  )}
                </ComboboxOptions>
              ) : (
                <ComboboxOptions
                  static
                  transition
                  className={`bg-card absolute z-[51] mt-1 max-h-60 w-[var(--input-width)] overflow-auto rounded-md border p-2 text-sm shadow-lg ${isDarkTheme ? 'dark-variant' : 'blue-variant'}`}
                  role="tree"
                >
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option) => renderNode(option))
                  ) : (
                    <div className="px-2 py-1 text-gray-500">No results found.</div>
                  )}
                </ComboboxOptions>
              )}
            </Transition>
          </div>
        )}
      </Combobox>
    </div>
  );
};

export default StaticDropDown;
