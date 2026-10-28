import { BULK_EMAIL_STEPS, bulkEmailDrawer } from './bulkEmailDrawer';

type StepperProps = {
  currentStep: number;
  maxVisitedStep: number;
  onStepClick: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  isNextDisabled: boolean;
  nextLabel: string;
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

/** Same visual language as Create Availability's chevron stepper, 3 steps. */
export function BulkEmailChevronStepper({
  currentStep,
  maxVisitedStep,
  onStepClick,
  onPrevious,
  onNext,
  isNextDisabled,
  nextLabel,
}: StepperProps) {
  const total = BULK_EMAIL_STEPS.length;

  return (
    <div className={bulkEmailDrawer.stepperBar}>
      <div className={bulkEmailDrawer.stepperTrack} role="tablist" aria-label="Bulk email steps">
        {BULK_EMAIL_STEPS.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const canClick = index <= maxVisitedStep;
          const clip = stepClipPath(index, total);

          let label: React.ReactNode;
          if (isActive) {
            label = step.numberedLabel;
          } else if (isCompleted) {
            label = step.label;
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
                minWidth: index === total - 1 ? 150 : 132,
              }}
            >
              <span className="relative z-[1] whitespace-nowrap">{label}</span>
            </button>
          );
        })}
      </div>

      <div className={bulkEmailDrawer.stepperActions}>
        {currentStep > 0 ? (
          <button type="button" className={bulkEmailDrawer.btnSecondary} onClick={onPrevious}>
            Previous
          </button>
        ) : null}
        <button
          type="button"
          className={bulkEmailDrawer.btnPrimary}
          disabled={isNextDisabled}
          onClick={onNext}
        >
          {nextLabel}
        </button>
      </div>
    </div>
  );
}
