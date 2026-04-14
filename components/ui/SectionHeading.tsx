import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  overline?: string
  title: string
  subtitle?: string
  id?: string
  center?: boolean
  light?: boolean   // for dark backgrounds
  className?: string
}

export default function SectionHeading({
  overline,
  title,
  subtitle,
  id,
  center = false,
  light = false,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'mb-10 lg:mb-14',
        center && 'text-center',
        className,
      )}
    >
      {overline && (
        <p className={cn('overline mb-3', light && 'text-brand-light')}>
          {overline}
        </p>
      )}
      <h2
        id={id}
        className={cn(
          'text-h2 font-heading',
          light ? 'text-white' : 'text-text-primary',
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'mt-4 text-body-lg max-w-2xl',
            light ? 'text-white/75' : 'text-text-secondary',
            center && 'mx-auto',
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
