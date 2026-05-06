import react from '@vitejs/plugin-react';
import million from 'million/compiler';
import path, { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, type PluginOption } from 'vite';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    million.vite({ auto: true }),
    react(),
    svgr({
      svgrOptions: { exportType: 'default', ref: true, svgo: false, titleProp: true },
      include: '**/*.svg',
    }),
  ],
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
    },
  },
});
