import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#4ddde2',
          dark:    '#2bbdc2',
          darker:  '#1a9da2',
          light:   '#b2f4f6',
          lighter: '#e8fbfc',
        },
        cta: {
          DEFAULT: '#FF6B35',
          hover:   '#E55A24',
          light:   '#fff0eb',
        },
        navy: {
          DEFAULT: '#0d1a2b',
          light:   '#162132',
          muted:   '#1e2e3f',
        },
        surface: {
          1: '#ffffff',
          2: '#f7f9fc',
          3: '#ffffff',
          4: '#eef9fa',
        },
        'text-primary':   '#1e2e3f',
        'text-secondary': '#3d5166',
        'text-muted':     '#6b7c93',
        'text-inverse':   '#ffffff',
        'text-brand':     '#1a9da2',
        border: {
          DEFAULT: '#e2e8f0',
          focus:   '#4ddde2',
          strong:  '#cbd5e1',
        },
        state: {
          success: '#10b981',
          warning: '#f59e0b',
          error:   '#dc2626',
          info:    '#3b82f6',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'system-ui', 'sans-serif'],
        body:    ['var(--font-body)',    'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['clamp(2.25rem,5vw,4.5rem)', { lineHeight: '1.05', fontWeight: '800' }],
        'h1':      ['clamp(2rem,4vw,3rem)',       { lineHeight: '1.1',  fontWeight: '700' }],
        'h2':      ['clamp(1.5rem,3vw,2.25rem)',  { lineHeight: '1.15', fontWeight: '700' }],
        'h3':      ['clamp(1.1rem,2vw,1.375rem)', { lineHeight: '1.25', fontWeight: '600' }],
        'h4':      ['1rem',                        { lineHeight: '1.3',  fontWeight: '600' }],
        'body-lg': ['1.125rem',                    { lineHeight: '1.65', fontWeight: '400' }],
        'body':    ['1rem',                        { lineHeight: '1.6',  fontWeight: '400' }],
        'body-sm': ['0.875rem',                    { lineHeight: '1.5',  fontWeight: '400' }],
        'caption': ['0.75rem',                     { lineHeight: '1.4',  fontWeight: '400' }],
        'overline':['0.6875rem',                   { lineHeight: '1',    fontWeight: '700',
                                                     letterSpacing: '0.1em' }],
      },
      spacing: {
        'section':        '6rem',
        'section-mobile': '4rem',
      },
      borderRadius: {
        'sm':   '4px',
        'md':   '8px',
        'lg':   '12px',
        'xl':   '16px',
        '2xl':  '24px',
        '3xl':  '32px',
        'full': '9999px',
      },
      boxShadow: {
        'sm':       '0 2px 8px rgba(13,26,43,.06)',
        'md':       '0 4px 16px rgba(13,26,43,.10)',
        'lg':       '0 8px 32px rgba(13,26,43,.14)',
        'xl':       '0 16px 48px rgba(13,26,43,.18)',
        'brand':    '0 8px 32px rgba(77,221,226,.20)',
        'cta':      '0 8px 24px rgba(255,107,53,.35)',
        'card-hover':'0 12px 40px rgba(13,26,43,.16)',
      },
      transitionTimingFunction: {
        'default': 'cubic-bezier(.4, 0, .2, 1)',
        'spring':  'cubic-bezier(.34, 1.56, .64, 1)',
        'out':     'cubic-bezier(0, 0, .2, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'count-up': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pulse-ring': {
          '0%':   { transform: 'scale(1)',   opacity: '.6' },
          '100%': { transform: 'scale(1.5)', opacity: '0'  },
        },
      },
      animation: {
        'fade-up':    'fade-up .5s cubic-bezier(0,0,.2,1) both',
        'pulse-ring': 'pulse-ring 1.5s ease-out infinite',
      },
      maxWidth: {
        'container': '1200px',
        'narrow':    '780px',
      },
    },
  },
  plugins: [],
}

export default config
