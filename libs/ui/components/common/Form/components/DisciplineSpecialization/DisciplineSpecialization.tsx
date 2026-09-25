/* eslint-disable no-console */
import { useEffect, useMemo, useState, type JSX } from 'react';
import HierarchySelect from './HierarchySelect';
import { Select } from '../Select';

interface ProgramOption {
  id: string;
  label: string;
  value: string;
  parentId: string | null;
  disciplineId?: string;
  isParent?: boolean;
  isChild?: boolean;
  children?: ProgramOption[];
}

interface ProgramDropdownOption {
  id: string;
  label: string;
  value: string;
  disciplineId: string;
  programId: string;
  rootProgramId: string;
  parentProgramId: string | null;
  treeParentId: string | null;
  isRoot: boolean;
}

interface ProgramSelection {
  programId: string;
  subPrograms: string[];
}

export const flattenProgramOptions = (
  programs: ProgramOption[] = [],
  inheritedDisciplineId?: string
): ProgramOption[] => {
  const flatPrograms: ProgramOption[] = [];
  programs.forEach((program) => {
    const normalizedProgram: ProgramOption = {
      ...program,
      disciplineId: program.disciplineId ?? inheritedDisciplineId,
      isParent: program.parentId === null,
      isChild: program.parentId !== null,
    };
    flatPrograms.push(normalizedProgram);
    if (program.children?.length) {
      flatPrograms.push(...flattenProgramOptions(program.children, normalizedProgram.disciplineId));
    }
  });
  return flatPrograms;
};

export const getUniquePrograms = (programs: ProgramOption[] = []): ProgramOption[] => {
  const uniquePrograms = new Map<string, ProgramOption>();
  programs.forEach((program) => {
    const key = `${program.id}::${program.parentId ?? 'root'}`;
    if (!uniquePrograms.has(key)) {
      uniquePrograms.set(key, {
        ...program,
        children: [],
        isParent: program.parentId === null,
        isChild: program.parentId !== null,
      });
    }
  });
  return [...uniquePrograms.values()];
};

export const buildProgramTree = (programs: ProgramOption[] = []): ProgramOption[] => {
  if (!programs.length) return [];
  const flatPrograms = getUniquePrograms(flattenProgramOptions(programs));
  const nodeMap = new Map<string, ProgramOption>();
  flatPrograms.forEach((program) => {
    const key = `${program.disciplineId ?? ''}::${program.id}`;
    nodeMap.set(key, { ...program, children: [] });
  });
  const roots: ProgramOption[] = [];
  flatPrograms.forEach((program) => {
    const key = `${program.disciplineId ?? ''}::${program.id}`;
    const current = nodeMap.get(key)!;
    const parentKey = `${program.disciplineId ?? ''}::${program.parentId ?? ''}`;
    if (program.parentId && nodeMap.has(parentKey)) {
      nodeMap.get(parentKey)!.children!.push(current);
    } else {
      roots.push(current);
    }
  });
  return roots;
};

export const toProgramDropdownOptions = (
  programs: ProgramOption[] = []
): ProgramDropdownOption[] => {
  if (!programs.length) return [];
  const tree = buildProgramTree(programs);
  const dropdownOptions: ProgramDropdownOption[] = [];

  const walk = (node: ProgramOption, rootProgramId: string, depth: number) => {
    const disciplineId = node.disciplineId ?? '';
    dropdownOptions.push({
      id: `${disciplineId}::${node.id}`,
      label: node.label,
      value: node.value ?? node.id,
      disciplineId,
      programId: node.id,
      rootProgramId,
      parentProgramId: node.parentId,
      treeParentId: node.parentId ? `${disciplineId}::${node.parentId}` : null,
      isRoot: depth === 0,
    });

    node.children?.forEach((child) => walk(child, rootProgramId, depth + 1));
  };

  tree.forEach((root) => walk(root, root.id, 0));
  return dropdownOptions;
};

export const applySingleOptionAutoSelect = (
  selectedOptions: ProgramDropdownOption[],
  disciplineIds: Set<string>,
  availableOptions: ProgramDropdownOption[]
): ProgramDropdownOption[] => {
  const nextSelected = [...selectedOptions];
  [...disciplineIds].forEach((disciplineId) => {
    const selectedInDiscipline = nextSelected.filter(
      (option) => option.disciplineId === disciplineId
    );
    if (selectedInDiscipline.length) return;

    const optionsInDiscipline = availableOptions.filter(
      (option) => option.disciplineId === disciplineId
    );
    if (optionsInDiscipline.length === 1) {
      nextSelected.push(optionsInDiscipline[0]);
      return;
    }

    const rootPrograms = optionsInDiscipline.filter((option) => option.isRoot);
    if (rootPrograms.length === 1) {
      const rootId = rootPrograms[0].programId;
      const entireTree = optionsInDiscipline.filter((option) => option.rootProgramId === rootId);
      if (entireTree?.length) {
        const onlyChild = entireTree?.filter((i) => i.parentProgramId);
        if (onlyChild?.length === 1) {
          nextSelected.push(...entireTree);
        }
      }
    }
  });
  return nextSelected;
};

