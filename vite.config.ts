import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import type { Plugin } from 'vite'

// Fix bare % in dev URLs (e.g. "speakers 90%" folder → %/ crashes decodeURI)
function fixBarePercentInUrls(): Plugin {
  return {
    name: 'fix-bare-percent-in-urls',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url && req.url.includes('%')) {
          req.url = req.url.replace(/%(?![0-9A-Fa-f]{2})/g, '%25')
        }
        next()
      })
    },
  }
}

// Step 1: resize down to maxPx — runs first, purely geometric, no quality hit yet
function imageResizePlugin(maxPx = 800): Plugin {
  return {
    name: 'vite-image-resize',
    async generateBundle(_, bundle) {
      const { default: sharp } = await import('sharp')
      await Promise.all(
        Object.values(bundle).map(async (asset) => {
          if (asset.type !== 'asset') return
          if (!/\.(png|jpe?g|webp)$/i.test(asset.fileName)) return
          try {
            const buf    = Buffer.from(asset.source as Buffer)
            const meta   = await sharp(buf).metadata()
            const tooBig = (meta.width ?? 0) > maxPx || (meta.height ?? 0) > maxPx
            if (!tooBig) return                          // already small — skip
            const img = sharp(buf).resize({
              width: maxPx, height: maxPx,
              fit: 'inside', withoutEnlargement: true,
            })
            // Re-encode in the same format at high quality — ViteImageOptimizer
            // does the lossy pass afterwards, so we avoid double-degradation.
            if (meta.format === 'png') {
              asset.source = await img.png({ compressionLevel: 9, effort: 10 }).toBuffer()
            } else if (meta.format === 'jpeg') {
              asset.source = await img.jpeg({ quality: 92, progressive: true }).toBuffer()
            } else {
              asset.source = await img.toBuffer()
            }
          } catch { /* skip non-image blobs */ }
        })
      )
    },
  }
}

export default defineConfig({
  plugins: [
    fixBarePercentInUrls(),
    react(),
    // Step 1 — resize (must come before optimizer)
    imageResizePlugin(800),
    // Step 2 — lossy compress the resized output
    ViteImageOptimizer({
      logStats: true,
      png:  { quality: 60, effort: 10 },   // was 72 → 60, ~35% smaller
      jpg:  { quality: 68 },               // was 72
      jpeg: { quality: 68 },
      webp: { quality: 68, lossless: false },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@speakers': path.resolve(__dirname, './src/assets/speakers 90%'),
      '@powerbank': path.resolve(__dirname, './src/assets/Power bank'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    // Smaller output by targeting modern browsers
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          redux:  ['@reduxjs/toolkit', 'react-redux', 'redux-persist'],
          ui:     ['framer-motion', 'lucide-react', 'sonner'],
          gsap:   ['gsap'],                // split GSAP — used by HomePage + CategoryPage + GamingPage
          charts: ['recharts'],
          stripe: ['@stripe/react-stripe-js', '@stripe/stripe-js'],
        },
      },
    },
  },
})
