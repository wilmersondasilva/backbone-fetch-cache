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
      fetch(entity, requests, results, callback);
    });
    entity.fetch(req.options);
    server.respond();
  }

  function snapshotAttributes(entity) {
    if (entity.models) {
      return snapshotAttributes(entity.first());
    }
    return _.clone(entity.attributes);
  }

  return UTILS;
}());