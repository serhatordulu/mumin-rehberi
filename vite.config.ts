import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // .env dosyasındaki değişkenleri yükle
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    base: './',
    build: {
      outDir: 'dist',
    },
    define: {
      // Bu ayar, .env içindeki VITE_API_KEY değerini kodda process.env.API_KEY olarak kullanılabilir hale getirir.
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY)
    }
  };
});