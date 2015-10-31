var Request = require('../src/request.js');

describe('Request', () => {
  afterEach(function () {
    jasmine.Ajax.uninstall(); });

  beforeEach(function () {
    jasmine.Ajax.install(); });

  it('assembles a default URL', function () {
    let defaultHost   = 'http://zutron.primedia.com';
    let defaultPort   = 80;
    let defaultTarget = '/universal_zids/new';
    let r = new Request(() => {});

    r.send();
    var lastRequest = jasmine.Ajax.requests.mostRecent();
    expect(lastRequest.method).toBe('GET');
    expect(lastRequest.url).toBe(`${defaultHost}:${defaultPort}${defaultTarget}`);
  });

  it('assembles a custom URL', function () {
    let host   = 'http://example.org';
    let method = 'POST';
    let port   = 6000;
    let target = '/some/path/to/use';
    let r      = new Request(() => {}, () => {}, host + '/', port, target, method);

    r.send();
    var lastRequest = jasmine.Ajax.requests.mostRecent();
    expect(lastRequest.method).toBe(method);
    expect(lastRequest.url).toBe(`${host}:${port}${target}`);
  });
});
