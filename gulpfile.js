var gulp = require('gulp');

var buckets = {
  production: 'zutron-assets-production',
  qa        : 'zutron-assets-qa',
  ci        : 'zutron-assets-ci',
  test      : 'zutron-assets-test' };

var bucketName = function (environment) {
  return buckets[environment] || buckets.test; };

require('tautline')(gulp, {
  aws: {
    key:    process.env.APPLICATIONS_ASSETS_ACCESS_ID,
    secret: process.env.APPLICATIONS_ASSETS_SECRET_KEY,
    bucket: bucketName(process.env.APPLICATION_ENVIRONMENT),
    region: "us-standard" },

	s3: {
    assets: {
      uploadPath: '/',
      asyncLimit: 8,
      headers: {
        'Cache-Control': 'max-age=315360000, no-transform, public' },
      gzippedOnly: true,
      dieOnError: true },
    source: {
      uploadPath: '/',
      asyncLimit: 16,
      headers: {
        'Cache-Control': 'max-age=0, no-transform, public' },
      gzippedOnly: true,
      dieOnError: true } } } );
