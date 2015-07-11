var through = require('through');
var tsconfig = require('./tsconfig.json');

module.exports = function(config) {
  var cacheSource = function(file) {
    // Hack to give karma-coverage the source files for html reporter
    // since we do not actually use karma to instrument in order to
    // map to pre-browserified code
    var store = require('karma-coverage/lib/source-cache').get(config.basePath);
    var chunks = [];
    return through(function(buff) {
      chunks.push(buff);
      this.queue(buff);
    }, function() {
      store[file] = chunks.join('');
      this.queue(null);
    });
  };

  config.set({
    basePath: '',
    frameworks: ['browserify', 'jasmine'],
    files: [
      'test/parchment.ts',
      'test/registry/*.js',
      'test/unit/linked-list.js',   // Control test order
      'test/unit/registry.js',
      'test/unit/text.js',
      'test/unit/embed.js',
      'test/unit/inline.js',
      'test/unit/block.js',
      'test/unit/container.js',
      'test/unit/format.js',
      'test/unit/attributor.js'
    ],
    preprocessors: {
      'test/registry/*.js': ['babel'],
      'test/parchment.ts': ['browserify']
    },
    browserify: {
      transform: [cacheSource, 'browserify-istanbul'],
      plugin: [['tsify', tsconfig.compilerOptions]]
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
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: true
  });
};
