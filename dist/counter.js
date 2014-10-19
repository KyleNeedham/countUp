(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
      return define(factory);
    } else {
      return root.Counter = factory(root);
    }
  })(this, function(root) {
    var Counter;
    return Counter = (function() {
      Counter.VERSION = '0.1.1';

      Counter.DEFAULTS = {
        autostart: false,
        easing: true,
        grouping: true,
        separator: ',',
        decimal: '.',
        prefix: '',
        suffix: '',
        decimals: 0,
        duration: 2
      };


      /**
       * Counter
       * 
       * @class
       * @param {number} target element selector or var of previously selected html element where counting occurs
       * @param {number} startVal The value you want to begin at
       * @param {number} endVal The value you want to arrive at
       * @param {object} [options] Optional object of options (see below)
       *
       */

      function Counter(target, startVal, endVal, options) {
        if (options == null) {
          options = {};
        }
        this.count = __bind(this.count, this);
        this.polyFill();
        this.element = typeof target === 'string' ? document.querySelector(target) : target;
        this.options = this.extend(options, this.getAttributes(), Counter.DEFAULTS);
        this.startVal = this._startVal = +startVal;
        this.endVal = this._endVal = +endVal;
        this.countDown = this.startVal > this.endVal ? true : false;
        this.startTime = null;
        this.timestamp = null;
        this.remaining = null;
        this.rAF = null;
        this.frameVal = this.startVal;
        this.decimals = Math.max(0, this.options.decimals);
        this.dec = Math.pow(10, this.decimals);
        this.duration = this.options.duration * 1000;
        this.isRunning = false;
        if (this.options.separator === '') {
          this.options.grouping = false;
        }
        if (this.options.autostart) {
          this.start();
        } else {
          this.printValue(this.startVal);
        }
      }


      /**
       * Make sure requestAnimationFrame and cancelAnimationFrame are defined
       * polyfill for browsers without native support
       * by Opera engineer Erik Möller
       * 
       * @method polyFill
       *
       */

      Counter.prototype.polyFill = function() {
        var lastTime, vendors, x;
        x = 0;
        lastTime = 0;
        vendors = ['webkit', 'moz', 'ms', 'o'];
        while (x < vendors.length && !root.requestAnimationFrame) {
          root.requestAnimationFrame = root["" + vendors[x] + "RequestAnimationFrame"];
          root.cancelAnimationFrame = root["" + vendors[x] + "CancelAnimationFrame"] || root["" + vendors[x] + "CancelRequestAnimationFrame"];
          x++;
        }
        if (!root.requestAnimationFrame) {
          root.requestAnimationFrame = function(callback, element) {
            var currTime, id, timeToCall;
            currTime = new Date().getTime();
            timeToCall = Math.max(0, 16 - (currTime - lastTime));
            id = root.setTimeout(function() {
              return callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
          };
        }
        if (!root.cancelAnimationFrame) {
          return root.cancelAnimationFrame = function(id) {
            return clearTimeout(id);
          };
        }
      };


      /**
       * 
       * @method extend
       * @param {object} obj
       *
       */

      Counter.prototype.extend = function(obj) {
        var i, key, source, value;
        i = 1;
        while (i < arguments.length) {
          source = arguments[i];
          for (key in source) {
            value = source[key];
            if (obj[key] == null) {
              obj[key] = value;
            }
          }
          i++;
        }
        return obj;
      };


      /**
       * Parse data attribute
       * 
       * @method parseDataAttribute
       * @param {string} attribute
       *
       */

      Counter.prototype.parseDataAttribute = function(attribute) {
        if (attribute === 'on' || attribute === 'yes' || attribute === 'true' || attribute === '1') {
          attribute = true;
        }
        if (attribute === 'off' || attribute === 'no' || attribute === 'false' || attribute === '0') {
          attribute = false;
        }
        return attribute;
      };


      /**
       * Get element data attribute
       * 
       * @method getDataAttribute
       * @param {string} attribute
       * @param {object} element
       * @return {(string|number)}
       *
       */

      Counter.prototype.getDataAttribute = function(attribute, element) {
        if (element == null) {
          element = this.element;
        }
        return this.parseDataAttribute(element.getAttribute("data-" + attribute));
      };


      /**
       * Get options from `data-*` attributes
       * 
       * @method getAttributes
       * @return {object}
       *
       */

      Counter.prototype.getAttributes = function() {
        return {
          autostart: this.getDataAttribute('autostart'),
          easing: this.getDataAttribute('easing'),
          grouping: this.getDataAttribute('grouping'),
          separator: this.getDataAttribute('separator'),
          decimal: this.getDataAttribute('decimal'),
          decimals: this.getDataAttribute('decimals'),
          duration: this.getDataAttribute('duration'),
          prefix: this.getDataAttribute('prefix'),
          suffix: this.getDataAttribute('suffix')
        };
      };


      /**
       * Print value to the target element
       * 
       * @method printValue
       * @param {number} value
       * @return {string} The figure that was printed
       *
       */

      Counter.prototype.printValue = function(value) {
        var result;
        result = !isNaN(value) ? this.formatNumber(value) : '--';
        if (this.element.tagName === 'INPUT') {
          this.element.value = result;
        } else {
          this.element.innerHTML = result;
        }
        return result;
      };


      /**
       * 
       * @method easeOutExpo
       * @param {number} t
       * @param {number} b
       * @param {number} c
       * @param {number} d
       * @return {number}
       *
       */

      Counter.prototype.easeOutExpo = function(t, b, c, d) {
        return c * (-(Math.pow(2, -10 * t / d)) + 1) * 1024 / 1023 + b;
      };


      /**
       * 
       * @method count
       * @param {number} timestamp
       * @return
       *
       */

      Counter.prototype.count = function(timestamp) {
        var progress;
        if (this.startTime === null) {
          this.startTime = timestamp;
        }
        this.timestamp = timestamp;
        progress = timestamp - this.startTime;
        this.remaining = this.duration - progress;
        if (this.options.easing) {
          if (this.countDown) {
            this.frameVal = this.startVal - this.easeOutExpo(progress, 0, this.startVal - this.endVal, this.duration);
          } else {
            this.frameVal = this.easeOutExpo(progress, this.startVal, this.endVal - this.startVal, this.duration);
          }
        } else {
          if (this.countDown) {
            this.frameVal = this.startVal - (this.startVal - this.endVal) * (progress / this.duration);
          } else {
            this.frameVal = this.startVal + (this.endVal - this.startVal) * (progress / this.duration);
          }
        }
        if (this.countDown) {
          this.frameVal = this.frameVal < this.endVal ? this.endVal : this.frameVal;
        } else {
          this.frameVal = this.frameVal > this.endVal ? this.endVal : this.frameVal;
        }
        this.frameVal = Math.round(this.frameVal * this.dec) / this.dec;
        this.printValue(this.frameVal);
        if (progress < this.duration) {
          return this.rAF = requestAnimationFrame(this.count);
        } else {
          this.isRunning = false;
          if (this.callback != null) {
            return this.callback();
          }
        }
      };


      /**
       * 
       * @method start
       * @param {function} callback
       * @return {object}
       *
       */

      Counter.prototype.start = function(callback) {
        this.callback = callback;
        if (!isNaN(this.endVal) && !isNaN(this.startVal)) {
          this.isRunning = true;
          this.rAF = requestAnimationFrame(this.count);
        } else {
          console.error('Counter error: startVal or endVal is not a number');
          this.printValue();
        }
        return this;
      };


      /**
       * 
       * @method stop
       * @return {object}
       *
       */

      Counter.prototype.stop = function() {
        cancelAnimationFrame(this.rAF);
        this.isRunning = false;
        return this;
      };


      /**
       * 
       * @method reset
       * @return {object}
       *
       */

      Counter.prototype.reset = function() {
        this.startTime = null;
        this.startVal = this._startVal;
        this.isRunning = false;
        cancelAnimationFrame(this.rAF);
        this.printValue(this.startVal);
        return this;
      };


      /**
       * 
       * @method resume
       * @return {object}
       *
       */

      Counter.prototype.resume = function() {
        this.stop();
        this.startTime = null;
        this.duration = this.remaining;
        this.startVal = this.frameVal;
        this.isRunning = true;
        requestAnimationFrame(this.count);
        return this;
      };


      /**
       * 
       * @method resume
       * @return {string} formatted number
       *
       */

      Counter.prototype.formatNumber = function(numberString) {
        var rgx, x, x1, x2;
        numberString = "" + (numberString.toFixed(this.decimals));
        x = numberString.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? this.options.decimal + x[1] : '';
        rgx = /(\d+)(\d{3})/;
        if (this.options.grouping) {
          while (rgx.test(x1)) {
            x1 = x1.replace(rgx, "$1" + this.options.separator + "$2");
          }
        }
        return "" + this.options.prefix + x1 + x2 + this.options.suffix;
      };

      return Counter;

    })();
  });

}).call(this);
