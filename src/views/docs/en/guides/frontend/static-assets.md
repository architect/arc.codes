---
title: Static assets
category: Frontend
description: Architect projects support text and binary static assets such as images, styles, and scripts.
---

Architect projects support text and binary static assets such as images, styles, and scripts. By default `@static` assets live locally in the `/public` folder at the root of your project and in an S3 bucket once deployed.

## `@static` configuration

- `fingerprint` - **boolean** (defaults to false)
  - Enable static asset file fingerprinting (and long-lived caching headers)
- `folder` - **string** (defaults to `./public`)
  - Designate the local folder to upload static assets from.
- `ignore` - **list** 
  - Define which assets in the static `folder` should be ignored during upload
- `prefix` - **string**
  - Set a top-level directory in the S3 bucket where files will be deployed
- `prune` - **boolean** (defaults to false)
  - Automatically remove assets from S3 bucket not found in the static `folder`
<!--
- `spa` - **boolean** (defaults to false)
  - Enable "Single Page App" delivery
-->

> Tip: `@static` assets are available at `/_static` which makes them **same-origin** ✨

### `fingerprint`

Fingerprinting adds a unique SHA to a file name based on the file content before uploading to S3. The file can then be cached effectively forever. Whenever the contents of the file changes so does the SHA invalidating the cache.

Enable fingerprinting:

```arc
@static
fingerprint true
```

### `folder`

```arc
@static
folder dist
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

### `prefix`

Advanced option to specify a top-level directory inside the S3 bucket to add static files to when deploying. In this example files from `./public` will be uploaded to `<your-bucket>/downloads/`:

```arc
@static
prefix downloads
```

> Note: locally in Sandbox HTTP paths to assets will be `/_static/archive.zip`, but once deployed will look like `/_static/downloads/archive.zip`. Additionally, this setting is not accounted for in [`@architect/functions`'s `static` method](../../reference/runtime-helpers/node.js#arcstatic).

### `prune`

Tell Architect to automatically delete files from the S3 bucket that do not exist in the next deployment. Effectively the same as the `arc deploy --prune` command. Useful for removing old fingerprinted assets and keeping your bucket tidy.

```arc
@static
prune true
```

<!--
### `spa`

```arc
@static
spa true
```
-->

## Deployment

`arc deploy --static` deploys static assets to `staging` from `public/` or configured folder.
`arc deploy --static --production` deploys static assets to `production` from `public/` or configured folder.

Static assets will also be uploaded during an `arc deploy` along with your function code.

`arc deploy --static --prune` deletes static assets from the S3 bucket that are not present in the configured static asset folder.

## Fingerprinted file paths

To get the path for generated files at runtime use `arc.static` from `@architect/functions`, the [Architect Node.js runtime helper](../../reference/runtime-helpers/node.js#arcstatic).

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
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: html.trim()
  }
}
```

> Tip: `arc.http.proxy` will automatically redirect to fingerprinted file paths
