import { Link } from 'react-router-dom'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'gold' | 'light'
type Size = 'sm' | 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary:
    'bg-rose text-cream hover:bg-rose-deep border border-rose hover:border-rose-deep',
  secondary:
    'bg-transparent text-ink border border-ink/25 hover:border-ink hover:bg-ink hover:text-cream',
  ghost: 'bg-transparent text-ink border-transparent hover:text-rose underline-offset-4 hover:underline',
  gold: 'bg-transparent text-ink border border-gold hover:bg-gold hover:text-ink',
  light: 'bg-cream text-ink border border-cream hover:bg-paper',
}

const sizes: Record<Size, string> = {
  sm: 'min-h-9 px-4 py-2 text-[11px] tracking-[0.18em]',
  md: 'min-h-11 px-6 py-3 text-[11px] tracking-[0.2em]',
  lg: 'min-h-12 px-8 py-3.5 text-[12px] tracking-[0.2em]',
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  href?: string
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center text-center leading-none uppercase transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`

  if (href) {
    const isHash = href.startsWith('#')
    if (isHash) {
      return (
        <a href={href} className={classes}>
          {children}
        </a>
      )
    }
    return (
      <Link to={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
