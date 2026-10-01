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
- `Part1_Node-1 — 2026-09-30 — Tag advanced from partners-only baseline to include availability module through Create Availability step 1 (merged from part1/node-1a)`
- `Part1_Node-1 — 2026-09-30 — Create Availability step 5 Publish Preferences merged (tiered scheduled flow, date pickers, modal; School Partners audience excluded)`

**Availability review (site `bedlam-hospital`):**

- Overview: `/site/bedlam-hospital/availability/overview`
- List: `/site/bedlam-hospital/availability/list`

## Agent handoff

New chat or model switch: `@DESIGN_PROGRESSION.md` and state **Active node: Part1_Node-1a** (or **Part1_Node-1** for baseline-only work).
