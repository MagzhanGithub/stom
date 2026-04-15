'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu, X, UserCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { clinic } from '@/lib/config'
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
              <Link
                href="/admin"
                className="flex items-center gap-2 text-sm font-heading font-semibold text-text-secondary
                           hover:text-brand-dark transition-colors duration-150"
                aria-label="Войти в панель управления"
              >
                <UserCircle2 className="w-5 h-5" aria-hidden="true" />
                Войти
              </Link>
            </div>

            {/* Mobile: phone icon + hamburger */}
            <div className="flex lg:hidden items-center gap-3">
              <a
                href={`tel:${clinic.phone}`}
                className="w-10 h-10 flex items-center justify-center rounded-full
                           text-navy hover:bg-surface-2 transition-colors duration-150"
                aria-label={`Позвонить: ${clinic.phoneDisplay}`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                     strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .91h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
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

