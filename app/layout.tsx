import { Cinzel, Lora, Open_Sans } from 'next/font/google'

import type { Metadata } from 'next'

import BackToTop from '@/components/interactive/BackToTop'
import BencaoModal from '@/components/interactive/BencaoModal'
import PixWidget from '@/components/interactive/PixWidget'
import HashScrollFix from '@/components/interactive/HashScrollFix'
import ScrollReveal from '@/components/interactive/ScrollReveal'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import Topbar from '@/components/layout/Topbar'
import GoogleAnalytics from '@/components/scripts/GoogleAnalytics'

import './globals.css'

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-cinzel',
  display: 'swap',
})

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal'],
  variable: '--font-lora-var',
  display: 'swap',
  preload: false,
})

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-open-sans',
  display: 'swap',
  preload: false,
})

export const metadata: Metadata = {
  metadataBase: new URL('https://santuariosjoser.org.br'),
  title: {
    default: 'Santuário de São José de Ribamar',
    template: '%s | Santuário SJR',
  },
  description:
    'Santuário de São José de Ribamar — Um lugar de fé, oração e encontro com Deus. Horários de missas, sacramentos e agenda litúrgica.',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Santuário de São José de Ribamar',
  },
  robots: { index: true, follow: true },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'Church'],
  name: 'Santuário de São José de Ribamar',
  description: 'Santuário católico dedicado ao padroeiro do Maranhão, São José de Ribamar.',
  url: 'https://santuariosjoser.org.br',
  telephone: '+559832270000',
  email: 'contato@santuariosjoser.org.br',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Praça São José, s/n',
    addressLocality: 'São José de Ribamar',
    addressRegion: 'MA',
    postalCode: '65110-000',
    addressCountry: 'BR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -2.5655,
    longitude: -44.0588,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '07:00',
      closes: '19:30',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '07:00',
      closes: '19:30',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Sunday',
      opens: '07:00',
      closes: '18:30',
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${cinzel.variable} ${lora.variable} ${openSans.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <GoogleAnalytics />
      </head>
      <body>
        <Topbar />
        <Header />
        <main>{children}</main>
        <Footer />
        <BackToTop />
        <PixWidget />
        <ScrollReveal />
        <HashScrollFix />
        <BencaoModal />
      </body>
    </html>
  )
}
