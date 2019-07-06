# Project Philosophy 
## Build apps free from infra complexity and cruft 

Focus on the core business logic required to create value, ship only the code that matters, iterate faster and still enjoy unprecedented availability guarantees.

---

Architect defines a high level plaintext format, `.arc`, as a manifest file and otherwise views cloud infrastructure and configuration as a build artifact.

- Focus on defining app architecture with simple, plain and clear language
- Generate code to work locally and totally offline
- Deploy and extend with standard CloudFormation templates
- The format, parser, and tooling are also all completely open to extension

> In theory, the `.arc` format is entirely portable between cloud vendors. However no ports to clouds other than AWS have been made as of today.

---

## The .arc format

The `.arc` format follows a few simple rules:

- Comments start with `#`
- Sections start with `@`
- **Everything between sections becomes instructions for generating AWS resources**

`.arc` files are made up of the following sections:

- [`@app`](/reference/app) [*required*] defines your application namespace
- [`@aws`](/reference/aws) defines AWS variables
- [`@events`](/reference/events) defines application events you can publish and subscribe to
- [`@http`](/reference/http) defines HTTP (i.e. `text/html`) handlers
- [`@indexes`](/reference/indexes) defines table global secondary indexes 
- [`@scheduled`](/reference/scheduled) defines functions that run on a schedule
- [`@static`](/reference/static) defines S3 buckets for static assets
- [`@tables`](/reference/tables) defines DynamoDB database tables and trigger functions for them 
- [`@ws`](/reference/ws) defines Web Socket handlers 

This is a complete `.arc` file example:

```arc
# .arc
@app
hello

@aws
bucket cloudformation-bucket

@static
fingerprint true

@ws
action

@http
get /
post /likes
get /likes

@events
hit-counter

@scheduled
daily-affirmation rate(1 day)

@tables
likes
  likeID *String
  stream true

@indexes
likes
  date *String
```

Running `arc init` in the same directory as the `.arc` file above generates the following function code:

```bash
/
|-src
| |-http
| | |-get-index/
| | |-get-likes/
| | '-post-likes/
| |-events
| | '-hit-counter/
| |-scheduled
| | '-daily-affirmation/
| |-tables
| | '-likes/
| '-ws
|   |-action/
|   |-connect/
|   |-default/
|   '-disconnect/
'-.arc
```

The `.arc` format is terse, easy to read, and quickly learnable to author. The expressions in a `.arc` file unlock the formerly complex tasks of cloud infrastructure provisioning, deployment, and orchestration.

---

## Next: [Check out the quickstart](/quickstart)

