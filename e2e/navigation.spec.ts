import { test, expect } from '@playwright/test'

test.describe('Page navigation', () => {
  test('home page loads', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Início/)
    await expect(page.locator('#hero')).toBeVisible()
  })

  test('/comunidades page loads', async ({ page }) => {
    await page.goto('/comunidades')
    await expect(page).toHaveTitle(/Comunidades/)
    await expect(page.getByRole('heading', { level: 1, name: /Comunidades/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Início|Voltar|Home/i }).first()).toBeVisible()
  })

  test('/secretaria page loads', async ({ page }) => {
    await page.goto('/secretaria')
    await expect(page).toHaveTitle(/Secretaria/)
    await expect(page.getByRole('heading', { level: 1, name: /Secretaria/i })).toBeVisible()
    await expect(page.locator('#atendimento-dos-padres')).toBeVisible()
    await expect(page.locator('#apoio-psicologico')).toBeVisible()
  })

  test('/episcopal page loads', async ({ page }) => {
    await page.goto('/episcopal')
    await expect(page).toHaveTitle(/Corpo Episcopal|Episcopal/)
    await expect(page.getByRole('main').first()).toBeVisible()
  })

  test('/sacramentos/baptism page loads', async ({ page }) => {
    await page.goto('/sacramentos/baptism')
    await expect(page).toHaveTitle(/Batismo/)
    await expect(page.getByRole('heading', { level: 1, name: /Batismo/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Requisitos/i })).toBeVisible()
  })

  test('/devocoes/house-of-miracles page loads', async ({ page }) => {
    await page.goto('/devocoes/house-of-miracles')
    await expect(page).toHaveTitle(/Casa dos Milagres/)
    await expect(page.getByRole('heading', { level: 1, name: /Casa dos Milagres/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Sobre este Espaço/i })).toBeVisible()
  })

  test('header navigation links are present', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('navigation', { name: /Navegação principal/i }).first()).toBeVisible()
  })

  test('404 page returns correctly for unknown route', async ({ page }) => {
    const response = await page.goto('/rota-que-nao-existe')
    expect(response?.status()).toBe(404)
  })
})
