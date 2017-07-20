'use strict';

// Load modules

const Collection = require('./collection');
const Util = require('./util');


// Declare internals

const internals = {
    DEFAULT_RETRIES: 5,
    DEFAULT_INTERVAL: 0
};


internals._applyEach = function (eachfn, fns, ...args) {

    const go = function (...args) {

        const self = this;
        const callback = args.pop();

        return eachfn(fns, function (fn, cb) {

            fn.apply(self, args.concat([cb]));
        }, callback);
    };

    if (args.length > 0) {
        return go.apply(this, args);
    }

    return go;
};


internals._parallel = function (eachfn, tasks, callback) {

    callback = callback || Util.noop;

    if (Array.isArray(tasks)) {
        eachfn.map(tasks, function (fn, callback) {

            fn(function (err, ...args) {

                if (args.length <= 1) {
                    args = args[0];
                }

                callback.call(null, err, args);
            });
        }, callback);
    }
    else {
        const results = {};

        eachfn.each(Object.keys(tasks), function (k, callback) {

            tasks[k](function (err, ...args) {

                if (args.length <= 1) {
                    args = args[0];
                }

                results[k] = args;
                callback(err);
            });
        }, function (err) {

            callback(err, results);
        });
    }
};


module.exports.series = function (tasks, callback) {

    callback = callback || Util.noop;

    if (Array.isArray(tasks)) {
        Collection.mapSeries(tasks, function (fn, callback) {

            fn(function (err, ...args) {

                if (args.length <= 1) {
                    args = args[0];
                }

                callback.call(null, err, args);
            });
        }, callback);
    }
    else {
        const results = {};

        Collection.eachSeries(Object.keys(tasks), function (k, callback) {

            tasks[k](function (err, ...args) {

                if (args.length <= 1) {
                    args = args[0];
                }

                results[k] = args;
                callback(err);
            });
        }, function (err) {

            callback(err, results);
        });
    }
};


module.exports.parallel = function (tasks, callback) {

    internals._parallel({
        map: Collection.map,
        each: Collection.each
    }, tasks, callback);
};


module.exports.parallelLimit = function (tasks, limit, callback) {

    internals._parallel({
        map: Collection._mapLimit(limit),
        each: Collection._eachLimit(limit)
    }, tasks, callback);
};


module.exports.whilst = function (test, iterator, callback) {

    if (test()) {
        iterator(function (err) {

            if (err) {
                return callback(err);
            }

            module.exports.whilst(test, iterator, callback);
        });
    }
    else {
        callback();
    }
};


module.exports.doWhilst = function (iterator, test, callback) {

    iterator(function (err, ...args) {

        if (err) {
            return callback(err);
        }

        if (test.apply(null, args)) {
            module.exports.doWhilst(iterator, test, callback);
        }
        else {
            callback();
        }
    });
};


module.exports.until = function (test, iterator, callback) {

    if (!test()) {
        iterator(function (err) {

            if (err) {
                return callback(err);
            }

            module.exports.until(test, iterator, callback);
        });
    }
    else {
        callback();
    }
};


module.exports.doUntil = function (iterator, test, callback) {

    iterator(function (err, ...args) {

        if (err) {
            return callback(err);
        }

        if (!test.apply(null, args)) {
            module.exports.doUntil(iterator, test, callback);
        }
        else {
            callback();
        }
    });
};


module.exports.forever = function (fn, callback) {

    const next = function (err) {

        if (err) {
            if (callback) {
                return callback(err);
            }

            throw err;
        }

        fn(next);
    };

    next();
};


