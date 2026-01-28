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
5. **Run A11y Checks After UI Changes:** Always run `pnpm a11y` after modifying UI components

## Accessibility & Contrast Checking

**Automatic checking (runs without manual intervention):**
- **Pre-commit hook:** Runs `pnpm lint` (includes jsx-a11y) on every commit with `.tsx/.jsx` changes
- **CI workflow:** Runs full Playwright axe-core tests on PRs touching `src/components/`

**Manual commands:**
```bash
pnpm a11y         # Full accessibility check (lint + Playwright axe-core)
pnpm test:a11y    # Run only Playwright accessibility tests
pnpm lint         # Includes jsx-a11y rules for static analysis
```

**What it checks:**
- WCAG 2.1 AA contrast ratios (4.5:1 for normal text, 3:1 for large text)
- ARIA attributes and roles
- Keyboard accessibility
- Form label associations
- Interactive element focus states

**Tools:**
- `eslint-plugin-jsx-a11y` - Static analysis during linting (pre-commit)
- `@axe-core/playwright` - Runtime testing of rendered UI (CI + manual)

**If violations found:**
1. Check the console output for specific elements and ratios
2. Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) to test fixes
3. Adjust Tailwind classes (e.g., `text-slate-400` → `text-slate-600` for better contrast)
4. Re-run `pnpm a11y` to verify fixes

## Common Commands

```bash
pnpm dev          # Start dev server
pnpm test         # Run Playwright tests
pnpm test:a11y    # Run accessibility tests only
pnpm a11y         # Full a11y check (lint + test)
pnpm build        # Production build
jj log            # View changes
jj describe -m "" # Set commit message
```
