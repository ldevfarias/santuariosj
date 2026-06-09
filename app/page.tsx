import type { Metadata } from 'next'

import CalendarioSection from '@/components/sections/CalendarioSection'
import CitacaoSection from '@/components/sections/CitacaoSection'
import ContatoSection from '@/components/sections/ContatoSection'
import DevocoesSection from '@/components/sections/DevocoesSection'
import HeroSection from '@/components/sections/HeroSection'
import MissasSection from '@/components/sections/MissasSection'
import NoticiasSection from '@/components/sections/NoticiasSection'
import ParceirosSection from '@/components/sections/ParceirosSection'
import PastoralSection from '@/components/sections/PastoralSection'
import SacramentosSection from '@/components/sections/SacramentosSection'
import SaoJoseSection from '@/components/sections/SaoJoseSection'
import SobreSection from '@/components/sections/SobreSection'
import NoticeBar from '@/components/ui/NoticeBar'
import PixCampanhaButton from '@/components/interactive/PixCampanhaButton'
import {
  getAgenda,
  getGrupos,
  getHero,
  getHeroSlides,
  getMissas,
  getNoticias,
  getSacramentos,
} from '@/lib/data'

export const metadata: Metadata = {
  title: 'Início',
  openGraph: {
    title: 'Santuário de São José de Ribamar',
    description:
      'Santuário de São José de Ribamar — Um lugar de fé, oração e encontro com Deus. Horários de missas, sacramentos e agenda litúrgica.',
    images: ['/img/og-home.jpg'],
  },
  alternates: { canonical: 'https://santuariosjoser.org.br' },
}

export default async function HomePage() {
  const [hero, heroSlides, missas, agenda, noticias, sacramentos, grupos] = await Promise.all([
    getHero(),
    getHeroSlides(),
    getMissas(),
    getAgenda(),
    getNoticias(),
    getSacramentos(),
    getGrupos(),
  ])

  return (
    <>
      <HeroSection hero={hero} slides={heroSlides} />
      <NoticeBar />
      <MissasSection missas={missas} />
      <CalendarioSection agenda={agenda} />
      <SobreSection />
      {noticias.length >= 2 && <NoticiasSection noticias={noticias} />}
      <ParceirosSection />
      <SaoJoseSection />
      <SacramentosSection sacramentos={sacramentos} />
      <PastoralSection grupos={grupos} />
      <DevocoesSection />
      <CitacaoSection />
      <ContatoSection />
      <PixCampanhaButton />
    </>
  )
}
