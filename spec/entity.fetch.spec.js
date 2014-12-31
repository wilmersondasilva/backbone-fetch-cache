describe('Model.fetch', function () {
  var Model;

  Model = Backbone.Model.extend({
    url: '/model/fetch'
  });

  describe('with Backbone.fetchCache.enabled:false', function () {
    var values = null;

    beforeEach(function (done) {
      var model, requests;

      // This is the flag we're testing:
      Backbone.fetchCache.enabled = false;

      // Initialize a new model:
      model = new Model({
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
      expect(first.codename).not.toEqual(second.codename);
    });
  });
});
