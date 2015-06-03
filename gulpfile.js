var gulp = require('gulp'),
    express = require('express'),
    plumber = require('gulp-plumber'),
    gutil = require('gulp-util'),
    path = require('path'),
    uglify = require('gulp-uglify'),
    less = require('gulp-less'),
    connectLivereload = require('connect-livereload'),
    tinylr = require('tiny-lr')(),
    concat = require('gulp-concat'),
    clean = require('gulp-clean'),
    browserify = require('browserify'),
    transform = require('vinyl-transform'),
    sourcemaps = require('gulp-sourcemaps'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    port = 4000,
    lrport = 9088;

var onError = function(err) {
    console.error(err.message);
}

function notifyLiveReload(event) {
  var fileName = path.relative(__dirname + 'src/', event.path);
  tinylr.changed({
    body: {
      files: [fileName]
    }
  });
}

gulp.task('express', function() {
  var app = express();
  app.use(connectLivereload({port: lrport}));
  app.use(express.static(__dirname + '/dist'));
  app.listen(port);
});

gulp.task('livereload', function() {
  tinylr.listen(lrport);
});

gulp.task('javascript', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: './src/js/app.js',
    debug: true
  });

  return b.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('less', function() {
  gulp.src('src/less/**/*.less')
  .pipe(less({style: 'compressed' }).on('error', gutil.log))
  .pipe(gulp.dest('dist/css/'))
});

gulp.task('mv-html', function() {
  gulp.src('src/**/*.html')
  .pipe(gulp.dest('dist/'));
});

gulp.task('mv-img', function() {
  gulp.src('src/img/**/*')
  .pipe(gulp.dest('dist/img'));
});

gulp.task('watch', function() {
  gulp.watch(['src/**/*.js'], [
    'javascript'
  ]);
  gulp.watch(['src/**/*.less'], [
    'less'
  ]);
  gulp.watch(['src/**/*.html'], [
    'mv-html'
  ]);
  gulp.watch(['src/img/**/*'], [
    'mv-img'
  ]);
  gulp.watch('./dist/**').on('change', notifyLiveReload);
});

gulp.task('dist', ['less', 'mv-html', 'mv-img', 'javascript'], function() {
  console.log( "Dist built @ " + new Date());
});

gulp.task('default', ['express', 'livereload', 'watch'], function() {
  console.log("Running @ http://localhost:" + port);
});
