import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from 'path';
export default defineConfig({
  plugins: [vue(), vueJsx()],
  base: "./",
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  server: { port: 4000, open: true, proxy: { '/library': 'http://localhost:6001' }, cors: true },
})
