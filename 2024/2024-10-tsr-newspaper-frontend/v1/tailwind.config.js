/** @type {import('tailwindcss').Config} */

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        freesize: '1020px',
      },
      fontSize: {
        '20px': '20px',
        'xxs' : '3px'
      },
      colors: {
        background: 'var(--color-background)',
        text: 'var(--color-text)',
        secondary: '#D9A84E',
        'gray-custom': '#414141',
        dark: '#262626',
        darkBox : '#414141',
      },
      darkMode: 'class',
    },
  },
  plugins: [],
};
