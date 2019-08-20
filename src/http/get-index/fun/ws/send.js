let aws = require('aws-sdk')
let lookup = require('./lookup-wss')

function publish({id, payload, endpoint}, callback) {
  let apiVersion = '2018-11-29'
  let gateway = new aws.ApiGatewayManagementApi({apiVersion, endpoint})
  gateway.postToConnection({
    ConnectionId: id,
    Data: JSON.stringify(payload)
  },
  function postToConnection(err) {
    if (err) callback(err)
    else callback()
  })
}

let endpoint = false

module.exports = function send({id, payload}, callback) {
  if (!endpoint) {
    lookup(function done(err, {https}) {
      if (err) callback(err)
      else {
        endpoint = https
        publish({
          id,
          payload,
          endpoint
        }, callback)
      }
    })
  }
  else {
    publish({
      id,
      payload,
      endpoint
    }, callback)
  }
}
