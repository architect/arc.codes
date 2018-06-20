# `@html`

## `@html` section defines HTTP routes that return `text/html` content

### Syntax
- Each route begins with `get` or `post` followed by the desired path
- Must have a `/` route defined
- Additional routes must include a leading slash
- Dashes and underscores are not allowed
- Must begin with a letter

### Additional bits
- Advised maximum of 100 characters
- Optional Express-style URL parameters denoted with colons (`:`)
- Currently only `GET` or `POST` methods are supported, [read more here](/intro/limits)

### Example

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

The `.arc` above generates the following functions:

```bash
/
├── html
│   ├── get-index/
│   ├── get-pages/
│   ├── get-pages-000dateID/
│   ├── get-contact/
│   └── post-contact/
├── .arc
└── package.json
```

Note: The route `/pages/:dateID` corresponding handler deliberately looks a bit weird with the triple `000`. This is so you can quickly differentiate URL params from URL parts. The Lambda deploy targets follow suit:

- `testapp-staging-get-pages-000dateID`
- `testapp-production-get-pages-000dateID`

## Next: [Defining routes with `@json`](/reference/json)
