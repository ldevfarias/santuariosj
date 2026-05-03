import Ornament from './Ornament'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  light?: boolean
}

export default function SectionHeader({ title, subtitle, light = false }: SectionHeaderProps) {
  return (
    <div className="text-center mb-12 reveal">
      <Ornament light={light} />
      <h2
        className={`font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-tight mb-3 ${light ? 'text-white' : 'text-burgundy'
          }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`font-lora text-lg ${light ? 'text-white/80' : 'text-text-soft'}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
