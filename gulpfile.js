var gulp = require('gulp');
var gutil = require('gulp-util');
var karma = require('karma').server;
var source = require('vinyl-source-stream');
var webpack = require('webpack');
var webpackConfig = require('./webpack.conf');


gulp.task('default', ['build']);

gulp.task('build', function(callback) {
  webpack(webpackConfig, function(err, stats, el) {
    if (err) throw new gutil.PluginError('webpack', err);
    callback();
  });
});

gulp.task('test', function(done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js'
  }, done);
});

// gulp.task('test:coverage', function(done) {
//   karma.start({
//     configFile: __dirname + '/karma.conf.js',
//     reporters: ['progress', 'coverage']
//   }, done);
// });

gulp.task('test:server', function(done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false
  }, done);
});

// gulp.task('test:travis', function(done) {
//   karma.start({
//     configFile: __dirname + '/karma.conf.js',
//     browserify: {
//       plugin: [['tsify']]
//     },
//     browsers: ['saucelabs-chrome'],
//     reporters: ['dots', 'saucelabs'],
//     sauceLabs: {
//       testName: 'Parchment Unit Tests',
//       username: process.env.SAUCE_USER || 'quill',
//       accessKey: process.env.SAUCE_KEY || 'adc0c0cf-221b-46f1-81b9-a4429b722c2e',
//       build: process.env.TRAVIS_BUILD_ID,
//       tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER
//     }
//   }, done);
// });

gulp.task('watch', function() {
  gulp.watch('**/*.ts', ['build']);
});
