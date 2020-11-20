---
title: Static
description: Architect projects support text and binary assets such as images, styles, and scripts.
sections:
  - Overview
  - Fingerprint
  - Folder
  - Ignore
  - Serialize
  - Linking
  - Staging
  - Production
---

## Overview

Architect projects support text and binary assets such as images, styles, and scripts. These assets are available directly from the root of your app on the same domain as HTTP functions. They are available to you by provisioning your own S3 bucket with the `@static` pragma and sending requests to Amazon S3 using the REST API. 

The `@static` pragma utilizes [**Amazon Simple Storage Service (Amazon S3)**](https://aws.amazon.com/s3/). Amazon S3 is an object storage service that offers industry-leading scalability, data availability, security, and performance. It is the original serverless primitive. 

Architect projects support a `public/` directory in the root of your project for static assets. The `public/` directory typically includes static assets such as images, styles, and scripts required in your front-end workflows. Anything in `public/` directory is available at `http://localhost:3333/_static/` when running in the sandbox. For `production` and `staging` environments, Architect can have `staging` and `production` S3 buckets for file syncing from the `public/` folder. They'll be available at `https://yourapi.com/_static` once deployed.

**`@static` defines S3 buckets for hosting static assets, uploaded from public/ folder**

- Requires two arguments: staging and production
- Each argument should be followed by a valid globally unique S3 bucket name
- Accepts fingerprint setting, enabling static asset file fingerprinting (and long-lived caching headers)
- Accepts ignore, which ignores files from public/ folder

> Note: S3 buckets are global to AWS so if at first you don't succeed, try picking another bucket name

The `arc.static` helper resolves URL paths for your static assets, so you're requesting the right file from every environment.

And if you've enabled fingerprinting, `arc.static` also resolves the unique fingerprinted filename in staging and production environments.

**Section Contents**
[Fingerprint](#fingerprint)
[Folder](#folder)
[Ignore](#ignore)
[Serialize](#serialize)
[Linking](#linking)
[Staging](#staging)
[Production](#production)

## Fingerprint

If you are behind `@cdn` you will want to enable file fingerprinting to ensure content is both cached and updates are immediately available:

To enable file fingerprinting, add `fingerprint true` to your `@static` pragma, e.g.:

```bash
@static
staging my-unique-bucket-staging
production my-unique-bucket
fingerprint true
```

## Folder

Running `npx sandbox` kicks up a sandbox web server. The folder `public/` at the root of your project will be mounted at `/_static` when you run the web server with `npx sandbox`.

Any file added to this `public/` folder will be served (along with any HTTP functions you've defined).

Most frontend JavaScript workflows involve some sort of build step, so the `public/` folder is a staging area for those build artifacts (along with whatever else you'd like to use it for, of course).

The simplest possible build script defined in `package.json`:

```json
{
  "build": "cp -r src/shared/client public",
  "start": "npm run build && npx sandbox"
}
```
Running the script defined above with `npm run build` just blindly copies files from `src/shared/client` to `public/`.

Running `npm start` builds the JS and starts a local web server on `http://localhost:3333` for previewing.

## Ignore

You can instruct Architect to ignore files from your `public/` directory with the `ignore` directive, like so:

```bash
@static
staging my-unique-bucket-staging
production my-unique-bucket
ignore
  zip
  tar
```
This works with a simple string search, so if you ignore foo, all filenames containing foo (or files with paths containing foo) will be ignored.

> By default, Architect ignores `.DS_Store`, `node_modules`, and `readme.md` files

## Serialize

This is an experimental feature. Serialize static assets directly into API Gateway as mocks.

**Benefits**
- Minimize network traffic
- Save on Lambda invocations

**Downsides**
- Requires a CloudFormation stack update to deploy which is slower than syncing a file to S3
- Can quickly bloat the generated CloudFormation template to max

**Currently supported file types**
- html
- css
- js
- mjs
- svg

Opt in:

```bash
@app
testapp

@static
serialize true

@http
get /
```

> Running `arc deploy` will serialize `public/` into `sam.json`.

## Linking

Isolation is key to creating a good continuous delivery pipeline. It's good to be able to work on our local machines, deploy to a staging environment, and promote to production with total confidence that the system is only improving. Static assets are no different!

As such, there are three environments you need to be concerned about for addressing your static assets:

- Local:
> `http://localhost:3333/_static/<asset>`
- Staging:
> `https://<staging bucket>.s3.<aws region>.amazonaws.com/<asset>`
- Production:
> `https://<production bucket>.s3.<aws region>.amazonaws.com/<asset>`

This is an example production URL from a testing app:
> `https://arc-testapp-production.us-west-1.s3.amazonaws.com/babybeaver.jpg`

### Calling static URLs

`@architect/functions` bundles a helper function for HTTP route handlers that disambiguates URLs called `arc.static`. It accepts a relative path and returns the URL appropriate for the environment it's being invoked in.

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
      <script src=${static('main.js')}></script>
    </html>
  `
  return {
    type: 'text/html',
    body
  }
}
```

## Staging

Your staging environment is one step away from full production. This is where you can test your updates for quality assurance. The staging environment ensures that no major bugs make it into production and that you can be confident that your updates work as planned.

## Production

This is the final destination in your CI/CD pipeline. Production is the front facing product that you your users interact with. This is why we have a stage in between local development and Production. No major bugs should end up this far in our CI/CD pipeline.
