# `npx config`

Scans local code for each function's individual `.arc-config` files and verifies the corresponding deployment Lambdas configuration.

The `.arc-config` file is an individual configuration manifest file that lives in the same folder as each Lambda it configures. This file is intended to be committed into your project git repository.

An example `.arc-config` file found at `src/http/get-api/.arc-config`:

```.arc
@aws
timeout 900
memory 512
runtime go1.x
```

- `timeout` is a number in seconds for the Lambda timeout; 900 seconds (15 minutes) is the current max
- `memory` memory, in MB, your Lambda function is given; the value must be a multiple of 64 MB
- `runtime` can be one of `nodejs8.10` (default), `python3.6`, `go1.x` or `dotnetcore2.1`

`npx config apply` applies `.arc-config` to the corresponding staging and production Lambdas.

### Config Management 

Some further notes and considerations:

- Currently the only options are `memory`, `timeout` and `runtime`
- Scoped under `@aws` so future configs can be added in a mostly cloud agnostic manner while retaining a minimal footprint on the actual business logic of your project code
