import Link from 'next/link'

type Variant = 'primary' | 'outline' | 'gold'

interface ButtonProps {
  href?: string
  variant?: Variant
  full?: boolean
  children: React.ReactNode
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

const variants: Record<Variant, string> = {
  primary:
    'bg-burgundy text-white border-2 border-burgundy hover:bg-burgundy-dk hover:border-burgundy-dk',
  outline:
    'bg-transparent text-white border-2 border-white hover:bg-white hover:text-burgundy',
  gold:
    'bg-gold text-white border-2 border-gold hover:bg-gold-light hover:border-gold-light',
}

export default function Button({
  href,
  variant = 'primary',
  full = false,
  children,
  className = '',
  type = 'button',
  disabled = false,
}: ButtonProps) {
  const base =
    'inline-flex items-center gap-2 px-6 py-3 rounded font-body font-semibold text-sm tracking-wide transition-all duration-300 active:scale-[0.97]'
  const classes = `${base} ${variants[variant]} ${full ? 'w-full justify-center' : ''} ${className}`

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} disabled={disabled} className={classes}>
      {children}
    </button>
  )
}
