import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faChevronDown,
  faChevronRight,
  faChevronUp,
  faCircleXmark,
} from '@fortawesome/pro-light-svg-icons';
import { announce } from '@react-aria/live-announcer';
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOptions } from '@headlessui/react';
import { Tooltip } from '../../../Tooltip';
import RenderLabel from '../../shared/RenderLabel';
import { Checkbox } from '../Checkbox';
import { Accordion } from '../../../Accordion';
import { Button } from '../../../Buttons';
import { ShowMoreTree } from '../../../ShowMoreTree';
import { RenderPreviousData } from '../RenderPreviousData';
import { cloneDeep } from 'lodash';

export function buildChildrenByParentMap(
  childList: any[],
  parentField: string
): Map<string, any[]> {
  const m = new Map<string, any[]>();
  childList.forEach((item) => {
    const pid = item[parentField];
    if (pid) {
      if (!m.has(pid)) m.set(pid, []);
      m.get(pid)!.push(item);
    }
  });
  return m;
}

/** Descendant row ids under `nodeId` (does not include `nodeId`). */
export function collectDescendantIdsFromTreeParentMap(
  nodeId: string,
  childrenByParent: Map<string, any[]>
): Set<string> {
  const ids = new Set<string>();
  const stack = [...(childrenByParent.get(nodeId) ?? [])];
  while (stack.length) {
    const node = stack.pop()!;
    ids.add(node.id);
    const kids = childrenByParent.get(node.id) ?? [];
    stack.push(...kids);
  }
  return ids;
}

export function getProgramCount(programs: any[]) {
  return programs.reduce((count, item) => {
    if (!item.isRoot) {
      return count + 1;
    }

    const hasChildren = programs.some((child) => child.parentProgramId === item.programId);

    return count + (hasChildren ? 0 : 1);
  }, 0);
}

export function collectAncestorNodes(
  node: any,
  optionById: Map<string, any>,
  parentField: string
): any[] {
  const out: any[] = [];
  let parentId = node[parentField];
  while (parentId) {
    const parent = optionById.get(parentId);
    if (!parent) break;
    out.push(parent);
    parentId = parent[parentField];
  }
  return out;
}

export function isTreeLinkageEnabled(
  treeMode: boolean | undefined,
  childTreeParentKey: string | undefined
): boolean {
  return Boolean(
    treeMode &&
    childTreeParentKey !== undefined &&
    childTreeParentKey !== null &&
    String(childTreeParentKey).length > 0
  );
}

