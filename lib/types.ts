export type Horario = {
  hora: string
  desc: string
}

export type Missa = {
  dia: string
  destaque?: boolean
  icone: string
  horarios: Horario[]
}

export type AgendaItem = {
  dia: number
  mes: string
  titulo: string
  hora: string
  local: string
  tipo: 'festivo' | 'liturgico' | 'padroeiro'
}

export type Noticia = {
  id: string
  titulo: string
  categoria: string
  data: string
  resumo: string
  imagem: string
  destaque?: boolean
}

export type Sacramento = {
  id: string
  nome: string
  descricao: string
  cta: string
  href: string
  icone: string
}

export type Grupo = {
  nome: string
  descricao: string
  icone: string
}

export type Devocao = {
  nome: string
  descricao: string
  icone: string
}

export type DevoItem = {
  titulo: string
  descricao: string
  icone: string
}

export type ContactFormState = {
  success: boolean
  message: string
} | null
