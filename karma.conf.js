module.exports = (config) => {
  config.set({
    plugins: ['karma-jasmine', 'karma-vite', 'karma-chrome-launcher', 'karma-sauce-launcher'],
    frameworks: ['jasmine', 'vite'],
    files: [
      {
        // test ordering doesn't matter
        pattern: 'test/unit/*.ts',
        type: 'module',
        watched: false,
        served: false,
      },
    ],
    exclude: [],
    reporters: ['progress'],
    browsers: ['Chrome'],
    customLaunchers: {
      'saucelabs-chrome': {
        base: 'SauceLabs',
        browserName: 'Chrome',
        platform: 'OS X 10.15',
        version: '75',
      },
    },
    sauceLabs: {
      testName: 'Parchment Unit Tests',
      build: process.env.GITHUB_RUN_ID
        ? `${process.env.GITHUB_REPOSITORY} run #${process.env.GITHUB_RUN_ID}`
        : null,
    },
    port: process.env.GITHUB_ACTION ? 9876 : 10876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: true,
  });
};
