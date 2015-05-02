module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'node_modules/lodash/index.js',
      'dist/tree-list.js',

      'test/unit/*.js'
    ],
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
