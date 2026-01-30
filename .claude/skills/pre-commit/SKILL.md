---
name: pre-commit
description: Before committing - analyze changes, suggest commit organization, check PRD freshness. Use when user says "commit", "ship it", or before any git commit.
allowed-tools: Bash, Read, Grep, Glob, AskUserQuestion
---

# Pre-Commit Review

Analyze current changes and help organize them properly before committing.

## Step 1: Gather State

Run these in parallel:
```bash
git status
```
```bash
git diff --stat
```
```bash
git log --oneline -15
```

Also read `vibecoding_output/AGENTS.md` to get:
- Commit categories definitions

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

**Single category** → Commit all together
**Multiple categories** → Consider splitting into separate commits:
1. Stage files by category using `git add <files>`
2. Commit each category separately with appropriate message
3. Or commit all together if changes are closely related

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

### Current Git State:
- Branch: [branch-name]
- Staged files: [list]
- Unstaged changes: [list]

### Recommendation:
[One of:]
- ✅ All changes fit one category - ready to commit
- ⚠️ Changes span categories - suggest splitting:
  1. [action with specific git commands]
  2. [action]

### PRD Status:
- ✅ No updates needed (reason)
- ⚠️ Consider updating: [specific sections]
```

## Step 6: Get Confirmation

Use AskUserQuestion with these options:
- "Proceed as recommended"
- "Commit everything together"
- "Let me reorganize manually first"

Only execute git commands after user confirms.
