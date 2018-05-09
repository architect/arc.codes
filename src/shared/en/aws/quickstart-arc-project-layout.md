# Project Layout

## `.arc` cheatsheet

Section                               | Purpose
------------------------------------- | --------------------------------------------------
[`@app`](/reference/app)              | Defines your application namespace
[`@domain`](/reference/domain)        | Defines DNS for a custom domain name (ACM, API Gateway and Route53)
[`@html`](/reference/html)            | Defines HTTP routes that return `text/html` content (API Gateway and Lambda)
[`@json`](/reference/json)            | Defines HTTP routes that return `application/json` content (API Gateway and Lambda)
[`@events`](/reference/events)        | Defines SNS topics and Lambda handlers for them (SNS)
[`@scheduled`](/reference/scheduled)  | Functions are invoked at the times you specify (Cloudwatch Events)
[`@slack`](/reference/slack)          | Defines HTTP handlers to build apps for the Slack API
[`@static`](/reference/static)        | Defines S3 buckets for static assets
[`@tables`](/reference/tables)        | Defines database tables and trigger functions for them (DynamoDB)
[`@indexes`](/reference/indexes)      | Defines table global secondary indexes (DynamoDB)

Given the following `.arc` file:

```arc
@app
testapp

@events
hello

@html
get /

@json
get /posts
```

Running `npm run create` creates the following code:

```bash
/
|-- src
|   |-- events
|   |   `-- hello/
|   |-- html
|   |   `-- get-index/
|   |-- json
|   |   `-- get-posts/
|   `-- shared/
|-- .arc
`-- package.json
```

The generated code was also immediately deployed. Subsequent edits to the local code is deployed by running `npm run deploy`.

Happy with staging? Ship a release to production by running `ARC_DEPLOY=production npm run deploy`. 

Time to celebrate! &#x26c5; 

## Next: [Learn how to work locally](/guides/offline)
