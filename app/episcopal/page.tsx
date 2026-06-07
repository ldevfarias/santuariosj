import type { Metadata } from 'next'

import { getSacerdotes } from '@/lib/data'
import type { Sacerdote } from '@/lib/types'

import BishopHighlight from './components/BishopHighlight'
import EpiscopalHero from './components/EpiscopalHero'
import PriestsGrid from './components/PriestsGrid'

export const metadata: Metadata = {
  title: 'Corpo Episcopal | Santuário de São José de Ribamar',
  description: 'Conheça o bispo e os padres que pastoreiam o Santuário de São José de Ribamar.',
}

export default async function EpiscopalPage() {
  const sacerdotes = await getSacerdotes()
  const bispo = sacerdotes.find((s) => s.bispo)
  const padres = sacerdotes.filter((s) => !s.bispo)
  const diaconos: Sacerdote[] = [
    {
      id: 'diacono-jose-luis-santos-matos',
      nome: 'José Luís Santos Matos',
      titulo: 'Diác.',
      cargo: 'Diácono Permanente',
      foto: '/img/diacono_jose.PNG',
      bio: 'Diácono permanente a serviço do Santuário de São José de Ribamar, colaborando na vida litúrgica e pastoral da comunidade.',
      bispo: false,
    },
    {
      id: 'diacono-raimundo-nonato-ramos-pereira',
      nome: 'Raimundo Nonato Ramos Pereira',
      titulo: 'Diác.',
      cargo: 'Diácono Permanente',
      foto: '/img/diacono_raimundo.PNG',
      bio: 'Diácono permanente a serviço do Santuário de São José de Ribamar, colaborando na evangelização, na caridade e no cuidado pastoral dos fiéis.',
      bispo: false,
    },
    {
      id: 'diacono-werley-da-costa-leite',
      nome: 'Werley da Costa Leite',
      titulo: 'Diác.',
      cargo: 'Diácono Permanente',
      foto: '/img/diacono_werley.PNG',
      bio: 'Diácono permanente a serviço do Santuário de São José de Ribamar, participando das ações missionárias e do acompanhamento espiritual da comunidade.',
      bispo: false,
    },
  ]

  return (
    <main className="bg-cream min-h-screen">
      <EpiscopalHero />

      {bispo && <BishopHighlight bispo={bispo} />}

      <PriestsGrid title="Nossos Padres" items={padres} />

      <PriestsGrid title="Diáconos Permanentes" items={diaconos} />
    </main>
  )
}
