let http = require('./http')
let static = require('../static')
let url = require('./helpers/url')
let interpolate = require('./helpers/params')
let read = require('./session/read')
let write = require('./session/write')
let middleware = require('./middleware')
let proxy = require('./proxy')

http.helpers = {static, url, interpolate}
http.session = {read, write}
http.middleware = middleware
http.proxy = proxy

module.exports = http
