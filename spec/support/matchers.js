(function() {
  function isFunc (object) {
    return typeof object === 'function';
  }

  beforeEach(function() {
    this.addMatchers({
      toBeAPromise: function(expected) {
        return (
          isFunc(this.actual.state) &&
          isFunc(this.actual.always) &&
          isFunc(this.actual.then) &&
          isFunc(this.actual.promise) &&
          isFunc(this.actual.pipe) &&
          isFunc(this.actual.done) &&
          isFunc(this.actual.fail) &&
          isFunc(this.actual.progress) &&
          !this.actual.hasOwnProperty('notify') && 
          !this.actual.hasOwnProperty('notifyWith') &&
          !this.actual.hasOwnProperty('reject') &&
          !this.actual.hasOwnProperty('rejectWith') &&
          !this.actual.hasOwnProperty('resolve') &&
          !this.actual.hasOwnProperty('resolveWith')
        );
      },
      toBeResolved: function(expected)  {
        return this.actual.state() === 'resolved';
      },
      toBeUnresolved: function(expected)  {
        return this.actual.state() === 'pending';
      }
    });
  });
})();
