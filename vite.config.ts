
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
      sourcemap: false
    },
    define: {
      // Garante que process.env exista no navegador e injeta a API Key
      'process.env': JSON.stringify({
        API_KEY: env.API_KEY || process.env.API_KEY || '',
        NODE_ENV: mode
      })
    }
  };
});
