---
title: Upgrade guide
category: About
description: This document covers upgrading from previous versions of Architect
sections:
  - Overview of Architect versions
  - Architect 10 &rarr; 11
  - Architect 9 &rarr; 10
  - Architect 8 &rarr; 9
  - Architect 7 &rarr; 8
  - Architect 6 &rarr; 7
  - Architect 5 &rarr; 6
  - Architect 5 LTS maintenance schedule
  - Architect 4 &rarr; 5
  - Architect Functions
  - Architect Data
---

This document covers upgrading from previous versions of Architect.

As a general philosophy, Architect's core maintainers endeavor to minimize the frequency and impact of breaking changes wherever possible; in many cases, major releases may have no impact on existing applications.

## Releases

### Architect 11 (Cadborosaurus)

Architect 11 (Cadborosaurus) is a speed, stability, and security release, marking the first version utilizing [`aws-lite`](https://aws-lite.org) instead of the AWS SDK. Architect 11 now installs significantly faster, with a size on disk of roughly 49 MB, down from 191 MB, a 74% reduction. Arc can now also deploy in seconds with *fast mode*.

Because Architect no longer includes the AWS SDK, any projects that use it to make calls to AWS services must install the AWS SDK as a dependency. [See more below](#architect-10-&rarr;-11).


### Architect 10 (Taniwha)

Architect 10 (Taniwha) is a major feature release, introducing the Architect plugins API, and cleaning up internal legacy code, module APIs, and other bits from earlier on in Architect's history. While few of these changes should impact existing projects, users should still [see below for potential impacts to upgrading](#architect-9-&rarr;-10).


### Architect 9 (La Chupacabra)

Architect 9 (La Chupacabra) is primarily a maintenance release, dropping support for Node.js 10.x (now end-of-life) and Node.js 12.x, and removing support for Architect 5 (and lower).

[See below for potential impacts to upgrading](#architect-8-&rarr;-9).


### Architect 8 (El Chupacabra)

Architect 8 (El Chupacabra) improves API Gateway `HTTP` APIs by adding [`@proxy`](/docs/en/reference/project-manifest/proxy) support for migrating old APIs, and `any` HTTP method support and `*` catchall syntax, while also improving the default greedy catchall behavior of `get /` to be literal to what's found in the Architect manifest.

Although uncommon, certain Architect applications that use `get /` beyond handling `get` requests to `/` may be impacted by this change. [See more below](#architect-7-&rarr;-8).


### Architect 7 (Chupacabra)

Architect 7 (Chupacabra) evolves the Architect web application stack by defaulting to API Gateway `HTTP` APIs. (AWS considers `HTTP` APIs "v2.0"; the `REST` APIs provisioned by Architect since 2017 are now considered "v1.0".)

Deploying to an existing Architect project (that makes use of REST APIs) is completely forwards compatible; **no breaking infrastructure changes will be applied by Architect 7 unless manually and explicitly opted into**.

That said, Architect Sandbox workflows may potentially be impacted by this change. [See more below](#architect-6-&rarr;-7).


### Architect 6 (Ogopogo)

Architect 6 (Ogopogo) was a ground-up rewrite of Architect, driven by user feedback, cloud vendor best practices, and extensive learnings by Architect maintainers from the first three years of the project's life.

Ogopogo is backward compatible with Architect 4 & 5, but depending on how you authored your project, there may have been breaking changes. [Architect 5 &rarr; 6](#architect-5-&rarr;-6)

What breaking changes there are, we have attempted to provide simple, forwards-compatible upgrade paths wherever possible.


### Architect 5 (Catalope)

Architect 5 (Catalope) represented a major milestone in the project's functionality, introducing `@ws` (WebSocket) support. Catalope and was the last version to rely primarily on SDK calls to provision AWS infrastructure, and is currently in [Architect 5 LTS maintenance schedule](#architect-5-lts-maintenance-schedule).


### Architect 4 (Yeti)

Architect 4 (Yeti) introduced generic, dependency-free HTTP functions, enhanced static asset support, and improved configurability. Information on upgrading from Yeti and versions prior to 4 are still available at the [Architect 4 &rarr; 5](#architect-4-&rarr;-5).

---

## Upgrade guides

- [Architect 9 &rarr; 10](#architect-10-&rarr;-11)
- [Architect 9 &rarr; 10](#architect-9-&rarr;-10)
- [Architect 8 &rarr; 9](#architect-8-&rarr;-9)
- [Architect 7 &rarr; 8](#architect-7-&rarr;-8)
- [Architect 6 &rarr; 7](#architect-6-&rarr;-7)
- [Architect 5 &rarr; 6](#architect-5-&rarr;-6)
- [Architect 4 &rarr; 5](#architect-4-&rarr;-5)
- [Architect Functions](#architect-functions)
- [Architect Data](#architect-data)

---

## Architect 10 &rarr; 11

Architect 11 (Cadborosaurus) is a speed, stability, and security release, marking the first version utilizing [`aws-lite`](https://aws-lite.org) instead of the AWS SDK.

Architect 11 now installs significantly faster, with a size on disk of roughly 49 MB, down from 191 MB (a 74% reduction!). Arc also no longer makes use of the AWS CLI, and can now also deploy in seconds with *fast mode*.


### Breaking changes

- Architect no longer includes any versions of AWS SDK as dependencies. Any projects that use AWS SDK v2 or v3 to make calls to AWS services must install it as a dependency.
  - Remedy: run the following command in your project, depending on the AWS SDK version(s) you need:
    - AWS SDK v2 - `npm i -D aws-sdk`
    - AWS SDK v3 - `npm i -D @aws-sdk/client-apigatewaymanagementapi @aws-sdk/client-dynamodb @aws-sdk/client-s3 @aws-sdk/client-sns @aws-sdk/client-sqs @aws-sdk/client-ssm @aws-sdk/lib-dynamodb`
  - Alternative remedy: begin transitioning to [`aws-lite`](https://aws-lite.org), which is 2-5x faster, has nice docs, excellent errors, support for types, and is fully open to community contribution
- Due to the upcoming deprecation of `nodejs16.x` and AWS SDK v2 in Lambda, Architect now defaults to `nodejs20.x`
  - Remedy: if you still use SDK v2 in your Lambdas by default, add `@aws runtime nodejs16.x` to your [project manifest](https://arc.codes/docs/en/reference/project-manifest/aws#runtime) or any relevant [config.arc files](https://arc.codes/docs/en/reference/configuration/function-config)
  - However, it must be noted that Lambda is retiring `nodejs16.x` with AWS SDK v2 later this year; as above, we are now encouraging folks to transition to `aws-lite`, where possible
- `arm64` is now the default Lambda architecture
  - This change only impacts projects that utilize native modules or Lambda layers with binaries; projects that make use of regular Node.js packages will not be impacted by this change
  - Remedy: if your native modules / layers aren't yet available for `arm64` Linux, or you just aren't certain about the state of your dependency tree, add `runtime x86_64` to the `@aws` pragma in your project manifest
- Removed support for Node.js 14.x (now EOL, and no longer available to created in AWS Lambda)
- Resolved mismatch between `RouteSelectionExpression` in deployed Architect apps vs. locally in Sandbox
  - The `RouteSelectionExpression` is now `$request.body.action`, meaning WebSocket code running locally can now be the same as in production
  - Remedy: if you use custom `@ws` handlers and invoke them in Sandbox, you can remove conditional logic renaming the `message` property to `action`. Everything should now use `action`, like so: `ws.send(JSON.stringify({ action: 'custom-endpoint', ... }))`


### Notable changes

- Added experimental `--fast` flag, which ships project to AWS without waiting around to determine if the deployment completed successfully. Use with care!
- Architect no longer requires the AWS CLI, nor Python. So if you'd like to remove either or both, feel free!
- Deploy no longer writes `sam.json` + `sam.yaml` files upon each deploy
  - However, if you do want to see the `sam.json` being deployed, use the `--dry-run` or `--debug|-d` CLI flags


### Compatibility with `@architect/functions`

Arc 11 also ships with Architect Functions 8, which also makes use of `aws-lite`. This is an important upgrade, as version 8 no longer suffers from 500-1000ms cold starts due to instantiating the AWS SDK. Version 8 is now between 2-5x faster, and uses 2-4x less memory.

Version 8 also introduces two important breaking changes noted below; while we do not recommend using use version 7 due to the deprecation of AWS SDK v2 and ongoing performance issues with AWS SDK v3, you may continue to do so as long as the AWS SDK is installed in your project's dependencies.

Additionally, you can use Architect Functions 8 in Arc 10 projects.


#### DynamoDB client instantiation

Because the AWS SDK can no longer be assumed to be installed in Architect projects, `@architect/functions` offers a new `aws-lite`-based DynamoDB client (`_client`), and provides an opt-in affordance for using AWS SDK-based DynamoDB clients:
- If you only rely on the DocumentClient (`data._doc`), you may want to just try using the new [`@aws-lite/dynamodb`](https://aws-lite.org/services/dynamodb)-based `_client`, which is functionally the same, but significantly faster
- Code depending on `data._db` or `data._doc` must now instantiate with the `awsSdkClient` boolean option, like so: `await arc.tables({ awsSdkClient: true })`
  - Using the `awsSdkClient` option necessitates having AWS SDK v2 or v3 installed, according to your Lambda's Node.js version (v2 for 16.x, v3 for 20.x+)


#### Error semantics

Similar to how AWS SDK v3 introduced breaking changes to error semantics from AWS SDK v2, `aws-lite` errors may also be different. We've taken efforts to ensure the maximum degree of compatibility with both AWS SDK v2 and v3 errors, but they may still vary slightly.
- This only really applies if your error handling relies on specific error properties or values
- If you just `console.log()` your errors, you will be totally fine, and the quality of the errors you get via `aws-lite` will most likely improve with this change
- Note: if you're an AWS SDK v2 user considering migrating to v3, error incompatibility will apply even more so; v3 errors are incompatible with v2, whereas `aws-lite` errors attempt to be compatible with both SDK v2 + v3 where possible


#### Backward compatibility

Again, it should be noted that `@architect/functions` 8 is not a required upgrade; you may continue using `@architect/functions` 7 so long as the AWS SDK is installed in your project's dependencies.

---

## Architect 9 &rarr; 10

Architect 10 (Taniwha) is a major feature release, introducing the Architect plugins API, and cleaning up internal legacy code, module APIs, and other bits from earlier on in Architect's history.

Most of Architect 10's breaking changes were internal; most users should not encounter breaking changes when upgrading Architect to v10, and Functions + ASAP to v5.


### Removed

- Removed the `package` command, which was no longer able to represent the final state of Architect projects
  - Remedy: its (improved) replacement is now: `deploy --eject`
- Removed support for legacy `.arc-env` env files (initially deprecated in late 2020)
  - Remedy: if you are still using a `.arc-env` file, please move your [local env vars to `prefs.arc`](https://arc.codes/docs/en/reference/configuration/local-preferences#%40env) or [`.env`](https://arc.codes/docs/en/reference/configuration/local-preferences#.env-file-support)
- [Removed `toml` support](https://github.com/architect/architect/discussions/1294) (e.g. `arc.toml`)
- Removed built-in support for the `REST` API Gateway. Support is moved to an external plugin, [`plugin-rest-api`](https://github.com/architect/plugin-rest-api).


### Breaking changes

- The beta plugins API has been largely refactored; wherever possible, hooks from the beta API have been ported to the final shipping plugin API. However, many things changed, so if you authored plugins against the beta API, please refer to the [new plugin documentation](https://arc.codes/docs/en/reference/plugins/api) to ensure compatibility
- Due to ongoing issues with unpredictable behavior with certain external libraries, Architect no longer makes use of the `NODE_ENV` environment variable, nor is it automatically added to deployed apps.
  - Remedy: if your code relies on Architect automatically populating `NODE_ENV`, you should add it to your userland environment variables, like so: `npx arc env --add --env testing NODE_ENV testing` (and again for `staging` + `production`)
- All support for bare CLI flags has been removed from Architect commands
  - All functionality has been retained, but now proper flags must be used
  - Example: `npx arc deploy production` should now be `npx arc deploy --production`
- Sandbox's new automatic port selection should frequently actually improve and un-break common uses of Sandbox in testing. However, if your tests or tools rely on Sandbox's default ports (e.g. `3334` for `@events`), you will need to make some minor changes:
  - Remedy: Lambda invocations in Sandbox are now passed an environment variable called `ARC_SANDBOX`, which contains a JSON serialized `ports` property; use this property to obtain the currently configured port for a given service
  - Should you need to have consistent, non-automatically-selecting ports for Sandbox's internal services, use Sandbox's standard means for explicitly defining port configuration; **do not merely rely on Sandbox's default ports**, as they should be expected to change at any time
- Breaking change: legacy `@tables` / `@tables-streams` folders (`src/tables/...` and `src/streams/...`) are now deprecated in favor of `src/tables-streams/...`
  - Remedy: existing stream functions can simply have their folders renamed to `src/tables-streams/{name}` (or use a custom `src` property on them if you'd prefer to keep your existing folder structure)
- Breaking change: `@indexes` is now fully deprecated
  - Remedy: simply change the `@indexes` pragma name to `@tables-indexes`; no other changes are required
- Breaking change: moved legacy API Gateway REST API provisioning to `@architect/plugin-rest-api` plugin; to continue deploying REST APIs with Architect:
  - Remedy: install `@architect/plugin-rest-api` to your project's dependencies, add `@plugins architect/plugin-rest-api` and `@aws apigateway rest` to your project manifest


### Internal breaking changes

The following internal changes should not have any impact on Architect users should Architect v10 be paired with Functions v5, but just in case anyone used these somewhat more obscure internal features, environment variables, etc., we'll enumerate the changes here:

- All Architect modules' CLI APIs have been revamped, and now accept an object containing Inventory
- `@architect/env`'s module API has been significantly revamped; if you use `env` as a module, please refer to its documentation
- The following internal Architect environment variables are no longer used: `ARC_CLOUDFORMATION`, `ARC_HTTP`, `ARC_SANDBOX_PATH_TO_STATIC`
- Inventory structure changes:
  - `inv._project.src` now represents the default source tree folder (e.g. `$cwd/src`), while `_project.cwd` (new) refers to the current working directory of the project
  - `inv._project.env` is now an object populated by three properties: `local`, `plugins`, and `aws`, each reflecting the env vars found for each context's three environments (`testing`, `staging`, `production`)
  - `lambda.handlerFunction` has been renamed to `lambda.handlerMethod`
- Architect now prioritizes the AWS region passed via Inventory params over the `AWS_REGION` env var; in practice this should have no practical effect for most users
- Per Deno's guidelines, Architect now prioritizes `mod.ts|js` handlers in Deno Lambdas over the other supported files; in practice this should have no practical effect unless your handler has both an `index.ts|js` file and a `mod.ts|js` file in its root
- Deprecated `ARC_SANDBOX_ENABLE_CORS` env var option from Sandbox
  - Remedy: this option predates Architect's support of `options`, which landed in version 8; handling options requests with an `options` (or `any`) handler is the preferred approach to handling CORS
- Internal change: stopped optimistically populating default `arc-sessions` + `data` tables in Sandbox
  - This was a very obscure and quirky holdover behavior from early Architect that differed Sandbox from live AWS behavior
  - Remedy: realistically no one ever actually used this feature in production, because to do so would have necessitated defining an `arc-sessions` or `data` table in your project manifest; that said, if you experimented with these default DynamoDB tables and want to use them in production, simply add them to your `@tables` pragma


### Important non-breaking change

In a future major release, Architect will deprecate all non-namespaced environment variables. For now, Architect prefers the namespaced versions of the same env var, but will support both; some examples:

- `ARC_HTTP_PORT` is preferred to `PORT` in Sandbox
- `ARC_SESSION_TABLE_NAME` is preferred to `SESSION_TABLE_NAME` in Sandbox

If you key on or use non-namespaced Architect env vars, we suggest changing them over to their namespaced equivalents as soon as is convenient.


### Compatibility with `@architect/functions`

Due to internal breaking changes, `@architect/functions` v4 and below is incompatible with Architect 10.
- Remedy: upgrade `@architect/functions` to v5 or above; all existing functionality has been retained, [see more here](#architect-functions)

---

## Architect 8 &rarr; 9

Architect 9 (La Chupacabra) is a maintenance release, primarily aimed at removing support for Node.js 10.x (now end-of-life) and Node.js 12.x. With this release, after two years since the release of Architect 6, Architect 5 is no longer supported.

Additionally, Architect's default runtime is now `nodejs14.x` – if your existing functions do not specify a runtime, they will be automatically and seamlessly upgraded from `nodejs10.x` or `nodejs12.x` to `nodejs14.x`.


### Breaking changes

- Removed support for Node.js 10.x (now EOL, and no longer available to created in AWS Lambda) and Node.js 12.x
- `arc destroy`
  - `--app` must now be used to destroy apps, while `--name` may only be used to destroy stacks
  - Removed support for deprecated `--nuke` flag
- `arc hydrate`
  - Usage remains the same, but its module API has removed support for `hydrate()` in favor of explicit `hydrate.install|update|shared()` methods


### Compatibility with `@architect/functions`

Architect 9 is fully compatible with `@architect/functions`. However, `@architect/functions` 4.0, released alongside Architect 9, has some breaking changes:

- Removed support for Node.js 10.x (now EOL, and no longer available to created in AWS Lambda); Node.js 12.x will continue to be supported until it is EOL in AWS Lambda
- `arc.http.proxy` is now `@architect/asap`, and has been removed from `@architect/functions` 4.0
- `arc.http.proxy` calls can now be sent as-is to ASAP
  - For more details, please see the [@architect/functions changelog](https://github.com/architect/functions/blob/master/_changelog.md#200-2021-07-25) and [@architect/asap changelog](https://github.com/architect/asap/blob/master/_changelog.md#400-2021-07-25)
- Removed support for handling requests from Architect 5 (and lower) APIs
  - Responding to requests has not changed, however!
  - Old response semantics from Architect 5 (and lower) will continue to be supported, so you'll always have a clear, clean upgrade path from older Architect projects to newer APIs

---

## Architect 7 &rarr; 8

### Overview

Architect 8 (El Chupacabra) addresses some common feedback related to `@http get /`. Folks have told us that it's confusing that `get /` is a special route that also serves as a greedy catchall, capturing requests to routes not explicitly defined in their manifest.

Architect 8 adds `any` and `*` to Architect's `@http` route syntax for `HTTP` APIs. This allows us to make `@http get /` literal, and enable users to opt into explicitly defining a greedy root catchall with `any /*`.

If your existing Architect app **does not use `@http` or `@static` pragmas**, or is running an API Gateway `REST` API, you're already ready to use to Architect 8.

### Removed

The `arc repl` local workflow has been retired. The module remains available for download at `@architect/repl` if you want to install and run it with `npx arc-repl`, although we will no longer officially support or maintain it.


### Breaking changes

Architect 8 has a single breaking deploy-time change that alters core application behavior: `@http get /` is now completely literal for `HTTP` APIs, and no longer serves as a greedy catchall.

However, even if you use `@http get /` with an `HTTP` API, you may not be broken by this change. The following criteria should identify whether you would be impacted by upgrading:

1. You are running Architect 7
2. Your project has `@http get /`
3. You've deployed an API Gateway `HTTP` API (and not a `REST` API).
4. You're using `get /` as a greedy catchall (i.e. your `get /` function is handling requests for non-`get` methods, or non-`/` paths)

If your project **does not meet all four of the above criteria, you can safely upgrade** from 7 to 8.

> If you're not sure whether you're using an `HTTP` or `REST` API, visit the API Gateway console; its type will be shown next to it in the API list.


#### Resolution

If all four of the above criteria describe your project, you will need to make a minor alteration to your project in order to upgrade to Architect 8. It should take no more than 30 seconds, and poses no risk.
- Change `get /` in your Architect project manifest to `any /*`
- Move your `src/http/get-index` folder to `src/http/any-catchall`
- That's it!

#### Example (before)

```bash
@http
get /
```

#### Example (after)

```bash
@http
any /*
```

### Compatibility with `@architect/functions`

Architect 8 is fully compatible with `@architect/functions`.

### Additional resources

- [Architect issue 973: `Improve the default behavior of get /`](https://github.com/architect/architect/issues/973)
- [Architect issue 969: `New @http syntax: * for {proxy+}`](https://github.com/architect/architect/issues/969)

### Architect 6 + 7 maintenance

Unlike [Architect 5, which remains in LTS (long-term support)](#architect-5-lts-maintenance-schedule), Architect 6 + 7-series are not actively maintained. This is specifically because Architect 6 + 7 are a largely forward-compatible releases that only contain minor breaking changes that are easily remediated.

We suggest upgrading to Architect 8 as soon as possible to take advantage of the great new features planned for 8.x.

---

## Architect 6 &rarr; 7

### Overview

tldr – if you have an existing Architect 6 project:
- **You can continue to safely deploy that project with Architect 7**
- No breaking infrastructure changes will be applied by Architect 7 unless manually and explicitly opting in
- However, it is possible **Sandbox may be broken for your local workflows and testing**
  - If so, you'll need to **add a new setting API type setting** ([see breaking changes](#architect-7-breaking-changes))

We know the "`HTTP`" and "`REST`" API nomenclature is confusing – don't REST APIs use HTTP? Can't you use an HTTP API to build a REST interface? – but AWS named these API types, not us. Please allow us to do our best to explain!

AWS now offers two API Gateway types for marshaling (non-WebSocket) HTTPS requests and responses:
1. **`REST`** APIs - what Architect provisioned by default through version 6.x, aka "API Gateway v1.0"
2. **`HTTP`** APIs - what Architect provisions by default starting in version 7.0, aka "API Gateway v2.0"
  - Additionally, `HTTP` APIs integrate with Lambda using one of two request / response payload format versions:
    1. **Lambda payload format version 2.0** - the latest format, designed from the ground up for integrating `HTTP` APIs + Lambda
    2. **Lambda payload format version 1.0** – the legacy format, which provides close – *but not exact* – emulation of legacy `REST` API + Lambda payloads
    - [Learn more about `HTTP` API payload formats here](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html#http-api-develop-integrations-lambda.proxy-format)

Architect 7 (Chupacabra) evolves the Architect web application stack by **defaulting to API Gateway `HTTP` APIs using Lambda payload format version 2.0**.

`HTTP` APIs with Lambda payload format version 2.0 are themselves a breaking change with `REST` APIs; `HTTP` APIs with Lambda payload format version 1.0 are largely (but may not be 100%) compatible with `REST` APIs.

Architect 7 retains full backward compatibility for existing Architect 6 projects by continuing to deploy the same API type as you're currently using.

### Other changes

- New apps will default to using `HTTP` APIs, but can be configured as `REST` APIs – more on that below

### Removed

- Removed experimental support for static mocks
  - This was a very obscure experimental feature and should not impact anyone (but can be restored by building a macro)

### Architect 7 Breaking changes

All breaking changes in Architect 7 pertain to local development and testing with Sandbox, Architect's development environment. **But good news: Sandbox 2.0, included in Architect 7, also has compatibility paths for Architect 6 that only require a few seconds of your time.**

A core goal of Sandbox is to operate entirely locally and offline; that means no phoning home to AWS to introspect your current application configuration. Sandbox must run entirely from your machine using only your Architect project manifest. Thus, with the addition of `HTTP` APIs, Sandbox must now have a default API type.

It naturally follows that Sandbox's default would now be `HTTP` (with Lambda payload format version 2.0), since that is now the default for new projects. Because [API Gateway `HTTP` APIs introduced breaking changes with `REST` APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html#http-api-develop-integrations-lambda.proxy-format), existing projects may not function correctly until reconfigured to operate in `REST` mode.

#### Sandbox API type

The following are the valid settings for API types:
- **`http` (default)** - `HTTP` API + Lambda payload format version 2.0
  - `httpv2` – aliased to `http`
- **`httpv1`** - `HTTP` API + Lambda payload format version 1.0
  - Use this if you'd like to take advantage of `HTTP` APIs, but aren't yet ready to refactor your code for payload format 2.0
- **`rest` (previous default)** - `REST` API + original API Gateway payload format
  - Essentially the same as what is now called Lambda payload format version 1.0

Changing API types from `rest` to `http` **is a partially destructive change** that will result in new API Gateway URLs being generated. **Your old URLs will be destroyed** – if not accounted for, this may result in a service outage.

Once you're using a `HTTP` API, you can safely toggle between `http/httpv2` and `httpv1` non-destructively (although because the payloads differ, your code may no longer function; see below for information on seamlessly normalizing request / response payloads with `@architect/functions`).

#### Configuring the Sandbox API type

Configure your project's API type one of the following ways:

**1. Architect project manifest**

Using `httpv1` as your API type:

```bash
# app.arc|.arc|arc.yaml|etc.

@aws
apigateway httpv1
```

or:

**2. Environment variable**

Using `rest` as your API type via CLI:
```bash
ARC_API_TYPE=rest npx arc sandbox
```

#### Sandbox test environment changes

- Several seldom used and largely undocumented Sandbox module APIs intended for testing have breaking changes:
  - `sandbox.start()` no longer returns a function to shut down, and should now be shut down directly with `sandbox.end()`
  - `sandbox.db()` is now `sandbox.tables()`
  - `http.close()` is now `http.end()`
  - `events.start()` & `tables.start()` no longer return server objects to be invoked with `.close()`, and should now be shut down directly with `events.end()` and `tables.end()`
- Please see Sandbox for additional information:
  - [Sandbox 2.0 API](https://github.com/architect/sandbox/blob/master/readme.md)
  - [Breaking changes to undocumented module APIs](https://github.com/architect/sandbox/blob/master/changelog.md#200-2020-09-15)

### Upgrade scenarios

If your existing Architect 6 app **does not use `@http` or `@static` pragmas**, you're already ready to use to Architect 7.

If, like many, you use `@http` or `@static`, and you've configured Sandbox to operate `REST` API mode per the above instructions, you're also ready to use Architect 7.

However, you may also want to use Architect 7 to upgrade your existing `REST` API to the shiny `HTTP` stuff. If so, read on, but note: **is a partially destructive change** that will result in new API Gateway URLs being generated. **Your old URLs will be destroyed** – if not accounted for, this may result in a service outage.

### Why upgrade to `HTTP` APIs?

If your Architect app is working well, you may not need to upgrade to `HTTP` APIs – in fact, depending on how you make use of your existing `REST` API, it may not be an upgrade at all – `HTTP` APIs are newer, and do not have some of the deeper, more obscure functionality of the older, more mature `REST` API system.

For most applications most of the time, we now believe `HTTP` APIs are the right API Gateway type to use, and there are some compelling reasons to upgrade to `HTTP` APIs:

- `HTTP` APIs are designed to be lower-latency
- `HTTP` APIs provision and integrate changes significantly faster
- `HTTP` APIs are significantly less expensive: as of this writing, they cost ≤$1.00/million requests, compared to `REST` APIs, which charge $3.50/million requests (plus data transferred)
- `HTTP` APIs support default stages and routes, meaning we can finally escape the dreaded API Stage Path Part Problem (e.g. `/staging` in `https://{id}.execute-api.{region}.amazonaws.com/staging`)
- `HTTP` APIs are where AWS is now putting the bulk of its API Gateway development effort
- As of September 2020, `HTTP` APIs now support authorizers (which can be implemented via Architect Macros)
- For more information, please [compare `HTTP` to `REST` APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html), and see [Architect issue #838](https://github.com/architect/architect/issues/838)

#### Upgrading from `REST` to `HTTP`

As mentioned above: **this is a partially destructive change if performed on a running project**, and will result in a new API Gateway URLs being generated, and your old URLs being deactivated.

If you need a zero-downtime means of upgrading from `REST` to `HTTP`, the simplest and most reliable built-in means for doing so is to create a second app for your new `HTTP` API.

Creating a second app can be accomplished by deploying your existing app to a different AWS (org) account than your current app (i.e. by changing is keys), or simply by changing your app's name. Each has its own set of trade-offs and may result in additional complexity during your migration, so we encourage you to carefully consider and research the process by which you intend to migrate.

When you're ready to upgrade your existing Architect 6 (`REST`) app to `HTTP`, here's how:

**1. Architect project manifest**

Add the following to your project manifest:

```arc
# app.arc|.arc|arc.yaml|etc.

@aws
apigateway http
```

Then run a deploy:

```bash
npx arc deploy # Staging environment
npx arc deploy --production # Production environment
```

or:

**2. One-time deployment using the `--apigateway` flag via CLI**

```bash
npx arc deploy --apigateway http # Staging environment
npx arc deploy --apigateway http --production # Production environment
```

Tip: if you'd like to use `HTTP` APIs with code authored for an existing `REST` API project, manually specify the Lambda v1.0 payload format with `httpv1`.

As you might expect, backward compatibility for `REST` APIs is retained with the `rest` setting; should you need to revert to `REST` mode, apply that via CLI with `--apigateway rest`, or in project manifest with `@aws apigateway rest`. (Again, that will destroy your URLs and generate new ones, so plan ahead for that.)

#### Apps that use `@architect/macro-http-api` macro

Unfortunately, we have observed strange side effects when using the Architect 6 `@architect/macro-http-api` macro when deploying with Architect 7.

If you are currently using `@architect/macro-http-api` in production, please exercise caution when upgrading to Architect 7.

We've observed the following behavior in CloudFormation when running Architect 7 and `@architect/macro-http-api`:

- If you leave the `@architect/macro-http-api` macro in your app and deploy with Architect 7, CloudFormation will leave your existing API intact, and deploy a second API alongside it
  - This may be useful during a transition phase, but we cannot guarantee changes will be properly reflected in both APIs
- If you remove the `@architect/macro-http-api` macro from your app and deploy with Architect 7, CloudFormation will remove your original API (and its corresponding URL), leaving you with a fresh API and URL

Because CloudFormation behavior is subject to change, and due to the aforementioned observed side effects, we advise existing `@architect/macro-http-api` macro users exercise caution upgrading to Architect 7.

**If you are using `@architect/macro-http-api` in production today, you should not upgrade to Architect 7 until you've conducted field testing of your own, and are certain you are ready to transition your API URLs**.

### Compatibility with `@architect/functions`

If you're using `@architect/functions`, good news! `>= 3.13.0` is fully forward compatible with `HTTP` APIs and backward compatible with `REST` APIs. This means:
- You can use existing `REST` API code with `HTTP` APIs when run through `@architect/functions`
- You can implement `@architect/functions` in your codebase to ease any future `REST` to `HTTP` upgrades

Caveat: [per AWS](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html#http-api-develop-integrations-lambda.proxy-format), `HTTP` APIs + Lambda payload format version 2.0 requests do not support `multiValueHeaders` or `multiValueQueryStringParameters`, so any code relying on those parameters should be adjusted, whether using `@architect/functions` or not.


### Additional resources

- [Learn more about `HTTP` API payload formats here](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html#http-api-develop-integrations-lambda.proxy-format)
- [Compare `HTTP` to `REST` APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html)
- [Architect issue 838: `Promoting HTTP APIs to the default`](https://github.com/architect/architect/issues/838)

---

## Architect 5 &rarr; 6

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
    - As such, broadly speaking, if using Architect Functions in your [HTTP functions](/docs/en/reference/project-manifest/http) we recommend the Node.js version, which includes the most extensive support for front-end facing use cases.
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
    - Or alternately, just start your project in `sandbox`, which will auto-initialize it
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
  - [Follow this feature here](https://github.com/architect/architect/issues/431)
  - In the mean time, you can manually add a domain to your app from the AWS console for API Gateway or CloudFront CDN (depending on how you've configured your Architect app to deliver HTTP)


### Architect 6 Breaking changes

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
  - `body` must first be decoded, then parsed, to make use of it; Architect provides a handy helper to take care of this for you, see: [parsing HTTP request bodies](/docs/en/reference/runtime-helpers/node.js#arc.http)
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

#### `async/await` style HTTP functions (via `arc.http.async`)

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

## Architect 5 LTS maintenance schedule

As of the release of Architect 6 in August 2019, Architect 5 is in LTS (long-term support). Architect maintainers will fix CVEs / security issues and critical bugs for a minimum of 6 months (i.e. through February 2020), and we expect that Architect 5 will continue working more or less hassle-free for some time to come.

Non-critical bugs, feature requests, PR merges, etc. may be completed on a discretionary and case-by-case basis.

---

## Architect 4 &rarr; 5

Architect version 5 is here!

Things we added:

- [WebSocket support](/docs/en/reference/project-manifest/ws)
- [New middleware](/docs/en/reference/runtime-helpers/node.js#arc.http) - added later in arc 4, and out of the box in Arc 5

### 4.x

Architect version 4 (Yeti) is here!

Things we added:

- `/public` for static assets
- `@http` routes
- complete docs overhaul
- new simpler install package `npm i @architect/architect`
- one repo [architect/architect](https://github.com/architect/architect)
- `@architect/functions` new APIs: `arc.http`, `arc.http.session` and `arc.http.helpers`

Things we removed:

- Statically bound Content-Type routes: `@html`, `@css`, `@js`, `@json`, `@text`, `@xml`
- `@architect/functions` interfaces: `arc.css`, `arc.js`, etc.


#### Upgrading to HTTP functions

HTTP functions are now completely dynamic and allow for either async/await or Node style errback signatures with **zero deps**.

Extremely new school style:

```javascript
exports.handler = async function http(request) {
  return {
    cors: true,
    type: 'application/javascript',
    body: JSON.stringify({hello:'world'})
  }
}
```

Extremely old school style:

```javascript
exports.handler = function http(request, context, callback) {
  callback(null, {
    cors: true,
    type: 'application/javascript',
    body: JSON.stringify({hello:'world'})
  })
}
```

Of course the `aws-sdk`, and `@architect/functions` and `@architect/data` are still available should you wish to opt into richer functionality. Session support is much more granular:

```javascript
let arc = require('@architect/functions')

exports.handler = async function http(request) {

  // read the session from DynamoDB
  let session = await arc.http.session.read(request)

  // mutate the session state
  session.like = (session.like || 0) + 1

  // write the session to DynamoDB and get a Set-Cookie string
  let cookie = await arc.http.session.write(session)

  // ensure the cookie gets updated on the client
  return {
    cookie,
    cors: true,
    type: 'application/javascript',
    body: JSON.stringify({hello:'world'})
  }
}

```

The old school express-style middleware is still available with `@architect/functions`:

```javascript
let arc = require('@architect/functions')
let url = arc.http.helpers.url

function log(req, res, next) {
  console.log('logger middleware:', JSON.stringify(req, null, 2))
  next()
}

function route(req, res) {
  res({
    html: `hello world from ${url(req.path)}`
  })
}

exports.handler = arc.http(log, route)
```

### 3.3.0

`@architect/workflows` added SQS support in `3.3.0` and existing apps will need to add permissions to the default `arc-role` IAM Role used for Lambda execution if they want to add `@queues`.

**Using the AWS Console**

1. Open up IAM in the AWS Console
2. Select **Roles** &rarr; **arc-role**
3. Click **Attach Policies**
4. Select **`AWSLambdaSQSQueueExecutionRole`**
5. Click **Attach Policy**

Now existing functions can publish to SQS queues.

**With the AWS CLI**

If the command line is more your style you can upgrade with the following:

```bash
aws iam attach-role-policy --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaSQSQueueExecutionRole --role-name arc-role
```

**With Node.js**

If you prefer to script this upgrade you can use the Node.js `aws-sdk`:

```javascript
let aws = require('aws-sdk')
let PolicyArn = 'arn:aws:iam::aws:policy/service-role/AWSLambdaSQSQueueExecutionRole'

let iam = new aws.IAM
iam.attachRolePolicy({
  RoleName: 'arc-role'
  PolicyArn,
}, console.log)
```

---

## Architect Functions

### Overview

`@architect/functions` runtime helper library is actively maintained. Version 5 is required for Architect 10+. Users on Architect 6 - 9 should continue to use Functions v4 (which will work in perpetuity, but not be separately maintained).

The Architect Functions module is now also available as a dependency for [Ruby](https://github.com/architect/arc-functions-ruby) and [Python](https://github.com/architect/arc-functions-python) functions.


### Changes

- `arc.http.express` was removed in February 2022, and we recommend using `@vendia/serverless-express` or `serverless-http` as replacement modules
- `arc.http.proxy` (previously `arc.proxy`) was deprecated in July 2021, and is now the standalone `@architect/asap` module
  - Its methods are functionally the same
- `arc.http.middleware` was deprecated in August 2019, and is now `arc.http.async`
  - These methods are functionally the same
- `arc.http.helpers.static` was deprecated in June 2019, and is now `arc.static`
  - These methods are functionally the same
  - Due to some under-the-hood changes, if you use `arc.http.helpers.static` or `arc.static`, you will need to upgrade to `@architect/functions` version `^3.3.4` (or greater) in Architect 6


### Does `@architect/functions` work in Architect 10+?

Yes! Version 5 is required to work correctly in Architect 10+.


### Does `@architect/functions` work in Architect 6 - 9?

Absolutely, version 4.x is supported by Arc 6 - 9, including use with HTTP API Lambda v2.0 payloads (introduced in Arc 7). However, version 5+ is incompatible with Arc 6 - 9.


### Will `@architect/functions` continue working in Architect 5?

Version 4.x remains largely compatible with Architect 5; version 5+ is no longer backward compatible with Architect 5 (support for which officially ended in July of 2021).

---

## Architect Data

As of the release of Architect 6, the **Architect Data module (`@architect/data`) is now deprecated**, and has been superseded by `@architect/functions` `tables()` method.


### Overview

`@architect/data` will no longer be maintained, and upgrading to Architect 6 will likely be a breaking change for `@architect/data` usage.


### Does `@architect/data` work in Architect 6?
No, this module was deprecated with the release of Architect 6.


### Will `@architect/data` continue working in Architect 5?
Yes. The lower-level AWS APIs within `@architect/data` are not expected to change in the near future, so indefinite use of `@architect/data` should be considered generally safe **if you choose not to upgrade to Architect 6**. That said, we strongly suggest you upgrade to receive the latest fixes, features, and updates.


### Upgrade path
If you built your `@architect/data` calls with `async/await`, `@architect/functions` `tables()` is largely a drop-in replacement. However, **if you are using callbacks, `@architect/functions` `tables()` is a breaking change.**


### Example of `@architect/data` &rarr; `@architect/functions` `tables()`

#### `@architect/data` before:
```javascript
// src/http/get-index/index.js

let data = require('@architect/data')

exports.handler = async () => {
  let body = await data.accounts.get({key:'foo'})
  return {body}
}
```


#### `@architect/functions` `tables()` after:
```javascript
// src/http/get-index/index.js

let {tables} = require('@architect/functions')

exports.handler = async () => {
  let data = await tables()
  let body = await data.accounts.get({key:'foo'})
  return {body}
}
```
