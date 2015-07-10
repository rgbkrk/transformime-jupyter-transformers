var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  babel = require("gulp-babel"),
  browserify = require("gulp-browserify"),
  vulcanize = require("gulp-vulcanize"),
  rename = require("gulp-rename"),
  debug = require('gulp-debug'),
  shell = require('gulp-shell'),
  concat = require('gulp-concat'),
  connect = require("gulp-connect");

gulp.task('js', function () {
  return gulp.src([
    'src/jupyter-display-area.js',
    'src/utils.js',
    ]).pipe(babel({
        modules: "common"
    }))
    .pipe(browserify({
        insertGlobals : true,
        debug : !gulp.env.production
    }))
    // .pipe(concat('jupyter-display-area.js'))
    // .pipe(uglify())
    .pipe(gulp.dest('predist'));
});

gulp.task('html', function () {
  gulp.src('src/jupyter-display-area.html')
    .pipe(rename('jupyter-display-area.local.html'))
    .pipe(gulp.dest('dist'));
});

gulp.task('vulcanize', function () {
  gulp.src('dist/jupyter-display-area.local.html')
    .pipe(shell(["vulcanize --inline-scripts <%= file.path %> > dist/jupyter-display-area.html"]));
});

gulp.task('build', ['js', 'html', 'vulcanize']);

gulp.task('default', ['build', 'connect'], function () {
  gulp.watch(['src/*.*js'], ['js']);
  gulp.watch(['src/*.html'], ['html']);
  gulp.watch(['dist/jupyter-display-area.local.html', 'dist/jupyter-display-area.js'], ['vulcanize']);

  gulp.watch(['index.html', 'dist/**.*'], function (event) {
    return gulp.src(event.path)
      .pipe(connect.reload());
  });
});

gulp.task('connect', function () {
  connect.server({
    root: [__dirname],
    port: 1983,
    livereload: {port: 2983}
  });
});
