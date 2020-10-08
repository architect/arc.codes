# `@proxy`

`@proxy` modifies `@http` to proxy to another website. This is useful for migrating from a legacy system.

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

---

## Next: [Scheduling functions with `@scheduled`](/reference/arc/scheduled)

