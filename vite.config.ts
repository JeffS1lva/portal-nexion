import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, UserConfig } from "vite";

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";

  return {
    base: "/",
    plugins: [react(), tailwindcss()],

    // PROXY: Só ativo em desenvolvimento
    server: {
      port: 5173,
      proxy: !isProduction
        ? {
            // Todas as chamadas para /api vão para o backend
            "/api": {
              target: "http://localhost:3000",
              changeOrigin: true,
              secure: false,
              // Reescrita: /api/login → /users/login
              rewrite: (path) => path.replace(/^\/api/, "/users"),
            },
          }
        : undefined,
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