var zutron  = require('../src/zutron.js');
var Cookies = require('js-cookie');

describe('UniversalZid', () => {
  var testUniversalZid;

  beforeEach(function () {
    testUniversalZid = UniversalZid;
  });

  it('object should exist', function () {
    expect(testUniversalZid).toBeDefined();
  });

  describe('#cookify', function () {
    it('sets the uzid cookie to a simple value', function () {
      var cookieValue = 'something';
      UniversalZid.cookify(cookieValue);
      expect(Cookies.get('uzid')).toBe(cookieValue);
    });

    it('sets the uzid cookie to JSON', function () {
      var cookieValue = { "a": 123 };
      UniversalZid.cookify(cookieValue);
      expect(Cookies.get('uzid')).toBe('{"a":123}');
    });
  });

  describe('#fetch', function () {
    beforeEach(function () {
      jasmine.Ajax.install();
      jasmine.clock().install();
    });

    afterEach(function () {
      jasmine.Ajax.uninstall();
      jasmine.clock().uninstall();
    });

    it('should call onLoad callback on success', function () {
      jasmine.Ajax.stubRequest(
          /.*\/universal_zids\/new/
        ).andReturn({
          status: 201,
          statusText: 'Created',
          contentType: 'application/json',
          responseText: '{}'
        });

      var successFn = jasmine.createSpy('onLoad');
      testUniversalZid.fetch(successFn, () => {}, 'hailzutron.primedia.com', 8080);
      var request = jasmine.Ajax.requests.mostRecent();
      expect(request.method).toBe('GET');
      expect(request.url).toContain('hailzutron.primedia.com:8080');
      expect(request.url).toContain('/universal_zids/new');
      expect(successFn).toHaveBeenCalled();
    });

    it('should call error callback on timeout', function () {
      var successFn = jasmine.createSpy('onSuccess');
      var errorFn   = jasmine.createSpy('onTimeout');
      testUniversalZid.fetch(successFn, errorFn, 'zutron.primedia.com', 80, 0);
      var request   = jasmine.Ajax.requests.mostRecent();
      request.responseTimeout();
      expect(errorFn).toHaveBeenCalled();
    });
  })

  describe('#push', function () {
    it('should call the supplied function', function () {
      var params = ['fetch', 'foo'];
      spyOn(testUniversalZid, 'fetch')
      testUniversalZid.push(params);
      expect(testUniversalZid.fetch).toHaveBeenCalledWith('foo');
    });
  });

  describe('#uzid', function () {
    it('should return the cookie', function () {
      var value = { "whatever": 123 };
      Cookies.set('uzid', value);
      expect(testUniversalZid.uzid().whatever).toBe(123);
    });
  });

  describe('#link', function () {
    it('should attempt the correct API call', function () {
      var fn = jasmine.any(Function);
      spyOn(testUniversalZid, '_request');
      testUniversalZid.link(() => {}, () => {}, 'zidUuid', 'hostname.com', 8080);
      expect(testUniversalZid._request).toHaveBeenCalledWith(fn, fn, 'zidUuid', 'hostname.com', 8080, 'zid_link');
    });
  });

  describe('#unlink', function () {
    it('should attempt the correct API call', function () {
      var fn = jasmine.any(Function);
      spyOn(testUniversalZid, '_request');
      testUniversalZid.unlink(() => {}, () => {}, 'zidUuid', 'hostname.com', 8080);
      expect(testUniversalZid._request).toHaveBeenCalledWith(fn, fn, 'zidUuid', 'hostname.com', 8080, 'zid_decouple');
    });
  });
});
