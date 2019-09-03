# Architect project layout

Architect favors <em>convention over configuration</em>. Projects have a lightweight `.arc` (or `app.arc`, `arc.yaml`, or `arc.json`) manifest file in the root.

This project manifest defines the application primitives used to generate your infrastructure.

Architect projects have the following significant folder structure:

```bash
/
├── public .......... Static assets (js, css, svg, images, etc.)
├── src
│   ├── http ........ HTTP functions
│   ├── events ...... Event functions
│   ├── queues ...... Queue functions
│   ├── scheduled ... Scheduled functions
│   ├── tables ...... DynamoDB Table Stream functions
│   ├── ws .......... WebSocket functions
│   ├── shared ...... Code shared by ALL functions
│   └── views ....... Code shared by HTTP GET functions
└── .arc
```

### **All folders are optional.**
Architect ignores any other files and folders.

---

## Manifest format overview

The `.arc` manifest format is intentionally simple to author and straightforward to read.

Resources are defined within pragmas, pragmas can be ordered arbitrarily, and comments are preceded by a `#`:

```arc
# This is going to be great!
@app
testapp

@http
get /api
post /api
```

The `.arc` manifest can be broadly split into three conceptual classifications of configuration:


### 1. Global / system

These pragmas are for global and cloud-vendor configuration, the most important of which being the `@app` namespace (which is used to prefix and identify all generated resources).

- [`@app`](/reference/app) - **[Required]** The application namespace
- [`@aws`](/reference/aws) - AWS-specific config (also includes global runtime setting)


### 2. Functions

These pragmas deal with cloud functions (i.e. Lambdas); function pragmas are always reflective of a single event source (i.e. `@http` functions are invoked by HTTP events; `@events` functions are invoked by events to the event bus).

- [`@http`](/reference/http) - HTTP routes (API Gateway)
- [`@events`](/reference/events) - Event pub/sub (SNS)
- [`@queues`](/reference/queues) - Queues & queue handlers (SQS)
- [`@scheduled`](/reference/scheduled) - Invoke functions on specified schedules (CloudWatch Events)
- [`@ws`](/reference/ws) - WebSocket functions (API Gateway)


### 3. Persistence

These pragmas specify various persistence resources.

- [`@static`](/reference/static) - Buckets for hosting static assets (S3)
- [`@tables`](/reference/tables) - Database tables & trigger functions (DynamoDB)
- [`@indexes`](/reference/indexes) - Table global secondary indexes (DynamoDB)


## Example

Provision a project with the following `.arc` file:

```arc
# This is going to be great!
@app
testapp

@events
hello

@http
get /
get /things # the things go here
```

Running `arc init` creates the following code:

```bash
/
├── src
│   ├── events
│   │   └── hello/
│   └── http
│       ├── get-index/
│       └── get-things/
└── .arc
```

If you add further pragmas, it is safe to run (and re-run) `arc init` to generate further code. Local code is deployed to a dedicated, isolated `staging` environment by running `arc deploy`.

Ship a release to production by running `arc deploy production`.

Time to celebrate! ✨

---

## Next: [HTTP functions](/primitives/http)

