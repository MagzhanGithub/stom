import Container from '@/components/ui/Container'
import ContactLinks from '@/components/ui/ContactLinks'
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

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <CTAButton size="lg">
            Записаться онлайн
          </CTAButton>
          <ContactLinks className="bg-white/20 rounded-full px-4 py-2" />
        </div>
      </Container>
    </section>
  )
}
