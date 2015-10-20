# Track a Universal ZID from Zutron

ES technologies:
* [ES6 with Babel](http://babeljs.io)
* [Webpack](http://webpack.github.io) for bundling
* [Webpack Dev Server](http://webpack.github.io/docs/webpack-dev-server.html)
* [Karma](http://karma-runner.github.io/0.13/index.html) for running unit tests.


### Usage

```
$ git clone ...
$ npm install
$ npm start

#
# Open http://localhost:5000
```


### Linting

Scan your JS with ESLint.

```
$ npm run lint
```


### Testing

Start Karma test runner.

This will run the tests only one, ideal for CI (travis and such).

```
$ npm test
```

This will auto watch all files for changes and rerun the tests. Ideal for development.
```
$ npm run test_watch
```
