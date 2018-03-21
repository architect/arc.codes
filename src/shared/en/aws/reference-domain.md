# `@domain`

## `@domain` sets up DNS for a custom domain name.

For example, to create the domain [wut.click](https://wut.click):

```arc
@app
foobaz

@domain
wut.click

@html
get /
```

Running `npm run dns` will:

- Setup certificates with AWS Certificate Manager
- Create a DNS Recordset on Route 53
- Setup `staging` and `production` Domains in API Gateway
- Create corresponding Alias records in Route 53

> Also see [workflows](/reference/npm-run-scripts#arc-dns) for working with `@domain`

## Next: [Defining routes with `@html`](/reference/html)
