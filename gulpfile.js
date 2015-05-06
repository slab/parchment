var browserify = require('browserify');
var gulp = require('gulp');
var karma = require('karma').server;
var source = require('vinyl-source-stream');
var tsify = require('tsify');


gulp.task('default', ['build']);


gulp.task('build', function() {
  return bundler('./src/parchment.ts')
    .pipe(source('parchment.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('build:test', ['build:ts'], function() {
  return bundler('./test/parchment.ts')
    .pipe(source('parchment.js'))
    .pipe(gulp.dest('./build/test'));
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


function bundler(files) {
  return browserify({
    standalone: 'Parchment',
    entries: files
  }).plugin('tsify', { target: 'ES5' }).bundle();
}
