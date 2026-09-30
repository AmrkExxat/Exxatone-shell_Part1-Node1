import { Pencil } from 'lucide-react';
import { availabilityCreateDrawer, CREATE_AVAILABILITY_STEPS } from './availabilityCreateDrawer';

type StepperProps = {
  currentStep: number;
  maxVisitedStep: number;
  onStepClick: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  onSave: () => void;
  isNextDisabled: boolean;
  isSaveDisabled: boolean;
  showPrevious: boolean;
  primaryLabel: 'Next' | 'Save';
};

function stepClipPath(index: number, total: number): string {
  const arrow = 14;
  if (index === 0) {
    return `polygon(0 0, calc(100% - ${arrow}px) 0, 100% 50%, calc(100% - ${arrow}px) 100%, 0 100%)`;
  }
  if (index === total - 1) {
    return `polygon(0 0, 100% 0, 100% 100%, 0 100%, ${arrow}px 50%)`;
  }
  return `polygon(0 0, calc(100% - ${arrow}px) 0, 100% 50%, calc(100% - ${arrow}px) 100%, 0 100%, ${arrow}px 50%)`;
}

export function CreateAvailabilityChevronStepper({
  currentStep,
  maxVisitedStep,
  onStepClick,
  onPrevious,
  onNext,
  onSave,
  isNextDisabled,
  isSaveDisabled,
  showPrevious,
  primaryLabel,
}: StepperProps) {
  const total = CREATE_AVAILABILITY_STEPS.length;

  return (
    <div className={availabilityCreateDrawer.stepperBar}>
      <div
        className={availabilityCreateDrawer.stepperTrack}
        role="tablist"
        aria-label="Create availability steps"
      >
        {CREATE_AVAILABILITY_STEPS.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const canClick = index <= maxVisitedStep;
          const clip = stepClipPath(index, total);

          let label: React.ReactNode;
          if (isActive) {
            label = step.numberedLabel;
          } else if (isCompleted) {
            label = (
              <span className="inline-flex items-center gap-1.5">
                <Pencil className="size-3.5 shrink-0 text-[#616161]" strokeWidth={2} aria-hidden />
                {step.label}
              </span>
            );
          } else {
            label = step.numberedLabel;
          }

          return (
            <button
              key={step.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-current={isActive ? 'step' : undefined}
              disabled={!canClick}
              onClick={() => canClick && onStepClick(index)}
              className={`relative shrink-0 px-4 py-2.5 text-[13px] font-medium transition-colors ${
                isActive
                  ? 'z-[2] text-white'
                  : isCompleted
                    ? 'z-[1] text-[#212121] hover:bg-[#f5f5f5]'
                    : 'text-[#424242]'
              } ${!canClick ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
              style={{
                clipPath: clip,
                marginLeft: index === 0 ? 0 : -10,
                paddingLeft: index === 0 ? 16 : 22,
                paddingRight: index === total - 1 ? 20 : 22,
                backgroundColor: isActive ? '#3f51b5' : '#ffffff',
                minWidth: index === total - 1 ? 180 : 132,
              }}
            >
              <span className="relative z-[1] whitespace-nowrap">{label}</span>
            </button>
          );
        })}
      </div>

      <div className={availabilityCreateDrawer.stepperActions}>
        {showPrevious ? (
          <button type="button" className={availabilityCreateDrawer.btnSecondary} onClick={onPrevious}>
            Previous
          </button>
        ) : null}
        {primaryLabel === 'Save' ? (
          <button
            type="button"
            className={availabilityCreateDrawer.btnPrimary}
            disabled={isSaveDisabled}
            onClick={onSave}
          >
            Save
          </button>
        ) : (
          <button
            type="button"
            className={availabilityCreateDrawer.btnPrimary}
            disabled={isNextDisabled}
            onClick={onNext}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
