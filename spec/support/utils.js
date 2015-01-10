var UTILS = (function () {
  var UTILS = {};

  UTILS.fetch = function (args, callback) {
    var entity = args.entity,
        requests = args.requests;

    if (!_.isArray(requests) || !requests.length) {
      throw new Error('Missing test requests.');
    }

    return fetch(entity, requests.slice(), [], callback);
  };

  function fetch(entity, requests, results, callback) {
    if (!requests.length) {
      return callback(results);
    }

    var server = sinon.fakeServer.create(),
        req = requests.shift(),
        url = _.result(entity, 'url'),
        key = Backbone.fetchCache.getCacheKey(entity, req.options)
        result = {};

    if (!url) {
      throw new Error('Missing Entity URL');
    }

    if (!req) {
      throw new Error('Got an undefined request object.');
    }

    server.respondWith('GET', url, [
      200,
      { 'Content-Type': 'application/json' },
      JSON.stringify(req.response)
    ]);

    result.initial = snapshotAttributes(entity);
    entity.once('sync', function () {
      server.restore();
      result.synced = snapshotAttributes(entity);
      results.push(result);
      // Have to do next fetch in next turn of the event loop to give the
      // deferred a chance to resolve.
      window.setTimeout(function () {
        fetch(entity, requests, results, callback);
      }, 10);
    });

    // Need to fetch in next turn of event loop to allow cache to set.
    window.setTimeout(function () {
      if (req.options && req.options.explain) {
        console.log('key:', key);
        console.log('options', JSON.stringify(req.options));
        console.log('response', JSON.stringify(req.response));
        console.log('cache:', JSON.stringify(Backbone.fetchCache._cache[key], null, 2));
      }

      result.returns = entity.fetch(req.options);

      // Short delay for more realism.
      window.setTimeout(function () {
        server.respond();
      }, 60);
    }, 10);
  }

  function snapshotAttributes(entity) {
    if (entity.models) {
      return snapshotAttributes(entity.first());
    }
    return _.clone(entity.attributes);
  }

  return UTILS;
}());