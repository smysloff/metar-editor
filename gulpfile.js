const gulp = require('gulp')
const pug = require('gulp-pug')
const stylus = require('gulp-stylus')
const babel = require('gulp-babel')
const plumber = require('gulp-plumber')
const notify = require('gulp-notify')

const paths = {
  pug: 'src/amtk_form.pug',
  stylus: 'src/amtk_form.styl',
  js: 'src/amtk_form.js',
  build: 'build'
}

// компиляция Pug в HTML
function compilePug() {
  return gulp.src(paths.pug)
    .pipe(plumber({ errorHandler: notify.onError("Pug Error: <%= error.message %>")}))
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest(paths.build))
}

// компиляция Stylus в HTML
function compileStylus() {
  return gulp.src(paths.stylus)
    .pipe(plumber({ errorHandler: notify.onError("Stylus Error: <%= error.message %>")}))
    .pipe(stylus())
    .pipe(gulp.dest(paths.build))
}

// компиляция JavaScript в Babel
function compileJS() {
  return gulp.src(paths.js)
    .pipe(plumber({ errorHandler: notify.onError("Babel Error: <%= error.message %>")}))
    .pipe(babel())
    .pipe(gulp.dest(paths.build))
}

// Общая задачи сборки
const build = gulp.series(gulp.parallel(compilePug, compileStylus, compileJS))

exports.build = build
exports.default = build
