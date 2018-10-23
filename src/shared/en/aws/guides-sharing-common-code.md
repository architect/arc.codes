# Sharing Common Code

## Share modules, templates, and other files across cloud functions


Applications tend to share logic, templates, and other assets. Architect gives you a simple, seamless way to share things across your project's many functions.

Given the following `.arc` file:

```arc
@app
testapp

@http
get /
get /about
get /contact
post /contact
```

You would have the following file system layout:

```bash
/
├── src
│   ├── http
│   │   ├── get-index/
│   │   ├── get-about/
│   │   ├── get-contact/
│   │   └── post-contact/
│   └── shared/
├── .arc
└── package.json
```

Sweet! However, what if a number of endpoints need to share a layout?


## The magical `/src/shared` directory

All code found in `/src/shared` is copied into every Lambda's `/node_modules/@architect/shared` directory when:

- Running `npx sandbox`
- Running `npx deploy`
- Using `arc.sandbox` in tests 

Example: create `/src/shared/layout.js`:

```javascript
module.exports = function layout(body) {
  return `
  <html>
    <body>
      <h1>layout</h1>
      ${body}
    </body>
  </html>
  `
}
```

And then in your Lambda handlers you can reference `@architect/shared/layout` like so:

```javascript
let layout = require('@architect/shared/layout')

exports.handler = async function http(req) {
  return {
    body: layout('hello world')
  }
}
```

Anytime you preview locally, run tests, or deploy the layout, your shared modules get updated. 

> Caution! `/src/shared` gets copied recursively into all Lambdas' node_modules whenever you do basically anything so we strongly suggest keeping the directory structure as flat as possible, and the payloads as small possible, so as not bloat your Lambda functions and suffer worse cold starts.

---


## Next: [Static Assets](/guides/static-assets)
