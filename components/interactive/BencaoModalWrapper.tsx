'use client'

import dynamic from 'next/dynamic'

const BencaoModal = dynamic(() => import('./BencaoModal'), { ssr: false })

export default function BencaoModalWrapper() {
  return <BencaoModal />
}
