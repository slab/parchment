var webpackConfig = require('./webpack.conf');

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'test/parchment.ts',
      'test/setup.js',
      'test/registry/*.js',
      'test/unit/linked-list.js', // Control test order
      'test/unit/registry.js',
      'test/unit/attributor.js',
      'test/unit/blot.js',
      'test/unit/parent.js',
      'test/unit/scroll.js',
      'test/unit/container.js',
      'test/unit/block.js',
      'test/unit/inline.js',
      'test/unit/embed.js',
      'test/unit/text.js',
      'test/unit/lifecycle.js',
    ],
    preprocessors: {
      'test/registry/*.js': ['babel'],
      'test/parchment.ts': ['webpack'],
    },
    mime: {
      'text/x-typescript': ['ts'],
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      stats: {
        assets: false,
        chunks: false,
        colors: true,
        errorDetails: true,
        hash: false,
        timings: false,
        version: false,
      },
    },
    exclude: [],
    reporters: ['progress'],
    coverageReporter: {
      dir: '.build/coverage',
      reporters: [{ type: 'html' }, { type: 'text' }, { type: 'lcov' }],
    },
    browsers: ['Chrome'],
    customLaunchers: {
      'saucelabs-chrome': {
        base: 'SauceLabs',
        browserName: 'Chrome',
        platform: 'OS X 10.15',
        version: 'beta',
      },
    },
    sauceLabs: {
      testName: 'Parchment Unit Tests',
      build: process.env.TRAVIS_BUILD_ID,
      tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
      startConnect: false,
    },
    port: process.env.TRAVIS ? 9876 : 10876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: true,
  });
};
