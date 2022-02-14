---
title: Single page apps
category: Frontend
description: Static and dynamic API endpoints coexisting at the same origin
sections:
  - Overview
  - Static and dynamic API endpoints coexisting at the same origin
  - Proxy Public
  - Aliasing
  - Proxy Plugins
  - Serverless Site Rendering
  - Example
---

## Overview

There are many ways to build a single-page application. Larger applications can benefit from using a frontend library and bundler. Various libraries help us organize code, and the bundler helps us package it for optimal production delivery. In this tutorial, we will go over some common patterns you should use to build single-page-apps with Architect complete with an example SPA at the end.

**Sections**
- [Static and dynamic API endpoints coexisting at the same origin](#static-and-dynamic-api-endpoints-coexisting-at-the-same-origin)
- [Proxy Public](#proxy-public)
- [Aliasing](#aliasing)
- [Proxy Plugins](#proxy-plugins)
- [Serverless Site Rendering](#serverless-site-rendering)
- [Example](#example)


## Static and dynamic API endpoints coexisting at the same origin

Architect provides two methods to proxy static assets through API Gateway. This means your single page application and API can share the same domain name, session support and database access *without CORS* and *without 3rd party proxies*.

For this guide we'll use the following `app.arc` file:

```arc
@app
spa

@http
get /

@static
staging spa-stage-bukkit
production spa-prod-bukkit
```

> 👉🏽  Note: S3 buckets are global to all of AWS so you may need to try a few different names!

## Proxy Public

Lambda is _very good_ at reading and processing text from S3. To enable the proxy add the following to the root Lambda:

```javascript
// src/http/get-index/index.js

let arc = require('@architect/functions')

exports.handler = arc.proxy.public()
```

Now all static assets in `./public` will be served from the root of your application.

The `arc.proxy.public` function accepts an optional configuration param `spa` which will force loading `index.html` no matter what route is invoked (note however that routes defined in `app.arc` will take precedence).

```javascript
// src/http/get-index/index.js

let arc = require('@architect/functions')

exports.handler = arc.proxy.public({spa:true})
```

Set `{spa:false}`, or omit, if you want the proxy to return a `404` error when a directory or file does not exist.

> **Bonus:** when `404.html` is present that file will be returned

> **Quirks** - No binary files: images, audio video need to be served via S3 static URLs

## Aliasing

The `arc.proxy.public` accepts an `alias` configuration object for mapping pretty URLs:

```javascript
// src/http/get-index/index.js

let arc = require('@architect/functions')

exports.handler = arc.proxy.public({
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

- **prototyping**
  - `@architect/proxy-plugin-html-urls` adds `/staging` or `/production` to HTML elements
  - `@architect/proxy-plugin-css-urls` adds `/staging` or `/production` to CSS `@imports` statements
  - `@architect/proxy-plugin-mjs-urls` adds `/staging` or `/production` to JS module `import` statements

- **ES modules**
  - `@architect/proxy-plugin-bare-imports` map bare imports to fully qualified URLs

- **syntax transpilers**
  - `@architect/proxy-plugin-jsx/react` transpile JSX into `React` calls
  - `@architect/proxy-plugin-jsx/preact` transpile JSX into `h` calls
  - `@architect/proxy-plugin-tsx/react` transpile TSX into `React` calls
  - `@architect/proxy-plugin-tsx/preact` transpile TSX into `h` calls
  - `@architect/proxy-plugin-md` transpile Markdown into HTML
  - `@architect/proxy-plugin-sass` transpile SCSS into CSS

- **release**
  - `@architect/proxy-plugin-html-min` minify HTML
  - `@architect/proxy-plugin-css-min` minify CSS
  - `@architect/proxy-plugin-mjs-min` minify JS

## Serverless Site Rendering

Prerendering content is great for performance but sometimes you need complete control of the initial HTML payload. In these cases you can enable `ssr` by giving it a module or function to run whenever `index.html` is requested.

```javascript
// src/http/get-index/index.js

let arc = require('@architect/functions')
let myRenderFun = require('@architect/views/my-render-fun')

exports.handler = arc.proxy.public({

  // inline ssr function into config
  async ssr(req) {
    let headers = {'content-type':'text/html'}
    let body = await myRenderFun({state})
    return {headers, body}
  }
})
```

Or reference a local module:

```javascript
// src/http/get-index/index.js

let arc = require('@architect/functions')

exports.handler = arc.proxy.public({
  ssr: './render'
})
```

Or reference a Node module:

```javascript
// src/http/get-index/index.js

let arc = require('@architect/functions')

exports.handler = arc.proxy.public({
  ssr: '@architect/views/render'
})
```

## Example

There are many ways to build a single-page application. Larger applications can benefit from using a frontend library and bundler. Various libraries help us organize code, and the bundler helps us package it for optimal production delivery.

In this guide, we'll be using the frontend library [React](https://reactjs.org/) with the [Parcel bundler](https://parceljs.org). React is probably the most popular framework and works with many bundlers, but we like Parcel because of its speed and simplicity.

1. Create a fresh Architect project

Initialize an Architect project, change directories into the project folder, create a `package.json` file, and install NPM packages:

<arc-viewer default-tab=bash>
<div slot=contents>
<arc-tab label=bash>
<h5>Bash/cmd.exe</h5>
<div slot=content>

```bash
npm init @architect --static ./my-spa
cd my-spa
npm init -f
npm install react react-dom parcel-bundler @architect/sandbox
```
</div>
</arc-tab>

<arc-tab label=PowerShell>
<h5>PowerShell</h5>
<div slot=content>

```powershell
npm init "@architect" --static ./my-spa
cd my-spa
npm init -f
npm install react react-dom parcel-bundler @architect/sandbox
```
</div>
</arc-tab>
</div>
</arc-viewer>

2. Update the build folder configuration in `app.arc`

Edit the `app.arc` file in the root of your project directory so it shows the following:

```arc
@app
my-spa

@static
folder dist
```

3. Update the build script

Add the following start script to your `package.json` file:

```javascript
"scripts": {
  "start": "parcel public/index.html & sandbox"
}
```

4. Update `public/index.html`

Replace the contents of your `index.html` file with the following:

```html
<!doctype html>
<html>
<body>
<div id=app></div>
<script src=/index.js></script>
</body>
</html>
```

5. Add `public/index.js`

Create an `index.js` file and add the following to it:

```javascript
import React from "react";
import ReactDOM from "react-dom";

class HelloMessage extends React.Component {
  render() {
    return <div>Hello {this.props.name}</div>;
  }
}

var mountNode = document.getElementById("app");
ReactDOM.render(<HelloMessage name="Jane" />, mountNode);
```

6. Preview your app by starting the dev server

```bash
npm start
```
