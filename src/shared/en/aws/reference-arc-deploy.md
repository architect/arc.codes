# `npm run deploy`

Deploys code in `/src` to `staging`. If `ARC_DEPLOY=production` is set the code in `/src` will be deployed to `production`. If the local `.arc` file has defined (and created) `@static` buckets then the contents of `.static` are deployed to the appropriate S3 bucket.
