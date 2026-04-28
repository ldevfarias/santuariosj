import { Church } from 'lucide-react'

import Image from 'next/image'
import Link from 'next/link'

import Ornament from '../ui/Ornament'

export default function SobreSection() {
  return (
    <section id="sobre" className="py-20 bg-cream">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3]">
              <Image
                src="/img/foto_1.jpeg"
                alt="Santuário de São José de Ribamar"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-5 -right-5 bg-burgundy text-white rounded-xl px-5 py-3 flex items-center gap-2 shadow-lg">
              <Church size={20} className="text-gold-bright" />
              <span className="font-serif text-sm font-bold">Desde 1615</span>
            </div>
          </div>

          {/* Content */}
          <div id="historia">
            <Ornament />
            <h2 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-burgundy mb-4">
              História do Santuário
            </h2>
            <p className="font-lora text-lg text-text-soft mb-4 leading-relaxed">
              O Santuário de São José de Ribamar é um dos mais antigos e venerados lugares de
              peregrinação do Maranhão, dedicado ao padroeiro do Estado.
            </p>
            <p className="text-text-soft mb-4 leading-relaxed">
              Fundado no século XVII pelos colonizadores portugueses, o santuário guarda séculos
              de devoção ao glorioso São José de Ribamar, cujo nome foi dado à cidade homônima no
              litoral maranhense. Ao longo dos séculos, milhares de fiéis percorreram esse caminho
              sagrado em busca de graças, curas e renovação espiritual.
            </p>
            <p className="text-text-soft mb-6 leading-relaxed">
              A imagem de São José de Ribamar, de origem portuguesa, é considerada milagrosa pelos
              devotos e é o centro da veneração no santuário.
            </p>
            <Link
              href="#sao-jose"
              className="inline-flex items-center gap-2 px-6 py-3 bg-burgundy text-white font-semibold rounded hover:bg-burgundy-dk transition-colors"
            >
              Conheça mais a história
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
