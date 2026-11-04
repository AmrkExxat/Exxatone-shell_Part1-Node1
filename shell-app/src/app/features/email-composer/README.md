# Email composer (shared feature)

One composer drawer, one history drawer, one expanded (full-screen) mode. Mounted once in
`SiteShell` via `<ComposerProvider>`. Nothing inside this folder knows about a specific page.

On Schedules, the profile menu chooses **3 steps** (the existing bulk-email drawer) or **New composer**.
The 3-step flow is not modified.

## Use it from a page

```tsx
import { EmailActions, buildPeopleContext } from '../../features/email-composer';

<EmailActions
  selectedCount={picked.size}
  noun="students"
  getSelected={() => buildPeopleContext({ source: 'Students', siteName, people: selectedPeople })}
/>
```

or call the hook directly (e.g. a row's message icon):

```tsx
const { openComposer, openHistory } = useEmailComposer();
openComposer(ctx);
```

## The contract

A page hands over a `ComposerContext` (see `types.ts`): `source`, `kind` (individual | group | mixed),
`subtitle`, `recipients` (each with a role and the placement rows that feed merge tags), `sender`
(name, reply-to, brand) and optional `history` / `prefill`. Everything else (roles, templates,
merge tags, per-person edits, preview, scheduling, history) is internal.

## Adapters

`adapters/` turns a page's data into a context. `people.ts` is generic (any list of people);
`schedules.ts` is the richer Schedules one (groups, preceptors, clinical instructors, faculty).
A new page usually needs only `buildPeopleContext`, or a small adapter of its own.
