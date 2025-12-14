/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ec4899', // Pink-500
        secondary: '#fbcfe8', // Pink-200
      }
    },
  },
  plugins: [],
}