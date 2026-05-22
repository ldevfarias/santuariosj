export type Bencao = {
  texto: string
  autor?: string
}

export const BENCAOS: Bencao[] = [
  {
    texto: 'Que São José te cubra com seu manto protetor e te guie neste dia com sabedoria e paz.',
    autor: 'Oração tradicional',
  },
  {
    texto: 'O Senhor te abençoe e te guarde. O Senhor faça resplandecer o seu rosto sobre ti e te conceda graça.',
    autor: 'Nm 6, 24-25',
  },
  {
    texto: 'Que a intercessão de São José, esposo da Virgem Maria e padroeiro do Maranhão, alcance para ti bênçãos abundantes.',
    autor: 'Oração do Santuário',
  },
  {
    texto: 'Vai em paz. Que a paz do Senhor Jesus Cristo permaneça contigo e com todos os que amas.',
    autor: 'Despedida litúrgica',
  },
  {
    texto: 'São José, modelo de fé silenciosa e trabalho fiel, interceda por ti e por tua família neste dia.',
    autor: 'Devoção popular',
  },
  {
    texto: 'Que a graça de Deus Pai, o amor de Jesus Cristo e a comunhão do Espírito Santo estejam contigo.',
    autor: '2 Cor 13, 13',
  },
  {
    texto: 'Busca primeiro o Reino de Deus e a sua justiça, e todas as demais coisas te serão dadas em acréscimo.',
    autor: 'Mt 6, 33',
  },
  {
    texto: 'Que São José, que cuidou de Jesus com amor e fidelidade, cuide também da tua família hoje e sempre.',
    autor: 'Oração dos peregrinos',
  },
  {
    texto: 'O Senhor é o teu pastor e nada te faltará. Que esta certeza te fortaleça ao longo do dia.',
    autor: 'Sl 23, 1',
  },
  {
    texto: 'Recebe esta bênção do Santuário de São José de Ribamar: que a paz, a fé e a esperança nunca te abandonem.',
    autor: 'Bênção do Santuário',
  },
]

export const IMAGENS_SANTO: string[] = [
  '/img/bencao/domingo.jpg',
  '/img/bencao/segunda.jpg',
  '/img/bencao/terca.jpg',
  '/img/bencao/quarta.jpg',
  '/img/bencao/quinta.jpg',
  '/img/bencao/sexta.jpg',
  '/img/bencao/sabado.jpg',
]

export function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}
