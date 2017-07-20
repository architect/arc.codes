'use strict';

// Load modules

const Util = require('./util');


// Declare internals

const internals = {};


internals.doParallelLimit = function (limit, fn) {

    return function (...args) {

        return fn.apply(null, [internals._eachLimit(limit), ...args]);
    };
};


internals._map = function (arr) {

    const result = [];

    for (let i = 0, il = arr.length; i < il; ++i) {
        result.push({
            index: i,
            value: arr[i]
        });
    }

    return result;
};


internals._unmap = function (arr) {

    const result = [];

    for (let i = 0, il = arr.length; i < il; ++i) {
        result.push(arr[i].value);
    }

    return result;
};


internals._asyncMap = function (eachfn, arr, iterator, callback) {

    arr = internals._map(arr);

    if (typeof callback !== 'function') {
        eachfn(arr, function (item, callback) {

            iterator(item.value, function (err) {

                callback(err);
            });
        });
    }
    else {
        const results = [];

        eachfn(arr, function (item, callback) {

            iterator(item.value, function (err, value) {

                results[item.index] = value;
                callback(err);
            });
        }, function (err) {

            callback(err, results);
        });
    }
};


internals._filter = function (eachfn, arr, iterator, callback) {

    let results = [];

    arr = internals._map(arr);

    eachfn(arr, function (item, callback) {

        iterator(item.value, function (err, value) {

            if (err) {
                return callback(err);
            }
            else if (value) {
                results.push(item);
            }

            callback();
        });
    }, function (err) {

        if (err) {
            return callback(err);
        }

        results.sort(function (a, b) {

            return a.index - b.index;
        });

        results = internals._unmap(results);
        callback(null, results);
    });
};


internals._reject = function (eachfn, arr, iterator, callback) {

    let results = [];

    arr = internals._map(arr);

    eachfn(arr, function (item, callback) {

        iterator(item.value, function (err, value) {

            if (err) {
                return callback(err);
            }
            else if (!value) {
                results.push(item);
            }

            callback();
        });
    }, function (err) {

        if (err) {
            return callback(err);
        }

        results.sort(function (a, b) {

            return a.index - b.index;
        });

        results = internals._unmap(results);
        callback(null, results);
    });
};


internals._detect = function (eachfn, arr, iterator, callback) {

    eachfn(arr, function (item, cb) {

        iterator(item, function (err, result) {

            if (err) {
                callback(err);
                callback = Util.noop;
            }
            else if (result) {
                callback(null, item);
                callback = Util.noop;
            }
            else {
                cb();
            }
        });
    }, callback);
};


internals._concat = function (eachfn, arr, fn, callback) {

    let r = [];

    eachfn(arr, function (x, cb) {

        fn(x, function (err, y) {

            r = r.concat(y || []);
            cb(err);
        });
    }, function (err) {

        callback(err, r);
    });
};


// Used in flow.js
module.exports.doSeries = internals.doSeries = function (fn) {

    return function (...args) {

        return fn.apply(null, [module.exports.eachSeries, ...args]);
    };
};


// Used in flow.js
module.exports.doParallel = internals.doParallel = function (fn) {

    return function (...args) {

        return fn.apply(null, [module.exports.each, ...args]);
    };
};


// Used in flow.js
module.exports._eachLimit = internals._eachLimit = function (limit) {

    return function (arr, iterator, callback) {

        callback = callback || Util.noop;

        if (!arr.length || limit <= 0) {
            return callback();
        }

        let completed = 0;
        let started = 0;
        let running = 0;
        let errored = false;

        (function replenish () {

            const iteratorCallback = function (err) {

                if (err) {
                    callback(err);
                    callback = Util.noop;
                    errored = true;
                }
                else {
                    completed++;
                    running--;

                    if (completed >= arr.length) {
                        callback();
                    }
                    else {
                        replenish();
                    }
                }
            };

            while (running < limit && started < arr.length && errored === false) {
                started++;
                running++;

                iterator(arr[started - 1], iteratorCallback);
            }
        })();
    };
};


internals._eachOfLimit = function (limit) {

    return function (object, iterator, callback) {

        callback = callback || Util.noop;

        const isArrayLike = Util.isArrayLike(object);
        let size;
        let keys;

        if (isArrayLike) {
            size = object.length;
        }
        else {
            keys = Object.keys(object);
            size = keys.length;
        }

        if (!size || limit <= 0) {
            return callback();
        }

        let completed = 0;
        let started = 0;
        let running = 0;
        let errored = false;

        (function replenish () {

            const iteratorCallback = function (err) {

                if (err) {
                    callback(err);
                    callback = Util.noop;
                    errored = true;
                }
                else {
                    completed++;
                    running--;

                    if (completed >= size) {
                        callback();
                    }
                    else {
                        replenish();
                    }
                }
            };

            while (running < limit && started < size && errored === false) {
                let key = isArrayLike ? started : keys[started];
                started++;
                running++;
                iterator(object[key], key, iteratorCallback);
            }
        })();
    };
};


// Used in flow.js
module.exports._mapLimit = internals._mapLimit = function (limit) {

    return internals.doParallelLimit(limit, internals._asyncMap);
};


module.exports.each = function (arr, iterator, callback) {

    callback = callback || Util.noop;

    if (!arr.length) {
        return callback();
    }

    let completed = 0;

    const done = function (err) {

        if (err) {
            callback(err);
            callback = Util.noop;
        }
        else {
            ++completed;

            if (completed >= arr.length) {
                callback();
            }
        }
    };

    for (let i = 0, il = arr.length; i < il; ++i) {
        iterator(arr[i], Util.onlyOnce(done));
    }
};


