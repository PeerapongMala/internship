import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  // const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), tailwindcss()],
    css: {
      postcss: './postcss.config.cjs', // Ensure Vite knows to use PostCSS
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@public-assets': path.resolve(
          __dirname,
          'src/assets/public-assets-locations.ts',
        ),
        '@core-utils': path.resolve(__dirname, 'src/utils/core-utils'),
      },
    },
    server: {
      port: 3003,
      open: true,
    },
  };
});
