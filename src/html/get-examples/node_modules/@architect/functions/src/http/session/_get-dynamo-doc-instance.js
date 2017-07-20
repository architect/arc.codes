var aws = require('aws-sdk')
var testing = process.env.NODE_ENV === 'testing'
var passthru = !process.env.hasOwnProperty('SESSION_TABLE_NAME')
var endpoint = new aws.Endpoint('http://localhost:5000')

// if SESSION_TABLE_NAME isn't defined we mock the client and just pass session thru
var mock = {
  get(params, callback) {
    callback()
  },
  put(params, callback) {
    callback()
  }
}

module.exports = testing? new aws.DynamoDB.DocumentClient({endpoint}) : (passthru? mock : new aws.DynamoDB.DocumentClient)
