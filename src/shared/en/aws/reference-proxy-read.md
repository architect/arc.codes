# <a id=proxy.read href=#proxy.read>`proxy.read`</a>

## Read a file from S3

Read a file from the `.arc` defined static buckets:

```javascript
let arc = require('@architect/functions')

exports.handler = async function http(req) {
  let index = await arc.proxy.read('index.tsx')
  let html = transpiler(index)
  return html
}
```
