# i18n Implementation Plan

## Overview

Add type-safe internationalization with 7 Western European languages. Replace the theme picker button with a settings/wrench icon that opens a panel containing both theme and language selection.

## Type-Safe Approach

**Custom TypeScript-first solution** (no external dependencies):

```typescript
// 1. Define translation shape with nested keys
type Translations = {
  app: { title: string; loading: string; tagline: string; getStarted: string }
  buckets: {
    vault: { title: string; subtitle: string }
    goals: { title: string; subtitle: string }
    spending: { title: string; subtitle: string }
  }
  // ... all keys defined here
}

// 2. All locales must implement the full shape
const translations: Record<Locale, Translations> = {
  en: { /* full implementation */ },
  es: { /* full implementation */ },
  // TypeScript ERROR if any key missing
}

// 3. Type-safe accessor with autocomplete
function t<K extends keyof Translations>(section: K): Translations[K]
```

This approach:
- Zero runtime dependencies
- Compile-time safety - missing keys = TypeScript error
- Full autocomplete in IDE
- Small bundle size

## Languages

| Code | Language | Native Name |
|------|----------|-------------|
| en | English | English |
| es | Spanish | Español |
| nl | Dutch | Nederlands |
| fr | French | Français |
| it | Italian | Italiano |
| de | German | Deutsch |
| pt | Portuguese | Português |

## New Files

### 1. `src/lib/i18n.ts`

Core i18n module:

```typescript
export type Locale = 'en' | 'es' | 'nl' | 'fr' | 'it' | 'de' | 'pt'

export const LOCALES: { code: Locale; name: string; native: string }[]

export type Translations = {
  app: {
    title: string
    tagline: string
    loading: string
    getStarted: string
  }
  header: {
    myMoney: string
    settings: string
  }
  buckets: {
    vault: { title: string; subtitle: string }
    goals: { title: string; subtitle: string; addGoal: string; noGoals: string; recent: string }
    spending: { title: string; subtitle: string; noTransactions: string }
  }
  goals: {
    newGoal: string
    editGoal: string
    pickIcon: string
    savingFor: string
    savingForPlaceholder: string
    howMuch: string
    cancel: string
    save: string
    addGoal: string
    delete: string
    deleteConfirm: string
    ready: string
  }
  transactions: {
    uncategorized: string
    unknown: string
    today: string
    yesterday: string
  }
  time: {
    justNow: string
    minutesAgo: string  // "{n}m ago"
    hoursAgo: string    // "{n}h ago"
    updated: string     // "Updated {time}"
  }
  settings: {
    title: string
    theme: string
    language: string
    dragToPickColor: string
    parentSettings: string
  }
  parentSettings: {
    title: string
    description: string
    apiToken: string
    apiTokenPlaceholder: string
    savingsAccount: string
    goalsAccount: string
    spendingAccount: string
    accountPlaceholder: string
    saving: string
    saveSettings: string
    fillAllFields: string
    tokenHelp: string
  }
  errors: {
    loadFailed: string
    checkSettings: string
  }
  a11y: {
    changeTheme: string
    openSettings: string
    closeSettings: string
    editGoal: string
    deleteGoal: string
    customHue: string
    themePresets: string
  }
}

export const translations: Record<Locale, Translations>

// Detect browser locale, fallback to 'en'
export function detectLocale(): Locale

// Get translation for current locale
export function getTranslations(locale: Locale): Translations
```

### 2. `src/lib/translations/en.ts`, `es.ts`, etc.

Each language in its own file for maintainability:

```typescript
// en.ts
import type { Translations } from '../i18n'

export const en: Translations = {
  app: {
    title: 'Kids Lunch Money',
    // ...
  }
}
```

### 3. `src/hooks/useLocale.ts`

Hook for locale management:

```typescript
export function useLocale() {
  // Returns { locale, setLocale, t }
  // t is the translation object for current locale
}
```

### 4. `src/components/SettingsPanel.tsx`

New unified settings panel (replaces ThemePicker):

```typescript
interface SettingsPanelProps {
  isOpen: boolean
}

// Contains:
// - Language selector (flags or dropdown)
// - Theme presets
// - Hue slider
// - "Drag to pick any color" text (translated)
```

## Modified Files

### 1. `src/lib/db.ts`

Add locale to Preferences:

