import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronDown, ChevronUp, GraduationCap, Search, X } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { PARTNER_CATEGORY_OPTIONS } from '../../config/schoolPartners';
import { Sheet, SheetContent, SheetTitle } from '../../components/ui/sheet';
import { partnersDrawer, partnersFont } from './partnersTypography';

/** Programs available to link (mock — replace with API). */
const PROGRAM_SEARCH_OPTIONS = [
  'ABC University - Nursing',
  'California State University, Bakersfield',
  'Central City College',
  'De Homecaremo',
  'Demo School TJU',
  'Eastwood State University',
  'Exxat-QA-PT',
  'SB University of California',
  'Utopia College',
] as const;

interface AddProgramPartnerSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddProgramPartnerSheet({ open, onOpenChange }: AddProgramPartnerSheetProps) {
  const [program, setProgram] = useState<string | null>(null);
  const [programPanelOpen, setProgramPanelOpen] = useState(false);
  const [programSearch, setProgramSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categoryPanelOpen, setCategoryPanelOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setProgram(null);
      setProgramPanelOpen(false);
      setProgramSearch('');
      setCategory('');
      setCategoryPanelOpen(false);
    }
  }, [open]);

  const programResults = useMemo(() => {
    const q = programSearch.trim().toLowerCase();
    if (q.length < 3) return [...PROGRAM_SEARCH_OPTIONS];
    return PROGRAM_SEARCH_OPTIONS.filter((name) => name.toLowerCase().includes(q));
  }, [programSearch]);

  const canSave = Boolean(program && category.trim());

  const handleSave = () => {
    if (!canSave) return;
    console.log('Add partner stub', { program, category });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className={`${partnersFont} ${partnersDrawer.sheet}`}>
        <SheetTitle className="sr-only">Add Program Partner</SheetTitle>

        <div className={partnersDrawer.header}>
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className={partnersDrawer.closeBtn}
              aria-label="Close"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
            <h2 className={`${partnersDrawer.title} truncate`}>Add Program Partner</h2>
          </div>
          <div className={partnersDrawer.addHeaderActions}>
            <button
              type="button"
              className={partnersDrawer.requestProgramBtn}
              onClick={() => console.log('Request to add new program stub')}
            >
              Request to add new program
            </button>
            <button
              type="button"
              disabled={!canSave}
              className={partnersDrawer.updateBtn}
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>

        <div className={partnersDrawer.bodyScroll}>
          <div className="flex flex-col gap-4">
            <div className={partnersDrawer.formCard}>
              <p className={partnersDrawer.sectionLabelMuted}>Program Name</p>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setCategoryPanelOpen(false);
                    setProgramPanelOpen((v) => !v);
                  }}
                  className={partnersDrawer.selectTrigger}
                  aria-expanded={programPanelOpen}
                  aria-haspopup="listbox"
                >
                  <span className="flex min-w-0 flex-1 items-center gap-2">
                    <GraduationCap className="size-4 shrink-0 text-[#3f51b5]" strokeWidth={1.75} />
                    <span
                      className={`truncate ${program ? 'text-[14px] font-normal leading-5 text-[#111827]' : partnersDrawer.selectValue}`}
                    >
                      {program ?? 'Select Program'}
                    </span>
                  </span>
                  {programPanelOpen ? (
                    <ChevronUp className={partnersDrawer.selectChevron} strokeWidth={2} />
                  ) : (
                    <ChevronDown className={partnersDrawer.selectChevron} strokeWidth={2} />
                  )}
                </button>

                {programPanelOpen && (
                  <div className={partnersDrawer.dropdownPanel} role="dialog" aria-label="Select program">
                    <div className="border-b border-[#e5e7eb] px-3 py-2">
                      <p className="text-[14px] font-semibold leading-5 text-[#111827]">
                        Select Program
                      </p>
                      <p className="text-[12px] font-normal leading-4 text-[#757575]">
                        Type at least 3 characters to search
                      </p>
                    </div>
                    <div className="p-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
                        <Input
                          value={programSearch}
                          onChange={(e) => setProgramSearch(e.target.value)}
                          placeholder="Search Program"
                          className="h-[38px] border-[#3f51b5] pl-9 text-[14px] focus-visible:ring-[#3f51b5]"
                          autoFocus
                        />
                      </div>
                    </div>
                    <ul
                      className="max-h-[280px] overflow-y-auto overscroll-contain border-t border-[#e5e7eb]"
                      role="listbox"
                    >
                      {programSearch.trim().length >= 3 && programResults.length === 0 ? (
                        <li className="px-3 py-4 text-center text-[13px] text-[#757575]">
                          No programs found
                        </li>
                      ) : (
                        programResults.map((name) => {
                          const selected = program === name;
                          return (
                            <li key={name}>
                              <button
                                type="button"
                                role="option"
                                aria-selected={selected}
                                onClick={() => {
                                  setProgram(name);
                                  setProgramPanelOpen(false);
                                }}
                                className={`flex w-full px-3 py-2.5 text-left hover:bg-[#f5f5f5] ${
                                  selected ? 'bg-[#fafafa]' : ''
                                }`}
                              >
                                <span
                                  className={
                                    selected
                                      ? partnersDrawer.optionSelected
                                      : partnersDrawer.optionDefault
                                  }
                                >
                                  {name}
                                </span>
                              </button>
                            </li>
                          );
                        })
                      )}
                    </ul>
                    <div className={partnersDrawer.dropdownFooter}>
                      <button
                        type="button"
                        className="text-[14px] font-normal leading-5 text-[#155dfc] hover:underline disabled:opacity-40"
                        disabled={!program}
                        onClick={() => setProgram(null)}
                      >
                        Clear Selection
                      </button>
                      <button
                        type="button"
                        className="text-[14px] font-normal leading-5 text-[#155dfc] hover:underline"
                        onClick={() => setProgramPanelOpen(false)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={`${partnersDrawer.formCard} relative`}>
              <p className={`${partnersDrawer.categoryLabel} mb-1`}>Partner Category</p>
              <button
                type="button"
                onClick={() => {
                  setProgramPanelOpen(false);
                  setCategoryPanelOpen((v) => !v);
                }}
                className={partnersDrawer.selectTrigger}
                aria-expanded={categoryPanelOpen}
                aria-haspopup="listbox"
              >
                <span className={partnersDrawer.selectValue}>
                  {category || 'Please select an option'}
                </span>
                {categoryPanelOpen ? (
                  <ChevronUp className={partnersDrawer.selectChevron} strokeWidth={2} />
                ) : (
                  <ChevronDown className={partnersDrawer.selectChevron} strokeWidth={2} />
                )}
              </button>

              {categoryPanelOpen && (
                <div
                  role="listbox"
                  className={`${partnersDrawer.dropdownPanel} max-h-[320px] overflow-y-auto`}
                >
                  {PARTNER_CATEGORY_OPTIONS.map((opt) => {
                    const selected = opt === category;
                    return (
                      <button
                        key={opt}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        onClick={() => setCategory(opt)}
                        className={`flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left hover:bg-[#f5f5f5] ${
                          selected ? 'bg-[#fafafa]' : ''
                        }`}
                      >
                        <span
                          className={`truncate ${selected ? partnersDrawer.optionSelected : partnersDrawer.optionDefault}`}
                        >
                          {opt}
                        </span>
                        {selected && (
                          <Check className="size-4 shrink-0 text-[#155dfc]" strokeWidth={2.5} />
                        )}
                      </button>
                    );
                  })}
                  <div className="sticky bottom-0 border-t border-[#e5e7eb] bg-white px-3 py-2 text-right">
                    <button
                      type="button"
                      className="text-[14px] font-normal leading-5 text-[#155dfc] hover:underline"
                      onClick={() => setCategoryPanelOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
