import { defineConfig } from 'vite'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'src/amtk_form.js',  // вход JS
        css: 'src/amtk_form.styl', // вход CSS
      },
      output: {
        entryFileNames: 'amtk_form.js',  // имя JS в сборке
        assetFileNames: 'amtk_form.css', // имя CSS в сборке
      },
    },
    minify: 'terser', // минификация JS
  },
  css: {
    preprocessorOptions: {
      stylus: {},
    },
    postcss: {
      plugins: [
        autoprefixer({
          overrideBrowserslist: [
            '> 0.5%',
            'last 2 versions',
            'Firefox ESR',
            'not dead',
          ],
          cascade: false,
        }),
        cssnano(), // минификация CSS
      ],
    },
  },
})
