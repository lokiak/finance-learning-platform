import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    // Optimize file watching for limited disk space
    watch: {
      usePolling: false,
      interval: 1000,
      ignored: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.git/**',
        '**/coverage/**',
        '**/.nyc_output/**',
        '**/tmp/**',
        '**/temp/**',
        '**/*.log',
        '**/.DS_Store'
      ],
    },
    // Reduce HMR pressure
    hmr: {
      overlay: false, // Disable error overlay to reduce memory usage
    },
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  // Optimize build cache
  build: {
    sourcemap: false, // Disable sourcemaps to save disk space
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  // Optimize dependency pre-bundling
  optimizeDeps: {
    exclude: ['@vitejs/plugin-react'],
    include: ['react', 'react-dom'],
  },
  // Reduce cache size
  cacheDir: 'node_modules/.vite',
  // Disable some features to reduce I/O
  define: {
    __DEV__: JSON.stringify(true),
  },
});
