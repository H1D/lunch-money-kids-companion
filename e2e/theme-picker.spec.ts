import { test, expect } from '@playwright/test'

test.describe('Theme Picker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('h1:has-text("My Money")', { timeout: 10000 })
  })

  test('shows theme picker button on dashboard', async ({ page }) => {
    await expect(page.locator('button[aria-label="Open settings"]')).toBeVisible()
  })

  test('toggles inline theme picker panel', async ({ page }) => {
    const slider = page.locator('input[aria-label="Custom hue"]')

    // Initially slider is hidden (parent has max-height: 0)
    await expect(slider).toBeHidden()

    // Click to open
    await page.click('button[aria-label="Open settings"]')

    // Now slider is visible
    await expect(slider).toBeVisible()

    // Click again to close
    await page.click('button[aria-label="Open settings"]')

    // Slider hidden again
    await expect(slider).toBeHidden()
  })

  test('displays all 7 theme presets and hue slider', async ({ page }) => {
    await page.click('button[aria-label="Open settings"]')

    // Check all preset buttons
    await expect(page.locator('button[aria-label="Classic theme"]')).toBeVisible()
    await expect(page.locator('button[aria-label="Ocean theme"]')).toBeVisible()
    await expect(page.locator('button[aria-label="Forest theme"]')).toBeVisible()
    await expect(page.locator('button[aria-label="Sunset theme"]')).toBeVisible()
    await expect(page.locator('button[aria-label="Candy theme"]')).toBeVisible()
    await expect(page.locator('button[aria-label="Lavender theme"]')).toBeVisible()
    await expect(page.locator('button[aria-label="Lemon theme"]')).toBeVisible()

    // Check hue slider exists
    await expect(page.locator('input[aria-label="Custom hue"]')).toBeVisible()
  })

  test('can select a preset theme and see colors change', async ({ page }) => {
    await page.click('button[aria-label="Open settings"]')

    // Select Forest theme (hue 145)
    await page.click('button[aria-label="Forest theme"]')

    // CSS variable should be applied with forest hue
    const bgColor = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--color-bg')
    )
    expect(bgColor).toContain('145')
  })

  test('hue slider changes theme colors in real-time', async ({ page }) => {
    await page.click('button[aria-label="Open settings"]')

    const slider = page.locator('input[aria-label="Custom hue"]')

    // Move slider to hue 180
    await slider.fill('180')

    // CSS variable should reflect new hue
    const bgColor = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--color-bg')
    )
    expect(bgColor).toContain('180')
  })

  test('bucket colors change with theme', async ({ page }) => {
    await page.click('button[aria-label="Open settings"]')

    // Get initial vault color
    const initialVaultBg = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--color-vault-bg')
    )

    // Change to a different theme
    await page.click('button[aria-label="Sunset theme"]')

    // Vault color should be different now
    const newVaultBg = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--color-vault-bg')
    )

    expect(newVaultBg).not.toEqual(initialVaultBg)
  })

  test('selected preset shows as checked', async ({ page }) => {
    await page.click('button[aria-label="Open settings"]')

    // Classic should be selected by default (hue 220)
    const classicButton = page.locator('button[aria-label="Classic theme"]')
    await expect(classicButton).toHaveAttribute('aria-checked', 'true')

    // Select Ocean
    await page.click('button[aria-label="Ocean theme"]')

    // Ocean should now be checked
    const oceanButton = page.locator('button[aria-label="Ocean theme"]')
    await expect(oceanButton).toHaveAttribute('aria-checked', 'true')

    // Classic should no longer be checked
    await expect(classicButton).toHaveAttribute('aria-checked', 'false')
  })

  test('theme persists after page reload', async ({ page }) => {
    await page.click('button[aria-label="Open settings"]')
    await page.click('button[aria-label="Candy theme"]')

    // Wait for the theme to be applied and saved
    await expect(page.locator('button[aria-label="Candy theme"]')).toHaveAttribute('aria-checked', 'true')

    // Small delay to ensure IndexedDB write completes
    await page.waitForTimeout(300)

    // Reload the page
    await page.reload()
    await page.waitForSelector('h1:has-text("My Money")', { timeout: 10000 })

    // Open picker and verify Candy is still selected
    await page.click('button[aria-label="Open settings"]')
    await expect(page.locator('button[aria-label="Candy theme"]')).toHaveAttribute('aria-checked', 'true')
  })
})
