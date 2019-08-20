let http = require('http')

module.exports = function sandbox(params, callback) {
  let req = http.request({
    method: 'POST',
    port: 3334,
    path: '/queues',
  })
  req.write(JSON.stringify(params))
  req.end()
  callback()
}
