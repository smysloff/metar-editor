// file: gulpfile.mjs

import gulp         from 'gulp'           // 
import autoprefixer from 'autoprefixer'   // импортируем autoprefixer как плагин PostCSS
import babel        from 'gulp-babel'     // 
import cleanCSS     from 'gulp-clean-css' // 
import htmlmin      from 'gulp-htmlmin'   // 
import notify       from 'gulp-notify'    // 
import plumber      from 'gulp-plumber'   // 
import postcss      from 'gulp-postcss'   // 
import pug          from 'gulp-pug'       // 
import rename       from 'gulp-rename'    // 
import stylus       from 'gulp-stylus'    // 
import terser       from 'gulp-terser'    // 

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
    .pipe(pug({ pretty: false }))      // компактный HTML
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
function compileJS() {
  return gulp.src(paths.js)
    .pipe(plumber({
      errorHandler: notify.onError("Babel Error: <%= error.message %>")
    }))
    .pipe(babel())
    .pipe(terser())
    .pipe(rename('amtk_form.min.js'))
    .pipe(gulp.dest(paths.build));
}

// Задача watch - следит за файлами и запускает сборку нужных частей
function watch() {
  gulp.watch(paths.pug,    compilePug)
  gulp.watch(paths.stylus, compileStylus)
  gulp.watch(paths.js,     compileJS)
}

// Общая задача сборки
const build = gulp.series(
  gulp.parallel(
    compilePug,
    compileStylus,
    compileJS
  )
)

export { watch, build }
export default build
