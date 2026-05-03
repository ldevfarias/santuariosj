import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'

import type {
    AgendaItem,
    Comunidade,
    DevocaoPage,
    DevoItem,
    Grupo,
    Historia,
    Missa,
    Noticia,
    Sacerdote,
    Sacramento,
} from './types'

function readJson<T>(filename: string): T {
  const filepath = join(process.cwd(), 'data', filename)
  return JSON.parse(readFileSync(filepath, 'utf-8')) as T
}

export function getMissas(): Missa[] {
  return readJson<Missa[]>('missas.json')
}

export function getAgenda(): AgendaItem[] {
  return readJson<AgendaItem[]>('agenda.json')
}

export function getNoticias(): Noticia[] {
  return readJson<Noticia[]>('noticias.json')
}

export function getSacramentos(): Sacramento[] {
  return readJson<Sacramento[]>('sacramentos.json')
}

export function getGrupos(): Grupo[] {
  return readJson<Grupo[]>('grupos.json')
}

export function getComunidades(): Comunidade[] {
  return readJson<Comunidade[]>('comunidades.json')
}

export function getDevocoes(): { lista: string[]; cards: DevoItem[] } {
  return readJson<{ lista: string[]; cards: DevoItem[] }>('devocoes.json')
}

export function getDevocoesPages(): DevocaoPage[] {
  return readJson<DevocaoPage[]>('devocoes-pages.json')
}

export function getDevocaoPage(slug: string): DevocaoPage | undefined {
  return getDevocoesPages().find((item) => item.slug === slug)
}

export function getDevocaoGalleryImages(slug: string): string[] {
  if (slug !== 'ex-voto-museum') return []

  const imagesDir = join(process.cwd(), 'public', 'img')
  return readdirSync(imagesDir)
    .filter((file) => /^museu_\d+\.(png|jpe?g|webp|avif)$/i.test(file))
    .sort((a, b) => a.localeCompare(b, 'pt-BR', { numeric: true }))
    .map((file) => `/img/${file}`)
}

export function getHistoria(): Historia {
  return readJson<Historia>('historia.json')
}

export function getSacramento(slug: string): Sacramento | undefined {
  return getSacramentos().find((s) => s.slug === slug)
}

export function getSacerdotes(): Sacerdote[] {
  return readJson<Sacerdote[]>('sacerdotes.json')
}
