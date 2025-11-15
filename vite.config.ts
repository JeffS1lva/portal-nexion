import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";

  return {
    base: "/",
    plugins: [react(), tailwindcss()],

    define: {
      __API_URL__: JSON.stringify(
        isProduction
          ? "https://portal-nexion.fly.dev/api" // produção
          : "http://localhost:3000/users" // desenvolvimento (proxy local)
      ),
    },

    server: {
      port: 5173,
      proxy: !isProduction
        ? {
            "/api": {
              target: "http://localhost:3000",
              changeOrigin: true,
              secure: false,
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
  };
});
