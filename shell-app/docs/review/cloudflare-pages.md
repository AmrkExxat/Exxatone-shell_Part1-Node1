# Cloudflare Pages — Part1_Node-1a review URL

Shareable preview for PM and accessibility testing (no local dev server).

## Live URL

| | |
|--|--|
| **Project** | `exxat-shell-part1-1a` |
| **Production branch** | `part1/node-1a` |
| **Base** | https://exxat-shell-part1-1a.pages.dev |
| **Login** | https://exxat-shell-part1-1a.pages.dev/login |
| **Partners list** | https://exxat-shell-part1-1a.pages.dev/site/bedlam-hospital/partners |
| **Partner detail (Eastwood)** | https://exxat-shell-part1-1a.pages.dev/site/bedlam-hospital/partners/eastwood-state-university |

Redeploy after code changes: `cd shell-app && npm run pages:deploy` (or connect Git — below).

## One-time: Git-connected Pages (recommended)

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Repository: `AmrkExxat/Exxatone-shell_Part1-Node1`.
3. **Production branch:** `part1/node-1a`
4. **Build settings:**

   | Setting | Value |
   |---------|--------|
   | Framework preset | None |
   | Build command | `cd shell-app && npm ci && npm run build` |
   | Build output directory | `shell-app/dist` |
   | Root directory | `/` (repo root) |

5. **Environment variables:** `NODE_VERSION` = `20` (recommended).
6. Deploy. Copy the `*.pages.dev` URL for stakeholders.

Each push to `part1/node-1a` triggers a new production deployment.

## Manual deploy (Wrangler CLI)

From `shell-app/`:

```bash
npm ci
npm run build
npm run pages:deploy
```

Requires [Wrangler login](https://developers.cloudflare.com/workers/wrangler/commands/#login): `npx wrangler login`.

## Notes

- SPA routing uses `public/_redirects` (`/* → index.html`).
- Build compiles `@exxat/ui` from the repo `libs/` folder; do not set Pages root to `shell-app` only without the parent repo.
- Mock login/session behaves the same as local `npm run dev:1a`.
