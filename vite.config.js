import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

const ASSET_URL = process.env.ASSET_URL || ''
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: `${ASSET_URL}`,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      components: `${path.resolve(__dirname, './src/components/')}`,
      public: `${path.resolve(__dirname, './public/')}`,
      "readable-stream": "vite-compatible-readable-stream"
    }
  }
})
