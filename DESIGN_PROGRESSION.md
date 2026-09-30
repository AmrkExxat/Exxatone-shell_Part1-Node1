# Design progression — Part 1 (School Partners shell)

**Active node (default):** `Part1_Node-1a` — all forward PM/leadership changes unless you name `Part1_Node-1` explicitly.

## Local review

| Node | Git | Folder | Dev command | URL |
|------|-----|--------|-------------|-----|
| **Part1_Node-1** (frozen baseline) | tag `Part1_Node-1` | Sibling worktree: `../Exxat-UI-Shell-Part1_Node-1` | `cd shell-app && npm run dev` | http://localhost:5174/login |
| **Part1_Node-1a** (active) | branch `part1/node-1a` | This workspace | `cd shell-app && npm run dev:1a` | http://localhost:5175/login |

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
- `Part1_Node-1 — 2026-09-30 — Tag advanced from partners-only baseline to include availability module through Create Availability step 1 (merged from part1/node-1a)`

**Availability review (site `bedlam-hospital`):**

- Overview: `/site/bedlam-hospital/availability/overview`
- List: `/site/bedlam-hospital/availability/list`

## Agent handoff

New chat or model switch: `@DESIGN_PROGRESSION.md` and state **Active node: Part1_Node-1a** (or **Part1_Node-1** for baseline-only work).
