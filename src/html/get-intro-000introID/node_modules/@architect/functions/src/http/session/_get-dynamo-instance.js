var aws = require('aws-sdk')
var testing = process.env.NODE_ENV === 'testing'
var endpoint = new aws.Endpoint('http://localhost:5000')

module.exports = testing? new aws.DynamoDB({endpoint}) : new aws.DynamoDB
