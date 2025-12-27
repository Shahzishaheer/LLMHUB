import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['test/setup.ts'],
    css: true,
    globals: true,
    coverage: {
      provider: 'v8',
      reportsDirectory: 'coverage',
    },
    include: ['test/**/*.test.ts', 'test/**/*.test.tsx'],
  },
})