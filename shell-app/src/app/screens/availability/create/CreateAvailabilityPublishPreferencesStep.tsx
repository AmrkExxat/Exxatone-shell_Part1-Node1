import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Calendar, ChevronDown, ChevronRight, ChevronUp, Info, Plus, Trash2 } from 'lucide-react';
import {
  createEmptyPublishPreference,
  DEFAULT_SCHEDULED_PUBLISH_ON,
  allTierCategoryIds,
  ensureTierPublishDates,
  PUBLISH_AUDIENCE_OPTIONS,
  PUBLISH_TIER_CATEGORY_OPTIONS,
  PUBLISH_WHEN_OPTIONS,
  publishPreferenceSummary,
  isPublishPreferenceRemoveEnabled,
  publishWhenSummary,
  showsDueDate,
  showsPublishOn,
  showsPublishWhen,
  showsTierScheduledDates,
  tierCategoryLabel,
  type PublishAudience,
  type PublishPreferenceRow,
  type PublishWhen,
  type TierPublishDates,
} from '../../../config/availabilityPublishPreferences';
import { partnersDrawer } from '../../partners/partnersTypography';
import { availabilityCreateDrawer } from './availabilityCreateDrawer';
import { PublishPreferenceDatePickerField } from './publishPreferenceDatePickerField';
import { PublishOnInfoTooltip } from './PublishOnInfoTooltip';
import { SchedulePublishingModal } from './SchedulePublishingModal';

type Props = {
  preferences: PublishPreferenceRow[];
  onChange: (rows: PublishPreferenceRow[]) => void;
};

/** Only one dropdown / date popover open across all publish preference cards. */
type PublishPreferenceOverlay = 'who-sees' | 'publish-when' | 'publish-on' | 'due-date';

type OpenOverlayState = { rowId: string; overlay: PublishPreferenceOverlay } | null;

