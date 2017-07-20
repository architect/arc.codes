'use strict';

// Load modules


// Declare internals

const internals = {};


internals.consoleFn = function (name) {

    return function (fn, ...args) {

        fn.apply(null, args.concat([function (err) {

            if (err) {
                return console.error(err);
            }

            const consoleFn = console[name];

            if (typeof consoleFn === 'function') {
                for (let i = 1, il = arguments.length; i < il; ++i) {
                    consoleFn(arguments[i]);
                }
            }
        }]));
    };
};


module.exports.noop = function noop () {};


module.exports.onlyOnce = function (fn) {

    let called = false;

    return function (...args) {

        if (called) {
            throw new Error('Callback was already called.');
        }

        called = true;
        fn.apply(global, args);
    };
};


module.exports.ensureAsync = function (fn) {

    return function (...args) {

        const callback = args.pop();

        if (typeof callback !== 'function') {
            throw new TypeError('Last argument must be a function.');
        }

        let sync = true;

        args.push(function (...innerArgs) {

            if (sync) {
                setImmediate(function () {

                    callback.apply(null, innerArgs);
                });
            }
            else {
                callback.apply(null, innerArgs);
            }
        });

        fn.apply(this, args);
        sync = false;
    };
};


module.exports.isArrayLike = function (arr) {

    return Array.isArray(arr) || (typeof arr === 'object' &&
                                  arr !== null &&
                                  arr.length >= 0 &&
                                  arr.length >>> 0 === arr.length);
};


module.exports.memoize = function (fn, hasher) {

    hasher = hasher || function (item) {

        return item;
    };

    const memo = {};
    const queues = {};

    const memoized = function (...args) {

        const callback = args.pop();
        const key = hasher.apply(null, args);

        if (key in memo) {
            process.nextTick(function () {

                callback.apply(null, memo[key]);
            });
        }
        else if (key in queues) {
            queues[key].push(callback);
        }
        else {
            queues[key] = [callback];
            fn.apply(null, args.concat([function (...args) {

                memo[key] = args;
                const q = queues[key];
                delete queues[key];

                for (let i = 0, l = q.length; i < l; i++) {
                    q[i].apply(null, args);
                }
            }]));
        }
    };

    memoized.memo = memo;
    memoized.unmemoized = fn;

    return memoized;
};


module.exports.unmemoize = function (fn) {

    return function (...args) {

        return (fn.unmemoized || fn).apply(null, args);
    };
};


module.exports.log = internals.consoleFn('log');


module.exports.dir = internals.consoleFn('dir');
