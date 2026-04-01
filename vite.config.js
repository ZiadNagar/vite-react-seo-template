import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { siteSeoPlugin } from "./vite-plugin-site-seo.mjs";

export default defineConfig({
  plugins: [
    react(),
    siteSeoPlugin(), // Injects SEO tags into index.html + generates sitemap.xml
  ],
  resolve: {
    // Enables imports like "@/seo/config" and "@/components/seo/RouteSeo"
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});