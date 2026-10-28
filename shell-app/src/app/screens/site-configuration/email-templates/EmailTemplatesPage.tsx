import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { toast } from 'sonner';
import { siteConfigPath } from '../../../config/siteConfiguration';
import {
  DEFAULT_EMAIL_TEMPLATE_SELECTION,
  findEventSelection,
  templatesForEvent,
  type EmailTemplateHistoryEntry,
  type EmailTemplateRecord,
} from '../../../config/emailTemplates';
import { useEmailTemplates } from '../../../config/emailTemplateStore';
import { sc } from '../siteConfigurationTokens';
import { EmailTemplateCard } from './EmailTemplateCard';
import { EmailTemplatePreviewDialog } from './EmailTemplatePreviewDialog';
import { EmailTemplatesAddDialog } from './EmailTemplatesAddDialog';
import { EmailTemplatesCloneDialog } from './EmailTemplatesCloneDialog';
import { EmailTemplatesDeleteDialog } from './EmailTemplatesDeleteDialog';
import { EmailTemplatesEventTree } from './EmailTemplatesEventTree';
import { et } from './emailTemplatesTokens';

function newId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function nowIso() {
  return new Date().toISOString();
}

export function EmailTemplatesPage() {
  const { siteId = '' } = useParams<{ siteId: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [templates, setTemplates] = useEmailTemplates();
  const [addOpen, setAddOpen] = useState(false);

  const groupId = searchParams.get('group') ?? DEFAULT_EMAIL_TEMPLATE_SELECTION.groupId;
  const categoryId = searchParams.get('category') ?? DEFAULT_EMAIL_TEMPLATE_SELECTION.categoryId;
  const eventId = searchParams.get('event') ?? DEFAULT_EMAIL_TEMPLATE_SELECTION.eventId;

  const selection = useMemo(
    () => findEventSelection(groupId, categoryId, eventId),
    [groupId, categoryId, eventId],
  );

  const eventTemplates = useMemo(
    () => templatesForEvent(templates, groupId, categoryId, eventId),
    [templates, groupId, categoryId, eventId],
  );

  const [cloneTarget, setCloneTarget] = useState<EmailTemplateRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EmailTemplateRecord | null>(null);
  const [previewTarget, setPreviewTarget] = useState<EmailTemplateRecord | null>(null);

  const syncSelection = useCallback(
    (g: string, c: string, e: string) => {
      setSearchParams(
        { group: g, category: c, event: e },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  useEffect(() => {
    if (!selection) {
      syncSelection(
        DEFAULT_EMAIL_TEMPLATE_SELECTION.groupId,
        DEFAULT_EMAIL_TEMPLATE_SELECTION.categoryId,
        DEFAULT_EMAIL_TEMPLATE_SELECTION.eventId,
      );
    }
  }, [selection, syncSelection]);

  const upsertHistory = (
    entry: EmailTemplateHistoryEntry,
    prev: EmailTemplateHistoryEntry[],
  ) => [...prev, entry];

  const handleSetDefault = (templateId: string) => {
    const at = nowIso();
    setTemplates((prev) =>
      prev.map((t) => {
        if (t.groupId !== groupId || t.categoryId !== categoryId || t.eventId !== eventId) {
          return t;
        }
        if (t.id === templateId) {
          return {
            ...t,
            isDefault: true,
            lastUpdatedBy: 'You',
            lastUpdatedAt: at,
            history: upsertHistory(
              { id: newId('hist'), type: 'set_default', actor: 'You', at },
              t.history,
            ),
          };
        }
        return { ...t, isDefault: false };
      }),
    );
    toast.success('Default template updated.');
  };

  const handleCloneConfirm = (name: string) => {
    if (!cloneTarget) return;
    const at = nowIso();
    const copy: EmailTemplateRecord = {
      ...cloneTarget,
      id: newId('tpl'),
      name,
      kind: 'customized',
      isDefault: false,
      lastUpdatedBy: 'You',
      lastUpdatedAt: at,
      history: [
        {
          id: newId('hist'),
          type: 'cloned',
          actor: 'You',
          at,
          detail: cloneTarget.name,
        },
      ],
    };
    setTemplates((prev) => [...prev, copy]);
    setCloneTarget(null);
    toast.success('Template cloned.');
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setTemplates((prev) => prev.filter((t) => t.id !== deleteTarget.id));
    setDeleteTarget(null);
    toast.success('Template deleted.');
  };

  const openEditor = (mode: 'create' | 'edit', templateId?: string) => {
    const params = new URLSearchParams({
      mode,
      group: groupId,
      category: categoryId,
      event: eventId,
    });
    if (templateId) params.set('templateId', templateId);
    navigate(
      `${siteConfigPath(siteId, 'notification/email-templates/editor')}?${params.toString()}`,
    );
  };

  const showAudience = groupId === 'bulk';

  return (
    <div className={`${sc.font} pb-1 pt-1`}>
      <header className="mb-4 space-y-2">
        <h1 className={sc.cardTitle}>Email Templates</h1>
        <p className={et.pageIntro}>
          Manage the emails Exxat One sends, and the Bulk Email templates people send by hand.
        </p>
      </header>

      <div className={et.layout}>
        <EmailTemplatesEventTree
          templates={templates}
          groupId={groupId}
          categoryId={categoryId}
          eventId={eventId}
          onSelect={syncSelection}
        />

        <div className={et.mainPane}>
          {selection ? (
            <>
              <div className={et.paneHeader}>
                <h2 className={et.paneTitle}>{selection.event.label}</h2>
                <button
                  type="button"
                  className={et.btnPrimary}
                  onClick={() => {
                    const pickable = eventTemplates.filter((tpl) => tpl.kind === 'customized');
                    if (pickable.length === 0) {
                      openEditor('create');
                      return;
                    }
                    setAddOpen(true);
                  }}
                >
                  <Plus className="size-4" strokeWidth={2} aria-hidden />
                  Add template
                </button>
              </div>

              <div className={et.cardStack}>
                {eventTemplates.length === 0 ? (
                  <p className={et.emptyState}>
                    No templates for this event yet. Add one to get started.
                  </p>
                ) : (
                  eventTemplates.map((tpl) => (
                    <EmailTemplateCard
                      key={tpl.id}
                      template={tpl}
                      siblings={eventTemplates}
                      showAudience={showAudience}
                      onSetDefault={() => handleSetDefault(tpl.id)}
                      onPreview={() => setPreviewTarget(tpl)}
                      onClone={() => setCloneTarget(tpl)}
                      onEdit={() => openEditor('edit', tpl.id)}
                      onDelete={() => setDeleteTarget(tpl)}
                    />
                  ))
                )}
              </div>

              <p className={et.rulesHint}>
                Standard templates are read-only — clone one to customize it. A default cannot be
                deleted until another template is set as default.
              </p>
            </>
          ) : (
            <p className={et.emptyState}>Select an event from the list.</p>
          )}
        </div>
      </div>

      <EmailTemplatesAddDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        eventTemplates={eventTemplates.filter((tpl) => tpl.kind === 'customized')}
        onStartFromScratch={() => {
          setAddOpen(false);
          openEditor('create');
        }}
        onPickTemplate={(tpl) => {
          setAddOpen(false);
          openEditor('create', tpl.id);
        }}
      />

      <EmailTemplatesCloneDialog
        open={cloneTarget !== null}
        onOpenChange={(open) => {
          if (!open) setCloneTarget(null);
        }}
        sourceName={cloneTarget?.name ?? ''}
        onConfirm={handleCloneConfirm}
      />

      <EmailTemplatesDeleteDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        templateName={deleteTarget?.name ?? ''}
        onConfirm={handleDeleteConfirm}
      />

      <EmailTemplatePreviewDialog
        open={previewTarget !== null}
        onOpenChange={(open) => {
          if (!open) setPreviewTarget(null);
        }}
        template={previewTarget}
        eventLabel={selection?.event.label ?? ''}
      />
    </div>
  );
}
