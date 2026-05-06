import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import path from "path";

export default defineConfig({
  base: "./",
  root: "",
  plugins: [react()],
  css: {
    postcss: "./postcss.config.cjs", // Ensure Vite knows to use PostCSS
  },
  resolve: {
    alias: {
      // "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 3000, // เปลี่ยนเป็นพอร์ตที่คุณต้องการ เช่น 3000
  },
  build: {
    emptyOutDir: true, //Pay attention !
    outDir: "/build/fruitninja-build",
    rollupOptions: {
      output: {
        assetFileNames: "[name].[ext]",
        chunkFileNames: "[name].[ext]",
        entryFileNames: "[name].js",
      },
    },
  },
});
