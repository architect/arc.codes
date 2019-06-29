# Project Layout

Architect projects have a `.arc`, `arc.yaml` or `arc.json` manifest file in the root. This captures the infrastructure requirements beside the code it will run in your revision control. Architect favors <em>convention over configuration</em> and projects have the following significant folder structure:

```bash
/
|- public ......... static assets (js, css, svg, images, etc)
|- src 
|  |- shared ...... code shared by ALL Lambda functions
|  |- views ....... code shared by HTTP GET Lambda functions
|  |- http ........ HTTP Lambda functions
|  |- events ...... Event Lambda functions
|  |- queues ...... Queue Lambda functions
|  |- scheduled ... Scheduled Lambda functions
|  |- tables ...... DynamoDB Table Stream Lambda functions
|  '- ws .......... Web Socket Lambda functions
'- .arc 
```

All folders are <b>OPTIONAL</b>. Architect ignores any other folders.

<hr>

# Configuration Overview

The `.arc` manifest can be broadly split into three groups of configuration:

### System configuration

These sections are for global system level env configuration. The most important being the `@app` namespace which is used to prefix all generated resources.

- [`@app`](/reference/app) **[Required]** The application namespace
- [`@aws`](/reference/aws) AWS specific config

### Lambda Function config

These sections deal with Lambda functions and their event sources. By convention Architect promotes one event source per function. 

- [`@http`](/reference/http) HTTP routes (API Gateway)
- [`@events`](/reference/events) Event pub/sub (SNS)
- [`@queues`](/reference/queues)  queues and handlers for them (SQS)
- [`@scheduled`](/reference/scheduled) Invoke functions specified times (CloudWatch Events)
- [`@ws`](/reference/ws) Web Socket functions (API Gateway)

### Persistence config

These sections deal with config of various persistence resources.

- [`@static`](/reference/static) Buckets for hosting static assets (S3)
- [`@tables`](/reference/tables) Database tables and trigger functions (DynamoDB)
- [`@indexes`](/reference/indexes) Table global secondary indexes (DynamoDB)

> 👉🏽 `.arc` comments out anything after hash symbol `#`. 

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

Running `arc init` creates the following code:

```bash
/
|-src
| |-events
| | '-hello/
| '-http
|   |-get-index/
|   '-get-posts/
'-.arc
```

If you add further sections it is safe to run and re-run `arc init` to generate further code. Local code is deployed to a staging environment by running `arc deploy`.

Happy with staging? Ship a release to production by running `arc deploy production`. 

Time to celebrate! ✨

## Next: [What next?](/quickstart/what-next)
