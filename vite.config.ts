// vite.config.ts
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";
  const isPreview = mode === "preview"; // para vercel/fly preview

  return {
    base: "/",
    plugins: [react(), tailwindcss()],

    // URL base da API (com /users no final)
    define: {
      "import.meta.env.VITE_API_URL": JSON.stringify(
        isProduction || isPreview
          ? "https://portal-nexion.fly.dev/users"
          : "http://localhost:3000/users"
      ),
    },

    server: {
      port: 5173,
      host: true, // permite acesso externo (útil em rede local)
      open: true,

      // Proxy só em desenvolvimento
      proxy: isProduction
        ? undefined
        : {
            "/api": {
              target: "http://localhost:3000",
              changeOrigin: true,
              secure: false,
              // Converte /api/login → /users/login
              rewrite: (path) => path.replace(/^\/api/, "/users"),
            },
          },
    },

    preview: {
      port: 4173,
      // Em preview (fly deploy --preview), também usa HTTPS direto
      proxy: undefined,
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
      sourcemap: isProduction ? false : "inline",
      rollupOptions: {
        input: path.resolve(__dirname, "index.html"),
      },
    },
  };
});