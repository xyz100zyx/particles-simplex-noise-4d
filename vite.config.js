import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    glsl(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,glb,ico,png,svg,woff,woff2}"],
      },
      manifest: {
        name: "My Vite App",
        short_name: "ViteApp",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  server: {
    https: true,
  },
});
