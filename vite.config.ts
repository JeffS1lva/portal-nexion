import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, UserConfig } from "vite";

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";

  return {
    base: "/", // Ensures correct base path for SPA routing
    plugins: [react(), tailwindcss(), ],
    server: {
      port:5173,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: "dist",
      assetsDir: "assets",
      emptyOutDir: true,
      sourcemap: !isProduction,
      rollupOptions: {
        input: path.resolve(__dirname, "index.html"),
      },
    },
   
  } as UserConfig;
});