let http = require('http')

module.exports = function send({id, payload}, callback) {
  let body = JSON.stringify({id, payload})
  let req = http.request({
    method: 'POST',
    port: 3333,
    path: '/__arc',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body)
    }
  })
  req.on('error', callback)
  req.on('close', ()=> callback())
  req.write(body)
  req.end()
}
