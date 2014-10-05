Counter
======

Counter is a Lightweight dependency free module based on **[inorganik/countUp.js](https://github.com/inorganik/countUp.js)**, written in coffeescript and made AMD compatitable.

---

Counter parametres `target, startVal, endVal, decimals, duration, options` 

**Avaliable options:**
```
useEasing: true
useGrouping: true
separator: ','
decimal: '.'
prefix: ''
suffix: ''
```

Basic Use
=========

### Passing values to the constructor:
```
counter = new Counter('#counter', 5000, 50000, 0, 2);
counter.start();
```

### Using data-* attributes:

**Avaliable attributes:**
```
data-easing
data-grouping
data-separator
data-decimal
data-prefix
data-suffix
```

Add any options you would like as data attributes
```
<span data-prefix="$" data-separator=":"></span>
```

Then construct the same way you would normally
```
counter = new Counter('#counter', 5000, 50000);
counter.start();
```
