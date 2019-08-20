let jwe = require('./providers/jwe')
let ddb = require('./providers/ddb')

module.exports = function write(params, callback) {

  if (process.env.SESSION_TABLE_NAME === 'jwe')
    return jwe.write(params, callback)

  return ddb.write(params, callback)
}
