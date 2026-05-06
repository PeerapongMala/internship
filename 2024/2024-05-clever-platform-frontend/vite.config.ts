import react from '@vitejs/plugin-react';
import { execSync } from 'child_process';
import million from 'million/compiler';
import path, { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv, type PluginOption } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // Auto-generate app version: major.minor.release.build-YYYYMMDD
  const major = '1';
  const minor = '5';
  const release = '0';

  // Get build number from CI if provided, otherwise from git commit count (or 0 if git unavailable)
  // Build number should be consistent across all environments based on source code,
  // NOT on build time or environment-specific variables
  let build = env.VITE_APP_VERSION_PATCH?.trim();
  if (!build) {
    try {
      build = execSync('git rev-list --count HEAD', { encoding: 'utf8' }).trim();
    } catch (e) {
      // Fallback to 0 to ensure consistency
      build = '0';
      console.warn(
        '⚠️  Git not found - using build number 0. Run in a git repository or set VITE_APP_VERSION_PATCH in CI.',
      );
    }
  }

  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const appVersion = `${major}.${minor}.${release}.${build}-${dateStr}`;

  return {
    define: {
      'import.meta.env.VITE_APP_VERSION': JSON.stringify(appVersion),
    },
    esbuild: {
      supported: {
        'top-level-await': true,
      },
      // drop: ['console', 'debugger'],
      drop: mode === 'production' ? ['console', 'debugger'] : [],
    },
    plugins: [
      million.vite({ auto: true }),
      // https://vite-pwa-org.netlify.app/guide/register-service-worker.html
      VitePWA({
        strategies: 'generateSW',
        registerType: 'autoUpdate',
        devOptions: {
          enabled: false,
        },
        manifest: {
          name: 'Clever Platform',
          short_name: 'Clever',
          description: 'Clever Platform',
          theme_color: '#ffffff',
          display: 'standalone',
          orientation: 'landscape',
          icons: [
            {
              src: '/icons/icon-48x48.png',
              sizes: '48x48',
              type: 'image/png',
            },
            {
              src: '/icons/icon-72x72.png',
              sizes: '72x72',
              type: 'image/png',
            },
            {
              src: '/icons/icon-96x96.png',
              sizes: '96x96',
              type: 'image/png',
            },
            {
              src: '/icons/icon-128x128.png',
              sizes: '128x128',
              type: 'image/png',
            },
            {
              src: '/icons/icon-144x144.png',
              sizes: '144x144',
              type: 'image/png',
            },
            {
              src: '/icons/icon-152x152.png',
              sizes: '152x152',
              type: 'image/png',
            },
            {
              src: '/icons/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/icons/icon-256x256.png',
              sizes: '256x256',
              type: 'image/png',
            },
            {
              src: '/icons/icon-384x384.png',
              sizes: '384x384',
              type: 'image/png',
            },
            {
              src: '/icons/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
          screenshots: [
            {
              src: '/screenshots/quiz-wide.png',
              form_factor: 'wide',
              type: 'image/png',
              sizes: '1486x915',
            },
          ],
        },
        workbox: {
          navigateFallbackDenylist: [/\/index\.html$/], // Denylist for navigation fallbacks if applicable

          maximumFileSizeToCacheInBytes: 10 * 1000000, // maximum 10MB (allows large background PNGs)
          // Exclude FBX files (3D models) - they're loaded on-demand, not precached
          globPatterns: ['**/*.{ts,js,tsx,jsx,css,png,jpg,svg,json}'],
          cleanupOutdatedCaches: true,
          // 🔥 FIX: Prevent IndexedDB "connection is closing" errors
          // ⚠️ skipWaiting: false to prevent unwanted page reloads during long downloads
          // When skipWaiting: true, new SW activates immediately and may reload page
          skipWaiting: false, // Wait for clients to finish before activating
          clientsClaim: true, // Take control of all clients immediately
          runtimeCaching: [
            {
              urlPattern: ({ url }) => url.pathname.includes('index.html'),
              handler: 'NetworkFirst', // Use NetworkFirst strategy for index.html
              options: {
                cacheName: 'html-cache',
              },
            },
            {
              handler: 'NetworkFirst', // fetch on network first, then using cache
              urlPattern: new RegExp(String.raw`${env.VITE_API_BASE_URL}/.*`, 'g'),
              method: 'GET',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  // maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 7 Days
                  // 🔥 FIX: Purge expired entries on startup to avoid stale IndexedDB connections
                  purgeOnQuotaError: true,
                },
                // 🔥 FIX: Add cache will update plugin to handle race conditions
                cacheableResponse: {
                  statuses: [0, 200], // Only cache successful responses
                },
                //   backgroundSync: {
                //     name: 'myQueueName',
                //     options: {
                //       maxRetentionTime: 24 * 60,
                //     },
                //   },
              },
            },
          ],
        },
      }),
      react(),
    ],
    resolve: {
      dedupe: ['react'],
      alias: {
        '@assets': path.resolve(__dirname, 'src/context/global/assets'),
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
      port: 6101, // temporary definition - port 6101 for local test.
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
