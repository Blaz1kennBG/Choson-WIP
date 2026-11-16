/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0d0d0d',
          light: '#1a1a1a',
          card: '#222222',
          hover: '#2a2a2a',
          border: '#333333',
        },
      },
    },
  },
  plugins: [],
}
