describe('Backbone.fetchCache.getCacheKey', function () {

  describe('with string argument', function () {
    var input = 'foo',
        rv;

    beforeEach(function () {
      rv = Backbone.fetchCache.getCacheKey(input);
    });

    it('returns the string', function () {
      expect(rv).toEqual(input);
    });
  });

  describe('with string argument and options hash', function () {
    var input = 'foo',
        data = { id: '007' },
        rv;

    beforeEach(function () {
      rv = Backbone.fetchCache.getCacheKey(input, { data: data });
    });

    it('returns with query string', function () {
      expect(rv).toEqual(input + '?id=007');
    });
  });

  describe('with string argument and options string', function () {
    var input = 'foo',
        data = 'id=007',
        rv;

    beforeEach(function () {
      rv = Backbone.fetchCache.getCacheKey(input, { data: data });
    });

    it('returns with query string', function () {
      expect(rv).toEqual(input + '?id=007');
    });
  });

  describe('with function argument', function () {
    var key = 'foo',
        data = 'id=007',
        rv;

    beforeEach(function () {
      var input = jasmine.createSpy('createKey').and.callFake(function (opts) {
            return key +'?'+ opts.data;
          });
      rv = Backbone.fetchCache.getCacheKey(input, { data: data });
    });

    it('returns the function return value', function () {
      expect(rv).toEqual(key +'?id=007');
    });
  });

  describe('with Object argument with url property', function() {
    var key = 'foobarbaz007',
        rv;

    beforeEach(function () {
      var entity = {
        url: key
      };
      rv = Backbone.fetchCache.getCacheKey(entity);
    });

    it('returns the url string', function () {
      expect(rv).toEqual(key);
    });
  });

  describe('with Object argument with url method', function() {
    var key = 'foobarbaz007',
        rv;

    beforeEach(function () {
      var entity = {
        url: function () { return key; }
      };
      rv = Backbone.fetchCache.getCacheKey(entity);
    });

    it('returns the function return value', function () {
      expect(rv).toEqual(key);
    });
  });

  describe('with Object argument and getCacheKey method', function () {
    var key = 'foobarbaz007',
        rv;

    beforeEach(function () {
      var entity = {
        getCacheKey: function () { return key; }
      };
      rv = Backbone.fetchCache.getCacheKey(entity);
    });

    it('returns the function return value', function () {
      expect(rv).toEqual(key);
    });
  });

  describe('with Object argument but url passed in with options', function () {
    var key = 'foobarbaz008',
        rv;

    beforeEach(function () {
      var entity = {};
      rv = Backbone.fetchCache.getCacheKey(entity, {
        url: key
      });
    });

    it('uses the url on the Options Object', function () {
      expect(rv).toEqual(key);
    });
  });
});
