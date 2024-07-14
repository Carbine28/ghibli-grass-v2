import { defineConfig } from 'vite'
import glsl from 'vite-plugin-glsl';
import react from '@vitejs/plugin-react-swc'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react(), glsl()],
//   base: '/ghibli-grass-v2/'
//   // base: command === 'build' ? '/ghibli-grass-v2/' : '/',
// })

export default defineConfig(({ command }) => {
  
  if (command === 'serve') {
    return {
      // dev specific config
      plugins: [react(), glsl()]
    }
  } else {
    // command === 'build'
    return {
      // build specific config
      plugins: [react(), glsl()],
      base: '/ghibli-grass-v2/'
    }
  }
})