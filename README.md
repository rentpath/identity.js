[![Build Status](https://travis-ci.org/rentpath/identity.js.svg?branch=master)](https://travis-ci.org/rentpath/identity.js)


# Track a Universal RentPath Identity

## For Javascript Developers

If you are a JavaScript developer and regularly use open source libraries, adding a RentPath Universal
Identity (RUID) to your site requires little effort. The bulk of work is already captured
in this library. In most cases, integration requires just two snippets of code.

Copy and paste the following snippets into your Web site or application so that each page
view executes the code. For example, embed the code into a header or footer
or other element that is rendered within all pages in the site.

```javascript
<script async type="text/javascript"
  src="http://www.rentpathcode.com/identity/1.2.1/identity.min.js">
</script>

<script>
  window.Identity = window.Identity || [];
  function report() {
    var id = this.universal_zid.uuid;
    window.Identity.push(['cookify', id]);
    window.Identity.push(['track', function(){}, function(){}, 'http://identity.rentpathservices.com']);
  }

  window.Identity.push(['fetch', report, function (){}]);
</script>

```

To test proper operation, open your application (perhaps after a server restart or cache purge to pick
up the new JavaScript code) and look in the Cookies section of your browser developer tool. If you see
a new cookie named `uzid`, tracking is operational.


## For Developers with Existing Google Tag Manager Tags

If your site manages page content with _Google Tag Manager_ (GTM), adding a
RentPath Universal Identity (RUID) is quite simple. Specifically, two new tags
are needed: one tag to load the RUID JavaScript library, and a second to
create the RUID (if necessary) and track its use. Both tags must appear and
fire on all pages on your site.

Open your GTM console and create the tag to load the library.

1. Click **New Tag**.

2. On the next screen, click at top and name the tag _Load RUID Library_.

3. When asked to choose a type for the tag, select **Custom HTML Tag**.

4. Copy and paste the following code into the configuration text box:

  ```javascript
  <script async type="text/javascript"
    src="http://www.rentpathcode.com/identity/1.2.1/identity.min.js">
  </script>
  ```

5. Choose the trigger to **Fire on All Pages**.

6. Save the tag.


Next, create the tag to create and track the RUID.

1. Click **New Tag**.

2. Name this tag _Track RUID_.

3. Choose **Custom HTML Tag** again.

4. Copy and paste this piece of code:

  ```javascript
    <script>
      window.Identity = window.Identity || [];
      function report() {
        var id = this.universal_zid.uuid;
        window.Identity.push(['cookify', id]);
        window.Identity.push(['track', function(){}, function(){}, 'http://identity.rentpathservices.com']);
      }

      window.Identity.push(['fetch', report, function (){}]);
    </script>
  ```

5. Again, choose a trigger to **Fire on All Pages**.

6. Save the tag.


Finally, open a container that is present on each page of your site, add both
the _Load RUID Library_ and _Track RUID_ tags you just created, and publish the new version of the container.

Once published, the tracking code should work immediately.



## For RUID Library Developers

The RentPath Universal Identity is implemented as an ES6 library.


### Getting Started

```
$ git clone git@github.com:rentpath/identity.js.git
$ npm install
$ npm start

#
# Open http://localhost:5000 in a browser.
# Chrome typically works best for debugging.
# The default page shown is src/index.js.
...
```


### Linting

Before you commit any new code, scan your JS with ESLint.

```
$ npm run lint
```


### Testing

Automated tests poke and prod the entry points to the library. _Karma_ is the test runner.
The default test runner executes the tests only once, which is ideal for CI (_Travis_ and such).

```
$ npm run test
```

This will auto watch all files for changes and rerun the tests. Ideal for development.
```
$ npm run test_watch
```

### Bundling

To prepare code for a release, process the library to convert the ES6
into widely usable (read: _antique_) Javascript. Two commands perform the work:

```
$ webpack --debug --devtool sourcemap --output-pathinfo --config webpack.config.js
$ webpack --config webpack.config.production.js
```

The output of the first command is *./dist/identity-*version*.js* and
*./dist/identity-*version*.js.map*. The second command produces
*./dist/identity-*version*.min.js* and
*./dist/identity-*version*.min.js.map*. *version* is a string like `1.1.0`
defined by semantic versioning. The version number can be modified in the
*package.json*.

Commit these new files to the repo and use Github to construct a new release.



## References

* [ES6 with Babel](http://babeljs.io)
* [Webpack](http://webpack.github.io) for bundling
* [Webpack Dev Server](http://webpack.github.io/docs/webpack-dev-server.html)
* [Karma](http://karma-runner.github.io/0.13/index.html) for running unit tests.
