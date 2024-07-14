import { defineConfig } from 'vite'
import glsl from 'vite-plugin-glsl';
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  root: './',
  publicDir: './public',
  plugins: [react(), glsl()],
   base: '/ghibli-grass-v2/'
})
