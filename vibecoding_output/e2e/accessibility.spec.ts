import { test, expect } from './fixtures'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility', () => {
  test('dashboard has no accessibility violations', async ({ configuredPage: page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    // Log violations for debugging
    if (results.violations.length > 0) {
      console.log('Accessibility violations:', JSON.stringify(results.violations, null, 2))
    }

    expect(results.violations).toEqual([])
  })

  test('contrast ratios meet WCAG AA standards', async ({ configuredPage: page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .analyze()

    // Filter specifically for AA color contrast issues (4.5:1 ratio, not AAA 7:1)
    const contrastViolations = results.violations.filter(
      (v) => v.id === 'color-contrast'
    )

    if (contrastViolations.length > 0) {
      console.log('Contrast violations (WCAG AA - 4.5:1 ratio):')
      contrastViolations.forEach((violation) => {
        violation.nodes.forEach((node) => {
          console.log(`  - ${node.html}`)
          console.log(`    Impact: ${node.impact}`)
          console.log(`    Message: ${node.failureSummary}`)
        })
      })
    }

    expect(contrastViolations).toEqual([])
  })

  test('add goal form has no accessibility violations', async ({ configuredPage: page }) => {
    // Open add goal form
    await page.click('button:has-text("+ Add Goal")')
    await expect(page.locator('h3:has-text("New Goal")')).toBeVisible()

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    if (results.violations.length > 0) {
      console.log('Form accessibility violations:', JSON.stringify(results.violations, null, 2))
    }

    expect(results.violations).toEqual([])
  })

  test('parent settings modal has no accessibility violations', async ({ configuredPage: page }) => {
    const title = page.locator('h1:has-text("My Money")')

    // Open settings (5 taps)
    for (let i = 0; i < 5; i++) {
      await title.click()
      await page.waitForTimeout(100)
    }

    await expect(page.locator('h2:has-text("Parent Settings")')).toBeVisible()

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    if (results.violations.length > 0) {
      console.log('Settings modal accessibility violations:', JSON.stringify(results.violations, null, 2))
    }

    expect(results.violations).toEqual([])
  })
})
