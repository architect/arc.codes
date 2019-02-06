# URLs (`arc.http.helpers.url`)

## Get the correct URLs across sandbox, staging and production

API Gateway generates long URLs that are hard to read, and extends the URL base path with either `staging` or `production` &mdash; this means a link intended to point at `/` should actually point at `/staging` or `/production`. 

> 👉🏽 Note: you don't need to worry about URL differences if you set up a [custom domain name with DNS](/guides/custom-dns)

If you haven't set up DNS yet, `@architect/functions` bundles a helper function `arc.http.helpers.url` for resolving URL paths. This is helpful for early prototyping.

Here's an example index page that demonstrates `url` usage:

```javascript
let arc = require('@architect/functions')
let url = arc.http.helpers.url

exports.handler = async function http(req) {
  if (req.session.isLoggedIn) {
    return {
      type: 'text/html',
      body: `<a href=${url('/logout')}>logout</a>`
    }
  }
  else {
    return {
      status: 302,
      location: url('/login')
    } 
  }
}
```

> 👋 After DNS propagates you can remove calls to `arc.http.helpers.url` from your code. Learn how to [assign a domain name](/guides/custom-dns) by setting up DNS.


