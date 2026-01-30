---
name: pre-commit
description: Before committing - analyze changes, suggest jj distribution across change categories, check PRD freshness. Use when user says "commit", "ship it", or before any jj commit.
allowed-tools: Bash, Read, Grep, Glob, AskUserQuestion
---

# Pre-Commit Review

Analyze current changes and help organize them properly before committing.

## Step 1: Gather State

Run these in parallel:
```bash
jj st
```
```bash
jj diff --stat
```
```bash
jj log -r 'all()' --limit 15
```

Also read `vibecoding_output/AGENTS.md` to get:
- Change categories definitions
- Active changes table with change IDs

## Step 2: Categorize Each Changed File

Map each modified file to exactly one category:

| Category | Files/Patterns |
|----------|----------------|
| **parent settings** | ParentSettings*, API config, account selection |
| **color theming** | theme*, color*, OKLCH, palette |
| **i18n** | i18n/*, locales/*, translations |
| **devops** | configs, CI/CD, .github/*, testing, linting, .claude/* |
| **a11y** | accessibility fixes, aria-*, keyboard handlers |
| **core** | general app functionality not fitting above |

## Step 3: Analyze Distribution

Determine if changes should be split:

**Single category** → Commit to current change or appropriate existing change
**Multiple categories** → Need to distribute:
1. Check Active Changes table for existing change IDs per category
2. Plan which files go to which jj change
3. May need `jj new` for categories without active changes

## Step 4: Check PRD Freshness

Scan the changes for PRD-relevant updates:
- New user-facing features? → Update Section 3.1 (Functional Requirements)
- New dependencies? → Update Section 4.4 (Technical Approach)
- Changed user flows? → Update Section 4.2 (User Flows)
- Scope changes? → Update Section 5.1/5.2 (In/Out of Scope)

If changes are purely internal (refactoring, a11y, devops), PRD likely doesn't need updates.

## Step 5: Present Summary

Format your analysis:

```
## Pre-Commit Analysis

### Files by Category:
- **[category]**: file1, file2
- **[category]**: file3

### Current jj State:
- Working on change: [change-id] "[description]"
- Relevant active changes: [list from AGENTS.md]

### Recommendation:
[One of:]
- ✅ All changes fit current change - ready to commit
- ⚠️ Changes span categories - suggest splitting:
  1. [action with specific jj commands]
  2. [action]

### PRD Status:
- ✅ No updates needed (reason)
- ⚠️ Consider updating: [specific sections]
```

## Step 6: Get Confirmation

Use AskUserQuestion with these options:
- "Proceed as recommended"
- "Commit everything to current change"
- "Let me reorganize manually first"

Only execute jj commands after user confirms.
