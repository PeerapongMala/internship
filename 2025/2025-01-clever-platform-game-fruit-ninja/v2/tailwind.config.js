/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    // position
    'top-0',
    'top-1/2',
    'bottom-0',
    'left-0',
    'left-1/2',
    'right-0',

    // translate
    '-translate-x-1/2',
    '-translate-y-1/2',

    // stretch
    'inset-0',

    // justify / items
    'items-start',
    'items-center',
    'items-end',
    'justify-start',
    'justify-center',
    'justify-end',
  ],
  theme: {
    extend: {
      colors: {
        chocolate: '#D2691E',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
