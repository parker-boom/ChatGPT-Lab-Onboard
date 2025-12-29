import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand yellow
        'lab-yellow': {
          DEFAULT: '#F9F871',
          50: '#FFFEF5',
          100: '#FEFDE8',
          200: '#FDFBCE',
          300: '#FBF8A3',
          400: '#F9F871',
          500: '#F5F330',
          600: '#D9D60E',
          700: '#A5A30B',
          800: '#717007',
          900: '#3D3C04',
        },
        // Neutral palette
        'lab-black': '#1A1A1A',
        'lab-white': '#FFFFFF',
        'lab-gray': {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        // Status colors
        'lab-green': '#22C55E',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        // Refined type scale
        'display': ['2.5rem', { lineHeight: '1.1', fontWeight: '700' }],
        'heading': ['1.75rem', { lineHeight: '1.2', fontWeight: '600' }],
        'subheading': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['0.9375rem', { lineHeight: '1.6', fontWeight: '400' }],
        'caption': ['0.8125rem', { lineHeight: '1.5', fontWeight: '400' }],
      },
      borderRadius: {
        'flow': '1.5rem',
        'card': '1rem',
        'button': '0.5rem',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 32px rgba(0, 0, 0, 0.08)',
        'modal': '0 16px 64px rgba(0, 0, 0, 0.16)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      maxWidth: {
        'content': '640px',
        'content-wide': '720px',
        'flow': '800px',
      },
      backdropBlur: {
        'bg': '60px',
      },
    },
  },
  plugins: [],
}

export default config
