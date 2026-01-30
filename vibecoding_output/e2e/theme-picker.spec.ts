import { test, expect } from './fixtures'

test.describe('Theme Picker', () => {
  test('shows theme picker button on dashboard', async ({ configuredPage: page }) => {
    await expect(page.locator('button[aria-label="Open settings"]')).toBeVisible()
  })

  test('toggles inline theme picker panel', async ({ configuredPage: page }) => {
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

  test('displays all 7 theme presets and hue slider', async ({ configuredPage: page }) => {
    await page.click('button[aria-label="Open settings"]')

    // Check all preset buttons (Blue, Green, Orange, Rose, Purple, Teal, Amber)
    await expect(page.locator('button[aria-label="Blue theme"]')).toBeVisible()
    await expect(page.locator('button[aria-label="Green theme"]')).toBeVisible()
    await expect(page.locator('button[aria-label="Orange theme"]')).toBeVisible()
    await expect(page.locator('button[aria-label="Rose theme"]')).toBeVisible()
    await expect(page.locator('button[aria-label="Purple theme"]')).toBeVisible()
    await expect(page.locator('button[aria-label="Teal theme"]')).toBeVisible()
    await expect(page.locator('button[aria-label="Amber theme"]')).toBeVisible()

    // Check hue slider exists
    await expect(page.locator('input[aria-label="Custom hue"]')).toBeVisible()
  })

  test('can select a preset theme and see colors change', async ({ configuredPage: page }) => {
    await page.click('button[aria-label="Open settings"]')

    // Select Green theme (hue 145)
    await page.click('button[aria-label="Green theme"]')

    // CSS variable should be applied with green hue
    const bgColor = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--color-bg')
    )
    expect(bgColor).toContain('145')
  })

  test('hue slider changes theme colors in real-time', async ({ configuredPage: page }) => {
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

  test('bucket colors change with theme', async ({ configuredPage: page }) => {
    await page.click('button[aria-label="Open settings"]')

    // Get initial vault color
    const initialVaultBg = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--color-vault-bg')
    )

    // Change to a different theme
    await page.click('button[aria-label="Orange theme"]')

    // Vault color should be different now
    const newVaultBg = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--color-vault-bg')
    )

    expect(newVaultBg).not.toEqual(initialVaultBg)
  })

  test('selected preset shows as checked', async ({ configuredPage: page }) => {
    await page.click('button[aria-label="Open settings"]')

    // Blue should be selected by default (hue 230)
    const blueButton = page.locator('button[aria-label="Blue theme"]')
    await expect(blueButton).toHaveAttribute('aria-checked', 'true')

    // Select Green
    await page.click('button[aria-label="Green theme"]')

    // Green should now be checked
    const greenButton = page.locator('button[aria-label="Green theme"]')
    await expect(greenButton).toHaveAttribute('aria-checked', 'true')

    // Blue should no longer be checked
    await expect(blueButton).toHaveAttribute('aria-checked', 'false')
  })

  test('theme persists after page reload', async ({ configuredPage: page }) => {
    await page.click('button[aria-label="Open settings"]')
    await page.click('button[aria-label="Rose theme"]')

    // Wait for the theme to be applied and saved
    await expect(page.locator('button[aria-label="Rose theme"]')).toHaveAttribute('aria-checked', 'true')

    // Small delay to ensure IndexedDB write completes
    await page.waitForTimeout(300)

    // Reload the page
    await page.reload()
    await page.waitForSelector('h1:has-text("My Money")', { timeout: 10000 })

    // Open picker and verify Rose is still selected
    await page.click('button[aria-label="Open settings"]')
    await expect(page.locator('button[aria-label="Rose theme"]')).toHaveAttribute('aria-checked', 'true')
  })
})
