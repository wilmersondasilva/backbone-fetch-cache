describe('Model.fetch', function () {
  var Model;

  Model = Backbone.Model.extend({
    urlRoot: '/fetch/cache/'
  });

  describe('with Backbone.fetchCache.enabled:false', function () {
    var values, url;
    values = null;

    beforeEach(function (done) {
      var model, requests;

      // This is the flag we're testing:
      Backbone.fetchCache.enabled = false;

      // Initialize a new model:
      model = new Model({
        id: _.uniqueId(),
        codename: '005'
      });

      requests = [
        { response: { codename: '006' } },
        { response: { codename: '007' } }
      ];

      // Set the response when done.
      function onresponse(res) {
        values = res;
        return done();
      }

      // Mock the actual fetches:
      UTILS.fetch({
        entity: model,
        requests: requests
      }, onresponse);
    });

    afterEach(function () {
      Backbone.fetchCache.enabled = true;
    });

    it('uses new values from server', function () {
      var first = values[0].synced,
          second = values[1].synced;
      expect(first.codename).toEqual('006');
      expect(second.codename).toEqual('007');
    });
  });

  describe('with cache:true on second request only', function () {
    var values = null;

    beforeEach(function (done) {
      var model, requests;

      // Initialize a new model:
      model = new Model({
        id: _.uniqueId(),
        codename: '005'
      });

      requests = [
        { response: { codename: '006' } },
        { response: { codename: '007' }, options: { cache: true } }
      ];

      // Set the response when done.
      function onresponse(res) {
        values = res;
        return done();
      }

      // Mock the actual fetches:
      UTILS.fetch({
        entity: model,
        requests: requests
      }, onresponse);
    });

    it('has no cached value', function () {
      var first = values[0].synced,
          second = values[1].synced;
      expect(first.codename).toEqual('006');
      expect(second.codename).toEqual('007');
    });
  });

  describe('with cache:true on first request only', function () {
    var values = null;

    beforeEach(function (done) {
      var model, requests;

      // Initialize a new model:
      model = new Model({
        id: _.uniqueId(),
        codename: '005'
      });

      requests = [
        { response: { codename: '006' }, options: { cache: true } },
        { response: { codename: '007' } }
      ];

      // Set the response when done.
      function onresponse(res) {
        values = res;
        return done();
      }

      // Mock the actual fetches:
      UTILS.fetch({
        entity: model,
        requests: requests
      }, onresponse);
    });

    it('uses new values from server', function () {
      var first = values[0].synced,
          second = values[1].synced;
      expect(first.codename).toEqual('006');
      expect(second.codename).toEqual('007');
    });
  });

  describe('with cache:true on subsequent requests', function () {
    var values = null;

    beforeEach(function (done) {
      var model, requests;

      // Initialize a new model:
      model = new Model({
        id: _.uniqueId(),
        codename: '005'
      });

      requests = [
        { response: { codename: '006' }, options: { cache: true } },
        { response: { codename: '007' }, options: { cache: true } }
      ];

      // Set the response when done.
      function onresponse(res) {
        values = res;
        return done();
      }

      // Mock the actual fetches:
      UTILS.fetch({
        entity: model,
        requests: requests
      }, onresponse);
    });

    it('uses new values from server', function () {
      var first = values[0].synced,
          second = values[1].synced;
      expect(first.codename).toEqual('006');
      expect(second.codename).toEqual('006');
    });
  });
});
