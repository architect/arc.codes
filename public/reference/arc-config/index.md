# `.arc-config`
## Configure individual Lambda function properties

- `concurrency` 0 to AWS account maximum (if not present concurrency is unthrottled)
- `layers` Lambda layer arns
- `timeout` seconds (max 900)
- `memory` between 128 MB and 3008 MB in 64 MB increments
- `policies` additional Lambda role policies 

Read more about the <a href=https://docs.aws.amazon.com/lambda/latest/dg/limits.html>Lambda limits</a> and <a href=https://docs.aws.amazon.com/lambda/latest/dg/resource-model.html>resource model</a>.

```arc
@aws
concurrency 1
layers arn
timeout 3
memory 256
```

---

## Next: [Setup AWS region & profile with `@aws`](/reference/aws)
