// GULPFILE.JS
'use strict';

const gulp = require('gulp');
const { series } = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
 


function buildStyles() {
  return gulp.src('./src/app.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      overrideBrowserslist: ["last 2 versions"]
    }))
    .pipe(cleanCSS({debug: true}, (details) => {
      console.log(`${details.name}: ${details.stats.originalSize}`);
      console.log(`${details.name}: ${details.stats.minifiedSize}`);
    }))
    .pipe(gulp.dest('./assets'));
};

exports.buildStyles = buildStyles;

function watch() {
    gulp.watch(['./src/css/*.scss', './src/*.scss', './src/css/home/*.scss', './src/css/calendar/*.scss', './src/css/collections/*.scss', './src/css/blog/*.scss', './src/css/products/*/*.scss', './src/css/products/*.scss', './src/css/pages/*.scss'], buildStyles);
}
exports.watch = watch;

exports.default = series(buildStyles, watch);