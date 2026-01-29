import { test, expect } from '@playwright/test'

test.describe('Setup Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear IndexedDB to simulate first-time user
    await page.goto('/')
    await page.evaluate(() => {
      indexedDB.deleteDatabase('kids-lunch-money')
    })
    await page.reload()
    await page.waitForLoadState('networkidle')
  })

  test('shows welcome screen with title and disclaimer', async ({ page }) => {
    // Should show welcome screen when not configured
    await expect(page.getByText('Lunch Money Kids')).toBeVisible()
    await expect(page.getByText(/Companion app|Hulp-app|compagnon/i)).toBeVisible()
    await expect(page.getByText(/not affiliated|nicht|non affilié|no afiliado/i)).toBeVisible()
  })

  test('shows tap instruction on welcome screen', async ({ page }) => {
    // Should show tap to setup instruction
    await expect(page.getByText(/tap.*💰|tik.*💰|Tippe.*💰|Toca.*💰/i)).toBeVisible()
  })

  test('shows tap counter after first tap on moneybag', async ({ page }) => {
    const moneybag = page.locator('button:has-text("💰")')

    // Tap once
    await moneybag.click()

    // Should show "4 more taps" (or equivalent in other languages)
    await expect(page.getByText(/4.*more|nog.*4|encore.*4|más.*4|weitere.*4/i)).toBeVisible()
  })

  test('opens parent settings after 5 taps on moneybag', async ({ page }) => {
    const moneybag = page.locator('button:has-text("💰")')

    // Tap 5 times
    for (let i = 0; i < 5; i++) {
      await moneybag.click()
      await page.waitForTimeout(100) // Small delay between taps
    }

    // Should show parent settings modal
    await expect(page.getByText(/Parent Settings|Ouder Instellingen|Paramètres Parents|Eltern-Einstellungen/i)).toBeVisible()
  })

  test('tap counter resets after timeout', async ({ page }) => {
    const moneybag = page.locator('button:has-text("💰")')

    // Tap twice
    await moneybag.click()
    await moneybag.click()

    // Should show "3 more taps"
    await expect(page.getByText(/3.*more|nog.*3|encore.*3/i)).toBeVisible()

    // Wait for timeout (2 seconds + buffer)
    await page.waitForTimeout(2500)

    // Counter should reset - back to showing tap instruction
    await expect(page.getByText(/tap.*💰|tik.*💰/i)).toBeVisible()
  })

  test('can close parent settings and return to welcome screen', async ({ page }) => {
    const moneybag = page.locator('button:has-text("💰")')

    // Open settings with 5 taps
    for (let i = 0; i < 5; i++) {
      await moneybag.click()
      await page.waitForTimeout(100)
    }

    // Settings should be visible
    await expect(page.getByText(/Parent Settings/i)).toBeVisible()

    // Close settings
    await page.getByRole('button', { name: /close/i }).click()

    // Should return to welcome screen
    await expect(page.getByText('Lunch Money Kids')).toBeVisible()
  })
})

test.describe('Dashboard Secret Tap', () => {
  test.beforeEach(async ({ page }) => {
    // Set up mock configuration so we see the dashboard
    await page.goto('/')
    await page.evaluate(() => {
      // Clear existing DB
      indexedDB.deleteDatabase('kids-lunch-money')
    })
    await page.reload()

    // Open settings via taps
    const moneybag = page.locator('button:has-text("💰")')
    for (let i = 0; i < 5; i++) {
      await moneybag.click()
      await page.waitForTimeout(100)
    }

    // Wait for settings modal
    await page.waitForSelector('text=/Parent Settings/i')
  })

  test('parent settings modal has required fields', async ({ page }) => {
    await expect(page.getByText(/API Token/i)).toBeVisible()
    await expect(page.getByText(/Long-term Savings Account/i)).toBeVisible()
    await expect(page.getByText(/Goal Savings Account/i)).toBeVisible()
    await expect(page.getByText(/Free Spending Account/i)).toBeVisible()
  })

  test('save button is disabled without required fields', async ({ page }) => {
    const saveButton = page.getByRole('button', { name: /Save Settings|Instellingen Opslaan/i })
    await expect(saveButton).toBeDisabled()
  })
})
