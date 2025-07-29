const autoprefixer = require('autoprefixer') // импортируем autoprefixer как плагин PostCSS
const babel        = require('gulp-babel')
const cleanCSS     = require('gulp-clean-css')
const gulp         = require('gulp')
const htmlmin      = require('gulp-htmlmin')
const notify       = require('gulp-notify')
const plumber      = require('gulp-plumber')
const postcss      = require('gulp-postcss')
const pug          = require('gulp-pug')
const stylus       = require('gulp-stylus')
const terser       = require('gulp-terser')

const paths = {
  build:  'build',
  js:     'src/amtk_form.js',
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

exports.watch   = watch
exports.build   = build
exports.default = build
