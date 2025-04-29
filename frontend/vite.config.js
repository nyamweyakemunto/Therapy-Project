import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3500',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            const sc = proxyRes.headers['set-cookie'];
            if (sc) {
              // Modify cookie attributes for dev environment
              proxyRes.headers['set-cookie'] = sc.map(sc => {
                return sc
                  .replace(/; secure/gi, '')
                  .replace(/; sameSite=none/gi, '; sameSite=lax');
              });
            }
          });
        }
      }
    }
  }
})
