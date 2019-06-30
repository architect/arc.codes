module.exports = function interpolateParams(req) {
  var params = /\{\w+\}/g
  if (params.test(req.path)) {
    var matches = req.path.match(params)
    var vars = matches.map(a=> a.replace(/\{|\}/g, ''))
    var idx = 0
    matches.forEach(m=> {
      req.path = req.path.replace(m, req.params[vars[idx]])
      idx += 1
    })
  }
  return req
}
