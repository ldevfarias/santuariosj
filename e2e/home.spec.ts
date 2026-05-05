import { expect, test } from '@playwright/test'

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('hero section is visible with main heading', async ({ page }) => {
    const hero = page.locator('#hero')
    await expect(hero).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toContainText('São José')
  })

  test('navigation header is visible', async ({ page }) => {
    const header = page.locator('#site-header')
    await expect(header).toBeVisible()
    await expect(
      page.getByRole('link', { name: /São José de Ribamar/i })
    ).toBeVisible()
  })

  test('contact section has a form', async ({ page }) => {
    await page.goto('/#contato')

    const form = page.locator('#contato form')
    await expect(form).toBeVisible()

    await expect(page.getByLabel(/Nome/i)).toBeVisible()
    await expect(page.getByLabel(/E-mail|Email/i)).toBeVisible()
    await expect(page.getByLabel(/Mensagem/i)).toBeVisible()

    const submitBtn = page.getByRole('button', { name: /Enviar|Envio/i })
    await expect(submitBtn).toBeVisible()
    await expect(submitBtn).toBeEnabled()
  })

  test('footer is present', async ({ page }) => {
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
  })

  test('sacramentos section exists', async ({ page }) => {
    const section = page.locator('#sacramentos')
    await expect(section).toBeVisible()
  })

  test('horarios section exists', async ({ page }) => {
    const section = page.locator('#horarios')
    await expect(section).toBeVisible()
  })
})
