
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // The third argument '' allows loading variables without the VITE_ prefix from .env files.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
      sourcemap: false
    },
    define: {
      // Polyfill process.env for the browser to match Google GenAI SDK requirements
      // and ensure Vercel environment variables are injected correctly.
      'process.env': {
        API_KEY: JSON.stringify(
          env.API_KEY || 
          process.env.API_KEY || 
          env.VITE_API_KEY || 
          process.env.VITE_API_KEY || 
          ''
        ),
        NODE_ENV: JSON.stringify(mode)
      }
    }
  };
});
