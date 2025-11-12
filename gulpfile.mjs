
// file: gulpfile.mjs

import { watch }            from 'gulp'
import { src, dest }        from 'gulp'
import { parallel, series } from 'gulp'

import autoprefixer from 'autoprefixer'
import cleancss     from 'gulp-clean-css'
import htmlmin      from 'gulp-htmlmin'
import postcss      from 'gulp-postcss'
import pug          from 'gulp-pug'
import rename       from 'gulp-rename'
import rollup       from 'gulp-better-rollup'
import stylus       from 'gulp-stylus'
import terser       from 'gulp-terser'
import babel        from '@rollup/plugin-babel'
import resolve      from '@rollup/plugin-node-resolve'

import { rm } from 'node:fs/promises'

class PathEntry {
  constructor(src, dest) {
    if (typeof src !== 'string') {
      throw new TypeError(
        `'src' must be a type of string, but '${ typeof src }' passed`)
    }
    if (typeof dest !== 'string') {
      throw new TypeError(
        `'dest' must be a type of string, but '${ typeof dest }' passed`)
    }
    this.src  = src
    this.dest = dest
  }
}

const paths = {
  pipe: new PathEntry('src', 'build'),
  html: new PathEntry('src/components/**/*.pug',  'form.min.html'),
  css:  new PathEntry('src/components/**/*.styl', 'form.min.css'),
  js:   new PathEntry('src/index.mjs',            'form.min.js'),
}

async function clean() {
  try {
    await rm(paths.pipe.dest, {
      recursive: true,
      force: true,
    })
  } catch (error) {
    console.error(`Error in 'clean' task: ${error}`)
  }
}

function html() {
  return src(paths.html.src)
    .pipe(pug({ pretty: false }))
    .pipe(htmlmin({
      collapseWhitespace:        true,
      minifyCSS:                 true,
      minifyJS:                  true,
      removeComments:            true,
      removeEmptyAttributes:     true,
      removeRedundantAttributes: true,
    }))
    .pipe(rename(paths.html.dest))
    .pipe(dest(paths.pipe.dest))
    // @todo error handling
}

function css() {
  return src(paths.css.src)
    .pipe(stylus({ compress: true }))
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
    .pipe(cleancss({ level: 2 }))
    .pipe(rename(paths.css.dest))
    .pipe(dest(paths.pipe.dest))
    // @todo error handling
}

function js() {
  return src(paths.js.src)
    .pipe(rollup({
      plugins: [
        resolve(),
        babel({
          babelHelpers: 'bundled',
          exclude: 'node_modules/**',
          presets: [
            ['@babel/preset-env', { modules: false }],
          ],
        })
      ]
    }, 'iife'))
    .pipe(terser())
    .pipe(rename(paths.js.dest))
    .pipe(dest(paths.pipe.dest))
    // @todo error handling
}

function update() {
  watch(paths.html.src, html)
  watch(paths.css.src,  css)
  watch(paths.js.src,   js)
}

export { clean, html, css, js, update }
export default series(clean, parallel(html, css, js))
