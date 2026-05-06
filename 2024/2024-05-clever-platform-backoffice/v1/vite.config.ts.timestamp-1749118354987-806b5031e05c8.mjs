// vite.config.ts
import react from "file:///Volumes/ssd_work/git/2024-05-clever-platform-backoffice/v1/node_modules/@vitejs/plugin-react-swc/index.mjs";
import million from "file:///Volumes/ssd_work/git/2024-05-clever-platform-backoffice/v1/node_modules/million/dist/packages/compiler.mjs";
import path, { resolve } from "path";
import { visualizer } from "file:///Volumes/ssd_work/git/2024-05-clever-platform-backoffice/v1/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import { defineConfig } from "file:///Volumes/ssd_work/git/2024-05-clever-platform-backoffice/v1/node_modules/vite/dist/node/index.js";
import svgr from "file:///Volumes/ssd_work/git/2024-05-clever-platform-backoffice/v1/node_modules/vite-plugin-svgr/dist/index.js";
import checker from "file:///Volumes/ssd_work/git/2024-05-clever-platform-backoffice/v1/node_modules/vite-plugin-checker/dist/main.js";
import tailwindcss from "file:///Volumes/ssd_work/git/2024-05-clever-platform-backoffice/v1/node_modules/tailwindcss/lib/index.js";
var __vite_injected_original_dirname = "/Volumes/ssd_work/git/2024-05-clever-platform-backoffice/v1";
var vite_config_default = defineConfig({
  plugins: [
    million.vite({
      auto: true,
      filter: {
        exclude: ["**/*icon*.tsx", "**/*Icon*.tsx"]
      }
    }),
    react(),
    svgr({
      svgrOptions: { exportType: "default", ref: true, svgo: false, titleProp: true },
      include: "**/*.svg"
    }),
    checker({ typescript: true, enableBuild: false })
  ],
  css: {
    postcss: {
      plugins: [tailwindcss()]
    }
  },
  esbuild: {
    supported: {
      "top-level-await": true
    },
    loader: "tsx",
    target: "es2020"
  },
  resolve: {
    dedupe: ["react"],
    alias: {
      "@asset": path.resolve(__vite_injected_original_dirname, "src/context/global/asset"),
      "@component": path.resolve(__vite_injected_original_dirname, "src/context/global/component"),
      "@store": path.resolve(__vite_injected_original_dirname, "src/context/global/store"),
      "@domain": path.resolve(__vite_injected_original_dirname, "src/context/domain"),
      "@global": path.resolve(__vite_injected_original_dirname, "src/context/global"),
      "@core": path.resolve(__vite_injected_original_dirname, "src/core"),
      "@external": path.resolve(__vite_injected_original_dirname, "src/external"),
      "@context": path.resolve(__vite_injected_original_dirname, "src/context")
    }
  },
  server: {
    port: 5004,
    allowedHosts: ["dev-clms.nextgen-education.com"]
  },
  preview: {
    port: 5004
  },
  build: {
    // ไม่แปลง image ให้เป็น base64
    assetsInlineLimit: 0,
    // outDir: './hosting/public',
    minify: "esbuild",
    sourcemap: false,
    rollupOptions: {
      plugins: [
        visualizer({
          filename: resolve(__vite_injected_original_dirname, "analytics/stats-treemap.html"),
          template: "treemap"
        }),
        visualizer({
          filename: resolve(__vite_injected_original_dirname, "analytics/stats-sunburst.html"),
          template: "sunburst"
        }),
        visualizer({
          filename: resolve(__vite_injected_original_dirname, "analytics/stats-network.html"),
          template: "network"
        })
      ],
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"]
          // ตัวอย่างการแยก library ออกมา
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVm9sdW1lcy9zc2Rfd29yay9naXQvMjAyNC0wNS1jbGV2ZXItcGxhdGZvcm0tYmFja29mZmljZS92MVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1ZvbHVtZXMvc3NkX3dvcmsvZ2l0LzIwMjQtMDUtY2xldmVyLXBsYXRmb3JtLWJhY2tvZmZpY2UvdjEvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1ZvbHVtZXMvc3NkX3dvcmsvZ2l0LzIwMjQtMDUtY2xldmVyLXBsYXRmb3JtLWJhY2tvZmZpY2UvdjEvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djJztcbmltcG9ydCBtaWxsaW9uIGZyb20gJ21pbGxpb24vY29tcGlsZXInO1xuaW1wb3J0IHBhdGgsIHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgdmlzdWFsaXplciB9IGZyb20gJ3JvbGx1cC1wbHVnaW4tdmlzdWFsaXplcic7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIHR5cGUgUGx1Z2luT3B0aW9uIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgc3ZnciBmcm9tICd2aXRlLXBsdWdpbi1zdmdyJztcbmltcG9ydCBjaGVja2VyIGZyb20gJ3ZpdGUtcGx1Z2luLWNoZWNrZXInO1xuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gJ3RhaWx3aW5kY3NzJztcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICBtaWxsaW9uLnZpdGUoe1xuICAgICAgYXV0bzogdHJ1ZSxcbiAgICAgIGZpbHRlcjoge1xuICAgICAgICBleGNsdWRlOiBbJyoqLyppY29uKi50c3gnLCAnKiovKkljb24qLnRzeCddLFxuICAgICAgfSxcbiAgICB9KSxcbiAgICByZWFjdCgpLFxuICAgIHN2Z3Ioe1xuICAgICAgc3Znck9wdGlvbnM6IHsgZXhwb3J0VHlwZTogJ2RlZmF1bHQnLCByZWY6IHRydWUsIHN2Z286IGZhbHNlLCB0aXRsZVByb3A6IHRydWUgfSxcbiAgICAgIGluY2x1ZGU6ICcqKi8qLnN2ZycsXG4gICAgfSksXG4gICAgY2hlY2tlcih7IHR5cGVzY3JpcHQ6IHRydWUsIGVuYWJsZUJ1aWxkOiBmYWxzZSB9KSxcbiAgXSxcbiAgY3NzOiB7XG4gICAgcG9zdGNzczoge1xuICAgICAgcGx1Z2luczogW3RhaWx3aW5kY3NzKCldLFxuICAgIH0sXG4gIH0sXG4gIGVzYnVpbGQ6IHtcbiAgICBzdXBwb3J0ZWQ6IHtcbiAgICAgICd0b3AtbGV2ZWwtYXdhaXQnOiB0cnVlLFxuICAgIH0sXG4gICAgbG9hZGVyOiAndHN4JyxcbiAgICB0YXJnZXQ6ICdlczIwMjAnLFxuICB9LFxuICByZXNvbHZlOiB7XG4gICAgZGVkdXBlOiBbJ3JlYWN0J10sXG4gICAgYWxpYXM6IHtcbiAgICAgICdAYXNzZXQnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL2NvbnRleHQvZ2xvYmFsL2Fzc2V0JyksXG4gICAgICAnQGNvbXBvbmVudCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvY29udGV4dC9nbG9iYWwvY29tcG9uZW50JyksXG4gICAgICAnQHN0b3JlJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9jb250ZXh0L2dsb2JhbC9zdG9yZScpLFxuICAgICAgJ0Bkb21haW4nOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL2NvbnRleHQvZG9tYWluJyksXG4gICAgICAnQGdsb2JhbCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvY29udGV4dC9nbG9iYWwnKSxcbiAgICAgICdAY29yZSc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvY29yZScpLFxuICAgICAgJ0BleHRlcm5hbCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvZXh0ZXJuYWwnKSxcbiAgICAgICdAY29udGV4dCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvY29udGV4dCcpLFxuICAgIH0sXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDUwMDQsXG4gICAgYWxsb3dlZEhvc3RzOiBbJ2Rldi1jbG1zLm5leHRnZW4tZWR1Y2F0aW9uLmNvbSddLFxuICB9LFxuICBwcmV2aWV3OiB7XG4gICAgcG9ydDogNTAwNCxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICAvLyBcdTBFNDRcdTBFMjFcdTBFNDhcdTBFNDFcdTBFMUJcdTBFMjVcdTBFMDcgaW1hZ2UgXHUwRTQzXHUwRTJCXHUwRTQ5XHUwRTQwXHUwRTFCXHUwRTQ3XHUwRTE5IGJhc2U2NFxuICAgIGFzc2V0c0lubGluZUxpbWl0OiAwLFxuXG4gICAgLy8gb3V0RGlyOiAnLi9ob3N0aW5nL3B1YmxpYycsXG4gICAgbWluaWZ5OiAnZXNidWlsZCcsXG4gICAgc291cmNlbWFwOiBmYWxzZSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBwbHVnaW5zOiBbXG4gICAgICAgIHZpc3VhbGl6ZXIoe1xuICAgICAgICAgIGZpbGVuYW1lOiByZXNvbHZlKF9fZGlybmFtZSwgJ2FuYWx5dGljcy9zdGF0cy10cmVlbWFwLmh0bWwnKSxcbiAgICAgICAgICB0ZW1wbGF0ZTogJ3RyZWVtYXAnLFxuICAgICAgICB9KSBhcyB1bmtub3duIGFzIFBsdWdpbk9wdGlvbixcbiAgICAgICAgdmlzdWFsaXplcih7XG4gICAgICAgICAgZmlsZW5hbWU6IHJlc29sdmUoX19kaXJuYW1lLCAnYW5hbHl0aWNzL3N0YXRzLXN1bmJ1cnN0Lmh0bWwnKSxcbiAgICAgICAgICB0ZW1wbGF0ZTogJ3N1bmJ1cnN0JyxcbiAgICAgICAgfSkgYXMgdW5rbm93biBhcyBQbHVnaW5PcHRpb24sXG4gICAgICAgIHZpc3VhbGl6ZXIoe1xuICAgICAgICAgIGZpbGVuYW1lOiByZXNvbHZlKF9fZGlybmFtZSwgJ2FuYWx5dGljcy9zdGF0cy1uZXR3b3JrLmh0bWwnKSxcbiAgICAgICAgICB0ZW1wbGF0ZTogJ25ldHdvcmsnLFxuICAgICAgICB9KSBhcyB1bmtub3duIGFzIFBsdWdpbk9wdGlvbixcbiAgICAgIF0sXG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgdmVuZG9yOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbSddLCAvLyBcdTBFMTVcdTBFMzFcdTBFMjdcdTBFMkRcdTBFMjJcdTBFNDhcdTBFMzJcdTBFMDdcdTBFMDFcdTBFMzJcdTBFMjNcdTBFNDFcdTBFMjJcdTBFMDEgbGlicmFyeSBcdTBFMkRcdTBFMkRcdTBFMDFcdTBFMjFcdTBFMzJcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFtVyxPQUFPLFdBQVc7QUFDclgsT0FBTyxhQUFhO0FBQ3BCLE9BQU8sUUFBUSxlQUFlO0FBQzlCLFNBQVMsa0JBQWtCO0FBQzNCLFNBQVMsb0JBQXVDO0FBQ2hELE9BQU8sVUFBVTtBQUNqQixPQUFPLGFBQWE7QUFDcEIsT0FBTyxpQkFBaUI7QUFQeEIsSUFBTSxtQ0FBbUM7QUFVekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsUUFBUSxLQUFLO0FBQUEsTUFDWCxNQUFNO0FBQUEsTUFDTixRQUFRO0FBQUEsUUFDTixTQUFTLENBQUMsaUJBQWlCLGVBQWU7QUFBQSxNQUM1QztBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsTUFBTTtBQUFBLElBQ04sS0FBSztBQUFBLE1BQ0gsYUFBYSxFQUFFLFlBQVksV0FBVyxLQUFLLE1BQU0sTUFBTSxPQUFPLFdBQVcsS0FBSztBQUFBLE1BQzlFLFNBQVM7QUFBQSxJQUNYLENBQUM7QUFBQSxJQUNELFFBQVEsRUFBRSxZQUFZLE1BQU0sYUFBYSxNQUFNLENBQUM7QUFBQSxFQUNsRDtBQUFBLEVBQ0EsS0FBSztBQUFBLElBQ0gsU0FBUztBQUFBLE1BQ1AsU0FBUyxDQUFDLFlBQVksQ0FBQztBQUFBLElBQ3pCO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsV0FBVztBQUFBLE1BQ1QsbUJBQW1CO0FBQUEsSUFDckI7QUFBQSxJQUNBLFFBQVE7QUFBQSxJQUNSLFFBQVE7QUFBQSxFQUNWO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxRQUFRLENBQUMsT0FBTztBQUFBLElBQ2hCLE9BQU87QUFBQSxNQUNMLFVBQVUsS0FBSyxRQUFRLGtDQUFXLDBCQUEwQjtBQUFBLE1BQzVELGNBQWMsS0FBSyxRQUFRLGtDQUFXLDhCQUE4QjtBQUFBLE1BQ3BFLFVBQVUsS0FBSyxRQUFRLGtDQUFXLDBCQUEwQjtBQUFBLE1BQzVELFdBQVcsS0FBSyxRQUFRLGtDQUFXLG9CQUFvQjtBQUFBLE1BQ3ZELFdBQVcsS0FBSyxRQUFRLGtDQUFXLG9CQUFvQjtBQUFBLE1BQ3ZELFNBQVMsS0FBSyxRQUFRLGtDQUFXLFVBQVU7QUFBQSxNQUMzQyxhQUFhLEtBQUssUUFBUSxrQ0FBVyxjQUFjO0FBQUEsTUFDbkQsWUFBWSxLQUFLLFFBQVEsa0NBQVcsYUFBYTtBQUFBLElBQ25EO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sY0FBYyxDQUFDLGdDQUFnQztBQUFBLEVBQ2pEO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0EsT0FBTztBQUFBO0FBQUEsSUFFTCxtQkFBbUI7QUFBQTtBQUFBLElBR25CLFFBQVE7QUFBQSxJQUNSLFdBQVc7QUFBQSxJQUNYLGVBQWU7QUFBQSxNQUNiLFNBQVM7QUFBQSxRQUNQLFdBQVc7QUFBQSxVQUNULFVBQVUsUUFBUSxrQ0FBVyw4QkFBOEI7QUFBQSxVQUMzRCxVQUFVO0FBQUEsUUFDWixDQUFDO0FBQUEsUUFDRCxXQUFXO0FBQUEsVUFDVCxVQUFVLFFBQVEsa0NBQVcsK0JBQStCO0FBQUEsVUFDNUQsVUFBVTtBQUFBLFFBQ1osQ0FBQztBQUFBLFFBQ0QsV0FBVztBQUFBLFVBQ1QsVUFBVSxRQUFRLGtDQUFXLDhCQUE4QjtBQUFBLFVBQzNELFVBQVU7QUFBQSxRQUNaLENBQUM7QUFBQSxNQUNIO0FBQUEsTUFDQSxRQUFRO0FBQUEsUUFDTixjQUFjO0FBQUEsVUFDWixRQUFRLENBQUMsU0FBUyxXQUFXO0FBQUE7QUFBQSxRQUMvQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
