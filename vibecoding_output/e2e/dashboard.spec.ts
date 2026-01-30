import { test, expect } from './fixtures'

test.describe('Dashboard', () => {
  test('displays all three money buckets', async ({ configuredPage: page }) => {
    // Check Long-term Savings
    await expect(page.locator('h2:has-text("Long-term Savings")')).toBeVisible()

    // Check Goal Savings
    await expect(page.locator('h2:has-text("Goal Savings")')).toBeVisible()

    // Check Free Spending
    await expect(page.locator('h2:has-text("Free Spending")')).toBeVisible()
  })

  test('shows balance amounts', async ({ configuredPage: page }) => {
    // Wait for balances to load - EUR format (use first() to avoid strict mode)
    await expect(page.locator('text=/€[\\d.,]+/').first()).toBeVisible()
  })

  test('shows last updated timestamp', async ({ configuredPage: page }) => {
    await expect(page.getByText(/Updated/)).toBeVisible()
  })
})

test.describe('Goals', () => {
  test('can add a new goal', async ({ configuredPage: page }) => {
    // Click Add Goal button
    await page.click('button:has-text("+ Add Goal")')

    // Wait for form to appear
    await expect(page.locator('h3:has-text("New Goal")')).toBeVisible()

    // Select emoji icon
    await page.click('button:has-text("🎮")')

    // Fill in goal name
    await page.fill('input[placeholder*="iPad"]', 'PlayStation 5')

    // Fill in amount
    await page.fill('input[type="number"]', '500')

    // Submit
    await page.click('button:has-text("Add Goal"):not([disabled])')

    // Verify goal appears
    await expect(page.locator('text=PlayStation 5')).toBeVisible()
    await expect(page.getByText('€500')).toBeVisible()
  })

  test('can cancel adding a goal', async ({ configuredPage: page }) => {
    // Click Add Goal
    await page.click('button:has-text("+ Add Goal")')

    // Wait for form
    await expect(page.locator('h3:has-text("New Goal")')).toBeVisible()

    // Click Cancel
    await page.click('button:has-text("Cancel")')

    // Form should disappear
    await expect(page.locator('h3:has-text("New Goal")')).not.toBeVisible()
  })

  test('shows progress bar for goals', async ({ configuredPage: page }) => {
    // First add a goal
    await page.click('button:has-text("+ Add Goal")')
    await page.fill('input[placeholder*="iPad"]', 'Test Goal')
    await page.fill('input[type="number"]', '100')
    await page.click('button:has-text("Add Goal"):not([disabled])')

    // Check progress indicator exists
    await expect(page.locator('text=Test Goal')).toBeVisible()
    await expect(page.getByText(/\d+%/).first()).toBeVisible()
  })
})

test.describe('Parent Settings', () => {
  test('opens settings after 5 taps on title', async ({ configuredPage: page }) => {
    const title = page.locator('h1:has-text("My Money")')

    // Tap 5 times quickly
    for (let i = 0; i < 5; i++) {
      await title.click()
      await page.waitForTimeout(100)
    }

    // Settings modal should appear
    await expect(page.locator('h2:has-text("Parent Settings")')).toBeVisible()
  })

  test('settings modal shows configuration fields', async ({ configuredPage: page }) => {
    const title = page.locator('h1:has-text("My Money")')

    // Open settings
    for (let i = 0; i < 5; i++) {
      await title.click()
      await page.waitForTimeout(100)
    }

    // Check that token field is visible (account fields require API mocking)
    await expect(page.getByText('Lunch Money API Token', { exact: true })).toBeVisible()

    // The token should be pre-filled from mock settings
    const tokenInput = page.locator('input[type="password"]')
    await expect(tokenInput).toHaveValue('test-token-for-e2e-testing')
  })

  test('can close settings modal', async ({ configuredPage: page }) => {
    const title = page.locator('h1:has-text("My Money")')

    // Open settings
    for (let i = 0; i < 5; i++) {
      await title.click()
      await page.waitForTimeout(100)
    }

    await expect(page.locator('h2:has-text("Parent Settings")')).toBeVisible()

    // Close modal
    await page.click('button:has-text("✕")')

    // Modal should disappear
    await expect(page.locator('h2:has-text("Parent Settings")')).not.toBeVisible()
  })
})

test.describe('Transactions', () => {
  test('shows recent transactions section in Free Spending', async ({ configuredPage: page }) => {
    // Use exact: true to match only "Recent" heading
    await expect(page.getByText('Recent', { exact: true })).toBeVisible()
  })
})
