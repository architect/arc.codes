<img src="/_static/architect-logo-500b@2x.png" id=main-logo>

# The simplest, most powerful way to build modern applications

## Instantly create powerful serverless JS, Python, and Ruby apps

> Architect provides everything you need to build **fast, modern, massively scalable cloud apps** with **low code, clear and terse config, and zero ceremony**.

---

## Try it in 30 seconds:

## 1. Install Architect

```bash
npm install -g @architect/architect
```


## 2. Run `mkdir your-app-name && arc init your-app-name && cd your-app-name` to generate a basic project:

```bash
/
├── src/
│  └── http
│     └── get-index
│        ├── .arc-config
│        └── index.js
└── app.arc
```

## 3. Check out your first `app.arc` file & HTTP function!

```arc
# /project/path/app.arc
@app
your-app-name

@http
get /

# @aws
# profile default
# region us-west-1
```

<section class="code-examples">

Node

```javascript
// /project/path/src/http/get-index/index.js
exports.handler = async function http(request) {
  return {
    statusCode: 200,
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
    statusCode: 200,
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
    return {'statusCode': 200, 'headers': headers, 'body': '<h1>Hello World! 🎉</h1>'}
```

</section>

## That's it! Ready to ship?

Ensure you've [met the system prerequisites](/quickstart) and run: `arc deploy`.

Your new app will be online within seconds.


## Want to talk about what you just made?

[Join the Architect community on Slack!](https://join.slack.com/t/architecture-as-text/shared_invite/MjE2MzU4Nzg0NTY1LTE1MDA2NzgyMzYtODE2NzRkOGRmYw)

---
## Next: [Follow the quickstart](/quickstart)
---

### Useful links
- [Details for upgrading Architect](/guides/upgrade)
- [Tinker in the playground](/playground)
- [Learn about HTTP Functions](/primitives/http)
---
