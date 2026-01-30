import { test, expect } from './fixtures'

test.describe('Goal Celebration', () => {
  test('shows confetti and Ready text for affordable goal', async ({ configuredPage: page }) => {
    // Add a goal that's less than or equal to the current goals balance
    // The mock goals balance is €350, so a €50 goal should be affordable
    await page.click('button:has-text("+ Add Goal")')
    await page.fill('input[placeholder*="iPad"]', 'Cheap Item')
    await page.fill('input[type="number"]', '50')
    await page.click('button:has-text("Add Goal"):not([disabled])')

    // Wait for goal to appear
    await expect(page.locator('text=Cheap Item')).toBeVisible()

    // Should show "Ready! 🎉" text
    await expect(page.getByText('Ready!')).toBeVisible()

    // Should show confetti particles
    await expect(page.locator('.confetti-container')).toBeVisible()
    await expect(page.locator('.confetti-particle').first()).toBeVisible()
  })

  test('shows 100% progress for affordable goal', async ({ configuredPage: page }) => {
    await page.click('button:has-text("+ Add Goal")')
    await page.fill('input[placeholder*="iPad"]', 'Tiny Goal')
    await page.fill('input[type="number"]', '10')
    await page.click('button:has-text("Add Goal"):not([disabled])')

    await expect(page.locator('text=Tiny Goal')).toBeVisible()
    await expect(page.getByText('100%')).toBeVisible()
  })

  test('does not show confetti for unaffordable goal', async ({ configuredPage: page }) => {
    // Add a goal that costs more than the balance (€350)
    await page.click('button:has-text("+ Add Goal")')
    await page.fill('input[placeholder*="iPad"]', 'Expensive Item')
    await page.fill('input[type="number"]', '9999')
    await page.click('button:has-text("Add Goal"):not([disabled])')

    await expect(page.locator('text=Expensive Item')).toBeVisible()

    // Should NOT show "Ready!" text for this goal
    // Check the goal row doesn't have confetti
    const goalRow = page.locator('text=Expensive Item').locator('..')
    await expect(goalRow.locator('.confetti-container')).not.toBeVisible()
  })
})
