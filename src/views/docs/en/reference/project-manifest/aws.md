---
title: '<code>@aws</code>'
category: app.arc
description: Define AWS specific configuration.
---

Define AWS specific configuration for an entire project or [per function](../configuration/function-config#%40aws).

## Syntax

### `region`

[AWS region ID](https://docs.aws.amazon.com/general/latest/gr/rande.html) where the project will be deployed.
- Defaults to `us-west-2`


### `profile`

Local AWS profile name to use with this project, as defined in your [local AWS configuration](../../get-started/detailed-aws-setup#credentials).
- Can also be specified in `AWS_PROFILE` environment variable
- Required to deploy to AWS


### `runtime`

[Lambda runtime](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html), as defined by the [`lambda-runtimes`](https://github.com/architect/lambda-runtimes) library.

> Note: please refer to the [runtime support matrix](/docs/en/get-started/runtime-support) for local [Sandbox](../cli/sandbox) support

| Runtime | Versions                              | Example       | Alias<sup>1</sup>         |
|---------|---------------------------------------|---------------|---------------------------|
| Node.js | 20.x (default), 18.x, 16.x            | `nodejs20.x`  | `node` `nodejs` `node.js` |
| Python  | 3.12 (default), 3.11, 3.10, 3.9, 3.8  | `python3.12`  | `python` `py`             |
| Ruby    | 3.2 (default)                         | `ruby3.2`     | `ruby` `rb`               |
| .NET    | 6 (default), 7                        | `dotnet6`     | `dotnet` `.net`           |
| Java    | 21 (default), 17, 11, 8.al2, 11       | `java21`      | `java`                    |

1. Runtime aliases always use Architect's current default runtime version (e.g. `py` is effectively `python3.12`).


### `bucket`

Bucket name (in same region) for CloudFormation deployment artifacts.

If not specified, a secure deployment bucket will be automatically created.


### `policies`

Configure custom Lambda function `policies`, enabling granular and specific privileges and access controls.

The `policies` setting takes one or more IAM policy ARNs or AWS-managed policy names (e.g. `AmazonDynamoDBFullAccess`).

Configuring one or more policies will completely remove all of Architect's default Lambda privileges. To restore Architect's default privileges, include a policy named `architect-default-policies`.

> Note: `architect-default-policies` is an internal Architect framework setting based on the least-privilege permissions specific to your project. It is not a managed / public IAM policy, and will not be found in your AWS console.


### `layers`

Configure Lambda function `layers` with max 5 Lambda Layer ARNs. Lambda Layers must be in the same region as they are deployed.


### `architecture`

Lambda [CPU Architecture](https://docs.aws.amazon.com/lambda/latest/dg/foundation-arch.html) of your functions.
- `arm64` (default) - 64-bit ARM architecture
- `x86_64` - 64-bit x86 architecture


### `storage`

Lambda ephemeral storage (a "scratch" file system in `/tmp` for each Lambda). A number between `512` (default) - `10240` in MB.


### `apigateway`

API Gateway API type, can be one of:
- `http` (default) - `HTTP` API + Lambda payload format version 2.0
- `httpv2` – alias of `http`
- `httpv1` - `HTTP` API + Lambda payload format version 1.0 (aka `REST`)
- `rest` - `REST` API + original API Gateway payload format (note: only supported when using the [`plugin-rest-api`](https://github.com/architect/plugin-rest-api) plugin)

> Note: if configuring `apigateway rest` mode, you must use the `@architect/plugin-rest-api` in order to deploy your `REST` API to AWS


## Environment Variables

Alternatively, if you want a less granular approach, you can declare your preferred region and profile in your shell config like `.bashrc` ([more information here](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html)).

If you have AWS exports in your shell config and `@aws` specified in your `app.arc` project, the `@aws` section will win.


## Examples

For example, to deploy Ruby to the northern California AWS AZ, with your AWS `work` profile's credentials, and specific policies use:

<arc-viewer default-tab=arc>
<div slot=contents>

<arc-tab label=arc>
<h5>arc</h5>
<div slot=content>

```arc
@aws
runtime ruby
region us-west-1
profile work
storage 5000 # in MB
policies
  S3CrudPolicy
  architect-default-policies
```

</div>
</arc-tab>

<arc-tab label=json>
<h5>json</h5>
<div slot=content>

```json
{
  "aws": {
    "runtime": "ruby",
    "region": "us-west-1",
    "profile": "work",
    "storage": 5000,
    "policies": [
      "S3CrudPolicy",
      "architect-default-policies"
    ]
  }
}
```

</div>
</arc-tab>

<arc-tab label=yaml>
<h5>yaml</h5>
<div slot=content>

```yaml
---
aws:
  runtime: ruby
  region: us-west-1
  profile: work
  storage: 5000
  architecture: arm64
  policies:
      - S3CrudPolicy
      - architect-default-policies
```

</div>
</arc-tab>

</div>
</arc-viewer>

To deploy to Oregon AWS AZ with your AWS `default` profile's credential and a [custom Lambda runtime](https://docs.aws.amazon.com/lambda/latest/dg/runtimes-custom.html) (be sure to set `runtime` to `provided`), use:

```arc
@aws
region us-west-2
profile default
runtime provided
layers arn:aws:lambda:us-west-2:800406105498:layer:nsolid-node-10:6
```
