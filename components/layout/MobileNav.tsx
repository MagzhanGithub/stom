'use client'

import Link from 'next/link'
import { X, UserCircle2 } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
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
        {/* Header row with X close button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <span className="text-body font-heading font-semibold text-navy">Меню</span>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-surface-2 flex items-center justify-center
                       text-text-muted hover:text-navy transition-colors duration-150"
            aria-label="Закрыть меню"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
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

            {/* Divider */}
            <li aria-hidden="true" className="border-t border-border my-2" />

            {/* Войти */}
            <li>
              <Link
                href="/admin/login"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-body font-heading font-medium
                           text-text-primary hover:bg-surface-2 transition-colors duration-150"
              >
                <UserCircle2 className="w-5 h-5 text-text-muted" aria-hidden="true" />
                Войти
              </Link>
            </li>
          </ul>
        </div>

        <div className="p-6 border-t border-border">
          <ContactLinks iconsOnly className="justify-center" />
        </div>
      </nav>
    </>
  )
}
