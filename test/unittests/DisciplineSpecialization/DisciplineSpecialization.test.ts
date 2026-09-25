/**
 * Pure unit tests for DisciplineSpecialization.tsx and HierarchySelect.tsx.
 * No React rendering — exported utility functions only.
 */
import { describe, it, expect } from 'vitest';
import {
  flattenProgramOptions,
  getUniquePrograms,
  buildProgramTree,
  toProgramDropdownOptions,
  applySingleOptionAutoSelect,
} from '../../../libs/ui/components/common/Form/components/DisciplineSpecialization/DisciplineSpecialization';
import {
  buildChildrenByParentMap,
  collectDescendantIdsFromTreeParentMap,
  getProgramCount,
  collectAncestorNodes,
  isTreeLinkageEnabled,
} from '../../../libs/ui/components/common/Form/components/DisciplineSpecialization/HierarchySelect';

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------
const makeProgram = (
  id: string,
  parentId: string | null = null,
  disciplineId?: string,
  children: any[] = []
) => ({
  id,
  label: `Label ${id}`,
  value: id,
  parentId,
  ...(disciplineId ? { disciplineId } : {}),
  ...(children.length ? { children } : {}),
});

// ---------------------------------------------------------------------------
// flattenProgramOptions
// ---------------------------------------------------------------------------
describe('flattenProgramOptions', () => {
  it('returns an empty array for empty input', () => {
    expect(flattenProgramOptions([])).toEqual([]);
    expect(flattenProgramOptions()).toEqual([]);
  });

  it('flattens a single root program with no children', () => {
    const result = flattenProgramOptions([makeProgram('p1', null, 'd1')]);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('p1');
    expect(result[0].isParent).toBe(true);
    expect(result[0].isChild).toBe(false);
  });

  it('flattens nested children into a single-level array', () => {
    const child = makeProgram('c1', 'p1');
    const root = makeProgram('p1', null, 'd1', [child]);
    const result = flattenProgramOptions([root]);
    expect(result).toHaveLength(2);
    expect(result.map((r) => r.id)).toEqual(['p1', 'c1']);
  });

  it('marks children with isChild: true and isParent: false', () => {
    const child = makeProgram('c1', 'p1');
    const root = makeProgram('p1', null, 'd1', [child]);
    const result = flattenProgramOptions([root]);
    const childResult = result.find((r) => r.id === 'c1')!;
    expect(childResult.isParent).toBe(false);
    expect(childResult.isChild).toBe(true);
  });

  it('inherits disciplineId from parent when child has none', () => {
    const child = makeProgram('c1', 'p1'); // no disciplineId
    const root = makeProgram('p1', null, 'd1', [child]);
    const result = flattenProgramOptions([root]);
    expect(result.find((r) => r.id === 'c1')!.disciplineId).toBe('d1');
  });

  it('preserves explicit disciplineId on a child over the inherited one', () => {
    const child = { ...makeProgram('c1', 'p1'), disciplineId: 'd2' };
    const root = makeProgram('p1', null, 'd1', [child]);
    const result = flattenProgramOptions([root]);
    expect(result.find((r) => r.id === 'c1')!.disciplineId).toBe('d2');
  });

  it('uses the inheritedDisciplineId argument when no disciplineId on root', () => {
    const root = makeProgram('p1', null); // no disciplineId
    const result = flattenProgramOptions([root], 'inherited-d');
    expect(result[0].disciplineId).toBe('inherited-d');
  });

  it('flattens deeply nested hierarchies', () => {
    const grandchild = makeProgram('gc1', 'c1');
    const child = makeProgram('c1', 'p1', undefined, [grandchild]);
    const root = makeProgram('p1', null, 'd1', [child]);
    const result = flattenProgramOptions([root]);
    expect(result).toHaveLength(3);
    expect(result.map((r) => r.id)).toEqual(['p1', 'c1', 'gc1']);
  });
});

