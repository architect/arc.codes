---
title: Upgrade guides
description: 160 (or fewer) character description of this document!
sections:
  - 5.x to 6.x
  - 4.x to 5.x
---

## 5.x to 6.x

Architect 6 represents a ground-up rewrite of Architect, driven by user feedback, cloud vendor best practices, and extensive learnings by Architect maintainers.

Architect 6 is largely backwards compatible with Architect 5, but **depending on how you authored your Architect 5 project, there may be [breaking changes](#architect-6-breaking-changes)**.

What breaking changes there are, **we have attempted to provide simple, forwards-compatible upgrade paths wherever possible**.

---

### Topics

<a href=#architect-5-to-6><b>Architect 5 → 6</b></a>

<a href=#architect-functions><b>Architect Functions module (`@architect/functions`)</b></a>

<a href=#architect-data><b>Architect Data module (`@architect/data`)</b></a>

<a href=#architect-5><b>Architect 5 LTS maintenance schedule</b></a>

---

## <span id=architect-5-to-6>Architect 5 → 6</span>

### Overview

Architect 6 is a milestone release that solves some of the most crucial feedback we've received over the last two years. There's a lot to highlight below, but the first thing to know is that for some (but not all) Architect users, upgrading to Architect 6 may have breaking changes. We'll cover those below.


### About Architect 6
- **Architect 6 is now fully CloudFormation based**
  - This means your apps are provisioned and updated deterministically through AWS's first-party IaC (infrastructure as code) systems
  - This enables even tighter security profiles for Architect apps, and cleaner provisioning and teardown of infrastructure
  - As a minor example, if you remove a cloud function from your Architect project manifest, it'll no longer be left orphaned in your AWS app, requiring manual cleanup
  - Additionally, you'll no longer see resource creation rate limit errors, as that end of the infra provisioning logic is now handled entirely by AWS
- **Architect 6 now has first-class support for Ruby and Python**
  - This includes Ruby and Python support for the `sandbox` local dev server
  - It also includes ports of the Architect Functions module for [Ruby](https://github.com/architect/arc-functions-ruby) and [Python](https://github.com/architect/arc-functions-python)
    - Note: Functions for Ruby and Python is not yet at feature parity with the Node.js version, largely dictated by the availability and consistency of certain lower-level APIs in those runtimes.
    - As such, broadly speaking, if using Architect Functions in your [HTTP functions](/primitives/http) we recommend the Node.js version, which includes the most extensive support for front-end facing use cases.
- **Architect 6 now provisions CDNs with the `@cdn` pragma**
  - Finally, provision fast, fully-featured, global CDNs to live in front of your web app
  - This enables your web application to take advantage of crucial features like edge caching and global points of presence
- **Architect 6 is now a globally installable CLI tool, and is fully modular**
  - With Architect 6, you have the choice of installing Architect to your project (with Architect commands now prefixed by `npx arc`), or by installing it globally (`npm i -g @architect/architect`)
  - Architect is also now modular; for example, you can run the `sandbox` dev server in isolation (`npm i @architect/sandbox`) without needing all of Architect, or build custom workflows with other Architect modules like `@architect/deploy`


### Other changes
- Functions' dependencies are now automatically hydrated upon starting the `sandbox` dev server for the first time
- When creating new functions, runtime dependencies are fully opt-in
  - Unlike previous versions, Architect 6 no longer automatically creates a `package.json` with `@architect/functions` pre-installed
  - To install `@architect/functions` (or any other dependency) in a function, simply:
    1. Create a `package.json` file in that function dir (e.g. `touch src/events/a-background-task/package.json`)
    2. Add an empty `dependencies` object (see below)
    3. Then simply install whatever you please from within that directory (e.g. `cd src/events/a-background-task/ && npm i a-small-dependency`).
Example basic cloud function `package.json`:

```json
{
  "dependencies":{
    "a-small-dependency": "^1.0.0"
  }
}
```

### Removed
A number of Architect v5 workflows have since been deprecated, including:
- **`npx create`** - **Replaced**
  - To create boilerplate code (i.e. `npx create --local`) you should now use `npx arc init`
    - Or alternately, just start your project in `sandbox`, which will auto-initialize it)
  - Otherwise, create and deploy your app's live infra using `npx arc deploy`
- **`npx audit`** - **Removed**
  - App infra IAM roles are dynamically generated and scoped with least-privilege to various cloud infra services
- **`npx config`** - **Removed**
  - No longer necessary, as `.arc-config` settings are now serialized as part of every deploy
- **`npx inventory`** - **Removed**
  - Most prior uses of the `inventory` command are now addressed by the AWS CloudFormation console
- **`npx inventory --nuke`** - **Temporarily removed**
  - This command destroys your app infra, and is not currently available in Architect 6 (but will be returning shortly!)
  - [Follow this feature here](https://github.com/architect/architect/issues/430)
  - In the mean time, you can manually delete your app (aka "stack" in CloudFormation parlance) from the AWS CloudFormation console
- **`npx dns`** - **Temporarily removed**
  - This feature is not currently available in Architect 6 (but will be returning shortly!)
  - [Follow this feature here](https://github.com/architect/architect/issues/430)
  - In the mean time, you can manually add a domain to your app from the AWS console for API Gateway or CloudFront CDN (depending on how you've configured your Architect app to deliver HTTP)


### <span id=architect-6-breaking-changes>Breaking changes
- DynamoDB triggers (i.e. `@tables` `insert`, `update`, `destroy` Lambdas) are now defined with DynamoDB Streams enabled (`streamEnabled = true`)
  - [Learn more about DynamoDB Streams here](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_StreamSpecification.html)
- The dependency-free `request` and `response` signatures of Node.js-based HTTP functions have changed from the standard Architect format. These changes are non-breaking if you use `@architect/functions` – [more on this below](#upgrade-path).
- However, if you use dependency-free, `async/await` style Node.js HTTP functions, the following describes the specific breaking changes to the `request` and `response` signatures:

#### `request` breaking changes

The following Architect 5 `request` parameters changed in Architect 6:
- `method` is now `httpMethod`
  - Still one of `GET`, `POST`, `PATCH`, `PUT`, or `DELETE`
- `body` is no longer a pre-parsed object
  - `body` is now either `null` or a base64-encoded buffer
  - `body` must first be decoded, then parsed, to make use of it; Architect provides a handy helper to take care of this for you, see: [parsing HTTP request bodies](/primitives/http#parsing-request-bodies)
- `params` is now `pathParameters`
  - Still an object containing any URL params, if defined in your HTTP function's path (e.g. `foo` in `GET /:foo/bar`)
- `query` is now `queryStringParameters`
  - Still an object containing any query params if present in the client request
- Note: the `request` signature change is fully papered over with `@architect/functions`; if you are already using `@architect/functions` as your HTTP functions' handlers, you don't have to change anything, but you will need to upgrade to version `^3.3.0`

#### `response` breaking changes

The following Architect 5 `response` parameters changed in Architect 6:
- `location` is now deprecated
  - To set the `Location` of your content, please do so in the `headers` object, e.g. `headers: {'Location': '/new/path'}`
- `cookie` is now deprecated
  - `cookie` is now respected interchangeably with `session` by `@architect/functions`, however
- `status` & `code` are now `statusCode`
  - Still a `number` that sets the HTTP status code
  - Note: Arc 5 also supported `statusCode`, so if you're using that, there's no effective change
- `type` is now deprecated
  - To set the `Content-Type` of your content, please do so in the `headers` object, e.g. `headers: {'Content-Type': 'text/html; charset=utf-8;'}`


### Upgrade path

Architect support two styles of authoring Node.js cloud function handlers:
- Continuation-passing style (i.e. `callback`s), which uses Architect Functions to deliver a `response` (in addition to other features, such as middleware, etc.)
- `async/await` style, which does not depend on Architect Functions to deliver a `response`

The upgrade path for each of which is covered below:


#### Continuation-passing style HTTP functions (via `arc.http`)

If your HTTP functions are authored continuation-passing style using Architect Functions (i.e. `arc.http`), you have no breaking code changes. Simply run `npx arc hydrate --update` and ensure all your HTTP functions are running `@architect/functions` version `^3.3.0` (or greater).


#### <span id=arc-http-async>`async/await` style HTTP functions (via `arc.http.async`)</span>

If you already use `@architect/functions`'s `arc.middleware` (now `arc.http.async`) with your functions, you have no breaking code changes. Simply run `npx arc hydrate --update` and ensure all your HTTP functions are running `@architect/functions` version `^3.3.4` (or greater).

If your HTTP functions are authored in `async/await` style without `arc.http.async`, you'll have two paths forward to ensure compatibility with Architect 6:

1. Continue to opt out of using `@architect/functions` with your functions
- If you opt not to use `@architect/functions`, per the [list of signature changes above](#architect-6-breaking-changes), you'll need to update any logic related to `request`s and `response`s to the new Architect 6 signatures; generally this should be fairly low-impact and straightforward, but your mileage may vary

2. Opting to use `@architect/functions` with your functions
- You can opt into using `@architect/functions` with a very minor code change, namely by running your existing functions through `arc.http.async`, like so:


#### Example (before)
```javascript
// `async/await` Arc 5 function is incompatible with Arc 6

exports.handler = async function handler(request) {
  let name = request.body.email   // Accessor will fail, as `request.body` is no longer automatically parsed
  return {
    status: 200,                  // Response will fail, `status` param no longer valid
    type: 'text/html'             // Response will fail, `type` param no longer valid
    body: `<h1>Hi ${name}</h1>`
  }
}
```

#### Example (after)
```javascript
// Same `async/await` Arc 5 function made Arc 6 compatible via `arc.http.async`
let arc = require('@architect/functions')

exports.handler = arc.http.async(handler)

async function handler(request) {
  let name = request.body.email   // `request.body` automatically parsed by arc.http.async
  return {
    status: 200,                  // `status` param valid when passed through arc.http.async
    type: 'text/html'             // `type` param valid when passed through arc.http.async
    body: `<h1>Hi ${name}</h1>`
  }
}
```

---

## <span id=architect-functions>Architect Functions module (`@architect/functions`)</span>

### Overview

`@architect/functions` will continue to be actively maintained, and is forwards compatible with most Architect 6 upgrades.

The Architect Functions module is now also available as a dependency for [Ruby](https://github.com/architect/arc-functions-ruby) and [Python](https://github.com/architect/arc-functions-python) functions.


### Changes

- `arc.http.middleware` has been deprecated, and is now `arc.http.async`
  - These methods are functionally the same
- `arc.http.helpers.static` has been deprecated, and is now `arc.static`
  - These methods are functionally the same
  - Due to some under-the-hood changes, if you use `arc.http.helpers.static` or `arc.static`, you will need to upgrade to `@architect/functions` version `^3.3.4` (or greater) in Architect 6
- `arc.proxy` has been deprecated, and is now `arc.http.proxy`
  - These methods are functionally the same

In all three cases, these are functionally the same. The old aliases will remain for a while to come, but we suggest moving any deprecated calls over to their new equivalents by mid-2020.


### Does `@architect/functions` work in Architect 6?

Yes! It is supported by and forwards compatible in Architect 6. Additionally, it has been expanded to include [`@tables` support for working with data](/reference/functions/tables).


### Will `@architect/functions` continue working in Architect 5?

Yes! `@architect/functions` is fully backwards compatible with Architect 5. You can safely update this dependency, and expect related bugs to be patched. **However, it is worth noting that the new `tables()` method is an Architect 6-only feature.**

---

## <span id=architect-data>Architect Data module (`@architect/data`)</span>

As of the release of Architect 6, the **Architect Data module (`@architect/data`) is now deprecated**.


### Overview

`@architect/data` will no longer be maintained, and upgrading to Architect 6 will likely be a breaking change.


### Does `@architect/data` work in Architect 6?
No, this module was deprecated with the release of Architect 6.


### Will `@architect/data` continue working in Architect 5?
Yes. The lower-level AWS APIs within `@architect/data` are not expected to change in the near future, so indefinite use of `@architect/data` should be considered generally safe **if you choose not to upgrade to Architect 6**. That said, we strongly suggest you upgrade to receive the latest fixes, features, and updates.


### Upgrade path
If you built your `@architect/data` calls with `async/await`, `@architect/functions` `tables()` is largely a drop-in replacement. However, **if you are using callbacks, `@architect/functions` `tables()` is a breaking change.**


### Example of `@architect/data` → `@architect/functions` `tables()`

#### `@architect/data` before:
```js
// src/http/get-index/index.js
let data = require('@architect/data')

exports.handler = async () => {
  let body = await data.accounts.get({key:'foo'})
  return {body}
}
```


#### `@architect/functions` `tables()` after:
```js
// src/http/get-index/index.js
let {tables} = require('@architect/functions')

exports.handler = async () => {
  let data = await tables()
  let body = await data.accounts.get({key:'foo'})
  return {body}
}
```
---

## 4.x to 5.x

## <span id=architect-5>Architect 5 LTS maintenance schedule</span>

As of the release of Architect 6 in August 2019, Architect 5 is in LTS (long-term support). Architect maintainers will fix CVEs / security issues and critical bugs for a minimum of 6 months (i.e. through February 2020), and we expect that Architect 5 will continue working more or less hassle-free for some time to come.

Non-critical bugs, feature requests, PR merges, etc. may be completed on a discretionary and case-by-case basis.

Architect version 5 is here!

Things we added:

WebSocket support
New middleware - added later in arc 4, and out of the box in Arc 5