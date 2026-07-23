import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('homepage carrega', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page).toHaveTitle(/IPI|Instituto/)
    await expect(page.locator('h1').first()).toBeVisible()
  })

  test('blog responde', async ({ page }) => {
    const res = await page.goto('http://localhost:3000/blog')
    expect(res?.status()).toBeLessThan(400)
    await expect(page.locator('h1').first()).toBeVisible()
  })
})
