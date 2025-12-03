
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
      sourcemap: false
    },
    define: {
      // Correctly polyfill process.env to prevent "Cannot read properties of undefined"
      'process.env': {
        API_KEY: JSON.stringify(env.API_KEY || env.VITE_API_KEY || ''),
        NODE_ENV: JSON.stringify(mode)
      }
    }
  };
});