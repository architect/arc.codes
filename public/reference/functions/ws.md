# WebSockets

Invoke `@ws` connected clients any function defined under the `@app` namespace.

---

Install runtime helpers for Node

```bash
cd path/to/lambda
npm init -f
npm install @architect/functions
```

Install runtime helpers for Ruby

```bash
cd path/to/lambda
bundle init
bundle install --path vendor/bundle
bundle add architect-functions
```

Install runtime helpers for Python

```bash
cd path/to/lambda
pip install --target ./vendor architect-functions
```

---

## Publish JSON payload to a WebSocket client

Node

```javascript
let arc = require('@architect/functions')

await arc.ws.send({
  id: event.context.connectionId
  payload: {action: 'ping'},
})
```

Ruby

```ruby
require 'architect/functions'

Arc::WS.send id: event.context.connectionId, payload: {action: 'ping'}
```

Python

```python
import arc.ws

arc.ws.send(id=event.context.connectionId, payload={'action': 'ping'})
```

---
