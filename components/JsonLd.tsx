import { clinic }  from '@/lib/config'
import { services } from '@/lib/services'
import { reviews }  from '@/lib/reviews'

/**
 * Renders all structured data (JSON-LD) for the homepage.
 * Rendered server-side — no hydration cost.
 */
export default function JsonLd() {
  // Average rating from reviews
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

  const localBusiness = {
    '@context': 'https://schema.org',
    '@type':    ['LocalBusiness', 'Dentist'],
    '@id':      `${clinic.siteUrl}/#organization`,
    name:       clinic.name,
    description: `Стоматологическая клиника в ${clinic.city}. Лечение зубов, имплантация, отбеливание. Первичный осмотр бесплатно.`,
    url:        clinic.siteUrl,
    telephone:  clinic.phone,
    address: {
      '@type':           'PostalAddress',
      streetAddress:     clinic.address,
      addressLocality:   clinic.city,
      addressCountry:    'KZ',
    },
    geo: {
      '@type':    'GeoCoordinates',
      latitude:   clinic.coordinates.lat,
      longitude:  clinic.coordinates.lng,
    },
    openingHoursSpecification: clinic.hours.map(h => ({
      '@type':    'OpeningHoursSpecification',
      dayOfWeek:  h.days,
      opens:      h.hours.split('–')[0]?.trim(),
      closes:     h.hours.split('–')[1]?.trim(),
    })),
    aggregateRating: {
      '@type':       'AggregateRating',
      ratingValue:   avgRating.toFixed(1),
      reviewCount:   reviews.length,
      bestRating:    '5',
      worstRating:   '1',
    },
    hasMap: `https://maps.google.com/maps?q=${encodeURIComponent(clinic.fullAddress)}`,
    priceRange: '₸₸',
    currenciesAccepted: 'KZT',
    paymentAccepted:    'Cash, Credit Card',
    image: `${clinic.siteUrl}/images/clinic-og.jpg`,
    sameAs: clinic.telegramUrl ? [clinic.telegramUrl] : [],
  }

  const faqPage = {
    '@context': 'https://schema.org',
    '@type':    'FAQPage',
    mainEntity: [
      {
        '@type':          'Question',
        name:             'Сколько стоит первичный осмотр?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:    'Первичный осмотр и консультация в нашей клинике — бесплатно для новых пациентов.',
        },
      },
      {
        '@type':          'Question',
        name:             'Работаете ли вы в выходные?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:    'Да, мы принимаем ежедневно, включая субботу и воскресенье.',
        },
      },
      {
        '@type':          'Question',
        name:             'Больно ли лечить зубы?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:    'Мы используем современную анестезию. Лечение проходит безболезненно.',
        },
      },
    ],
  }

  const serviceList = {
    '@context': 'https://schema.org',
    '@type':    'ItemList',
    name:       `Услуги ${clinic.name}`,
    itemListElement: services.map((s, i) => ({
      '@type':    'ListItem',
      position:   i + 1,
      name:       s.title,
      url:        `${clinic.siteUrl}/uslugi/${s.slug}`,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceList) }}
      />
    </>
  )
}