export function CreateAvailabilityPublishPreferencesStep({ preferences, onChange }: Props) {
  const sectionHintId = useId();
  const [openOverlay, setOpenOverlay] = useState<OpenOverlayState>(null);
  const cardRefs = useRef(new Map<string, HTMLDivElement>());

  const registerCardRef = (rowId: string, element: HTMLDivElement | null) => {
    if (element) cardRefs.current.set(rowId, element);
    else cardRefs.current.delete(rowId);
  };

  useEffect(() => {
    if (!openOverlay) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;

      const card = cardRefs.current.get(openOverlay.rowId);
      if (!card) return;

      const overlayRoot = card.querySelector(`[data-publish-overlay="${openOverlay.overlay}"]`);
      if (overlayRoot?.contains(target)) return;

      setOpenOverlay(null);
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [openOverlay]);

  const addPreference = () => {
    onChange([...preferences, createEmptyPublishPreference()]);
  };

  const updateRow = (id: string, patch: Partial<PublishPreferenceRow>) => {
    onChange(preferences.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const removeRow = (id: string) => {
    if (preferences.length <= 1) {
      onChange([createEmptyPublishPreference()]);
      return;
    }
    onChange(preferences.filter((row) => row.id !== id));
  };

  return (
    <div className={availabilityCreateDrawer.publishSection}>
      <div className={availabilityCreateDrawer.publishSectionHeader}>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className={availabilityCreateDrawer.publishSectionTitle}>
              Publish Preferences ({preferences.length})
            </h3>
            <span className="inline-flex items-center gap-1 text-[#616161]" aria-describedby={sectionHintId}>
              <Info className="size-4 shrink-0" strokeWidth={2} aria-hidden />
            </span>
          </div>
          <p id={sectionHintId} className={availabilityCreateDrawer.publishSectionHint}>
            Give partner schools or specific partner categories early access and expand visibility to
            all schools later with multiple publish preferences.
          </p>
        </div>
        <button type="button" className={partnersDrawer.requestProgramBtn} onClick={addPreference}>
          <span className="inline-flex items-center gap-1.5">
            <Plus className="size-4" strokeWidth={2.25} />
            Add Publish Preference
          </span>
        </button>
      </div>

      <div className={availabilityCreateDrawer.publishPreferenceGrid}>
        {preferences.map((row, index) => (
          <PublishPreferenceCard
            key={row.id}
            row={row}
            preferenceIndex={index + 1}
            preferenceCount={preferences.length}
            openOverlay={openOverlay}
            onOpenOverlayChange={setOpenOverlay}
            registerCardRef={registerCardRef}
            onUpdate={(patch) => updateRow(row.id, patch)}
            onRemove={() => removeRow(row.id)}
          />
        ))}
      </div>
    </div>
  );
}

function PublishPreferenceCard({
  row,
  preferenceIndex,
  preferenceCount,
  openOverlay,
  onOpenOverlayChange,
  registerCardRef,
  onUpdate,
  onRemove,
}: {
  row: PublishPreferenceRow;
  preferenceIndex: number;
  preferenceCount: number;
  openOverlay: OpenOverlayState;
  onOpenOverlayChange: (next: OpenOverlayState) => void;
  registerCardRef: (rowId: string, element: HTMLDivElement | null) => void;
  onUpdate: (patch: Partial<PublishPreferenceRow>) => void;
  onRemove: () => void;
}) {
  const [tierDatesListExpanded, setTierDatesListExpanded] = useState(false);
  const cardElRef = useRef<HTMLDivElement | null>(null);
  const removeEnabled = isPublishPreferenceRemoveEnabled(row, preferenceCount);

  const isOverlayOpen = (overlay: PublishPreferenceOverlay) =>
    openOverlay?.rowId === row.id && openOverlay.overlay === overlay;

  const setOverlayOpen = (overlay: PublishPreferenceOverlay, open: boolean) => {
    if (open) {
      setTierDatesListExpanded(false);
      onOpenOverlayChange({ rowId: row.id, overlay });
    } else if (isOverlayOpen(overlay)) onOpenOverlayChange(null);
  };

  const closeAllOverlays = () => onOpenOverlayChange(null);

  useEffect(() => {
    if (!tierDatesListExpanded) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;

      const card = cardElRef.current;
      if (!card) return;

      const preferredDatesBlock = card.querySelector('[data-publish-preferred-dates]');
      if (preferredDatesBlock?.contains(target)) return;

      setTierDatesListExpanded(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [tierDatesListExpanded]);

  const setPublishWhen = (value: PublishWhen) => {
    if (value === 'scheduled') {
      if (row.audience === 'tiered-partners') {
        onUpdate({
          publishWhen: value,
          publishOn: null,
          dueDate: null,
          tierPublishDatesByCategoryId: ensureTierPublishDates(
            row.tierCategoryIds,
            row.tierPublishDatesByCategoryId ?? {},
          ),
        });
      } else {
        onUpdate({
          publishWhen: value,
          publishOn: row.publishOn ?? DEFAULT_SCHEDULED_PUBLISH_ON,
          tierPublishDatesByCategoryId: {},
        });
      }
      closeAllOverlays();
      return;
    }
    if (value === 'do-not-publish') {
      onUpdate({
        publishWhen: value,
        publishOn: null,
        dueDate: null,
        tierPublishDatesByCategoryId: {},
      });
      closeAllOverlays();
      return;
    }
    onUpdate({
      publishWhen: value,
      publishOn: null,
      tierPublishDatesByCategoryId: {},
    });
    closeAllOverlays();
  };

  return (
    <div
      ref={(element) => {
        cardElRef.current = element;
        registerCardRef(row.id, element);
      }}
      className={availabilityCreateDrawer.publishPreferenceCard}
    >
      <WhoSeesField
        row={row}
        preferenceIndex={preferenceIndex}
        panelOpen={isOverlayOpen('who-sees')}
        onPanelOpenChange={(open) => setOverlayOpen('who-sees', open)}
        onUpdate={onUpdate}
      />

      {showsPublishWhen(row) ? (
        <div className="mt-4">
          <FieldLabel required>Publish When</FieldLabel>
          <SimpleSelectDropdown
            id={`publish-when-${row.id}`}
            valueLabel={publishWhenSummary(row)}
            hasValue={Boolean(row.publishWhen)}
            ariaLabel="Publish When"
            open={isOverlayOpen('publish-when')}
            onOpenChange={(open) => setOverlayOpen('publish-when', open)}
            overlayKey="publish-when"
          >
            {PUBLISH_WHEN_OPTIONS.map((option) => {
              const selected = row.publishWhen === option.id;
              return (
                <li key={option.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    className={`flex w-full min-h-[40px] items-center gap-2 px-4 text-left hover:bg-[#f5f5f5] ${
                      selected ? 'bg-[#fafafa]' : ''
                    }`}
                    onClick={() => setPublishWhen(option.id)}
                  >
                    <RadioDot selected={selected} />
                    <span className={selected ? partnersDrawer.optionSelected : partnersDrawer.optionDefault}>
                      {option.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </SimpleSelectDropdown>
        </div>
      ) : null}

      {showsPublishOn(row) ? (
        <div className="mt-4">
          <FieldLabel required trailing={<PublishOnInfoTooltip />}>
            Publish on
          </FieldLabel>
          <PublishPreferenceDatePickerField
            id={`publish-on-${row.id}`}
            value={row.publishOn}
            onChange={(publishOn) => onUpdate({ publishOn })}
            open={isOverlayOpen('publish-on')}
            onOpenChange={(open) => setOverlayOpen('publish-on', open)}
            overlayKey="publish-on"
            showClear
            clearOpensCalendar
            variant="emphasis"
          />
        </div>
      ) : null}

      {showsDueDate(row) ? (
        <div className="mt-4">
          <FieldLabel>Due Date</FieldLabel>
          <PublishPreferenceDatePickerField
            id={`due-date-${row.id}`}
            value={row.dueDate}
            onChange={(dueDate) => onUpdate({ dueDate })}
            open={isOverlayOpen('due-date')}
            onOpenChange={(open) => setOverlayOpen('due-date', open)}
            overlayKey="due-date"
            showClear
          />
        </div>
      ) : null}

      {showsTierScheduledDates(row) ? (
        <PreferredScheduledDatesBlock
          row={row}
          entityIds={row.tierCategoryIds}
          getEntityLabel={tierCategoryLabel}
          buttonLabel="Set Preferred Dates for Tiers"
          accordionTitle="Tiered Partners"
          listExpanded={tierDatesListExpanded}
          onListExpandedChange={(expanded) => {
            if (expanded) closeAllOverlays();
            setTierDatesListExpanded(expanded);
          }}
          onDismissOverlays={closeAllOverlays}
          onUpdate={onUpdate}
        />
      ) : null}

      <button
        type="button"
        disabled={!removeEnabled}
        className={`${availabilityCreateDrawer.publishRemoveBtn} ${
          removeEnabled
            ? availabilityCreateDrawer.publishRemoveBtnEnabled
            : availabilityCreateDrawer.publishRemoveBtnDisabled
        }`}
        onClick={onRemove}
      >
        <Trash2 className="size-4 shrink-0" strokeWidth={2} aria-hidden />
        Remove
      </button>
    </div>
  );
}

function PreferredScheduledDatesBlock({
  row,
  entityIds,
  getEntityLabel,
  buttonLabel,
  accordionTitle,
  listExpanded,
  onListExpandedChange,
  onDismissOverlays,
  onUpdate,
}: {
  row: PublishPreferenceRow;
  entityIds: string[];
  getEntityLabel: (id: string) => string;
  buttonLabel: string;
  accordionTitle: string;
  listExpanded: boolean;
  onListExpandedChange: (expanded: boolean) => void;
  onDismissOverlays: () => void;
  onUpdate: (patch: Partial<PublishPreferenceRow>) => void;
}) {
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleDraftSeed, setScheduleDraftSeed] = useState<Record<string, TierPublishDates>>({});
  const entityDates = row.tierPublishDatesByCategoryId ?? {};

  const openScheduleModal = () => {
    onDismissOverlays();
    const nextDates = ensureTierPublishDates(entityIds, entityDates);
    setScheduleDraftSeed(nextDates);
    onUpdate({ tierPublishDatesByCategoryId: nextDates });
    setScheduleModalOpen(true);
  };

  return (
    <div className="mt-4" data-publish-preferred-dates>
      <button
        type="button"
        className={availabilityCreateDrawer.tierPreferredDatesBtn}
        onClick={openScheduleModal}
      >
        <Calendar className="size-4 shrink-0" strokeWidth={2} aria-hidden />
        {buttonLabel}
      </button>
      <div>
        <button
          type="button"
          className={`${availabilityCreateDrawer.tierDatesAccordionTrigger} ${
            listExpanded ? 'rounded-b-none border-b-0' : ''
          }`}
          aria-expanded={listExpanded}
          onClick={() => onListExpandedChange(!listExpanded)}
        >
          <span className={availabilityCreateDrawer.tierDatesAccordionTitle}>{accordionTitle}</span>
          {listExpanded ? (
            <ChevronUp className="size-4 shrink-0 text-[#616161]" aria-hidden />
          ) : (
            <ChevronDown className="size-4 shrink-0 text-[#616161]" aria-hidden />
          )}
        </button>
        {listExpanded ? (
          <div
            className={availabilityCreateDrawer.tierDatesList}
            role="region"
            aria-label="Tier publish dates"
            data-publish-preferred-dates-panel
          >
            {entityIds.map((entityId) => {
              const dates = entityDates[entityId];
              const publishOn = dates?.publishOn ?? DEFAULT_SCHEDULED_PUBLISH_ON;
              const dueOn = dates?.dueOn;
              return (
                <div key={entityId} className={availabilityCreateDrawer.tierDatesRow}>
                  <p className={availabilityCreateDrawer.tierDatesRowTitle}>{getEntityLabel(entityId)}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className={availabilityCreateDrawer.tierDatesColLabel}>Publish On</p>
                      <p className={availabilityCreateDrawer.tierDatesColValue}>{publishOn}</p>
                    </div>
                    <div>
                      <p className={availabilityCreateDrawer.tierDatesColLabel}>Due On</p>
                      <p className={availabilityCreateDrawer.tierDatesColValue}>
                        {dueOn ?? 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>

      <SchedulePublishingModal
        open={scheduleModalOpen}
        onOpenChange={setScheduleModalOpen}
        tierCategoryIds={entityIds}
        getEntityLabel={getEntityLabel}
        draftSeed={scheduleDraftSeed}
        onSave={(tierPublishDatesByCategoryId) => onUpdate({ tierPublishDatesByCategoryId })}
      />
    </div>
  );
}

function WhoSeesField({
  row,
  preferenceIndex,
  panelOpen,
  onPanelOpenChange,
  onUpdate,
}: {
  row: PublishPreferenceRow;
  preferenceIndex: number;
  panelOpen: boolean;
  onPanelOpenChange: (open: boolean) => void;
  onUpdate: (patch: Partial<PublishPreferenceRow>) => void;
}) {
  const [tierExpanded, setTierExpanded] = useState(row.audience === 'tiered-partners');
  const fieldId = `who-sees-${row.id}`;

  const audienceComplete =
    Boolean(row.audience) &&
    (row.audience !== 'tiered-partners' || row.tierCategoryIds.length > 0);

  const selectAudience = (audience: PublishAudience) => {
    if (audience === 'tiered-partners') {
      const tierCategoryIds =
        row.audience === 'tiered-partners' && row.tierCategoryIds.length > 0
          ? row.tierCategoryIds
          : allTierCategoryIds();
      onUpdate({
        audience,
        tierCategoryIds,
        publishWhen: null,
        publishOn: null,
        dueDate: null,
        tierPublishDatesByCategoryId: {},
      });
      setTierExpanded(true);
      onPanelOpenChange(false);
      return;
    }
    onUpdate({
      audience,
      tierCategoryIds: [],
      publishWhen: null,
      publishOn: null,
      dueDate: null,
      tierPublishDatesByCategoryId: {},
    });
    setTierExpanded(false);
    onPanelOpenChange(false);
  };

  const toggleTier = (tierId: string) => {
    const next = row.tierCategoryIds.includes(tierId)
      ? row.tierCategoryIds.filter((id) => id !== tierId)
      : [...row.tierCategoryIds, tierId];
    if (row.publishWhen === 'scheduled') {
      onUpdate({
        audience: 'tiered-partners',
        tierCategoryIds: next,
        tierPublishDatesByCategoryId: ensureTierPublishDates(
          next,
          row.tierPublishDatesByCategoryId ?? {},
        ),
      });
      setTierExpanded(true);
      return;
    }
    onUpdate({
      audience: 'tiered-partners',
      tierCategoryIds: next,
      publishWhen: null,
      publishOn: null,
      dueDate: null,
      tierPublishDatesByCategoryId: {},
    });
    setTierExpanded(true);
  };

  return (
    <>
      <FieldLabel htmlFor={fieldId} required>
        Who sees this availability?
      </FieldLabel>
      <div className="relative w-full" data-publish-overlay="who-sees">
        <button
          id={fieldId}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={panelOpen}
          className={`${partnersDrawer.programSelectBtn} w-full`}
          onClick={() => onPanelOpenChange(!panelOpen)}
        >
          <span
            className={
              row.audience ? partnersDrawer.optionDefault : partnersDrawer.programSelectPlaceholder
            }
          >
            {publishPreferenceSummary(row)}
          </span>
          <span className="ml-auto flex items-center gap-2">
            {audienceComplete && row.audience === 'tiered-partners' ? (
              <span className="rounded-[4px] bg-[#e8eaf6] px-1.5 py-0.5 text-[12px] font-medium leading-none text-[#3f51b5]">
                {row.tierCategoryIds.length}
              </span>
            ) : null}
            {audienceComplete && row.audience !== 'tiered-partners' ? (
              <span className="rounded-[4px] bg-[#e8eaf6] px-1.5 py-0.5 text-[12px] font-medium leading-none text-[#3f51b5]">
                {preferenceIndex}
              </span>
            ) : null}
            <ChevronDown className={`size-4 shrink-0 text-[#616161] ${panelOpen ? 'rotate-180' : ''}`} />
          </span>
        </button>

        {panelOpen ? (
          <div className={partnersDrawer.dropdownPanel} role="listbox" aria-label="Who sees this availability">
            <ul className="max-h-[320px] overflow-y-auto py-1">
              {PUBLISH_AUDIENCE_OPTIONS.map((option) => {
                const selected = row.audience === option.id;
                const isTier = option.id === 'tiered-partners';
                return (
                  <li key={option.id}>
                    <div className="flex items-center gap-1 px-2">
                      <button
                        type="button"
                        role="option"
                        aria-selected={selected}
                        className={`flex min-h-[40px] flex-1 items-center gap-2 rounded px-2 text-left hover:bg-[#f5f5f5] ${
                          selected ? 'bg-[#fafafa]' : ''
                        }`}
                        onClick={() => selectAudience(option.id)}
                      >
                        <RadioDot selected={selected} />
                        <span
                          className={
                            selected ? partnersDrawer.optionSelected : partnersDrawer.optionDefault
                          }
                        >
                          {option.label}
                        </span>
                      </button>
                      {isTier ? (
                        <button
                          type="button"
                          className="flex size-8 shrink-0 items-center justify-center rounded hover:bg-[#f5f5f5]"
                          aria-expanded={tierExpanded}
                          aria-label={tierExpanded ? 'Collapse tier categories' : 'Expand tier categories'}
                          onClick={(e) => {
                            e.stopPropagation();
                            setTierExpanded((v) => !v);
                            if (!row.audience) selectAudience('tiered-partners');
                          }}
                        >
                          {tierExpanded ? (
                            <ChevronDown className="size-4 text-[#616161]" />
                          ) : (
                            <ChevronRight className="size-4 text-[#616161]" />
                          )}
                        </button>
                      ) : null}
                    </div>
                    {isTier && tierExpanded ? (
                      <ul className="border-t border-[#eceef1] bg-[#fafafa] py-1 pl-10 pr-2">
                        {PUBLISH_TIER_CATEGORY_OPTIONS.map((tier) => {
                          const checked = row.tierCategoryIds.includes(tier.id);
                          return (
                            <li key={tier.id}>
                              <label className="flex min-h-[36px] cursor-pointer items-center gap-2 rounded px-2 hover:bg-[#f0f0f0]">
                                <input
                                  type="checkbox"
                                  className="size-4 rounded border-[#888] accent-[#3f51b5]"
                                  checked={checked}
                                  onChange={() => toggleTier(tier.id)}
                                />
                                <span className="text-[14px] text-[#212121]">{tier.label}</span>
                              </label>
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                  </li>
                );
              })}
            </ul>
            <div className={`${partnersDrawer.dropdownFooter} justify-end`}>
              <button
                type="button"
                className="text-[14px] font-normal leading-5 text-[#155dfc] hover:underline"
                onClick={() => onPanelOpenChange(false)}
              >
                Close
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}

function SimpleSelectDropdown({
  id,
  valueLabel,
  hasValue,
  ariaLabel,
  open: openControlled,
  onOpenChange,
  overlayKey,
  children,
}: {
  id: string;
  valueLabel: string;
  hasValue: boolean;
  ariaLabel: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  overlayKey?: PublishPreferenceOverlay;
  children: ReactNode;
}) {
  const [openInternal, setOpenInternal] = useState(false);
  const open = openControlled ?? openInternal;
  const setOpen = onOpenChange ?? setOpenInternal;
  return (
    <div
      className="relative w-full"
      {...(overlayKey ? { 'data-publish-overlay': overlayKey } : {})}
    >
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`${partnersDrawer.programSelectBtn} w-full ${open ? 'border-[#3f51b5] ring-2 ring-[#3f51b5]/20' : ''}`}
        onClick={() => setOpen(!open)}
      >
        <span className={hasValue ? partnersDrawer.optionDefault : partnersDrawer.programSelectPlaceholder}>
          {valueLabel}
        </span>
        <ChevronDown className={`ml-auto size-4 shrink-0 text-[#616161] ${open ? 'rotate-180' : ''}`} />
      </button>
      {open ? (
        <div className={partnersDrawer.dropdownPanel} role="listbox" aria-label={ariaLabel}>
          <ul className="py-1">{children}</ul>
          <div className={`${partnersDrawer.dropdownFooter} justify-end`}>
            <button
              type="button"
              className="text-[14px] font-normal leading-5 text-[#155dfc] hover:underline"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FieldLabel({
  children,
  required,
  htmlFor,
  trailing,
}: {
  children: ReactNode;
  required?: boolean;
  htmlFor?: string;
  trailing?: ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={`${partnersDrawer.fieldLabel} mb-2 flex items-center gap-1`}
    >
      {children}
      {required ? <span className="text-[#d32f2f]">*</span> : null}
      {trailing}
    </label>
  );
}

function RadioDot({ selected }: { selected: boolean }) {
  return (
    <span
      className={`flex size-4 shrink-0 items-center justify-center rounded-full border ${
        selected ? 'border-[#3f51b5]' : 'border-[#888]'
      }`}
      aria-hidden
    >
      {selected ? <span className="size-2 rounded-full bg-[#3f51b5]" /> : null}
    </span>
  );
}
