# Static Assets 

> S3 buckets for `staging` and `production`

Static assets are crucial infrastructure for building ambitous web apps. `.arc` does not have any opinion about how you should achieve that part, however, it will provision a bucket for each of the app environments and give you automatic deployments to them.

## Provisioning

Given the following `.arc` file:

```arc
@app
static-site

@static
staging my-unique-bucket-staging
production my-unique-bucket
```

Running `npm run create` will generate the two S3 buckets. 

> ⚠️ Warning: S3 buckets are _globally_ unique to all of AWS so you may have to try a few names

## Working Locally with `.static`

Running `npm start` kicks up a sandbox web server. If the folder `.static` exists it will be mounted to serve static assets along with any routes defined in `@html` or `@json`. Most frontend JavaScript workflows involve some sort of build step. So the `.static` folder is a staging area for those build artifacts. 

The simplest possible build script defined in `package.json`:

```json
{
  "build": "cp -r src/shared/client .static",
  "start": "npm run build && AWS_PROFILE=personal AWS_REGION=us-west-1 NODE_ENV=testing arc-sandbox"
}
```

Running `npm run build` just blindly copies files from `src/shared/client` to `.static`. This could definitely be enhanced by using a module bundler like Browserify, Parcel or Webpack depending on your team needs! 

Running `npm start` builds the JS and starts a local web server on `http://localhost:3333` for previewing.

> ⛳️ Tip: add `.static` to your `.gitignore`

### Deploy

Running `npm run deploy` copies `.static` to the staging bucket. If you want versions you can turn those on for the S3 bucket in the AWS Console. Alternately you could consider these build artifacts (which they are) and treat your revision control system as the place to manage versions (which it is). 😶

Running `ARC_DEPLOY=production npm run deploy` copies `.static` to the production bucket. 

> 🏌️‍♀️Protip: `npm run deploy static` will deploy the static assets _only_

## Linking

Isolation is 🗝 to creating a continuous delivery pipeline. We want to work on our local machines, deploy to a staging environment and promote to production with total confidence the system is only improving. Static assets are no different!

As such, there are three environments you need to be concerned about for addressing your static assets:

- Locally `http://localhost:3333/asset-name.js`
- On `staging`: `https://s3-<aws region>.amazonaws.com/<staging bucket name>/<asset name>`
- Or `production`: `https://s3-<aws region>.amazonaws.com/<production bucket name>/<asset name>`

This is an example production url from a testing app: `https://s3-us-west-1.amazonaws.com/arc-testapp-production/babybeaver.jpg`.

`@architect/functions` bundles a hidden helper function for HTTP route handlers that disambiguates URLs called `req._static`. It accepts a path and returns the URL appropriate for the environemtn it is being invoked in.

```javascript
let arc = require('@architect/functions')

function route(req, res) {
  let css = req._static('/main.css')
  let js = req._static('/main.js')
  let html `
  <!doctype html>
  <html>
  <head>
    <title>This is fun!</title>
    <link rel=stylesheet type=text/css href=${css}>
  </head>
  <body>Hello ƛ</body>
  <script src=${js}></script>
  </html>
  `
  res({html})
}

exports.handler = arc.html.get(route)
```

Go farther:

- Enhance the build pipeline with a JS bundler
- Build files with unique identifiers to bust caches
- Setup a CloudFront distribution for the `production` bucket
- Write a helper to include scripts on only the pages that need them

<hr>
## Next: [Persist Data](/guides/data)