module.exports.waterfall = function (tasks, callback) {

    callback = callback || Util.noop;

    if (!Array.isArray(tasks)) {
        const err = new Error('First argument to waterfall must be an array of functions');

        return callback(err);
    }

    if (!tasks.length) {
        return callback();
    }

    const size = tasks.length;
    let called = false;
    let args = [];

    const iterate = function (completed) {

        const func = tasks[completed];

        const done = function (err) {

            if (called) {
                throw new Error('Callback was already called');
            }

            called = true;

            if (err) {
                return callback(...arguments);
            }

            ++completed;
            if (completed === size) {
                return callback(...arguments);
            }

            const l = arguments.length;
            args = Array(l > 1 ? l - 1 : 0);

            for (let i = 1; i < l; ++i) {
                args[i - 1] = arguments[i];
            }

            iterate(completed);
        };

        called = false;
        args.push(done);
        func.apply(null, args);
    };

    iterate(0);
};


module.exports.compose = function (...args) {

    return module.exports.seq.apply(null, Array.prototype.reverse.call(args));
};


module.exports.seq = function (...fns) {

    return function (...args) {

        const self = this;
        const callback = args.pop();

        Collection.reduce(fns, args, function (newargs, fn, cb) {

            fn.apply(self, newargs.concat([function (err, ...nextargs) {

                cb(err, nextargs);
            }]));
        }, function (err, results) {

            callback.apply(self, [err].concat(results));
        });
    };
};


module.exports.applyEach = Collection.doParallel(internals._applyEach);


module.exports.applyEachSeries = Collection.doSeries(internals._applyEach);


internals._queue = function (worker, concurrency, payload) {

    if (concurrency === undefined) {
        concurrency = 1;
    }
    else if (concurrency < 1 || concurrency >>> 0 !== concurrency) {
        throw new RangeError('Concurrency must be a positive integer');
    }

    const _insert = function (q, data, pos, callback) {

        if (callback !== undefined && typeof callback !== 'function') {
            throw new TypeError('Callback must be a function');
        }

        q.started = true;

        if (!Array.isArray(data)) {
            data = [data];
        }

        if (data.length === 0 && q.idle()) {
            // Call drain immediately if there are no tasks
            return setImmediate(q.drain);
        }

        for (let i = 0, il = data.length; i < il; ++i) {
            let item = {
                data: data[i],
                callback: typeof callback === 'function' ? callback : Util.noop
            };

            if (pos) {
                q.tasks.unshift(item);
            } else {
                q.tasks.push(item);
            }

            if (q.tasks.length === q.concurrency) {
                q.saturated();
            }
        }

        setImmediate(q.process);
    };

    const next = function (q, tasks) {

        return function (...args) {

            workers--;

            for (let i = 0, il = tasks.length; i < il; ++i) {
                const task = tasks[i];
                task.callback.apply(task, args);
            }

            if (q.tasks.length + workers === 0) {
                q.drain();
            }

            q.process();
        };
    };

    let workers = 0;
    const q = {
        tasks: [],
        concurrency: concurrency,
        saturated: Util.noop,
        empty: Util.noop,
        drain: Util.noop,
        started: false,
        paused: false,
        push: function (data, callback) {

            _insert(q, data, false, callback);
        },
        kill: function () {

            q.drain = Util.noop;
            q.tasks = [];
        },
        unshift: function (data, callback) {

            _insert(q, data, true, callback);
        },
        process: function () {

            while (!q.paused && workers < q.concurrency && q.tasks.length) {
                let tasks = payload ? q.tasks.splice(0, payload) : q.tasks.splice(0, q.tasks.length);
                const length = tasks.length;
                const data = new Array(length);

                for (let i = 0; i < length; ++i) {
                    data[i] = tasks[i].data;
                }

                if (q.tasks.length === 0) {
                    q.empty();
                }

                const cb = Util.onlyOnce(next(q, tasks));
                workers++;
                worker(data, cb);
            }
        },
        length: function () {

            return q.tasks.length;
        },
        running: function () {

            return workers;
        },
        idle: function () {

            return q.tasks.length + workers === 0;
        },
        pause: function () {

            q.paused = true;
        },
        resume: function () {

            if (q.paused === false) {
                return;
            }

            q.paused = false;
            // Need to call q.process once per concurrent
            // worker to preserve full concurrency after pause
            const resumeCount = Math.min(q.concurrency, q.tasks.length);

            for (let w = 1; w <= resumeCount; ++w) {
                setImmediate(q.process);
            }
        }
    };

    return q;
};


