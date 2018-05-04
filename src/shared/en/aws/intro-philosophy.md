# Project Philosophy

> `.arc` frees your architecture from infra and vendor cruft so you can focus on the real business logic of your app. Ship only the code that matters, iterate faster and enjoy unprecedented availability guarantees.

The iron age of compute began with racked physical servers. Early cloud compute evolved past physical servers into virtual machines.

Virtual machines eventually gave way to containers and quickly containers have given rise to *cloud functions*.

Each cycle has taught new lessons in software architecture and this most recent iteration brings new challenges. 

- Config and tooling is designed for the last generation of metaphors 
- AWS is massive and overwhelming with many similar &mdash; but not the same &mdash; products with divergent interfaces between interlocking services
- Deep proprietary knowledge is required to configure and maintain common infrastructure primitives
- Configuration and infrastructure can drift, leaving systems in states that are difficult to repeat / reproduce, and thus scale
- Painful manifest files; JSON is difficult to read, has no comments, and is unforgiving to edit; YAML isn't much better and is in some ways far worse (i.e. deeply nested statements)

_Some_ of these problems have been tamed with [infrastructure as code](https://en.wikipedia.org/wiki/Infrastructure_as_Code), creating repeatable and reproducible systems. The trade-off there is: you're committing AWS configuration knowledge into your revision control systems.

**`.arc` views infrastructure as a build artifact.** And we prefer to not check build artifacts in with our code.

## The .arc file

`architect` defines a high level vendor agnostic plaintext format, `.arc`, as a manifest file to solve the specific problems laid out above.

With `.arc` you:

- Focus on defining your app architecture with a subset of service primitives as high level definitions
- Use `npm scripts` to  generate local code, configure, provision, and deploy cloud infrastructure from the `.arc` manifest
- You can still safely use the console tactically to access and administer primitives defined in `.arc`
- The format, parser, and tooling are completely open to extension

> In theory, `.arc` is also entirely portable between cloud vendors. (However no ports to clouds other than AWS have been made as of today.)

## The .arc format

The `.arc` format follows a few simple rules:

- Comments start with `#`
- Sections start with `@`
- **Everything between sections becomes instructions for generating AWS infrastructure**

`.arc` files are made up of the following sections:

- [`@app`](/reference/app) defines your application namespace
- [`@domain`](/reference/domain) defines DNS for a custom domain name
- [`@html`](/reference/html) defines HTML routes 
- [`@json`](/reference/json) defines JSON routes 
- [`@events`](/reference/events) defines application events you can publish and subscribe to
- [`@scheduled`](/reference/scheduled) defines functions that run on a schedule
- [`@slack`](/reference/slack) defines HTTP handlers to build apps for the Slack API
- [`@static`](/reference/static) defines S3 buckets for static assets
- [`@tables`](/reference/tables) defines DynamoDB database tables and trigger functions for them 
- [`@indexes`](/reference/indexes) defines table global secondary indexes 

This is a complete `.arc` file example:

```arc
# .arc
@app
hello

@domain
hello.com

@html
get /
post /likes

@json
get /likes

@events
hit-counter

@scheduled
daily-affirmation rate(1 day)

@static
staging test-hello-bucket
production hello-bucket

@tables
likes
  likeID *String
  update Lambda

@indexes
likes
  date *String
```

Running `npm run create` in the same directory as the `.arc` file above generates the following function code:

```bash
/
|-- src
|   |-- html
|   |   |-- get-index/
|   |   `-- get-likes/
|   |-- json
|   |   `-- get-likes/
|   |-- events
|   |   `-- hit-counter/
|   |-- scheduled
|   |   `-- daily-affirmation/
|   |-- tables
|   |   `-- likes-update/
|   `-- shared/
|-- .arc
`-- package.json
```

The code was also immediately deployed to the cloud in fully isolated `staging` and `production` environments.

The `.arc` format is terse, easy to read, and quickly learnable to author. The expressions in a `.arc` file unlock the formerly complex tasks of cloud infrastructure provisioning, deployment, and orchestration.

---

# Implementing principles and practices

`architect` follows many of the principles pioneered by agile and championed by devops, namely:

- Versioned infrastructure
- Tight feedback loops for dev, while maintaining isolation between stages
- Systems that are consistent, inspectable, transparent, and extensible

### Architecture as text

- `.arc` manifest file defines architecture elements as plainly as possible in text
- Nesting and syntax is deliberately constrained
- And you can add comments!

### Repeatable and consistent builds

- `arc-create` only creates, and never destroys; it skips what already exists
- Per above, `arc-create` is intended to be run and re-run as your system changes and grows
- Use the AWS console to administer (i.e. remove infrastructure) or script destructive actions yourself; `architect` never destroys

### Delivery is isolated from deployment

- `arc-sandbox` allows you to work locally and offline from the cloud
- `arc-deploy` treats `staging` and `production` as first class concepts
- Deployment to `production` requires an extra manual step of setting `ARC_DEPLOY=production` env var

### Extensible and flexible systems

- `arc-parser` is open, and `architect` tooling ignores `@sections` it does not know
- Extend `.arc` with your own `@sections` and workflows with `npm` scripts

## Next: [Check out the quickstart](/quickstart)
