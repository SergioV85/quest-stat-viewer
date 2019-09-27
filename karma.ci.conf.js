// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html
process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: {
      jasmine: {
        random: false,
      },
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, './coverage'),
      reports: ['html', 'lcovonly'],
      fixWebpackSourcePaths: true,
      'report-config': {
        html: {
          subdir: 'html',
        },
        lcovonly: {
          subdir: 'lcov',
        },
      },
    },
    angularCli: {
      environment: 'dev',
      codeCoverage: true,
    },
    reporters: ['progress', 'coverage-istanbul'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['ChromeHeadless'],
    browserDisconnectTolerance: 2,
    browserDisconnectTimeout: 100000,
    browserNoActivityTimeout: 100000,
    singleRun: true,
    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: [
          '--headless',
          '--disable-gpu',
          '--no-sandbox',
          '--disable-setuid-sandbox',
          // Without a remote debugging port, Google Chrome exits immediately.
          '--remote-debugging-port=9222',
        ],
      },
    },
  });
};
