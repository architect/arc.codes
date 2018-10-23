# `@domain`

## `@domain` defines and assigns a domain name to your app

### Syntax
- Standard domain characters and syntax
- Only use the FQDN
- Do not include protocol or path

### Example
For example, to create this domain:

```arc
@app
docs

@domain
arc.codes

@http
get /
```

Running `npx dns` will:

- Create a certificate request with AWS Certificate Manager
- Setup `staging` and `production` Domains in API Gateway

If you want to use Route53 name servers running `npx dns route53` will:

- Automatically setup a certificate on AWS Certificate Manager
- Create a Hosted Zone on Route 53
- Create corresponding Alias records in Route 53

> Also see [guide for custom DNS](/guides/custom-dns) for working with `@domain`

## Next: [Defining events with `@events`](/reference/events)
