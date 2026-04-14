import Link from 'next/link'
import { MapPin, Clock, Phone } from 'lucide-react'
import Container from '@/components/ui/Container'
import { clinic } from '@/lib/config'

function WAIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function TGIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  )
}

const serviceLinks = [
  { href: '/uslugi/terapiya',     label: 'Терапевтическая стоматология' },
  { href: '/uslugi/hirurgiya',    label: 'Хирургия' },
  { href: '/uslugi/implantatsiya', label: 'Имплантация' },
  { href: '/uslugi/protezirovanie', label: 'Протезирование' },
  { href: '/uslugi/ortodontiya',  label: 'Ортодонтия' },
  { href: '/uslugi/estetika',     label: 'Эстетическая стоматология' },
  { href: '/uslugi/detskaya',     label: 'Детская стоматология' },
]

const infoLinks = [
  { href: '/o-nas',    label: 'О клинике' },
  { href: '/vrachi',   label: 'Врачи' },
  { href: '/do-posle', label: 'До/После' },
  { href: '/tseny',    label: 'Цены' },
  { href: '/kontakty', label: 'Контакты' },
  { href: '/ekstrennaya-pomoshch', label: 'Экстренная помощь' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-navy-light text-white" role="contentinfo">
      <Container className="py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <Link
              href="/"
              className="inline-block font-heading font-extrabold text-xl mb-4
                         hover:text-brand-light transition-colors duration-150"
              aria-label={`${clinic.name} — на главную`}
            >
              <span className="text-brand">{clinic.name.split(' ')[0]}</span>
              <span className="text-white"> {clinic.name.split(' ')[1]}</span>
            </Link>
            <p className="text-body-sm text-white/70 mb-5 leading-relaxed">
              {clinic.tagline}.<br />
              Современная стоматология в {clinic.city}.
            </p>
            <div className="space-y-2">
              <a
                href={`tel:${clinic.phone}`}
                className="flex items-center gap-2 text-sm text-white/90 hover:text-brand-light transition-colors font-heading font-semibold"
                aria-label={`Позвонить: ${clinic.phoneDisplay}`}
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                {clinic.phoneDisplay}
              </a>
              <a
                href={clinic.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-white/90 hover:text-[#25D366] transition-colors font-heading font-semibold"
                aria-label="Написать в WhatsApp"
              >
                <WAIcon />
                WhatsApp
              </a>
              <a
                href={clinic.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-white/90 hover:text-[#0088CC] transition-colors font-heading font-semibold"
                aria-label="Написать в Telegram"
              >
                <TGIcon />
                {clinic.telegramUsername}
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-heading font-semibold text-sm uppercase tracking-wider
                           text-white/50 mb-4">
              Услуги
            </h3>
            <ul className="space-y-2">
              {serviceLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-white/75 hover:text-brand-light
                               transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-heading font-semibold text-sm uppercase tracking-wider
                           text-white/50 mb-4">
              Клиника
            </h3>
            <ul className="space-y-2">
              {infoLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-white/75 hover:text-brand-light
                               transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Address & Hours */}
          <div>
            <h3 className="font-heading font-semibold text-sm uppercase tracking-wider
                           text-white/50 mb-4">
              Контакты
            </h3>
            <address className="not-italic space-y-3">
              <div className="flex gap-2 text-body-sm text-white/75">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-brand" aria-hidden="true" />
                <span>{clinic.fullAddress}</span>
              </div>
              <div className="flex gap-2">
                <Clock className="w-4 h-4 flex-shrink-0 mt-1 text-brand" aria-hidden="true" />
                <ul className="space-y-1">
                  {clinic.hours.map(h => (
                    <li key={h.days} className="text-body-sm text-white/75">
                      <span className="text-white/50">{h.days}:</span> {h.hours}
                    </li>
                  ))}
                </ul>
              </div>
            </address>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row
                        justify-between items-center gap-3 text-caption text-white/40">
          <p>© {year} {clinic.name}. Все права защищены.</p>
          <p>Лицензия на медицинскую деятельность №&nbsp;—&nbsp;TODO</p>
        </div>
      </Container>
    </footer>
  )
}
