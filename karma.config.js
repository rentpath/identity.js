var webpack = require('karma-webpack');

module.exports = function (config) {
  config.set({
    singleRun: true,

    frameworks: [
      'jasmine-ajax',
      'jasmine' ],

    files: [
      './node_modules/phantomjs-polyfill/bind-polyfill.js',
      'tests/**/*_spec.js',
    ],

    plugins: [
      webpack,
      'karma-sourcemap-loader',
      'karma-coverage',
      'karma-jasmine',
      'karma-jasmine-ajax',
      'karma-phantomjs-launcher',
      'karma-spec-reporter' ],

    browsers: [ 'PhantomJS' ],

    preprocessors: {
      'tests/**/*_spec.js': ['webpack', 'sourcemap'],
      'src/**/*.js': ['webpack', 'sourcemap']
    },

    reporters: [ 'spec', 'coverage' ],

    coverageReporter: {
      dir: 'build/reports/coverage',
      reporters: [
        { type: 'html', subdir: 'report-html' },
        { type: 'lcov', subdir: 'report-lcov' },
        { type: 'cobertura', subdir: '.', file: 'cobertura.txt' }
      ]
    },

    webpack: {
      devtool: 'inline-source-map',

      module: {
        loaders: [{
          test: /\.(js|jsx)$/, exclude: /(bower_components|node_modules)/,
          loader: 'babel-loader'
        }],

        postLoaders: [{
          test: /\.(js|jsx)$/, exclude: /(node_modules|bower_components|tests)/,
          loader: 'istanbul-instrumenter'
        }]
      }
    },

    webpackMiddleware: { noInfo: true },

    webpackServer: { noInfo: true },
  });
};
