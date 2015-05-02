var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var flatten = require('gulp-flatten');
var gulp = require('gulp');
var karma = require('karma').server;
var source = require('vinyl-source-stream');
var ts = require('gulp-typescript');


gulp.task('default', ['build:ts', 'build:browserify']);

gulp.task('build:ts', function() {
  var compiler = ts({ delcarationFiles: false, module: 'commonjs' });
  var result = gulp.src('src/**/*.ts').pipe(compiler);
  result.js.pipe(gulp.dest('./.build/src/'));
});

gulp.task('build:browserify', function() {
  var b = browserify({
    debug: true,
    entries: './.build/src/tree-list.js',
    standalone: 'TreeList'
  });

  return b.bundle()
          .pipe(source('./.build/src/tree-list.js'))
          .pipe(buffer())
          .pipe(flatten())
          .pipe(gulp.dest('./dist'));
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

gulp.task('watch', ['build'], function() {
  gulp.watch('**/*.ts', ['build:ts, build:browserify'])
});
