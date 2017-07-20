# @scheduled

> `@scheduled` functions are invoked at the times you specify

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
|-scheduled
| |-daily-update-buddy/
| '-friyay-only/
|-.arc
'-package.json
```

And the following deployment Lambdas:

- `testapp-staging-daily-update-buddy`
- `testapp-production-daily-update-buddy`
- `testapp-staging-friyay-only`
- `testapp-production-friyay-only`

## Next Steps

- Check out [`@tables`](/reference/tables)
