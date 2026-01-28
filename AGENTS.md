# Agent Instructions

## Project: Kids Lunch Money

PWA for children to track 40/40/20 money buckets (Long-term Savings, Goal Savings, Free Spending).

## Key Docs

- [docs/development.md](docs/development.md) - Setup, commands, env vars
- [docs/architecture.md](docs/architecture.md) - Tech stack, project structure
- [PRD_TEMPLATE.md](PRD_TEMPLATE.md) - Full requirements

## Critical Rules

1. **API Safety:** Only GET requests to Lunch Money API - wrapper blocks all others
2. **No Secrets in Code:** Use `.env.development.local` for dev, UI for production
3. **Use Context7:** For library docs (Dexie, TanStack Query, Workbox, etc.)
4. **Use jj:** Not git - see PRD for jj workflow

## Common Commands

```bash
pnpm dev          # Start dev server
pnpm test         # Run Playwright tests
pnpm build        # Production build
jj log            # View changes
jj describe -m "" # Set commit message
```
