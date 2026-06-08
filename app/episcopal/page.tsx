import type { Metadata } from 'next'

import { getSacerdotes } from '@/lib/data'

import BishopHighlight from './components/BishopHighlight'
import EpiscopalHero from './components/EpiscopalHero'
import PriestsGrid from './components/PriestsGrid'

export const metadata: Metadata = {
  title: 'Corpo Episcopal | Santuário de São José de Ribamar',
  description: 'Conheça o bispo e os padres que pastoreiam o Santuário de São José de Ribamar.',
}

export default async function EpiscopalPage() {
  const sacerdotes = await getSacerdotes()

  const bispo    = sacerdotes.find(s => s.cargo === 'bispo')
  const padres   = sacerdotes.filter(s => s.cargo === 'reitor' || s.cargo === 'paroco_solidario')
  const diaconos = sacerdotes.filter(s => s.cargo === 'diacono')

  return (
    <main className="bg-cream min-h-screen">
      <EpiscopalHero />

      {bispo && <BishopHighlight bispo={bispo} />}

      <PriestsGrid title="Nossos Padres" items={padres} />

      <PriestsGrid title="Diáconos Permanentes" items={diaconos} />
    </main>
  )
}
