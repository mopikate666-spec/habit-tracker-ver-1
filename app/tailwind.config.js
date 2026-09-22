/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Page background – warm dark olive
        page: '#3F4631',
        // Card / surface – warm cream
        cream: '#FBF7EF',
        creamEdge: '#F1EBDC',
        // Sage / lime accent
        sage: {
          50: '#F4F8E6',
          100: '#E8F0CC',
          200: '#D6E5A4',
          300: '#C7DC8B',
          400: '#B8D27A',
          500: '#A8C76A',
          600: '#8FB354',
          700: '#6E8C3F',
        },
        // Category pastels
        peach: '#F5D5BD',
        powder: '#C6DEEC',
        lilac: '#E3D4F1',
        // Ink
        ink: {
          900: '#1F2418',
          700: '#3F4631',
          500: '#6B7160',
          400: '#8B8F7E',
          300: '#B3B6A5',
        },
      },
      fontFamily: {
        sans: [
          'Geist',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        display: ['Geist', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        card: '0 1px 0 rgba(0,0,0,0.04), 0 8px 24px -16px rgba(0,0,0,0.25)',
        soft: '0 2px 6px -2px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
}