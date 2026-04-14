'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { clinic } from '@/lib/config'
import Button from '@/components/ui/Button'
import ContactLinks from '@/components/ui/ContactLinks'
import MobileNav from '@/components/layout/MobileNav'

const navLinks = [
  { href: '/uslugi',   label: 'Услуги'   },
  { href: '/o-nas',    label: 'О нас'    },
  { href: '/do-posle', label: 'До/После' },
  { href: '/tseny',    label: 'Цены'     },
  { href: '/kontakty', label: 'Контакты' },
]

export default function Header() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-20 transition-all duration-250',
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-border'
            : 'bg-white',
        )}
      >
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="flex h-[72px] items-center justify-between gap-4">

            {/* Logo */}
            <Link
              href="/"
              className="flex-shrink-0 font-heading font-extrabold text-xl text-navy
                         hover:text-brand-dark transition-colors duration-150"
              aria-label={`${clinic.name} — на главную`}
            >
              <span className="text-brand-dark">{clinic.name.split(' ')[0]}</span>
              <span className="text-navy"> {clinic.name.split(' ')[1]}</span>
            </Link>

            {/* Desktop nav */}
            <nav
              aria-label="Основная навигация"
              className="hidden lg:flex items-center gap-8"
            >
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-nav text-text-secondary hover:text-brand-dark
                             transition-colors duration-150"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop actions */}
            <div className="hidden lg:flex items-center gap-4">
              <ContactLinks iconsOnly />
              <span className="w-px h-5 bg-border" aria-hidden="true" />
              <a
                href={`tel:${clinic.phone}`}
                className="text-sm font-heading font-semibold text-text-primary hover:text-brand-dark transition-colors duration-150"
                aria-label={`Позвонить: ${clinic.phoneDisplay}`}
              >
                {clinic.phoneDisplay}
              </a>
              <BookingButton />
            </div>

            {/* Mobile: WA icon + hamburger */}
            <div className="flex lg:hidden items-center gap-3">
              <a
                href={clinic.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full
                           text-[#25D366] hover:bg-[#25D366]/10 transition-colors duration-150"
                aria-label="Написать в WhatsApp"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <button
                onClick={() => setMenuOpen(prev => !prev)}
                className="w-10 h-10 flex items-center justify-center rounded-full
                           text-navy hover:bg-surface-2 transition-colors duration-150"
                aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
                aria-expanded={menuOpen}
                aria-controls="mobile-nav"
              >
                {menuOpen
                  ? <X  className="w-5 h-5" aria-hidden="true" />
                  : <Menu className="w-5 h-5" aria-hidden="true" />
                }
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Spacer so page content starts below fixed header */}
      <div className="h-[72px]" aria-hidden="true" />

      <MobileNav
        id="mobile-nav"
        isOpen={menuOpen}
        links={navLinks}
        onClose={() => setMenuOpen(false)}
      />
    </>
  )
}

function BookingButton() {
  return (
    <Button
      size="sm"
      onClick={() => {
        const event = new CustomEvent('open-booking-modal')
        window.dispatchEvent(event)
      }}
    >
      Записаться
    </Button>
  )
}
