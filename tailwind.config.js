/** @type {import('tailwindcss').Config} */
/* eslint-env node */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: ['sans-serif'],
    },
    extend: {
      colors: {
        ci: '#38bdf8', // TODO: replace color when we have real ci colors
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
