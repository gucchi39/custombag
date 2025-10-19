/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef2f8',
          100: '#fde6f3',
          200: '#fccce9',
          300: '#faa2d6',
          400: '#f668b9',
          500: '#ee3b9b',
          600: '#dd1a79',
          700: '#c0105f',
          800: '#9e124f',
          900: '#841445',
        },
      },
      fontFamily: {
        sans: ['Inter var', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
