(function() {
  describe('Counter', function() {
    var counter, element;
    element = counter = null;
    beforeEach(function() {
      element = document.createElement('div');
      element.setAttribute('data-duration', 10);
      element.setAttribute('data-separator', ':');
      return counter = new Counter(element, 0, 5000, {
        duration: 5,
        prefix: '£',
        suffix: ' Only',
        decimals: 2
      });
    });
    it('should setup options using constructor, data attributes and default values', function() {
      return expect(counter.options).toEqual({
        autostart: false,
        decimal: ".",
        decimals: 2,
        duration: 5,
        easing: true,
        grouping: true,
        prefix: "£",
        separator: ":",
        suffix: " Only"
      });
    });
    describe('when the counter is started', function() {
      beforeEach(function() {
        return counter.start();
      });
      return it('should be running when started', function() {
        return expect(counter.isRunning).toEqual(true);
      });
    });
    describe('when the counter has been stopped', function() {
      beforeEach(function() {
        return counter.stop();
      });
      it('should not be running when stopped', function() {
        return expect(counter.isRunning).toBeFalsy();
      });
      return it('should be possible to resume', function() {
        counter.resume();
        return expect(counter.isRunning).toBeTruthy();
      });
    });
    return describe('formatting numbers', function() {
      it('should format postive numbers', function() {
        return expect(counter.formatNumber(1000000)).toEqual('£1:000:000.00 Only');
      });
      it('should format negative numbers', function() {
        return expect(counter.formatNumber(-1000000)).toEqual('£-1:000:000.00 Only');
      });
      return it('should format numbers with decimals', function() {
        return expect(counter.formatNumber(1000000.000)).toEqual('£1:000:000.00 Only');
      });
    });
  });

}).call(this);
