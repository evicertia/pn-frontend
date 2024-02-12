import { defineConfig, loadEnv, splitVendorChunkPlugin } from 'vite';
import { configDefaults } from 'vitest/config';

import basicSsl from '@vitejs/plugin-basic-ssl';
import react from '@vitejs/plugin-react';
import https from 'https';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), basicSsl(), splitVendorChunkPlugin()],
    test: {
      globals: true,
      setupFiles: './src/setupTests.ts',
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, '**/*.a11y.test.ts', '**/*.a11y.test.tsx'],
      reporters: ['vitest-sonar-reporter', 'default'],
      outputFile: 'test-report.xml',
      coverage: {
        provider: 'v8',
        reporter: ['lcov'],
        exclude: ['**/*.a11y.test.ts', '**/*.a11y.test.tsx', 'src/models/**'],
        reportOnFailure: true,
      },
    },
    server: {
      host: env.HOST,
      https: true,
      port: 443,
      strictPort: true,
      open: true,
      proxy: {
        '^/auth/.*': {
          target: 'https://login.dev.notifichedigitali.it',
          changeOrigin: true,
        },
        '^/token-exchange': {
          target: 'https://18.102.187.200',
          agent: new https.Agent({
            servername: 'webapi.dev.notifichedigitali.it',
          }),
          secure: false,
          changeOrigin: false,
        },
        '^/downtime/v1': {
          target: 'http://mockserver.pagopa.test:5000',
          changeOrigin: true,
        },
        '^/mandate/api/v1': {
          target: 'http://mockserver.pagopa.test:5000',
          changeOrigin: true,
        },
        '^/user-consents/v1/.*': {
          target: 'http://mockserver.pagopa.test:5000',
          changeOrigin: true,
        },
        '^/address-book/v1/.*': {
          target: 'http://localhost:8085',
          changeOrigin: true,
          headers: {
            'x-pagopa-pn-cx-id': '11',
            'x-pagopa-pn-cx-type': 'PA',
            'origin': 'http://localhost:8085'
          },
        },
        '^/delivery/.*': {
          target: 'http://mockserver.pagopa.test:5000',
          changeOrigin: true,
        },
/*        '^/ext-registry/pa/v1/activated-on-pn': {
          target: 'http://mockserver.pagopa.test:5000',
          changeOrigin: true,
         },*/
      },
    },
    build: {
      outDir: 'build',
      assetsDir: 'static',
      target: 'ES2020',
      rollupOptions: {
        external: ['**/*.test.tsx', '**/*.test.ts', '**/test-utils.tsx', '**/*.mock.ts'],
      },
    },
    preview: {
      port: 443,
      host: env.HOST,
      https: true,
    },
    // Exclude the test and the mock folders from being processed by Vite
    exclude: ['**/__test__/**', '**/__mocks__/**'],
  };
});
