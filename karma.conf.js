var webpackConfig = require('./webpack.conf');

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'test/parchment.ts',
      'test/registry/*.js',
      'test/unit/linked-list.js',   // Control test order
      'test/unit/registry.js',
      'test/unit/attributor.js',
      'test/unit/blot.js',
      'test/unit/container.js',
      'test/unit/scroll.js',
      'test/unit/block.js',
      'test/unit/inline.js',
      'test/unit/embed.js',
      'test/unit/text.js',
      'test/unit/lifecycle.js'
    ],
    preprocessors: {
      'test/registry/*.js': ['babel'],
      'test/parchment.ts': ['webpack']
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
        version: false
      }
    },
    exclude: [],
    reporters: ['progress'],
    coverageReporter: {
      dir: '.build/coverage',
      reporters: [
        { type: 'lcov' },
        { type: 'text' }
      ]
    },
    browsers: ['Chrome'],
    customLaunchers: {
      'saucelabs-chrome': {
        base: 'SauceLabs',
        browserName: 'Chrome',
        platform: 'Mac 10.11',
        version: '47'
      }
    },
    port: 10876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: true
  });
};
