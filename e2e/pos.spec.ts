import { expect, test, type Page } from '@playwright/test'

async function login(page: Page) {
  await page.goto('/admin/login')
  await page.getByLabel('Username').fill('owner')
  await page.getByLabel('Password').fill('demo123')
  await page.getByRole('button', { name: /enter pos/i }).click()
  await expect(page.getByTestId('pos-shell')).toBeVisible()
}

test.describe('Track B POS', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login')
    await page.evaluate(() => localStorage.clear())
  })

  test('demo login reaches dashboard', async ({ page }) => {
    await login(page)
    await expect(page.getByRole('heading', { name: /good (morning|afternoon|evening)/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /today’s orders|today's orders/i })).toBeVisible()
  })

  test('desktop sidebar is sticky and does not scroll away', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await login(page)
    const aside = page.locator('aside.pos-rail-border')
    await expect(aside).toBeVisible()
    await expect(aside).toHaveCSS('position', 'sticky')
    await page.evaluate(() => window.scrollTo(0, 600))
    const top = await aside.evaluate((el) => el.getBoundingClientRect().top)
    expect(top).toBeLessThanOrEqual(1)
  })

  test('create messenger order deducts stock immediately and shows payment remarks', async ({ page }) => {
    await login(page)

    await page.getByRole('navigation').getByRole('link', { name: /^inventory$/i }).click()
    const productCard = page.locator('article').filter({ hasText: 'Blush Romance' }).first()
    await expect(productCard.getByLabel('Set stock')).toBeVisible()
    const before = Number(await productCard.getByLabel('Set stock').inputValue())

    await page.getByRole('navigation').getByRole('link', { name: /new order/i }).click()
    await page.getByLabel('Customer name').fill('Playwright Customer')
    await page.getByLabel('Customer phone').fill('+63 900 111 2222')
    await page.getByLabel('Source').selectOption('messenger')
    await page.getByLabel('Fulfillment').selectOption('delivery')
    await page.getByLabel('Maxim / delivery fee').fill('120')
    await page.getByLabel('Payment status').selectOption('not_paid')
    await page.getByLabel('Product').selectOption('blush-romance')
    await page.getByLabel('Qty').fill('1')
    await page.getByRole('button', { name: /save order/i }).click()

    await expect(page).toHaveURL(/\/admin\/orders(?:\?|$)/)
    await expect(page.getByRole('heading', { name: /^orders$/i })).toBeVisible()
    await expect(page.getByTestId('order-log-table')).toBeVisible()
    await expect(page.getByText(/Playwright Customer/i).first()).toBeVisible()
    await expect(page.getByTestId('order-remarks').getByText(/Not paid/i).first()).toBeVisible()
    await expect(page.getByTestId('order-remarks').getByText(/For delivery/i).first()).toBeVisible()
    await expect(
      page.getByTestId('order-log-table').getByText(/Blush Romance|Pink rose|Lily|Yellow rose/i).first(),
    ).toBeVisible()

    await page.getByRole('navigation').getByRole('link', { name: /^inventory$/i }).click()
    const after = Number(await productCard.getByLabel('Set stock').inputValue())
    expect(after).toBe(before - 1)
  })

  test('save customization redirects to calendar', async ({ page }) => {
    await login(page)
    await page.getByRole('navigation').getByRole('link', { name: /^orders$/i }).click()
    await page.getByRole('link', { name: /POS-\d+|#\d+/ }).first().click()
    await expect(page).toHaveURL(/\/admin\/orders\/POS-/)
    await page.getByLabel('Card message').fill('Playwright card note')
    await page.getByRole('button', { name: /save changes/i }).click()
    await expect(page).toHaveURL(/\/admin\/calendar/)
  })

  test('orders filters include payment product category color', async ({ page }) => {
    await login(page)
    await page.getByRole('navigation').getByRole('link', { name: /^orders$/i }).click()
    await expect(page.getByRole('heading', { name: /^orders$/i })).toBeVisible()
    await expect(page.getByLabel('Schedule date')).toBeVisible()
    await expect(page.getByLabel('Location')).toBeVisible()
    await expect(page.getByLabel('Payment status')).toBeVisible()
    await expect(page.getByLabel('Time slot')).toBeVisible()
    await expect(page.getByLabel('Search order / customer')).toBeVisible()
    await expect(page.getByLabel('Flower type / category')).toBeVisible()
    await page.getByRole('button', { name: /more filters/i }).click()
    await expect(page.getByLabel('Source')).toBeVisible()
    await expect(page.getByLabel('Product')).toBeVisible()
    await expect(page.getByLabel('Color')).toBeVisible()
    await expect(page.getByLabel('Arrangement')).toBeVisible()
    await expect(page.getByLabel('Price')).toBeVisible()

    await page.getByRole('navigation').getByRole('link', { name: /flower tally/i }).click()
    await expect(page.getByRole('heading', { name: /flower tally/i })).toBeVisible()
    await expect(page.getByTestId('pos-bouquet-tally')).toBeVisible()
    await expect(page.getByTestId('pos-stem-tally')).toBeVisible()
    await expect(page.getByTestId('pos-funeral-tally')).toBeVisible()

    await page.getByRole('navigation').getByRole('link', { name: /calendar/i }).click()
    await expect(page.getByRole('heading', { name: /calendar/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /this week/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /google calendar/i }).first()).toBeVisible()
  })

  test('theme switch updates shell layout', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await login(page)
    await page.getByTestId('pos-theme-select').selectOption('peak-board')
    await expect(page.getByTestId('pos-shell')).toHaveAttribute('data-layout', 'kanban')
    await expect(page.getByTestId('peak-status-strip')).toBeVisible()

    await page.getByTestId('pos-theme-select').selectOption('night-shift')
    await expect(page.getByTestId('pos-shell')).toHaveAttribute('data-layout', 'night')
    await expect(page.getByTestId('night-week-strip')).toBeVisible()

    await page.goto('/admin/concepts')
    await page.getByTestId('pos-concept-counter-clear').click()
    await expect(page.getByTestId('pos-shell')).toHaveAttribute('data-layout', 'rail')
  })

  test('mobile nav opens drawer', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await login(page)
    await page.getByTestId('pos-mobile-menu').click()
    await expect(page.getByTestId('pos-mobile-drawer')).toBeVisible()
    await page.getByTestId('pos-mobile-drawer').getByRole('link', { name: /^inventory$/i }).click()
    await expect(page.getByRole('heading', { name: /inventory/i })).toBeVisible()
    await expect(page.getByTestId('pos-fab-new-order')).toBeVisible()
  })

  test('desktop hides FAB and inventory has product CRUD controls', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await login(page)
    await page.getByRole('navigation').getByRole('link', { name: /^inventory$/i }).click()
    await expect(page.getByRole('heading', { name: /inventory/i })).toBeVisible()
    await expect(page.getByTestId('pos-fab-new-order')).toBeHidden()

    await page.getByTestId('pos-add-product').click()
    await expect(page.getByTestId('pos-product-form')).toBeVisible()
    await expect(page.getByTestId('pos-product-save')).toHaveText(/create product/i)
    await page.getByTestId('pos-product-form').getByRole('button', { name: /^cancel$/i }).click()

    const firstCard = page.locator('article[data-testid^="pos-product-card-"]').first()
    await expect(firstCard.getByRole('button', { name: /^edit$/i })).toBeVisible()
    await expect(firstCard.getByRole('button', { name: /^delete$/i })).toBeVisible()
    await firstCard.getByRole('button', { name: /^edit$/i }).click()
    await expect(page.getByTestId('pos-product-form')).toBeVisible()
    await expect(page.getByTestId('pos-product-save')).toHaveText(/update product/i)
  })
})
