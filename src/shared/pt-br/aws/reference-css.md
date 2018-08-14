<div style=background:papayawhip;padding:10px;border-radius:7px;>Esta tradução para o português ainda está incompleta!</div>

# `@css`

## `@css` section defines HTTP routes that return `text/css` content

### Syntax

- Routes must start with a leading slash
- Dashes and underscores are not allowed

### Additional bits

- Advised maximum of 100 characters
- Optional Express-style URL parameters denoted with colons (`:`)
- Currently only `GET` is supported, [read more here](/intro/limits)

### Example

This `.arc` file defines some typical CSS routes:

```arc
@app
testapp

@css
/css/index.css
/css/:page
```

The `.arc` above generates the following functions:

```bash
/
├── css
│   ├── get-css-index-css/
│   └── get-css-000page/
├── .arc
└── package.json
```

## Next: [Defining routes with `@json`](/reference/json)

