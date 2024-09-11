/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        custom: '0 2px 6px rgba(28, 28, 30, 0.08)'
      }
    }
  },
  plugins: []
}
