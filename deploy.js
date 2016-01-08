#! /usr/bin/env node

var access  = process.env['AWS_ACCESS_KEY']  || process.env['RENTPATHCODE_BUCKET_ACCESS_KEY'];
var bucket  = process.env['AWS_BUCKET_NAME'] || process.env['RENTPATHCODE_BUCKET_NAME'];;
var exec    = require('child_process').exec;
var file    = require('file');
var pack    = require('./package.json');
var path    = require('path');
var prefix  = './node_modules/.bin/s3-cli put ./dist/'
var secret  = process.env['AWS_SECRET_KEY']  || process.env['RENTPATHCODE_BUCKET_SECRET_KEY'];;
var target  = pack.name;
var version = pack.version;

if ((typeof bucket == 'undefined') || (typeof access == 'undefined') ||
    (typeof secret == 'undefined')) {
  console.log('Error: AWS environment variables are not set;');
  console.log('  Check AWS_ACCESS_KEY, AWS_BUCKET_NAME, and AWS_SECRET_KEY.');
  console.log('  and/or RENTPATHCODE_BUCKET_ACCESS_KEY, RENTPATHCODE_BUCKET_NAME, and RENTPATHCODE_BUCKET_SECRET_KEY.');
  process.exit();
}

file.walkSync('./dist', function(dirPath, dirs, files) {
  files.forEach(function(file) {
    if (file.match(version)) {
      var cleanName   = file.replace(/\-[\d\.]+(?=\.)/, '');
      var bucketPath  = 's3://' + path.join(bucket, '/', target, version, cleanName)
      var commandLine = prefix + file + ' ' + bucketPath;

      console.log('Executing: ' + commandLine);
      exec(commandLine, function(err, stdout, stderr) {
        console.log(stderr || stdout);
      });
    }
  });
});
