# Project Layout

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
|   `-- json
|       `-- get-posts/
|-- .arc
`-- package.json
```

The generated code was also immediately deployed. Subsequent edits to the local code is deployed by running `npm run deploy`. Happy with staging? Ship a release to production by running `ARC_DEPLOY=production npm run deploy`. 

Time to celebrate! &#x26c5; 

## `.arc` Cheatsheet

Section        | Purpose
-------------- | -------------
`@app`         | Where you declare your app namespace
`@domain`      | Sets up DNS for a custom domain name (ACM, API Gateway and Route53)
`@html`        | Define HTTP routes that return `text/html` content (API Gateway and Lambda)
`@json`        | Define HTTP routes that return `application/json` content (API Gateway and Lambda)
`@events`      | Define SNS topics and Lambda handlers for them (SNS)
`@scheduled`   | Functions are invoked at the times you specify (Cloudwatch Events)
`@slack`       | Define Slack app HTTP handlers 
`@static`      | Define S3 buckets for static assets
`@tables`      | Define database tables and trigger functions for them (DynamoDB)
`@indexes`     | Define additional database table indexes (DynamoDB)

## Next: [Learn how to Work Locally](/guides/offline)
