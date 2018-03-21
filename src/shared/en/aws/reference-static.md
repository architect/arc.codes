# `@static`

## `@static` defines S3 buckets for static asset hosting

This `.arc` file defines static buckets:

```arc
@app
testapp

@static
staging test-bukkit
production main-bukkit
```

> Note: S3 buckets are <b>global</b> to AWS so if you don't first succeed try picking another bucket name

Locally, if the hidden folder `/.static` exists, whenever you run `npm run deploy` the contents are synchronized to the `staging` bucket. If you set `ARC_DEPLOY=production` the contents of `/.static` are deployed to the production bucket. This allows the frontend dev to use whatever build tooling they like (ParcelJS, Webpack, Browserify, Babel, etc).

## Next: [create `@tables`](/reference/tables)
