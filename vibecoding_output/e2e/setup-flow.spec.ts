import { test as baseTest, expect } from '@playwright/test'

// Setup Flow tests don't need API mocking - they test the welcome screen
baseTest.describe('Setup Flow', () => {
  baseTest.beforeEach(async ({ page }) => {
    // Clear IndexedDB to simulate first-time user
    await page.goto('/')
    await page.evaluate(() => {
      indexedDB.deleteDatabase('KidsLunchMoney')
    })
    await page.reload()
    await page.waitForLoadState('networkidle')
  })

  baseTest('shows welcome screen with title and disclaimer', async ({ page }) => {
    // Should show welcome screen when not configured
    await expect(page.getByText('Lunch Money Kids')).toBeVisible()
    await expect(page.getByText(/Companion app|Hulp-app|compagnon/i)).toBeVisible()
    await expect(page.getByText(/not affiliated|nicht|non affilié|no afiliado/i)).toBeVisible()
  })

  baseTest('shows tap instruction on welcome screen', async ({ page }) => {
    // Should show tap to setup instruction
    await expect(page.getByText(/tap.*💰|tik.*💰|Tippe.*💰|Toca.*💰/i)).toBeVisible()
  })

  baseTest('shows tap counter after first tap on moneybag', async ({ page }) => {
    const moneybag = page.locator('button:has-text("💰")')

    // Tap once
    await moneybag.click()

    // Should show "4 more taps" (or equivalent in other languages)
    await expect(page.getByText(/4.*more|nog.*4|encore.*4|más.*4|weitere.*4/i)).toBeVisible()
  })

  baseTest('opens parent settings after 5 taps on moneybag', async ({ page }) => {
    const moneybag = page.locator('button:has-text("💰")')

    // Tap 5 times
    for (let i = 0; i < 5; i++) {
      await moneybag.click()
      await page.waitForTimeout(100) // Small delay between taps
    }

    // Should show parent settings modal
    await expect(page.getByText(/Parent Settings|Ouder Instellingen|Paramètres Parents|Eltern-Einstellungen/i)).toBeVisible()
  })

  baseTest('tap counter resets after timeout', async ({ page }) => {
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

  baseTest('can close parent settings and return to welcome screen', async ({ page }) => {
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

// Dashboard Secret Tap tests - these check settings modal behavior
// Note: Account selector tests require API mocking which needs additional setup
baseTest.describe('Dashboard Secret Tap', () => {
  baseTest.beforeEach(async ({ page }) => {
    // Clear IndexedDB and reload
    await page.goto('/')
    await page.evaluate(() => {
      indexedDB.deleteDatabase('KidsLunchMoney')
    })
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Open settings via taps
    const moneybag = page.locator('button:has-text("💰")')
    for (let i = 0; i < 5; i++) {
      await moneybag.click()
      await page.waitForTimeout(100)
    }

    // Wait for settings modal
    await page.waitForSelector('text=/Parent Settings/i')
  })

  baseTest('parent settings modal shows token input', async ({ page }) => {
    // Check token field is visible (this doesn't require API mocking)
    await expect(page.getByText('Lunch Money API Token', { exact: true })).toBeVisible()
  })

  baseTest('token input starts empty', async ({ page }) => {
    // Token input should be empty initially for new users
    const tokenInput = page.getByPlaceholder(/Enter your API token|Voer je API token in/i)
    await expect(tokenInput).toBeVisible()
    await expect(tokenInput).toHaveValue('')
  })
})
