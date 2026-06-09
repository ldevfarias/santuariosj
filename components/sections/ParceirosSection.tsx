import Image from 'next/image'

import SectionHeader from '../ui/SectionHeader'

type Parceiro = {
  nome: string
  logo?: string
  url?: string
}

const parceiros: Parceiro[] = [
  {
    nome: 'Vatican News',
    logo: '/img/parceiros/vatican-news.webp',
    url: 'https://www.vaticannews.va/pt.html',
  },
  {
    nome: 'Rádio Educadora',
    logo: '/img/parceiros/educadora-fm-catolica.webp',
    url: 'https://educadora560.com.br/',
  },
  {
    nome: 'Arquidiocese de São Luís',
    logo: '/img/parceiros/arquidiocese.webp',
    url: 'https://arquislz.org.br/',
  },
  {
    nome: 'CNBB',
    logo: '/img/parceiros/cnbb.webp',
    url: 'https://www.cnbb.org.br/',
  },
  {
    nome: 'Fundação Dom Delgado',
  },
]

export default function ParceirosSection() {
  return (
    <section id="parceiros" className="py-16 bg-cream-dk overflow-hidden">
      <div className="container-site">
        <SectionHeader
          title="Parceiros e Veículos de Comunicação"
          subtitle="Fontes de fé, informação e comunhão eclesial"
        />

        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {parceiros.map((parceiro) =>
            parceiro.url && parceiro.logo ? (
              <a
                key={parceiro.nome}
                href={parceiro.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Acessar ${parceiro.nome}`}
                className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity duration-300 group"
              >
                <Image
                  src={parceiro.logo}
                  alt={parceiro.nome}
                  width={120}
                  height={60}
                  className="object-contain max-h-15 w-auto grayscale group-hover:grayscale-0 transition-all duration-300"
                />
                <span className="text-xs font-semibold text-burgundy uppercase tracking-wide">
                  Acessar
                </span>
              </a>
            ) : (
              <div
                key={parceiro.nome}
                className="flex flex-col items-center justify-center gap-2 opacity-60"
              >
                <span className="flex h-15 max-w-35 items-center justify-center text-center font-serif text-base font-bold uppercase leading-tight tracking-wide text-burgundy">
                  {parceiro.nome}
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  )
}
