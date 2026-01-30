# Architecture

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 + TypeScript |
| Styling | Tailwind CSS v4 |
| Build | Vite |
| State | TanStack Query (offline-first) |
| Storage | Dexie.js (IndexedDB) |
| PWA | vite-plugin-pwa + Workbox |
| Source Control | Git |
| Secret Scanning | Gitleaks |

## Project Structure

```
src/
├── lib/
│   ├── api.ts      # Read-only Lunch Money API (GET only!)
│   ├── db.ts       # Dexie IndexedDB schema
│   └── query.ts    # TanStack Query config
├── hooks/
│   ├── useBuckets.ts   # Fetch balances with caching
│   ├── useGoals.ts     # CRUD for goals
│   └── useSettings.ts  # Parent settings
├── components/
│   ├── Dashboard.tsx       # Main view
│   ├── BucketCard.tsx      # Balance card
│   ├── GoalProgress.tsx    # Goal with progress bar
│   ├── TransactionList.tsx # Recent transactions
│   ├── ParentSettings.tsx  # Secret settings modal
│   └── AddGoalForm.tsx     # New goal form
└── App.tsx         # Root with QueryClientProvider
```

## Data Flow

```
User opens app
    ↓
TanStack Query checks cache (Dexie)
    ↓
Cache hit? Show immediately + refetch in background
Cache miss? Show loading, fetch from API
    ↓
Lunch Money API (GET only)
    ↓
Cache response in Dexie
    ↓
Display to user
```

## Security Model

1. **API Safety:** `src/lib/api.ts` throws error on any non-GET request
2. **Token Storage:** IndexedDB (never in code/git)
3. **Dev Credentials:** `.env.development.local` (Vite ignores in prod build)
4. **Parent Settings:** Hidden behind 5-tap secret gesture
