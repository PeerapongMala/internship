/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('tailwindcss').Config} */

const theme = process.env.VITE_THEME || 'default';
const themeConfig = require(`./tailwind-preset/${theme}/tailwind-preset.js`);

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  presets: [themeConfig],
  theme: {
    extend: {
      fontFamily: {
        noto: ['Noto Sans Thai', 'sans-serif'],
      },
      animation: {
        progressGradient:
          'progressGradient 4s cubic-bezier(0.39, 0.575, 0.565, 1) infinite',
      },
      keyframes: {
        progressGradient: {
          '0%': {
            'background-position': '100% 0',
            'background-size': '200% 100%',
          },
          '50%': {
            'background-size': '150% 100%',
          },
          '100%': {
            'background-position': '0 0',
            'background-size': '200% 100%',
          },
        },
      },
      // fontFamily: {
      //   hx: ['hx', 'sans-serif'],
      //   'hx-b': ['hx-b', 'sans-serif'],
      // },
    },
  },
  plugins: [],
};
