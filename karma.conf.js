var Buffer = require('buffer').Buffer;
var through = require('through');

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['browserify', 'jasmine'],
    files: [
      'test/parchment.ts',
      'test/registry/*.js',
      'test/unit/linked-list.js',   // Control test order
      'test/unit/registry.js',
      'test/unit/blot.js',
      'test/unit/block.js',
      'test/unit/inline.js',
      'test/unit/text.js',
      'test/unit/embed.js',
      'test/unit/container.js',
      'test/unit/attributor.js',
      'test/unit/merge.js'
    ],
    preprocessors: {
      'test/parchment.ts': ['webpack']
    },
    exclude: [],
    reporters: ['progress'],
    coverageReporter: {
      dir: '.build/coverage',
      reporters: [
        { type: 'html' },
        { type: 'text' }
      ]
    },
    browsers: ['Chrome'],
    customLaunchers: {
      'saucelabs-chrome': {
        base: 'SauceLabs',
        browserName: 'Chrome',
        platform: 'Mac 10.10',
        version: '43'
      }
    },
    port: 10876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: true
  });
};
