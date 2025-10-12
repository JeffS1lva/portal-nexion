import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, UserConfig } from "vite";

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";

  return {
    base: "/", // relativo para Electron, ou "/" para web
    plugins: [react(), tailwindcss()],
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
        input: path.resolve(__dirname, "index.html"), // ✅ correto
      },
    },
  } as UserConfig;
});
