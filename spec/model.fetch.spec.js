describe('Model.fetch', function () {
  var Model;

  Model = Backbone.Model.extend({
    urlRoot: '/fetch/cache/'
  });

  beforeEach(function () {
    // Disable localStorage for these tests.
    localStorage.setItem(Backbone.fetchCache.getLocalStorageKey(), '{}');
    Backbone.fetchCache.localStorage = false;
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

    it('returns a resolved deferred', function () {
      var rv_1 = values[0].returns,
          rv_2 = values[1].returns;
      expect(rv_1).toBeADeferred();
      expect(rv_1).toBeResolved();
      expect(rv_2).toBeADeferred();
      expect(rv_2).toBeResolved();
    });

    it('fires request event', function () {
      var events_1 = values[0].events,
          events_2 = values[1].events;

      expect(events_1.request).toBeDefined();
      expect(events_2.request).toBeDefined();
    });

    it('fires sync event', function () {
      var events_1 = values[0].events,
          events_2 = values[1].events;

      expect(events_1.sync).toBeDefined();
      expect(events_2.sync).toBeDefined();
    });

    it('does not fire cachesync event', function () {
      var events_1 = values[0].events,
          events_2 = values[1].events;

      expect(events_1.cachesync).toBeUndefined();
      expect(events_2.cachesync).toBeUndefined();
    });

    it('uses new values from server', function () {
      var first = values[0].synced,
          second = values[1].synced;
      expect(first.codename).toEqual('006');
      expect(second.codename).toEqual('007');
    });
  });

  describe('with cache:false on subsequent requests', function () {
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

    it('returns a resolved deferred', function () {
      var rv_1 = values[0].returns,
          rv_2 = values[1].returns;
      expect(rv_1).toBeADeferred();
      expect(rv_1).toBeResolved();
      expect(rv_2).toBeADeferred();
      expect(rv_2).toBeResolved();
    });

    it('fires request event', function () {
      var events_1 = values[0].events,
          events_2 = values[1].events;

      expect(events_1.request).toBeDefined();
      expect(events_2.request).toBeDefined();
    });

    it('fires sync event', function () {
      var events_1 = values[0].events,
          events_2 = values[1].events;

      expect(events_1.sync).toBeDefined();
      expect(events_2.sync).toBeDefined();
    });

    it('does not fire cachesync event', function () {
      var events_1 = values[0].events,
          events_2 = values[1].events;

      expect(events_1.cachesync).toBeUndefined();
      expect(events_2.cachesync).toBeUndefined();
    });

    it('does not use cached values', function () {
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

    it('returns a resolved deferred', function () {
      var rv_1 = values[0].returns,
          rv_2 = values[1].returns;
      expect(rv_1).toBeADeferred();
      expect(rv_1).toBeResolved();
      expect(rv_2).toBeADeferred();
      expect(rv_2).toBeResolved();
    });

    it('fires request event', function () {
      var events_1 = values[0].events,
          events_2 = values[1].events;

      expect(events_1.request).toBeDefined();
      expect(events_2.request).toBeDefined();
    });

    it('fires sync event', function () {
      var events_1 = values[0].events,
          events_2 = values[1].events;

      expect(events_1.sync).toBeDefined();
      expect(events_2.sync).toBeDefined();
    });

    it('does not fire cachesync event', function () {
      var events_1 = values[0].events,
          events_2 = values[1].events;

      expect(events_1.cachesync).toBeUndefined();
      expect(events_2.cachesync).toBeUndefined();
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

    it('returns a resolved deferred', function () {
      var rv_1 = values[0].returns,
          rv_2 = values[1].returns;
      expect(rv_1).toBeADeferred();
      expect(rv_1).toBeResolved();
      expect(rv_2).toBeADeferred();
      expect(rv_2).toBeResolved();
    });

    it('fires request event', function () {
      var events_1 = values[0].events,
          events_2 = values[1].events;

      expect(events_1.request).toBeDefined();
      expect(events_2.request).toBeDefined();
    });

    it('fires sync event', function () {
      var events_1 = values[0].events,
          events_2 = values[1].events;

      expect(events_1.sync).toBeDefined();
      expect(events_2.sync).toBeDefined();
    });

    it('does not fire cachesync event', function () {
      var events_1 = values[0].events,
          events_2 = values[1].events;

      expect(events_1.cachesync).toBeUndefined();
      expect(events_2.cachesync).toBeUndefined();
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
      var id, model, requests;
      id = _.uniqueId();

      // Initialize a new model:
      model = new Model({
        id: id,
        codename: '005'
      });

      requests = [
        { response: { id: id, codename: '006' }, options: { cache: true } },
        { response: { id: id, codename: '007' }, options: { cache: true } }
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

    it('returns a resolved deferred', function () {
      var rv_1 = values[0].returns,
          rv_2 = values[1].returns;
      expect(rv_1).toBeADeferred();
      expect(rv_1).toBeResolved();
      expect(rv_2).toBeADeferred();
      expect(rv_2).toBeResolved();
    });

    it('fires request event on first fetch', function () {
      var events_1 = values[0].events;
      expect(events_1.request).toBeDefined();
    });

    it('does not fire request event on second fetch', function () {
      var events_2 = values[1].events;
      expect(events_2.request).toBeUndefined();
    });

    it('fires sync event', function () {
      var events_1 = values[0].events,
          events_2 = values[1].events;

      expect(events_1.sync).toBeDefined();
      expect(events_2.sync).toBeDefined();
    });

    it('does not fire cachesync event on first request', function () {
      var events_1 = values[0].events;
      expect(events_1.cachesync).toBeUndefined();
    });

    it('fires cachesync event on second request', function () {
      var events_2 = values[1].events;
      expect(events_2.cachesync).toBeDefined();
    });

    it('uses cached value', function () {
      var first = values[0].synced,
          second = values[1].synced;
      expect(first.codename).toEqual('006');
      expect(second.codename).toEqual('006');
    });
  });
});
