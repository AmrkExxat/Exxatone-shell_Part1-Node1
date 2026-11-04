# Design progression — Part 1 (School Partners shell)

**Active node (default):** `Part1_Node-1a` — all forward PM/leadership changes unless you name `Part1_Node-1` explicitly.

## Local review

| Node | Git | Folder | Dev command | URL |
|------|-----|--------|-------------|-----|
| **Part1_Node-1** (frozen baseline) | tag `Part1_Node-1` | Sibling worktree: `../Exxat-UI-Shell-Part1_Node-1` | `cd shell-app && npm run dev` | http://localhost:5174/login |
| **Part1_Node-1a** (active) | branch `part1/node-1a` | This workspace | `cd shell-app && npm run dev:1a` | http://localhost:5175/login |
| **Part1_Node-1a** (Pages preview) | branch `part1/node-1a` | Cloudflare Pages | Git push or `shell-app`: `npm run pages:deploy` | See `shell-app/docs/review/cloudflare-pages.md` |

**Partners review paths (site `bedlam-hospital`):**

- List: `/site/bedlam-hospital/partners`
- Detail example: `/site/bedlam-hospital/partners/eastwood-state-university`

First-time worktree setup: from the frozen worktree root, run `npm install` in `shell-app/`. Baseline dev server: `cd shell-app && npx vite --port 5174 --strictPort` (tag `Part1_Node-1` predates env-based port in `vite.config.ts` on `part1/node-1a`).

## Naming rules

- **Part1_Node-1** — approved fork snapshot. Edit only when you say *“apply to Part1_Node-1”* (worktree / cherry-pick / new tag with your OK).
- **Part1_Node-1a** — iteration line on branch `part1/node-1a` in this workspace.
- Future: **Part1_Node-2**, **Part1_Node-2a**, same pattern (tag + `a` branch).

## Part1_Node-1 scope (baseline checklist)

- School Partners list: sticky chrome, filters, export, table, Edit Category action
- **+ Add Partner** → Add Program Partner side drawer (program search + category)
- Partner detail: cover, meta, tabs (About built; other tabs placeholder)
- Detail About: cards, Related Documents empty state, Program Contacts table
- Edit Category drawer (Figma-aligned shell tokens)
- Availability: Overview, List (sticky table), module chrome; **Create Single Availability** — step 1 Location; **step 5 Publish Preferences** on 1a (incl. School Partners audience; steps 2–4 placeholders)

**Tag sync (2026-09-30):** `Part1_Node-1` (tag `e0478ce`, worktree `../Exxat-UI-Shell-Part1_Node-1`) includes step 5 publish preferences **without** School Partners audience; `part1/node-1a` adds School Partners publish UI on top.

### Out of scope (until post-review sign-off)

- PRD: Partner Category multi-select (`PRDs/Partner_Category_MultiSelect_PRD.pdf`)
- PRD: Publish preference (`PRDs/Publish_Preference_School_Partners_PRD.pdf`)
- Product edits in frozen original: `Documents/New Projects 2026 -27/ExxatOne _ UI shell/`

## Changelog

Append one line per completed review batch on **Part1_Node-1a**:

