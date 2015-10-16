var Request = require('../src/request.js');

describe('Request', () => {
  afterEach(function () {
    jasmine.Ajax.uninstall();
    jasmine.clock().uninstall(); });

  beforeEach(function () {
    jasmine.Ajax.install();
    jasmine.clock().install(); });

  it('sets the timeout, retries, and timeout calback', function() {
    let retries   = 10;
    let timeout   = 2000;
    let timeoutFn = jasmine.createSpy('onTimeout');
    let r         = new Request(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      retries,
      timeout,
      timeoutFn);
    expect(r.retries).toBe(retries);
    expect(r.timeout).toBe(timeout);
    expect(r.timeoutFn).toBe(timeoutFn);
  });

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

  it('calls the success callback', function () {
    jasmine.Ajax.stubRequest(
      /.*\/universal_zids\/new/
    ).andReturn({
      status:       201,
      statusText:   'Created',
      contentType:  'application/json',
      responseText: '{}'
    });

    let successFn = jasmine.createSpy('onSuccess');
    let r         = new Request(successFn, () => {});
    r.send();
    let recent    = jasmine.Ajax.requests.mostRecent();
    expect(successFn).toHaveBeenCalled();
  });

  it('calls the failure callback', function () {
    let successFn = jasmine.createSpy('onSuccess');
    let failureFn = jasmine.createSpy('onFailure');
    let r         = new Request(
      successFn,
      failureFn,
      undefined,
      undefined,
      undefined,
      undefined,
      0);
    r.send();
    let recent    = jasmine.Ajax.requests.mostRecent();
    recent.responseTimeout();
    expect(failureFn).toHaveBeenCalled();
  });

  it('calls the timeout callback', function () {
    let timeoutFn = jasmine.createSpy('onTimeout');
    let r         = new Request(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      timeoutFn);
    r.send();
    let recent    = jasmine.Ajax.requests.mostRecent();
    recent.responseTimeout();
    expect(timeoutFn).toHaveBeenCalled();
  });
});
