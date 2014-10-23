# Counter 
[![Build Status](https://travis-ci.org/KyleNeedham/countUp.svg?branch=master)](https://travis-ci.org/KyleNeedham/countUp)
[![devDependency Status](https://david-dm.org/KyleNeedham/countUp/dev-status.svg)](https://david-dm.org/KyleNeedham/countUp#info=devDependencies)

Counter is a Lightweight dependency free module based on **[inorganik/countUp.js](https://github.com/inorganik/countUp.js)**, written in coffeescript and made AMD compatible.

---

Counter parameters `target, startVal, endVal, options` 

**Available options:**
```
autostart: false
easing: true
grouping: true
separator: ','
decimal: '.'
prefix: ''
suffix: ''
decimals: 0
duration: 2
```

Basic Use
=========

### Passing values to the constructor:

By default counting will not start until `.start()` is called
```
counter = new Counter('#counter', 5000, 50000);
counter.start();
```
however you can pass `autostart: true` in the options object to start on initialization
```
counter = new Counter('#counter', 5000, 5000, {
  autostart: true
});
```

### Using data-* attributes:

All available options can be passed using data attributes
```
<span
  id="counter"
  data-autostart="true"
  data-easing="true"
  data-grouping="true"
  data-separator=","
  data-decimal="."
  data-prefix=""
  data-suffix=""
  data-decimals="0"
  data-duration="2"
>
</span>
```

Then construct the same way you would normally
```
counter = new Counter('#counter', 5000, 50000);
```
