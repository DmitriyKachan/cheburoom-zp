/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Unbounded', 'system-ui', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        glovo: {
          yellow: '#FFC244',
          'yellow-hover': '#F5B42E',
          'yellow-light': '#FFF8E7',
          green: '#00A082',
          'green-dark': '#008369',
          'green-light': '#E6F6F2',
        },
        rnr: {
          dark: '#09090B',
          card: '#121215',
          surface: '#1A1A22',
          border: '#23232E',
          subtle: '#2E2E3D',
          text: '#9CA3AF',
        },
        castiron: {
          950: '#09090B',
          900: '#121215',
          800: '#1A1A22',
          700: '#23232E',
        },
        warmtan: {
          50: '#F8F9FA',
          100: '#F1F3F5',
          200: '#E9ECEF',
          300: '#DEE2E6',
          500: '#6C757D',
        },
        fiery: {
          500: '#FFC244',
          600: '#F5B42E',
        },
        saffron: {
          500: '#FFC244',
          600: '#F5B42E',
        }
      },
    },
  },
  plugins: [],
}
