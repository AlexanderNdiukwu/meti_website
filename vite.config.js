import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
  registerType: 'autoUpdate', // auto-updates in the background — this is
                               // what prevents the "stale cached version"
                               // problem I flagged earlier
  includeAssets: ['images/meti-logo-icon.png'],
  manifest: {
    name: 'METI Admissions Portal',   // shown during install — editable anytime
    short_name: 'METI',               // shown under the home screen icon — editable anytime
    description: 'METI postgraduate admissions portal',
    theme_color: '#1B3A6B',
    background_color: '#ffffff',
    display: 'standalone',            // opens without browser address bar
    start_url: '/',
    icons: [
      {
        src: '/images/meti-logo-icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/images/meti-logo-icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  },
})
  ],
})
