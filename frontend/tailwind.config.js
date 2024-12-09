/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        '18': '4.6rem',
        '30': '7.6rem',
      },
      colors: {

        // Add or override colors here
        navbar: "#319795",
        background: '#2d3748',
        cardBackground: '#3b4959',
        textOnCard: '#319795',
    },
    },
  },
  plugins: [],
}

