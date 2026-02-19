/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    devOptions: {
      enabled: true
    },
    manifest: {
      name: 'Cuisine',
      short_name: 'Cuisine',
      start_url: '/',
      display: 'standalone',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      icons: [{
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png'
      }, {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png'
      }]
    }
  })],
  test: {
    projects: [{
      extends: true,
      plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        },
        setupFiles: ['.storybook/vitest.setup.ts']
      }
    }]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});