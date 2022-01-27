---
title: '@static'
category: app.arc
description: Define S3 bucket
---

Configure the static asset S3 bucket.

## Syntax

- No parameters are required; `@static` is implied if `@http` is defined
- `folder` defines the folder to upload static assets from. Default is `public`
- `fingerprint` enables static asset file fingerprinting (and long-lived caching headers)
- `ignore` defines which assets to be ignored during upload

## Example

This `app.arc` file defines a static bucket:

<arc-viewer default-tab=arc>
<div slot=contents>

<arc-tab label=arc>
<h5>arc</h5>
<div slot=content>

```arc
@app
testapp

@static
fingerprint true
ignore
  .tar.gz
  tmp
  user
```
</div>
</arc-tab>

<arc-tab label=json>
<h5>json</h5>
<div slot=content>

```json
{
  "app": "testapp",
  "static": {
    "fingerprint": true,
    "ignore": [
      ".tar.gz",
      "tmp",
      "user"
    ]
  }
}
```
</div>
</arc-tab>

<arc-tab label=yaml>
<h5>yaml</h5>
<div slot=content>

```yaml
---
app: testapp

static:
  fingerprint: true
  ignore:
    - ".tar.gz"
    - "tmp"
    - "user"
```
</div>
</arc-tab>

</div>
</arc-viewer>

> 📜  The [Frontend Static assets guide](/docs/en/guides/frontend/static-assets) has more information on how to use static assets in your Architect project.

## Deployment

`arc deploy --static` deploys static assets to `staging` from `public/` or configured folder.
`arc deploy production --static` deploys static assets to `production` from `public/` or configured folder.

Static assets will also be uploaded during an `arc deploy` along with your function code.

`arc deploy static --delete` deletes static assets from the S3 bucket that are not present in the configured static asset folder.

`arc deploy static --prune` is an alias to delete.


