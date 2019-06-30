let read = require('./session/read')
let write = require('./session/write')
let interpolate = require('./helpers/params')

/**
 * arc.http accepts one or more functions with an express-style sig
 */
module.exports = function http(...fns) {

  // ensure we have been passed only functions
  fns.forEach(f=> {
    if (typeof f != 'function')
      throw TypeError(f + ' not a function')
  })

  // return an aws lambda function signature
  return function lambda(request, context, callback) {

    // verify the request is configured by arc
    if (!request.headers)
      request.headers = {}

    // cache the functions
    let cache = fns.slice()

    // read the session
    read(request, function _read(err, session) {

      // fail loudly if the session isn't setup correctly
      if (err)
        throw err

      // construct a response function
      let req = interpolate(Object.assign({}, request, {session}))
      let res = response.bind({}, req, callback)

      // loop thru middleware
      ;(function iterator(fun) {
        function fail() {throw Error('next() called from last function')}
        let next = iterator.bind({}, cache.shift() || fail)
        fun.call({}, req, res, next)
      })(cache.shift())
    })
  }
}

/**
 * req is bound so we have a ref to req.session
 * callback is raw lambda callback
 * params can be
 * - session
 * - location
 * - html, css, js, text, json or xml
 * - status, code, or statusCode
 * - cacheControl
 */
function response(req, callback, params) {

  // default content type, body, cache-control
  let type = 'application/json; charset=utf8'
  let body = params.body || '\n'
  //let cacheControl = params.cacheControl || ''
  let status = params.status || params.code || params.statusCode || 200

  // shorthand overrides
  if (params instanceof Error) {
    status = params.status || params.code || params.statusCode || 500
    type = 'text/html; charset=utf8'
    body = `
      <h1>${params.name} ${res.status}</h1>
      <h3>${params.message}</h3>
      <pre>${params.stack}<pre>
    `
  }

  if (params.html) {
    type = 'text/html; charset=utf8'
    body = params.html
  }
  else if (params.css) {
    type = 'text/css; charset=utf8'
    body = params.css
  }
  else if (params.js) {
    type = 'text/javascript; charset=utf8'
    body = params.js
  }
  else if (params.text) {
    type = 'text/plain; charset=utf8'
    body = params.text
  }
  else if (params.json) {
    type = 'application/json; charset=utf8'
    body = JSON.stringify(params.json)
  }
  else if (params.xml) {
    type = 'application/xml; charset=utf8'
    body = params.xml
  }

  let res = {}
  res.headers = Object.assign({}, {'content-type': type}, params.headers || {})
  res.statusCode = status
  res.body = body

  if (params.location) {
    res.statusCode = 302
    res.headers.location = params.location
  }

  // tag the new session
  if (params.session) {
    let session = Object.assign({}, req.session, params.session)
    //session._idx = req.session._idx
    //session._secret = req.session._secret
    //session._ttl = req.session._ttl
    // save the session
    write(session, function _write(err, cookie) {
      if (err) throw err
      //let merged = Object.assign({}, res, {cookie})
      res.headers['set-cookie'] = cookie
      callback(null, res)
    })
  }
  else {
    // just passthru
    callback(null, res)
  }
}
