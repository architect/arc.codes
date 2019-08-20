let jwe = require('./providers/jwe')
let ddb = require('./providers/ddb')

module.exports = function read(request, callback) {

  if (process.env.SESSION_TABLE_NAME === 'jwe')
    return jwe.read(request, callback)

  return ddb.read(request, callback)
}
