import { ArrowLeft } from 'lucide-react'

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getDevocaoGalleryImages, getDevocaoPage, getDevocoesPages } from '@/lib/data'

import Ornament from '@/components/ui/Ornament'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getDevocoesPages().map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const devocao = getDevocaoPage(slug)
  if (!devocao) return {}

  return {
    title: devocao.titulo,
    description: devocao.descricaoHero,
  }
}

export default async function DevocaoDetailPage({ params }: Props) {
  const { slug } = await params
  const devocao = getDevocaoPage(slug)
  const galleryImages = getDevocaoGalleryImages(slug)
  const featuredGalleryImages = galleryImages.slice(0, 2)
  const remainingGalleryImages = galleryImages.slice(2)
  if (!devocao) notFound()

  return (
    <main className="bg-cream min-h-screen">
      <div className="bg-burgundy py-6">
        <div className="container-site flex flex-col gap-2.5">
          <Link
            href="/#devocoes"
            className="inline-flex items-center gap-2 text-sm text-gold-bright/80 hover:text-gold-bright font-semibold transition-colors self-start"
          >
            <ArrowLeft size={15} />
            Devoções
          </Link>
          <div>
            <h1 className="font-serif text-[clamp(1.45rem,3.6vw,2.15rem)] font-bold text-white leading-tight">
              {devocao.titulo}
            </h1>
            <p className="font-lora text-gold-bright/90 text-sm mt-0.5 leading-relaxed max-w-3xl">
              {devocao.descricaoHero}
            </p>
          </div>
        </div>
      </div>

      <div className="container-site py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <article className="lg:col-span-2 rounded-2xl border border-cream-dk bg-white px-6 py-6 shadow-sm">
          <Ornament />
          <h2 className="font-serif text-2xl font-bold text-burgundy mt-3 mb-2">Sobre este Espaço</h2>
          <p className="font-lora text-base text-text-soft leading-relaxed mb-5">{devocao.resumoArtigo}</p>
          <div className="flex flex-col gap-4">
            {devocao.paragrafos.map((paragrafo, index) => (
              <p key={`${devocao.slug}-${index}`} className="text-sm text-text-soft leading-relaxed">
                {paragrafo}
              </p>
            ))}
          </div>
        </article>

        <aside className="h-fit">
          {devocao.imagemSecundariaSrc ? (
            <div className="rounded-2xl border border-cream-dk bg-linear-to-br from-white to-cream p-4 shadow-sm">
              <div className="relative pb-20 sm:pb-24">
                <div className="relative ml-auto w-[88%] overflow-hidden rounded-2xl border border-cream-dk aspect-4/5 bg-cream-dk shadow-lg">
                  <Image
                    src={devocao.imagemSrc}
                    alt={devocao.imagemAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    priority
                  />
                </div>

                <div className="absolute -bottom-1 left-0 w-[58%] overflow-hidden rounded-xl border-4 border-white aspect-4/5 bg-cream-dk shadow-md">
                  <Image
                    src={devocao.imagemSecundariaSrc}
                    alt={devocao.imagemSecundariaAlt ?? devocao.imagemAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 55vw, 18vw"
                  />
                </div>
              </div>

              <p className="mt-3 text-xs text-text-soft/90 leading-relaxed">
                A chama da fé acesa na oração pessoal e na devoção comunitária.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-cream-dk bg-white p-4 shadow-sm">
              <div className="relative w-full overflow-hidden rounded-xl aspect-4/5 bg-cream-dk">
                <Image
                  src={devocao.imagemSrc}
                  alt={devocao.imagemAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  priority
                />
              </div>
            </div>
          )}
        </aside>
      </div>

      {galleryImages.length > 0 ? (
        <section className="pb-14">
          <div className="container-site">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-gold font-semibold">Acervo Fotográfico</p>
                <h2 className="font-serif text-[clamp(1.3rem,2.8vw,1.9rem)] font-bold text-burgundy mt-1">
                  Galeria do Museu dos Ex-votos
                </h2>
              </div>
              <span className="text-xs text-text-soft bg-white border border-cream-dk rounded-full px-3 py-1">
                {galleryImages.length} imagens
              </span>
            </div>

            {featuredGalleryImages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                {featuredGalleryImages.map((imageSrc, index) => (
                  <figure
                    key={imageSrc}
                    className="group relative overflow-hidden rounded-xl border border-cream-dk bg-white shadow-sm aspect-16/10"
                  >
                    <Image
                      src={imageSrc}
                      alt={`Imagem ${index + 1} do acervo do Museu dos Ex-votos`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <figcaption className="absolute left-2 bottom-2 rounded-full bg-black/45 text-white text-[11px] px-2.5 py-1 backdrop-blur-[2px]">
                      Acervo {index + 1}
                    </figcaption>
                  </figure>
                ))}
              </div>
            ) : null}

            {remainingGalleryImages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {remainingGalleryImages.map((imageSrc, offsetIndex) => {
                  const imageIndex = offsetIndex + 2

                  return (
                    <figure
                      key={imageSrc}
                      className="group relative overflow-hidden rounded-xl border border-cream-dk bg-white shadow-sm aspect-4/3"
                    >
                      <Image
                        src={imageSrc}
                        alt={`Imagem ${imageIndex + 1} do acervo do Museu dos Ex-votos`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <figcaption className="absolute left-2 bottom-2 rounded-full bg-black/45 text-white text-[11px] px-2.5 py-1 backdrop-blur-[2px]">
                        Acervo {imageIndex + 1}
                      </figcaption>
                    </figure>
                  )
                })}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
    </main>
  )
}
