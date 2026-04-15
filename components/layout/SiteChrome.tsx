'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileBottomBar from '@/components/layout/MobileBottomBar'

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) {
    return <div className="h-screen overflow-hidden bg-slate-100">{children}</div>
  }

  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <MobileBottomBar />
    </>
  )
}
