import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Figma design tokens
        primary: {
          DEFAULT: '#212143',
          hover: '#1a1a36',
        },
        info: '#146ADC',
        success: {
          DEFAULT: '#0A7E22',
          surface: '#CEE5D3',
        },
        danger: {
          DEFAULT: '#FD314D',
          surface: '#FFD6DB',
        },
        warning: {
          DEFAULT: '#E6A817',
          surface: '#FEF3C7',
        },
        neutral: {
          10: '#FFFFFF',
          20: '#F5F5F5',
          40: '#E0E0E0',
          60: '#9E9E9E',
          80: '#616161',
          90: '#404040',
          100: '#0A0A0A',
        },
        // Aliases
        surface: '#F5F5F5',
        sidebar: '#F5F5F5',
        border: '#E0E0E0',
        ink: '#0A0A0A',
        muted: '#616161',
        // Backward-compat alias (same as primary)
        brand: {
          DEFAULT: '#212143',
          50: '#EEEEF5',
          100: '#D8D8EC',
          300: '#8F8FC9',
          500: '#212143',
          hover: '#1a1a36',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.06)',
        'sidebar-right': 'inset -1px 0 0 0 #E0E0E0',
        'inner-bottom': 'inset 0 -1px 0 0 #E0E0E0',
      },
    },
  },
  plugins: [],
}

export default config
