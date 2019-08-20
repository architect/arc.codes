<img src="/_static/architect-logo-500b@2x.png" width=500>

# The simplest, most powerful way to build modern applications

## Instantly create powerful serverless JS, Python, and Ruby apps

> Architect provides everything you need to build **fast, modern, massively scalable cloud apps** with **low code, clear and terse config, and zero ceremony**.

---

## Try it in 30 seconds:

## 1. Install Architect

```bash
npm install -g @architect/architect
```


## 2. Run `arc init` to generate a basic project:

```bash
/
├── src
│   └── http
│       └── get-index/
└── .arc
```

## 3. Check out your first `.arc` file & HTTP function!

```arc
# /project/path/.arc
@app
your-app-name

@aws
bucket your-private-deploy-bucket

@http
get /
```

<section class="code-examples">

Node

```javascript
// /project/path/src/http/get-index/index.js
exports.handler = async function http(request) {
  return {
    headers: {'content-type': 'text/html; charset=utf-8;'},
    body: '<h1>Hello World! 🎉</h1>'
  }
}
```

Ruby

```ruby
# /project/path/src/http/get-index/index.rb
def handler(request, context)
  {
    headers: {'content-type': 'text/html; charset=utf-8;'},
    body: '<h1>Hello World! 🎉</h1>'
  }
end
```

Python

```python
# /project/path/src/http/get-index/index.py
def handler(request, context):
    headers = {'content-type': 'text/html; charset=utf-8;'}
    return {'headers': headers, 'body': '<h1>Hello World! 🎉</h1>'}
```

</section>

## That's it! Ready to ship?

Ensure you've [met the system prerequisites](/quickstart) and run: `arc deploy`.

Your new app will be online within seconds.

---
## Next: [Follow the quickstart](/quickstart)
---

### Useful links
- [Tinker in the playground](/intro/playground)
- [Learn about HTTP Functions](/primitives/http)
---

