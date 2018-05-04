# Sharing Common Code

> Applications tend to share logic across cloud functions. The best way to do this is by creating a module you can share between them. 

Given the following `.arc` file:

```arc
@app
testapp

@html
get /
get /about
get /contact
post /contact
```

You would have the following file system layout:

```bash
/
|-src
| |-html
| | |-get-index/
| | |-get-about/
| | |-get-contact/
| | '-post-contact/
| '-shared/
|-.arc
'-package.json
```

Sweet! However, what if a number of endpoints need to share a layout?

## The magical `/src/shared` directory

All code found in `/src/shared` is copied into every Lambda's `/node_modules/@architect/shared` directory when:

- Running `npm start`
- Running `npm run deploy`
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
let arc = require('@architect/functions')
let layout = require('@architect/shared/layout')

function index(req, res) {
  res({
    html: layout('hello world')
  })
}

exports.handler = arc.html.get(index)
```

Anytime you preview locally, run tests, or deploy the layout, your shared modules get updated. 

> Caution! `/src/shared` gets copied recursively into all Lambdas' node_modules whenever you do basically anything so we strongly suggest keeping the directory structure as flat as possible, and the payloads as small possible, so as not bloat your Lambda functions and suffer worse cold starts.

---

## Next: [HTTP Functions](/guides/http)
