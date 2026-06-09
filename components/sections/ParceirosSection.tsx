import Image from 'next/image'

import SectionHeader from '../ui/SectionHeader'

const parceiros = [
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
]

export default function ParceirosSection() {
  const track = [...parceiros, ...parceiros]

  return (
    <section id="parceiros" className="py-16 bg-cream-dk overflow-hidden">
      <div className="container-site">
        <SectionHeader
          title="Parceiros e Veículos de Comunicação"
          subtitle="Fontes de fé, informação e comunhão eclesial"
        />
      </div>

      <div className="overflow-hidden w-full" aria-label="Carrossel de parceiros">
        <div className="marquee-track">
          {track.map((parceiro, i) => (
            <a
              key={i}
              href={parceiro.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Acessar ${parceiro.nome}`}
              className="flex flex-col items-center gap-2 px-10 opacity-60 hover:opacity-100 transition-opacity duration-300 group"
            >
              <Image
                src={parceiro.logo}
                alt={parceiro.nome}
                width={120}
                height={60}
                className="object-contain max-h-[60px] w-auto grayscale group-hover:grayscale-0 transition-all duration-300"
              />
              <span className="text-xs font-semibold text-burgundy uppercase tracking-wide">
                Acessar
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
