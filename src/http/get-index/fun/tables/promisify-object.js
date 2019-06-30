// accepts an object and promisifies all keys
module.exports = function pfy(obj) {
  var copy = {}
  Object.keys(obj).forEach(k=> {
    copy[k] = promised(obj[k])
  })
  return copy
}

// accepts an errback style fn and returns a promisified fn
function promised(fn) {
  return function _promisified(params, callback) {
    if (!callback) {
      return new Promise(function(res, rej) {
        fn(params, function(err, result) {
          err ? rej(err) : res(result)
        })
      })
    }
    else {
      fn(params, callback)
    }
  }
}
