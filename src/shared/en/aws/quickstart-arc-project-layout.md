# .arc Project Layout

Here we'll dig a bit deeper into how a `arc` project is laid out and defined in the `.arc` manifest.

## Quick `.arc` cheatsheet

Section                               | Description
------------------------------------- | ------------------------------------------------------------------------------------
[`@app`](/reference/app)              | **[Required]** Defines your application namespace<br />Valid: Lowercase alphanumeric string; maximum of 20 characters; dashes allowed; underscores not allowed; must begin with a letter<br />Example: `hello-world-app`
[`@domain`](/reference/domain)        | Defines DNS for a custom domain name (ACM, API Gateway and Route 53)<br />Valid: Standard domain characters and syntax; only use the FQDN, do not include protocol or path<br />Example: `arc.codes`
[`@html`](/reference/html)            | Defines HTTP routes that return `text/html` content (API Gateway and Lambda)<br />Valid: `get` or `post` followed by the desired path; must incline leading slash; dashes and underscores not allowed; must begin with a letter; advised maximum of 100 characters; parameters denoted with colons (`:`)<br />Example: `get /schwifty/:where`
[`@json`](/reference/json)            | Defines HTTP routes that return `application/json` content (API Gateway and Lambda)<br />Valid: `get` or `post` followed by the desired path; must incline leading slash; dashes and underscores not allowed; must begin with a letter; advised maximum of 100 characters; parameters denoted with colons (`:`)<br />Example: `post /haste`
[`@events`](/reference/events)        | Defines SNS topics and Lambda handlers for them (SNS)<br />Valid: Lowercase alphanumeric string; maximum of 50 characters; dashes allowed; underscores not allowed; must begin with a letter<br />Example: `hi`
[`@scheduled`](/reference/scheduled)  | Functions are invoked at the times you specify (Cloudwatch Events)<br />Valid: Lowercase alphanumeric string (maximum of 20 characters; dashes allowed; underscores not allowed; must begin with a letter) followed by valid `rate` and `cron` expressions ([more info here](https://docs.aws.amazon.com/lambda/latest/dg/tutorial-scheduled-events-schedule-expressions.html))<br />Example: `friyay-only cron(0 15 ? * FRI *)`
[`@slack`](/reference/slack)          | Defines HTTP handlers to build apps for the Slack API<br />Valid: Lowercase alphanumeric string; maximum of 50 characters; dashes allowed; underscores not allowed; must begin with a letter<br />Example: `hello-bot`
[`@static`](/reference/static)        | Defines S3 buckets for static assets<br />Valid: Requires two lines: `staging` and `production`, each followed by a [valid globally unique S3 bucket name](https://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html#bucketnamingrules)<br />Example:<br />`staging test-bukkit`<br />`production main-bukkit`
[`@tables`](/reference/tables)        | Defines database tables and trigger functions for them (DynamoDB)<br />Valid (table names only): Lowercase alphanumeric string; between 3 and 255 characters; dashes allowed; underscores not allowed; must begin with a letter; please visit the [`@tables reference `](/reference/tables) for additional information on defining required keys and more
[`@indexes`](/reference/indexes)      | Defines table global secondary indexes (DynamoDB)<br />Valid: Subset of [`@tables`](/reference/tables); please visit the [`@indexes reference `](/reference/indexes) for additional information on defining required keys and more

Ok, let's provision a simple project with a simple `.arc` manifest!

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
├── src
│   ├── events
│   │   └── hello/
│   ├── html
│   │   └── get-index/
│   ├── json
│   │   └── get-posts/
│   └── shared/
├── .arc
└── package.json
```

The generated code was also immediately deployed to the built-in `staging` environment. Subsequent edits to the local code are deployed by running `npm run deploy`.

Happy with staging? Ship a release to production by running `ARC_DEPLOY=production npm run deploy`. 

Time to celebrate! &#x26c5; 

## Next: [Learn how to work locally](/guides/offline)
