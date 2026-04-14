import { Star, ShieldCheck } from 'lucide-react'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import { clinic } from '@/lib/config'
import HeroBookingButton from './HeroBookingButton'

export default function HeroSection() {
  return (
    <section
      className="relative bg-gradient-to-br from-surface-4 via-white to-white
                 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Decorative blob */}
      <div
        className="absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full
                   bg-brand-lighter opacity-40 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <Container className="relative">
        <div className="grid lg:grid-cols-[55fr_45fr] gap-10 lg:gap-16
                        items-center min-h-[calc(100vh-72px)] lg:min-h-0 py-14 lg:py-24">

          {/* ── Text column ── */}
          <div className="order-2 lg:order-1">
            <p className="overline mb-4">
              СТОМАТОЛОГИЯ В ШЫМКЕНТЕ
            </p>

            <h1
              id="hero-heading"
              className="text-display font-heading text-navy mb-6"
            >
              Здоровая улыбка без страха{' '}
              <span className="text-gradient">и боли</span>
            </h1>

            <p className="text-body-lg text-text-secondary mb-8 max-w-lg">
              Современная клиника&nbsp;
              <strong className="text-navy font-semibold">{clinic.name}</strong>
              &nbsp;на&nbsp;{clinic.address}.
              Бесплатный осмотр для новых пациентов — без очередей и скрытых доплат.
            </p>

            {/* CTA row */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <HeroBookingButton />
              <a
                href="#uslugi"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5
                           rounded-full border-2 border-brand text-brand-dark
                           font-heading font-semibold text-body
                           hover:bg-brand-lighter transition-colors duration-150"
              >
                Смотреть услуги
              </a>
            </div>

            {/* Trust micro */}
            <div className="flex flex-wrap items-center gap-4 text-body-sm text-text-muted">
              <div className="flex items-center gap-1.5">
                <span className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                      aria-hidden="true"
                    />
                  ))}
                </span>
                <span className="font-semibold text-text-secondary">
                  {clinic.googleRating} Google
                </span>
              </div>
              <span className="w-px h-4 bg-border" aria-hidden="true" />
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-dark" aria-hidden="true" />
                <span>Работаем с {clinic.foundedYear}&nbsp;года</span>
              </div>
            </div>
          </div>

          {/* ── Image column ── */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm lg:max-w-full aspect-[4/5] lg:aspect-auto
                            lg:h-[560px]">
              {/* Main photo — замените src на реальное фото врача */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-xl
                              bg-gradient-to-br from-brand-lighter via-surface-4 to-brand-light
                              flex flex-col items-center justify-center gap-4">
                <svg
                  viewBox="0 0 80 80"
                  fill="none"
                  className="w-24 h-24 opacity-30"
                  aria-hidden="true"
                >
                  <circle cx="40" cy="28" r="16" fill="#2bbdc2" />
                  <path d="M10 72c0-16.569 13.431-30 30-30s30 13.431 30 30" fill="#2bbdc2" />
                </svg>
                <p className="text-brand-dark/60 text-caption font-heading font-semibold tracking-wide">
                  ФОТО ВРАЧА
                </p>
              </div>

              {/* Floating badge */}
              <div
                className="absolute -bottom-4 -left-4 lg:bottom-8 lg:-left-8
                           bg-white rounded-2xl shadow-lg px-5 py-3.5
                           flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-brand-lighter flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-brand-dark" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-caption text-text-muted">Для новых пациентов</p>
                  <p className="text-body-sm font-heading font-semibold text-navy">
                    Бесплатный осмотр
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </Container>
    </section>
  )
}
