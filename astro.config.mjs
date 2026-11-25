import { defineConfig } from 'astro/config';
import pwa from '@vite-pwa/astro';

export default defineConfig({
  site: 'https://kikienchrist.vercel.app',
  trailingSlash: 'always',
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
  prefetch: true,
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  },
  experimental: {
    contentLayer: true
  },
  integrations: [pwa({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.svg', 'robots.txt'],
    manifest: {
      name: 'Kiki en Christ',
      short_name: 'Kiki',
      description: 'Livres chrétiens pour fortifier votre foi',
      theme_color: '#c9a84c',
      background_color: '#fdfcf8',
      display: 'standalone',
      orientation: 'portrait-primary',
      scope: '/',
      start_url: '/?pwa=1',
      icons: [
        { src: '/icons/icon-72.png', sizes: '72x72', type: 'image/png', purpose: 'maskable any' },
        { src: '/icons/icon-96.png', sizes: '96x96', type: 'image/png', purpose: 'maskable any' },
        { src: '/icons/icon-128.png', sizes: '128x128', type: 'image/png', purpose: 'maskable any' },
        { src: '/icons/icon-144.png', sizes: '144x144', type: 'image/png', purpose: 'maskable any' },
        { src: '/icons/icon-152.png', sizes: '152x152', type: 'image/png', purpose: 'maskable any' },
        { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable any' },
        { src: '/icons/icon-384.png', sizes: '384x384', type: 'image/png', purpose: 'maskable any' },
        { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable any' },
      ],
      screenshots: [
        { src: '/screenshots/home.png', sizes: '1280x720', type: 'image/png', form_factor: 'wide' },
        { src: '/screenshots/home-mobile.png', sizes: '750x1334', type: 'image/png', form_factor: 'narrow' },
      ],
      categories: ['books', 'lifestyle', 'education'],
      lang: 'fr',
      dir: 'ltr',
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,webp,avif}'],
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB pour couvrir les couvertures de livres
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/kikienchrist\.vercel\.app\/.*/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'pages',
            expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
          },
        },
        {
          urlPattern: /^https:\/\/assets\.lulu\.com\/.*/i,
          handler: 'CacheFirst',
          options: { cacheName: 'images-lulu', expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 365 } },
        },
        {
          urlPattern: /^https:\/\/i\.ibb\.co\/.*/i,
          handler: 'CacheFirst',
          options: { cacheName: 'images-ibb', expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 365 } },
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
          handler: 'CacheFirst',
          options: { cacheName: 'fonts', expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 } },
        },
      ],
    },
    devOptions: { enabled: true, type: 'module' },
  })],
});