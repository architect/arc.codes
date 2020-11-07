# Events

Invoke `@event` handlers from any other function defined under the same `@app` namespace.

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

## Publish JSON payload to an SNS Topic

Node

```javascript
let arc = require('@architect/functions')

await arc.events.publish({
  name: 'hit-counter',
  payload: {hits: 1},
})
```

Ruby

```ruby
require 'architect/functions'

Arc::Events.publish name: 'hit-counter', payload: {hits: 1}
```

Python

```python
import arc.events

arc.events.publish(name='hit-counter', payload={'hits': 1})
```

---
