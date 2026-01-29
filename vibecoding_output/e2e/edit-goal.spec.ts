import { test, expect } from '@playwright/test'

test.describe('Edit Goal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('h1:has-text("My Money")', { timeout: 10000 })
  })

  async function addGoal(page: import('@playwright/test').Page, name: string, amount: string) {
    await page.click('button:has-text("+ Add Goal")')
    await expect(page.locator('h3:has-text("New Goal")')).toBeVisible()
    await page.fill('input[placeholder*="iPad"]', name)
    await page.fill('input[type="number"]', amount)
    await page.click('button:has-text("Add Goal"):not([disabled])')
    await expect(page.locator(`text=${name}`)).toBeVisible()
  }

  test('can edit a goal by tapping the goal row', async ({ page }) => {
    await addGoal(page, 'Edit Test Goal', '200')

    // Tap the goal row to open edit form
    await page.click('button[aria-label="Edit goal Edit Test Goal"]')

    // Edit form should appear
    await expect(page.locator('h3:has-text("Edit Goal")')).toBeVisible()

    // Fields should be pre-populated
    const nameInput = page.locator('input[placeholder*="iPad"]')
    await expect(nameInput).toHaveValue('Edit Test Goal')

    const amountInput = page.locator('input[type="number"]')
    await expect(amountInput).toHaveValue('200')

    // Update the goal
    await nameInput.clear()
    await nameInput.fill('Updated Goal Name')
    await amountInput.clear()
    await amountInput.fill('350')

    // Save
    await page.click('button:has-text("Save")')

    // Verify updated values
    await expect(page.locator('text=Updated Goal Name')).toBeVisible()
    await expect(page.getByText('€350')).toBeVisible()
  })

  test('can cancel editing a goal', async ({ page }) => {
    await addGoal(page, 'Cancel Edit Goal', '100')

    // Tap goal row to open edit form
    await page.click('button[aria-label="Edit goal Cancel Edit Goal"]')
    await expect(page.locator('h3:has-text("Edit Goal")')).toBeVisible()

    // Cancel
    await page.click('button:has-text("Cancel")')

    // Edit form should disappear, goal should still be visible
    await expect(page.locator('h3:has-text("Edit Goal")')).not.toBeVisible()
    await expect(page.locator('text=Cancel Edit Goal')).toBeVisible()
  })

  test('can delete a goal from the edit form', async ({ page }) => {
    await addGoal(page, 'Delete Me Goal', '75')

    // Tap goal row to open edit form
    await page.click('button[aria-label="Edit goal Delete Me Goal"]')
    await expect(page.locator('h3:has-text("Edit Goal")')).toBeVisible()

    // Delete button should be visible inside the edit form
    await expect(page.locator('button[aria-label="Delete goal"]')).toBeVisible()

    // Accept the confirmation dialog
    page.on('dialog', (dialog) => dialog.accept())

    // Click delete
    await page.click('button[aria-label="Delete goal"]')

    // Goal should be removed
    await expect(page.locator('text=Delete Me Goal')).not.toBeVisible()
  })
})
