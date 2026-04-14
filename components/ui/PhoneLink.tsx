import { Phone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { clinic } from '@/lib/config'

interface PhoneLinkProps {
  className?: string
  showIcon?: boolean
  iconOnly?: boolean
}

export default function PhoneLink({
  className,
  showIcon = true,
  iconOnly = false,
}: PhoneLinkProps) {
  return (
    <a
      href={`tel:${clinic.phone}`}
      className={cn(
        'inline-flex items-center gap-2 font-heading font-semibold',
        'transition-colors duration-150 hover:text-brand-dark',
        className,
      )}
      aria-label={`Позвонить в клинику: ${clinic.phoneDisplay}`}
    >
      {showIcon && (
        <Phone
          className="w-4 h-4 flex-shrink-0"
          aria-hidden="true"
        />
      )}
      {!iconOnly && (
        <span>{clinic.phoneDisplay}</span>
      )}
    </a>
  )
}
