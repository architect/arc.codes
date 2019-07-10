# Less But Better
## Deploy powerful **AWS** primitives with clear and readable config 

- 🔥 **Database backed web apps** that scale to zero
- 💖 **Static single page apps** seamlessly integrated with cloud functions
- ⏳ **Long running background tasks** (15min) and scheduled jobs 
- 💓 **Primitives, not frameworks**: define architecture agnostic of vendor arcana
- 💻 **Work locally** while completely offline with a speedy in-memory database
- ⏱  **Deploy in seconds** with first class support for `staging` and `production` envs

_Everything to build a modern cloud app with low code, terse config and zero ceremony._

## Install

```bash
npm install -g @architect/cli
```

Everything starts with an `.arc` file:

```arc
# this is an .arc file
@app
testapp

@http
get /
get /hellos
post /hello
```

`arc init` generates local function code:

```bash
/
├── src
│   └── http
│       ├── get-index/
│       ├── get-hellos/
│       └── post-hello/
└── .arc
```

Node

```javascript
// src/http/get-index/index.js
exports.handler = async function http(request) {
  return {
    headers: {'content-type': 'text/html'},
    body: '<h1>Hello World! 🎉</h1>'
  }
} 
```

Ruby

```ruby
# src/http/get-index/index.rb
def handler
  {
    headers: {'content-type': 'text/html'},
    body: '<h1>Hello World! 🎉</h1>'
  }
end
```

Python

```python
# src/http/get-index/index.py
def handler(request, context):
    headers = {'content-type': 'text/html'}
    return {'headers': headers, 'body': '<h1>Hello World! 🎉</h1>'}
```

> ✨ `arc deploy` ships local code to the cloud with AWS SAM and CloudFormation

---

## Next steps

- [Tinker in the playground](/intro/playground)
- [Follow the quickstart](/quickstart)
- [Learn about HTTP Functions](/primitives/http)

---
