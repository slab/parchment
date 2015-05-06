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
      plugin: ['tsify']
    },
    exclude: [],
    reporters: ['progress'],
    browsers: ['Chrome'],

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: true
  });
};
