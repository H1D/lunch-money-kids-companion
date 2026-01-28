import { test, expect } from '@playwright/test'

test.describe('Theme Picker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('h1:has-text("My Money")', { timeout: 10000 })
  })

  test('shows theme picker button on dashboard', async ({ page }) => {
    await expect(page.locator('button[aria-label="Change theme"]')).toBeVisible()
  })

  test('opens theme picker modal', async ({ page }) => {
    await page.click('button[aria-label="Change theme"]')
    await expect(page.locator('h2:has-text("Choose a Theme")')).toBeVisible()
  })

  test('displays all 5 theme options', async ({ page }) => {
    await page.click('button[aria-label="Change theme"]')

    await expect(page.locator('button[aria-label="Classic theme"]')).toBeVisible()
    await expect(page.locator('button[aria-label="Ocean theme"]')).toBeVisible()
    await expect(page.locator('button[aria-label="Forest theme"]')).toBeVisible()
    await expect(page.locator('button[aria-label="Sunset theme"]')).toBeVisible()
    await expect(page.locator('button[aria-label="Candy theme"]')).toBeVisible()
  })

  test('can select a theme and see background change', async ({ page }) => {
    await page.click('button[aria-label="Change theme"]')

    // Select Ocean theme
    await page.click('button[aria-label="Ocean theme"]')

    // HTML element should get data-theme attribute (auto-retries)
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'ocean')
  })

  test('can switch back to default theme', async ({ page }) => {
    // First set a non-default theme
    await page.click('button[aria-label="Change theme"]')
    await page.click('button[aria-label="Sunset theme"]')

    // Wait for the sunset theme to be applied
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'sunset')

    // Verify the Sunset button shows as selected before clicking Classic
    await expect(page.locator('button[aria-label="Sunset theme"]')).toHaveAttribute('aria-pressed', 'true')

    // Switch back to default
    await page.click('button[aria-label="Classic theme"]')

    // Classic should now be pressed
    await expect(page.locator('button[aria-label="Classic theme"]')).toHaveAttribute('aria-pressed', 'true')

    // data-theme attribute should be removed for default theme
    await expect(page.locator('html')).not.toHaveAttribute('data-theme')
  })

  test('can close theme picker', async ({ page }) => {
    await page.click('button[aria-label="Change theme"]')
    await expect(page.locator('h2:has-text("Choose a Theme")')).toBeVisible()

    await page.click('button[aria-label="Close theme picker"]')
    await expect(page.locator('h2:has-text("Choose a Theme")')).not.toBeVisible()
  })

  test('selected theme shows as pressed', async ({ page }) => {
    await page.click('button[aria-label="Change theme"]')

    // Classic should be selected by default
    const classicButton = page.locator('button[aria-label="Classic theme"]')
    await expect(classicButton).toHaveAttribute('aria-pressed', 'true')

    // Select Ocean
    await page.click('button[aria-label="Ocean theme"]')

    // Ocean should now be pressed
    const oceanButton = page.locator('button[aria-label="Ocean theme"]')
    await expect(oceanButton).toHaveAttribute('aria-pressed', 'true')

    // Classic should no longer be pressed
    await expect(classicButton).toHaveAttribute('aria-pressed', 'false')
  })
})
