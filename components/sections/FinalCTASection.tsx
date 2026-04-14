import Container from '@/components/ui/Container'
import CTAButton from './CTAButton'

export default function FinalCTASection() {
  return (
    <section
      className="py-20 bg-gradient-to-r from-brand-dark to-brand relative overflow-hidden"
      aria-labelledby="final-cta-heading"
    >
      {/* Decorative circles */}
      <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-navy/10 pointer-events-none" aria-hidden="true" />
      <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-navy/10 pointer-events-none" aria-hidden="true" />

      <Container className="relative text-center">
        <p className="overline text-navy/70 mb-3">ЗАПИСАТЬСЯ</p>
        <h2
          id="final-cta-heading"
          className="text-h1 font-heading text-navy mb-4"
        >
          Запишитесь на бесплатный осмотр
        </h2>
        <p className="text-body-lg text-navy/80 mb-8 max-w-lg mx-auto">
          Первичный осмотр и консультация — бесплатно. Принимаем ежедневно,
          включая выходные. Без очередей.
        </p>

        <div className="flex justify-center">
          <CTAButton size="lg">
            Записаться онлайн
          </CTAButton>
        </div>
      </Container>
    </section>
  )
}
