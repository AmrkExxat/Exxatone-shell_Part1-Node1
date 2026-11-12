# Schedule and Site Clearance

Local prototype for PM review, accessibility testing, and engineering walkthroughs. Git stays in this folder until a separate `exxat-schedule-site-clearance` remote is created.

HTML prototypes and screenshots in the parent `Schedule Clearance Checklist` folder are early explorations. Changes discussed with PM land in this shell.

## Local review

| | |
|---|---|
| Dev command | `cd shell-app && npm run dev:clearance` |
| Login | http://localhost:5176/login |
| Shared review | https://part1-node-2-schedule-site-clearance.exxat-amreek.workers.dev/login |
| Site | `bedlam-hospital` |

**Schedules and Onboarding**

- Overview: `/site/bedlam-hospital/schedules/overview`
- All: `/site/bedlam-hospital/schedules/list/all`
- Group: `/site/bedlam-hospital/schedules/list/group`
- Individual: `/site/bedlam-hospital/schedules/list/individual`

**Site Configuration**

- Basic Details: `/site/bedlam-hospital/site-configuration/site-details/basic-details`
- Schedule Clearance: `/site/bedlam-hospital/site-configuration/site-details/schedule-clearance`

## Scope in this shell

- Schedules overview and All / Group / Individual lists, without bulk email, the email composer, or email history.
- Site Configuration as in the product look-alike, without the Notification group (Email Setup, Email Templates, Notification Configuration, My Notifications).
- One shared mock dataset in `shell-app/src/app/data/prototype/`, taken from Site Clearance Prototype V2.1 (SCH-1000 through SCH-1011) with availability, shift, days, preceptor, and clinical instructor filled in. The list, schedule detail, and Schedule Clearance page read the same records. Clearance icons update when a checklist is saved.
- Group and Individual lists have no select checkbox. On All, Group onboarding status sits just left of the pinned Schedule status and Student onboarding status. On Group, Group onboarding status is the pinned onboarding column.

## Out of this pass

- The Schedule Clearance checklist setup from the HTML prototypes.
- A new git remote.
