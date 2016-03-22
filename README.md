[![Build Status](https://travis-ci.org/rentpath/identity.js.svg?branch=master)](https://travis-ci.org/rentpath/identity.js) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=plastic)](https://github.com/semantic-release/semantic-release)


Track a Universal RentPath Identity
===================================

For Javascript Developers
-------------------------

If you are a JavaScript developer and regularly use open source libraries,
adding a RentPath Universal Identity (RUID) to your site requires little effort.
The bulk of work is already captured in this library. In most cases, integration
requires just two snippets of code.

Copy and paste the following snippets into your Web site so that each page view
executes the code. For example, you might embed the code into a header or footer
or other element that is rendered within all pages in your site.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ javascript
<script async type="text/javascript"
  src="http://www.rentpathcode.com/identity/x.y.z/identity.min.js">
</script>

<script>
  window.Identity = window.Identity || [];

  function report() {
    var id = this.universal_zid.uuid;
    window.Identity.push(['cookify', id]);
    window.Identity.push(['pixel', window.location.href]);
    window.Identity.push(['track', function(){}, function(){}, 'http://identity.rentpathservices.com']);
  }

  window.Identity.push(['fetch', report, function (){}]);
</script>
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The first `script` tag above loads the RentPath Identity library code from a CDN.
Please replace the _x.y.z_ in the `src` with the version number of the
latest release of the library. To find the latest release, run the command...

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
$ npm view identity-rentpath versions
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


The second `script` tag above creates an RUID (if one has not already been saved as
a cookie) and sends tracking information, including the RUID, your hostname, and
the complete URL of the current page, to our servers.

To test operation, open your application (perhaps after a server restart or
cache purge to pick up the new JavaScript code) and look in the *Cookies*
section of your browser's development tools. If you see a new cookie named
`uzid`, tracking is operational.

Packaging via npm
-----------------

If you use Javascript packaging tools such as *webpack* to manage your library
dependencies, you can include the RUID library via the manifest, *package.json*.

Install RUID with the command:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
$ npm install identity-rentpath --save-dev
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

 

For Developers with Existing Google Tag Manager Tags
----------------------------------------------------

If your site manages page content with *Google Tag Manager* (GTM), adding a
RentPath Universal Identity (RUID) is quite simple. Specifically, two new tags
are needed: one tag to load the RUID JavaScript library, and a second to create
the RUID (if necessary) and track its use. Both tags must appear and fire on all
pages on your site.

Open your GTM console and create the tag to load the library.

1.  Click **New Tag**.

2.  On the next screen, click at top and name the tag *Load RUID Library*.

3.  When asked to choose a type for the tag, select **Custom HTML Tag**.

4.  Copy and paste the following code into the configuration text box:

  ``` javascript
  <script async
    type="text/javascript"
    src="http://www.rentpathcode.com/identity/x.y.z/identity.min.js">
  </script>
  ```

5.  Replace the _x.y.z_ with the version number of the latest release of the library. You
    can use _npm view_ to list all available versions (see the command to use
    in the first section) or browse the releases on this
    repository's [Github releases page](https://github.com/rentpath/identity.js/releases).

6.  Choose the trigger to **Fire on All Pages**.

7.  Save the tag.


Next, create the tag to create and track the RUID.

1.  Click **New Tag**.

2.  Name this tag *Track RUID*.

3.  Choose **Custom HTML Tag** again.

4.  Copy and paste this piece of code:

  ``` javascript
  <script type="text/javascript">
    window.Identity = window.Identity || [];

    function report() {
      var id = this.universal_zid.uuid;
      window.Identity.push(['cookify', id]);
      window.Identity.push(['pixel', window.location.href]);
      window.Identity.push(['track', function(){}, function(){}, 'http://identity.rentpathservices.com']);
    }

    window.Identity.push(['fetch', report, function (){}]);
  </script>
  ```

1.  Again, choose a trigger to **Fire on All Pages**.

2.  Save the tag.

Finally, open a container that is present on each page of your site, add both
the *Load RUID Library* and *Track RUID* tags you just created, and publish the
new version of the container.

Once published, the tracking code should work immediately.

For RUID Library Developers
---------------------------

The RentPath Universal Identity is implemented as an ES6 library.

### Getting Started

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
$ git clone git@github.com:rentpath/identity.js.git
$ npm install
$ npm start

#
# Open http://localhost:5000 in a browser.
# Chrome typically works best for debugging.
# The default page shown is src/index.js.
...
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

### Linting

Before you commit any new code, scan your JS with ESLint.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
$ npm run lint
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

### Testing

Automated tests poke and prod the entry points to the library. *Karma* is the
test runner. The default test runner executes the tests only once, which is
ideal for CI (*Travis* and such).

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
$ npm run test
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This will auto watch all files for changes and rerun the tests. Ideal for
development.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
$ npm run test_watch
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

### Bundling

To prepare code for a release, process the library to convert the ES6 into
widely usable (read: *antique*) Javascript. Two commands perform the work:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
$ webpack --debug --devtool sourcemap --output-pathinfo --config webpack.config.js
$ webpack --config webpack.config.production.js
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The first use of _webpack_ generates files ./dist/identity-_version_.js and
./dist/identity-_version_.js.map, where *version* is a
string like `1.1.0` defined by semantic versioning. The second command
produces ./dist/identity-_version_.min.js and ./dist/identity-_version_.min.js.map.



### Releasing New Code

Code changes are automatically versioned and released to npm and Github using a
combination of [semantic-release](https://github.com/semantic-release/semantic-release),
[commitizen](https://www.npmjs.com/package/commitizen), and
[Travis](https://travis-ci.org/rentpath/identity.js).

If the master branch passes all tests, it is packaged in three forms and sent to
npm, Github, and S3, respectively.


References
----------

-   [ES6 with Babel](<http://babeljs.io>)

-   [Webpack](<http://webpack.github.io>) for bundling

-   [Webpack Dev
    Server](<http://webpack.github.io/docs/webpack-dev-server.html>)

-   [Karma](<http://karma-runner.github.io/0.13/index.html>) for running unit
    tests.
