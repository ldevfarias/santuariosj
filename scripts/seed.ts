import mysql from 'mysql2/promise'
import { readFileSync } from 'fs'
import { join } from 'path'

const conn = await mysql.createConnection({
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})

function readJson<T>(filename: string): T {
  return JSON.parse(readFileSync(join(process.cwd(), 'data', filename), 'utf-8')) as T
}

// ── missas ──────────────────────────────────────────────────────────────────
type MissaJson = { dia: string; icone: string; horarios: object[]; destaque?: boolean; programacao_semanal?: string[]; observacao?: string }
const missas = readJson<MissaJson[]>('missas.json')
for (const [i, m] of missas.entries()) {
  await conn.execute(
    'INSERT INTO missas (ordem, dia, destaque, icone, horarios, programacao_semanal, observacao) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [i, m.dia, m.destaque ?? false, m.icone, JSON.stringify(m.horarios), m.programacao_semanal ? JSON.stringify(m.programacao_semanal) : null, m.observacao ?? null]
  )
}
console.log('missas: OK')

// ── agenda ───────────────────────────────────────────────────────────────────
type AgendaJson = { dia: number; mes: string; titulo: string; hora: string; local: string; tipo: string }
const agenda = readJson<AgendaJson[]>('agenda.json')
for (const [i, a] of agenda.entries()) {
  await conn.execute(
    'INSERT INTO agenda (ordem, dia, mes, titulo, hora, local, tipo) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [i, a.dia, a.mes, a.titulo, a.hora, a.local, a.tipo]
  )
}
console.log('agenda: OK')

// ── noticias ─────────────────────────────────────────────────────────────────
type NoticiaJson = { titulo: string; categoria: string; data: string; resumo: string; imagem: string; destaque?: boolean }
const noticias = readJson<NoticiaJson[]>('noticias.json')
for (const [i, n] of noticias.entries()) {
  await conn.execute(
    'INSERT INTO noticias (ordem, titulo, categoria, data, conteudo, imagem, destaque) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [i, n.titulo, n.categoria, n.data, n.resumo, n.imagem, n.destaque ?? false]
  )
}
console.log('noticias: OK')

// ── sacramentos ──────────────────────────────────────────────────────────────
type SacramentoJson = {
  slug: string; nome: string; descricao: string; descricaoItalico?: boolean
  descricaoLonga: string; requisitos: string[]; agendamento: string
  agendamentoItens?: string[]; agendamentoContato?: string; cta?: string; href: string; icone: string
}
const sacramentos = readJson<SacramentoJson[]>('sacramentos.json')
for (const [i, s] of sacramentos.entries()) {
  await conn.execute(
    `INSERT INTO sacramentos
      (ordem, slug, nome, descricao, descricao_italico, descricao_longa, requisitos, agendamento, agendamento_itens, agendamento_contato, cta, href, icone)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      i, s.slug, s.nome, s.descricao, s.descricaoItalico ?? false,
      s.descricaoLonga, JSON.stringify(s.requisitos), s.agendamento,
      s.agendamentoItens ? JSON.stringify(s.agendamentoItens) : null,
      s.agendamentoContato ?? null, s.cta ?? null, s.href, s.icone,
    ]
  )
}
console.log('sacramentos: OK')

// ── grupos ───────────────────────────────────────────────────────────────────
type GrupoJson = { nome: string; descricao: string; icone: string; encontro?: string }
const grupos = readJson<GrupoJson[]>('grupos.json')
for (const [i, g] of grupos.entries()) {
  await conn.execute(
    'INSERT INTO grupos (ordem, nome, descricao, icone, encontro) VALUES (?, ?, ?, ?, ?)',
    [i, g.nome, g.descricao, g.icone, g.encontro ?? null]
  )
}
console.log('grupos: OK')

// ── bencao_dia (somente lista de devocoes) ───────────────────────────────────
type DevocaoJson = { lista: string[] }
const devocoes = readJson<DevocaoJson>('devocoes.json')
for (const [i, item] of devocoes.lista.entries()) {
  await conn.execute(
    'INSERT INTO bencao_dia (ordem, dia, mensagem, autor, imagem) VALUES (?, ?, ?, ?, ?)',
    [i, String(i + 1), item, '', '']
  )
}
console.log('bencao_dia: OK')

// ── episcopal ────────────────────────────────────────────────────────────────
type SacerdoteJson = { id: string; nome: string; titulo: string; cargo: string; foto: string; bio: string; bispo: boolean }
const sacerdotes = readJson<SacerdoteJson[]>('sacerdotes.json')
for (const [i, s] of sacerdotes.entries()) {
  const cargo = s.bispo ? 'bispo' : (s.cargo.toLowerCase().includes('reitor') ? 'reitor' : 'paroco_solidario')
  await conn.execute(
    'INSERT INTO episcopal (ordem, nome, titulo, cargo, biografia, foto) VALUES (?, ?, ?, ?, ?, ?)',
    [i, s.nome, s.titulo, cargo, s.bio, s.foto]
  )
}
console.log('episcopal: OK')

await conn.end()
console.log('\nSeed concluído com sucesso.')
