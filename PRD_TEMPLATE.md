# Product Requirements Document (PRD)

## Document Info

- **Product Name:** Kids Lunch Money
- **Author:** [Your Name]
- **Date:** January 28, 2026
- **Version:** 1.0
- **Status:** Draft

---

## 1. Overview

### 1.1 Problem Statement

Children who have bank cards don't see how they spend money, where they save it, or track their financial habits. There's no child-friendly way to visualize their finances and savings progress.

This is important because financial literacy starts young, and children need an engaging, visual way to understand and manage their money.

### 1.2 Core Concept: The 40/40/20 Money Buckets

All money the child receives is distributed into three buckets:

| Bucket | % | Name | Purpose |
| ------ | - | ---- | ------- |
| 🔒 | **40%** | **Long-term Savings** | Untouchable until age 18. Building wealth for the future. |
| 🎯 | **40%** | **Goal Savings** | Dedicated to specific financial goals (iPad, bike, games, etc.) |
| 💸 | **20%** | **Free Spending** | Discretionary money for anything, no questions asked |

This teaches children:
- **Delayed gratification** (long-term savings)
- **Goal-oriented saving** (working toward something specific)
- **Responsible spending** (managing limited discretionary funds)

### 1.3 Goals & Success Metrics

| Goal | Metric | Target |
| ---- | ------ | ------ |
| Easy to open and use | Time to first meaningful screen | < 3 seconds |
| Fun and cool experience | Child engagement / return visits | Daily usage |
| Clear financial visibility | Child understands all 3 buckets | Immediate comprehension |
| Motivate goal savings | Progress toward goals | Visible progress weekly |

### 1.4 Non-Goals

- Server-side infrastructure (beyond Lunch Money API)
- Complex financial transactions
- Direct money transfers within the app
- Automatic distribution of money (parent handles this in Lunch Money)

---

## 2. User & Market

### 2.1 Target Users

- **Primary:** Children aged 8-15 years old
- **Secondary:** Parents who set up and configure the app

### 2.2 User Personas

| Persona | Description | Pain Points | Goals |
| ------- | ----------- | ----------- | ----- |
| Child | 8-15 year old learning financial responsibility | Can't visualize the 40/40/20 split, savings feel abstract, boring banking apps | See all 3 buckets clearly, track goal progress, have fun |
| Parent | Adult managing child's finances via Lunch Money | Wants child to learn the 40/40/20 system, needs secure setup | Easy configuration, child can't change bucket settings |

### 2.3 User Stories

