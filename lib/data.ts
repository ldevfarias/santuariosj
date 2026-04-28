import { readFileSync } from 'fs'
import { join } from 'path'

import type {
  AgendaItem,
  DevoItem,
  Grupo,
  Missa,
  Noticia,
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

export function getDevocoes(): { lista: string[]; cards: DevoItem[] } {
  return readJson<{ lista: string[]; cards: DevoItem[] }>('devocoes.json')
}
