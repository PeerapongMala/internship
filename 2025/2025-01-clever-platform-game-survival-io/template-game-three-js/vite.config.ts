import path, { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, type PluginOption } from 'vite';
// import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // const env = loadEnv(mode, process.cwd(), '');
  return {
    esbuild: {
      supported: {
        'top-level-await': true,
      },
    },
    plugins: [],
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
      port: 3000, // temporary definition - port 3000 for local test.
    },
    assetsInclude: ['**/*.fbx'], // include 3d model file treated as static assets.
    build: {
      // build target to esnext which support modern browser
      target: 'esnext',
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
  };
});
