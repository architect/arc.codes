var http = require('http')
var https = require('https')
var url = require('url')
var qs = require('querystring')

module.exports = function _read(options, callback) {

  // require options.url or fail noisily 
  if (!options.url) {
    throw Error('options.url required')
  }

  // parse out the options from options.url
  var opts = url.parse(options.url)

  // check for additional query params
  if (options.data) {
    var isSearch = !!opts.search
    options.url += (isSearch? '&' : '?') + qs.stringify(options.data)
    opts = url.parse(options.url)
  }

  var method = opts.protocol === 'https:'? https.get : http.get

  opts.rejectUnauthorized = false
  opts.headers = options.headers || {}
  opts.headers['User-Agent'] = opts.headers['User-Agent'] || 'tiny-http'
  opts.headers['Content-Type'] = opts.headers['Content-Type'] || 'application/json'
  
  // make a request
  var req = method(opts, function __res(res) {
   
    var raw = []

    var ok = res.statusCode >= 200 && res.statusCode < 300
    if (!ok) {
      callback(Error('GET failed with: ' + res.statusCode))
      res.resume()
      return
    }
 
    res.on('data', function __data(chunk) {
      raw.push(chunk)
    })

    res.on('end', function __end() {
      var err = null
      var result = null
      try {
        var isJSON = res.headers['content-type'].startsWith('application/json')
        var rawData = Buffer.concat(raw).toString()
        result = isJSON? JSON.parse(rawData) : rawData
      } 
      catch (e) {
        err = e
      }
      callback(err, {body:result, headers:res.headers})
    })
  })
  
  req.on('error', callback)
}
