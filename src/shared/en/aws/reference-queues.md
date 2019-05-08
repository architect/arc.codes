# `@queues`

## `@queues` define SQS topics and Lambda handlers for them

### Syntax
- Lowercase alphanumeric string
- Maximum of 50 characters
- Dashes are allowed; underscores are not allowed
- Must begin with a letter

> ⚠️ Warning! This functionality is new with `@architect/workflows 3.3.0`. If you want to use `@queues` with apps **older than `3.3.0`** please follow this [upgrade guide](/guides/upgrade).

### Example

This `.arc` file defines two `@queues`:

```arc
@app
testapp

@queues
convert-image
publish-log
```

Which generates the corresponding code:

```bash
/
├── queues
│   ├── convert-image/
│   └── publish-log/
├── .arc
└── package.json
```

And the following deployment Lambdas:

- `testapp-staging-convert-image`
- `testapp-production-convert-image`
- `testapp-staging-publish-log`
- `testapp-production-publish-log`

---

## Next: [Scheduling functions with `@scheduled`](/reference/scheduled)
