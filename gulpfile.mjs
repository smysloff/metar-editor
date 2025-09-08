// file: gulpfile.mjs

import gulp         from 'gulp'
import autoprefixer from 'autoprefixer' // импортируем autoprefixer как плагин PostCSS
import babel        from 'gulp-babel'
import cleanCSS     from 'gulp-clean-css'
import htmlmin      from 'gulp-htmlmin'
import notify       from 'gulp-notify'
import plumber      from 'gulp-plumber'
import postcss      from 'gulp-postcss'
import pug          from 'gulp-pug'
import rename       from 'gulp-rename'
import stylus       from 'gulp-stylus'
import terser       from 'gulp-terser' // минификатор
import { rollup }   from 'rollup'
//import rollup       from 'rollup-stream'
import source       from 'vinyl-source-stream'
import buffer       from 'vinyl-buffer'
import resolve      from '@rollup/plugin-node-resolve'
import commonjs     from '@rollup/plugin-commonjs'


const paths = {
  build:  'build',
  js:     'src/amtk_form.mjs',
  pug:    'src/amtk_form.pug',
  stylus: 'src/amtk_form.styl',
}

// Компиляция Pug в HTML + минификация
function compilePug() {
  return gulp.src(paths.pug)
    .pipe(plumber({
      errorHandler: notify.onError("Pug Error: <%= error.message %>")
    }))
    .pipe(pug({ pretty: false })) // компактный HTML
    .pipe(htmlmin({
      collapseWhitespace:        true,
      minifyCSS:                 true,
      minifyJS:                  true,
      removeComments:            true,
      removeEmptyAttributes:     true,
      removeRedundantAttributes: true,
    }))
    .pipe(gulp.dest(paths.build))
}

// Компиляция Stylus в CSS + автопрефиксы + минификация
function compileStylus() {
  return gulp.src(paths.stylus)
    .pipe(plumber({
      errorHandler: notify.onError("Stylus Error: <%= error.message %>")
    }))
    .pipe(stylus())
    .pipe(postcss([
      autoprefixer({
        cascade: false,
        overrideBrowserslist: [
          '> 0.5%',
          'last 2 versions',
          'Firefox ESR',
          'not dead',
        ]
      })
    ]))
    .pipe(cleanCSS({ level: 2 }))
    .pipe(rename('_amtk_form.scss'))
    .pipe(gulp.dest(paths.build))
}

// Компиляция JavaScript в Babel + минификация
//function compileJS() {
//  return gulp.src(paths.js)
//    .pipe(plumber({
//      errorHandler: notify.onError("Babel Error: <%= error.message %>")
//    }))
//    .pipe(babel())
//    .pipe(terser())
//    .pipe(rename('amtk_form.min.js'))
//    .pipe(gulp.dest(paths.build));
//}

async function bundleJS() {
  const bundle = await rollup({
    input: 'src/amtk_form.mjs',
    //format: 'iife',
    //sourcemap: true,
    plugins: [
      resolve(),
      commonjs(),
    ],
  })

  const { output } = await bundle.generate({
    format: 'iife',
    sourcemap: true,
  })

  const code = output[0].code
  const stream = source('amtk_form.min.js')
  stream.end(code)

  return stream
//  .pipe(source('amtk_form.min.js'))
  .pipe(buffer())
  .pipe(terser())
  .pipe(gulp.dest('build'))
}

// Задача watch - следит за файлами и запускает сборку нужных частей
//function watch() {
//  gulp.watch(paths.pug,    compilePug)
//  gulp.watch(paths.stylus, compileStylus)
//  gulp.watch(paths.js,     compileJS)
//}

// Общая задача сборки
const build = gulp.series(
  gulp.parallel(
    compilePug,
    compileStylus,
    bundleJS
  )
)

//export { watch, build }
export { build }
export default build
