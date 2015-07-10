var browserify = require('browserify');
var derequire = require('gulp-derequire');
var gulp = require('gulp');
var karma = require('karma').server;
var source = require('vinyl-source-stream');
var tsconfig = require('./tsconfig.json');
var tsify = require('tsify');


gulp.task('default', ['build']);

gulp.task('build', function() {
  var b = browserify({
    standalone: 'Parchment',
    entries: './src/parchment.ts'
  });
  b.plugin('tsify', tsconfig.compilerOptions).bundle()
    .on('error', function(e) {
      console.error(e.toString());
    })
    .pipe(source('parchment.js'))
    .pipe(derequire())
    .pipe(gulp.dest('./dist'));
});

gulp.task('test', function(done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    browserify: {
      plugin: [['tsify', tsconfig.compilerOptions]]
    },
  }, done);
});

gulp.task('test:coverage', function(done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    reporters: ['progress', 'coverage']
  }, done);
});

gulp.task('test:server', function(done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    browserify: {
      plugin: [['tsify', tsconfig.compilerOptions]]
    },
    singleRun: false
  }, done);
});

gulp.task('test:travis', function(done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    browserify: {
      plugin: [['tsify', tsconfig.compilerOptions]]
    },
    browsers: ['saucelabs-chrome'],
    reporters: ['dots', 'saucelabs'],
    sauceLabs: {
      testName: 'Parchment Unit Tests',
      username: process.env.SAUCE_USER || 'quill',
      accessKey: process.env.SAUCE_KEY || 'adc0c0cf-221b-46f1-81b9-a4429b722c2e',
      build: process.env.TRAVIS_BUILD_ID,
      tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER
    }
  }, done);
});

gulp.task('watch', function() {
  gulp.watch('**/*.ts', ['build']);
});
