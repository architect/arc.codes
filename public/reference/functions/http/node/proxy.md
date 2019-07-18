# `arc.http.proxy`

## Static and dynamic API endpoints coexisting at the same origin

 This means your single page application and API can share the same domain name, session support and database access *without CORS* and *without 3rd party proxies*. 

Override the root with a `get /` HTTP function in the `.arc` file:

```arc
@app
spa

@static
@http
get /

```

---


<h1>Proxy</h1>

Architect provides two methods to proxy static assets through API Gateway.

<h2 id=proxy>✨ API Gateway Proxy</h2>

To workaround CORS you can proxy S3 directly through API Gateway at `/_static`.

<h2>⚡️ Lambda Proxy</h2>

- `AWS::Serverless::Api`
- `AWS::Lambda::Function` *

All Lambdas will have `process.env.ARC_STATIC_BUCKET` environment variable with the generated S3 bucket name. The generated API can proxy to the S3 bucket at the root with the help of Lambda and by-passes Lambda altogether with a direct proxy at `/_static`.

<a href="/api/1/package?arc=%40app%0Atestapp%0A%40static%0A%40http%0Aget%20%2F%0A" 
  target="blank"><b>* Note:</b> Architect creates a many supporting resources!</a>
## Proxy Public

Lambda is _very good_ at reading and processing text from S3. To enable the default proxy add the following to the root Lambda:

```javascript
// src/http/get-index/index.js
let arc = require('@architect/functions')
exports.handler = arc.http.proxy.public()
```

Now all static assets in `./public` will be served from the root of your application.

The `arc.http.proxy.public` function accepts an optional configuration param `spa` which will force loading `index.html` no matter what route is invoked (note however that routes defined in `.arc` will take precedence). 

```javascript
// src/http/get-index/index.js
let arc = require('@architect/functions')
exports.handler = arc.http.proxy.public({spa: true})
```

Set `{spa:false}`, or omit, if you want the proxy to return a `404` error when a directory or file does not exist. 

> Bonus: when `404.html` is present that file will be returned

## Alias for Pretty URLs

The `arc.http.proxy.public` accepts an `alias` configuration object for mapping pretty URLs:

```javascript
// src/http/get-index/index.js
let arc = require('@architect/functions')

exports.handler = arc.http.proxy.public({
  alias: {
    '/home': '/templates/home.html',
  }
})
```

## Proxy Plugins

The `arc.proxy.public` can be further augmented with per filetype transform plugins. Each key in `plugins` is a file extension for processing with an array of transform plugins to run anytime that filetype is matched.

The first use case for this feature is to fix URLs. API Gateway creates ugly URLs by default appending `/staging` and `/production` to the application root. This pain goes away once you setup DNS but setting up static sites is much more complicated because most tools do not expect these paths. 

This demonstrates using proxy plugins to transform all links so they are prefixed with the correct URL. 

```javascript
// src/http/get-index/index.js
let arc = require('@architect/functions')

exports.handler = arc.proxy.public({
  plugins: {
    html: ['@architect/proxy-plugin-html-urls'],
    css: ['@architect/proxy-plugin-css-urls'],
    mjs: ['@architect/proxy-plugin-mjs-urls'],
    md: [
      '@architect/proxy-plugin-md',
      '@architect/proxy-plugin-html-urls'
    ]
  },
  alias: {
    '/': '/home.md',
    '/about': '/about.md',
    '/contact': '/contact.md'
  }
})
```

While not necessary until DNS is set up it's super helpful. Transform plugins open the door to other useful capabilities for authoring dynamic single page apps. 

Architect supports the following transform plugins:

*prototyping*

- `@architect/proxy-plugin-html-urls` adds `/staging` or `/production` to HTML elements
- `@architect/proxy-plugin-css-urls` adds `/staging` or `/production` to CSS `@imports` statements
- `@architect/proxy-plugin-mjs-urls` adds `/staging` or `/production` to JS module `import` statements

*esmodules*

- `@architect/proxy-plugin-bare-imports` map bare imports to fully qualified URLs

*syntax transpilers*

- `@architect/proxy-plugin-jsx/react` transpile JSX into `React` calls
- `@architect/proxy-plugin-jsx/preact` transpile JSX into `h` calls
- `@architect/proxy-plugin-tsx/react` transpile TSX into `React` calls
- `@architect/proxy-plugin-tsx/preact` transpile TSX into `h` calls
- `@architect/proxy-plugin-md` transpile Markdown into HTML
- `@architect/proxy-plugin-sass` transpile SCSS into CSS

*release*

- `@architect/proxy-plugin-html-min` minify HTML
- `@architect/proxy-plugin-css-min` minify CSS 
- `@architect/proxy-plugin-mjs-min` minify JS

---
