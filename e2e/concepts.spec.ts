import { expect, test } from '@playwright/test'

const conceptSlugs = [
  '01-elegant-minimal',
  '02-dark-luxury',
  '03-bright-playful',
  '04-rustic-warm',
  '05-modern-bold',
  '06-romantic-editorial',
  '07-artistic-photographic',
  '08-scandinavian-nature',
  '09-interactive-immersive',
  '10-local-boutique',
]

const brands = [
  'Petal & Bloom',
  'Fleur Noir',
  'Bloomy',
  'Willow & Fern',
  'PETAL',
  'Le Fleur',
  'FLORA',
  'VERDANT',
  'NOVA BLOOMS',
  'Sariwa Blooms',
]

test.describe('concept gallery and routes', () => {
  test('gallery loads all 10 concepts', async ({ page }) => {
    await page.goto('/concepts')
    await expect(page.getByRole('heading', { name: /10 flower shop concepts/i })).toBeVisible()
    for (const brand of brands) {
      await expect(page.getByRole('heading', { name: brand }).first()).toBeVisible()
    }
  })

  for (const slug of conceptSlugs) {
    test(`concept route loads: ${slug}`, async ({ page }) => {
      await page.goto(`/concepts/${slug}`)
      await expect(page.locator('header')).toBeVisible()
      await expect(page.locator('main')).toBeVisible()
      await expect(page.getByRole('link', { name: /shop|collection|enter|browse|grab/i }).first()).toBeVisible()
    })
  }

  test('gallery open homepage navigates to concept route', async ({ page }) => {
    await page.goto('/concepts')
    await page.getByRole('link', { name: 'Open homepage' }).first().click()
    await expect(page).toHaveURL(/\/concepts\/01-elegant-minimal/)
    await expect(page.getByRole('link', { name: /Petal & Bloom/i }).first()).toBeVisible()
  })

  test('footer concept switcher opens another concept', async ({ page }) => {
    await page.goto('/concepts/02-dark-luxury')
    await expect(page.getByRole('heading', { name: /cinematic blooms after dark/i })).toBeVisible()
    await page.getByRole('link', { name: '05', exact: true }).click()
    await expect(page).toHaveURL(/\/concepts\/05-modern-bold/)
    await expect(page.getByRole('heading', { name: /bloom\s*hard/i })).toBeVisible()
  })
})

test.describe('shopping flows', () => {
  test('shop page lists products', async ({ page }) => {
    await page.goto('/concepts/01-elegant-minimal')
    await page.goto('/shop')
    await expect(page.getByRole('heading', { name: /quiet blooms/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /add to cart/i }).first()).toBeVisible()
  })

  test('add to cart updates cart count and totals', async ({ page }) => {
    await page.goto('/concepts/01-elegant-minimal')
    await page.goto('/shop')
    await page.evaluate(() => localStorage.clear())
    await page.evaluate(() => localStorage.setItem('bloomco.concept', 'elegant-minimal'))
    await page.reload()

    await page.getByRole('button', { name: /add to cart/i }).first().click()
    await expect(page.getByText(/added to your cart/i)).toBeVisible({ timeout: 8000 })
    await page.goto('/cart')
    await expect(page.getByText(/₱1,/).first()).toBeVisible()
    await expect(page.getByRole('button', { name: /increase quantity/i })).toBeVisible()
  })

  test('checkout form validation requires fields', async ({ page }) => {
    await page.goto('/shop')
    await page.evaluate(() => {
      localStorage.clear()
      localStorage.setItem('bloomco.concept', 'elegant-minimal')
    })
    await page.reload()
    await page.getByRole('button', { name: /add to cart/i }).first().click()
    await expect(page.getByText(/added to your cart/i)).toBeVisible({ timeout: 8000 })
    await page.goto('/checkout')
    await expect(page.getByRole('heading', { name: /almost there/i })).toBeVisible()
    await page.getByRole('button', { name: /place order/i }).click()
    await expect(page).toHaveURL(/checkout/)
    await expect(page.getByText(/required|enter|please/i).first()).toBeVisible()
  })

  test('mobile navigation opens', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.getByRole('button', { name: /open menu/i }).click()
    await expect(page.getByRole('dialog', { name: /menu/i })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Shop' }).first()).toBeVisible()
  })

  test('mobile concept shop stays usable', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/concepts/09-interactive-immersive')
    await page.getByRole('button', { name: /open menu/i }).click()
    await page.getByRole('dialog', { name: /menu/i }).getByRole('link', { name: 'Shop' }).click()
    await expect(page).toHaveURL(/\/shop/)
    await expect(page.getByRole('heading', { name: /discover your bouquet/i })).toBeVisible()
    const noHorizontalBleed = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 2)
    expect(noHorizontalBleed).toBeTruthy()
  })

  test('category filter updates shop', async ({ page }) => {
    await page.goto('/concepts/01-elegant-minimal')
    await page.goto('/shop')
    const category = page.locator('select').filter({ has: page.locator('option', { hasText: 'Roses' }) }).first()
    await category.selectOption('roses')
    await expect(page).toHaveURL(/category=roses/)
  })

  test('shop layout changes across concepts', async ({ page }) => {
    await page.goto('/concepts/05-modern-bold')
    await expect(page.getByRole('heading', { name: /bloom\s*hard/i })).toBeVisible()
    await page.getByRole('link', { name: 'Shop', exact: true }).first().click()
    await expect(page).toHaveURL(/\/shop/)
    await expect(page.getByRole('heading', { name: /shop/i }).first()).toBeVisible()

    await page.goto('/concepts/10-local-boutique')
    await expect(page.getByRole('link', { name: /Sariwa Blooms/i }).first()).toBeVisible()
    await page.getByRole('link', { name: 'Shop', exact: true }).first().click()
    await expect(page.getByRole('heading', { name: /fresh from our studio/i })).toBeVisible()
  })
})
