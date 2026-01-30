# Development Guide

## Quick Start

```bash
pnpm install
pnpm dev         # http://localhost:5173
pnpm test        # Playwright e2e tests
pnpm build       # Production build
```

## Environment Variables (Dev Only)

Create `.env.development.local` (never committed):

```bash
VITE_LUNCH_MONEY_TOKEN=<your-token>
VITE_SAVINGS_ACCOUNT_ID=<account-id>
VITE_GOALS_ACCOUNT_ID=<account-id>
VITE_SPENDING_ACCOUNT_ID=<account-id>
```

**Security:** Use `.env.development.local` NOT `.env.local` - Vite ignores it in production builds.

## Lunch Money API

- **Base URL:** `https://dev.lunchmoney.app/v1`
- **Auth:** Bearer token in Authorization header
- **Endpoints used:**
  - `GET /assets` - fetch account balances
  - `GET /transactions?asset_id=X` - fetch transactions

**IMPORTANT:** API wrapper (`src/lib/api.ts`) blocks all non-GET requests for safety.

## Testing with agent-browser

```bash
agent-browser open "http://localhost:5173"
agent-browser snapshot                    # accessibility tree
agent-browser click "e4"                  # click by ref
agent-browser fill "e15" "Goal Name"      # fill input
agent-browser close
```

## Git Workflow

```bash
git status                    # check current state
git add <files>               # stage specific files
git commit -m "message"       # commit changes
git checkout -b feat/name     # create feature branch
git log --oneline             # view history
git diff                      # see changes
```

## Gotchas

1. **Tailwind v4:** Use `@import "tailwindcss"` in CSS, not directives
2. **Vite env vars:** Must prefix with `VITE_` to expose to client
3. **Lunch Money API:** v1 not v2 (despite v2 docs existing)
4. **PWA icons:** Missing - add `pwa-192x192.png` and `pwa-512x512.png` to `/public`
