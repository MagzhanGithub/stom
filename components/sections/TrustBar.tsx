import { Star, Users, Clock, Gift } from 'lucide-react'
import Container from '@/components/ui/Container'
import { clinic } from '@/lib/config'

const stats = [
  {
    icon: Star,
    value: `${clinic.googleRating}`,
    label: 'Google рейтинг',
    suffix: '★',
  },
  {
    icon: Clock,
    value: `${new Date().getFullYear() - clinic.foundedYear}+`,
    label: 'лет работы',
  },
  {
    icon: Users,
    value: clinic.patientsCount,
    label: 'пациентов',
  },
  {
    icon: Gift,
    value: '0 ₸',
    label: 'первый осмотр',
  },
]

export default function TrustBar() {
  return (
    <div className="bg-navy" role="region" aria-label="Ключевые показатели клиники">
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <div
                key={i}
                className="flex flex-col sm:flex-row items-center sm:items-start gap-3
                           py-6 px-4 lg:px-6 bg-navy"
              >
                <div
                  className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center flex-shrink-0"
                  aria-hidden="true"
                >
                  <Icon className="w-5 h-5 text-brand" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-h3 font-heading font-bold text-brand leading-none mb-1">
                    {stat.value}
                  </p>
                  <p className="text-body-sm text-white/65">{stat.label}</p>
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </div>
  )
}
