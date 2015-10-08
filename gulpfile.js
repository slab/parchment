var _ = require('lodash');
var gulp = require('gulp');
var gutil = require('gulp-util');
var karma = require('karma');
var path = require('path');
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
  new karma.Server({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();
});

gulp.task('test:coverage', function(done) {
  var config = _.clone(webpackConfig);
  config.module.postLoaders = [
    { test: /src\/.*\.ts$/, loader: 'istanbul-instrumenter' }
  ];
  new karma.Server({
    configFile: __dirname + '/karma.conf.js',
    reporters: ['progress', 'coverage'],
    webpack: config
  }, done).start();
});

gulp.task('test:server', function(done) {
  new karma.Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false
  }, done).start();
});

gulp.task('test:travis', function(done) {
  new karma.Server({
    configFile: __dirname + '/karma.conf.js',
    browsers: ['saucelabs-chrome'],
    reporters: ['dots', 'saucelabs'],
    sauceLabs: {
      testName: 'Parchment Unit Tests',
      username: process.env.SAUCE_USER || 'quill',
      accessKey: process.env.SAUCE_KEY || 'adc0c0cf-221b-46f1-81b9-a4429b722c2e',
      build: process.env.TRAVIS_BUILD_ID,
      tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER
    }
  }, done).start();
});

gulp.task('watch', function() {
  gulp.watch('**/*.ts', ['build']);
});
