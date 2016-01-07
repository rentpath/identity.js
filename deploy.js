#! /usr/bin/env node

var bucket  = process.env['AWS_BUCKET_NAME'];
var exec    = require('child_process').exec;
var file    = require('file');
var pack    = require('./package.json');
var path    = require('path');
var target  = pack.name;
var version = pack.version;

if ((typeof bucket == 'undefined') ||
    (typeof process.env['AWS_ACCESS_KEY'] == 'undefined') ||
     (typeof process.env['AWS_SECRET_KEY'] == 'undefined')) {
  console.log('Error: AWS environment variables are not set;');
  console.log('       Check AWS_ACCESS_KEY, AWS_BUCKET_NAME, and AWS_SECRET_KEY.');
  process.exit();
}

file.walkSync('./dist', function(dirPath, dirs, files) {
  files.forEach(function(file) {
    var cleanName   = file.replace(/\-[\d\.]+(?=\.)/, '');
    var commandLine = './node_modules/.bin/s3-cli put ./dist/' + file + ' ' +
      's3://' + path.join(bucket, '/', target, version, cleanName);

    console.log('Executing: ' + commandLine);

    exec(commandLine, function(err, stdout, stderr) { console.log(stdout); console.log(stderr); });
  });
});
