import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const devPort = Number(env.VITE_DEV_PORT || 5174)
  const apiProxyTarget = env.VITE_API_PROXY_TARGET || 'http://127.0.0.1:8000'

  return {
    plugins: [react()],
    build: {
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            const normalized = id.replace(/\\/g, '/')
            if (normalized.includes('/node_modules/react') || normalized.includes('/node_modules/react-dom')) {
              return 'vendor-react'
            }
            if (normalized.includes('/node_modules/framer-motion')) {
              return 'vendor-motion'
            }
            if (normalized.includes('/node_modules/three')) {
              return 'vendor-three'
            }
            if (normalized.includes('/node_modules/')) {
              return 'vendor'
            }
            if (normalized.includes('/src/data/scriptedScenes') || normalized.includes('/src/data/companionSideQuests')) {
              return 'story-data'
            }
            return undefined
          },
        },
      },
    },
    server: {
      port: Number.isFinite(devPort) ? devPort : 5174,
      proxy: {
        '/api': { target: apiProxyTarget, changeOrigin: true },
      },
    },
  }
})
