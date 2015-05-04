var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var flatten = require('gulp-flatten');
var gulp = require('gulp');
var karma = require('karma').server;
var source = require('vinyl-source-stream');
var ts = require('gulp-typescript');


gulp.task('default', ['build']);

gulp.task('build', ['build:browserify']);

gulp.task('build:ts', function() {
  var compiler = ts({
    declarationFiles: false,
    target: 'es5',
    module: 'commonjs'
  });
  return gulp.src(['src/**/*.ts', 'test/parchment.ts'], { base: '.' })
    .pipe(buffer())
    .pipe(compiler).js
    .pipe(gulp.dest('./.build/'));
});

gulp.task('build:browserify', ['build:browserify:src', 'build:browserify:test']);

gulp.task('build:browserify:src', ['build:ts'], function() {
  var b = browserify({
    entries: './.build/src/parchment.js',
    standalone: 'Parchment'
  });
  return b.bundle()
    .pipe(source('./.build/src/parchment.js'))
    .pipe(buffer())
    .pipe(flatten())
    .pipe(gulp.dest('./dist'));
});

gulp.task('build:browserify:test', ['build:ts'], function() {
  var b = browserify('./.build/test/parchment.js');
  return b.bundle()
    .pipe(source('./.build/test/parchment.exposed.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./'));
});

gulp.task('test', function(done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js'
  }, done);
});

gulp.task('test:server', function(done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false
  }, done);
});

gulp.task('watch', function() {
  gulp.watch('**/*.ts', ['build']);
});
