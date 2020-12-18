---
title: Static assets
description: Architect projects support text and binary static assets such as images, styles, and scripts.
---

Architect projects support text and binary static assets such as images, styles, and scripts. By default `@static` assets live in the `/public` folder locally and an S3 bucket once deployed.

## `@static` configuration

- `folder public` configures the deployment folder (default is `public`)
- `fingerprint true` enables asset fingerprinting (default is `false`)
- `ignore` asset to ignore from deployment to S3

> Tip: `@static` assets are available at `/_static` which makes them **same-origin**

### `folder`

```arc
@static
folder dist
```

### `fingerprint`

Fingerprinting adds a unique SHA to a file name based on the file content before uploading to S3. The file can then be cached effectively forever. Whenever the contents of the file changes so does the SHA invalidating the cache. 

Enable fingerprinting:

```arc
@static
fingerprint true
```

### `ignore`

Ignore zip and tar files in the `@static` folder:

```arc
@static
ignore
  zip
  tar
```

Ignore is greedy. For example if you ignore "foo", all filenames containing "foo" (or files with paths containing foo) will be ignored.

> By default, Architect ignores `.DS_Store`, `node_modules`, and `readme.md` files

### Referencing fingerprinted file paths at runtime

To get the path for generated files at runtime use `arc.static`.

```javascript
// src/http/get-index/index.js
let arc = require('@architect/functions')

exports.handler = async function http () {
  let html = `
    <!doctype html>
    <html>
      <head>
        <title>This is fun!</title>
        <link rel=stylesheet type=text/css href=${ arc.static('/index.css') }>
      </head>
      <body>Hello ƛ</body>
      <script src=${ arc.static('/index.js') }></script>
    </html>
  `
  return {
    type: 'text/html',
    body: html.trim()
  }
}
```

> Tip: `arc.http.proxy` will automatically redirect to fingerprinted file paths
