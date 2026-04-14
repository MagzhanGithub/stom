'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'
import ContactLinks from '@/components/ui/ContactLinks'

interface NavLink { href: string; label: string }

interface MobileNavProps {
  id: string
  isOpen: boolean
  links: NavLink[]
  onClose: () => void
}

export default function MobileNav({ id, isOpen, links, onClose }: MobileNavProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-30 bg-navy/60 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <nav
        id={id}
        role="dialog"
        aria-modal="true"
        aria-label="Мобильное меню"
        className={cn(
          'fixed top-0 right-0 bottom-0 z-40 w-[80vw] max-w-xs',
          'bg-white shadow-xl flex flex-col',
          'transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex-1 overflow-y-auto p-6 pt-20">
          <ul className="space-y-1">
            {links.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className={cn(
                    'block px-4 py-3 rounded-xl text-body font-heading font-medium',
                    'transition-colors duration-150',
                    pathname === link.href
                      ? 'bg-brand-lighter text-brand-dark'
                      : 'text-text-primary hover:bg-surface-2',
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 border-t border-border space-y-3">
          <Button
            fullWidth
            onClick={() => {
              onClose()
              const event = new CustomEvent('open-booking-modal')
              window.dispatchEvent(event)
            }}
          >
            Записаться онлайн
          </Button>
          <ContactLinks iconsOnly className="justify-center" />
        </div>
      </nav>
    </>
  )
}
