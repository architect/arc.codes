let sandbox = require('./send-sandbox')
let old = require('./send-old')
let run = require('./send')
let urls = require('./urls')

old.send = send
old.urls = urls

module.exports = old

/**
 * arc.ws.send
 *
 * publish web socket events
 *
 * @param {Object} params
 * @param {String} params.id - the ws connecton id (required)
 * @param {String} params.payload - a json event payload (required)
 * @param {Function} callback - a node style errback (optional)
 * @returns {Promise} - returned if no callback is supplied
 */
function send({id, payload}, callback) {

  // create a promise if no callback is defined
  let promise
  if (!callback) {
    promise = new Promise(function(res, rej) {
      callback = function(err, result) {
        err ? rej(err) : res(result)
      }
    })
  }

  let exec = process.env.NODE_ENV === 'testing'? sandbox : run

  exec({
    id,
    payload
  }, callback)

  return promise
}
