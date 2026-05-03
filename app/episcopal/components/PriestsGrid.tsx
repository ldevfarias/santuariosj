import type { Sacerdote } from '@/lib/types'

import SectionHeader from '@/components/ui/SectionHeader'

import PriestCard from './PriestCard'

type PriestsGridProps = {
  title: string
  items: Sacerdote[]
}

export default function PriestsGrid({ title, items }: PriestsGridProps) {
  return (
    <div className="container-site py-12 md:py-14">
      <SectionHeader title={title} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
        {items.map((padre) => (
          <PriestCard key={padre.id} padre={padre} />
        ))}
      </div>
    </div>
  )
}
