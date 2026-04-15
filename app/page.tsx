import HeroSection        from '@/components/sections/HeroSection'
import TrustBar           from '@/components/sections/TrustBar'
import ServicesSection    from '@/components/sections/ServicesSection'
import WhyUsSection       from '@/components/sections/WhyUsSection'
import DoctorSection      from '@/components/sections/DoctorSection'
import BeforeAfterSection from '@/components/sections/BeforeAfterSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import PricingSection     from '@/components/sections/PricingSection'
import FAQSection         from '@/components/sections/FAQSection'
import MapSection         from '@/components/sections/MapSection'
import FinalCTASection    from '@/components/sections/FinalCTASection'
import AltegioBookingModal from '@/components/sections/AltegioBookingModal'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <ServicesSection />
      <WhyUsSection />
      <DoctorSection />
      <BeforeAfterSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <MapSection />
      <FinalCTASection />
      <AltegioBookingModal />
    </>
  )
}
