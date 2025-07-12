import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        // Main integration components
        'page-view': resolve(__dirname, 'entries/page-view.js'),
        
        // Home screen widgets
        'connection-status': resolve(__dirname, 'entries/connection-status.js'),
        'quick-stats': resolve(__dirname, 'entries/quick-stats.js'),
        'recent-activity': resolve(__dirname, 'entries/recent-activity.js'),
        'quick-actions': resolve(__dirname, 'entries/quick-actions.js'),
        
        // Additional pages
        'query-runner': resolve(__dirname, 'entries/query-runner.js'),
        'collection-manager': resolve(__dirname, 'entries/collection-manager.js'),
        'database-dashboard': resolve(__dirname, 'entries/database-dashboard.js'),
      },
      external: ['react', 'react-dom', 'react-router-dom'],
      output: {
        format: 'es',
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name].js',
        assetFileNames: 'assets/[name].[ext]',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-router-dom': 'ReactRouterDOM'
        }
      }
    }
  },
  
  server: {
    port: 3000,
    host: true,
  },
  
  preview: {
    port: 3000,
    host: true,
  },
}) 