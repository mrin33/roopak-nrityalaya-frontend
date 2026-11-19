/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

/*
 * Roopak Nrityalaya design tokens.
 * Brown (primary) + antique gold (secondary) on warm ivory/sand neutrals.
 * `gray` is mapped to Tailwind's warm "stone" scale so every existing
 * gray utility picks up the warmer palette.
 */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gray: colors.stone,
        primary: {
          50: '#FBF4EF',
          100: '#F5E4D8',
          200: '#EAC7B0',
          300: '#D9A07F',
          400: '#BF7650',
          500: '#A35A2F',
          600: '#8B4513',
          700: '#71370F',
          800: '#57290C',
          900: '#3D1D09',
          DEFAULT: '#8B4513', // Saddle brown — brand colour
          dark: '#6B3410',
          light: '#A0522D',
        },
        secondary: {
          50: '#FCF8EC',
          100: '#F7EDCB',
          200: '#EFDC98',
          300: '#E5C766',
          400: '#DBB846',
          500: '#D4AF37',
          600: '#B8941F',
          700: '#8C6F14', // readable gold for text on light backgrounds
          800: '#6A5411',
          900: '#4A3A0D',
          DEFAULT: '#D4AF37', // Antique gold
          dark: '#B8941F',
          light: '#E5C158',
        },
        accent: {
          DEFAULT: '#2B201A', // Warm ink (text, dark surfaces)
          dark: '#1B130E',
          light: '#4A3A30',
        },
        sand: {
          50: '#FBF8F3',
          100: '#F5EFE6',
          200: '#EBE1D2',
          300: '#DDCDB6',
          400: '#C7B192',
        },
        background: {
          DEFAULT: '#FBF8F3', // Ivory
          gray: '#F5EFE6',
        },
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(43, 32, 26, 0.04), 0 1px 3px rgba(43, 32, 26, 0.06)',
        lift: '0 10px 30px -12px rgba(61, 29, 9, 0.25)',
        drawer: '0 0 40px rgba(27, 19, 14, 0.25)',
      },
      keyframes: {
        'fade-in': { from: { opacity: 0 }, to: { opacity: 1 } },
        'rise-in': {
          from: { opacity: 0, transform: 'translateY(6px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: 0, transform: 'scale(0.97)' },
          to: { opacity: 1, transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 180ms ease-out both',
        'rise-in': 'rise-in 260ms ease-out both',
        'scale-in': 'scale-in 180ms ease-out both',
      },
    },
  },
  plugins: [],
};
