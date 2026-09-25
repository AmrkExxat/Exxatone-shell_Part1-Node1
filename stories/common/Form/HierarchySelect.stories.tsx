import { useState } from 'react';
import { type Meta, type StoryObj } from '@storybook/nextjs';

import HierarchySelect from '../../../libs/ui/components/common/Form/components/DisciplineSpecialization/HierarchySelect';
import { ThemeDecorator } from '../../ThemeDecorator';

const meta: Meta<typeof HierarchySelect> = {
  title: 'Form/HierarchySelect',
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'fullScreen',
  },
  component: HierarchySelect,
  argTypes: {},
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof HierarchySelect>;

const parentList = [
  { id: 'pt', label: 'Physical Therapy', value: 'physical_therapy' },
  { id: 'ot', label: 'Occupational Therapy', value: 'occupational_therapy' },
  { id: 'slp', label: 'Speech-Language Pathology', value: 'speech_language_pathology' },
  { id: 'rt', label: 'Respiratory Therapy', value: 'respiratory_therapy' },
];

// childList with sub-tree nesting via `specParentId`:
//   Disciplines (parentList) → Specializations → Programs (leaf)
const childList = [
  // Physical Therapy
  {
    id: 'pt-ortho',
    label: 'Orthopedic PT',
    value: 'ortho_pt',
    disciplineId: 'pt',
    specParentId: null,
    isRoot: true,
  },
  {
    id: 'pt-ortho-sports',
    label: 'Sports Medicine',
    value: 'sports_medicine',
    disciplineId: 'pt',
    specParentId: 'pt-ortho',
  },
  {
    id: 'pt-ortho-sports-abc',
    label: 'Sports Not',
    value: 'sports_not',
    disciplineId: 'pt',
    specParentId: 'pt-ortho',
  },
  {
    id: 'pt-ortho-spine',
    label: 'Spine Rehabilitation',
    value: 'spine_rehab',
    disciplineId: 'pt',
    specParentId: 'pt-ortho',
  },
  {
    id: 'pt-neuro',
    label: 'Neurological PT',
    value: 'neuro_pt',
    disciplineId: 'pt',
    specParentId: null,
  },
  {
    id: 'pt-neuro-stroke',
    label: 'Stroke Rehab',
    value: 'stroke_rehab',
    disciplineId: 'pt',
    specParentId: 'pt-neuro',
  },
  {
    id: 'pt-neuro-park',
    label: "Parkinson's Care",
    value: 'parkinsons_care',
    disciplineId: 'pt',
    specParentId: 'pt-neuro',
  },
  {
    id: 'pt-cardio',
    label: 'Cardiopulmonary PT',
    value: 'cardio_pt',
    disciplineId: 'pt',
    specParentId: null,
  },

  // Occupational Therapy
  {
    id: 'ot-peds',
    label: 'Pediatric OT',
    value: 'peds_ot',
    disciplineId: 'ot',
    specParentId: null,
  },
  {
    id: 'ot-peds-sensory',
    label: 'Sensory Integration',
    value: 'sensory_integration',
    disciplineId: 'ot',
    specParentId: 'ot-peds',
  },
  {
    id: 'ot-peds-motor',
    label: 'Fine Motor Skills',
    value: 'fine_motor',
    disciplineId: 'ot',
    specParentId: 'ot-peds',
  },
  {
    id: 'ot-hand',
    label: 'Hand Therapy',
    value: 'hand_ot',
    disciplineId: 'ot',
    specParentId: null,
  },

  // Speech-Language Pathology
  {
    id: 'slp-adult',
    label: 'Adult SLP',
    value: 'adult_slp',
    disciplineId: 'slp',
    specParentId: null,
  },
  {
    id: 'slp-adult-aphasia',
    label: 'Aphasia',
    value: 'aphasia',
    disciplineId: 'slp',
    specParentId: 'slp-adult',
  },
  {
    id: 'slp-adult-dysphagia',
    label: 'Dysphagia',
    value: 'dysphagia',
    disciplineId: 'slp',
    specParentId: 'slp-adult',
  },
  {
    id: 'slp-peds',
    label: 'Pediatric SLP',
    value: 'peds_slp',
    disciplineId: 'slp',
    specParentId: null,
  },
  {
    id: 'slp-peds-early',
    label: 'Early Intervention',
    value: 'early_intervention',
    disciplineId: 'slp',
    specParentId: 'slp-peds',
  },
  {
    id: 'slp-peds-school',
    label: 'School-Age',
    value: 'school_age',
    disciplineId: 'slp',
    specParentId: 'slp-peds',
  },

  // Respiratory Therapy (flat, no sub-tree)
  {
    id: 'rt-neonatal',
    label: 'Neonatal RT',
    value: 'neonatal_rt',
    disciplineId: 'rt',
    specParentId: null,
  },
  {
    id: 'rt-critical',
    label: 'Critical Care RT',
    value: 'critical_rt',
    disciplineId: 'rt',
    specParentId: null,
  },
];

export const Default: Story = {
  args: {
    id: 'hierarchy-select-default',
    label: 'Discipline / Specialization',
    isRequired: true,
    treeMode: true,
    childTreeParentKey: 'specParentId',
    parentKey: 'disciplineId',
    parentList,
    childList,
    onlyCountChildOnAccordion: true,
    makeNoChildParentsAtLast: true,
    onChange: (value) => {
      console.log('onChange', value);
    },
  },
};

