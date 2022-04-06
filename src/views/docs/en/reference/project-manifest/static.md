---
title: '<code>@static</code>'
category: app.arc
description: Define S3 bucket
---

Configure the static asset S3 bucket deployed by Architect.

Note: `@static` is implied if `@http` is defined.

## Syntax

All parameters are optional.

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

## Example

This `app.arc` file defines a static bucket:

<arc-viewer default-tab=arc>
<div slot=contents>

<arc-tab label=arc>
<h5>arc</h5>
<div slot=content>

```arc
@app
test-app

@static
fingerprint true
folder ./dist
ignore
  .tar.gz
  tmp
  user
prune true
prefix assets
```
</div>
</arc-tab>

<arc-tab label=json>
<h5>json</h5>
<div slot=content>

```json
{
  "app": "test-app",
  "static": {
    "fingerprint": true,
    "folder": "./dist",
    "ignore": [
      ".tar.gz",
      "tmp",
      "user"
    ],
    "prune": true,
    "prefix": "assets"
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
  folder: ./dist
  ignore:
    - ".tar.gz"
    - "tmp"
    - "user"
  prune: true
  prefix: assets
```
</div>
</arc-tab>

</div>
</arc-viewer>

> 📜  The [Frontend Static assets guide](/docs/en/guides/frontend/static-assets) has more information on how to use static assets in your Architect project.
