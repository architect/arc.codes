# `@static`

> `@static` defines S3 buckets for hosting static assets

- Requires two arguments: `staging` and `production`
- Each argument should be followed by a valid [globally unique S3 bucket name](https://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html#bucketnamingrules)

### Example

This `.arc` file defines static buckets:

```arc
@app
testapp

@static
staging test-bukkit
production main-bukkit
```

> Note: S3 buckets are <b>global</b> to AWS so if at first you don't succeed, try picking another bucket name

Locally, if the folder `/public` exists, whenever you run `npx deploy` the contents are synchronized to the `staging` bucket. If you set `ARC_DEPLOY=production` the contents of `/public` are deployed to the production bucket. 

## Next: [Create dynamo tables with `@tables`](/reference/tables)
