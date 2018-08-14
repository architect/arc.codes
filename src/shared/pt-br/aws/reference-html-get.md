<div style=background:papayawhip;padding:10px;border-radius:7px;>Esta tradução para o português ainda está incompleta!</div>

# <a id=arc.html.get href=#arc.html.get>`arc.html.get`</a>

## HTTP `GET` handler that responds with `text/html`

Example:

```javascript
var arc = require('@architect/functions')

function handler(req, res) {
  res({
    html: '<strong>Hello world</strong>'
  })
}

exports.handler = arc.html.get(handler)
```

Things to understand:

- `arc.html.get` accepts one or more functions that follow Express-style middleware signature: `(req, res, next)=>`
- `req` is a plain JavaScript `Object` with `path`, `method`, `query`, `params`, `body` keys
- `res` is a function that must be invoked with named params: 
  - `html` a string value containing HTML content
  - or `location` with a URL value (a string starting w `/`)
  - `session` (optional) a plain `Object`
  - `status` (optional) HTTP error status code responses: `500`, `403`, or `404`
- `res` can also be invoked with an `Error`
  - optionally the `Error` instance property of `code`, `status` or `statusCode` can be one of `403`, `404` or `500` to change the HTTP status code
- `next` (optional) is a function to continue middleware execution 
