# Static Assets
## Mix frontend code with fast HTTP functions

Architect projects support text and binary assets such as images, styles, and scripts. These assets are available directly from the root of any app on the same domain as HTTP functions enabling session support and database access without *CORS* or *3rd party proxies*.

---

- <a href=#local><b>🚜 Work locally</b></a> without reloading
- <a href=#provision><b>🌾 Provision</b></a> a bucket on S3 with all the right permissions to proxy 
- <a href=#deploy><b>🛳 Deploy</b></a> anytime with (and without) CloudFormation
- <a href=#serialize><b>🥣 Serialize</b></a> to avoid unnecessary Lambda invocations serving them via API Gateway mocks
- <a href=#proxying><b>✨ Proxying</b></a> assets through API Gateway directly or via Lambda
- <a href=#fingerprint><b>🔎 Fingerprint</b></a> files and cache them forever while still maintaining instant deployment
- <a href=#ignore><b>🙈 Ignore</b></a> files in public
* <a href=#link><b>🕸 Link</b></a> to the right file at runtime

---

<h2 id=local>🚜 Work Locally</h2>

Running `arc sandbox` mounts `public/` at `http://localhost:3333/_static`. <a href=#proxy>Read about proxy</a> to mount to the root.

Some frontend JavaScript workflows involve a build step, in which case the `public/` folder can be considered a staging area for build artifacts.

> 💡 **Protip:** Architect works with any module bundler like [Browserify](http://browserify.org/), [Parcel](https://parceljs.org/) or [Webpack](https://webpack.js.org/) 

---

<h2 id=provision>🌾 Provision</h2>

Given the following `.arc` file:

```arc
@app
my-site

@static
@http
get /
```

Running `arc deploy` will setup create the following resources:

- `AWS::S3::Bucket`
- `AWS::Serverless::Api`
- `AWS::Lambda::Function` *

All Lambdas will have `process.env.ARC_STATIC_BUCKET` environment variable with the generated S3 bucket name. The generated API can proxy to the S3 bucket at the root with the help of Lambda and by-passes Lambda altogether with a direct proxy at `/_static`.

<a href="/api/1/package?arc=%40app%0Atestapp%0A%40static%0A%40http%0Aget%20%2F%0A" 
  target="blank"><b>* Note:</b> Architect creates a many supporting resources!</a>

---

<h2 id=deploy>🛳 Deploy</h2>

- `arc deploy` copies `public/` to staging S3 bucket after running a full CloudFormation stack update
- `arc deploy production` copies `public/` to a production S3 bucket after running a full CloudFormation stack update
- `arc deploy static` immediately copies `public/` directly to S3
- `arc deploy static production` immediately copies `public/` directly to S3

> ⛳️ Protip: `arc deploy static --delete` will remove files from the bucket that are no longer locally present

---

<h2 id=serialize>🥣 Serialize</h2>

_This is an experimental feature._ Serialize static assets directly into API Gateway as mocks. 

Benefits
- Minimize network traffic
- Save on Lambda invocations

Downsides
- Requires a CloudFormation stack update to deploy which is slower than syncing a file to S3
- Can quickly bloat the generated CloudFormation template to max

Currently supported file types
- html
- css
- js
- mjs
- svg

Opt in:
```arc
@app
testapp

@static
serialize true

@http
get /
```

Running `arc deploy` will serialize `public/` into `sam.json`.

---

<h2 id=proxy>✨ API Gateway Proxy</h2>

To workaround CORS you can proxy S3 directly through API Gateway at `/_static`.

<h2>⚡️ Lambda Proxy</h2>

Lambda is _very good_ at reading and processing text from S3. To enable the proxy at the root add the following to the `get-index` HTTP function:

```javascript
// src/http/get-index/index.js
let arc = require('@architect/functions')

exports.handler = arc.http.proxy()
```

Now all static assets in `./public` will be served from the root of the application.

The `arc.http.proxy` function accepts an optional configuration param `spa` which will force loading `index.html` no matter what route is invoked (note however that routes defined in `.arc` will take precedence). 

```javascript
// src/http/get-index/index.js
let arc = require('@architect/functions')

exports.handler = arc.http.proxy({spa:true})
```

Set `{spa:false}`, or omit, if you want the proxy to return a `404` error when a directory or file does not exist. 

> Bonus: when `404.html` is present that file will be returned

## Alias for Pretty URLs

The `arc.http.proxy` accepts an `alias` configuration object for mapping pretty URLs:

```javascript
// src/http/get-index/index.js
let arc = require('@architect/functions')

exports.handler = arc.http.proxy({
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

exports.handler = arc.http.proxy({
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

### 🐢 Example Code

The website you are currently reading! https://github.com/architect/arc.codes

---

<h2 id=fingerprint>🔎 Fingerprint</h2>

To enable file fingerprinting add `fingerprint true` to the `@static` pragma:

```
@static
fingerprint true
```

---

<h2 id=ignore>🙈 Ignore</h2>

You can instruct Architect to ignore files from your `public/` directory with the `ignore` directive, like so:
```
@static
ignore
  zip
  tar
```

This works with a simple string search, so if you ignore `foo`, all filenames containing `foo` (or files with paths containing `foo`) will be ignored.

> By default, Architect ignores `.DS_Store`, `node_modules`, and `readme.md` files

---

<h2 id=link>🕸 Link</h2>

If you need to link to S3 resources directly `arc.static` accepts a root relative path and returns the URL appropriate for the environment it is being invoked in. 

```javascript
// src/http/get-index/index.js
let arc = require('@architect/functions')
let static = arc.static

exports.handler = async function http(req) {
  let body = `
    <!doctype html>
    <html>
      <head>
        <title>This is fun!</title>
        <link rel=stylesheet type=text/css href=${static('/main.css')}>
      </head>
      <body>Hello ƛ</body>
      <script src=${static('/main.js')}></script>
    </html>
  `
  return {
    type: 'text/html',
    body
  }
}
```

> Note: To avoid CORS errors use the API Gateway `/_static` proxy to S3

---
