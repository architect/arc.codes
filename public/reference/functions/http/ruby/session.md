# `Arc::HTTP::Session`

Ensure your app has a strong secret key:

```bash
arc env production ARC_APP_SECRET something-much-better-than-this
```

---

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
---
