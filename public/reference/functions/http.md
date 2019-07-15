# HTTP

Helper functions for working with HTTP

---

## Node

- `http.session` - read and write a session (usage example below)

Runtime helpers `@architect/functions` for Node also have the following expanded functionality and guides:

- [`http`](/reference/functions/http/node-classic) - classic continuation passing style middleware
- [`http.middleware`](/reference/functions/http/node-middleware) - async function middleware
- [`http.proxy`](/reference/functions/http/node-proxy) - proxy the public folder at the root
- [`http.helpers`](/reference/functions/http/node-helpers) - additional webby helpers

## Ruby

- `Arc::HTTP::Session.read`
- `Arc::HTTP::Session.write`

## Python

- `arc.http.session_read`
- `arc.http.session_write`

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

Node

```javascript
let arc = require('@architect/functions')

exports.handler = async function http(req) {
  let session await arc.http.session.read(req)
  session.count = (session.count || 0) + 1
  let cookie = await arc.http.session.write(session)
  return {
    statusCode: 302, 
    headers: {
      'set-cookie': cookie,
      'location': '/'
    }
  }
}
```

Ruby

```ruby
require 'architect/functions'

def handler(req)
  session = Arc::HTTP::Session.read(req)
  session = (session.count || 0) + 1
  cookie = Arc::HTTP::Session.write(session)
  {
    statusCode: 302, 
    headers: {
      'location': '/', 
      'set-cookie': cookie
    }
  }   
end
```

Python

```python
import arc.http.session

def handler(req):
  session = arc.http.session.read(req)
  session = (session.count || 0) + 1
  cookie = arc.http.session.write(session)
  return {
    'statusCode': 302, 
    'headers': {
      'location': '/', 
      'set-cookie': cookie
    }
  }
```

---
