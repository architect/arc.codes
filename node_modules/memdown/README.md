# MemDOWN [![Travis](https://secure.travis-ci.org/Level/memdown.png)](http://travis-ci.org/Level/memdown) [![Coverage Status](https://coveralls.io/repos/Level/memdown/badge.svg?branch=master&service=github)](https://coveralls.io/github/Level/memdown?branch=master) [![npm](https://img.shields.io/npm/v/memdown.svg)](https://www.npmjs.com/package/memdown) [![npm](https://img.shields.io/npm/dm/memdown.svg)](https://www.npmjs.com/package/memdown)

<img alt="LevelDB Logo" height="100" src="http://leveldb.org/img/logo.svg">

A drop-in replacement for [LevelDOWN](https://github.com/rvagg/node-leveldown) that works in-memory.
Can be used as a backend for [LevelUP](https://github.com/rvagg/node-levelup) rather than an actual LevelDB store.

## Example

As of version 0.7, LevelUP allows you to pass a `'db'` option when you create a new instance. This will override the default LevelDOWN store with a LevelDOWN API compatible object. MemDOWN conforms exactly to the LevelDOWN API but only performs operations in memory, so your data is discarded when the process ends or you release a reference to the database.

```js
var levelup = require('levelup')
  // note that if multiple instances point to the same location,
  // the db will be shared, but only per process
  , db = levelup('/some/location', { db: require('memdown') })

db.put('name', 'Clint Eastwood')
db.put('dob', 'May 31, 1930')
db.put('occupation', 'Badass')

db.readStream()
  .on('data', console.log)
  .on('close', function () { console.log('Go ahead, make my day!') })
```

Note in this example we're not even bothering to use callbacks on our `.put()` methods even though they are async. We know that MemDOWN operates immediately so the data will go straight into the store.

Running our example gives:

```
{ key: 'dob', value: 'May 31, 1930' }
{ key: 'name', value: 'Clint Eastwood' }
{ key: 'occupation', value: 'Badass' }
Go ahead, make my day!
```

Global Store
---

Even though it's in memory, the location parameter does do something. MemDOWN
has a global cache, which it uses to save databases by the path string.

So for instance if you create these two MemDOWNs:

```js
var db1 = levelup('foo', {db: require('memdown')});
var db2 = levelup('foo', {db: require('memdown')});
```

...they will actually share the same data, because the `'foo'` string is the same.

You may clear this global store via the `MemDOWN.clearGlobalStore()` function:

```js
require('memdown').clearGlobalStore();
```

By default, it doesn't delete the store but replaces it with a new one, so the open instance of MemDOWN will not be affected.

`clearGlobalStore` takes a single parameter, which if truthy clears the store strictly by deleting each individual key:

```js
require('memdown').clearGlobalStore(true); // delete each individual key
```

If you are using MemDOWN somewhere else while simultaneously clearing the global store in this way, then it may throw an error or cause unexpected results.

Browser support
----

See [.zuul.yml](https://github.com/Level/memdown/blob/master/.zuul.yml) for the full list of browsers that are tested in CI.

But essentially, this module requires a valid ES5-capable browser, so if you're using one that's not ES5-capable (e.g. PhantomJS, Android < 4.4, IE < 10), then you will need [the es5-shim](https://github.com/es-shims/es5-shim).

Testing
----

    npm install
    
Then:

    npm test

Or to test in the browser using Saucelabs:

    npm run test-browser
    
Or to test locally in your browser of choice:

    npm run test-browser-local

To run the linter:

    npm run lint

To check code coverage:

    npm run coverage

Licence
---

MemDOWN is Copyright (c) 2013-2015 Rod Vagg [@rvagg](https://twitter.com/rvagg) and licensed under the MIT licence. All rights not explicitly granted in the MIT license are reserved. See the included LICENSE file for more details.
