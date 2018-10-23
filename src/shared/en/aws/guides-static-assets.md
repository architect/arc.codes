# Static Assets

## Automatically build and deploy your static assets


Static assets are crucial infrastructure for building ambitious web apps. While `.arc` does not have any opinion about how you should achieve that part, it can provision and automatically deploy to isolated S3 buckets for your app's `staging` and `production` environments.

To support this, every `.arc` project is set up with a `public` directory in the root of your project. The `public` directory provides a seamless way to work with static assets such as images, styles, and scripts required in your front-end workflows.


## Provisioning

Given the following `.arc` file:

```arc
@app
static-site

@static
staging my-unique-bucket-staging
production my-unique-bucket
```

Running `npx create` will generate the two designated `staging` and `production` S3 buckets.

> ⚠️ Warning: S3 buckets are _globally_ unique to all of AWS so you may have to try a few names


## Working Locally with `public`

Running `npx sandbox` kicks up a sandbox web server (more here about [working locally](/guides/offline)). The folder `public` at the root of your project will be mounted locally when you run the web server with `npx sandbox`.

Any file added to this `public` folder will be served (along with any HTTP funtions you've defined).

Most frontend JavaScript workflows involve some sort of build step, so the `public` folder is a staging area for those build artifacts (along with whatever else you'd like to use it for, of course).

The simplest possible build script defined in `package.json`:

```json
{
  "build": "cp -r src/shared/client public",
  "start": "npm run build && npx sandbox"
}
```

Running the script defined above with `npm run build` just blindly copies files from `src/shared/client` to `public`. (This could definitely be enhanced by using a module bundler like [Browserify](http://browserify.org/), [Parcel](https://parceljs.org/) or [Webpack](https://webpack.js.org/) depending on your needs!)

Running `npm start` builds the JS and starts a local web server on `http://localhost:3333` for previewing.


## Deploying `public`

Running `npx deploy` copies `public` to the `staging` bucket. (If you want to version these assets in S3, you can [enable that feature](https://docs.aws.amazon.com/AmazonS3/latest/dev/Versioning.html) in the AWS Console.)

Alternately you could consider these build artifacts (which they are) and treat your version control system as the place to manage versions (which it is). 😶

Running `ARC_DEPLOY=production npx deploy` copies `public` to the production bucket.

And, of course, it would be wise to use both of these S3 buckets as origins for your CDN (we're partial to AWS CloudFront).

> 🏌️‍♀️Protip: `npx deploy static` will deploy the static assets _only_


## Linking

Isolation is key to creating a continuous delivery pipeline. It's good to work on our local machines, deploy to a staging environment, and promote to production with total confidence that the system is only improving. Static assets are no different!

As such, there are three environments you need to be concerned about for addressing your static assets:

- Local:
> `http://localhost:3333/<asset>`
- Staging:
> `https://s3-<aws region>.amazonaws.com/<staging bucket>/<asset>`
- Production:
> `https://s3-<aws region>.amazonaws.com/<production bucket>/<asset>`

This is an example production url from a testing app:
> `https://s3-us-west-1.amazonaws.com/arc-testapp-production/babybeaver.jpg`


## Calling static URLs

`@architect/functions` bundles a helper function for HTTP route handlers that disambiguates URLs called `arc.http.helpers.static`. It accepts a relative path and returns the URL appropriate for the environment it's being invoked in.

```javascript
// src/http/get-index/index.js
let arc = require('@architect/functions')
let static = arc.http.helpers.static

exports.handler = async function http(req) {
  let css = static('/main.css')
  let js = static('/main.js')
  let body = `
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
  return {
    type: 'text/html',
    body
  }
}
```


## Get an HTML file stored in S3

This example shows you how to return an HTML file stored in a S3 bucket. Buckets are defined in your `.arc` in the `@static` section. You can return HTML files that you deployed from `public` or files uploaded by another method.

```javascript
// src/html/get-index/index.js
let arc = require('@architect/functions')
let aws = require('aws-sdk')

function route(req, res) {
  let s3 = new aws.S3()
  var bucket
  if (process.env.NODE_ENV === 'production') {
    bucket = "PRODUCTION_BUCKET" // The name you used in .arc for @static production
  } else if (process.env.NODE_ENV === 'staging') {
    bucket = "STAGING_BUCKET" // The name you used in .arc for @static staging
  }
  var getParams = {
    Bucket: bucket,
    Key: 'index.html'
  }

  s3.getObject(getParams, function(err, data) {
    if (err)
      console.log(err)
    res({html: data.Body.toString()})
  });
}

exports.handler = arc.html.get(route)
```


## Go farther

A few ideas going even further with static assets:
- Enhance the build pipeline with a JS bundler
- Build files with unique identifiers to bust caches
- Set up a CloudFront (the AWS CDN) distribution for the `production` bucket
- Write a helper to include scripts on only the pages that need them

<hr>


## Next: [Implement CORS](/guides/cors)
