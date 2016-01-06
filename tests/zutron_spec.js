var identity = require('../src/identity.js');
var Cookies  = require('js-cookie');

describe('Identity', () => {
  var testIdentity;
  var fn;

  beforeEach(function () {
    testIdentity = Identity;
    Cookies.remove('uzid');
    fn = jasmine.any(Function);
  });

  it('object should exist', function () {
    expect(testIdentity).toBeDefined();
  });

  describe('#cookify', function () {
    it('sets the uzid cookie to a simple value', function () {
      var cookieValue = 'something';
      Identity.cookify(cookieValue);
      expect(Cookies.get('uzid')).toBe(cookieValue);
    });

    it('sets the uzid cookie to JSON', function () {
      var cookieValue = { "a": 123 };
      Identity.cookify(cookieValue);
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

    describe('when the UZid does not exist', function () {
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
        testIdentity.fetch(successFn, fn, 'testidentity.rentpath.com', 8080);
        var request = jasmine.Ajax.requests.mostRecent();
        expect(request.method).toBe('GET');
        expect(request.url).toContain('testidentity.rentpath.com:8080');
        expect(request.url).toContain('/universal_zids/new');
        expect(successFn).toHaveBeenCalled();
      });

      it('should call error callback on timeout', function () {
        var successFn = jasmine.createSpy('onSuccess');
        var errorFn   = jasmine.createSpy('onTimeout');
        testIdentity.fetch(successFn, errorFn, 'identity.primedia.com', 80, 0);
        var request   = jasmine.Ajax.requests.mostRecent();
        request.responseTimeout();
        expect(errorFn).toHaveBeenCalled();
      });
    });

    describe('when the UZid already exists', function () {
      var value;

      beforeEach(function () {
        value = 'acrunchycookie';
        Cookies.set('uzid', value);
      });

      it('does not perform external request for UZid', function () {
        testIdentity.fetch(() => {}, () => {}, 'identity.primedia.com', 80);
        expect(jasmine.Ajax.requests.count()).toEqual(0);
      });

      it('returns the uzid value from cookie', function () {
        var successFn = function () {
          expect(this.universal_zid.uuid).toBe(value); };
        testIdentity.fetch(successFn, fn, 'testidentity.rentpath.com', 8080);
      });
    });
  })

  describe('#link', function () {
    it('should attempt the correct API call', function () {
      var fn = jasmine.any(Function);
      spyOn(testIdentity, '_request');
      testIdentity.link(fn, fn, 'zidUuid', 'hostname.com', 8080);
      expect(testIdentity._request).toHaveBeenCalledWith(fn, fn, 'zidUuid', 'hostname.com', 8080, 'zid_link');
    });
  });

  describe('#push', function () {
    it('should call the supplied function', function () {
      var params = ['fetch', 'foo'];
      spyOn(testIdentity, 'fetch')
      testIdentity.push(params);
      expect(testIdentity.fetch).toHaveBeenCalledWith('foo');
    });
  });

  describe('#track', function () {
    beforeEach(function () {
      jasmine.Ajax.install();
      jasmine.clock().install();
    });

    afterEach(function () {
      jasmine.Ajax.uninstall();
      jasmine.clock().uninstall();
    });

    describe('logs an access request', function () {
      it('should call onLoad callback on success', function () {
        var cookieValue = 'something';
        Identity.cookify(cookieValue);

        jasmine.Ajax.stubRequest(
            /.*\/universal_zids\/something\/access/
          ).andReturn({
            status: 201,
            statusText: 'Created',
            contentType: 'application/json',
            responseText: '{}'
          });

        testIdentity.track(() => {}, () => {}, 'testidentity.rentpath.com', 8080);
        var request = jasmine.Ajax.requests.mostRecent();
        expect(request.method).toBe('POST');
        expect(request.url).toContain('/universal_zids/something/access_log');
      });
    });
  });

  describe('#uzid', function () {
    it('should return the cookie', function () {
      var value = { "whatever": 123 };
      Cookies.set('uzid', value);
      expect(testIdentity.uzid().whatever).toBe(123);
    });
  });

  describe('#unlink', function () {
    it('should attempt the correct API call', function () {
      var fn = jasmine.any(Function);
      spyOn(testIdentity, '_request');
      testIdentity.unlink(fn, fn, 'zidUuid', 'hostname.com', 8080);
      expect(testIdentity._request).toHaveBeenCalledWith(fn, fn, 'zidUuid', 'hostname.com', 8080, 'zid_decouple');
    });
  });
});
