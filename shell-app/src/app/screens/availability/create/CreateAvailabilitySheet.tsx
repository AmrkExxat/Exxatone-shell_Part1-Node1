import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle } from '../../../components/ui/sheet';
import { partnersDrawer, partnersFont } from '../../partners/partnersTypography';
import {
  availabilityCreateDrawer,
  CREATE_AVAILABILITY_STEPS,
  generateAvailabilityDraftName,
} from './availabilityCreateDrawer';
import { CreateAvailabilityChevronStepper } from './CreateAvailabilityChevronStepper';
import { CreateAvailabilityLocationStep } from './CreateAvailabilityLocationStep';

const LAST_STEP_INDEX = CREATE_AVAILABILITY_STEPS.length - 1;

export interface CreateAvailabilitySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateAvailabilitySheet({ open, onOpenChange }: CreateAvailabilitySheetProps) {
  const [draftName, setDraftName] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [maxVisitedStep, setMaxVisitedStep] = useState(0);
  const [selectedLocationIds, setSelectedLocationIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!open) {
      setCurrentStep(0);
      setMaxVisitedStep(0);
      setSelectedLocationIds(new Set());
      setDraftName('');
      return;
    }
    setDraftName(generateAvailabilityDraftName());
  }, [open]);

  const isStep1 = currentStep === 0;
  const isLastStep = currentStep === LAST_STEP_INDEX;

  const isNextDisabled = isStep1 && selectedLocationIds.size === 0;
  const isSaveDisabled = true;

  const goNext = () => {
    if (isNextDisabled) return;
    const next = Math.min(LAST_STEP_INDEX, currentStep + 1);
    setCurrentStep(next);
    setMaxVisitedStep((m) => Math.max(m, next));
  };

  const goPrevious = () => {
    setCurrentStep((s) => Math.max(0, s - 1));
  };

  const handleSave = () => {
    if (isSaveDisabled) return;
    console.log('Create availability save stub', {
      name: draftName,
      locationIds: [...selectedLocationIds],
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className={`${partnersFont} ${availabilityCreateDrawer.sheet}`}>
        <SheetTitle className="sr-only">Create Availability</SheetTitle>

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
            <h2 className={`${partnersDrawer.title} truncate`}>Create Availability</h2>
          </div>
        </div>

        <div className={availabilityCreateDrawer.metaRow}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
            <div className="flex min-w-0 items-center gap-2">
              <label htmlFor="create-availability-name" className={availabilityCreateDrawer.metaLabel}>
                Availability name:
              </label>
              <input
                id="create-availability-name"
                type="text"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                className={availabilityCreateDrawer.nameInput}
              />
            </div>
            <p className={availabilityCreateDrawer.modeBanner}>
              You&apos;re in <strong>Single Creation Mode</strong>. One availability will be created
              for all selected locations.
            </p>
          </div>
        </div>

        <div className={availabilityCreateDrawer.stepperRow}>
          <CreateAvailabilityChevronStepper
            currentStep={currentStep}
            maxVisitedStep={maxVisitedStep}
            onStepClick={setCurrentStep}
            onPrevious={goPrevious}
            onNext={goNext}
            onSave={handleSave}
            isNextDisabled={isNextDisabled}
            isSaveDisabled={isSaveDisabled}
            showPrevious={!isStep1}
            primaryLabel={isLastStep ? 'Save' : 'Next'}
          />
        </div>

        <div className={availabilityCreateDrawer.body}>
          {currentStep === 0 ? (
            <div className={availabilityCreateDrawer.bodyScrollLocation}>
              <CreateAvailabilityLocationStep
                selectedIds={selectedLocationIds}
                onSelectionChange={setSelectedLocationIds}
              />
            </div>
          ) : (
            <div className={availabilityCreateDrawer.bodyScroll}>
              <div className={availabilityCreateDrawer.placeholderPanel}>
                <p className="font-medium text-[#424242]">
                  {CREATE_AVAILABILITY_STEPS[currentStep].numberedLabel}
                </p>
                <p className="mt-2">
                  Step content will be added in the next slice. Use Next to continue reviewing the
                  flow.
                </p>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
