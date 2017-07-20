var htmlRequest = require('./html/_request')
var jsonRequest = require('./json/_request')

module.exports = {
  html: {
    get: htmlRequest,
    post: htmlRequest,
  },
  json: {
    get: jsonRequest,
    post: jsonRequest,
  },
}
