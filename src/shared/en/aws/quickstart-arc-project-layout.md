# Project Layout

Architect projects have a `.arc`, `arc.yaml` or `arc.json` manifest file in the root. This captures the infrastructure requirements beside the code it will run in your revision control. Architect favors <em>convention over configuration</em> and projects have the following significant folder structure:

```
/
|- public ......... static assets (js, css, svg, images, etc)
|- src 
|  |- shared ...... code shared by ALL Lambda functions
|  |- views ....... code shared by HTTP GET Lambda functions
|  |- http ........ HTTP Lambda functions
|  |- events ...... Event Lambda functions
|  |- queues ...... Queue Lambda functions
|  |- scheduled ... Scheduled Lambda functions
|  '- tables ...... Table Trigger Lambda functions
'- .arc 
```

All folders are <b>OPTIONAL</b>. Architect ignores any other folders.

<hr>

# Configuration Reference

The `.arc` manifest can be broadly split into three sections:

### System config

- [`@app`](/reference/app) **[Required]** The application namespace
- [`@domain`](/reference/domain) Assign a domain name to your app (ACM, API Gateway, and Route 53)
- [`@aws`](/reference/aws) AWS config

### Lambda Function config
- [`@http`](/reference/http) HTTP routes (API Gateway, Lambda)
- [`@events`](/reference/events) Event pub/sub (SNS, Lambda)
- [`@queues`](/reference/queues)  queues and handlers for them (SQS, Lambda)
- [`@scheduled`](/reference/scheduled) Invoke functions specified times (CloudWatch Events)

### Persistence config
- [`@static`](/reference/static) Buckets for hosting static assets (S3)
- [`@tables`](/reference/tables) Database tables and trigger functions (DynamoDB)
- [`@indexes`](/reference/indexes) Table global secondary indexes (DynamoDB)

`.arc` comments out anything after hash symbol `#`. 

## Example

Provision a project with the following `.arc` file:

```arc
# this is going to be great!
@app
testapp

@events
hello

@http
get /
get /posts # the posts go here
```

Running `npx create` creates the following code:

```bash
/
├── src
│   ├── events
│   │   └── hello/
│   ├── http
│   │   ├── get-index/
│   │   └── get-posts/
│   └── shared/
├── .arc
├── package.json
└── public/
```

The generated code was also immediately deployed to the built-in `staging` environment. Subsequent edits to the local code are deployed by running `npx deploy`.

Happy with staging? Ship a release to production by running `npx deploy production`. 

Time to celebrate! ✨

## Next: [Learn how to work with HTTP functions](/guides/http)
