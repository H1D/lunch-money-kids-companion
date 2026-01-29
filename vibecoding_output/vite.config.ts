import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Kids Lunch Money',
        short_name: 'LunchMoney',
        description: 'Companion app for young savers',
        theme_color: '#6366f1',
        background_color: '#0f172a',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // Force immediate update - no waiting for tabs to close
        skipWaiting: true,
        clientsClaim: true,
        // Clean up old caches
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/dev\.lunchmoney\.app\/.*$/i,
            handler: 'NetworkFirst', // Prefer network over cache for API
            options: {
              cacheName: 'lunch-money-api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5 // 5 minutes (was 1 hour)
              },
              networkTimeoutSeconds: 10 // Fall back to cache after 10s
            }
          }
        ]
      }
    })
  ],
})
