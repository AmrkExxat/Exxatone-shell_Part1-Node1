import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { SchoolPartner } from '../../config/schoolPartners';
import { Sheet, SheetContent, SheetTitle } from '../../components/ui/sheet';
import { PartnerCategoryMultiSelect } from './PartnerCategoryMultiSelect';
import { partnersDrawer, partnersFont } from './partnersTypography';

interface EditCategorySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partner: SchoolPartner | null;
  onUpdate: (categories: string[]) => void;
}

export function EditCategorySheet({
  open,
  onOpenChange,
  partner,
  onUpdate,
}: EditCategorySheetProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    if (partner) {
      setCategories([...partner.categories]);
      setPanelOpen(false);
    }
  }, [partner, open]);

  if (!partner) return null;

  const categoryInvalid = categories.length === 0;

  const handleUpdate = () => {
    if (categoryInvalid) return;
    onUpdate(categories);
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
            disabled={categoryInvalid}
            className={`${partnersDrawer.updateBtn} disabled:cursor-not-allowed`}
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

            <PartnerCategoryMultiSelect
              selected={categories}
              onChange={setCategories}
              panelOpen={panelOpen}
              onPanelOpenChange={setPanelOpen}
              invalid={categoryInvalid}
            />
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