export default function DisciplineSpecialzationDropdown({
  allSpecializations = [],
  disciplineOptions = [],
  defaultSelected = null,
  defaultTypeCurriculum = false,
  sendTypeCurriculum = false,
  pageId = '',
  disciplineConfig = { label: 'Discipline', className: '', required: true },
  specializationConfig = {
    label: 'Specialization',
    className: '',
    required: true,
    makeNoChildParentsAtLast: true,
  },
  filteredCurriculum = null,
  needCompleteListOnFiltering = false,
  clearBit = 0,
  infoSpclLabel = 'Please select specialization(s) for discipline(s) you selected:',
  infoProgramLabel = 'Please select program type(s) for discipline(s) you selected:',
  disciplineInfoMsg = null,
  strictSubsetCheck = true,
  bifurcateDiscipline = false,
  discMultiple = true,
  spclMultiple = true,
  spclDisabled = false,
  dscDisabled = false,
  /** When set, shown on each externally disabled field instead of dependency hints (e.g. "select discipline first"). */
  disabledTooltip = null,
  optionsContainerClass = '',
  isDisableTextUI = false,
  showMorePropDsc = { maxLength: 2 },
  showMorePropSpc = { maxLength: 2 },
  showMorePropProgram = { maxLength: 2 },
  prevDefaultData = { label: 'Edited by Site', data: null },
  prevDefaultprogramData = null,
  wrapperClass = '',
  onCloseDiscipline,
  onCloseSpecialization,
  onChanges,
  getInitialValidationCheck,
  onValidationChange,
  // ── program props (optional) ──────────────────────────────────────────────
  allPrograms = [],
  programConfig = { label: 'Program Type', className: '', required: false },
  defaultSelectedPrograms = null,
  onProgramChange,
  autoSelectSingleDisciplineSpecialization = false,
}: {
  allSpecializations: any[];
  disciplineOptions: any[];
  defaultSelected:
    | { disciplines: string[]; specializations: string[] }
    | { disciplineId: string; specializationId: string }[]
    | null;
  defaultTypeCurriculum?: boolean;
  sendTypeCurriculum?: boolean;
  disciplineLabel?: string;
  specializationLabel?: string;
  pageId?: string;
  disciplineConfig?: any;
  specializationConfig?: any;
  filteredCurriculum?: any[] | null;
  needCompleteListOnFiltering?: boolean;
  clearBit?: number;
  infoSpclLabel?: string;
  infoProgramLabel?: string;
  disciplineInfoMsg?: string | null;
  strictSubsetCheck?: boolean;
  bifurcateDiscipline?: boolean;
  discMultiple?: boolean;
  spclMultiple?: boolean;
  spclDisabled?: boolean;
  dscDisabled?: boolean;
  disabledTooltip?: string | null;
  optionsContainerClass?: string;
  isDisableTextUI?: boolean;
  showMorePropDsc?: any;
  showMorePropSpc?: any;
  showMorePropProgram?: any;
  prevDefaultData?: any;
  prevDefaultprogramData?: any;
  wrapperClass?: string;
  onCloseSpecialization?: () => void;
  onCloseDiscipline?: () => void;
  onChanges: (e: any, valid?: any, newCurriculumAdded?: any) => void;
  getInitialValidationCheck?: (e: any) => void;
  /** Fires whenever the combined discipline/specialization/program validity changes.
   *  Callers can store this in state to drive save-button disabled logic reactively. */
  onValidationChange?: (valid: boolean) => void;
  // ── program props (optional) ──────────────────────────────────────────────
  allPrograms?: ProgramOption[];
  programConfig?: { label?: string; className?: string; required?: boolean };
  defaultSelectedPrograms?: ProgramSelection[] | null;
  onProgramChange?: (selections: ProgramSelection[]) => void;
  /** When true: auto-pick the sole discipline when only one is offered, and auto-pick the sole specialization per selected discipline when only one exists (create-availability style). */
  autoSelectSingleDisciplineSpecialization?: boolean;
}): JSX.Element {
  const disciplineIdSet = useMemo(
    () => new Set(filteredCurriculum?.map?.((i) => i.disciplineId)),
    [filteredCurriculum]
  );

  const specializationIdSet = useMemo(
    () => new Set(filteredCurriculum?.map?.((i) => i.specializationId)),
    [filteredCurriculum]
  );

  const disciplineOps = useMemo(() => {
    if (bifurcateDiscipline && needCompleteListOnFiltering && filteredCurriculum?.length) {
      const locDisciplines = [];
      const otherDisciplines = [];

      for (const item of disciplineOptions) {
        if (disciplineIdSet?.has(item.id)) {
          item.sectionId = 'location';
          locDisciplines.push(item);
        } else {
          item.sectionId = 'other';
          otherDisciplines.push(item);
        }
      }
      return [...locDisciplines, ...otherDisciplines];
    } else {
      return !needCompleteListOnFiltering && disciplineIdSet?.size
        ? disciplineOptions.filter((i) => disciplineIdSet?.has(i.id))
        : disciplineOptions;
    }
  }, [needCompleteListOnFiltering, disciplineOptions, disciplineIdSet]);

  const allowedDisciplineIdSet = useMemo(
    () => new Set(disciplineOps.map((o: any) => o.id)),
    [disciplineOps]
  );

  const specializationOps = useMemo(
    () =>
      !needCompleteListOnFiltering && specializationIdSet?.size
        ? allSpecializations.filter((i) => specializationIdSet?.has(i.id))
        : allSpecializations,
    [needCompleteListOnFiltering, allSpecializations, specializationIdSet]
  );

  const fixDataToActualDefault = (curr: any) => {
    if (curr?.length) {
      const disciplineIds = curr
        .map((i: any) => i?.disciplineId)
        .filter((id: any) => id != null && id !== '');
      return {
        disciplines: [...new Set(disciplineIds)],
        specializations: [
          ...new Set(curr.map((i: any) => i.specializationId).filter((k: any) => k)),
        ],
      };
    } else {
      return null;
    }
  };

  const stubDiscipline = (id: string) => ({
    id,
    label: id,
    value: id,
  });
  const stubSpecialization = (id: string, disciplineId?: string) => ({
    id,
    label: id,
    value: id,
    ...(disciplineId ? { disciplineId } : {}),
  });

  const getSelectedOptions = (selected: any): any => {
    if (selected) {
      const data = defaultTypeCurriculum ? fixDataToActualDefault(selected) : selected;
      if (data?.disciplines?.length) {
        const disciplineSelected = data.disciplines
          .map((did: any) => {
            const id = typeof did === 'object' && did != null ? did.id : did;
            if (disciplineOps.length > 0 && !allowedDisciplineIdSet.has(id)) {
              return null;
            }
            const opt = disciplineOptions.find((i) => i.id === id);
            return opt ?? stubDiscipline(id);
          })
          .filter(Boolean);
        const keptDisciplineIds = new Set(disciplineSelected.map((d: any) => d.id));
        let specializationSelected = [];
        if (data?.specializations?.length) {
          specializationSelected = data.specializations
            .map((sid: any) => {
              const sidNorm = typeof sid === 'object' && sid != null ? sid.id : sid;
              const opt = allSpecializations.find((i) => i.id === sidNorm);
              const row = opt ?? stubSpecialization(sidNorm);
              const dId = row.disciplineId ?? opt?.disciplineId;
              if (!dId || !keptDisciplineIds.has(dId)) return null;
              return row;
            })
            .filter(Boolean);
        }
        return { disciplines: disciplineSelected, specializations: specializationSelected };
      }
    }
    return null;
  };

  const getSpecializationOptions = (s: any) => {
    const data = defaultTypeCurriculum ? fixDataToActualDefault(s) : s;
    const rawDisciplines = data?.disciplines ?? [];
    const disciplineIds = rawDisciplines.map((d: any) =>
      typeof d === 'object' && d != null ? d.id : d
    );
    const spclList = specializationOps?.filter((i) => disciplineIds.includes(i.disciplineId));
    return spclList ?? [];
  };

  const checkValidation = (value: any, initialCheck: boolean = false) => {
    const invalid: any = { data: [], valid: true };
    const filteredCurriculumWithoutSpecializations: any[] =
      filteredCurriculum
        ?.filter((k) => k.disciplineId && !k.specializationId)
        ?.map((j) => j.disciplineId) ?? [];
    if (value?.disciplines?.length) {
      if (initialCheck) {
        const requestedDisciplineIds = value.disciplines;
        value.disciplines = (
          requestedDisciplineIds?.map((i: any) => {
            const found = disciplineOptions?.find((k) => k.id === i);
            if (found) return found;
            if (i == null || i === '') return undefined;
            return stubDiscipline(i);
          }) ?? []
        ).filter(Boolean);
        if (
          requestedDisciplineIds?.filter((x: any) => x != null && x !== '').length >
          value.disciplines.length
        ) {
          invalid.valid = false;
        }
        if (value?.specializations?.length) {
          const requestedSpecIds = value.specializations;
          value.specializations = (
            requestedSpecIds?.map((i: any) => {
              const found = allSpecializations?.find((k) => k.id === i);
              if (found) return found;
              if (i == null || i === '') return undefined;
              return stubSpecialization(i);
            }) ?? []
          ).filter(Boolean);
          if (
            requestedSpecIds?.filter((x: any) => x != null && x !== '').length >
            value.specializations.length
          ) {
            invalid.valid = false;
          }
        }
      }
      for (let i = 0; i < value.disciplines.length; i++) {
        const disciplineRow = value.disciplines[i];
        if (!disciplineRow?.id) continue;
        const dId = disciplineRow.id;
        if (
          filteredCurriculumWithoutSpecializations?.length &&
          filteredCurriculumWithoutSpecializations.includes(dId)
        ) {
          continue;
        } else {
          const haveSpecialization = specializationOps?.filter((i) => dId === i.disciplineId);
          if (haveSpecialization?.length) {
            if (value?.specializations?.length) {
              const haveSpecializationInSelected = value?.specializations?.filter(
                (j: any) => dId === j.disciplineId
              );
              if (!haveSpecializationInSelected?.length) {
                invalid.data.push(value?.disciplines?.[i]);
                invalid.valid = false;
              }
            } else {
              invalid.data.push(value?.disciplines?.[i]);
              invalid.valid = false;
            }
          }
        }
      }
      if (disciplineOps?.length > 0) {
        for (const row of value.disciplines) {
          const id = row?.id;
          if (id && !allowedDisciplineIdSet.has(id)) {
            invalid.valid = false;
            if (!invalid.data.some((x: any) => x?.id === id)) {
              invalid.data.push(row);
            }
          }
        }
      }
      if (specializationOps?.length > 0 && value?.specializations?.length) {
        const allowedSpecIds = new Set(specializationOps.map((s: any) => s.id));
        for (const row of value.specializations) {
          const id = row?.id;
          if (id && !allowedSpecIds.has(id)) {
            invalid.valid = false;
            if (!invalid.data.some((x: any) => x?.id === id)) {
              invalid.data.push(row);
            }
          }
        }
      }
    } else {
      invalid.valid = false;
    }
    return invalid;
  };

  const checkProgramRequiredByDefaults = (disciplines: any[] = []) => {
    const invalid: any = { data: [], valid: true };
    if (!programConfig?.required) return invalid;

    if (!disciplines?.length) {
      invalid.valid = false;
      return invalid;
    }

    const defaultProgramSelections = defaultSelectedPrograms ?? [];
    const selectedProgramIds = new Set<string>();

    defaultProgramSelections.forEach((sel: any) => {
      if (sel?.programId) selectedProgramIds.add(sel.programId);
      sel?.subPrograms?.forEach((id: any) => {
        if (id) selectedProgramIds.add(id);
      });
    });

    const flatAllPrograms = flattenProgramOptions(allPrograms);
    const programIdToDisciplineId = new Map<string, string>();
    flatAllPrograms.forEach((p: any) => {
      if (p?.id && p?.disciplineId) programIdToDisciplineId.set(p.id, p.disciplineId);
    });

    const selectedProgramDisciplineIds = new Set<string>();
    selectedProgramIds.forEach((pid) => {
      const did = programIdToDisciplineId.get(pid);
      if (did) selectedProgramDisciplineIds.add(did);
    });

    disciplines.forEach((discipline: any) => {
      const disciplineId = discipline?.id ?? discipline;

      const hasAvailablePrograms = flatAllPrograms.some(
        (p: any) => p?.disciplineId === disciplineId
      );
      if (!hasAvailablePrograms) return;

      // If something was selected (or preselected by defaults), it's valid.
      if (selectedProgramDisciplineIds.has(disciplineId)) return;

      const disciplinePrograms = flatAllPrograms.filter(
        (p: any) => p?.disciplineId === disciplineId
      );
      const availableDropdownOptions = toProgramDropdownOptions(disciplinePrograms);
      const optionsCount = availableDropdownOptions.length;
      const rootCount = availableDropdownOptions.filter((op) => op.isRoot).length;

      // The auto-select bypass only applies when defaultSelectedPrograms is null/undefined,
      // meaning the parent never explicitly set programs (fresh form). When the parent passes []
      // the user cleared their selection, so auto-select will NOT run — treat as invalid.
      const autoSelectWillRun = defaultSelectedPrograms == null;
      const canAutoSelect = autoSelectWillRun && (optionsCount === 1 || rootCount === 1);
      if (!canAutoSelect) {
        invalid.valid = false;
        invalid.data.push(discipline);
      }
    });

    return invalid;
  };

  const getValidationAtStart = (selected: any) => {
    const data = defaultTypeCurriculum ? fixDataToActualDefault(selected) : selected;
    let valid = { data: [], valid: true };
    if (data?.disciplines?.length) {
      valid = checkValidation(data, true);
    }

    // Program required validation should affect the same `valid.valid` used by the page.
    if (programConfig?.required) {
      const programInvalid = checkProgramRequiredByDefaults(data?.disciplines ?? []);
      valid.valid = valid.valid && programInvalid.valid;
    }
    getInitialValidationCheck?.(valid);
    return valid;
  };

  const [selected, setSelected] = useState<any>(getSelectedOptions(defaultSelected));
  const [prevSelected, setPrevSelected] = useState<any>(
    getSelectedOptions(prevDefaultData?.data ?? null)
  );
  const [specializationOptions, setSpecializationOptions] = useState<any[]>(
    getSpecializationOptions(defaultSelected)
  );
  const [reset, setReset] = useState<boolean>(false);
  const [valid, setValid] = useState<any>(getValidationAtStart(defaultSelected));

  // ── program state ──────────────────────────────────────────────────────────
  const hasProgramDropdown = allPrograms?.length > 0;

  const defaultProgramIds = useMemo(() => {
    if (!defaultSelectedPrograms?.length) return [];
    const ids = new Set<string>();
    defaultSelectedPrograms.forEach((item) => {
      if (item?.programId) ids.add(item.programId);
      item?.subPrograms?.forEach((subId) => ids.add(subId));
    });
    return [...ids];
  }, [defaultSelectedPrograms]);

  const [programOptions, setProgramOptions] = useState<ProgramDropdownOption[]>(() => {
    if (!hasProgramDropdown) return [];
    const initial = getSelectedOptions(defaultSelected);
    const disciplineIds = new Set<string>(initial?.disciplines?.map((d: any) => d.id) ?? []);
    if (!disciplineIds.size) return [];
    const filteredPrograms: ProgramOption[] = allPrograms.filter(
      (p) => p.disciplineId && disciplineIds.has(p.disciplineId)
    );
    return toProgramDropdownOptions(filteredPrograms);
  });
  const [selectedProgramOptions, setSelectedProgramOptions] = useState<ProgramDropdownOption[]>(
    () => {
      const initialSelected: ProgramDropdownOption[] = [];
      if (defaultProgramIds.length) {
        programOptions.forEach((option) => {
          if (defaultProgramIds.includes(option.programId)) {
            initialSelected.push(option);
          }
        });
      }

      const initial = getSelectedOptions(defaultSelected);
      const disciplineIds = new Set<string>(initial?.disciplines?.map((d: any) => d.id) ?? []);
      // Only auto-select when defaultSelectedPrograms is null/undefined (parent never set programs).
      // When [] is passed, the user explicitly cleared their selection — preserve that intent.
      // When curriculum already has disciplines but programs were never saved, do not auto-pick program type (explicit user choice on edit).
      const hasDisciplineDefaults =
        defaultTypeCurriculum &&
        Array.isArray(defaultSelected) &&
        defaultSelected.some((r: any) => r?.disciplineId);
      if (defaultSelectedPrograms == null && !hasDisciplineDefaults) {
        return applySingleOptionAutoSelect(initialSelected, disciplineIds, programOptions);
      }
      return initialSelected;
    }
  );

  const [prevSelectedPrograms, setPrevSelectedPrograms] = useState<any>(() => {
    const initialSelected: ProgramDropdownOption[] = [];
    if (!prevDefaultprogramData?.length) return null;
    let prevProgramIds: string[] = [];
    if (prevDefaultprogramData?.length) {
      const ids = new Set<string>();
      prevDefaultprogramData.forEach((item) => {
        if (item?.programId) ids.add(item.programId);
        item?.subPrograms?.forEach((subId) => ids.add(subId));
      });
      prevProgramIds = [...ids];
    }
    if (prevProgramIds.length) {
      programOptions.forEach((option) => {
        if (prevProgramIds.includes(option.programId)) {
          initialSelected.push(option);
        }
      });
    }
    return initialSelected;
  });
  const [programDefaultsApplied, setProgramDefaultsApplied] = useState<boolean>(
    defaultProgramIds.length === 0 || programOptions.length > 0
  );
  const [programValid, setProgramValid] = useState<any>({ data: [], valid: true });

  const toProgramSelections = (selectedNodes: ProgramDropdownOption[] = []): ProgramSelection[] => {
    if (!selectedNodes?.length) return [];
    const groupedByRoot = new Map<string, Set<string>>();

    selectedNodes.forEach((node) => {
      const rootId = node.rootProgramId;
      if (!groupedByRoot.has(rootId)) {
        groupedByRoot.set(rootId, new Set<string>());
      }
      if (node.programId !== rootId) {
        groupedByRoot.get(rootId)!.add(node.programId);
      }
    });

    return [...groupedByRoot.entries()].map(([programId, subPrograms]) => ({
      programId,
      subPrograms: [...subPrograms],
    }));
  };

  const checkProgramValidation = (
    disciplines: any[] = [],
    selectedPrograms: ProgramDropdownOption[] = [],
    availablePrograms: ProgramDropdownOption[] = programOptions
  ) => {
    const invalid: any = { data: [], valid: true };
    if (!programConfig?.required) return invalid;

    if (!disciplines?.length) {
      invalid.valid = false;
      return invalid;
    }

    disciplines.forEach((discipline: any) => {
      const dId = discipline.id;
      const hasAvailableInDropdown = availablePrograms.some(
        (program) => program.disciplineId === dId
      );
      const hasAvailableInCatalog =
        hasProgramDropdown && allPrograms.some((p: any) => p?.disciplineId === dId);
      const hasAvailablePrograms = hasAvailableInDropdown || hasAvailableInCatalog;
      const hasSelectedPrograms = selectedPrograms.some((program) => program.disciplineId === dId);
      if (hasAvailablePrograms && !hasSelectedPrograms) {
        invalid.valid = false;
        invalid.data.push(discipline);
      }
    });
    return invalid;
  };

  useEffect(() => {
    setProgramValid(
      checkProgramValidation(selected?.disciplines ?? [], selectedProgramOptions, programOptions)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    programConfig?.required,
    selected?.disciplines,
    selectedProgramOptions,
    programOptions,
    allPrograms,
  ]);

  useEffect(() => {
    if (clearBit) {
      setSelected([]);
      setReset(true);
      setSelectedProgramOptions([]);
      setProgramDefaultsApplied(false);
      setProgramValid({ data: [], valid: !programConfig?.required });
      onProgramChange?.([]);
      setTimeout(() => {
        setReset(false);
      }, 100);
    }
  }, [clearBit]);

  useEffect(() => {
    const v = checkValidation(
      {
        disciplines: [...(selected?.disciplines ?? [])],
        specializations: [...(selected?.specializations ?? [])],
      },
      false
    );
    let finalValid = v;
    if (programConfig?.required) {
      const programInvalid = checkProgramValidation(
        selected?.disciplines ?? [],
        selectedProgramOptions,
        programOptions
      );
      finalValid = {
        ...v,
        valid: v.valid && programInvalid.valid,
      };
    }
    setValid(finalValid);
    onValidationChange?.(finalValid.valid ?? true);
  }, [
    disciplineOps,
    specializationOps,
    allowedDisciplineIdSet,
    selectedProgramOptions,
    programOptions,
    programConfig?.required,
    allPrograms,
  ]);

  const isSubset = (curr: any[] = [], locationCurr: any[] = []) => {
    if (!locationCurr.length) return true;

    return curr.every((smallItem) =>
      locationCurr.some((bigItem) => {
        if (!strictSubsetCheck && !smallItem.specializationId) {
          return bigItem.disciplineId === smallItem.disciplineId;
        }
        return (
          bigItem.disciplineId === smallItem.disciplineId &&
          bigItem.specializationId === smallItem.specializationId
        );
      })
    );
  };

  const onSelectChange = (
    value: any,
    programSelectionOverride?: ProgramDropdownOption[],
    programOptionsOverride?: ProgramDropdownOption[]
  ) => {
    const specializationValid = checkValidation(value);
    let finalValid = specializationValid;

    if (programConfig?.required) {
      const programInvalid = checkProgramValidation(
        value?.disciplines ?? [],
        programSelectionOverride ?? selectedProgramOptions,
        programOptionsOverride ?? programOptions
      );
      finalValid = {
        ...specializationValid,
        valid: specializationValid.valid && programInvalid.valid,
      };
    }

    setValid(finalValid);
    onValidationChange?.(finalValid.valid ?? true);
    const disciplines = value.disciplines ?? [];
    const specializations = value.specializations ?? [];

    const result = [
      ...specializations?.map?.((spc: any) => ({
        disciplineId: spc.disciplineId,
        specializationId: spc.id,
      })),
      ...disciplines
        ?.filter((d: any) => !specializations?.some?.((s: any) => s.disciplineId === d.id))
        ?.map((d: any) => ({
          disciplineId: d.id,
        })),
    ];
    let newCurriculumAdded = false;
    if (needCompleteListOnFiltering) {
      if (!filteredCurriculum?.length) {
        newCurriculumAdded = true;
      } else {
        newCurriculumAdded = !isSubset(result, filteredCurriculum);
      }
    }
    if (sendTypeCurriculum) {
      onChanges(result, finalValid, newCurriculumAdded);
    } else {
      onChanges(value, finalValid, newCurriculumAdded);
    }
  };

  const constructSpecializationOptions = (d: any) => {
    const disc = d?.disciplines;
    let spclList: any[] = [];
    if (disc?.length) {
      const disciplineIds = disc.map((i: any) => i.id);
      spclList = specializationOps.filter((i: any) => disciplineIds.includes(i.disciplineId));
      setSpecializationOptions(spclList);
    } else {
      setSpecializationOptions([]);
    }

    let tempCurriculum = d;
    if (autoSelectSingleDisciplineSpecialization && disc?.length && spclList?.length) {
      const mergedSpecs = [...(d?.specializations ?? [])];
      let changed = false;
      for (const drow of disc) {
        const did = drow.id;
        const forD = spclList.filter((s: any) => s.disciplineId === did);
        const hasSpecForDisc = mergedSpecs.some((s: any) => s.disciplineId === did);
        if (forD.length === 1 && !hasSpecForDisc) {
          mergedSpecs.push(forD[0]);
          changed = true;
        }
      }
      if (changed) {
        tempCurriculum = { ...d, specializations: mergedSpecs };
      }
    }

    let curriculumValue = tempCurriculum;
    if (tempCurriculum?.specializations?.length) {
      const selectedSpclIds = tempCurriculum.specializations.map((i: any) => i.id);
      const updatedSelected = spclList?.filter((i: any) => selectedSpclIds.includes(i.id));
      curriculumValue = { ...tempCurriculum, specializations: updatedSelected };
      setSelected(curriculumValue);
    } else {
      setSelected(tempCurriculum);
    }

    // ── update program options when disciplines change ──────────────────────
    let programSelectionOverride: ProgramDropdownOption[] | undefined;
    let programOptionsOverride: ProgramDropdownOption[] | undefined;

    if (hasProgramDropdown) {
      const disciplineIds = new Set<string>(disc?.map((i: any) => i.id) ?? []);
      const newProgramOptions = disciplineIds.size
        ? toProgramDropdownOptions(
            allPrograms.filter((p) => p.disciplineId && disciplineIds.has(p.disciplineId))
          )
        : [];
      setProgramOptions(newProgramOptions);

      if (!disciplineIds.size) {
        programSelectionOverride = [];
        programOptionsOverride = [];
        setSelectedProgramOptions([]);
        setProgramValid(checkProgramValidation(disc ?? [], [], []));
        onProgramChange?.([]);
      }

      if (disciplineIds.size) {
        const optionMap = new Map(newProgramOptions.map((op) => [op.id, op]));
        const nextSelected = selectedProgramOptions.filter((op) => optionMap.has(op.id));

        if (!programDefaultsApplied && defaultProgramIds.length) {
          const defaultSelectedOptions = newProgramOptions.filter((option) =>
            defaultProgramIds.includes(option.programId)
          );
          defaultSelectedOptions.forEach((option) => {
            if (!nextSelected.some((selectedOption) => selectedOption.id === option.id)) {
              nextSelected.push(option);
            }
          });
          setProgramDefaultsApplied(true);
        }

        const autoSelected = applySingleOptionAutoSelect(
          nextSelected,
          disciplineIds,
          newProgramOptions
        );
        programSelectionOverride = autoSelected;
        programOptionsOverride = newProgramOptions;
        setSelectedProgramOptions(autoSelected);
        setProgramValid(checkProgramValidation(disc ?? [], autoSelected, newProgramOptions));
        onProgramChange?.(toProgramSelections(autoSelected));
      }
    }

    onSelectChange(curriculumValue, programSelectionOverride, programOptionsOverride);
  };

  // When allPrograms arrives late (meta loads after mount), rebuild programOptions for any
  // disciplines that are already selected so validity can be recomputed correctly.
  useEffect(() => {
    if (!allPrograms?.length || !selected?.disciplines?.length) return;
    const disciplineIds = new Set<string>(selected.disciplines.map((d: any) => d.id));
    const newProgramOptions = toProgramDropdownOptions(
      allPrograms.filter((p) => p.disciplineId && disciplineIds.has(p.disciplineId))
    );
    setProgramOptions(newProgramOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allPrograms]);

  useEffect(() => {
    if (!disciplineOps?.length) return;
    if (!selected?.disciplines?.length) return;
    const hasOrphan = selected.disciplines.some((d: any) => !allowedDisciplineIdSet.has(d.id));
    if (!hasOrphan) return;
    const filteredDisciplines = selected.disciplines.filter((d: any) =>
      allowedDisciplineIdSet.has(d.id)
    );
    const keptIds = new Set(filteredDisciplines.map((d: any) => d.id));
    const filteredSpecs =
      selected.specializations?.filter((s: any) => keptIds.has(s.disciplineId)) ?? [];
    constructSpecializationOptions({
      ...selected,
      disciplines: filteredDisciplines,
      specializations: filteredSpecs,
    });
  }, [selected, disciplineOps, allowedDisciplineIdSet]);

  useEffect(() => {
    if (!autoSelectSingleDisciplineSpecialization) return;
    if (!disciplineOps?.length || disciplineOps.length !== 1) return;
    if (selected?.disciplines?.length) return;

    const sorted = [...disciplineOps].sort((a: any, b: any) =>
      String(a.label ?? '').localeCompare(String(b.label ?? ''))
    );
    const data = {
      ...(selected ?? {}),
      disciplines: sorted,
      specializations: selected?.specializations ?? [],
    };
    constructSpecializationOptions(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps omit selection so check/uncheck alone does not retrigger; reruns when disciplineOps / clearBit / flag change
  }, [autoSelectSingleDisciplineSpecialization, disciplineOps, clearBit]);

  const getParentList = (data: any[] = []) => {
    if (!Array.isArray(data) || !data.length) return [];
    const curriculumMap = new Map();
    const specializationMap = new Map();
    filteredCurriculum?.forEach(({ disciplineId, specializationId }) => {
      if (!specializationId) return;
      if (!curriculumMap.has(disciplineId)) {
        curriculumMap.set(disciplineId, new Set());
      }
      curriculumMap.get(disciplineId).add(specializationId);
    });
    specializationOps.forEach(({ disciplineId, id }) => {
      if (!specializationMap.has(disciplineId)) {
        specializationMap.set(disciplineId, new Set());
      }
      specializationMap.get(disciplineId).add(id);
    });
    const selected: any[] = [];
    const remaining: any[] = [];
    data.forEach((disc: any) => {
      if (!disciplineIdSet.has(disc.id)) {
        remaining.push({ ...disc, sectionId: 'other' });
        return;
      }
      const selectedSpc = curriculumMap.get(disc.id) ?? new Set();
      const allSpc = specializationMap.get(disc.id) ?? new Set();

      const remainingSpc = [...allSpc].filter((id) => !selectedSpc.has(id));
      selected.push({
        ...disc,
        children: [...selectedSpc],
        sectionId: 'location',
      });
      if (remainingSpc.length) {
        remaining.push({
          ...disc,
          children: remainingSpc,
          sectionId: 'other',
        });
      }
    });
    return [...selected, ...remaining];
  };

  const hasSelectedDisciplines = Boolean(selected?.disciplines?.length);

  const disciplineDisabledLabel = dscDisabled && disabledTooltip ? disabledTooltip : undefined;

  const specializationDisabledLabel = spclDisabled
    ? (disabledTooltip ?? '')
    : !hasSelectedDisciplines
      ? 'Select discipline(s) to view specializations'
      : '';

  const programDisabledLabel = dscDisabled
    ? (disabledTooltip ?? '')
    : !hasSelectedDisciplines
      ? 'Select discipline(s) to view program type(s)'
      : '';

  return (
    <>
      <div className={`w-full ${wrapperClass}`} id={`${pageId}_discipline_selection_wrapper`}>
        <Select
          multiple={discMultiple}
          defaultValues={discMultiple ? (selected?.disciplines ?? []) : null}
          defaultValue={!discMultiple ? selected?.disciplines?.[0]?.value : null}
          name={disciplineConfig?.label ?? ''}
          options={disciplineOps}
          sendOptionForSingleSelect={true}
          onChange={(e) => {
            const value = discMultiple ? e : e ? [e] : [];
            const sorted = value ? [...value].sort((a, b) => a.label.localeCompare(b.label)) : [];
            const data = { ...selected, disciplines: sorted };
            setSelected(data);
            constructSpecializationOptions(data);
          }}
          onCloseTrigger={onCloseDiscipline}
          reset={reset}
          className={disciplineConfig?.className ?? ''}
          label={disciplineConfig?.label ?? ''}
          searchable={true}
          infoMsg={disciplineInfoMsg}
          prevDefaultData={{
            label: prevDefaultData?.label,
            data: discMultiple
              ? (prevSelected?.disciplines ?? null)
              : (prevSelected?.disciplines?.[0]?.value ?? null),
          }}
          isDisableTextUI={isDisableTextUI}
          optionsContainerClassName={optionsContainerClass}
          required={disciplineConfig?.required ?? false}
          testid={`${pageId}_discipline_selection`}
          id={`${pageId}_discipline_selection`}
          section={
            bifurcateDiscipline && needCompleteListOnFiltering && filteredCurriculum?.length
              ? {
                  location: 'Disciplines associated with selected location(s)',
                  other: 'All other Disciplines',
                }
              : null
          }
          disabled={dscDisabled}
          disabledLabel={disciplineDisabledLabel}
          showMoreProp={showMorePropDsc}
        />
      </div>
      <div className={`w-full ${wrapperClass}`} id={`${pageId}_specialization_selection_wrapper`}>
        <HierarchySelect
          defaultValues={selected?.specializations ?? []}
          prevDefaultData={{
            label: prevDefaultData?.label,
            data: prevSelected?.specializations ?? null,
          }}
          onChange={(e) => {
            const data = { ...selected, specializations: e };
            setSelected(data);
            onSelectChange(data);
          }}
          ariaLabel="Specialization"
          id={`${pageId}_specialization_selection`}
          label={specializationConfig?.label}
          disabled={spclDisabled ? spclDisabled : !selected?.disciplines?.length}
          isDisableTextUI={spclDisabled ? isDisableTextUI : false}
          parentList={
            needCompleteListOnFiltering && filteredCurriculum?.length
              ? getParentList(selected?.disciplines)
              : selected?.disciplines
          }
          childList={specializationOptions}
          className={specializationConfig?.className}
          parentKey="disciplineId"
          multiple={spclMultiple}
          optionsContainerClassName={optionsContainerClass}
          clearBit={clearBit}
          noChildLabel="No Specialization Available"
          disabledLabel={specializationDisabledLabel}
          section={
            needCompleteListOnFiltering && filteredCurriculum?.length
              ? {
                  location: 'Specializations associated with selected location(s)',
                  other: 'All other Specializations',
                }
              : null
          }
          infoMsg={
            !valid?.data?.length ? null : (
              <div className="rounded-md">
                <p className="font-semibold">{infoSpclLabel}</p>
                <ul className="mt-1 list-disc pl-5">
                  {valid?.data?.map((it) => (
                    <li key={it.id ?? it.label}>{it.label}</li>
                  ))}
                </ul>
              </div>
            )
          }
          infoIconClass="h-3 w-3 text-red-600"
          isRequired={
            specializationConfig?.required
              ? selected?.disciplines?.length && !specializationOptions?.length
                ? false
                : true
              : false
          }
          onCloseDropdown={onCloseSpecialization}
          makeNoChildParentsAtLast={specializationConfig?.makeNoChildParentsAtLast}
          showMoreProp={showMorePropSpc}
        />
      </div>
      {hasProgramDropdown && (
        <div className={`w-full ${wrapperClass}`} id={`${pageId}_program_selection_wrapper`}>
          <HierarchySelect
            defaultValues={selectedProgramOptions}
            prevDefaultData={{
              label: prevDefaultData?.label,
              data: prevSelectedPrograms ?? null,
            }}
            onChange={(updatedProgramOptions: ProgramDropdownOption[]) => {
              setSelectedProgramOptions(updatedProgramOptions);
              const nextProgramValid = checkProgramValidation(
                selected?.disciplines ?? [],
                updatedProgramOptions
              );
              setProgramValid(nextProgramValid);
              const nextProgramSelections = toProgramSelections(updatedProgramOptions);
              onProgramChange?.(nextProgramSelections);
            }}
            ariaLabel="Program Type"
            id={`${pageId}_program_selection`}
            label={programConfig?.label ?? 'Program Type'}
            parentList={(selected?.disciplines ?? []).map((discipline: any) => ({
              ...discipline,
              sectionId: 'selected',
            }))}
            childList={programOptions}
            parentKey="disciplineId"
            multiple={true}
            clearBit={clearBit}
            noChildLabel="No Program Type Available"
            disabledLabel={programDisabledLabel}
            isRequired={
              programConfig?.required
                ? selected?.disciplines?.length && !programOptions?.length
                  ? false
                  : true
                : false
            }
            infoMsg={
              !programConfig?.required || !programValid?.data?.length ? null : (
                <div className="rounded-md">
                  <p className="font-semibold">{infoProgramLabel}</p>
                  <ul className="mt-1 list-disc pl-5">
                    {programValid?.data?.map((it: any) => (
                      <li key={it.id ?? it.label}>{it.label}</li>
                    ))}
                  </ul>
                </div>
              )
            }
            infoIconClass="h-3 w-3 text-red-600"
            disabled={dscDisabled ? dscDisabled : !selected?.disciplines?.length}
            className={programConfig?.className ?? ''}
            isDisableTextUI={selected?.disciplines?.length || dscDisabled ? isDisableTextUI : false}
            optionsContainerClassName={optionsContainerClass}
            section={{ selected: 'Program type(s) associated with selected discipline(s)' }}
            makeNoChildParentsAtLast={false}
            treeMode={true}
            childTreeParentKey="treeParentId"
            onlyCountChildOnAccordion={true}
            showMoreProp={showMorePropProgram}
          />
        </div>
      )}
    </>
  );
}
