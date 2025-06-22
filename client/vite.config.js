import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()
, tailwindcss()],
  server: {
    proxy: {
      // Proxy API requests to the backend server at port 84
      '/api': {
        target: 'http://localhost:84',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})

