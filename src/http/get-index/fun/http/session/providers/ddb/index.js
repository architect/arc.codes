let cookie = require('cookie')
let unsign = require('cookie-signature').unsign
let sign = require('cookie-signature').sign

let find = require('./find')
let create = require('./create')
let update = require('./update')

module.exports = {read, write}

/**
 * reads request for session cookie and looks it up in dynamo
 */
function read(request, callback) {

  // be async/await friendly
  let promise
  if (!callback) {
    promise = new Promise(function(res, rej) {
      callback = function(err, result) {
        err ? rej(err) : res(result)
      }
    })
  }

  // read dynamo session table
  let name = process.env.SESSION_TABLE_NAME || 'arc-sessions'
  let secret = process.env.ARC_APP_SECRET || process.env.ARC_APP_NAME || 'fallback'
  let jar = cookie.parse(request.headers && request.headers.Cookie? request.headers.Cookie || '': '')
  let sesh = jar.hasOwnProperty('_idx')
  let valid = unsign(jar._idx || '', secret)

  // find or create a new session
  let exec = sesh && valid? find.bind({}, name) : create.bind({}, name)
  let params = sesh && valid? valid : {}

  exec(params, callback)
  return promise
}

/**
 * expect params to be
 * - _idx
 * - _secret
 */
function write(params, callback) {

  // be async/await friendly
  let promise
  if (!callback) {
    promise = new Promise(function(res, rej) {
      callback = function(err, result) {
        err ? rej(err) : res(result)
      }
    })
  }

  // read dynamo session table
  let name = process.env.SESSION_TABLE_NAME || 'arc-sessions'
  let secret = process.env.ARC_APP_SECRET || process.env.ARC_APP_NAME || 'fallback'

  update(name, params, function _update(err) {
    if (err) {
      callback(err)
    }
    else {
      let maxAge = 7.884e+8
      let options = {
        maxAge,
        expires: new Date(Date.now() + maxAge * 1000),
        secure: true,
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
      }
      if (process.env.SESSION_DOMAIN) {
        options.domain = process.env.SESSION_DOMAIN
      }
      if (process.env.NODE_ENV === 'testing')
        delete options.secure
      let result = cookie.serialize('_idx', sign(params._idx, secret), options)
      callback(null, result)
    }
  })

  return promise
}
