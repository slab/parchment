var through = require('through');
var istanbul = require('istanbul');
var store = require('karma-coverage/lib/sourceCache').getByBasePath(__dirname);

var instrumenter = new istanbul.Instrumenter();
var transform = function(file) {
  var data = '';
  return through(function(buff) {
    data += buff;
  }, function() {
    var self = this;
    store[file] = data;
    instrumenter.instrument(data, file, function(err, code) {
      if (!err) {
        self.queue(code);
      } else {
        self.emit('error', err);
      }
      self.queue(null);
    })
  })
};


module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['browserify', 'jasmine'],
    files: [
      'test/parchment.ts',
      'test/unit/*.js'
    ],
    preprocessors: {
      'test/parchment.ts': ['browserify']
    },
    browserify: {
      transform: [transform],
      plugin: [['tsify', { target: 'ES5' }]]
    },
    exclude: [],
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      dir: '.build/coverage',
      type: 'html'
    },
    browsers: ['Chrome'],

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: true
  });
};
