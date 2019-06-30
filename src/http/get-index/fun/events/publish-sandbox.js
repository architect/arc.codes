let http = require('http')

module.exports = function publishLocal(params, callback) {
  let req = http.request({
    method: 'POST',
    port: 3334,
    path: '/events',
  },
  function done(res) {
    res.resume()
    res.on('end', ()=> callback())
  })
  req.write(JSON.stringify(params))
  req.end('\n')
}
