import { Cross } from 'lucide-react'

interface OrnamentProps {
  light?: boolean
}

export default function Ornament({ light = false }: OrnamentProps) {
  const color = light ? 'text-gold-bright' : 'text-gold'
  return (
    <div className={`flex items-center justify-center gap-3 mb-4 ${color}`}>
      <span className="block h-px w-16 bg-current opacity-40" />
      <Cross size={16} className="shrink-0" />
      <span className="block h-px w-16 bg-current opacity-40" />
    </div>
  )
}
