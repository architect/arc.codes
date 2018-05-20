# `@text`

## `@text` section defines HTTP routes that return `text/plain` content

### Syntax

- Routes must start with leading slash
- Dashes and underscores not allowed

### Additional bits

- Advised maximum of 100 characters
- Optional Express-style URL parameters denoted with colons (`:`)
- Currently only `GET` supported, [read more here](/intro/limits)

### Example

This `.arc` file defines some typical text routes:

```arc
@app
testapp

@text
/robots.txt
/humans.txt
```

The `.arc` above generates the following functions:

```bash
/
├── text
¦   ├── get-robots-txt/
│   └── get-humans-txt/
├── .arc
└── package.json
```

## Next: [Defining routes with `@html`](/reference/html)