- `Part1_Node-1a — 2026-09-25 — Design node versioning: dual ports (5174 baseline worktree / 5175 active), manifest + Cursor rule`
- `Part1_Node-1a — 2026-09-28 — Availability module: Overview, List (sticky columns), Map/Reports placeholders`
- `Part1_Node-1a — 2026-09-29 — Availability list: Figma 571:20809 column widths + wrap headers; header row 45px`
- `Part1_Node-1a — 2026-09-29 — Availability list: pinned-column shadows, single-line headers, DS status pills, partners grid lines`
- `Part1_Node-1a — 2026-09-29 — Availability list: sticky sub-tabs + filters + table header under module chrome`
- `Part1_Node-1a — 2026-09-29 — Availability list: single-table horizontal scroll + pinned columns (fix split-table jitter)`
- `Part1_Node-1a — 2026-09-29 — Availability overview: KPI/activities/breakdown/high-demand aligned to Figma refs`
- `Part1_Node-1a — 2026-09-29 — Availability mock data: Figma 1045:7509 row patterns; anonymized locations and creators for prototype sharing`
- `Part1_Node-1a — 2026-09-29 — Create Availability wide sheet: chevron stepper, Location step 1, steps 2–5 placeholders`
- `Part1_Node-1a — 2026-09-30 — Create Availability location table polish (sticky chrome, ref colors); stepper bar layout`
- `Part1_Node-1a — 2026-09-30 — Create Availability step 5 Publish Preferences (Figma 1045:54395 experience; Save gating)`
- `Part1_Node-1a — 2026-09-30 — Create Availability step 5: compact Due Date popover (252px, smaller calendar grid)`
- `Part1_Node-1a — 2026-09-30 — Create Availability step 5: Publish on uses shared date picker; clear opens calendar`
- `Part1_Node-1a — 2026-09-30 — Create Availability step 5: unified date picker trigger; Due Date clear (×) + alignment`
- `Part1_Node-1a — 2026-09-30 — Create Availability step 5: Remove CTA enabled (#3f51b5) vs disabled (no hover)`
- `Part1_Node-1a — 2026-09-30 — Tiered Partners publish-when: Now/Do Not Publish/Scheduled tier dates panel`
- `Part1_Node-1a — 2026-09-30 — Tiered Partners: default all tiers selected; scheduled tier list collapsed by default`
- `Part1_Node-1a — 2026-09-30 — Publish Preferences: exclusive overlay (one dropdown/date popover at a time)`
- `Part1_Node-1a — 2026-09-30 — Publish Preferences: click-outside dismisses overlays and tier dates accordion`
- `Part1_Node-1a — 2026-09-30 — Publish preference grid: cards content-height (no stretch to tallest sibling)`
- `Part1_Node-1a — 2026-09-30 — Schedule Publishing modal for Set Preferred Dates for Tiers (Figma ref)`
- `Part1_Node-1a — 2026-09-30 — Publish on filled picker (#f5f6fc) + schedule time info tooltip`
- `Part1_Node-1a — 2026-09-30 — School Partners audience + Selected Schools panel (Figma ref)`
- `Part1_Node-1a — 2026-09-30 — School Partners: collapsed Selected Schools + exclusive overlay w/ Who sees nested picker`
- `Part1_Node-1a — 2026-09-30 — School Partners: Who sees closes on select; Selected Schools independent field opens`
- `Part1_Node-1a — 2026-09-30 — School Partners + Scheduled: preferred dates button (no card Publish on/Due Date)`
- `Part1_Node-1a — 2026-09-30 — School Partners list: category badges + hover popover; Edit Category multi-select`
- `Part1_Node-1a — 2026-09-30 — Partner detail Basic Information: 4-column grid + two-line address (ref layout)`
- `Part1_Node-1a — 2026-09-30 — Partner category badges: capped wrapper + ellipsis for long labels (table + Basic Information)`
- `Part1_Node-1a — 2026-09-30 — Partners list Category column: clip to cell width (no spill into Contracts)`
- `Part1_Node-1a — 2026-09-30 — Partner detail Basic Information: full category badge labels (no truncation)`
- `Part1_Node-1a — 2026-09-30 — Partner cover-card meta: category count text (not badge list)`
- `Part1_Node-1a — 2026-09-30 — Partners list Program contact: name/+N opens All Contacts dialog`
- `Part1_Node-1a — 2026-09-30 — Partners list Program contact: “--” empty state + sample rows without contacts`
- `Part1_Node-1a — 2026-09-30 — Edit Category: zero-selection error state + footer message; Update disabled`
- `Part1_Node-1a — 2026-10-14 — Partner module search icons: shared #616161 token (list, detail contacts, Add Partner, Edit Category)
- `Part1_Node-1a — 2026-10-23 — Schedules module shell: Overview, List (All/Group/Individual), sticky wide table; Calendar/Report placeholders`
- `Part1_Node-1a — 2026-10-23 — Schedules Overview: full-width Discipline filter bar aligned with KPI column; solid pies + Recent Activities rail`
- `Part1_Node-1a — 2026-10-23 — Schedules List: timeline tabs on grey rail + Needs Attention triage card (ref layout)`
- `Part1_Node-1a — 2026-10-23 — Schedules List filter bar: per-kind facets, search combo, +N more, toolbar actions (All/Group/Individual refs)`
- `Part1_Node-1a — 2026-10-23 — Schedules List: row-select checkbox column (Group/Individual only); Bulk Email CTA gated on selection`
- `Part1_Node-1a — 2026-10-23 — Bulk Email 3-step drawer (Recipients → Compose → Preview): persona recipients, templates + merge fields, token validation, send-now/schedule delivery`
- `Part1_Node-1a — 2026-10-27 — Bulk Email: attachment chips carried to Preview, stepper drops edit icons; Write-from-scratch header/footer radios (grey stroke) drive site-logo header band (above Subject) and Exxat-logo footer band (above Attachments), mirrored in Preview`
- `Part1_Node-1a — 2026-10-27 — Bulk Email: inline SVG site header logos (fix broken Bedlam render); Preview card order — Exxat footer band above Attachments`
- `Part1_Node-1a — 2026-10-28 — Site Configuration (gear nav): secondary Configuration sidebar, Basic Details + logo upload rail, prod IA stubs for remaining sections; auto-collapse main sidebar on entry`
- `Part1_Node-1a — 2026-10-28 — Site Configuration polish: nav default (Site Details only expanded), prod typography/surfaces, GPTW logo rail asset, 4-col Basic Information grid`
- `Part1_Node-1a — 2026-10-28 — Site Configuration Figma 48:30767 alignment: white config card, typography/grid/logo rail from MCP assets, Program Partners → Category`
- `Part1_Node-1a — 2026-10-28 — Site Configuration: Notification accordion (Email Setup, Email Templates, Attachment Templates, Notification Configuration, My Notifications) with placeholder routes`
- `Part1_Node-1a — 2026-10-28 — Email Setup: display name, reply-to chips (validate/dedupe), tenant logo upload, footer disclaimer + Save Settings`
- `Part1_Node-1a — 2026-10-28 — Email Setup UI polish: full-width config card, page intro, narrow inputs (#e5e7eb → #3f51b5 focus), Save Now in-card`
- `Part1_Node-1a — 2026-10-28 — Email Setup: unified 640px field width, shared control border shell, logo upload = footer width, Save Settings CTA (no divider)`
- `Part1_Node-1a — 2026-10-28 — Site Configuration: single scroll (shell main locked; content column + config nav scroll only)`
- `Part1_Node-1a — 2026-10-28 — Email Templates: event tree (Automated + Bulk), URL ?group/category/event, template cards, add/clone/delete/preview dialogs, Sonner toasts`
- `Part1_Node-1a — 2026-10-28 — Email Templates tree: full event catalog, quiet sticky group bands that stack`
- `Part1_Node-1a — 2026-10-28 — Email Templates tree: lighter event rows, consistent selected state, count pill on every event`
- `Part1_Node-1a — 2026-10-28 — Email Templates: separate cards, right-aligned actions, event-specific mock copy, editor route placeholder`
- `Part1_Node-1a — 2026-10-28 — Email Templates editor: Add dialog, Create vs Edit page, merge fields, attachments, header/footer`
- `Part1_Node-1a — 2026-10-28 — Email Templates editor header: back, Customized, Set as default, Preview, Save, Delete; light-grey fields; Subject width matches Template name`
- `Part1_Node-1a — 2026-10-28 — Email Templates: header logo replaces display name; Preview follows header/footer layout; @ merge menu is a pinned overlay`
- `Part1_Node-1a — 2026-10-28 — Email Templates editor: title bar sticks while the config column scrolls`
- `Part1_Node-1a — 2026-10-28 — Email Templates: scratch name uses the event; Add dialog lists Customized only; split @ hints; upload icon`
- `Part1_Node-1a — 2026-10-28 — Site Configuration nav: Attachment Templates renamed to Template Editor`
- `Part1_Node-1a — 2026-10-28 — Email Setup defaults: display name Bedlam Medical Network, reply-to clinical.placements@bedlammedical.org`
- `Part1_Node-1a — 2026-10-29 — Notification: Attachment Templates, Notification Configuration, My Notifications`
- `Part1_Node-1a — 2026-10-29 — Notification polish: clickable attachment cards, shared merge-field menu, quieter locks, sheet actions in the header`
- `Part1_Node-1a — 2026-10-29 — Attachment Templates drawer: close on the left, 45-field insert menu with rounded search`
- `Part1_Node-1a — 2026-10-29 — Attachment Templates drawer: grey canvas and white form card; @ in the document opens merge fields`
- `Part1_Node-1a — 2026-10-29 — Notification Configuration: recipients drawer matches the grey canvas; User lists the five roles`
- `Part1_Node-1a — 2026-10-29 — Notification locks: Messages keeps the badge; other categories use a filled lock and a light veil`
- `Part1_Node-1a — 2026-10-29 — Digest Notifications default to in-app off; lock veil lightened; notification screens named, focusable, and described`
- `Part1_Node-1a — 2026-10-29 — Lock tooltips are two lines; My Notifications uses the Locked badge and has no lock control`
- `Part1_Node-1a — 2026-10-29 — My Notifications: one content scroll; lock text no longer stretches the page`
- `Part1_Node-1a — 2026-10-30 — Bulk Email: stepper keeps the step number on completed steps; Preview drops “Previewing as” and puts delivery time at the top of the email`
- `Part1_Node-1a — 2026-10-30 — Bulk Email Compose: grouped letters open directly in edit mode (no lock, no Add Template, no side Merge Fields panel); Subject and Email content support an @ mention overlay, fields scoped to the selected recipient group, reusing the Attachment/Email Template @ interaction`
- `Part1_Node-1a — 2026-10-30 — Bulk Email: Site Personnel and Clinical Instructor grouped letters, summary table (one row per group), and a merge-field list that follows the letter`
- `Part1_Node-1a — 2026-10-30 — Bulk Email: @ merge-field chips use indigo, so they read as fields rather than errors`
- `Part1_Node-1a — 2026-10-30 — Bulk Email Compose/Preview: grouped preceptor template (read-only letter, Add Template copies it for this send); Preview renders @Schedule Table as that preceptor’s placement rows`
- `Part1_Node-1a — 2026-11-03 — Email opens on a recipients review (counts, attention filters, row actions), then a compact compose step. Template lists have 7+ letters per audience, search, a Default tag, Write your own, and session show/hide in the expanded list`
- `Part1_Node-1a — 2026-11-03 — Send and Schedule confirmations share a final-check summary (template, audience, email count, subject, from, and a hint when a selected group schedule has no students)`
- `Part1_Node-1a — 2026-11-03 — Empty-roster preceptor rows stay unchecked and disabled with a persistent "no students assigned" hint; split-by-schedule sends only emailable schedules (3 emails for the all-group preceptor case)`
- `Part1_Node-1a — 2026-11-03 — Group schedules table gets a "to be scheduled" row with a preceptor but no roster yet; the composer surfaces it under that preceptor with a "no students assigned to this schedule" hint, including a warning when splitting into one email per schedule`
- `Part1_Node-1a — 2026-11-03 — Email Templates card attachment chips match the composer's indigo wash`
- `Part1_Node-1a — 2026-11-03 — Email Templates cards show a body snippet and attachment chips`
- `Part1_Node-1a — 2026-11-03 — Attachments sits under the letter, same width, with no divider`
- `Part1_Node-1a — 2026-11-03 — Template editor puts header, merge fields, and links on the right; Attachments is last`
- `Part1_Node-1a — 2026-11-03 — Email template editor hides the Configuration nav and uses full width; Attachment Templates hidden from the nav for now`
- `Part1_Node-1a — 2026-11-03 — Email Templates opens on Student, Bulk Email, Onboarding, Welcome`
- `Part1_Node-1a — 2026-11-03 — Email template category chain uses backslash breadcrumbs`
- `Part1_Node-1a — 2026-11-03 — Email template audiences and their notification libraries expand and collapse on click`
- `Part1_Node-1a — 2026-11-03 — Email Templates are grouped by audience, then Automated notifications or Bulk Email, and the composer reads those letters`
- `Part1_Node-1a — 2026-11-03 — Expanded schedule list shows each id once, with the students on that schedule`
- `Part1_Node-1a — 2026-11-03 — Group schedules use “Group schedule briefing” and say schedules, not placements, in recipients`
- `Part1_Node-1a — 2026-11-03 — New email opens with “Select who to send to” expanded`
- `Part1_Node-1a — 2026-11-02 — Bulk email review switch (3 steps / New composer) lives in the profile menu`
- `Part1_Node-1a — 2026-11-02 — Schedules toolbar can switch to the new email composer (from exxat-one-email-composer) without changing the 3-step bulk email drawer`
- `Part1_Node-1a — 2026-11-02 — Prototype mock data is one Bedlam Hospital set (site, schools, people, locations). Group schedules are Nursing; individual schedules are Physical Therapy. Email templates are one catalog used by Email Templates, Bulk Email, previews, and attachment samples`
- `Part1_Node-1a — 2026-10-30 — Bulk Email Recipients: "N group schedules selected" + View popover; persona radio list with per-schedule switch (one email per person default) and live email count; recipient list with tri-state select, schedule pill expanding Schedule / Student and rotation table; up-front alerts for multi-schedule people and duplicate name/email; Compose note and Preview email count follow send mode`
- `Part1_Node-1a — 2026-10-28 — Email Templates tree: selected event is bold only (no band fill); count pills meet WCAG AA contrast`
- `Part1_Node-1a — 2026-11-03 — Email composer polish: underline audience tabs w/ neutral count badges (replaces pills); header badge reflects live selection/emails; Default tag matches Email Templates green; expanded template list selected state uses a legible indigo wash; predefined templates default header=logo/footer=Exxat, Write your own clears both to +Add`
- `Part1_Node-1a — 2026-11-04 — Composer: Send to dropdown and compact switches; Compose CTA; From/Reply-to as two rows; To lists names (3 lines) with Edit recipients; Cc Add recipients drawer for other audiences; Preview/Edit swap; letter beside Write with Leo; @ Insert merge field with search`
- `Part1_Node-1a — 2026-11-04 — Composer follow-up: bordered Send to field; Edit recipients and Add recipients return to the recipients step (no nested drawer; edit hides the counts); formatting bar sits under the subject with the small Write with Leo button`
- `Part1_Node-1a — 2026-11-04 — Schedules email opens the new composer by default; the 3-step flow remains available from the profile menu`
- `Part1_Node-1a — 2026-11-04 — Write with Leo shows the finished mark, label, and BETA pill on one line (no draw-in on open)`
- `Part1_Node-1a — 2026-11-04 — Clearing a template body shows "Write email content, or enter @ to insert a merge field" between the header and footer`
- `Part1_Node-1 — 2026-09-30 — Tag advanced from partners-only baseline to include availability module through Create Availability step 1 (merged from part1/node-1a)`
- `Part1_Node-1 — 2026-09-30 — Create Availability step 5 Publish Preferences merged (tiered scheduled flow, date pickers, modal; School Partners audience excluded)`

**Availability review (site `bedlam-hospital`):**

- Overview: `/site/bedlam-hospital/availability/overview`
- List: `/site/bedlam-hospital/availability/list`
- Schedules overview: `/site/bedlam-hospital/schedules/overview`
- Schedules list (all / group / individual): `/site/bedlam-hospital/schedules/list/all` (also `…/group`, `…/individual`)

## Agent handoff

New chat or model switch: `@DESIGN_PROGRESSION.md` and state **Active node: Part1_Node-1a** (or **Part1_Node-1** for baseline-only work).
