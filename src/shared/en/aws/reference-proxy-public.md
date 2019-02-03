# <a id=proxy.public href=#proxy.public>`proxy.public`</a>

## Proxy S3 through API Gateway

Given the following `.arc` file:

```arc
@app
spa

@http
get /

@static
staging my-staging-bucket-name
production my-production-bucket-name
```

And to proxy all requests to S3:

```javascript
// add this to `src/http/get-index/index.js
let arc = require('@architect/functions')

exports.handler = arc.proxy.public({spa:true})
```

Setting `{spa:false}` will fall back to normal 404 behavior. If `/public/404.html` is defined that file will be used.

