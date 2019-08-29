# `.arc-config`
## Configure individual Lambda function properties

- `runtime` - Officially supported: one of `nodejs10.x`, `nodejs8.10`, `python3.7`, `python3.6`, or `ruby2.5`
  - Also configurable, but not officially supported by Architect: `java8`, `go1.x`, `dotnetcore2.1`
- `memory` - number, between 128 MB and 3008 MB in 64 MB increments
  - Memory size also directly correlates with CPU speed; higher memory levels are available in more capable Lambda clusters
- `timeout` - number, in seconds (max 900)
- `concurrency` - number, `0` to AWS account maximum (if not present, concurrency is unthrottled)
- `layers` - Lambda layer ARNs (must be in the same region as deployed)
- `policies` - Additional Lambda role policy ARNs

Read more about the [Lambda limits](https://docs.aws.amazon.com/lambda/latest/dg/limits.html) and [resource model](https://docs.aws.amazon.com/lambda/latest/dg/resource-model.html).

```arc
@aws
runtime python3.7
memory 256
timeout 3
concurrency 1
layers {ARN}
policies {ARN}
```

---

## Next: [Setup AWS region & profile with `@aws`](/reference/aws)