export default function HierarchySelect({
  defaultValues,
  onChange,
  onCloseDropdown,
  ariaLabel = '',
  optionsContainerClassName = '',
  id = '',
  label = '',
  disabled = false,
  parentList = [],
  childList = [],
  parentKey,
  isRequired = false,
  noChildLabel = 'No Data Found',
  multiple = true,
  placeholder = 'Please select an option',
  clearBit = 0,
  infoMsg = null,
  infoIconClass = 'text-default h-3 w-3',
  className = '',
  section = null,
  makeNoChildParentsAtLast = true,
  treeIcon = true,
  disabledLabel = '',
  initialExpanded = true,
  isDisableTextUI = false,
  showMoreProp = { maxLength: 2 },
  prevDefaultData = { label: 'Edited by Site', data: null },
  treeMode = false,
  childTreeParentKey,
  onlyCountChildOnAccordion = false,
}: {
  defaultValues?: any;
  onChange?: (updatedValue: any, checked?: boolean) => void;
  onCloseDropdown?: () => void;
  ariaLabel?: string;
  optionsContainerClassName?: string;
  id: string;
  label: string;
  disabled?: boolean;
  parentList: any[];
  childList: any[];
  parentKey: string;
  isRequired?: boolean;
  noChildLabel?: string;
  multiple?: boolean;
  placeholder?: string;
  clearBit?: number;
  infoMsg?: any;
  infoIconClass?: string;
  className?: string;
  section?: any;
  makeNoChildParentsAtLast: boolean;
  treeIcon?: boolean;
  disabledLabel?: string;
  initialExpanded?: boolean;
  isDisableTextUI?: boolean;
  showMoreProp?: any;
  prevDefaultData?: any;
  /** When true, renders parents as inline expand/collapse rows instead of accordion panels. Default: false */
  treeMode?: boolean;
  /**
   * Field name on each childList item whose value is the composite `id` of its parent within the
   * same childList. When provided (with treeMode=true) children are nested under their parents
   * as a sub-tree instead of a flat list.
   */
  childTreeParentKey?: string;
  onlyCountChildOnAccordion?: boolean;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<any[]>(defaultValues?.length ? defaultValues : []);
  const [searchValue, setSearchValue] = useState<string>('');
  const [focusedOptionIndex, setFocusedOptionIndex] = useState<number>(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const clearButtonRef = useRef<HTMLButtonElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const componentRef = useRef<HTMLDivElement>(null);
  const comboboxRef = useRef<HTMLDivElement>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [toggleOnCount, setToggleOnCount] = useState<number | null>(null);
  const openedIds = useRef<string[]>([]);
  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set());

  const toggleExpandedParent = (id: string) => {
    setExpandedParents((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Sub-tree expand/collapse state (for child nodes that are themselves parents)
  const [expandedPrograms, setExpandedPrograms] = useState<Set<string>>(new Set());
  const toggleExpandedProgram = (id: string) => {
    setExpandedPrograms((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  function removeListboxRoleAttribute() {
    const timeout = setTimeout(() => {
      const specificListbox = document.querySelector(
        'div.bg-card.z-50[role="listbox"][id^="headlessui-combobox-options"]'
      );
      if (specificListbox) {
        specificListbox.removeAttribute('role');
      }
    }, 200);

    return () => clearTimeout(timeout);
  }

  useEffect(() => {
    if (clearBit) {
      setSelected([]);
    }
  }, [clearBit]);

  // Keep internal selection in sync when parent updates defaultValues
  // (e.g. auto-select logic after discipline changes).
  useEffect(() => {
    if (defaultValues?.length) {
      setSelected(defaultValues);
    } else {
      setSelected([]);
    }
  }, [defaultValues, id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        clearSearch();
        onCloseDropdown?.();
      }
    };
    if (inputRef.current) {
      inputRef.current.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }
    if (dropdownButtonRef.current) {
      dropdownButtonRef.current.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      dropdownButtonRef.current.removeAttribute('aria-haspopup');
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      removeListboxRoleAttribute();
      clearSearch();
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    setSelected((prevSelected: any[]) => {
      const effectiveSelected =
        prevSelected?.length > 0 ? prevSelected : ((defaultValues as any[]) ?? []);
      if (!effectiveSelected?.length) {
        return [];
      }

      const selectedIds = effectiveSelected.map((item: any) => item.id);
      const updatedSelected = childList.filter((item: any) => selectedIds.includes(item.id));
      return updatedSelected;
    });
  }, [childList, defaultValues, id]);

  const reorderByChildren = (arr = [], spclList) => {
    const withChildren = [];
    const withoutChildren = [];
    const dIds = spclList?.map((i) => i?.[parentKey]) ?? [];
    arr.forEach((item) => {
      if (dIds.includes(item.id)) {
        withChildren.push(item);
      } else {
        withoutChildren.push(item);
      }
    });
    return [...withChildren, ...withoutChildren];
  };

  const updateWithSection = (list, spclList) => {
    if (!list?.length || !section) return list;
    const sectionIds = Object.keys(section);
    const withoutSection = list.filter((k) => !k?.sectionId);
    let listData = [];
    for (let i = 0; i < sectionIds?.length; i++) {
      let data = list.filter((k) => k.sectionId === sectionIds[i]);
      if (makeNoChildParentsAtLast) {
        data = reorderByChildren(data, spclList);
      }
      if (data?.length) {
        data = data.map((k) => {
          return { ...k, sectionName: null };
        });
        data[0].sectionName = section[sectionIds[i]];
        listData = [...listData, ...data];
      }
    }
    if (withoutSection?.length) {
      listData = [...listData, ...withoutSection];
    }
    return listData;
  };

  const showMoreTreeData = useMemo(() => {
    if (!disabled || !isDisableTextUI) return [];
    const selectedParentIds = new Set(selected.map((c) => c[parentKey]));
    const parents = parentList
      .filter((p) => selectedParentIds.has(p.id))
      .map((p) => ({ id: p.id, label: p.label, value: p.value ?? p.id, isParent: true }));
    const children = selected.map((c) => ({
      id: c.id,
      label: c.label,
      value: c.value ?? c.id,
      parentId: c[parentKey],
      isChild: true,
    }));
    return [...parents, ...children];
  }, [disabled, isDisableTextUI, selected, parentList, parentKey]);

  const showPrevData = useMemo(() => {
    const data = prevDefaultData?.data ?? null;
    if (!disabled || !data?.length) return null;
    const selectedParentIds = new Set(data.map((c) => c[parentKey]));
    const parents = parentList
      .filter((p) => selectedParentIds.has(p.id))
      .map((p) => ({ id: p.id, label: p.label, value: p.value ?? p.id, isParent: true }));
    const children = data.map((c) => ({
      id: c.id,
      label: c.label,
      value: c.value ?? c.id,
      parentId: c[parentKey],
      isChild: true,
    }));
    return [...parents, ...children];
  }, [disabled, prevDefaultData]);

  const curatedSpclList = useMemo(() => {
    if (!searchValue) return childList ?? [];

    const q = searchValue.toLowerCase();
    return childList.filter((i) => i?.label?.toLowerCase()?.includes(q));
  }, [childList, searchValue]);

  const treeLinkageEnabled = isTreeLinkageEnabled(treeMode, childTreeParentKey);

  const treeParentChildrenMap = useMemo(() => {
    if (!treeLinkageEnabled || !childList?.length || !childTreeParentKey) return null;
    return buildChildrenByParentMap(childList, childTreeParentKey);
  }, [treeLinkageEnabled, childTreeParentKey, childList]);

  const treeOptionById = useMemo(() => {
    if (!treeLinkageEnabled || !childList?.length) return null;
    return new Map(childList.map((i: any) => [i.id, i]));
  }, [treeLinkageEnabled, childList]);

  const curatedDsplList = useMemo(() => {
    if (!searchValue) {
      return updateWithSection(parentList ?? [], curatedSpclList);
    }
    const spclById = new Map(curatedSpclList.map((i) => [i.id, i]));
    const disciplineIds = new Set(curatedSpclList.map((i) => i[parentKey]));

    const data = parentList
      .filter((parent) => disciplineIds.has(parent.id))
      .map((parent) => {
        if (!parent.children?.length) return parent;

        const hasValidChild = parent.children.some((childId) => spclById.has(childId));

        return hasValidChild ? parent : { ...parent, _exclude: true };
      })
      .filter((parent) => !parent._exclude);
    return updateWithSection(data, curatedSpclList);
  }, [parentList, curatedSpclList, searchValue]);

  const onDisciplineChange = (data) => {
    onChange?.(data);
  };

  const clearSearch = (): void => {
    setSearchValue('');
  };

  const toggleDropdown = (state?: boolean): void => {
    const newState = state !== undefined ? state : !isOpen;
    setIsOpen(newState);
    announce(`${newState ? 'expanded' : 'collapsed'}`);
    if (newState === true) {
    } else {
      clearSearch();
    }
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          return;
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen && focusedOptionIndex > 0) {
          setFocusedOptionIndex((prev) => prev - 1);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        clearSearch();
        onCloseDropdown?.();
        break;
      case 'Enter':
        e.preventDefault();
        toggleDropdown();
        break;
      case 'Tab':
        if (isOpen) {
          if (e.shiftKey) {
            e.preventDefault();
            closeButtonRef.current?.focus();
            break;
          }
          // const selectableParentNodes = selectedRawNodes.filter(
          // (node) => node.isParent && (node.isChecked || node.isIndeterminate)
          // );

          // if (!searchKey) {
          // e.preventDefault();
          // if (selectableParentNodes.length > 0) {
          //     const firstChipId = `chip-close-btn-${selectableParentNodes[0]?.id}`;
          //     setTimeout(() => {
          //     document.getElementById(firstChipId)?.focus();
          //     }, 0);
          // } else if (visibleOptions.length > 0) {
          //     setFocusedOptionIndex(0);
          //     setForceRefocus((prev) => !prev);
          // } else {
          //     inputRef.current?.focus();
          // }
        }
        break;
    }
  };

  const handleChevronClick = (e: React.MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    toggleDropdown();
  };

  const handleOptionContainerClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation();
  };

  const handleOptionsMouseDown = (e: React.MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
  };

  const comboboxInput = () => {
    return (
      <ComboboxInput
        ref={inputRef}
        value={searchValue}
        autoComplete="off"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          if (event?.target?.value) {
            if (toggleOnCount === null) {
              setToggleOnCount(1);
            } else {
              setToggleOnCount(toggleOnCount + 1);
            }
          } else {
            setToggleOnCount(0);
          }
          setSearchValue(event?.target?.value);
          setIsOpen(true);
        }}
        onKeyDown={handleInputKeyDown}
        onClick={() => toggleDropdown(true)}
        placeholder={
          selected?.length ? selected?.map((option: any) => option?.label).join(', ') : placeholder
        }
        id={id}
        className="bg-input disabled:text-disabled disabled:bg-disabled disabled:bg-opacity-75 w-full rounded-md border py-1.5 pr-20 pl-3 shadow-sm disabled:cursor-not-allowed disabled:shadow-none sm:text-sm sm:leading-6"
        aria-label={`${ariaLabel} ${
          selected.length > 0
            ? `${selected.length} ${selected.length === 1 ? 'Option' : 'Options'} selected`
            : ''
        }`}
        aria-labelledby={'Please select an option'}
      />
    );
  };

  return (
    <div ref={componentRef} className="flex w-full grow-1 flex-wrap items-baseline gap-1">
      <Combobox
        as="div"
        ref={comboboxRef}
        disabled={disabled}
        onClose={() => {}}
        className={classNames('relative mb-2 w-full flex-grow-1', className)}
      >
        {showPrevData ? (
          <div className="flex w-full flex-wrap items-center justify-between gap-1">
            {RenderLabel({
              label: label,
              id: id,
              required: isRequired,
              disabled: disabled,
              infoMsg,
              infoIconClass,
            })}
            <RenderPreviousData
              label={prevDefaultData?.label}
              id={id}
              data={showMoreTreeData}
              previousData={showPrevData}
              isTree={true}
              dataType={'list'}
            />
          </div>
        ) : (
          RenderLabel({
            label: label,
            id: id,
            required: isRequired,
            disabled: disabled,
            infoMsg,
            infoIconClass,
          })
        )}
        {}
        {disabled && isDisableTextUI ? (
          <div className="form-disabled-value-text pl-0.5">
            {!selected?.length ? (
              <>Not Specified</>
            ) : (
              <ShowMoreTree
                type="list"
                data={showMoreTreeData}
                selector={['label']}
                showTooltip={true}
                moreTextRequired={false}
                selectorType={'child'}
                {...showMoreProp}
              />
            )}
          </div>
        ) : (
          <div className={classNames('relative', label && 'mt-1')}>
            <div className="relative">
              {disabledLabel && disabled ? (
                <Tooltip
                  triggerWrapperClass={'flex'}
                  triggerElement={() => <>{comboboxInput()}</>}
                  tooltip={() => <span className="p-3 text-sm text-gray-700">{disabledLabel}</span>}
                />
              ) : (
                <>{comboboxInput()}</>
              )}

              <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                {searchValue != '' && (
                  <button
                    ref={clearButtonRef}
                    type="button"
                    onClick={clearSearch}
                    className={classNames(
                      'text-default inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-lg',
                      'link-text'
                    )}
                    aria-label={`Clear ${ariaLabel} search`}
                    tabIndex={0}
                  >
                    <FontAwesomeIcon
                      icon={faCircleXmark}
                      className="text-secondary h-4 w-4"
                      aria-hidden="true"
                    />
                  </button>
                )}

                <ComboboxButton
                  ref={dropdownButtonRef}
                  className={classNames(
                    'focus-indicator group z-50 inline-flex items-center rounded-md px-2 py-1'
                  )}
                  aria-label={`${ariaLabel}`}
                  onClick={handleChevronClick}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      toggleDropdown();
                      inputRef.current?.focus();
                    }
                  }}
                >
                  {selected?.length > 0 && (
                    <>
                      <div
                        aria-hidden="true"
                        className="bg-primary-50 text-primary mr-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md text-xs"
                      >
                        {selected.length}
                      </div>
                      <span
                        id="selected-count-status"
                        className="sr-only"
                        aria-live="polite"
                        aria-atomic="true"
                      >
                        {selected.length} {selected.length === 1 ? 'item' : 'items'} selected
                      </span>
                    </>
                  )}

                  <FontAwesomeIcon
                    icon={isOpen ? faChevronUp : faChevronDown}
                    className="text-default ml-2 h-3 w-3"
                    aria-hidden="true"
                  />
                </ComboboxButton>
              </div>
            </div>

            {isOpen && (
              <ComboboxOptions
                key={`dropdown-${isOpen}`}
                anchor="bottom"
                className={classNames(
                  'bg-card mt-1 w-[var(--input-width)] rounded-md border shadow-lg [--anchor-gap:var(--spacing-1)] focus-visible:outline-none',
                  'z-50 flex flex-col gap-1 p-1 transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0',
                  optionsContainerClassName
                )}
                static={isOpen}
                hold={false}
                onClick={handleOptionContainerClick}
                onMouseDown={handleOptionsMouseDown}
              >
                <div ref={optionsRef} className="max-h-[inherit]">
                  {selected?.length > 0 && (
                    <div
                      className="mb-2 flex max-h-[60px] flex-wrap gap-2 overflow-y-auto border-b p-2"
                      onClick={(e) => e.stopPropagation()}
                      role="group"
                      aria-label={`Selected options`}
                    >
                      <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                        {selected?.map((spc: any, idx: number) => (
                          <li key={spc?.id} className="m-0 p-0">
                            <div
                              className="bg-primary-50 text-primary flex flex-row items-center justify-start gap-2 rounded-md px-2 py-1 text-sm"
                              key={spc?.id}
                            >
                              {spc?.label}
                              <button
                                type="button"
                                id={`chip-close-btn-${spc?.id}`}
                                className="focus-indicator text-primary hover:bg-primary-100 hover:text-primary ms-2 inline-flex items-center rounded-md bg-transparent p-1 text-sm"
                                aria-label={`Remove ${spc?.label}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  let updated = selected.filter((i: any) => i.id !== spc.id);
                                  if (treeLinkageEnabled && treeParentChildrenMap) {
                                    const desc = collectDescendantIdsFromTreeParentMap(
                                      spc.id,
                                      treeParentChildrenMap
                                    );
                                    updated = updated.filter((i: any) => !desc.has(i.id));
                                  }
                                  setSelected(updated);
                                  onDisciplineChange(updated);
                                }}
                                onKeyDown={(e) => {
                                  e.stopPropagation();
                                  let updated = selected.filter((i: any) => i.id !== spc.id);
                                  if (treeLinkageEnabled && treeParentChildrenMap) {
                                    const desc = collectDescendantIdsFromTreeParentMap(
                                      spc.id,
                                      treeParentChildrenMap
                                    );
                                    updated = updated.filter((i: any) => !desc.has(i.id));
                                  }
                                  setSelected(updated);
                                  onDisciplineChange(updated);
                                }}
                              >
                                <svg
                                  className="h-2 w-2"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 14 14"
                                >
                                  <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                  />
                                </svg>
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div
                    className="flex max-h-[260px] w-full flex-col overflow-y-auto pb-2"
                    role="tree"
                    tabIndex={-1}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {curatedDsplList?.length ? (
                      <>
                        {curatedDsplList?.map((item, index) => {
                          let spclList = [];
                          if (item?.children) {
                            spclList = curatedSpclList.filter(
                              (i) => i[parentKey] === item.id && item?.children.includes(i.id)
                            );
                          } else {
                            spclList = curatedSpclList.filter((i) => i[parentKey] === item.id);
                          }
                          const selectedSpcl = new Set(selected.map((i) => i.id));
                          const currentSpclSelected = spclList.filter((i) =>
                            selectedSpcl.has(i.id)
                          );

                          // ── single-item checkbox renderer ──────────────────────────────
                          const renderCheckboxRow = (spc: any, indent = 'pl-4') => (
                            <div className={`flex items-center gap-2 ${indent}`} key={spc.id}>
                              <Checkbox
                                id={spc.id}
                                testid="accord_check"
                                name="accordionCheckbox"
                                label=" "
                                checked={selectedSpcl?.has(spc.id)}
                                onChange={(e: any) => {
                                  if (e.target.checked) {
                                    if (multiple) {
                                      const map = new Map(selected.map((i: any) => [i.id, i]));
                                      if (map.has(spc.id)) return;
                                      map.set(spc.id, spc);
                                      if (
                                        treeLinkageEnabled &&
                                        treeOptionById &&
                                        childTreeParentKey
                                      ) {
                                        collectAncestorNodes(
                                          spc,
                                          treeOptionById,
                                          childTreeParentKey
                                        ).forEach((a) => map.set(a.id, a));
                                      }
                                      const updated = [...map.values()];
                                      setSelected(updated);
                                      onDisciplineChange(updated);
                                    } else {
                                      setSelected([spc]);
                                    }
                                  } else {
                                    if (multiple) {
                                      let updatedVal = selected.filter((i: any) => i.id !== spc.id);
                                      let updated = cloneDeep(updatedVal);
                                      if (treeLinkageEnabled && treeParentChildrenMap) {
                                        const desc = collectDescendantIdsFromTreeParentMap(
                                          spc.id,
                                          treeParentChildrenMap
                                        );
                                        updated = updated.filter((i: any) => !desc.has(i.id));
                                        const updatedIds = updated?.map((up) => up.id);
                                        if (updated?.length) {
                                          for (let km of updated) {
                                            if (
                                              km?.isRoot &&
                                              km?.id &&
                                              treeParentChildrenMap.get(km.id)?.length
                                            ) {
                                              const childIds = treeParentChildrenMap
                                                .get(km.id)
                                                ?.map((d) => d.id);
                                              const hasCommonElement = updatedIds.some((item) =>
                                                childIds.includes(item)
                                              );
                                              if (!hasCommonElement) {
                                                km.remove = true;
                                              }
                                            }
                                          }
                                        }
                                        updated = updated?.filter((mn) => !mn.remove);
                                      }
                                      setSelected(updated);
                                      onDisciplineChange(updated);
                                    } else {
                                      setSelected([]);
                                    }
                                  }
                                }}
                              />
                              <label
                                id={spc.label}
                                htmlFor={spc.id}
                                className="cursor-pointer text-[14px]"
                              >
                                {spc.label}
                              </label>
                            </div>
                          );

                          // ── flat children rows (accordion mode + tree mode without sub-tree)
                          const childrenRows = (
                            <div className="flex flex-col gap-2 pl-4" role="list">
                              {spclList?.map((spc) => renderCheckboxRow(spc, ''))}
                            </div>
                          );

                          // ── recursive sub-tree renderer (tree mode + childTreeParentKey) ──
                          const renderSubTree = (items: any[], depth = 0): React.ReactNode => {
                            const idSet = new Set(items.map((i) => i.id));
                            const roots = items.filter(
                              (i) =>
                                !i[childTreeParentKey as string] ||
                                !idSet.has(i[childTreeParentKey as string])
                            );
                            const childrenByParent = new Map<string, any[]>();
                            items.forEach((i) => {
                              const pid = i[childTreeParentKey as string];
                              if (pid && idSet.has(pid)) {
                                if (!childrenByParent.has(pid)) childrenByParent.set(pid, []);
                                childrenByParent.get(pid)!.push(i);
                              }
                            });

                            return roots.map((root) => {
                              const subChildren = childrenByParent.get(root.id) ?? [];
                              const hasSubChildren = subChildren.length > 0;
                              const isExpanded =
                                !!searchValue ||
                                expandedPrograms.has(root.id) ||
                                (initialExpanded && roots.length === 1);
                              const rootLabel = root.label;
                              const allDescendantIds = (node: any): string[] => {
                                const ch = childrenByParent.get(node.id) ?? [];
                                return [node.id, ...ch.flatMap((c: any) => allDescendantIds(c))];
                              };
                              const descendantIds = allDescendantIds(root);
                              const selectedDescendantCount = descendantIds.filter((id) =>
                                selectedSpcl.has(id)
                              ).length;
                              const allDescendantsSelected =
                                descendantIds.length > 0 &&
                                selectedDescendantCount === descendantIds.length;
                              const partialDescendantsSelected =
                                selectedDescendantCount - 1 > 0 &&
                                selectedDescendantCount - 1 < descendantIds.length - 1;
                              return (
                                <div key={root.id} style={{ paddingLeft: depth * 12 }}>
                                  {hasSubChildren ? (
                                    <>
                                      {/* Expandable parent row — chevron toggles expand, checkbox selects all */}
                                      <div className="hover:bg-hover flex items-center justify-between rounded-md py-1">
                                        <div className="flex items-center gap-2">
                                          {/* Chevron: only this toggles expand/collapse */}
                                          <button
                                            type="button"
                                            className="flex cursor-pointer items-center justify-center p-0.5"
                                            aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${rootLabel}`}
                                            onClick={() => toggleExpandedProgram(root.id)}
                                          >
                                            <FontAwesomeIcon
                                              icon={isExpanded ? faChevronDown : faChevronRight}
                                              className="text-secondary h-3 w-3"
                                              aria-hidden="true"
                                            />
                                          </button>
                                          {/* Checkbox: selects/deselects all descendants, does NOT expand */}
                                          <div onClick={(e) => e.stopPropagation()}>
                                            <Checkbox
                                              id={`parent-${root.id}`}
                                              testid="tree_parent_check"
                                              name="treeParentCheckbox"
                                              label=" "
                                              checked={allDescendantsSelected}
                                              indeterminate={partialDescendantsSelected}
                                              onChange={(e: any) => {
                                                const allNodes = items.filter((i) =>
                                                  descendantIds.includes(i.id)
                                                );
                                                if (e.target.checked) {
                                                  const map = new Map(
                                                    selected.map((i: any) => [i.id, i])
                                                  );
                                                  allNodes.forEach((i) => map.set(i.id, i));
                                                  const updated = [...map.values()];
                                                  setSelected(updated);
                                                  onDisciplineChange(updated);
                                                  if (!isExpanded) {
                                                    toggleExpandedProgram(root.id);
                                                  }
                                                } else {
                                                  const removeSet = new Set(descendantIds);
                                                  const updated = selected.filter(
                                                    (i: any) => !removeSet.has(i.id)
                                                  );
                                                  setSelected(updated);
                                                  onDisciplineChange(updated);
                                                }
                                              }}
                                            />
                                          </div>
                                          <label
                                            htmlFor={`parent-${root.id}`}
                                            className={`cursor-pointer text-[14px] ${selectedDescendantCount ? 'text-primary font-semibold' : ''}`}
                                          >
                                            {rootLabel}
                                          </label>
                                        </div>
                                        {selectedDescendantCount > 0 && (
                                          <span className="text-primary mr-1 text-xs">
                                            {selectedDescendantCount - 1}/{descendantIds.length - 1}
                                          </span>
                                        )}
                                      </div>
                                      {/* Expanded children */}
                                      {isExpanded && (
                                        <div className="pl-4">
                                          {renderSubTree(subChildren, depth + 1)}
                                        </div>
                                      )}
                                    </>
                                  ) : (
                                    renderCheckboxRow(root, 'pl-2')
                                  )}
                                </div>
                              );
                            });
                          };

                          // ── shared select-all / clear-all row ─────────────────────────────
                          const bulkActions = multiple ? (
                            <div className="flex items-center justify-end">
                              <div className="flex items-center pb-1">
                                <Button
                                  type="button"
                                  variant="link"
                                  className="disabled:bg-card min-h-px"
                                  disabled={currentSpclSelected?.length === spclList?.length}
                                  onClick={() => {
                                    const map = new Map(selected.map((i) => [i.id, i]));
                                    spclList.forEach((i) => {
                                      map.set(i.id, i);
                                      if (
                                        treeLinkageEnabled &&
                                        treeOptionById &&
                                        childTreeParentKey
                                      ) {
                                        collectAncestorNodes(
                                          i,
                                          treeOptionById,
                                          childTreeParentKey
                                        ).forEach((a) => map.set(a.id, a));
                                      }
                                    });
                                    const updated = [...map?.values()];
                                    setSelected(updated);
                                    onDisciplineChange(updated);
                                  }}
                                >
                                  <span className="text-xs">Select All</span>
                                </Button>
                                <Button
                                  type="button"
                                  variant="link"
                                  className="disabled:bg-card min-h-px"
                                  disabled={!currentSpclSelected?.length}
                                  onClick={() => {
                                    const idsToRemove = new Set(
                                      currentSpclSelected.map((k) => k.id)
                                    );
                                    const updated = selected.filter((i) => !idsToRemove?.has(i.id));
                                    setSelected(updated);
                                    onDisciplineChange(updated);
                                  }}
                                >
                                  <span className="text-xs">Clear All</span>
                                </Button>
                              </div>
                            </div>
                          ) : null;

                          let count;
                          if (onlyCountChildOnAccordion) {
                            count = spclList?.length ? getProgramCount(spclList) : 0;
                          } else {
                            count = spclList?.length
                              ? spclList?.filter((spi) => spi.isRoot)?.length
                              : 0;
                          }

                          return (
                            <div key={index}>
                              {item.sectionName && (
                                <div className="mb-1 ml-1 border-b-[1px] p-1 text-sm font-semibold">
                                  {item.sectionName}
                                </div>
                              )}

                              {treeMode ? (
                                // ── TREE MODE ────────────────────────────────────────────────
                                <>
                                  {spclList?.length ? (
                                    <>
                                      {/* Parent row */}
                                      <div
                                        className="hover:bg-hover flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5"
                                        role="treeitem"
                                        aria-expanded={
                                          searchValue
                                            ? true
                                            : expandedParents.has(item.id) ||
                                              (initialExpanded && curatedDsplList?.length === 1)
                                        }
                                        onClick={() => {
                                          if (searchValue) return;
                                          toggleExpandedParent(item.id);
                                        }}
                                      >
                                        <div className="flex items-center gap-2">
                                          <button
                                            type="button"
                                            className="flex items-center justify-center"
                                            tabIndex={-1}
                                            aria-hidden="true"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              if (!searchValue) toggleExpandedParent(item.id);
                                            }}
                                          >
                                            <FontAwesomeIcon
                                              icon={
                                                searchValue ||
                                                expandedParents.has(item.id) ||
                                                (initialExpanded && curatedDsplList?.length === 1)
                                                  ? faChevronDown
                                                  : faChevronRight
                                              }
                                              className="text-secondary h-3 w-3"
                                              aria-hidden="true"
                                            />
                                          </button>
                                          <span
                                            className={`truncate text-sm font-normal ${
                                              currentSpclSelected?.length
                                                ? 'text-primary font-semibold'
                                                : 'text-gray-800'
                                            }`}
                                          >
                                            {item.label}
                                          </span>
                                          <span className="text-xs text-gray-500">
                                            {`(${count})`}
                                          </span>
                                        </div>
                                        {currentSpclSelected?.length > 0 && (
                                          <Tooltip
                                            triggerWrapperClass={'flex'}
                                            triggerElement={() => (
                                              <FontAwesomeIcon
                                                icon={faCheck}
                                                className="text-primary h-3 w-3 pr-1"
                                                aria-hidden="true"
                                              />
                                            )}
                                            tooltip={() => (
                                              <span className="p-3 text-sm text-gray-700">{`${
                                                currentSpclSelected?.length === spclList?.length
                                                  ? 'All'
                                                  : currentSpclSelected?.length
                                              } selected`}</span>
                                            )}
                                          />
                                        )}
                                      </div>
                                      {/* Children — shown when expanded or searching */}
                                      {(searchValue ||
                                        expandedParents.has(item.id) ||
                                        (initialExpanded && curatedDsplList?.length === 1)) && (
                                        <div className="pl-2">
                                          {bulkActions}
                                          {childTreeParentKey ? (
                                            <div className="flex flex-col gap-1" role="list">
                                              {renderSubTree(spclList)}
                                            </div>
                                          ) : (
                                            childrenRows
                                          )}
                                        </div>
                                      )}
                                    </>
                                  ) : (
                                    <div className="flex items-center gap-1 px-2 py-1">
                                      <Tooltip
                                        triggerElement={() => (
                                          <div className="ml-[2px] cursor-not-allowed pl-4 text-sm font-normal text-gray-400">
                                            {item.label}
                                          </div>
                                        )}
                                        tooltip={() => (
                                          <span className="p-3 text-sm text-gray-700">
                                            {noChildLabel}
                                          </span>
                                        )}
                                      />
                                    </div>
                                  )}
                                </>
                              ) : (
                                // ── ACCORDION MODE (original) ─────────────────────────────────
                                <>
                                  {spclList?.length ? (
                                    <Accordion
                                      header={
                                        <div className="flex w-[calc(100%_-_20px)] cursor-pointer items-center justify-between">
                                          <label
                                            className={`flex ${currentSpclSelected?.length ? 'w-[calc(100%_-_15px)]' : 'w-full'} cursor-pointer items-center gap-1`}
                                          >
                                            <span
                                              className={`truncate text-sm font-normal ${currentSpclSelected?.length ? 'text-primary font-semibold' : 'text-gray-800'}`}
                                            >
                                              {item.label}
                                            </span>
                                            <span className="mt-1 text-xs text-gray-500">{`(${spclList?.length})`}</span>
                                          </label>
                                          {currentSpclSelected?.length > 0 && (
                                            <Tooltip
                                              triggerWrapperClass={'flex'}
                                              triggerElement={() => (
                                                <FontAwesomeIcon
                                                  icon={faCheck}
                                                  className="text-primary h-3 w-3 pr-1"
                                                  aria-hidden="true"
                                                />
                                              )}
                                              tooltip={() => (
                                                <span className="p-3 text-sm text-gray-700">{`${currentSpclSelected?.length === spclList?.length ? 'All' : currentSpclSelected?.length} selected`}</span>
                                              )}
                                            />
                                          )}
                                        </div>
                                      }
                                      startingButton={true}
                                      treeIcon={treeIcon}
                                      iconSize={'h-3 w-3'}
                                      accordionWrapperClass={'border-0'}
                                      contentClass={'border-0 px-2 pb-2 pt-1'}
                                      className="rounded-lg p-1.5"
                                      onToggle={(e) => {
                                        if (searchValue) {
                                          return;
                                        }
                                        const idx = openedIds.current.indexOf(item.id);
                                        if (e.isExpanded && idx < 0) {
                                          openedIds.current.push(item.id);
                                        } else if (idx > -1 && !e.isExpanded) {
                                          openedIds.current.splice(idx, 1);
                                        }
                                      }}
                                      expanded={
                                        searchValue
                                          ? openedIds?.current?.includes(item.id)
                                          : initialExpanded && curatedDsplList?.length === 1
                                            ? true
                                            : false
                                      }
                                      toggleOnCount={toggleOnCount}
                                    >
                                      <div>
                                        {bulkActions}
                                        {childrenRows}
                                      </div>
                                    </Accordion>
                                  ) : (
                                    <div className="flex items-center gap-1 px-2 py-1">
                                      <Tooltip
                                        triggerElement={() => (
                                          <div className="ml-[2px] cursor-not-allowed pl-4 text-sm font-normal text-gray-400">
                                            {item.label}
                                          </div>
                                        )}
                                        tooltip={() => (
                                          <span className="p-3 text-sm text-gray-700">
                                            {noChildLabel}
                                          </span>
                                        )}
                                      />
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          );
                        })}
                      </>
                    ) : (
                      <>
                        <div className="text-center text-sm text-gray-400">No Data Found</div>
                      </>
                    )}
                  </div>
                  <div className="flex justify-end gap-2 border-t">
                    <button
                      ref={closeButtonRef}
                      type="button"
                      className="link-text text-primary px-2 text-xs"
                      aria-label={`close ${ariaLabel}`}
                      onClick={() => {
                        setIsOpen(false);
                        setTimeout(() => inputRef.current?.focus(), 0);
                        onCloseDropdown?.();
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </ComboboxOptions>
            )}
          </div>
        )}
      </Combobox>
    </div>
  );
}
