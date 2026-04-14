import { Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { clinic } from '@/lib/config'

interface TelegramLinkProps {
  className?: string
  showIcon?: boolean
  label?: string
}

export default function TelegramLink({
  className,
  showIcon = true,
  label = 'Написать в Telegram',
}: TelegramLinkProps) {
  return (
    <a
      href={clinic.telegram}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center gap-2 font-heading font-semibold',
        'transition-colors duration-150 hover:text-brand-dark',
        className,
      )}
      aria-label={label}
    >
      {showIcon && (
        <Send className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
      )}
      <span>{label}</span>
    </a>
  )
}
