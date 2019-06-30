# `@static`

> `@static` defines S3 buckets for hosting static assets, uploaded from `public/` folder

- Requires two arguments: `staging` and `production`
- Each argument should be followed by a valid [globally unique S3 bucket name](https://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html#bucketnamingrules)
- Accepts `fingerprint` setting, enabling static asset file fingerprinting (and long-lived caching headers)
- Accepts `ignore`, which ignores files from `public/` folder


### Example

This `.arc` file defines static buckets and their options:

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

> Note: S3 buckets are <b>global</b> to AWS so if at first you don't succeed, try picking another bucket name


### Deployment

Locally, if the folder `public/` exists, whenever you run `npx deploy` the contents are published to the `staging` bucket. If you set `ARC_DEPLOY=production` the contents of `public/` are deployed to the production bucket.

To _only_ deploy static assets from `/public` (and not function sources from `/src`), you can provide any of `--static`, `static` or `-s` flags, i.e. `npx deploy static`.

To _delete_ remote static assets on the S3 bucket that do not exist locally, provide the optional `--prune` or `--delete` flag, i.e. `npx deploy static --prune`.

## Next: [Create dynamo tables with `@tables`](/reference/tables)

