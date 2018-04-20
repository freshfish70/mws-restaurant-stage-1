var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var webp = require('gulp-webp');
var sourcemaps = require('gulp-sourcemaps');
var streamqueue = require('streamqueue')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var browserify = require('browserify')
var es = require('event-stream');
var babel = require('babelify');

/**
 *  Default gulp task for development
 *  This will run when using just gulp
 *  
 *  Adds watchers to sass, js and html
 *  and init BrowserSync
 */
gulp.task('default', ['scripts', 'styles', 'convert-images', 'sw'], function () {
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
gulp.task('scripts-watch', ['scripts', 'sw'], function (done) {
  browserSync.reload();
  done();
})



var js_files = [
  './js/main.js',
  './js/restaurant_info.js'
];
/**
 * Scripts task
 * 
 * import files with browserify
 * converts es6 to normal js for compability
 * concat all JS files to a single file
 */
gulp.task('scripts', function () {

  var tasks = js_files.map(function (entry){
    return browserify({entries: [entry]})
    .transform(babel)
    .bundle()
    .pipe(source(entry))
    .pipe(gulp.dest('./dist/'))
  });

  return es.merge.apply(null, tasks)

});
/**
 * Scripts task
 * 
 * import files with browserify
 * converts es6 to normal js for compability
 * concat all JS files to a single file
 */
gulp.task('sw', function () {

    return browserify({entries: './js/sw.js'})
    .transform(babel)
    .bundle()
    .pipe(source('./sw.js'))
    .pipe(gulp.dest('./'))
  
});

/**
 * Prod scripts task
 * 
 * import files with browserify 
 * converts es6 to normal js for compability
 * concat all JS files to a single file
 * Minifies the file
 * 
 */
gulp.task('prod-scripts', function () {

  var tasks = js_files.map(function (entry){
    return browserify({entries: [entry]})
    .transform(babel)
    .bundle()
    .pipe(source(entry))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/'))
  });

  return es.merge.apply(null, tasks)

});

/**
 * Convert images to webP format
 */
gulp.task('convert-images', function () {
  gulp.src(['./img/*.{jpg,png}'])
    .pipe(gulp.dest('./dist/img'))
    .pipe(webp())
    .pipe(gulp.dest('./dist/img'))
})