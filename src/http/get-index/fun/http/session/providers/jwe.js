let cookie = require('cookie')
let jwt = require('node-webtokens');
let alg = 'dir'
let enc = 'A128GCM'

// min key size is 16
let fallback = Buffer.from('0000000000000000').toString('base64')

// need to STRONGLY encourage setting ARC_APP_SECRET in the docs
let key = process.env.ARC_APP_SECRET || fallback

// wrapper for jwe.create/jwe.parse
let jwe = {
  create(payload) {
    return jwt.generate(alg, enc, payload, key)
  },
  parse(token) {
    const WEEK = 604800
    return jwt.parse(token).setTokenLifetime(WEEK).verify(key)
  }
}

/**
 * reads req cookie and returns token payload or an empty object
 */
function read(req, callback) {
  let promise
  if (!callback) {
    promise = new Promise(function argh(res, rej) {
      callback = function errback(err, result) {
        err ? rej(err) : res(result)
      }
    })
  }
  let hasCookie = req.headers && (req.headers.Cookie || req.headers.cookie)
  let jar = cookie.parse(hasCookie? (req.headers.Cookie || req.headers.cookie) : '')
  let token = jwe.parse(jar._idx)
  callback(null, token.valid? token.payload : {})
  return promise
}

/**
 * creates a Set-Cookie header with token payload encrypted
 */
function write(payload, callback) {
  let promise
  if (!callback) {
    promise = new Promise(function ugh(res, rej) {
      callback = function errback(err, result) {
        err ? rej(err) : res(result)
      }
    })
  }
  let key = '_idx'
  let val = jwe.create(payload)
  let maxAge = 7.884e+8
  let options = {
    maxAge,
    expires: new Date(Date.now() + maxAge * 1000),
    secure: true,
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
  }
  if (process.env.SESSION_DOMAIN)
    options.domain = process.env.SESSION_DOMAIN
  if (process.env.NODE_ENV === 'testing')
    delete options.secure
  callback(null, cookie.serialize(key, val, options))
  return promise
}

module.exports = {read, write}
