# `@js`

## `@js` section defines HTTP routes that return `text/javascript` content

### Syntax

- Routes must start with leading slash
- Dashes and underscores not allowed

### Additional bits

- Advised maximum of 100 characters
- Optional Express-style URL parameters denoted with colons (`:`)
- Currently only `GET` supported, [read more here](/intro/limits)

### Example

This `.arc` file defines some typical JS routes:

```arc
@app
testapp

@js
/js/index.js
/js/:page
```

The `.arc` above generates the following functions:

```bash
/
├── js
│   ├── get-js-index-js/
│   └── get-js-000page/
├── .arc
└── package.json
```

## Next: [Defining routes with `@css`](/reference/css)

