let aws = require('aws-sdk')
let https = require('https')
let DB = aws.DynamoDB
let endpoint = new aws.Endpoint('http://localhost:5000')

if (typeof process.env.NODE_ENV === 'undefined')
  process.env.NODE_ENV = 'testing'

let testing = process.env.NODE_ENV === 'testing'

if (!testing) {
  let agent = new https.Agent({
    keepAlive: true,
    maxSockets: 50,
    rejectUnauthorized: true,
  })
  aws.config.update({
    httpOptions: {agent}
  })
}

module.exports = testing? new DB({endpoint}) : new DB
