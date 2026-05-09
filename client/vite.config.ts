import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'MoDeck',
        short_name: 'MoDeck',
        description: 'Mobile deck for PC control',
        start_url: '/',
        display: 'fullscreen',
        background_color: '#0f0f0f',
        theme_color: '#0f0f0f',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ]
      },
      workbox: {
        navigateFallback: '/offline.html',
        navigateFallbackDenylist: [/^\/buttons/, /^\/execute/, /^\/ws/],
      },
    })
  ],
})
