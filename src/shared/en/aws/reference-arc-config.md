# `npm run config`

Scans local code for `.arc-config` files and verifies the corosponding deployment Lambdas configuration. The `.arc-config` file is a configuration manifest file that lives in the same folder as each lambda it configures. This file is intended to be commited into your project git repository.

An example `.arc-config` file:
```.arc
@aws
timeout 30000
memory 512
```

- `timeout` is a number in seconds for the Lambda timeout
- `memory` The amount of memory, in MB, your Lambda function is given; the value must be a multiple of 64 MB

To use `npm run config`, add the following to your project's `package.json` scripts:

```json
{
  "scripts": {
    "config": "AWS_PROFILE={profile} AWS_REGION={region} arc-config"
  }
}
```

`npm run config apply` applies `.arc-config` to the corresponding staging and production Lambdas.

> Reminder: All `arc` npm run scripts require `AWS_PROFILE` and `AWS_REGION` environment variables set. Learn more in the [Prerequisites guide](/quickstart).

### Config Management 

Some further notes and considerations:

- Curently the only options are `memory` and `timeout` (but the only remaining option would be `runtime`)
- Scoped under `@aws` so future configs can be added in a mostly cloud agnostic manner while retaining a minimal footprint on the actual business logic of your project code
