'use client'

import Button from '@/components/ui/Button'

export default function HeroBookingButton() {
  function openBooking() {
    window.dispatchEvent(new CustomEvent('open-booking-modal'))
  }

  return (
    <Button size="lg" onClick={openBooking}>
      Записаться бесплатно
    </Button>
  )
}
