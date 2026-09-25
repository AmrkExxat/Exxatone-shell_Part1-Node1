import { useEffect, useState } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import {
  PARTNER_CATEGORY_OPTIONS,
  type SchoolPartner,
} from '../../config/schoolPartners';
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '../../components/ui/sheet';
import { partnersDrawer, partnersFont } from './partnersTypography';

interface EditCategorySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partner: SchoolPartner | null;
  onUpdate: (category: string) => void;
}

export function EditCategorySheet({
  open,
  onOpenChange,
  partner,
  onUpdate,
}: EditCategorySheetProps) {
  const [category, setCategory] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (partner) {
      setCategory(partner.category);
      setDropdownOpen(false);
    }
  }, [partner, open]);

  if (!partner) return null;

  const handleUpdate = () => {
    if (!category.trim()) return;
    onUpdate(category);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className={`${partnersFont} ${partnersDrawer.sheet}`}>
        <SheetTitle className="sr-only">Edit Category</SheetTitle>

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
            <h2 className={partnersDrawer.title}>Edit Category</h2>
          </div>
          <button
            type="button"
            onClick={handleUpdate}
            disabled={!category.trim()}
            className={partnersDrawer.updateBtn}
          >
            Update
          </button>
        </div>

        <div className={partnersDrawer.bodyScroll}>
          <div className={partnersDrawer.formCard}>
            <div className={partnersDrawer.fieldGrid}>
              <ReadOnlyField label="University Name" value={partner.schoolName} />
              <ReadOnlyField label="Alias Name" value={partner.aliasName} />
              <div className="sm:col-span-1">
                <p className={partnersDrawer.fieldLabel}>Address</p>
                <button
                  type="button"
                  className={`${partnersDrawer.addressLink} mt-0 block max-w-[280px] whitespace-normal`}
                  onClick={() => console.log('Address link stub')}
                >
                  {partner.address}
                </button>
              </div>
            </div>

            <div className="relative mt-12">
              <p className={`${partnersDrawer.categoryLabel} mb-1`}>Partner Category</p>
              <button
                type="button"
                onClick={() => setDropdownOpen((v) => !v)}
                className={partnersDrawer.selectTrigger}
                aria-expanded={dropdownOpen}
                aria-haspopup="listbox"
              >
                <span className={partnersDrawer.selectValue}>
                  {category || 'Select category'}
                </span>
                <ChevronDown
                  className={`${partnersDrawer.selectChevron} transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                  strokeWidth={2}
                />
              </button>

              {dropdownOpen && (
                <div
                  role="listbox"
                  className="absolute left-0 right-0 z-10 mt-1 max-h-[320px] overflow-y-auto rounded-[6px] border border-[#e5e7eb] bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]"
                >
                  {PARTNER_CATEGORY_OPTIONS.map((opt) => {
                    const selected = opt === category;
                    return (
                      <button
                        key={opt}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        onClick={() => {
                          setCategory(opt);
                          setDropdownOpen(false);
                        }}
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
                          <Check
                            className="size-4 shrink-0 text-[#155dfc]"
                            strokeWidth={2.5}
                            aria-hidden
                          />
                        )}
                      </button>
                    );
                  })}
                  <div className="sticky bottom-0 border-t border-[#e5e7eb] bg-white px-3 py-2 text-right">
                    <button
                      type="button"
                      className="text-[14px] font-normal leading-5 text-[#155dfc] hover:underline"
                      onClick={() => setDropdownOpen(false)}
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

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0 leading-5">
      <p className={partnersDrawer.fieldLabel}>{label}</p>
      <p className={partnersDrawer.fieldValue}>{value}</p>
    </div>
  );
}
