require('../src/zutron.js');

describe('UniversalZid', () => {
  var testUniversalZid;
  beforeEach(function () {
    testUniversalZid = UniversalZid;
  });

  it('object should exist', function () {
    expect(testUniversalZid).toBeDefined();
  });

  describe('#push', function () {
    it('should call the supplied function', function () {
      var params = ['fetch', 'foo'];
      spyOn(testUniversalZid, 'fetch')
      testUniversalZid.push(params);
      expect(testUniversalZid.fetch).toHaveBeenCalledWith('foo');
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
        })
      var successFn = jasmine.createSpy('onLoad');

      testUniversalZid.fetch(successFn, 'http://localhost', 3000);
      var request = jasmine.Ajax.requests.mostRecent();

      expect(request.method).toBe('GET');
      expect(request.url).toBe('http://localhost:3000/universal_zids/new');
      expect(successFn).toHaveBeenCalled();
    });

    it('should call error callback on timeout', function () {
      var successFn  = jasmine.createSpy('onLoad');
      var errorFn = jasmine.createSpy('onTimeout');

      testUniversalZid.fetch(successFn, errorFn, 'http://localhost', 3000);
      var request = jasmine.Ajax.requests.mostRecent();
      request.responseTimeout();

      expect(errorFn).toHaveBeenCalled();
    });
  })
});