module.exports.eachSeries = function (arr, iterator, callback) {

    callback = callback || Util.noop;

    if (!arr.length) {
        return callback();
    }

    let completed = 0;

    const iterate = function () {

        iterator(arr[completed], function (err) {

            if (err) {
                callback(err);
                callback = Util.noop;
            }
            else {
                completed++;

                if (completed >= arr.length) {
                    callback();
                }
                else {
                    iterate();
                }
            }
        });
    };

    iterate();
};


module.exports.eachLimit = function (arr, limit, iterator, callback) {

    const fn = internals._eachLimit(limit);

    fn.apply(null, [arr, iterator, callback]);
};


module.exports.eachOf = function (object, iterator, callback) {

    const isArrayLike = Util.isArrayLike(object);
    let size;
    let keys;

    if (isArrayLike) {
        size = object.length;
    }
    else {
        keys = Object.keys(object);
        size = keys.length;
    }

    callback = callback || Util.noop;

    if (!size) {
        return callback();
    }

    let completed = 0;

    const done = function (err) {

        if (err) {
            callback(err);
            callback = Util.noop;
        }
        else {
            ++completed;

            if (completed >= size) {
                callback();
            }
        }
    };

    if (isArrayLike) {
        for (let i = 0; i < size; ++i) {
            iterator(object[i], i, Util.onlyOnce(done));
        }
    }
    else {
        for (let i = 0; i < size; ++i) {
            let key = keys[i];
            iterator(object[key], key, Util.onlyOnce(done));
        }
    }
};


module.exports.eachOfSeries = function (object, iterator, callback) {

    const isArrayLike = Util.isArrayLike(object);
    let size;
    let keys;

    if (isArrayLike) {
        size = object.length;
    }
    else {
        keys = Object.keys(object);
        size = keys.length;
    }

    callback = callback || Util.noop;

    if (!size) {
        return callback();
    }

    let completed = 0;

    const complete = function (err) {

        if (err) {
            callback(err);
            callback = Util.noop;
        }
        else {
            completed++;

            if (completed >= size) {
                callback();
            }
            else {
                iterate();
            }
        }
    };

    const iterate = isArrayLike ?
                  function () { iterator(object[completed], completed, complete); } :
                  function () { let key = keys[completed]; iterator(object[key], key, complete); };

    iterate();
};


module.exports.eachOfLimit = function (arr, limit, iterator, callback) {

    let fn = internals._eachOfLimit(limit);

    fn.apply(null, [arr, iterator, callback]);
};


module.exports.map = internals.doParallel(internals._asyncMap);


module.exports.mapSeries = internals.doSeries(internals._asyncMap);


module.exports.mapLimit = function (arr, limit, iterator, callback) {

    return internals._mapLimit(limit)(arr, iterator, callback);
};


module.exports.filter = internals.doParallel(internals._filter);


module.exports.filterSeries = internals.doSeries(internals._filter);


module.exports.reject = internals.doParallel(internals._reject);


module.exports.rejectSeries = internals.doSeries(internals._reject);


// reduce() only has a series version.
// A parallel reduce() won't work in many situations.
module.exports.reduce = function (arr, memo, iterator, callback) {

    module.exports.eachSeries(arr, function (item, callback) {

        iterator(memo, item, function (err, value) {

            memo = value;
            callback(err);
        });
    }, function (err) {

        callback(err, memo);
    });
};


module.exports.reduceRight = function (arr, memo, iterator, callback) {

    const reversed = [];

    for (let i = arr.length - 1; i >= 0; --i) {
        reversed.push(arr[i]);
    }

    module.exports.reduce(reversed, memo, iterator, callback);
};


module.exports.detect = internals.doParallel(internals._detect);


module.exports.detectSeries = internals.doSeries(internals._detect);


module.exports.sortBy = function (arr, iterator, callback) {

    module.exports.map(arr, function (item, callback) {

        iterator(item, function (err, criteria) {

            if (err) {
                return callback(err);
            }

            callback(null, {
                value: item,
                criteria: criteria
            });
        });
    }, function (err, results) {

        if (err) {
            return callback(err);
        }

        results.sort(function (left, right) {

            const a = left.criteria;
            const b = right.criteria;

            return a < b ? -1 : a > b ? 1 : 0;
        });

        results = internals._unmap(results);
        callback(null, results);
    });
};


module.exports.some = function (arr, iterator, callback) {

    module.exports.each(arr, function (item, cb) {

        iterator(item, function (err, value) {

            if (err) {
                callback(err);
                callback = Util.noop;
            }
            else if (value) {
                callback(null, true);
                callback = Util.noop;
            }

            cb();
        });
    }, function (err) {

        callback(err, false);
    });
};


module.exports.every = function (arr, iterator, callback) {

    module.exports.each(arr, function (item, cb) {

        iterator(item, function (err, value) {

            if (err) {
                callback(err);
                callback = Util.noop;
            }
            else if (!value) {
                callback(null, false);
                callback = Util.noop;
            }

            cb();
        });
    }, function (err) {

        callback(err, true);
    });
};


module.exports.concat = internals.doParallel(internals._concat);


module.exports.concatSeries = internals.doSeries(internals._concat);
