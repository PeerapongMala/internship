// vite.config.ts
import react from "file:///C:/Users/newbe/OneDrive/Desktop/PartTime/clms-clever/v1/node_modules/@vitejs/plugin-react/dist/index.mjs";
import million from "file:///C:/Users/newbe/OneDrive/Desktop/PartTime/clms-clever/v1/node_modules/million/dist/packages/compiler.mjs";
import path, { resolve } from "path";
import { visualizer } from "file:///C:/Users/newbe/OneDrive/Desktop/PartTime/clms-clever/v1/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import { defineConfig } from "file:///C:/Users/newbe/OneDrive/Desktop/PartTime/clms-clever/v1/node_modules/vite/dist/node/index.js";
import svgr from "file:///C:/Users/newbe/OneDrive/Desktop/PartTime/clms-clever/v1/node_modules/vite-plugin-svgr/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\newbe\\OneDrive\\Desktop\\PartTime\\clms-clever\\v1";
var vite_config_default = defineConfig({
  plugins: [
    million.vite({ auto: true }),
    react(),
    svgr({
      svgrOptions: { exportType: "default", ref: true, svgo: false, titleProp: true },
      include: "**/*.svg"
    })
  ],
  esbuild: {
    supported: {
      "top-level-await": true
    }
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
      ]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxuZXdiZVxcXFxPbmVEcml2ZVxcXFxEZXNrdG9wXFxcXFBhcnRUaW1lXFxcXGNsbXMtY2xldmVyXFxcXHYxXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxuZXdiZVxcXFxPbmVEcml2ZVxcXFxEZXNrdG9wXFxcXFBhcnRUaW1lXFxcXGNsbXMtY2xldmVyXFxcXHYxXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9uZXdiZS9PbmVEcml2ZS9EZXNrdG9wL1BhcnRUaW1lL2NsbXMtY2xldmVyL3YxL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcclxuaW1wb3J0IG1pbGxpb24gZnJvbSAnbWlsbGlvbi9jb21waWxlcic7XHJcbmltcG9ydCBwYXRoLCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJztcclxuaW1wb3J0IHsgdmlzdWFsaXplciB9IGZyb20gJ3JvbGx1cC1wbHVnaW4tdmlzdWFsaXplcic7XHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZywgdHlwZSBQbHVnaW5PcHRpb24gfSBmcm9tICd2aXRlJztcclxuaW1wb3J0IHN2Z3IgZnJvbSAndml0ZS1wbHVnaW4tc3Zncic7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtcclxuICAgIG1pbGxpb24udml0ZSh7IGF1dG86IHRydWUgfSksXHJcbiAgICByZWFjdCgpLFxyXG4gICAgc3Zncih7XHJcbiAgICAgIHN2Z3JPcHRpb25zOiB7IGV4cG9ydFR5cGU6ICdkZWZhdWx0JywgcmVmOiB0cnVlLCBzdmdvOiBmYWxzZSwgdGl0bGVQcm9wOiB0cnVlIH0sXHJcbiAgICAgIGluY2x1ZGU6ICcqKi8qLnN2ZycsXHJcbiAgICB9KSxcclxuICAgIFxyXG4gIF0sXHJcbiAgZXNidWlsZDoge1xyXG4gICAgc3VwcG9ydGVkOiB7XHJcbiAgICAgICd0b3AtbGV2ZWwtYXdhaXQnOiB0cnVlXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgZGVkdXBlOiBbJ3JlYWN0J10sXHJcbiAgICBhbGlhczoge1xyXG4gICAgICAnQGFzc2V0JzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9jb250ZXh0L2dsb2JhbC9hc3NldCcpLFxyXG4gICAgICAnQGNvbXBvbmVudCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvY29udGV4dC9nbG9iYWwvY29tcG9uZW50JyksXHJcbiAgICAgICdAc3RvcmUnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL2NvbnRleHQvZ2xvYmFsL3N0b3JlJyksXHJcbiAgICAgICdAZG9tYWluJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9jb250ZXh0L2RvbWFpbicpLFxyXG4gICAgICAnQGdsb2JhbCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvY29udGV4dC9nbG9iYWwnKSxcclxuICAgICAgJ0Bjb3JlJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9jb3JlJyksXHJcbiAgICAgICdAZXh0ZXJuYWwnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL2V4dGVybmFsJyksXHJcbiAgICAgICdAY29udGV4dCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvY29udGV4dCcpLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHNlcnZlcjoge1xyXG4gICAgcG9ydDogNTAwNCxcclxuICB9LFxyXG4gIGJ1aWxkOiB7XHJcbiAgICAvLyBcdTBFNDRcdTBFMjFcdTBFNDhcdTBFNDFcdTBFMUJcdTBFMjVcdTBFMDcgaW1hZ2UgXHUwRTQzXHUwRTJCXHUwRTQ5XHUwRTQwXHUwRTFCXHUwRTQ3XHUwRTE5IGJhc2U2NFxyXG4gICAgYXNzZXRzSW5saW5lTGltaXQ6IDAsXHJcblxyXG4gICAgLy8gb3V0RGlyOiAnLi9ob3N0aW5nL3B1YmxpYycsXHJcbiAgICBtaW5pZnk6ICdlc2J1aWxkJyxcclxuICAgIHNvdXJjZW1hcDogZmFsc2UsXHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIHBsdWdpbnM6IFtcclxuICAgICAgICB2aXN1YWxpemVyKHtcclxuICAgICAgICAgIGZpbGVuYW1lOiByZXNvbHZlKF9fZGlybmFtZSwgJ2FuYWx5dGljcy9zdGF0cy10cmVlbWFwLmh0bWwnKSxcclxuICAgICAgICAgIHRlbXBsYXRlOiAndHJlZW1hcCcsXHJcbiAgICAgICAgfSkgYXMgdW5rbm93biBhcyBQbHVnaW5PcHRpb24sXHJcbiAgICAgICAgdmlzdWFsaXplcih7XHJcbiAgICAgICAgICBmaWxlbmFtZTogcmVzb2x2ZShfX2Rpcm5hbWUsICdhbmFseXRpY3Mvc3RhdHMtc3VuYnVyc3QuaHRtbCcpLFxyXG4gICAgICAgICAgdGVtcGxhdGU6ICdzdW5idXJzdCcsXHJcbiAgICAgICAgfSkgYXMgdW5rbm93biBhcyBQbHVnaW5PcHRpb24sXHJcbiAgICAgICAgdmlzdWFsaXplcih7XHJcbiAgICAgICAgICBmaWxlbmFtZTogcmVzb2x2ZShfX2Rpcm5hbWUsICdhbmFseXRpY3Mvc3RhdHMtbmV0d29yay5odG1sJyksXHJcbiAgICAgICAgICB0ZW1wbGF0ZTogJ25ldHdvcmsnLFxyXG4gICAgICAgIH0pIGFzIHVua25vd24gYXMgUGx1Z2luT3B0aW9uLFxyXG4gICAgICBdLFxyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF1VyxPQUFPLFdBQVc7QUFDelgsT0FBTyxhQUFhO0FBQ3BCLE9BQU8sUUFBUSxlQUFlO0FBQzlCLFNBQVMsa0JBQWtCO0FBQzNCLFNBQVMsb0JBQXVDO0FBQ2hELE9BQU8sVUFBVTtBQUxqQixJQUFNLG1DQUFtQztBQVF6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxRQUFRLEtBQUssRUFBRSxNQUFNLEtBQUssQ0FBQztBQUFBLElBQzNCLE1BQU07QUFBQSxJQUNOLEtBQUs7QUFBQSxNQUNILGFBQWEsRUFBRSxZQUFZLFdBQVcsS0FBSyxNQUFNLE1BQU0sT0FBTyxXQUFXLEtBQUs7QUFBQSxNQUM5RSxTQUFTO0FBQUEsSUFDWCxDQUFDO0FBQUEsRUFFSDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsV0FBVztBQUFBLE1BQ1QsbUJBQW1CO0FBQUEsSUFDckI7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxRQUFRLENBQUMsT0FBTztBQUFBLElBQ2hCLE9BQU87QUFBQSxNQUNMLFVBQVUsS0FBSyxRQUFRLGtDQUFXLDBCQUEwQjtBQUFBLE1BQzVELGNBQWMsS0FBSyxRQUFRLGtDQUFXLDhCQUE4QjtBQUFBLE1BQ3BFLFVBQVUsS0FBSyxRQUFRLGtDQUFXLDBCQUEwQjtBQUFBLE1BQzVELFdBQVcsS0FBSyxRQUFRLGtDQUFXLG9CQUFvQjtBQUFBLE1BQ3ZELFdBQVcsS0FBSyxRQUFRLGtDQUFXLG9CQUFvQjtBQUFBLE1BQ3ZELFNBQVMsS0FBSyxRQUFRLGtDQUFXLFVBQVU7QUFBQSxNQUMzQyxhQUFhLEtBQUssUUFBUSxrQ0FBVyxjQUFjO0FBQUEsTUFDbkQsWUFBWSxLQUFLLFFBQVEsa0NBQVcsYUFBYTtBQUFBLElBQ25EO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLE9BQU87QUFBQTtBQUFBLElBRUwsbUJBQW1CO0FBQUE7QUFBQSxJQUduQixRQUFRO0FBQUEsSUFDUixXQUFXO0FBQUEsSUFDWCxlQUFlO0FBQUEsTUFDYixTQUFTO0FBQUEsUUFDUCxXQUFXO0FBQUEsVUFDVCxVQUFVLFFBQVEsa0NBQVcsOEJBQThCO0FBQUEsVUFDM0QsVUFBVTtBQUFBLFFBQ1osQ0FBQztBQUFBLFFBQ0QsV0FBVztBQUFBLFVBQ1QsVUFBVSxRQUFRLGtDQUFXLCtCQUErQjtBQUFBLFVBQzVELFVBQVU7QUFBQSxRQUNaLENBQUM7QUFBQSxRQUNELFdBQVc7QUFBQSxVQUNULFVBQVUsUUFBUSxrQ0FBVyw4QkFBOEI7QUFBQSxVQUMzRCxVQUFVO0FBQUEsUUFDWixDQUFDO0FBQUEsTUFDSDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