module.exports.queue = function (worker, concurrency) {

    return internals._queue(function (items, cb) {

        worker(items[0], cb);
    }, concurrency, 1);
};


module.exports.priorityQueue = function (worker, concurrency) {

    const _compareTasks = function (a, b) {

        return a.priority - b.priority;
    };

    const _binarySearch = function (sequence, item, compare) {

        let beg = -1;
        let end = sequence.length - 1;

        while (beg < end) {
            let mid = beg + ((end - beg + 1) >>> 1);

            if (compare(item, sequence[mid]) >= 0) {
                beg = mid;
            }
            else {
                end = mid - 1;
            }
        }

        return beg;
    };

    const _insert = function (q, data, priority, callback) {

        if (callback !== undefined && typeof callback !== 'function') {
            throw new TypeError('Callback must be a function');
        }

        q.started = true;

        if (!Array.isArray(data)) {
            data = [data];
        }

        if (data.length === 0) {
            // Call drain immediately if there are no tasks
            return setImmediate(q.drain);
        }

        for (let i = 0, il = data.length; i < il; ++i) {
            let task = data[i];
            let item = {
                data: task,
                priority: priority,
                callback: typeof callback === 'function' ? callback : Util.noop
            };

            q.tasks.splice(_binarySearch(q.tasks, item, _compareTasks) + 1, 0, item);

            if (q.tasks.length === q.concurrency) {
                q.saturated();
            }

            setImmediate(q.process);
        }
    };

    // Start with a normal queue
    let q = module.exports.queue(worker, concurrency);

    // Override push to accept second parameter representing priority
    q.push = function (data, priority, callback) {

        _insert(q, data, priority, callback);
    };

    // Remove unshift function
    delete q.unshift;

    return q;
};


module.exports.cargo = function (worker, payload) {

    return internals._queue(worker, 1, payload);
};


module.exports.auto = function (tasks, callback) {

    callback = callback || Util.noop;

    const keys = Object.keys(tasks);
    let remainingTasks = keys.length;

    if (!remainingTasks) {
        return callback();
    }

    const results = {};
    const listeners = [];

    const addListener = function (fn) {

        listeners.unshift(fn);
    };

    const removeListener = function (fn) {

        const index = listeners.indexOf(fn);
        listeners.splice(index, 1);
    };

    const taskComplete = function () {

        remainingTasks--;
        let copy = listeners.slice(0);
        for (let i = 0, il = copy.length; i < il; ++i) {
            let fn = copy[i];
            fn();
        }
    };

    const taskCallbackGenerator = function (key) {

        return function taskCallback (err, ...args) {

            if (args.length <= 1) {
                args = args[0];
            }

            if (err) {
                const safeResults = {};
                const keys = Object.keys(results);

                for (let i = 0, il = keys.length; i < il; ++i) {
                    let rkey = keys[i];

                    safeResults[rkey] = results[rkey];
                }

                safeResults[key] = args;
                callback(err, safeResults);
                // Stop subsequent errors hitting callback multiple times
                callback = Util.noop;
            }
            else {
                results[key] = args;
                setImmediate(taskComplete);
            }
        };
    };

    const taskReadyGenerator = function (key, requires) {

        return function taskReady () {
            // Note: Originally this was ported with the
            // !results.hasOwnProperty(k) check first in the
            // return statement. However, coverage was never achieved
            // for this line as I have yet to see a case where this
            // was false. A test would be appreciated, otherwise this
            // return statement should be refactored.
            let run = true;
            let i = requires.length;

            while (i--) {
                run = results.hasOwnProperty(requires[i]);
                if (!run) {
                    break;
                }
            }

            return run && !(key in results);
        };
    };

    const taskListenerGenerator = function (ready, task, taskCallback) {

        const listener = function taskListener () {

            if (ready()) {
                removeListener(listener);
                task[task.length - 1](taskCallback, results);
            }
        };

        return listener;
    };

    addListener(function () {

        if (!remainingTasks) {

            const theCallback = callback;

            // Prevent final callback from calling itself if it errors
            callback = Util.noop;
            theCallback(null, results);
        }
    });

    for (let i = 0, il = keys.length; i < il; ++i) {

        const k = keys[i];
        const task = Array.isArray(tasks[k]) ? tasks[k] : [tasks[k]];
        const taskCallback = taskCallbackGenerator(k);
        const requires = task.slice(0, Math.abs(task.length - 1));
        const ready = taskReadyGenerator(k, requires);
        const listener = taskListenerGenerator(ready, task, taskCallback);

        // Prevent deadlocks
        let len = requires.length;

        while (len--) {
            let dep = tasks[requires[len]];

            if (!dep) {
                throw new Error('Has inexistant dependency');
            }

            if (Array.isArray(dep) && dep.indexOf(k) !== -1) {
                throw new Error('Has cyclic dependencies');
            }
        }

        if (ready()) {
            task[task.length - 1](taskCallback, results);
        }
        else {
            addListener(listener);
        }
    }
};


