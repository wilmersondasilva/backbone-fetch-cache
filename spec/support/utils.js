var UTILS = (function () {
  var UTILS = {};

  UTILS.fetch = function (args, callback) {
    var entity = args.entity,
        requests = args.requests,
        counter = createCounter;

    if (!_.isArray(requests) || !requests.length) {
      throw new Error('Missing test requests.');
    }

    return fetch(entity, requests.slice(), counter, [], callback);
  };

  function fetch(entity, requests, counter, results, callback) {
    if (!requests.length) {
      return callback(results);
    }

    var server = sinon.fakeServer.create(),
        req = requests.shift(),
        url = _.result(entity, 'url'),
        key = Backbone.fetchCache.getCacheKey(entity, req.options)
        deferred = null,
        result = { events: {} };

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
    entity.once('request', function () {
      result.events.request = counter();
    });
    entity.once('sync', function () {
      result.events.sync = counter();
      server.restore();
      result.synced = snapshotAttributes(entity);
      results.push(result);
    });
    entity.once('cachesync', function () {
      result.events.cachesync = counter();
    })

    // Need to fetch in next turn of event loop to allow cache to set.
    window.setTimeout(function () {
      if (req.options && req.options.explain) {
        console.log('key:', key);
        console.log('options', JSON.stringify(req.options));
        console.log('response', JSON.stringify(req.response));
        console.log('cache:', JSON.stringify(Backbone.fetchCache._cache[key], null, 2));
      }

      result.returns = deferred = entity.fetch(req.options);
      deferred.done(function () {
        fetch(entity, requests, counter, results, callback);
      });

      server.respond();
    }, 10);
  }

  function snapshotAttributes(entity) {
    if (entity.models) {
      return snapshotAttributes(entity.first());
    }
    return _.clone(entity.attributes);
  }

  function createCounter() {
    var count = 0;
    return function () {
      var rv = count;
      count += 1;
      return rv;
    };
  }

  return UTILS;
}());