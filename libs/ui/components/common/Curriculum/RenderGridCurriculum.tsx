/* eslint-disable @typescript-eslint/explicit-function-return-type */
'use client';

import ReactDOM from 'react-dom';
import React, { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface Discipline {
  id: string;
  label: string;
  value: string;
}

interface Specialization {
  id: string;
  label: string;
  value: string;
  disciplineId: string;
}

interface CurriculumItem {
  disciplineId: string;
  specializationId: string;
}

interface RenderGridCurriculumProps {
  disciplines: Discipline[];
  specializations: Specialization[];
  curriculum: CurriculumItem[];
  disciplineLabelClass: string;
}

const RenderGridCurriculum = ({
  disciplines,
  specializations,
  curriculum,
  disciplineLabelClass = '',
}: RenderGridCurriculumProps) => {
  const [open, setOpen] = useState(false);

  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0, openAbove: false });

  const buttonRef = useRef<HTMLButtonElement>(null);

  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [open]);

  if (!curriculum?.length) return null;

  const grouped = curriculum.reduce<Record<string, string[]>>((acc, item) => {
    if (!acc[item.disciplineId]) acc[item.disciplineId] = [];
    acc[item.disciplineId].push(item.specializationId);
    return acc;
  }, {});

  const disciplineIds = Object.keys(grouped);

  const firstDisciplineId = disciplineIds[0];

  const firstDiscipline = disciplines?.find((d) => d.id === firstDisciplineId);

  const firstSpecId = grouped[firstDisciplineId]?.[0];

  const firstSpec = specializations?.find((s) => s.id === firstSpecId);

  const extraSpecsInFirstDiscipline = grouped[firstDisciplineId].length - 1;

  const hasMore = curriculum.length > 1;

  const handleViewMore = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const popoverHeight = 320; // max-h-75 (300px) + header + padding
      const spaceBelow = window.innerHeight - rect.bottom;
      const openAbove = spaceBelow < popoverHeight;

      setPopoverPos({
        top: openAbove ? rect.top - 6 : rect.bottom + 6,
        left: rect.left,
        openAbove,
      });
    }
    setOpen((prev) => !prev);
  };

  const popover = open
    ? ReactDOM.createPortal(
        <div
          ref={popoverRef}
          className="bg-card fixed z-9999 rounded-lg border border-gray-200 shadow-lg"
          style={{
            top: popoverPos.top,
            left: popoverPos.left,
            transform: popoverPos.openAbove ? 'translateY(-100%)' : undefined,
          }}
        >
          <div className="w-55">
            <div className="border-b p-3">
              <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Discipline & Specializations
              </p>
            </div>

            <div className="flex max-h-75 flex-col overflow-y-auto p-3">
              {disciplineIds.map((disciplineId) => {
                const discipline = disciplines?.find((d) => d.id === disciplineId);
                const specs = grouped[disciplineId]
                  .map((sId) => specializations?.find((s) => s.id === sId))
                  .filter(Boolean);

                return (
                  <div
                    key={disciplineId}
                    className="mb-3 border-b pb-2 last:mb-0 last:border-b-0 last:pb-0"
                  >
                    <p className="text-xs text-gray-500">Discipline</p>
                    <p className="text-sm font-semibold wrap-break-word">
                      {discipline?.label ?? ''}
                    </p>
                    {specs.length > 0 && (
                      <>
                        <p className="mt-1 text-xs text-gray-500">Specializations</p>
                        <ul className="mt-0.5 space-y-0.5 pl-3">
                          {specs.map((spec) => (
                            <li
                              key={spec?.id}
                              className="list-disc text-sm wrap-break-word marker:text-xs marker:text-gray-500"
                            >
                              {spec?.label}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <div className="flex flex-col gap-0.5">
      <span className={twMerge('text-sm font-medium', disciplineLabelClass)}>
        {firstDiscipline?.label ?? ''}
      </span>

      <div className="flex items-center gap-1">
        <span className="line-clamp-1 text-xs break-all text-gray-500">
          {firstSpec?.label ?? ''}
        </span>

        {extraSpecsInFirstDiscipline > 0 && (
          <span className="shrink-0 text-xs font-semibold text-gray-500">
            +{extraSpecsInFirstDiscipline}
          </span>
        )}
      </div>

      {hasMore && (
        <button
          ref={buttonRef}
          onClick={handleViewMore}
          className="text-primary w-fit cursor-pointer text-xs font-semibold hover:underline"
        >
          Show more
        </button>
      )}

      {popover}
    </div>
  );
};

export default RenderGridCurriculum;
