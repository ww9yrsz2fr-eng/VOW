/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garant"', 'Georgia', 'serif'],
        sans: ['"Jost"', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Warm parchment palette — matching Aisle's design language
        stone: {
          50:  '#FAF8F5',  // bg
          100: '#F3F0EB',  // bg-2 (sidebar, cards)
          200: '#EDEAE4',  // bg-3 (hover, input)
          300: '#C8C2B8',
          400: '#A09890',  // text-3 (tertiary)
          500: '#7A7168',  // text-2 (secondary)
          600: '#5A5550',
          700: '#3A3632',
          800: '#2A2420',
          900: '#1A1612',  // text primary
          950: '#141210',  // dark bg
        },
        accent: {
          DEFAULT: '#4A6B58',   // deep sage green
          dark:    '#7AAF94',   // lighter sage for dark surfaces
          muted:   '#6B9B82',   // mid-tone for hover states
        },
        green: {
          DEFAULT: '#4A7A5A',   // confirmed/done — slightly deeper
          dark:    '#6AA880',
        },
        urgent: {
          DEFAULT: '#B55A40',   // warm terracotta for errors/warnings
          light:   '#FBE8E4',
          dark:    '#C07060',
        },
        gold: {
          DEFAULT: '#A0813A',
          light:   '#FAF3E0',
          muted:   '#C4A055',
          dark:    '#C9A55A',
        },
        sidebar: {
          bg:      '#1C1A17',   // always-dark sidebar surface
          hover:   '#252220',   // sidebar item hover
          border:  '#2A2723',   // sidebar internal dividers
          text:    '#F0EBE1',   // primary text on dark sidebar
          muted:   '#7A7268',   // secondary text on dark sidebar
          faint:   '#4A4540',   // tertiary / disabled on dark sidebar
        },
      },
      boxShadow: {
        'soft':     '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'card':     '0 2px 12px 0 rgb(0 0 0 / 0.07), 0 1px 3px 0 rgb(0 0 0 / 0.04)',
        'card-hover': '0 8px 30px 0 rgb(0 0 0 / 0.11), 0 2px 6px 0 rgb(0 0 0 / 0.05)',
        'elevated': '0 8px 40px 0 rgb(0 0 0 / 0.12), 0 2px 8px 0 rgb(0 0 0 / 0.06)',
        'hero':     '0 6px 40px 0 rgb(0 0 0 / 0.09), 0 2px 8px 0 rgb(0 0 0 / 0.05)',
        'glow-accent': '0 0 0 3px rgb(74 107 88 / 0.18)',
      },
      borderRadius: {
        'xs': '3px',
      },
      letterSpacing: {
        'luxury':    '0.22em',
        'cap-label': '0.18em',
      },
      animation: {
        'fade-in':      'fadeIn 0.2s ease-out',
        'count-pulse':  'countPulse 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'shimmer':      'shimmer 2.4s linear infinite',
        'progress-in':  'progressIn 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        countPulse: {
          '0%':   { opacity: '0', transform: 'translateY(6px) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        progressIn: {
          '0%':   { width: '0%' },
          '100%': { width: 'var(--bar-w, 100%)' },
        },
      },
    },
  },
  plugins: [],
}
