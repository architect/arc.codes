# .arc Project Layout

Here we'll dig a bit deeper into how a `arc` project is laid out and defined in the `.arc` manifest.

## Quick `.arc` cheatsheet

Section                               | Description
------------------------------------- | ------------------------------------------------------------------------------------
[`@app`](/reference/app)              | **[Required]** Defines your application namespace<br />Syntax: Lowercase alphanumeric string; maximum of 20 characters; dashes allowed; underscores not allowed; must begin with a letter<br />Example: `hello-world-app`
[`@aws`](/reference/aws)              | Defines defines AWS variables<br />Syntax: Accepts either or both of two keys: `region` and `profile`<br />Example: `region us-east-1`
[`@css`](/reference/css)              | Defines HTTP routes that return `text/css` content (API Gateway, Lambda)<br />Syntax: desired path; must include leading slash; dashes and underscores not allowed; must begin with a letter; parameters denoted with colons (`:`)<br />Example: `/path/to/your/new.css`
[`@domain`](/reference/domain)        | Defines and assigns a domain name to your app (ACM, API Gateway, and Route 53)<br />Syntax: Standard domain characters and syntax; only use the FQDN, do not include protocol or path<br />Example: `arc.codes`
[`@events`](/reference/events)        | Defines SNS topics and Lambda handlers for them (SNS, Lambda)<br />Syntax: Lowercase alphanumeric string; maximum of 50 characters; dashes allowed; underscores not allowed; must begin with a letter<br />Example: `hi`
[`@html`](/reference/html)            | Defines HTTP routes that return `text/html` content (API Gateway, Lambda)<br />Syntax: `get` or `post` followed by the desired path; must include leading slash; dashes and underscores not allowed; must begin with a letter; advised maximum of 100 characters; parameters denoted with colons (`:`)<br />Example: `get /schwifty/:where`
[`@indexes`](/reference/indexes)      | Defines table global secondary indexes (DynamoDB)<br />Syntax: Subset of [`@tables`](/reference/tables); please visit the [`@indexes reference `](/reference/indexes) for additional information on defining required keys and more
[`@js`](/reference/js)                | Defines HTTP routes that return `text/javascript` content (API Gateway, Lambda)<br />Syntax: `/path/to/your/new.js`
[`@json`](/reference/json)            | Defines HTTP routes that return `application/json` content (API Gateway, Lambda)<br />Syntax: `get`, `post`, `put`, `patch`, or `delete` followed by the desired path; must include leading slash; dashes and underscores not allowed; must begin with a letter; advised maximum of 100 characters; parameters denoted with colons (`:`)<br />Example: `post /haste`
[`@scheduled`](/reference/scheduled)  | Defines functions that are invoked at specified times (CloudWatch Events)<br />Syntax: Lowercase alphanumeric string (maximum of 20 characters; dashes allowed; underscores not allowed; must begin with a letter) followed by a valid `rate` or `cron` expression ([more info here](https://docs.aws.amazon.com/lambda/latest/dg/tutorial-scheduled-events-schedule-expressions.html))<br />Example: `friyay-only cron(0 15 ? * FRI *)`
[`@slack`](/reference/slack)          | Defines HTTP handlers to build apps for the Slack API (API Gateway, Lambda)<br />Syntax: Lowercase alphanumeric string; maximum of 50 characters; dashes allowed; underscores not allowed; must begin with a letter<br />Example: `hello-bot`
[`@static`](/reference/static)        | Defines S3 buckets for hosting static assets (S3)<br />Syntax: Requires two arguments: `staging` and `production`, each followed by a [valid globally unique S3 bucket name](https://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html#bucketnamingrules)<br />Example:<br />`staging test-bukkit`<br />`production main-bukkit`
[`@tables`](/reference/tables)        | Defines database tables and trigger functions for them (DynamoDB)<br />Valid (table names only): Lowercase alphanumeric string; between 3 and 255 characters; dashes allowed; underscores not allowed; must begin with a letter; please visit the [`@tables reference `](/reference/tables) for additional information on defining required keys and more
[`@text`](/reference/text)            | Defines HTTP routes that return `text/plain` content (API Gateway, Lambda)<br />Syntax: desired path; must include leading slash; dashes and underscores not allowed; must begin with a letter; parameters denoted with colons (`:`)<br />Example: `/path/to/your/plain.txt`
[`@xml`](/reference/xml)              | Defines HTTP routes that return `application/xml` content (API Gateway, Lambda)<br />Syntax: `get`, `post`, `put`, `patch`, or `delete` followed by the desired path; must include leading slash; dashes and underscores not allowed; must begin with a letter; advised maximum of 100 characters; parameters denoted with colons (`:`)<br />Example: `put /thecookiedown`

One more thing: comments! Add comments in their own lines, or inline, with a `#`. 

## Example

Ok, let's provision a basic project with a simple `.arc` manifest!

Given the following `.arc` file:

```arc
# this is going to be great!
@app
testapp

@events
hello

@html
get /

@json
get /posts # the posts go here
```

Running `npx create` creates the following code:

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

The generated code was also immediately deployed to the built-in `staging` environment. Subsequent edits to the local code are deployed by running `npx deploy`.

Happy with staging? Ship a release to production by running `ARC_DEPLOY=production npx deploy`. 

Time to celebrate! ✨

## Next: [Learn how to work locally](/guides/offline)