```typescript
export interface Preferences {
  id: number
  themeHue: number
  locale: Locale | null  // null = auto-detect
  updatedAt: Date
}

// Update getPreferences default
return { id: 1, themeHue: 220, locale: null, updatedAt: new Date() }
```

### 2. `src/components/Dashboard.tsx`

- Import `useLocale` hook
- Replace 🎨 button with ⚙️ (wrench/gear) button
- Replace `<ThemePicker>` with `<SettingsPanel>`
- Use `t.header.myMoney` instead of "My Money"
- Use `t.buckets.vault.title` etc. for bucket cards
- All other hardcoded strings → translation keys

### 3. `src/App.tsx`

- Wrap app in locale provider context
- Use translations for welcome screen

### 4. `src/components/GoalProgress.tsx`

- Use `t.goals.ready`, `t.buckets.goals.noGoals`

### 5. `src/components/AddGoalForm.tsx`

- Use `t.goals.*` translations

### 6. `src/components/EditGoalForm.tsx`

- Use `t.goals.*` translations

### 7. `src/components/TransactionList.tsx`

- Use `t.transactions.*` translations

### 8. `src/components/LastUpdated.tsx`

- Use `t.time.*` translations with interpolation

### 9. `src/components/ParentSettings.tsx`

- Use `t.parentSettings.*` translations

## UI Design

### Settings Button
- Location: Header, where theme button currently is
- Icon: ⚙️ (gear/cog) or 🔧 (wrench)
- aria-label: "Settings" (translated)

### Settings Panel
```
┌─────────────────────────────────────┐
│  ⚙️ Settings                        │
├─────────────────────────────────────┤
│  Language                           │
│  [🇬🇧] [🇪🇸] [🇳🇱] [🇫🇷] [🇮🇹] [🇩🇪] [🇵🇹] │
│                                     │
│  Theme                              │
│  [●] [●] [●] [●] [●] [●] [●]       │
│  ═══════════════════════════● [●]   │
│  Drag to pick any color             │
└─────────────────────────────────────┘
```

## Language Detection

1. Check `Preferences.locale` in IndexedDB
2. If `null`, detect from `navigator.language`
3. Match `navigator.language` to supported locales:
   - "en-US", "en-GB", "en" → 'en'
   - "es-ES", "es-MX", "es" → 'es'
   - "nl-NL", "nl-BE", "nl" → 'nl'
   - etc.
4. Fallback to 'en' if no match

## Interpolation

For strings with variables like "{n}m ago":

```typescript
// In translations
minutesAgo: '{n}m ago'

// Usage helper
function interpolate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ''))
}

// Usage
interpolate(t.time.minutesAgo, { n: 5 }) // "5m ago"
```

## Implementation Order

1. Create `src/lib/i18n.ts` with types and English translations
2. Add all 7 language translation files
3. Update `src/lib/db.ts` with locale field
4. Create `src/hooks/useLocale.ts`
5. Create `src/components/SettingsPanel.tsx`
6. Update `src/components/Dashboard.tsx`
7. Update all other components one by one
8. Update `src/App.tsx`
9. Update e2e tests
10. Run verification

## Files to Create
- `src/lib/i18n.ts`
- `src/lib/translations/en.ts`
- `src/lib/translations/es.ts`
- `src/lib/translations/nl.ts`
- `src/lib/translations/fr.ts`
- `src/lib/translations/it.ts`
- `src/lib/translations/de.ts`
- `src/lib/translations/pt.ts`
- `src/hooks/useLocale.ts`
- `src/components/SettingsPanel.tsx`

## Files to Modify
- `src/lib/db.ts`
- `src/components/Dashboard.tsx`
- `src/components/GoalProgress.tsx`
- `src/components/AddGoalForm.tsx`
- `src/components/EditGoalForm.tsx`
- `src/components/TransactionList.tsx`
- `src/components/LastUpdated.tsx`
- `src/components/ParentSettings.tsx`
- `src/components/ThemePicker.tsx` (merge into SettingsPanel, then delete)
- `src/App.tsx`
- `e2e/theme-picker.spec.ts` → `e2e/settings-panel.spec.ts`

## Verification

1. `pnpm tsc --noEmit` — no type errors
2. `pnpm exec playwright test` — all tests pass
3. `pnpm test:a11y` — accessibility tests pass
4. Manual: verify each language displays correctly