**Parent Stories:**
- As a **parent**, I want to access secret settings (that my child doesn't know) so that I can configure the Lunch Money token and account IDs securely
- As a **parent**, I want to map three Lunch Money accounts to the three buckets (Long-term, Goals, Spending) so that my child sees the correct balances

**Child Stories - Viewing:**
- As a **child**, I want to see my Long-term Savings (40%) balance so that I know how much I'm building for when I turn 18
- As a **child**, I want to see my Goal Savings (40%) balance so that I know how much I have for my goals
- As a **child**, I want to see my Free Spending (20%) balance so that I know what I can spend freely
- As a **child**, I want to see recent transactions from my Free Spending so that I know where my money went
- As a **child**, I want to see progress toward my financial goals so that I stay motivated to save

**Child Stories - Interaction:**
- As a **child**, I want to add financial goals (with target amounts) so that I can save for specific things I want
- As a **child**, I want to customize the app colors and appearance so that it feels like mine

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Notes |
| ---- | ----------- | -------- | ----- |
| FR-1 | Secret parent settings (hidden from child) | P0 | Accessible via secret gesture or code |
| FR-2 | Lunch Money token configuration | P0 | Stored locally on client |
| FR-3 | Three account ID configuration | P0 | Map to: Long-term (40%), Goals (40%), Spending (20%) |
| FR-4 | Display Long-term Savings balance | P0 | 🔒 Locked until 18, visual "vault" style |
| FR-5 | Display Goal Savings balance | P0 | 🎯 Shows total available for goals |
| FR-6 | Display Free Spending balance | P0 | 💸 Available right now |
| FR-7 | Display Free Spending transactions | P0 | Recent transactions list under spending balance |
| FR-8 | Financial goals with progress tracking | P0 | Visual progress bars, target amounts |
| FR-9 | Add/edit/delete financial goals | P1 | Child manages their own goals |
| FR-10 | App color/theme customization | P1 | Child personalization |
| FR-11 | Visual celebration when goal is reached | P2 | Confetti, animation, etc. |
| FR-12 | Offline mode with cached data | P0 | App works without internet, shows cached balances |
| FR-13 | "Last updated" timestamp display | P1 | Shows when data was last refreshed from API |

### 3.2 Non-Functional Requirements

- **Performance:** App loads in < 3 seconds, data refreshes smoothly
- **Offline-First:** App fully functional offline with cached data; shows "Last updated" timestamp; syncs automatically when online
- **Security:** Token stored securely on client, parent settings protected, gitleaks pre-commit hook prevents accidental secret commits
- **Scalability:** Client-only, scales with Lunch Money API
- **Accessibility:** Child-friendly UI, large touch targets, readable fonts

### 3.3 Constraints

- Technical: No backend server, client-side only, depends on Lunch Money API
- Business: Personal project
- Regulatory: Child data privacy considerations (COPPA awareness)

---

## 4. Solution Design

### 4.1 Proposed Solution

A Progressive Web App (PWA) that connects to Lunch Money API to display a child's three money buckets (40/40/20) in a fun, engaging interface. Parents configure the app secretly, children interact with a simplified, colorful dashboard showing their Long-term Savings, Goal Savings, and Free Spending.

### 4.2 User Flows

1. **Parent Setup**: 
   - Long-press/secret gesture → Enter parent settings → Add Lunch Money token → Configure 3 account IDs (Long-term, Goals, Spending) → Save → Return to child view

2. **Child Daily Use**: 
   - Open app → See dashboard with all 3 buckets → Tap Goal Savings to see goal progress → Feel motivated

3. **Child Adds Goal**: 
   - Open goals section → Tap "Add Goal" → Enter name (e.g., "iPad") → Enter target amount → Save → See new goal with progress bar

4. **Child Customization**: 
   - Open settings (child section) → Change colors/theme → Save

### 4.3 Wireframes / Mockups

**Main Dashboard Concept:**
```
┌─────────────────────────────┐
│    Kids Lunch Money         │
├─────────────────────────────┤
│  🔒 LONG-TERM (until 18)    │
│  ████████████  $1,234.56    │
│  "Your future wealth!"      │
├─────────────────────────────┤
│  🎯 GOAL SAVINGS            │
│  ████████░░░░  $456.78      │
│  iPad: 75% ████████░░       │
│  Bike: 30% ███░░░░░░░       │
├─────────────────────────────┤
│  💸 FREE SPENDING           │
│  $23.45                     │
│                             │
│  Recent:                    │
│  · Candy store     -$3.50   │
│  · Ice cream       -$5.00   │
│  · Comic book      -$8.99   │
│  · Weekly deposit  +$10.00  │
└─────────────────────────────┘
```

### 4.4 Technical Approach

- **Framework:** React
- **Styling:** Tailwind CSS v4
- **Deployment:** Netlify (CLI installed and ready)
- **App Type:** Progressive Web App (PWA)
- **Platform Focus:** Maximum integration with iOS 26
- **Source Control:** Jujutsu (jj) - Git-compatible VCS
- **Secret Scanning:** Gitleaks (pre-commit hook to prevent accidental secret commits)
- **API:** Lunch Money API for account balances

#### Offline-First Stack

| Technology | Purpose | Why |
| ---------- | ------- | --- |
| **Workbox** | Service Worker & Caching | Google's PWA library for caching strategies; enables stale-while-revalidate for API responses |
| **Dexie.js** | IndexedDB Wrapper | Clean Promise-based API for storing goals, settings, and cached balances locally (~15kb) |
| **TanStack Query** | API State Management | Built-in caching, background refetching, automatic retry, and cache persistence to IndexedDB |

#### Offline-First Architecture

```
User opens app (online or offline)
    ↓
Service Worker serves cached app shell instantly
    ↓
TanStack Query serves cached API data (balances)
    ↓
Dexie provides goals/settings from IndexedDB
    ↓
Child sees dashboard immediately
    ↓
Background sync updates data when online
```

**Caching Strategy:**
- App shell: Cache-first (always fast load)
- API responses: Stale-while-revalidate (show cached, fetch fresh in background)
- Goals/Settings: Local-first in Dexie (no server sync needed)

### 4.5 Data Model

```
Settings (parent-controlled):
- lunchMoneyToken: string
- longTermAccountId: string    // 40% - untouchable
- goalSavingsAccountId: string // 40% - for goals  
- freeSpendingAccountId: string // 20% - discretionary

Goals (child-controlled):
- id: string
- name: string (e.g., "iPad Pro")
- targetAmount: number
- createdAt: date

Preferences (child-controlled):
- theme: string
- colorScheme: string
```

---

## 5. Scope & Timeline

### 5.1 In Scope

- Parent secret settings with token + 3 account ID configuration
- Dashboard showing all 3 money buckets (40/40/20)
- Recent transaction history for Free Spending bucket
- Financial goals with visual progress (draws from Goal Savings bucket)
- Theme/color customization
- PWA with iOS 26 optimization

### 5.2 Out of Scope

- Backend server
- User authentication (beyond parent settings protection)
- Transaction history for Long-term and Goal Savings (only Free Spending shows transactions)
- Automatic 40/40/20 splitting (parent does this in Lunch Money)
- Multi-child support (future consideration)

### 5.3 Milestones

| Milestone | Description | Target Date |
| --------- | ----------- | ----------- |
| Alpha | Dashboard with 3 buckets displaying balances | [TBD] |
| Beta | Goals + progress tracking + customization | [TBD] |
| Launch | PWA optimized, iOS 26 ready | [TBD] |

---

## 6. Dependencies & Risks

### 6.1 Dependencies

| Dependency | Owner | Status |
| ---------- | ----- | ------ |
| Lunch Money API | Lunch Money | Available |
| Netlify hosting | Netlify | Ready (CLI installed) |
| 3 separate accounts in Lunch Money | Parent | Must be set up |
| Workbox | Google | Open source, stable |
| Dexie.js | David Fahlander | Open source, stable |
| TanStack Query | Tanner Linsley | Open source, stable |
| Jujutsu (jj) | Martin von Zweigbergk | Git-compatible VCS |
| Gitleaks | Zach Rice | Secret scanning pre-commit hook |

### 6.2 Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
| ---- | ---------- | ------ | ---------- |
| Lunch Money API changes | Low | High | Monitor API updates, version lock |
| Token security on client | Med | High | Use secure storage, educate parents |
| Child bypasses parent settings | Med | Med | Implement robust secret access method |
| Parent forgets to split deposits | Med | Low | Document the 40/40/20 process for parent |

---

## 7. Launch & Support

### 7.1 Launch Plan

- Deploy to Netlify as PWA
- Test on iOS 26 devices
- Personal/family use initially

### 7.2 Support Plan

- Self-maintained
- GitHub issues for tracking

---

## 8. Open Questions

- [ ] What secret gesture/method to access parent settings?
- [ ] How to handle API rate limits from Lunch Money?
- [ ] What visual style appeals most to 8-15 year olds?
- [ ] Should goals have target dates or just target amounts?
- [ ] Should the app show how close the child is to affording a goal from Goal Savings?

---

## Appendix

### Documentation Links

- [Lunch Money API v1 Documentation](https://lunchmoney.dev/)
- [Lunch Money API v2 Documentation](https://alpha.lunchmoney.dev/v2/docs#description/migrating-from-v1)
- [Jujutsu Documentation](https://martinvonz.github.io/jj/)
- [Gitleaks Documentation](https://github.com/gitleaks/gitleaks)

### Development Guidelines

**Always use Context7 for documentation lookups.** When implementing features that use external libraries (Workbox, Dexie.js, TanStack Query, Lunch Money API, etc.), use the Context7 MCP tool to fetch up-to-date documentation and code examples rather than relying on potentially outdated knowledge.

### Jujutsu (jj) Workflow

Use jj's change-centric features idiomatically:

| Command | When to use |
|---------|-------------|
| `jj new` | Start a new change (don't accumulate unrelated work) |
| `jj describe -m "msg"` | Add/update change description |
| `jj edit <change-id>` | Jump to any change to modify it (descendants auto-rebase) |
| `jj squash` | Fold current change into parent |
| `jj split` | Break one change into multiple logical units |
| `jj move --from X --to Y` | Move hunks between changes |
| `jj log` | View change graph |
| `jj st` | View working copy status |

**Best practices:**
- Keep changes small and focused (one logical unit per change)
- Use change IDs (`mowztvwm`) not commit hashes - they're stable across rewrites
- Feel free to `jj edit` old changes - descendants auto-rebase
- Use `jj split` if a change grows too large
- Describe changes immediately with `jj describe`

---

**Priority Legend:**

- **P0** - Must have (launch blocker)
- **P1** - Should have (high value)
- **P2** - Nice to have (future consideration)
