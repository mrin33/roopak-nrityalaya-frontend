/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8B4513', // Saddle Brown
          dark: '#6B3410',
          light: '#A0522D',
        },
        secondary: {
          DEFAULT: '#D4AF37', // Gold
          dark: '#B8941F',
          light: '#E5C158',
        },
        accent: {
          DEFAULT: '#2C3E50', // Dark slate
          dark: '#1A252F',
          light: '#34495E',
        },
        background: {
          DEFAULT: '#FEFEFE', // Off-white
          gray: '#F5F5F5',
        }
      },
      fontFamily: {
        'heading': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
