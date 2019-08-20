# Queues 

Invoke `@queue` handlers from any other function defined under the same `@app` namespace.

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

## Publish a JSON payload to an SQS Queue URL

Node

```javascript
let arc = require('@achitect/functions')

await arc.queues.publish({
  name: 'avatar-resizer',
  payload: {name: 'punky.jpg'},
})
```

Ruby

```ruby
require 'architect/functions'

Arc::Queues.publish name: 'avatar-resizer', payload: {name: 'zack.png'}
```

Python

```python
import arc.events

arc.queues.publish(name='avatar-resizer', payload={'name': 'rusty.gif'})
```

---
