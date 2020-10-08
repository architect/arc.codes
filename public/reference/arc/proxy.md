# `@proxy`

`@proxy` enables HTTP request proxying to another website if the route requested doesn't match one defined in `@http`. This is useful for migrating from a legacy system.

> Note: it is necessary to define `@http` when using `@proxy`

### Example

This `app.arc` file defines `@proxy`:

```arc
@app
testapp

@http
get /api

@proxy
testing http://localhost:5555
staging https://qa.exmple.com
production https://exmple.com
```

In this example, `get` requests to `/api` would hit your Architect applications's handler, while all other methods and paths would be forwarded to `[qa.]example.com`.

---

## Next: [Creating SQS queues with `@queues`](/reference/arc/queues)
