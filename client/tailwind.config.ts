import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // iBayad brand system: blue is primary, yellow is controlled emphasis,
        // red is reserved for critical payroll risk and destructive actions.
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#2563EB',
          600: '#1D4ED8',
          700: '#1E40AF',
          800: '#1E3A8A',
          900: '#172554',
          DEFAULT: '#1D4ED8',
          hover: '#1E40AF',
        },
        secondary: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          DEFAULT: '#F59E0B',
          hover: '#D97706',
        },
        accent: {
          DEFAULT: '#F59E0B',
          subtle: '#FFFBEB',
          surface: '#FEF3C7',
          border: '#FCD34D',
        },
        info: {
          DEFAULT: '#2563EB',
          surface: '#DBEAFE',
          muted: '#EFF6FF',
          border: '#BFDBFE',
        },
        success: {
          DEFAULT: '#0F7A4F',
          hover: '#0B5F3D',
          surface: '#DCFCE7',
          muted: '#F0FDF4',
          border: '#A7F3D0',
        },
        danger: {
          DEFAULT: '#C81E3A',
          hover: '#A3162C',
          surface: '#FFE4E6',
          muted: '#FFF1F2',
          border: '#FDA4AF',
        },
        warning: {
          DEFAULT: '#B77900',
          hover: '#8A5B00',
          surface: '#FEF3C7',
          muted: '#FFFBEB',
          border: '#FCD34D',
        },
        neutral: {
          10: '#FFFFFF',
          20: '#F8FAFC',
          30: '#F1F5F9',
          40: '#E2E8F0',
          50: '#CBD5E1',
          60: '#94A3B8',
          70: '#64748B',
          80: '#475569',
          90: '#1E293B',
          100: '#0F172A',
        },
        // Aliases
        surface: '#F6F8FB',
        sidebar: '#F8FAFC',
        border: '#DDE3EA',
        ink: '#0F172A',
        muted: '#64748B',
        // Backward-compat alias for existing classes.
        brand: {
          DEFAULT: '#1D4ED8',
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#2563EB',
          600: '#1D4ED8',
          700: '#1E40AF',
          800: '#1E3A8A',
          900: '#172554',
          hover: '#1E40AF',
        },
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        ui: '0.5rem',
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
        elevated: '0 12px 28px -18px rgba(15, 23, 42, 0.35)',
        'sidebar-right': 'inset -1px 0 0 0 #DDE3EA',
        'inner-bottom': 'inset 0 -1px 0 0 #DDE3EA',
      },
    },
  },
  plugins: [],
}

export default config
