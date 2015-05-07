var browserify = require('browserify');
var derequire = require('gulp-derequire');
var gulp = require('gulp');
var karma = require('karma').server;
var source = require('vinyl-source-stream');
var tsify = require('tsify');


gulp.task('default', ['build']);


gulp.task('build', function() {
  var b = browserify({
    standalone: 'Parchment',
    entries: './src/parchment.ts'
  });
  b.plugin('tsify', { target: 'ES5' }).bundle()
    .pipe(source('parchment.js'))
    .pipe(derequire())
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

gulp.task('watch', function() {
  gulp.watch('**/*.ts', ['build']);
});

