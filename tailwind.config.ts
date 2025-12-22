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
          50: '#FEFEF5',
          100: '#FDFDE8',
          200: '#FCFCCE',
          300: '#FAFAA3',
          400: '#F9F871',
          500: '#F5F330',
          600: '#D9D60E',
          700: '#A5A30B',
          800: '#717007',
          900: '#3D3C04',
        },
        // Neutral palette for UI
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
        // Success state for checkmarks
        'lab-green': '#22C55E',
      },
      fontFamily: {
        // Clean, modern sans-serif
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        // Flow moments: more rounded
        'flow': '1.5rem',
        // Checklist/modal: more square
        'checklist': '0.5rem',
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'modal': '0 8px 40px rgba(0, 0, 0, 0.12)',
      },
      spacing: {
        // Consistent content widths
        'content': '60%',
        'content-wide': '80%',
      },
    },
  },
  plugins: [],
}

export default config
