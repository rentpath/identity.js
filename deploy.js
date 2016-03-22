#! /usr/bin/env node

var child     = require('child_process');
var exec      = child.exec;
var file      = require('file');
var pack      = require('./package.json');
var path      = require('path');
var prefix    = './node_modules/.bin/s3-cli put --acl-public ./dist/';
var sync      = child.execSync;
var s3        = require('s3');
var s3_folder = pack.internal_name;
var target    = pack.name;
var versions  = sync(`npm view ${target} versions`).toString();

/*
 * Find AWS variables. Die if any are undefined.
 */
var access = process.env['AWS_ACCESS_KEY'];
var bucket = process.env['AWS_BUCKET_NAME'];
var secret = process.env['AWS_SECRET_KEY'];

if ((typeof bucket == 'undefined') || (typeof access == 'undefined') ||
    (typeof secret == 'undefined')) {
  console.log('Error: The AWS environment variables are not set.');
  console.log('  Check local AWS_ACCESS_KEY, AWS_BUCKET_NAME, and AWS_SECRET_KEY.');
  process.exit();
}


/*
 * Find latest version of library published to npm
 * and build packages with proper version number in the names.
 */
versions = JSON.parse(`{"versions": ${versions.replace(/'/g, "\"")}}`);
var version = versions.versions.slice(-1)[0];
console.log(`Building version ${version}... `);

sync(`webpack -i ${version} --debug --devtool sourcemap --output-pathinfo --config webpack.config.js`, { stdio: [0, 1, 2] });
sync(`webpack -i ${version} --config webpack.config.production.js`, { stdio: [0, 1, 2] });


/*
 * Copy the packages to S3, being careful not to overwrite any
 * existing files of the same name. The files are renamed from
 * dist/identity-rentpath-j.m.p.js (where j = major version, m = minor
 * version, and p = patch level) to
 * bucket:identity-rentpath/j.m.p/identity-rentpath.js
 */
console.log(`Deploying version ${version} to S3 bucket ${bucket}... `);

var client = s3.createClient({
  s3Options: {
    accessKeyId: access,
    secretAccessKey: secret
  }
});

file.walkSync('./dist', function(dirPath, dirs, files) {
  files.forEach(function(file) {
    if (file.match(version)) {
      var cleanName   = file.replace(/\-[\d\.]+(?=\.)/, '');
      var key         = path.join(s3_folder, version, cleanName);
      var bucketPath  = 's3://' + path.join(bucket, key)
      var commandLine = prefix + file + ' ' + bucketPath;

      client.s3.headObject({
        Bucket: bucket,
        Key: key
      }, function(err, data) {
        if (err) {
          console.log('Executing: ' + commandLine);
          exec(commandLine, function(err, stdout, stderr) {
            console.log(stderr || stdout);
          });
        } else {
          console.log(`  ${key} exists; Skipping...`);
        };
      });
    };
  });
});
