---
title: Static assets
category: Frontend
description: Architect projects support text and binary static assets such as images, styles, and scripts.
---

Architect projects support text and binary static assets such as images, styles, and scripts. By default `@static` assets live locally in the `/public` folder at the root of your project and in an S3 bucket once deployed.

## `@static` configuration

- `fingerprint` - **boolean** or **string** (defaults to false)
  - Enable long-lived caching headers by static asset file fingerprinting
- `folder` - **string** (defaults to `./public`)
  - Designate the local folder to upload static assets from.
- `ignore` - **list**
  - Define which assets in the static `folder` should be ignored during upload
- `prefix` - **string**
  - Set a top-level directory in the S3 bucket where files will be deployed
- `prune` - **boolean** (defaults to false)
  - Automatically remove assets from S3 bucket not found in the static `folder`
- `spa` - **boolean** (defaults to false)
  - Enable "Single Page App" delivery: all page requests route to the root.

> Tip: `@static` assets are available at `/_static` which makes them **same-origin** ✨

### `fingerprint`

When set to `true`, fingerprinting adds a unique SHA to a file name based on the file content before uploading to S3. The file can then be cached effectively forever. Whenever the contents of the file changes so does the SHA invalidating the cache.

```arc
@static
fingerprint true
```

The Node.js runtime helper, [`@architect/functions`, provides a `static`](../../reference/runtime-helpers/node.js#arc.static) method to help create a path for a given fingerprinted asset. See [below for an example](#fingerprinted-file-paths).


By setting fingerprinting to `external`, the file name is not changed before uploading to S3. You should only do this if you can ensure that the file name changes when you change the file content. This setting is incompatible with the Node.js runtime helper mentioned above.

```arc
@static
fingerprint external
```

### `folder`

Use a custom folder name or path for static assets.

```arc
@static
folder dist
```

Architect will expect assets in the folder `dist` at the root of your project.

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

> Note: this setting is not accounted for in [`@architect/functions`'s `static` method](../../reference/runtime-helpers/node.js#arc.static).

### `prune`

Tell Architect to automatically delete files from the S3 bucket that do not exist in the next deployment. Effectively the same as running `arc deploy` with the `--prune` flag. Useful for removing old fingerprinted assets and keeping your bucket tidy.

```arc
@static
prune true
```

### `spa`

Enable "Single Page Applications" by transforming and redirecting requests to root path. This will allow `/index.html` to handle any requests that do not match a declared [`@http`](../../reference/project-manifest/http) function.

In the following example, pointing a browser to `/`, `/people`, `/any/path`, etc. will render index.html. Getting `/api` will not.

```arc
@http
get /api

@static
spa true
```

## Deployment

`arc deploy --static` deploys static assets to `staging` from `public/` or configured folder.
`arc deploy --static --production` deploys static assets to `production` from `public/` or configured folder.

Static assets will also be uploaded during an `arc deploy` along with your function code.

`arc deploy --static --prune` deletes static assets from the S3 bucket that are not present in the configured static asset folder.

## Fingerprinted file paths

To get the path for generated files at runtime use `arc.static` from `@architect/functions`, the [Architect Node.js runtime helper](../../reference/runtime-helpers/node.js#arc.static).

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
