var UTILS = (function () {
  var UTILS = {};

  UTILS.fetch = function (args, callback) {
    var entity = args.entity,
        responses = args.responses;

    if (!_.isArray(responses) || !responses.length) {
      throw new Error('Missing test server responses.');
    }

    return fetch(entity, responses, [], callback);
  };

  function fetch(entity, responses, results, callback) {
    if (!responses.length) {
      callback(results);
    }

    var server = sinon.fakeServer.create(),
        response = responses.shift(),
        url = _.result(entity, 'url'),
        result = {};

    if (!url) {
      throw new Error('Missing Entity URL');
    }

    server.respondWith('GET', url, [
      200,
      { 'Content-Type': 'application/json' },
      JSON.stringify(response)
    ]);

    result.initial = snapshotAttributes(entity);
    entity.once('sync', function () {
      server.restore();
      result.synced = snapshotAttributes(entity);
      results.push(result);
      fetch(entity, responses, results, callback);
    });
    entity.fetch();
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