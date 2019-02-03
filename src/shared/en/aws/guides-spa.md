# Single Page Apps

## Static and dynamic API endpoints coexisting at the same origin

Architect provides two methods to proxy static assets through API Gateway.
 This means your single page application and API can share the same domain name, session support and database access *without CORS* and *without 3rd party proxies*. 

For this guide we'll use the following `.arc` file:

```arc
@app
spa

@http
get /

@static
staging spa-stage-bukkit
production spa-prod-bukkit
```

> 👉🏽 Note: S3 buckets are global to all of AWS so you may need to try a few different names!

## Lambda Proxy

The quickest solution to hosting a single page app is to put all your static assets into `./public` and then add the following to `./src/http/get-index/index.js`:

```javascript
let arc = require('@architect/functions')

exports.handler = arc.proxy.public({spa:true})
```

The `arc.proxy.public` function accepts an optional configuration param `spa` which will force loading `index.html` no matter what route is invoked (note however that routes defined in `.arc` will take precedence). Setting `{spa:false}` or omit if you want to 404 if a directory or file does not exist. 

> Bonus: if `404.html` is present that file will be shown.

## Lambda Proxy Quirks

- No binary files: images, audio video need to be served via S3 static URLs
- You can fallback to a backup S3 direct proxy `/_static`
