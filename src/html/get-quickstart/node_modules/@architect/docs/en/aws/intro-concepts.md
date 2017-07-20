# Concepts

`architect` guiding design principles:

- Architecture as text
- Repeatable and consistent builds
- Delivery isolated from deployment
- Extensible and flexibile systems

We'll revisit these. First lets better understand the problems `architect` aims to solve.

## New Tech for New Problems

With all the benefits of cloud functions comes new and unique problems.

- Configuration tooling was designed for the last generation of metaphors (and lags behind the releases of new functionality)
- AWS is massive and overwhelming with many similar, but not the same, products
- The web console is confusing with divergent interfaces between interlocking services
- Deep proprietary knowledge is required to configure and maintain common infrastructure primatives
- Configuration and infrastructure can drift, leaving systems in difficult to repeat/reproduce and thus scale
- Painful manifest files; JSON is difficult to read, has no comments, and unforgiving to edit and YAML isn't much better and especially worse with deeply nested statements

We've tamed _some_ of these problems with _infrastructure as code_ creating repeatable and reproducable systems. The tradeoff is you are committing aws configuration knowledge into your revision control systems. `.arc` views infrastructure as a build artifact. *And we do not like checking build artifacts into our code.*

## .arc file

`architect` defines a plain text format `.arc` for a manfiest file. It is designed to solve the specific problems above.

- Focus on defining your app architecture with a subset of service primatives as high level defintions
- Use `npm scripts` to  generate local code, configure, provision and deploy cloud infrastructure from the `.arc` manifest
- You can still safely use the console tactically to access and admin primatives defined in `.arc`
- The format, parser and tooling are completely open to extension

> In theory, `.arc` is also entirely portable between cloud vendors. (However no ports to clouds other than AWS have been made as of this writing.)

## .arc file format

The `.arc` format follows a few simple rules:

- Comments start with `#`
- Sections start with `@`
- **Everything after a section becomes instructions for generating AWS infrastructure**

`.arc` files are made up of the following sections: 

- `@app` defines the application namespace
- `@html` section defines html routes (API Gateway and Lambda)
- `@json`  defines json routes (API Gateway and Lambda)
- `@events` defines application events you can publish and subscribe to (SNS)
- `@scheduled` defines functions that run on a timed schedule (Cloudwatch Events)
- `@tables` defines database tables and trigger functions for them (DynamoDB)
- `@indexes` defines additional database table indexes (DynamoDB)

This is a complete `.arc` file example. 

```arc
# .arc
@app
hello

@html
get /
post /likes

@json
get /likes

@events
hit-counter

@scheduled
daily-affirmation rate(1 day)

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
|-src
| |-html
| | |-get-index/
| | '-get-likes/
| |-json
| | '-get-likes/
| |-events
| | '-hit-counter/
| |-scheduled
| | '-daily-affirmation/
| '-tables
|   '-likes-update/
|-.arc
'-package.json
```

The code was also immediately deployed to the cloud in isolated `staging` and `production` environments. `architect` ships additional `npm run` workflows for deployment, working offline and dependency management.

The `.arc` format is terse, easy to read and quickly learnable to author. That intentionality expressed in an `.arc` file unlocks formerly complex infrastructure provisioning, deployment and orchestration tasks.

## Practices

Revisiting the `architect` design principles:

- **Architecture as text** `.arc` manifest file defines achitecture element in the plainest text possible
- **Repeatable and consistent builds** `arc-create` only creates, it never destroys, and skips if the thing it was to generate already exists
- **Delivery isolated from deployment** `arc-sandbox` allows you to working locally offline from the cloud; meanwhile `arc-deploy` treats `staging` and `production` as first class concepts
- **Extensible and flexibile systems** `arc-parser` is open, and `architect` tooling ignores `@sections` it does not know, therefore use `.arc` with your own npm scripts; `arc-modules` lets you act on all `.arc` defined modules with common `npm` commands

## Next Steps

Read about `.arc` [limitations](/intro/limits) next. 
