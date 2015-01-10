(function() {
  function isFunc (object) {
    return typeof object === 'function';
  }

  beforeEach(function() {
    jasmine.addMatchers({
      toBeADeferred: function(util, testers) {
        return {
          compare: function (actual, expected) {
            var res = {};
            res.pass = (
              isFunc(actual.state) &&
              isFunc(actual.always) &&
              isFunc(actual.then) &&
              isFunc(actual.promise) &&
              isFunc(actual.pipe) &&
              isFunc(actual.done) &&
              isFunc(actual.fail) &&
              isFunc(actual.progress)
            );
            if (res.pass) {
              res.message = 'Expected to not be a deferred.';
            } else {
              res.message = 'Expected to be a deferred.';
            }
            return res;
          }
        };
      },
      toBeResolved: function(util, testers)  {
        return {
          compare: function (actual, expected) {
            var res = {};
            res.pass = actual.state() === 'resolved';
            if (res.pass) {
              res.message = 'Expected to not be resolved.';
            } else {
              res.message = 'Expected to be resolved.';
            }
            return res;
          }
        };
      },
      toBePending: function(util, testers)  {
        return {
          compare: function (actual, expected) {
            var res = {};
            res.pass = actual.state() === 'pending';
            if (res.pass) {
              res.message = 'Expected to not be pending.';
            } else {
              res.message = 'Expected to be pending.';
            }
            return res;
          }
        };
      }
    });
  });
})();
