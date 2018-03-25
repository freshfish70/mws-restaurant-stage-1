var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var webp = require('gulp-webp');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');

/**
 *  Default gulp task for development
 *  This will run when using just gulp
 *  
 *  Adds watchers to sass, js and html
 *  and init BrowserSync
 */
gulp.task('default', ['scripts', 'styles', 'convert-images'], function () {
  gulp.watch('./sass/**/*.scss', ['styles']);
  gulp.watch('./js/**/*.js', ['scripts-watch']);
  gulp.watch('./*.html').on('change', browserSync.reload);

  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
});

/**
 * Production task
 * 
 * Build all files and move/convert images
 */
gulp.task('prod', [
  'prod-scripts',
  'styles',
  'convert-images'
]);

/**
 * Styles task (sass/css)
 * 
 * convert Sass to css
 * prefixes css 
 */
gulp.task('styles', function () {
  gulp.src('sass/**/*.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

/**
 * Watcher task for scripts
 * 
 * Reloads browsersync when scripts task is complete
 */
gulp.task('scripts-watch', ['scripts'], function(done){
  browserSync.reload();
  done();
})

/**
 * Scripts task
 * 
 * converts es6 to normal js for compability
 * concat all JS files to a single file
 */
gulp.task('scripts', function () {
  return returngulp.src('./js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(concat('app.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/js/'));
});

/**
 * Prod scripts task
 * 
 * converts es6 to normal js for compability
 * concat all JS files to a single file
 * Minifies the file
 */
gulp.task('prod-scripts', function () {
  gulp.src('./js/**/*.js')
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./dist/js/'));
});

/**
 * Convert images to webP format
 */
gulp.task('convert-images', function () {
  gulp.src(['./dist/img/*.{jpg,png}'])
    .pipe(webp())
    .pipe(gulp.dest('./dist/img'))
})