# Static (`arc.static`)

## Automatically build and deploy your static assets

Architect projects support a `public/` directory in the root of your project for static assets. The `public/` directory typically includes static assets such as images, styles, and scripts required in your front-end workflows.

Anything in  `public/` directory is available at `http://localhost:3333/_static/` when running in the sandbox.

For `production` and `staging` environments, Architect can have `staging` and `production` S3 buckets for file syncing from the `public/` folder - they'll be available at `https://yourapi.com/_static` once deployed.

The `arc.static` helper resolves URL paths for your static assets, so you're requesting the right file from every environment.

And if you've enabled fingerprinting, `arc.static` also resolves the unique fingerprinted filename in staging and production environments.


## Provisioning

Given the following `.arc` file:

```arc
@app
static-site

@static
staging my-unique-bucket-staging
production my-unique-bucket
```

Running `npx create` will generate `staging` and `production` S3 buckets.

> ⚠️ Warning: S3 buckets are _globally_ unique to all of AWS so you may have to try a few names.


## Fingerprinting

To enable file fingerprinting, add `fingerprint true` to your `@static` pragma, e.g.:
```
@static
staging my-unique-bucket-staging
production my-unique-bucket
fingerprint true
```


## Working Locally with `public/`

Running `npx sandbox` kicks up a sandbox web server (more here about [working locally](/guides/offline)). The folder `public/` at the root of your project will be mounted at `/_static` when you run the web server with `npx sandbox`.

Any file added to this `public/` folder will be served (along with any HTTP functions you've defined).

Most frontend JavaScript workflows involve some sort of build step, so the `public/` folder is a staging area for those build artifacts (along with whatever else you'd like to use it for, of course).

The simplest possible build script defined in `package.json`:

```json
{
  "build": "cp -r src/shared/client public",
  "start": "npm run build && npx sandbox"
}
```

Running the script defined above with `npm run build` just blindly copies files from `src/shared/client` to `public/`. (This could definitely be enhanced by using a module bundler like [Browserify](http://browserify.org/), [Parcel](https://parceljs.org/) or [Webpack](https://webpack.js.org/) depending on your needs!)

Running `npm start` builds the JS and starts a local web server on `http://localhost:3333` for previewing.


## Deploying `public/`

Running `npx deploy` copies `public/` to the `staging` bucket. (If you want to version these assets in S3, you can [enable that feature](https://docs.aws.amazon.com/AmazonS3/latest/dev/Versioning.html) in the AWS Console.)

Alternately you could consider these build artifacts (which they are) and treat your version control system as the place to manage versions (which it is). 😶

Running `ARC_DEPLOY=production npx deploy` copies `public/` to the production bucket.

And, of course, it would be wise to use both of these S3 buckets as origins for your CDN (we're partial to AWS CloudFront).

> 🏌️‍♀️ Protip: `npx deploy static` will deploy the static assets _only_

> ⛳️ Protip #2: `npx deploy [static] --delete` will remove files from the bucket that are no longer locally present


## Linking

Isolation is key to creating a continuous delivery pipeline. It's good to work on our local machines, deploy to a staging environment, and promote to production with total confidence that the system is only improving. Static assets are no different!

As such, there are three environments you need to be concerned about for addressing your static assets:

- Local:
> `http://localhost:3333/_static/<asset>`
- Staging:
> `https://<staging bucket>.s3.<aws region>.amazonaws.com/<asset>`
- Production:
> `https://<production bucket>.s3.<aws region>.amazonaws.com/<asset>`

This is an example production URL from a testing app:
> `https://arc-testapp-production.us-west-1.s3.amazonaws.com/babybeaver.jpg`


## Calling static URLs

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


## Ignoring files from `public/`

You can instruct Architect to ignore files from your `public/` directory with the `ignore` directive, like so:
```
@static
staging my-unique-bucket-staging
production my-unique-bucket
ignore
  zip
  tar
```

This works with a simple string search, so if you ignore `foo`, all filenames containing `foo` (or files with paths containing `foo`) will be ignored.

> By default, Architect ignores `.DS_Store`, `node_modules`, and `readme.md` files


See [the static reference](/reference/static) for more details.

<hr>

## Next: [Single Page Apps](/guides/spa)