module.exports.retry = function (times, task, callback) {

    const attempts = [];
    let interval;

    // Parse arguments
    if (typeof times === 'function') {
        // retry(task[, callback])
        callback = task;
        task = times;
        times = internals.DEFAULT_RETRIES;
        interval = internals.DEFAULT_INTERVAL;
    }
    else if (typeof times === 'number') {
        // retry(number, task[, callback])
        times = (times >>> 0) || internals.DEFAULT_RETRIES;
        interval = internals.DEFAULT_INTERVAL;
    }
    else if (times !== null && typeof times === 'object') {
        // retry(object, task[, callback])
        interval = typeof times.interval === 'number' ? times.interval : internals.DEFAULT_INTERVAL;
        times = (times.times >>> 0) || internals.DEFAULT_RETRIES;
    }
    else {
        throw TypeError('Retry expects number or object');
    }

    const wrappedTask = function (wrappedCallback, wrappedResults) {

        const retryAttempt = function (task, finalAttempt) {

            return function (seriesCallback) {

                task(function (err, result) {

                    seriesCallback(!err || finalAttempt, {
                        err: err,
                        result: result
                    });
                }, wrappedResults);
            };
        };

        const retryTimeout = function (seriesCallback) {

            setTimeout(seriesCallback, interval);
        };

        while (times) {
            let finalAttempt = --times === 0;
            attempts.push(retryAttempt(task, finalAttempt));

            if (!finalAttempt && interval > 0) {
                attempts.push(retryTimeout);
            }
        }

        module.exports.series(attempts, function (done, data) {

            data = data[data.length - 1];
            (wrappedCallback || callback)(data.err, data.result);
        });
    };

    // If a callback is passed, run this as a control flow
    return callback ? wrappedTask() : wrappedTask;
};


module.exports.iterator = function (tasks) {

    const makeCallback = function (index) {

        const fn = function (...args) {

            if (tasks.length) {
                tasks[index].apply(null, args);
            }

            return fn.next();
        };

        fn.next = function () {

            return (index < tasks.length - 1) ? makeCallback(index + 1) : null;
        };

        return fn;
    };

    return makeCallback(0);
};


module.exports.apply = function (fn, ...args) {

    return function (...innerArgs) {

        return fn.apply(null, args.concat(innerArgs));
    };
};


module.exports.times = function (count, iterator, callback) {

    let counter = [];

    for (let i = 0; i < count; ++i) {
        counter.push(i);
    }

    return Collection.map(counter, iterator, callback);
};


module.exports.timesSeries = function (count, iterator, callback) {

    let counter = [];

    for (let i = 0; i < count; ++i) {
        counter.push(i);
    }

    return Collection.mapSeries(counter, iterator, callback);
};


module.exports.timesLimit = function (count, limit, iterator, callback) {

    let counter = [];

    for (let i = 0; i < count; ++i) {
        counter.push(i);
    }

    return Collection.mapLimit(counter, limit, iterator, callback);
};
