import { fileURLToPath, URL } from 'node:url'
import Vue from '@vitejs/plugin-vue'
import Fonts from 'unplugin-fonts/vite'
import { defineConfig, loadEnv } from 'vite'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      Vue({
        template: { transformAssetUrls },
      }),
      Vuetify({
        autoImport: true,
        styles: {
          configFile: 'src/styles/settings.scss',
        },
      }),
      Fonts({
        fontsource: {
          families: [
            {
              name: 'Outfit',
              weights: [100, 300, 400, 500, 700, 900],
              styles: ['normal'],
            },
          ],
        },
      }),
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: "auto",
        includeAssets: ["favicon.ico", "images/pwa/apple-touch-icon-180x180.png", "images/pwa/maskable-icon-512x512.png", "images/pwa/pwa-64x64.png", "images/pwa/pwa-192x192.png", "images/pwa/pwa-512x512.png"],
        manifest: {
          name: `${env.VITE_APP_NAME} - ${env.VITE_TITLE}`,
          short_name: env.VITE_APP_NAME,
          start_url: "/",
          display: "fullscreen",
          description: env.VITE_DESCRIPTON,
          theme_color: "#187eb1",
          background_color: "#187eb1",
          lang: "pt-BR",
          orientation: "any",
          icons: [
            {
              src: "images/pwa/pwa-64x64.png",
              sizes: "64x64",
              type: "image/png",
            },
            {
              src: "images/pwa/pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "images/pwa/pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "images/pwa/maskable-icon-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable",
            },
          ],
        },
        workbox: {
          skipWaiting: true,
          clientsClaim: true,
          maximumFileSizeToCacheInBytes: 4000000,
          globPatterns: ["**/*.{js,css,html,ico,png,svg,webp}"],
        },
        devOptions: {
          enabled: true,
          type: 'module'
        },
      }),
    ],
    define: {
      'process.env': {},
      global: "window",
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('src', import.meta.url)),
      },
      extensions: [
        '.js',
        '.json',
        '.jsx',
        '.mjs',
        '.ts',
        '.tsx',
        '.vue',
      ],
    },
    build: {
      chunkSizeWarningLimit: 4000,
      modulePreload: {
        resolveDependencies: (_filename, deps) => {
          return deps.filter(dep => !['.woff', '.woff2', '.eot', '.ttf'].includes(dep))
        },
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return "vendor";
            }
          },
        },
      },
    },
    server: {
      port: 3000,
      host: true,
      allowedHosts: ['.ngrok-free.app', '.ngrok.io', '.ngrok-free.dev', '.trycloudflare.com']
    },
  }
})
