var Buffer = require('buffer').Buffer;
var through = require('through');

module.exports = function(config) {
  var cacheSource = function(file) {
    // Hack to give karma-coverage the source files for html reporter
    // since we do not actually use karma to instrument in order to
    // map to pre-browserified code
    var store = require('karma-coverage/lib/source-cache').get(config.basePath);
    var chunks = [];
    var tsExtends = /^var __extends =/;
    return through(function(buff) {
      var str = buff.toString();
      // More hacks for ignoring typescript's __extend
      if (Buffer.isBuffer(buff) && tsExtends.test(str)) {
        buff = Buffer.concat([
          new Buffer(str.split('\n')[0]),
          new Buffer('\n    /* istanbul ignore next */\n'),
          new Buffer(str.split('\n').slice(1).join('\n'))
        ])
      }
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
      'test/registry/*.js': ['babel'],
      'test/parchment.ts': ['browserify']
    },
    browserify: {
      transform: [cacheSource, 'browserify-istanbul'],
      plugin: [['tsify']]
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
