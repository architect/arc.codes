# `@queues`

## `@queues` define SQS topics and Lambda handlers for them

### Syntax
- Lowercase alphanumeric string
- Maximum of 50 characters
- Dashes are allowed; underscores are not allowed
- Must begin with a letter

> ⚠️ Warning! This functionality is new with `@architect/workflows 3.3.0`. If you want to use `@queues` with apps **older than `3.3.0`** please follow this [upgrade guide](/guides/upgrade).

### Example

This `app.arc` file defines two `@queues`:

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
├── app.arc
└── package.json
```

---

## Next: [Scheduling functions with `@scheduled`](/reference/arc/scheduled)
