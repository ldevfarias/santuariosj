import { Star } from 'lucide-react'

import Link from 'next/link'

export default function NoticeBar() {
  return (
    <div className="bg-burgundy-dk text-white py-3">
      <div className="container-site flex items-center justify-center gap-3 text-sm text-center">
        <Star size={14} className="text-gold-bright shrink-0" />
        <p>
          <strong>Festa de São José de Ribamar — 19 de março.</strong>{' '}
          Programação especial com novena, procissão e missas solenes.{' '}
          <Link href="#calendario" className="text-gold-bright underline hover:no-underline">
            Ver programação completa
          </Link>
        </p>
      </div>
    </div>
  )
}
