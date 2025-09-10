import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        external: ['get-windows', '@mapbox/node-pre-gyp', 'mock-aws-s3', 'aws-sdk', 'nock']
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react(), tailwindcss()],
    optimizeDeps: {
      exclude: ['get-windows', '@mapbox/node-pre-gyp', 'mock-aws-s3', 'aws-sdk', 'nock']
    }
  }
})
