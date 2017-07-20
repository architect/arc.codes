# @html

> `@html` section defines HTTP routes that return `text/html` content.

This `.arc` file defines some typical HTML routes:

```arc
@app
testapp

@html
get /
get /pages
get /pages/:dateID
get /contact
post /contact
```

`@html` routes:

- Must have an `/` route defined
- Must be either an HTTP `POST` or `GET`
- Can have Express style URL parameters

The `.arc` above generates the following functions:

```bash
/
|-html
| |-get-index/
| |-get-pages/
| |-get-pages-000dateID/
| |-get-contact/
| '-post-contact/
|-.arc
'-package.json
```

The route `/pages/:dateID` corosponding handler deliberately looks a bit weird with the triple `000` so you can quickly identify URL params from URL parts. The deployment lambdas targets follow suite:

- `testapp-staging-get-pages-000dateID`
- `testapp-production-get-pages-000dateID`

## Next Steps

- Check out [`@json`](/reference/json)
