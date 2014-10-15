(function() {
  describe('Counter', function() {
    var counter, element, options;
    element = counter = options = null;
    beforeEach(function() {
      options = {
        duration: 5,
        prefix: '£',
        suffix: ' Only',
        decimals: 2
      };
      element = document.createElement('div');
      return counter = new Counter(element, 0, 5000, options);
    });
    describe('parsing and extending options', function() {
      it('should extend an object overriding only null properties', function() {
        options = counter.extend({}, {
          duration: 10
        }, {
          duration: 5
        });
        return expect(options).toEqual({
          duration: 10
        });
      });
      it('should parse data attribute true alias values as boolean true', function() {
        expect(counter.parseDataAttribute('on')).toEqual(true);
        expect(counter.parseDataAttribute('yes')).toEqual(true);
        expect(counter.parseDataAttribute('true')).toEqual(true);
        return expect(counter.parseDataAttribute('1')).toEqual(true);
      });
      return it('should parse data attribute false alias values as boolean false', function() {
        expect(counter.parseDataAttribute('off')).toEqual(false);
        expect(counter.parseDataAttribute('no')).toEqual(false);
        expect(counter.parseDataAttribute('false')).toEqual(false);
        return expect(counter.parseDataAttribute('0')).toEqual(false);
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
        return expect(counter.formatNumber(1000000)).toEqual('£1,000,000.00 Only');
      });
      it('should format negative numbers', function() {
        return expect(counter.formatNumber(-1000000)).toEqual('£-1,000,000.00 Only');
      });
      return it('should format numbers with decimals', function() {
        return expect(counter.formatNumber(1000000.000)).toEqual('£1,000,000.00 Only');
      });
    });
  });

}).call(this);
