'use client'

import Button from '@/components/ui/Button'

interface CTAButtonProps {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function CTAButton({ children, className, size = 'md' }: CTAButtonProps) {
  function open() {
    window.dispatchEvent(new CustomEvent('open-booking-modal'))
  }
  return (
    <Button size={size} className={className} onClick={open}>
      {children}
    </Button>
  )
}
