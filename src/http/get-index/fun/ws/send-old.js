let aws = require('aws-sdk')
let http = require('http')

/**
 * // the code below supports both code styles
 *
 * let WebSocket = require('@architect/functions').ws
 * let ws = new WebSocket(event)
 * await ws.send({id, payload})
 *
 * // or, more classic/functional
 * let arc = require('@architect/functions')
 * let ws = arc.ws(event)
 * ws.send({id, payload}, callback)
 */
module.exports = function WS(event) {
  console.log('warning! arc.ws as a constructor/factory is deprecated')
  return {
    /**
     * ws.send sends a message to the given websocket connection
     */
    send({id, payload}, callback) {
      // create a promise if no callback is defined
      let promise
      if (!callback) {
        promise = new Promise(function(res, rej) {
          callback = function(err, result) {
            err ? rej(err) : res(result)
          }
        })
      }
      // check for local dev
      if (process.env.NODE_ENV === 'testing') {
        let body = JSON.stringify({id, payload})
        let req = http.request({
          method: 'POST',
          port: 3333,
          path: '/__arc',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body)
          }
        })
        req.on('error', callback)
        req.on('close', ()=> callback())
        req.write(body)
        req.end()
      }
      else {
        let apiVersion = '2018-11-29'
        let apiId = event.requestContext.apiId
        let region = process.env.AWS_REGION
        let stage = process.env.NODE_ENV
        let endpoint = `https://${apiId}.execute-api.${region}.amazonaws.com/${stage}`
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
      return promise
    }
  }
}

