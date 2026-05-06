import react from '@vitejs/plugin-react-swc';
import million from 'million/compiler';
import path, { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, type PluginOption } from 'vite';
import svgr from 'vite-plugin-svgr';
import checker from 'vite-plugin-checker';
import tailwindcss from 'tailwindcss';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    million.vite({
      auto: true,
      filter: {
        exclude: ['**/*icon*.tsx', '**/*Icon*.tsx'],
      },
    }),
    react(),
    svgr({
      svgrOptions: { exportType: 'default', ref: true, svgo: false, titleProp: true },
      include: '**/*.svg',
    }),
    checker({ typescript: true, enableBuild: false }),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  esbuild: {
    supported: {
      'top-level-await': true,
    },
    loader: 'tsx',
    target: 'es2020',
  },
  resolve: {
    dedupe: ['react'],
    alias: {
      '@asset': path.resolve(__dirname, 'src/context/global/asset'),
      '@component': path.resolve(__dirname, 'src/context/global/component'),
      '@store': path.resolve(__dirname, 'src/context/global/store'),
      '@domain': path.resolve(__dirname, 'src/context/domain'),
      '@global': path.resolve(__dirname, 'src/context/global'),
      '@core': path.resolve(__dirname, 'src/core'),
      '@external': path.resolve(__dirname, 'src/external'),
      '@context': path.resolve(__dirname, 'src/context'),
    },
  },
  server: {
    port: 5004,
    allowedHosts: ['dev-clms.nextgen-education.com'],
  },
  preview: {
    port: 5004,
  },
  build: {
    // ไม่แปลง image ให้เป็น base64
    assetsInlineLimit: 0,

    // outDir: './hosting/public',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      plugins: [
        visualizer({
          filename: resolve(__dirname, 'analytics/stats-treemap.html'),
          template: 'treemap',
        }) as unknown as PluginOption,
        visualizer({
          filename: resolve(__dirname, 'analytics/stats-sunburst.html'),
          template: 'sunburst',
        }) as unknown as PluginOption,
        visualizer({
          filename: resolve(__dirname, 'analytics/stats-network.html'),
          template: 'network',
        }) as unknown as PluginOption,
      ],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'], // ตัวอย่างการแยก library ออกมา
        },
      },
    },
  },
});
