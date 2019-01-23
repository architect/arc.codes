# `@scheduled`

## `@scheduled` functions are invoked at specified times

### Syntax
- Lowercase alphanumeric string
- Maximum of 20 characters
- Dashes are allowed; underscores are not allowed
- Must begin with a letter
- Followed by a valid `rate` or `cron` expression ([more info here](https://docs.aws.amazon.com/lambda/latest/dg/tutorial-scheduled-events-schedule-expressions.html))

### Example

This `.arc` file defines some scheduled functions:

```arc
@app
testapp

@scheduled
daily-update-buddy rate(1 day)
friyay-only cron(0 15 ? * FRI *)
```

Which generates the following code:

```bash
/
├── scheduled
│   ├── daily-update-buddy/
│   └── friyay-only/
├── .arc
└── package.json
```

And the following deployment Lambdas:

- `testapp-staging-daily-update-buddy`
- `testapp-production-daily-update-buddy`
- `testapp-staging-friyay-only`
- `testapp-production-friyay-only`

## Next: [Creating `@static` asset buckets](/reference/static)