// ---------------------------------------------------------------------------
// getUniquePrograms
// ---------------------------------------------------------------------------
describe('getUniquePrograms', () => {
  it('returns an empty array for empty input', () => {
    expect(getUniquePrograms([])).toEqual([]);
  });

  it('deduplicates programs with the same id and parentId', () => {
    const p = makeProgram('p1', null, 'd1');
    const result = getUniquePrograms([p, p]);
    expect(result).toHaveLength(1);
  });

  it('keeps two programs with the same id but different parentId', () => {
    const a = makeProgram('p1', null, 'd1');
    const b = makeProgram('p1', 'parent', 'd1');
    const result = getUniquePrograms([a, b]);
    expect(result).toHaveLength(2);
  });

  it('resets children to an empty array on each entry', () => {
    const child = makeProgram('c1', 'p1');
    const root = makeProgram('p1', null, 'd1', [child]);
    const result = getUniquePrograms([root]);
    expect(result[0].children).toEqual([]);
  });

  it('sets isParent and isChild based on parentId', () => {
    const root = makeProgram('p1', null, 'd1');
    const child = makeProgram('c1', 'p1', 'd1');
    const result = getUniquePrograms([root, child]);
    expect(result.find((r) => r.id === 'p1')!.isParent).toBe(true);
    expect(result.find((r) => r.id === 'c1')!.isChild).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// buildProgramTree
// ---------------------------------------------------------------------------
describe('buildProgramTree', () => {
  it('returns an empty array for empty input', () => {
    expect(buildProgramTree([])).toEqual([]);
  });

  it('returns a single root node when input has no parent-child relationships', () => {
    const result = buildProgramTree([makeProgram('p1', null, 'd1')]);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('p1');
    expect(result[0].children).toHaveLength(0);
  });

  it('nests children under their parent', () => {
    const programs = [makeProgram('p1', null, 'd1'), makeProgram('c1', 'p1', 'd1')];
    const result = buildProgramTree(programs);
    expect(result).toHaveLength(1);
    expect(result[0].children).toHaveLength(1);
    expect(result[0].children![0].id).toBe('c1');
  });

  it('handles multiple root programs', () => {
    const programs = [makeProgram('p1', null, 'd1'), makeProgram('p2', null, 'd1')];
    const result = buildProgramTree(programs);
    expect(result).toHaveLength(2);
  });

  it('builds a multi-level tree', () => {
    const grandchild = makeProgram('gc1', 'c1', 'd1');
    const child = makeProgram('c1', 'p1', 'd1');
    const root = makeProgram('p1', null, 'd1');
    const result = buildProgramTree([root, child, grandchild]);
    expect(result[0].children![0].children).toHaveLength(1);
    expect(result[0].children![0].children![0].id).toBe('gc1');
  });

  it('isolates programs from different disciplines into separate trees', () => {
    const programs = [makeProgram('p1', null, 'd1'), makeProgram('p2', null, 'd2')];
    const result = buildProgramTree(programs);
    // Each discipline produces its own root
    expect(result).toHaveLength(2);
  });
});

// ---------------------------------------------------------------------------
// toProgramDropdownOptions
// ---------------------------------------------------------------------------
describe('toProgramDropdownOptions', () => {
  it('returns an empty array for empty input', () => {
    expect(toProgramDropdownOptions([])).toEqual([]);
  });

  it('produces one entry per program node', () => {
    const programs = [makeProgram('p1', null, 'd1'), makeProgram('c1', 'p1', 'd1')];
    const result = toProgramDropdownOptions(programs);
    expect(result).toHaveLength(2);
  });

  it('marks root nodes with isRoot: true', () => {
    const result = toProgramDropdownOptions([makeProgram('p1', null, 'd1')]);
    expect(result[0].isRoot).toBe(true);
  });

  it('marks child nodes with isRoot: false', () => {
    const programs = [makeProgram('p1', null, 'd1'), makeProgram('c1', 'p1', 'd1')];
    const result = toProgramDropdownOptions(programs);
    expect(result.find((r) => r.programId === 'c1')!.isRoot).toBe(false);
  });

  it('sets rootProgramId to the root id for all nodes in the same tree', () => {
    const programs = [makeProgram('p1', null, 'd1'), makeProgram('c1', 'p1', 'd1')];
    const result = toProgramDropdownOptions(programs);
    expect(result.every((r) => r.rootProgramId === 'p1')).toBe(true);
  });

  it('sets treeParentId to null for root nodes', () => {
    const result = toProgramDropdownOptions([makeProgram('p1', null, 'd1')]);
    expect(result[0].treeParentId).toBeNull();
  });

  it('sets treeParentId with disciplineId prefix for child nodes', () => {
    const programs = [makeProgram('p1', null, 'd1'), makeProgram('c1', 'p1', 'd1')];
    const result = toProgramDropdownOptions(programs);
    const child = result.find((r) => r.programId === 'c1')!;
    expect(child.treeParentId).toBe('d1::p1');
  });

  it('composes id as "disciplineId::programId"', () => {
    const result = toProgramDropdownOptions([makeProgram('p1', null, 'd1')]);
    expect(result[0].id).toBe('d1::p1');
  });
});

// ---------------------------------------------------------------------------
// applySingleOptionAutoSelect
// ---------------------------------------------------------------------------
describe('applySingleOptionAutoSelect', () => {
  const makeDropdownOption = (
    id: string,
    disciplineId: string,
    programId: string,
    isRoot = true,
    parentProgramId: string | null = null,
    rootProgramId = programId
  ) => ({
    id,
    label: `Label ${id}`,
    value: id,
    disciplineId,
    programId,
    rootProgramId,
    parentProgramId,
    treeParentId: parentProgramId ? `${disciplineId}::${parentProgramId}` : null,
    isRoot,
  });

  it('returns selected unchanged when all disciplines already have a selection', () => {
    const opt = makeDropdownOption('d1::p1', 'd1', 'p1');
    const result = applySingleOptionAutoSelect([opt], new Set(['d1']), [opt]);
    expect(result).toHaveLength(1);
  });

  it('auto-selects when only one option exists for an unselected discipline', () => {
    const opt = makeDropdownOption('d1::p1', 'd1', 'p1');
    const result = applySingleOptionAutoSelect([], new Set(['d1']), [opt]);
    expect(result).toContainEqual(opt);
  });

  it('does not auto-select when multiple options exist for a discipline', () => {
    const opt1 = makeDropdownOption('d1::p1', 'd1', 'p1');
    const opt2 = makeDropdownOption('d1::p2', 'd1', 'p2');
    const result = applySingleOptionAutoSelect([], new Set(['d1']), [opt1, opt2]);
    expect(result).toHaveLength(0);
  });

  it('auto-selects root + sole child when single root has exactly one child', () => {
    const root = makeDropdownOption('d1::root', 'd1', 'root', true, null, 'root');
    const child = makeDropdownOption('d1::child', 'd1', 'child', false, 'root', 'root');
    const result = applySingleOptionAutoSelect([], new Set(['d1']), [root, child]);
    expect(result).toHaveLength(2);
  });

  it('does not auto-select root when it has more than one child', () => {
    const root = makeDropdownOption('d1::root', 'd1', 'root', true, null, 'root');
    const child1 = makeDropdownOption('d1::c1', 'd1', 'c1', false, 'root', 'root');
    const child2 = makeDropdownOption('d1::c2', 'd1', 'c2', false, 'root', 'root');
    const result = applySingleOptionAutoSelect([], new Set(['d1']), [root, child1, child2]);
    expect(result).toHaveLength(0);
  });

  it('handles multiple disciplines independently', () => {
    const optD1 = makeDropdownOption('d1::p1', 'd1', 'p1');
    const optD2a = makeDropdownOption('d2::p2', 'd2', 'p2');
    const optD2b = makeDropdownOption('d2::p3', 'd2', 'p3');
    // d1 has one option → auto-select; d2 has two options → no auto-select
    const result = applySingleOptionAutoSelect([], new Set(['d1', 'd2']), [optD1, optD2a, optD2b]);
    expect(result).toContainEqual(optD1);
    expect(result).not.toContainEqual(optD2a);
    expect(result).not.toContainEqual(optD2b);
  });
});

// ---------------------------------------------------------------------------
// buildChildrenByParentMap (HierarchySelect)
// ---------------------------------------------------------------------------
describe('buildChildrenByParentMap', () => {
  it('returns an empty map for empty input', () => {
    expect(buildChildrenByParentMap([], 'parentId').size).toBe(0);
  });

  it('groups children under their parent id', () => {
    const items = [
      { id: 'c1', parentId: 'p1' },
      { id: 'c2', parentId: 'p1' },
      { id: 'c3', parentId: 'p2' },
    ];
    const map = buildChildrenByParentMap(items, 'parentId');
    expect(map.get('p1')).toHaveLength(2);
    expect(map.get('p2')).toHaveLength(1);
  });

  it('ignores items that lack the parent field', () => {
    const items = [{ id: 'root' }, { id: 'c1', parentId: 'root' }];
    const map = buildChildrenByParentMap(items, 'parentId');
    expect(map.size).toBe(1);
    expect(map.get('root')).toHaveLength(1);
  });

  it('works with custom parent field names', () => {
    const items = [{ id: 'c1', treeParentId: 'p1' }];
    const map = buildChildrenByParentMap(items, 'treeParentId');
    expect(map.get('p1')).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// collectDescendantIdsFromTreeParentMap (HierarchySelect)
// ---------------------------------------------------------------------------
describe('collectDescendantIdsFromTreeParentMap', () => {
  it('returns an empty set when the node has no children', () => {
    const map = new Map();
    expect(collectDescendantIdsFromTreeParentMap('p1', map).size).toBe(0);
  });

  it('collects direct children', () => {
    const map = new Map([['p1', [{ id: 'c1' }, { id: 'c2' }]]]);
    const ids = collectDescendantIdsFromTreeParentMap('p1', map);
    expect(ids).toContain('c1');
    expect(ids).toContain('c2');
  });

  it('collects grandchildren recursively', () => {
    const map = new Map([
      ['p1', [{ id: 'c1' }]],
      ['c1', [{ id: 'gc1' }]],
    ]);
    const ids = collectDescendantIdsFromTreeParentMap('p1', map);
    expect(ids).toContain('c1');
    expect(ids).toContain('gc1');
  });

  it('does not include the nodeId itself', () => {
    const map = new Map([['p1', [{ id: 'c1' }]]]);
    const ids = collectDescendantIdsFromTreeParentMap('p1', map);
    expect(ids.has('p1')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// getProgramCount (HierarchySelect)
// ---------------------------------------------------------------------------
describe('getProgramCount', () => {
  it('returns 0 for an empty array', () => {
    expect(getProgramCount([])).toBe(0);
  });

  it('counts non-root items directly', () => {
    const items = [
      { isRoot: false, programId: 'c1', parentProgramId: 'p1' },
      { isRoot: false, programId: 'c2', parentProgramId: 'p1' },
    ];
    expect(getProgramCount(items)).toBe(2);
  });

  it('counts a root item as 1 when it has no children in the list', () => {
    const items = [{ isRoot: true, programId: 'p1', parentProgramId: null }];
    expect(getProgramCount(items)).toBe(1);
  });

  it('counts a root item as 0 when it has children in the list', () => {
    const items = [
      { isRoot: true, programId: 'p1', parentProgramId: null },
      { isRoot: false, programId: 'c1', parentProgramId: 'p1' },
    ];
    // root has children → root contributes 0; child contributes 1
    expect(getProgramCount(items)).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// collectAncestorNodes (HierarchySelect)
// ---------------------------------------------------------------------------
describe('collectAncestorNodes', () => {
  it('returns an empty array when the node has no parent', () => {
    const optionById = new Map([['p1', { id: 'p1', parentId: null }]]);
    const node = { id: 'p1', parentId: null };
    expect(collectAncestorNodes(node, optionById, 'parentId')).toEqual([]);
  });

  it('returns the direct parent', () => {
    const parent = { id: 'p1', parentId: null };
    const child = { id: 'c1', parentId: 'p1' };
    const optionById = new Map([
      ['p1', parent],
      ['c1', child],
    ]);
    const result = collectAncestorNodes(child, optionById, 'parentId');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('p1');
  });

  it('walks the full ancestor chain', () => {
    const gp = { id: 'gp', parentId: null };
    const p = { id: 'p', parentId: 'gp' };
    const c = { id: 'c', parentId: 'p' };
    const optionById = new Map([
      ['gp', gp],
      ['p', p],
      ['c', c],
    ]);
    const result = collectAncestorNodes(c, optionById, 'parentId');
    expect(result.map((n) => n.id)).toEqual(['p', 'gp']);
  });

  it('stops when a parent id is not found in the map', () => {
    const c = { id: 'c', parentId: 'missing' };
    const optionById = new Map([['c', c]]);
    const result = collectAncestorNodes(c, optionById, 'parentId');
    expect(result).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// isTreeLinkageEnabled (HierarchySelect)
// ---------------------------------------------------------------------------
describe('isTreeLinkageEnabled', () => {
  it('returns false when treeMode is false', () => {
    expect(isTreeLinkageEnabled(false, 'parentId')).toBe(false);
  });

  it('returns false when treeMode is undefined', () => {
    expect(isTreeLinkageEnabled(undefined, 'parentId')).toBe(false);
  });

  it('returns false when childTreeParentKey is undefined', () => {
    expect(isTreeLinkageEnabled(true, undefined)).toBe(false);
  });

  it('returns false when childTreeParentKey is null', () => {
    expect(isTreeLinkageEnabled(true, null as any)).toBe(false);
  });

  it('returns false when childTreeParentKey is an empty string', () => {
    expect(isTreeLinkageEnabled(true, '')).toBe(false);
  });

  it('returns true when treeMode is true and childTreeParentKey is a non-empty string', () => {
    expect(isTreeLinkageEnabled(true, 'treeParentId')).toBe(true);
  });
});
