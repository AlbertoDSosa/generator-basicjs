'use strict'

const gulp = require('gulp')
const webServer = require('gulp-webserver')
const rename = require('gulp-rename')
const babel = require('babelify')
const stylus = require('gulp-stylus')
const nib = require('nib')
const browserify = require('browserify')
const pug = require('gulp-pug')
const pugify = require('pugify')
const stringify = require('stringify')
const source = require('vinyl-source-stream')
const watchify = require('watchify')

gulp.task('server', ['build'], function () {
  gulp.src('./build')
    .pipe(webServer({
      host: '0.0.0.0',
      port: 8080,
      livereload: true,
      open: true
    }))
})

gulp.task('build:html', function () {
  gulp.src('./src/index.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('build'))
})

/* gulp.task('watch:pug', function () {
}) */

gulp.task('build:styles', function () {
  gulp.src('./src/**/*.styl')
    .pipe(stylus({
      use: nib(),
      'include css': true
    }))
    .pipe(rename('style.css'))
    .pipe(gulp.dest('build'))
})

gulp.task('watch:styles', function () {
  gulp.watch('./src/**/*.styl', ['build:styles'])
})

function compile (watch) {
  let bundle = browserify('./src/index.js', {debug: true})

  if (watch) {
    bundle = watchify(bundle)
    bundle.on('update', function () {
      console.log('--> Bundling...')
      rebundle()
    })
  }

  function rebundle () {
    bundle
      .transform(babel, { presets: [ 'es2015' ] })
      .transform([pugify, stringify])
      .bundle()
      .on('error', function (err) { console.log(err); this.emit('end') })
      .pipe(source('index.js'))
      .pipe(rename('main.js'))
      .pipe(gulp.dest('build'))
  }

  rebundle()
}

gulp.task('build:scripts', function () {
  return compile()
})

gulp.task('watch:scripts', function () { return compile(true) })

gulp.task('build', ['build:scripts', 'build:styles', 'build:pug'])

gulp.task('watch', ['watch:scripts', 'watch:styles', 'watch:pug'])

gulp.task('default', ['build', 'server', 'watch'])
