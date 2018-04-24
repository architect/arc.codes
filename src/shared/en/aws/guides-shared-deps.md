# Shared Deps

> Cloud functions tend to share logic across an `@app`. The best way to do this is by creating a module you can share between them. 

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
| '-html
|   |-get-index/
|   |-get-about/
|   |-get-contact/
|   '-post-contact/
|-.arc
'-package.json
```

Sweet! However, each of these endpoints needs to share a layout.

## Magical `/src/shared`

All code found in `/src/shared` is copied into every Lambda `node_modules/@architect/shared` when:

- Running `npm start`
- Running `npm run deploy`
- Using `arc.sandbox` in tests 

Create `src/shared/layout.js`:

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

Now anytime you preview locally, run the tests or deploy the layout module gets updated. 

> Caution! `src/shared` gets copied recursively into all Lambda node_modules whenever you do basically anything so you want to keep the direstory structure as flat as possible and the payloads as small possible as to not bloat your Lambda functions and suffer worse cold starts
