import {resolve} from 'path'
import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@app': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'docs',
  },
  server: {
    host: '0.0.0.0',
    port: 4000,
  },
})
