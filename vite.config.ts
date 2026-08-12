import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vitejs.dev/config/
// NOTE: Module Federation boundary
// In production each /modules/* folder would be split via:
// new ModuleFederationPlugin({ name: 'shell', remotes: { usersRemote, analyticsRemote, settingsRemote } })
// Each remote would be a separate Vite/Webpack build deployed independently.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      '@shared': path.resolve(import.meta.dirname, './src/shared'),
      '@modules': path.resolve(import.meta.dirname, './src/modules'),
      '@store': path.resolve(import.meta.dirname, './src/store'),
      '@mocks': path.resolve(import.meta.dirname, './src/mocks'),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        // Simulate module federation chunk splitting via manualChunks function
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }
            if (id.includes('@mui') || id.includes('@emotion')) {
              return 'vendor-mui';
            }
            if (id.includes('@reduxjs') || id.includes('react-redux')) {
              return 'vendor-redux';
            }
            if (id.includes('recharts')) {
              return 'vendor-charts';
            }
          }
          if (id.includes('src/modules/users')) {
            return 'module-users';
          }
          if (id.includes('src/modules/analytics')) {
            return 'module-analytics';
          }
          if (id.includes('src/modules/settings')) {
            return 'module-settings';
          }
        },
      },
    },
  },
})
