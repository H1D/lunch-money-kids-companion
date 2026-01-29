# Lunch Money Kids Companion

A Progressive Web App for children to track their 40/40/20 money buckets using the [Lunch Money](https://lunchmoney.app) API.

## The 40/40/20 System

| Bucket | % | Purpose |
|--------|---|---------|
| 🔒 Long-term Savings | 40% | Untouchable until age 18 |
| 🎯 Goal Savings | 40% | Save for specific goals (iPad, bike, etc.) |
| 💸 Free Spending | 20% | Spend however you want |

## Features

- **Kid-friendly dashboard** showing all three money buckets
- **Goal tracking** with visual progress bars
- **Recent transactions** for the spending bucket
- **Offline-first** - works without internet, syncs when online
- **Customizable themes** with OKLCH color system
- **Multi-language support** (EN, ES, NL, FR, IT, DE, PT)
- **Parent settings** (hidden) for API configuration

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS v4 with OKLCH theming
- TanStack Query for data fetching
- Dexie.js for IndexedDB storage
- Workbox for PWA/offline support
- Playwright for E2E testing

## Development

```bash
cd vibecoding_output
pnpm install
pnpm dev
```

## Setup

1. Create 3 accounts in [Lunch Money](https://lunchmoney.app) for the three buckets
2. Get your API token from Lunch Money → Settings → Developers
3. In the app, tap the title 5 times to access parent settings
4. Enter your token and select the accounts

## License

MIT
