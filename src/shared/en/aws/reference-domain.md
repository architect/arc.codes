# `@domain`

## `@domain` defines and assigns a domain name to your app

### Syntax
- Standard domain characters and syntax
- Only use the FQDN
- Do not include protocol or path

### Example
For example, to create the domain [wut.click](https://wut.click):

```arc
@app
foobaz

@domain
wut.click

@html
get /
```

Running `npx dns` will:

- Setup certificates with AWS Certificate Manager
- Create a DNS Recordset on Route 53
- Setup `staging` and `production` Domains in API Gateway
- Create corresponding Alias records in Route 53

> Also see [workflows](/reference/arc-dns) for working with `@domain`

## Next: [Defining routes with `@html`](/reference/html)
