module.exports = function _csrf(req, res, next) {
  var token = req.body && req.body.csrf? req.body.csrf : ''
  var valid = req._verify(token)
  if (valid) {
    next()
  }
  else {
    res({
      status: 403,
      html: 'invalid csrf token'
    })
  }
}
