# <a id=arc.ws href=#arc.ws>`arc.ws`</a>

Publish events to a connected web socket client from runtime Lambda code.

```javascript
// src/ws/ws-default/index.js
let arc = require('@architect/functions')
let WebSocket = arc.ws

exports.handler = async function ws(event) {

  // the send method requires a valid connectionId
  let myConnectionID = event.requestContext.connectionId

  let client = new WebSocket(event)
  await client.send({
    id: myConnectionID, 
    payload: {hello: 'world'}
  })

  // always respond with 200 unless you want to disconnect the client
  return {statusCode: 200}
}
```
