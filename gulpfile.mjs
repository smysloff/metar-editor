
// file: gulpfile.mjs

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

import { rm } from 'node:fs/promises'

const paths = {
  dest: 'build',
  html: 'src/html/*.pug',
  css:  'src/css/*.styl',
  js:   'src/js/amtk_form.mjs',
}

async function clean() {
  try {
    await rm(paths.dest, {
      recursive: true,
      force: true,
    })
  } catch (error) {
    console.error(`Error in 'clean' task: ${error}`)
  }
}

function html() {
  return src(paths.html)
    .pipe(pug({ pretty: false }))
    .pipe(htmlmin({
      collapseWhitespace:        true,
      minifyCSS:                 true,
      minifyJS:                  true,
      removeComments:            true,
      removeEmptyAttributes:     true,
      removeRedundantAttributes: true,
    }))
    .pipe(dest(paths.dest))
    // @todo error handling
}

function css() {
  return src(paths.css)
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
    .pipe(rename({ prefix: '_', extname: '.scss' }))
    .pipe(dest(paths.dest))
    // @todo error handling
}

function js() {
  return src(paths.js)
    .pipe(rollup({
      plugins: [
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
    .pipe(rename({ suffix: '.min', extname: '.js' }))
    .pipe(dest(paths.dest))
    // @todo error handling
}

export { clean, html, css, js }
export default series(clean, parallel(html, css, js))
