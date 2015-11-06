var zutron  = require('../src/zutron.js');
var Cookies = require('js-cookie');

describe('UniversalZid', () => {
  var testUniversalZid;
  var fn;

  beforeEach(function () {
    testUniversalZid = UniversalZid;
    Cookies.remove('uzid');
    fn = jasmine.any(Function);
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
        testUniversalZid.fetch(successFn, fn, 'hailzutron.primedia.com', 8080);
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
    });

    describe('when the UZid already exists', function () {
      var value;

      beforeEach(function () {
        value = { uuid: 'acrunchycookie' };
        Cookies.set('uzid', value);
      });

      it('does not perform external request for UZid', function () {
        testUniversalZid.fetch(() => {}, () => {}, 'zutron.primedia.com', 80);
        expect(jasmine.Ajax.requests.count()).toEqual(0);
      });

      it('returns the uzid value from cookie', function () {
        var successFn = function () {
          expect(this.universal_zid.uuid).toBe(value.uuid); };
        testUniversalZid.fetch(successFn, fn, 'hailzutron.primedia.com', 8080);
      });
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
      testUniversalZid.link(fn, fn, 'zidUuid', 'hostname.com', 8080);
      expect(testUniversalZid._request).toHaveBeenCalledWith(fn, fn, 'zidUuid', 'hostname.com', 8080, 'zid_link');
    });
  });

  describe('#unlink', function () {
    it('should attempt the correct API call', function () {
      var fn = jasmine.any(Function);
      spyOn(testUniversalZid, '_request');
      testUniversalZid.unlink(fn, fn, 'zidUuid', 'hostname.com', 8080);
      expect(testUniversalZid._request).toHaveBeenCalledWith(fn, fn, 'zidUuid', 'hostname.com', 8080, 'zid_decouple');
    });
  });
});