export const WithDefaultValues: Story = {
  args: {
    id: 'hierarchy-select-preselected',
    label: 'Discipline / Specialization',
    isRequired: true,
    treeMode: true,
    childTreeParentKey: 'specParentId',
    parentKey: 'disciplineId',
    parentList,
    childList,
    makeNoChildParentsAtLast: true,
    defaultValues: [
      {
        id: 'pt-ortho',
        label: 'Orthopedic PT',
        value: 'ortho_pt',
        disciplineId: 'pt',
        specParentId: null,
        isRoot: true,
      },
      {
        id: 'pt-ortho-sports',
        label: 'Sports Medicine',
        value: 'sports_medicine',
        disciplineId: 'pt',
        specParentId: 'pt-ortho',
      },
      {
        id: 'slp-peds',
        label: 'Pediatric SLP',
        value: 'peds_slp',
        disciplineId: 'slp',
        specParentId: null,
      },
      {
        id: 'slp-peds-early',
        label: 'Early Intervention',
        value: 'early_intervention',
        disciplineId: 'slp',
        specParentId: 'slp-peds',
      },
      {
        id: 'slp-peds-school',
        label: 'School-Age',
        value: 'school_age',
        disciplineId: 'slp',
        specParentId: 'slp-peds',
      },
    ],
    onChange: (value) => {
      console.log('onChange', value);
    },
  },
};

export const Disabled: Story = {
  args: {
    id: 'hierarchy-select-disabled',
    label: 'Discipline / Specialization',
    isRequired: false,
    treeMode: true,
    childTreeParentKey: 'specParentId',
    disabled: true,
    parentKey: 'disciplineId',
    parentList,
    childList,
    makeNoChildParentsAtLast: true,
    defaultValues: [
      {
        id: 'ot-peds',
        label: 'Pediatric OT',
        value: 'peds_ot',
        disciplineId: 'ot',
        specParentId: null,
      },
      {
        id: 'ot-peds-sensory',
        label: 'Sensory Integration',
        value: 'sensory_integration',
        disciplineId: 'ot',
        specParentId: 'ot-peds',
      },
      {
        id: 'ot-hand',
        label: 'Hand Therapy',
        value: 'hand_ot',
        disciplineId: 'ot',
        specParentId: null,
      },
    ],
  },
};

export const DisabledTextUI: Story = {
  args: {
    id: 'hierarchy-select-disabled-text',
    label: 'Discipline / Specialization',
    isRequired: false,
    treeMode: true,
    childTreeParentKey: 'specParentId',
    disabled: true,
    isDisableTextUI: true,
    parentKey: 'disciplineId',
    parentList,
    childList,
    makeNoChildParentsAtLast: true,
    defaultValues: [
      {
        id: 'pt-neuro',
        label: 'Neurological PT',
        value: 'neuro_pt',
        disciplineId: 'pt',
        specParentId: null,
      },
      {
        id: 'pt-neuro-stroke',
        label: 'Stroke Rehab',
        value: 'stroke_rehab',
        disciplineId: 'pt',
        specParentId: 'pt-neuro',
      },
      {
        id: 'pt-neuro-park',
        label: "Parkinson's Care",
        value: 'parkinsons_care',
        disciplineId: 'pt',
        specParentId: 'pt-neuro',
      },
      {
        id: 'ot-hand',
        label: 'Hand Therapy',
        value: 'hand_ot',
        disciplineId: 'ot',
        specParentId: null,
      },
    ],
  },
};

export const WithClearControl: Story = {
  render: () => {
    const [clearBit, setClearBit] = useState(0);
    const [selected, setSelected] = useState<any[]>([
      {
        id: 'pt-ortho',
        label: 'Orthopedic PT',
        value: 'ortho_pt',
        disciplineId: 'pt',
        specParentId: null,
        isRoot: true,
      },
      {
        id: 'pt-ortho-spine',
        label: 'Spine Rehabilitation',
        value: 'spine_rehab',
        disciplineId: 'pt',
        specParentId: 'pt-ortho',
      },
      {
        id: 'slp-adult-aphasia',
        label: 'Aphasia',
        value: 'aphasia',
        disciplineId: 'slp',
        specParentId: 'slp-adult',
      },
    ]);

    return (
      <div className="flex flex-col gap-4">
        <HierarchySelect
          id="hierarchy-select-clear"
          label="Discipline / Specialization"
          isRequired={true}
          treeMode={true}
          childTreeParentKey="specParentId"
          parentKey="disciplineId"
          parentList={parentList}
          childList={childList}
          makeNoChildParentsAtLast={true}
          defaultValues={selected}
          clearBit={clearBit}
          onlyCountChildOnAccordion={true}
          onChange={(value) => {
            setSelected(value);
            console.log('onChange', value);
          }}
        />
        <button
          type="button"
          className="w-fit rounded-md bg-red-500 px-3 py-1.5 text-sm text-white"
          onClick={() => setClearBit((n) => n + 1)}
        >
          Clear Selection
        </button>
      </div>
    );
  },
};
